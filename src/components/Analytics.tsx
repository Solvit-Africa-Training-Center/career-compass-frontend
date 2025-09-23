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
export const StudentDashboardAnalytics: React.FC<Partial<AnalyticsProps>> = (props) => {
  const [studentStats, setStudentStats] = React.useState(defaultStudentStats);
  const [realDeadlines, setRealDeadlines] = React.useState<DeadlineItem[]>([]);

  React.useEffect(() => {
    const fetchStudentStats = async () => {
      try {
        const [programsRes, intakesRes] = await Promise.all([
          CallApi.get(backend_path.GET_PROGRAM),
          CallApi.get(backend_path.GET_PROGRAM_INTAKE)
        ]);
        
        const programs = programsRes.data || [];
        const intakes = intakesRes.data || [];
        
        const openIntakes = intakes.filter((intake: any) => intake.is_open);
        const upcomingDeadlines = intakes.filter((intake: any) => {
          const deadline = new Date(intake.application_deadline);
          return intake.is_open && deadline > new Date();
        });
        
        setStudentStats([
          {
            title: 'Available Programs',
            value: programs.length.toString(),
            change: '',
            changeType: 'neutral',
            icon: 'applications',
            color: 'yellow'
          },
          {
            title: 'Open Applications',
            value: openIntakes.length.toString(),
            change: '',
            changeType: 'neutral',
            icon: 'eligibility',
            color: 'green'
          },
          {
            title: 'Upcoming Deadlines',
            value: upcomingDeadlines.length.toString(),
            change: '',
            changeType: 'neutral',
            icon: 'deadlines',
            color: 'red'
          }
        ]);
        
        const deadlineItems = upcomingDeadlines
          .sort((a: any, b: any) => new Date(a.application_deadline).getTime() - new Date(b.application_deadline).getTime())
          .slice(0, 3)
          .map((intake: any) => {
            const deadline = new Date(intake.application_deadline);
            const daysLeft = Math.ceil((deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            const program = programs.find((p: any) => p.id === intake.program);
            
            return {
              id: intake.id,
              title: program?.name || 'Unknown Program',
              subtitle: 'Application Deadline',
              daysLeft,
              priority: daysLeft <= 7 ? 'urgent' : daysLeft <= 14 ? 'important' : 'normal'
            };
          });
        
        setRealDeadlines(deadlineItems);
      } catch (error) {
        console.error('Error fetching student stats:', error);
      }
    };

    fetchStudentStats();
  }, []);

  return (
    <Analytics 
      stats={studentStats}
      deadlines={realDeadlines}
      showDeadlines={true}
      {...props}
    />
  );
};

export const ProgramsDashboardAnalytics: React.FC<Partial<AnalyticsProps>> = (props) => {
  const [programStats, setProgramStats] = React.useState(defaultProgramStats);

  React.useEffect(() => {
    const fetchProgramStats = async () => {
      try {
        const [programsRes, intakesRes] = await Promise.all([
          CallApi.get(backend_path.GET_PROGRAM),
          CallApi.get(backend_path.GET_PROGRAM_INTAKE)
        ]);
        
        const programs = programsRes.data || [];
        const intakes = intakesRes.data || [];
        
        const totalPrograms = programs.length;
        const openIntakes = intakes.filter((intake: any) => intake.is_open);
        const totalSeats = intakes.reduce((sum: number, intake: any) => 
          sum + (intake.seats || 0), 0
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
            title: 'Open Intakes',
            value: openIntakes.length.toString(),
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