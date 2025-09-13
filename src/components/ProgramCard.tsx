import React from 'react';
import { MapPin, Users, Calendar, Clock } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useNavigate } from 'react-router-dom';

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

interface ProgramCardProps {
  program: Program;
  onApply?: (programId: string) => void;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ program, onApply }) => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  
  const getStatusColor = () => {
    if (program.status === 'Closed') {
      return 'bg-red-500';
    }
    return program.isUrgent ? 'bg-orange-500' : 'bg-green-500';
  };

  const getTimeColor = () => {
    return program.isUrgent ? 'text-red-500' : 'text-primarycolor-500';
  };

  return (
    <div className={`p-4 rounded-lg border transition-all hover:shadow-md ${
      isDark ? 'bg-primarycolor-900 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className={`text-base font-semibold mb-1 ${
            isDark ? 'text-primarycolor-400' : 'text-primarycolor-600'
          }`}>
            {program.title}
          </h3>
          <p className={`text-sm font-medium ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {program.institution}
          </p>
        </div>
        <span className={`px-2 py-1 rounded-full text-white text-xs ${getStatusColor()}`}>
          {program.status}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2">
          <MapPin className={`w-4 h-4 ${isDark ? 'text-secondarycolor-400' : 'text-secondarycolor-600'}`} />
          <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {program.location}
          </span>
          <Users className={`w-4 h-4 ml-4 ${isDark ? 'text-primarycolor-400' : 'text-primarycolor-600'}`} />
          <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {program.seatsRemain} seats remain
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Calendar className={`w-4 h-4 ${isDark ? 'text-secondarycolor-400' : 'text-secondarycolor-600'}`} />
          <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {program.deadline}
          </span>
          <Clock className={`w-4 h-4 ml-4 ${getTimeColor()}`} />
          <span className={`text-sm ${getTimeColor()}`}>
            {program.timeToClose}
          </span>
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => onApply?.(program.id)}
          disabled={program.status === 'Closed'}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
            program.status === 'Closed'
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primarycolor-600 text-white hover:bg-primarycolor-700'
          }`}
        >
          Apply Now
        </button>
        <button 
          onClick={() => navigate(`/program-details/${program.id}`)}
          className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
            isDark 
              ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Learn More
        </button>
      </div>
    </div>
  );
};

export default ProgramCard;