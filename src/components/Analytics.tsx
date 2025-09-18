import React from 'react';
import StatCard from '@/components/cards/StatCard';
import DeadlineCard from './DeadlineCard';
import type { AnalyticsProps, StatCardData, DeadlineItem } from '@/types/';
import { useTheme } from '@/hooks/useTheme';
import CallApi from '@/utils/callApi';
import { backend_path } from '@/utils/enum';

// Default data for the first dashboard
const defaultStudentStats: StatCardData[] = [
  {
    title: 'Applications',
    value: '12',
    change: '+2 this week',
    changeType: 'increase',
    icon: 'applications',
    color: 'yellow'
  },
  {
    title: 'Eligibility score',
    value: '92%',
    change: '+2 this week',
    changeType: 'increase',
    icon: 'eligibility',
    color: 'green'
  },
  {
    title: 'Deadlines',
    value: '12',
    change: '+2 this week',
    changeType: 'increase',
    icon: 'deadlines',
    color: 'red'
  }
];

const defaultDeadlines: DeadlineItem[] = [
  {
    id: '1',
    title: 'Africa Leadership University',
    subtitle: 'Document Submission',
    daysLeft: 3,
    priority: 'urgent'
  },
  {
    id: '2',
    title: 'Africa Leadership University',
    subtitle: 'Tuition payment',
    daysLeft: 7,
    priority: 'important'
  }
];

// Default data for the programs dashboard
const defaultProgramStats: StatCardData[] = [
  {
    title: 'Total Programs',
    value: '0',
    change: '',
    changeType: 'neutral',
    icon: 'applications',
    color: 'yellow'
  },
  {
    title: 'Open Programs',
    value: '0',
    change: '',
    changeType: 'neutral',
    icon: 'eligibility',
    color: 'green'
  },
  {
    title: 'Available Seats',
    value: '0',
    change: '',
    changeType: 'neutral',
    icon: 'programs',
    color: 'red'
  }
];

const Analytics: React.FC<AnalyticsProps> = ({ 
  stats = defaultStudentStats, 
  deadlines = defaultDeadlines, 
  showDeadlines = true,
  className = ''
}) => {
  const { isDark } = useTheme();
  
  return (
    <div className={`space-y-6 ${className} ${
              isDark ? 'bg-primarycolor-900 border-gray-700' : 'bg-white border-gray-100'
            }`}>
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Stats Grid */}
        <div className={`xl:col-span-3 ${
              isDark ? 'bg-primarycolor-900 border-gray-700' : 'bg-white border-gray-100'
            }`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <StatCard key={index} data={stat} />
            ))}
          </div>
        </div>

        {/* Deadlines Section */}
        {showDeadlines && deadlines.length > 0 && (
          <div className="xl:col-span-1">
            <div className={`p-6 rounded-xl shadow-sm border ${
              isDark ? 'bg-primarycolor-900 border-gray-700' : 'bg-white border-gray-100'
            }`}>
              <div className="flex flex-col mb-4 text-center">
                <h2 className={`text-lg font-semibold ${
                  isDark ? 'text-secondarycolor-300' : 'text-secondarycolor-300'
                }`}>Upcoming Deadlines</h2>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>Don't miss important dates</p>
              </div>
              <div className="space-y-3">
                {deadlines.map((deadline) => (
                  <DeadlineCard key={deadline.id} deadline={deadline} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Export preset configurations
export const StudentDashboardAnalytics: React.FC<Partial<AnalyticsProps>> = (props) => (
  <Analytics 
    stats={defaultStudentStats}
    deadlines={defaultDeadlines}
    showDeadlines={true}
    {...props}
  />
);

export const ProgramsDashboardAnalytics: React.FC<Partial<AnalyticsProps>> = (props) => {
  const [programStats, setProgramStats] = React.useState(defaultProgramStats);

  React.useEffect(() => {
    const fetchProgramStats = async () => {
      try {
        const response = await CallApi.get(backend_path.GET_PROGRAM);
        const programs = response.data.results || response.data;
        
        const totalPrograms = programs.length;
        const openPrograms = programs.filter((p: any) => 
          p.intakes?.some((intake: any) => intake.status === 'open')
        ).length;
        const totalSeats = programs.reduce((sum: number, p: any) => 
          sum + (p.intakes?.reduce((intakeSum: number, intake: any) => 
            intakeSum + (intake.available_seats || 0), 0) || 0), 0
        );

        setProgramStats([
          {
            title: 'Total Programs',
            value: totalPrograms.toString(),
            change: '',
            changeType: 'neutral',
            icon: 'applications',
            color: 'yellow'
          },
          {
            title: 'Open Programs',
            value: openPrograms.toString(),
            change: '',
            changeType: 'neutral',
            icon: 'eligibility',
            color: 'green'
          },
          {
            title: 'Available Seats',
            value: totalSeats.toString(),
            change: '',
            changeType: 'neutral',
            icon: 'programs',
            color: 'red'
          }
        ]);
      } catch (error) {
        console.error('Error fetching program stats:', error);
      }
    };

    fetchProgramStats();
  }, []);

  return (
    <Analytics 
      stats={programStats}
      deadlines={[]}
      showDeadlines={false}
      {...props}
    />
  );
};

export default Analytics;