import React from 'react';
import { StatCardData } from '@/types';
import { useTheme } from '@/hooks/useTheme';

interface StatCardProps {
  data: StatCardData;
}

const getIconComponent = (iconType: string, color: string) => {
  const iconClass = `w-8 h-8 ${
    color === 'yellow' ? 'text-yellow-600' :
    color === 'green' ? 'text-green-600' :
    color === 'red' ? 'text-red-600' :
    'text-blue-600'
  }`;

  switch (iconType) {
    case 'applications':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    case 'eligibility':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'deadlines':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'programs':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      );
    default:
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      );
  }
};

const StatCard: React.FC<StatCardProps> = ({ data }) => {
  const { title, value, change, changeType, icon, color } = data;
  const { isDark } = useTheme();
  const valueColorClass = 
    color === 'yellow' ? 'text-yellow-600' :
    color === 'green' ? 'text-green-600' :
    color === 'red' ? 'text-red-600' :
    'text-blue-600';

  const changeColorClass = changeType === 'increase' ? 'text-green-600' : 
                          changeType === 'decrease' ? 'text-red-600' : 
                          'text-gray-600';

  return (
    
    <div className={`p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow duration-200 ${isDark ? 'bg-primarycolor-900 border-gray-700' : 'bg-white border-gray-100'}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{title}</h3>
          <div className={`text-3xl font-bold ${valueColorClass} mb-2`}>
            {value}
          </div>
          <p className={`text-sm font-medium ${changeColorClass}`}>
            {change}
          </p>
        </div>
        <div className="ml-4">
          {getIconComponent(icon, color)}
        </div>
      </div>
    </div>
  );
};

export default StatCard;