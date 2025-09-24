import { StudentDashboardAnalytics } from "@/components/Analytics";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { useState, useEffect } from "react";
import CallApi from "@/utils/callApi";
import { backend_path } from "@/utils/enum";
import { toast } from "sonner";
import { Calendar, BookOpen, TrendingUp, Clock, MapPin, GraduationCap, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Link } from "react-router-dom";

interface Program {
  id: string;
  name: string;
  institution_name?: string;
  duration: string;
  language: string;
}

interface ProgramIntake {
  id: string;
  program: string;
  start_month: string;
  application_deadline: string;
  seats: number;
  is_open: boolean;
}

const StudentDashboard = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [intakes, setIntakes] = useState<ProgramIntake[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const { authUser } = useAuth();
  const { isDark } = useTheme();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [programsRes, intakesRes] = await Promise.all([
        CallApi.get(backend_path.GET_PROGRAM),
        CallApi.get(backend_path.GET_PROGRAM_INTAKE)
      ]);
      
      setPrograms(programsRes.data || []);
      setIntakes(intakesRes.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getUpcomingDeadlines = () => {
    const now = new Date();
    return intakes
      .filter(intake => intake.is_open && new Date(intake.application_deadline) > now)
      .sort((a, b) => new Date(a.application_deadline).getTime() - new Date(b.application_deadline).getTime())
      .slice(0, 3);
  };

  const getProgramName = (programId: string) => {
    const program = programs.find(p => p.id === programId);
    return program?.name || 'Unknown Program';
  };

  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const getEventsForDate = (date: Date) => {
    return intakes.filter(intake => {
      const deadlineDate = new Date(intake.application_deadline);
      return deadlineDate.toDateString() === date.toDateString() && intake.is_open;
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  if (!authUser) {
    return null;
  }
  
  const userName = authUser.email.split("@")[0] || "User";

  const upcomingDeadlines = getUpcomingDeadlines();
  const openIntakes = intakes.filter(intake => intake.is_open).length;
  const totalPrograms = programs.length;

  return (
    <div className={`space-y-8 p-6 ${
      isDark ? "bg-primarycolor-900" : "bg-neutralcolor-50"
    }`}>
      {/* Welcome Section */}
      <div className={`rounded-2xl p-8 ${
        isDark ? 'bg-primarycolor-800 border border-primarycolor-700' : 'bg-white border border-neutralcolor-200'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold ${
              isDark ? "text-neutralcolor-50" : "text-primarycolor-800"
            }`}>
              Welcome back, <span className="text-primarycolor-500">{userName}</span>!
            </h1>
            <p className={`text-lg mt-2 ${
              isDark ? 'text-primarycolor-200' : 'text-primarycolor-600'
            }`}>
              Ready to explore your next educational opportunity?
            </p>
          </div>
          <div className="hidden md:block">
            <img src="logo.png" className={`w-20 h-24 ${
              isDark ? 'text-primarycolor-400' : 'text-primarycolor-500'
            }`} />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`rounded-xl p-6 ${
          isDark ? 'bg-primarycolor-800 border border-primarycolor-700' : 'bg-white border border-neutralcolor-200'
        }`}>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primarycolor-500">
              <BookOpen className="w-6 h-6 text-neutralcolor-50" />
            </div>
            <div>
              <p className={`text-2xl font-bold ${
                isDark ? 'text-neutralcolor-50' : 'text-primarycolor-800'
              }`}>{totalPrograms}</p>
              <p className={`text-sm ${
                isDark ? 'text-primarycolor-200' : 'text-primarycolor-600'
              }`}>Available Programs</p>
            </div>
          </div>
        </div>

        <div className={`rounded-xl p-6 ${
          isDark ? 'bg-primarycolor-800 border border-primarycolor-700' : 'bg-white border border-neutralcolor-200'
        }`}>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-success">
              <TrendingUp className="w-6 h-6 text-neutralcolor-50" />
            </div>
            <div>
              <p className={`text-2xl font-bold ${
                isDark ? 'text-neutralcolor-50' : 'text-primarycolor-800'
              }`}>{openIntakes}</p>
              <p className={`text-sm ${
                isDark ? 'text-primarycolor-200' : 'text-primarycolor-600'
              }`}>Open Applications</p>
            </div>
          </div>
        </div>

        <div className={`rounded-xl p-6 ${
          isDark ? 'bg-primarycolor-800 border border-primarycolor-700' : 'bg-white border border-neutralcolor-200'
        }`}>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-warning">
              <Clock className="w-6 h-6 text-neutralcolor-50" />
            </div>
            <div>
              <p className={`text-2xl font-bold ${
                isDark ? 'text-neutralcolor-50' : 'text-primarycolor-800'
              }`}>{upcomingDeadlines.length}</p>
              <p className={`text-sm ${
                isDark ? 'text-primarycolor-200' : 'text-primarycolor-600'
              }`}>Upcoming Deadlines</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calendar */}
        <div className={`rounded-xl p-6 ${
          isDark ? 'bg-primarycolor-800 border border-primarycolor-700' : 'bg-white border border-neutralcolor-200'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Calendar className={`w-6 h-6 ${
                isDark ? 'text-primarycolor-400' : 'text-primarycolor-500'
              }`} />
              <h2 className={`text-xl font-semibold ${
                isDark ? 'text-neutralcolor-50' : 'text-primarycolor-800'
              }`}>Important Events</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateMonth('prev')}
                className={`p-2 rounded-lg hover:bg-opacity-80 ${
                  isDark ? 'hover:bg-primarycolor-700' : 'hover:bg-neutralcolor-100'
                }`}
              >
                <ChevronLeft className={`w-4 h-4 ${
                  isDark ? 'text-primarycolor-200' : 'text-primarycolor-600'
                }`} />
              </button>
              <span className={`text-lg font-medium px-4 ${
                isDark ? 'text-neutralcolor-50' : 'text-primarycolor-800'
              }`}>
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              <button
                onClick={() => navigateMonth('next')}
                className={`p-2 rounded-lg hover:bg-opacity-80 ${
                  isDark ? 'hover:bg-primarycolor-700' : 'hover:bg-neutralcolor-100'
                }`}
              >
                <ChevronRight className={`w-4 h-4 ${
                  isDark ? 'text-primarycolor-200' : 'text-primarycolor-600'
                }`} />
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="animate-pulse">
              <div className="grid grid-cols-7 gap-2 mb-4">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="h-8 bg-gray-300 rounded"></div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }).map((_, i) => (
                  <div key={i} className="h-10 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className={`text-center text-sm font-medium py-2 ${
                    isDark ? 'text-primarycolor-200' : 'text-primarycolor-600'
                  }`}>
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {getCalendarDays().map((date, index) => {
                  const events = getEventsForDate(date);
                  const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                  const isToday = date.toDateString() === new Date().toDateString();
                  
                  return (
                    <div
                      key={index}
                      className={`relative h-10 flex items-center justify-center text-sm rounded-lg cursor-pointer ${
                        isCurrentMonth
                          ? isDark
                            ? 'text-neutralcolor-50'
                            : 'text-primarycolor-800'
                          : isDark
                          ? 'text-primarycolor-400'
                          : 'text-primarycolor-300'
                      } ${
                        isToday
                          ? 'bg-primarycolor-500 text-neutralcolor-50 font-bold'
                          : events.length > 0
                          ? 'bg-warning text-neutralcolor-50 font-medium'
                          : isDark
                          ? 'hover:bg-primarycolor-700'
                          : 'hover:bg-neutralcolor-100'
                      }`}
                      title={events.length > 0 ? events.map(e => getProgramName(e.program)).join(', ') : ''}
                    >
                      {date.getDate()}
                      {events.length > 0 && (
                        <div className="absolute bottom-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className={`rounded-xl p-6 ${
          isDark ? 'bg-primarycolor-800 border border-primarycolor-700' : 'bg-white border border-neutralcolor-200'
        }`}>
          <div className="flex items-center gap-3 mb-6">
            <MapPin className={`w-6 h-6 ${
              isDark ? 'text-primarycolor-400' : 'text-primarycolor-500'
            }`} />
            <h2 className={`text-xl font-semibold ${
              isDark ? 'text-neutralcolor-50' : 'text-primarycolor-800'
            }`}>Quick Actions</h2>
          </div>
          
          <div className="space-y-4">
            <Link to="/programs">
              <Button className="w-full bg-primarycolor-500 hover:bg-primarycolor-600 text-neutralcolor-50">
                <BookOpen className="w-4 h-4 mr-2" />
                Browse Programs
              </Button>
            </Link>
            
            <Link to="/profile">
              <Button variant="outline" className="w-full">
                Update Profile
              </Button>
            </Link>
            
            <Link to="/chatbot">
              <Button variant="outline" className="w-full">
                Get AI Assistance
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      {/* <StudentDashboardAnalytics /> */}
    </div>
  );
};

export default StudentDashboard;
