import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import ProgramCard from './ProgramCard';
import { useTheme } from '@/hooks/useTheme';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { ProgramsDashboardAnalytics } from './Analytics';
import CallApi from '@/utils/callApi';
import { backend_path } from '@/utils/enum';
import { toast } from 'sonner';

interface Program {
  id: string;
  title: string;
  institution: string;
  location: string;
  seatsRemain: number;
  deadline: string;
  timeToClose: string;
  status: 'Open' | 'Closed';
  isUrgent?: boolean;
  duration?: string;
  level?: string;
  language?: string;
  description?: string;
  institutionWebsite?: string;
}

// Backend API types based on provided schemas
interface ProgramApi {
  id: string;
  institution_id: string;
  name: string;
  description: string;
  duration: number;
  language: string;
  is_active: boolean;
  institution: string;
}

interface InstitutionApi {
  id: string;
  official_name: string;
  aka: string;
  type: string;
  country: string;
  website: string;
  is_verified: boolean;
  is_active: boolean;
}

interface IntakeApi {
  id: string;
  program_id: string;
  start_month: string;
  application_deadline: string; // e.g. 2025-09-23
  seats: number;
  is_open: boolean;
  is_active: boolean;
  program: string;
}

interface CampusApi {
  id: number;
  name: string;
  city: string;
  address: string;
  is_active: boolean;
  institution: string; // institution id (uuid)
}

interface ProgramsListProps {
  title?: string;
  programs?: Program[];
  onApply?: (programId: string) => void;
}

