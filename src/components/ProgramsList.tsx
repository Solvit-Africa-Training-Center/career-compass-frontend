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
import CallApi from '@/utils/CallApi';
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
}

interface BackendProgram {
  id: number;
  name: string;
  description: string;
  duration: string;
  language: string;
  level: string;
  institution: {
    id: number;
    name: string;
    location: string;
  };
  campuses: Array<{
    id: number;
    name: string;
    location: string;
  }>;
  intakes: Array<{
    id: number;
    intake_date: string;
    deadline: string;
    available_seats: number;
    status: string;
  }>;
}

interface ProgramsListProps {
  title?: string;
  programs?: Program[];
  onApply?: (programId: string) => void;
}

const transformBackendProgram = (backendProgram: BackendProgram): Program => {
  const latestIntake = backendProgram.intakes?.[0] || {};
  const deadline = new Date(latestIntake.deadline || '');
  const now = new Date();
  const timeDiff = deadline.getTime() - now.getTime();
  const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
  let timeToClose = 'Closed';
  let isUrgent = false;
  let status: 'Open' | 'Closed' = 'Closed';
  
  if (latestIntake.status === 'open' && daysLeft > 0) {
    status = 'Open';
    if (daysLeft <= 7) {
      timeToClose = `${daysLeft} days to close`;
      isUrgent = true;
    } else if (daysLeft <= 30) {
      timeToClose = `${Math.ceil(daysLeft / 7)} weeks to close`;
    } else {
      timeToClose = `${Math.ceil(daysLeft / 30)} months to close`;
    }
  }
  
  return {
    id: backendProgram.id.toString(),
    title: backendProgram.name,
    institution: backendProgram.institution?.name || 'Unknown Institution',
    location: backendProgram.campuses?.[0]?.location || backendProgram.institution?.location || 'Unknown Location',
    seatsRemain: latestIntake.available_seats || 0,
    deadline: deadline.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
    timeToClose,
    status,
    isUrgent,
    duration: backendProgram.duration,
    level: backendProgram.level,
    language: backendProgram.language,
    description: backendProgram.description
  };
};

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

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const response = await CallApi.get(backend_path.GET_PROGRAM);
      const backendPrograms: BackendProgram[] = response.data.results || response.data;
      const transformedPrograms = backendPrograms.map(transformBackendProgram);
      setPrograms(transformedPrograms);
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