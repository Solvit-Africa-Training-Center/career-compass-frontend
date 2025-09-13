import React, { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import ProgramCard from './ProgramCard';
import { useTheme } from '@/hooks/useTheme';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { ProgramsDashboardAnalytics } from './Analytics';

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
}

interface ProgramsListProps {
  title?: string;
  programs?: Program[];
  onApply?: (programId: string) => void;
}

const mockPrograms: Program[] = [
  {
    id: '1',
    title: 'Computer Science',
    institution: 'Massachusetts Institute of Technology',
    location: 'Boston, MA, USA',
    seatsRemain: 120,
    deadline: '12,Sept,2026',
    timeToClose: '2 months to close',
    status: 'Open'
  },
  {
    id: '2',
    title: 'Data Science',
    institution: 'Stanford University',
    location: 'Stanford, CA, USA',
    seatsRemain: 85,
    deadline: '15,Oct,2026',
    timeToClose: '23 hours to close',
    status: 'Open',
    isUrgent: true
  },
  {
    id: '3',
    title: 'Software Engineering',
    institution: 'Carnegie Mellon University',
    location: 'Pittsburgh, PA, USA',
    seatsRemain: 95,
    deadline: '20,Nov,2026',
    timeToClose: '3 months to close',
    status: 'Open'
  },
  {
    id: '4',
    title: 'Artificial Intelligence',
    institution: 'University of California Berkeley',
    location: 'Berkeley, CA, USA',
    seatsRemain: 0,
    deadline: '01,Aug,2026',
    timeToClose: 'Closed',
    status: 'Closed'
  },
  {
    id: '5',
    title: 'Cybersecurity',
    institution: 'Georgia Institute of Technology',
    location: 'Atlanta, GA, USA',
    seatsRemain: 150,
    deadline: '30,Dec,2026',
    timeToClose: '4 months to close',
    status: 'Open'
  },
  {
    id: '6',
    title: 'Machine Learning',
    institution: 'University of Washington',
    location: 'Seattle, WA, USA',
    seatsRemain: 75,
    deadline: '10,Jan,2027',
    timeToClose: '5 months to close',
    status: 'Open'
  },
  // {
  //   id: '7',
  //   title: 'Machine Learning',
  //   institution: 'University of Washington',
  //   location: 'Seattle, WA, USA',
  //   seatsRemain: 75,
  //   deadline: '10,Jan,2027',
  //   timeToClose: '5 months to close',
  //   status: 'Open'
  // },
];

const ProgramsList: React.FC<ProgramsListProps> = ({ 
  title = "Programs related to your interest",
  programs = mockPrograms,
  onApply
}) => {
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 8;

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {paginatedPrograms.map((program) => (
          <ProgramCard 
            key={program.id} 
            program={program} 
            onApply={onApply}
          />
        ))}
      </div>

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

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
            ))}

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