const ProgramsList: React.FC<ProgramsListProps> = ({ 
  title = "Programs related to your interest",
  programs: propPrograms,
  onApply
}) => {
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 8;

  useEffect(() => {
    if (propPrograms) {
      setPrograms(propPrograms);
      setLoading(false);
    } else {
      fetchPrograms();
    }
  }, [propPrograms]);

  const getTimeMeta = (deadlineIso?: string, isOpen?: boolean) => {
    if (!deadlineIso || !isOpen) return { status: 'Closed' as const, timeToClose: 'Closed', isUrgent: false };
    const deadline = new Date(deadlineIso);
    const now = new Date();
    const msLeft = deadline.getTime() - now.getTime();
    const daysLeft = Math.ceil(msLeft / (1000 * 3600 * 24));
    if (daysLeft <= 0) return { status: 'Closed' as const, timeToClose: 'Closed', isUrgent: false };
    let timeToClose = '';
    let isUrgent = false;
    if (daysLeft <= 7) {
      timeToClose = `${daysLeft} days to close`;
      isUrgent = true;
    } else if (daysLeft <= 30) {
      timeToClose = `${Math.ceil(daysLeft / 7)} weeks to close`;
    } else {
      timeToClose = `${Math.ceil(daysLeft / 30)} months to close`;
    }
    return { status: 'Open' as const, timeToClose, isUrgent };
  };

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const [programsRes, intakesRes, institutionsRes, campusesRes] = await Promise.all([
        CallApi.get(backend_path.GET_PROGRAM),
        CallApi.get(backend_path.GET_PROGRAM_INTAKE),
        CallApi.get(backend_path.GET_INSTITUTION),
        CallApi.get(backend_path.GET_CAMPUS)
      ]);

      const programsData: ProgramApi[] = (programsRes.data.results || programsRes.data || []) as ProgramApi[];
      const intakesData: IntakeApi[] = (intakesRes.data.results || intakesRes.data || []) as IntakeApi[];
      const institutionsData: InstitutionApi[] = (institutionsRes.data.results || institutionsRes.data || []) as InstitutionApi[];
      const campusesData: CampusApi[] = (campusesRes.data.results || campusesRes.data || []) as CampusApi[];

      const institutionById = new Map<string, InstitutionApi>();
      institutionsData.forEach(i => institutionById.set(i.id, i));

      const intakesByProgram = new Map<string, IntakeApi[]>();
      intakesData.forEach(intake => {
        const pid = intake.program_id || intake.program;
        if (!pid) return;
        const list = intakesByProgram.get(pid) || [];
        list.push(intake);
        intakesByProgram.set(pid, list);
      });
      // sort intakes per program by application_deadline desc (latest first)
      intakesByProgram.forEach(list => list.sort((a, b) => new Date(b.application_deadline).getTime() - new Date(a.application_deadline).getTime()));

      const campusesByInstitution = new Map<string, CampusApi[]>();
      campusesData.forEach(c => {
        const list = campusesByInstitution.get(c.institution) || [];
        list.push(c);
        campusesByInstitution.set(c.institution, list);
      });

      const transformed: Program[] = programsData.map(p => {
        const institution = institutionById.get(p.institution_id) || null;
        const programIntakes = intakesByProgram.get(p.id) || [];
        const latestIntake = programIntakes[0];
        const { status, timeToClose, isUrgent } = getTimeMeta(latestIntake?.application_deadline, latestIntake?.is_open);
        const seatsRemain = latestIntake?.seats ? Number(latestIntake.seats) : 0;
        const deadlineText = latestIntake?.application_deadline
          ? new Date(latestIntake.application_deadline).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
          : 'N/A';
        const institutionName = institution?.official_name || institution?.aka || 'Unknown Institution';
        const campusCity = (campusesByInstitution.get(p.institution_id) || [])[0]?.city;
        const location = campusCity || institution?.country || 'Unknown Location';

        return {
          id: p.id,
          title: p.name,
          institution: institutionName,
          location,
          seatsRemain,
          deadline: deadlineText,
          timeToClose,
          status,
          isUrgent,
          duration: p.duration != null ? String(p.duration) : undefined,
          language: p.language,
          description: p.description,
          institutionWebsite: institution?.website || undefined
        };
      });

      setPrograms(transformed);
    } catch (error) {
      console.error('Error fetching programs:', error);
      toast.error('Failed to load programs');
    } finally {
      setLoading(false);
    }
  };

  const filteredPrograms = useMemo(() => {
    return programs.filter(program => 
      program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.institution.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [programs, searchQuery]);

  const totalPages = Math.ceil(filteredPrograms.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPrograms = filteredPrograms.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
    <div className='space-y-6'>
      <ProgramsDashboardAnalytics />
      <div className="space-y-7 border rounded-2xl p-6">
              
      
      <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </h1>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between ">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'
            }`}
          />
        </div>
        
        <div className="flex gap-3">
          <button className={`px-4 py-2 border rounded-lg flex items-center gap-2 ${
            isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'
          }`}>
            Actions
          </button>
          
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 border rounded-lg flex items-center gap-2 ${
              isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className={`p-4 rounded-lg border ${
          isDark ? 'bg-primarycolor-900 border-gray-700' : 'bg-gray-50 border-gray-200'
        }`}>
          <h3 className={`font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Category
          </h3>
          <div className="space-y-2">
            {['University', 'Program', 'Duration'].map((filter) => (
              <label key={filter} className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                  {filter}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Programs Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className={`p-4 rounded-lg border animate-pulse ${
              isDark ? 'bg-primarycolor-900 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-4"></div>
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-4"></div>
              <div className="flex space-x-2">
                <div className="flex-1 h-8 bg-gray-300 rounded"></div>
                <div className="w-20 h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : paginatedPrograms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
          {paginatedPrograms.map((program) => (
            <ProgramCard 
              key={program.id} 
              program={program} 
              onApply={onApply}
            />
          ))}
        </div>
      ) : (
        <div className={`text-center py-12 ${
          isDark ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <p className="text-lg mb-2">No programs found</p>
          <p className="text-sm">Try adjusting your search criteria</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) setCurrentPage(currentPage - 1);
                }}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

            {/* First page */}
            {currentPage > 3 && (
              <>
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(1);
                    }}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
                {currentPage > 4 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
              </>
            )}

            {/* Current page and neighbors */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
              if (page > totalPages) return null;
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(page);
                    }}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            {/* Last page */}
            {currentPage < totalPages - 2 && (
              <>
                {currentPage < totalPages - 3 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(totalPages);
                    }}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                }}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
    </div>
    </>
  );
};

export default ProgramsList;