import React from 'react';
import type { DeadlineItem } from '@/types';
import { useTheme } from '@/hooks/useTheme';

interface DeadlineCardProps {
  deadline: DeadlineItem;
}

const DeadlineCard: React.FC<DeadlineCardProps> = ({ deadline }) => {
  const { title, subtitle, daysLeft, priority } = deadline;
  const { isDark } = useTheme();

  const getPriorityStyles = () => {
    switch (priority) {
      case 'urgent':
        return {
          badge: 'bg-red-100 text-red-800',
          text: 'Urgent'
        };
      case 'important':
        return {
          badge: 'bg-yellow-100 text-yellow-800',
          text: 'Important'
        };
      default:
        return {
          badge: 'bg-gray-100 text-gray-800',
          text: 'Normal'
        };
    }
  };

  const priorityStyles = getPriorityStyles();

  return (
    <div className={`p-4 border rounded-lg transition-colors duration-200 ${
      isDark ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'
    }`}>
      <div className="flex items-start justify-between mb-2">
        <span className={`px-2 py-1 text-xs font-medium rounded-md ${priorityStyles.badge}`}>
          {priorityStyles.text}
        </span>
        <span className={`text-sm ${
          isDark ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {daysLeft === 1 ? '1 day left' : `${daysLeft} days left`}
        </span>
      </div>
      <h4 className={`font-medium mb-1 ${
        isDark ? 'text-white' : 'text-gray-900'
      }`}>{title}</h4>
      <p className={`text-sm ${
        isDark ? 'text-gray-400' : 'text-gray-500'
      }`}>{subtitle}</p>
    </div>
  );
};

export default DeadlineCard;