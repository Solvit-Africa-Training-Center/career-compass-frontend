import { StudentDashboardAnalytics } from '@/components/Analytics';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';

const StudentDashboard = () => {
    const { authUser } = useAuth();
    const {isDark} = useTheme()
    if (!authUser) return null;
    
    const userName = authUser.email.split('@')[0] || 'User';
    
    return (
        <>
        <div className={`space-y-6 ${isDark ? 'bg-primarycolor-900 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className={``}>
              {/* ${isDark ? 'text-gray-400' : 'text-gray-600'} */}
                <h1 className={`text-3xl font-semibold text-gray-900 ${isDark ? 'text-white' : 'text-gray-600'}`}>
                    How are you today, <span className="text-primarycolor-600">{userName} </span>!
                </h1>
                <p className="text-gray-600 mt-2">Ready to continue your educational journey</p>
            </div>
            
            <StudentDashboardAnalytics />
        </div>
        </>
    );
}

export default StudentDashboard;