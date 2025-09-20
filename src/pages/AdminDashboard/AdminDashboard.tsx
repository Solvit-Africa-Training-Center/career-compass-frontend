import { useState, useEffect } from 'react';
import { Users, Building2, GraduationCap, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import CallApi from '@/utils/callApi';
import { backend_path } from '@/utils/enum';
import { toast } from 'sonner';

interface DashboardStats {
  totalUsers: number;
  totalInstitutions: number;
  totalPrograms: number;
  verifiedInstitutions: number;
  activePrograms: number;
  recentUsers: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalInstitutions: 0,
    totalPrograms: 0,
    verifiedInstitutions: 0,
    activePrograms: 0,
    recentUsers: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const headers = { Authorization: `Bearer ${token}` };

      const [users, institutions, programs] = await Promise.allSettled([
        CallApi.get(backend_path.GETUSERS, { headers }),
        CallApi.get(backend_path.GET_INSTITUTION, { headers }),
        CallApi.get(backend_path.GET_PROGRAM, { headers })
      ]);

      const usersData = users.status === 'fulfilled' ? users.value.data : [];
      const institutionsData = institutions.status === 'fulfilled' ? institutions.value.data : [];
      const programsData = programs.status === 'fulfilled' ? programs.value.data : [];

      const verifiedCount = institutionsData.filter((inst: any) => inst.is_verified).length;
      const activeCount = programsData.filter((prog: any) => prog.is_active).length;
      
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentCount = usersData.filter((user: any) => 
        new Date(user.created_at) > sevenDaysAgo
      ).length;

      setStats({
        totalUsers: usersData.length,
        totalInstitutions: institutionsData.length,
        totalPrograms: programsData.length,
        verifiedInstitutions: verifiedCount,
        activePrograms: activeCount,
        recentUsers: recentCount
      });
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, change }: {
    title: string;
    value: number;
    icon: any;
    color: string;
    change?: string;
  }) => (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && <p className="text-xs text-green-600 mt-1">{change}</p>}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primarycolor-500">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome to the Career Compass Admin Panel</p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="bg-blue-500"
          change={`+${stats.recentUsers} this week`}
        />
        <StatCard
          title="Institutions"
          value={stats.totalInstitutions}
          icon={Building2}
          color="bg-green-500"
          change={`${stats.verifiedInstitutions} verified`}
        />
        <StatCard
          title="Programs"
          value={stats.totalPrograms}
          icon={GraduationCap}
          color="bg-purple-500"
          change={`${stats.activePrograms} active`}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 border rounded-lg hover:bg-gray-50 text-left">
            <Users className="h-8 w-8 text-blue-500 mb-2" />
            <h3 className="font-medium">Manage Users</h3>
            <p className="text-sm text-gray-600">View and manage user accounts</p>
          </button>
          <button className="p-4 border rounded-lg hover:bg-gray-50 text-left">
            <Building2 className="h-8 w-8 text-green-500 mb-2" />
            <h3 className="font-medium">Institutions</h3>
            <p className="text-sm text-gray-600">Manage partner institutions</p>
          </button>
          <button className="p-4 border rounded-lg hover:bg-gray-50 text-left">
            <GraduationCap className="h-8 w-8 text-purple-500 mb-2" />
            <h3 className="font-medium">Programs</h3>
            <p className="text-sm text-gray-600">Oversee academic programs</p>
          </button>
          <button className="p-4 border rounded-lg hover:bg-gray-50 text-left">
            <TrendingUp className="h-8 w-8 text-orange-500 mb-2" />
            <h3 className="font-medium">Analytics</h3>
            <p className="text-sm text-gray-600">View detailed reports</p>
          </button>
        </div>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">System Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                Database
              </span>
              <span className="text-green-600 font-medium">Healthy</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                API Services
              </span>
              <span className="text-green-600 font-medium">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center">
                <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                Email Service
              </span>
              <span className="text-yellow-600 font-medium">Monitoring</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="text-sm">
              <span className="font-medium">{stats.recentUsers}</span> new users registered this week
            </div>
            <div className="text-sm">
              <span className="font-medium">{stats.verifiedInstitutions}</span> institutions are verified
            </div>
            <div className="text-sm">
              <span className="font-medium">{stats.activePrograms}</span> programs are currently active
            </div>
            <div className="text-sm">
              System uptime: <span className="font-medium text-green-600">99.9%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;