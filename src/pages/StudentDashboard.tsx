import { useAuth } from '@/hooks/useAuth';


const StudentDashboard = () => {
    const { authUser } = useAuth();
    
    if (!authUser) return null;
    
    const userName = authUser.email.split('@')[0] || 'User';
    
  return (
    <div className="space-y-6">
      <h1 className='text-2xl font-semibold text-gray-900'>How are you today, {userName}!</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-600">Welcome to your dashboard. Here you can manage your applications, view programs, and get AI-powered guidance.</p>
      </div>
    </div>
  );
}

export default StudentDashboard;
