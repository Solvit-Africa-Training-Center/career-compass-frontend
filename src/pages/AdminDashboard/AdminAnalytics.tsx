import { useState, useEffect } from 'react';
import { Users, Building2, GraduationCap, FileText, TrendingUp, DollarSign } from 'lucide-react';
import CallApi from '@/utils/callApi';
import { backend_path } from '@/utils/enum';
import { toast } from 'sonner';

interface AnalyticsData {
  totalUsers: number;
  totalInstitutions: number;
  totalPrograms: number;
  totalApplications: number;
  verifiedInstitutions: number;
  activePrograms: number;
  recentRegistrations: number;
  averageTuitionFee: number;
}

const AdminAnalytics = () => {
  const [data, setData] = useState<AnalyticsData>({
    totalUsers: 0,
    totalInstitutions: 0,
    totalPrograms: 0,
    totalApplications: 0,
    verifiedInstitutions: 0,
    activePrograms: 0,
    recentRegistrations: 0,
    averageTuitionFee: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch all data in parallel
      const [users, institutions, programs, fees] = await Promise.allSettled([
        CallApi.get(backend_path.GETUSERS, { headers }),
        CallApi.get(backend_path.GET_INSTITUTION, { headers }),
        CallApi.get(backend_path.GET_PROGRAM, { headers }),
        CallApi.get(backend_path.GET_PROGRAM_FEE, { headers })
      ]);

      const usersData = users.status === 'fulfilled' ? users.value.data : [];
      const institutionsData = institutions.status === 'fulfilled' ? institutions.value.data : [];
      const programsData = programs.status === 'fulfilled' ? programs.value.data : [];
      const feesData = fees.status === 'fulfilled' ? fees.value.data : [];

      // Calculate metrics
      const verifiedInstitutions = institutionsData.filter((inst: any) => inst.is_verified).length;
      const activePrograms = programsData.filter((prog: any) => prog.is_active).length;
      
      // Recent registrations (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentUsers = usersData.filter((user: any) => 
        new Date(user.created_at) > thirtyDaysAgo
      ).length;

      // Average tuition fee
      const avgFee = feesData.length > 0 
        ? feesData.reduce((sum: number, fee: any) => sum + parseFloat(fee.tuition_amount || 0), 0) / feesData.length
        : 0;

      setData({
        totalUsers: usersData.length,
        totalInstitutions: institutionsData.length,
        totalPrograms: programsData.length,
        totalApplications: 0, // Would need applications endpoint
        verifiedInstitutions,
        activePrograms,
        recentRegistrations: recentUsers,
        averageTuitionFee: Math.round(avgFee)
      });
    } catch (error) {
      toast.error('Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, subtitle }: {
    title: string;
    value: number | string;
    icon: any;
    color: string;
    subtitle?: string;
  }) => (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primarycolor-500">Analytics Dashboard</h1>
        <button
          onClick={fetchAnalytics}
          className="px-4 py-2 bg-primarycolor-500 text-white rounded-md hover:bg-primarycolor-600 transition-colors"
        >
          Refresh Data
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={data.totalUsers}
          icon={Users}
          color="bg-blue-500"
          subtitle={`${data.recentRegistrations} new this month`}
        />
        <StatCard
          title="Institutions"
          value={data.totalInstitutions}
          icon={Building2}
          color="bg-green-500"
          subtitle={`${data.verifiedInstitutions} verified`}
        />
        <StatCard
          title="Programs"
          value={data.totalPrograms}
          icon={GraduationCap}
          color="bg-purple-500"
          subtitle={`${data.activePrograms} active`}
        />
        <StatCard
          title="Avg. Tuition"
          value={`$${data.averageTuitionFee.toLocaleString()}`}
          icon={DollarSign}
          color="bg-orange-500"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Verification Rate"
          value={`${data.totalInstitutions > 0 ? Math.round((data.verifiedInstitutions / data.totalInstitutions) * 100) : 0}%`}
          icon={TrendingUp}
          color="bg-teal-500"
          subtitle="Institution verification"
        />
        <StatCard
          title="Program Activity"
          value={`${data.totalPrograms > 0 ? Math.round((data.activePrograms / data.totalPrograms) * 100) : 0}%`}
          icon={FileText}
          color="bg-indigo-500"
          subtitle="Active programs"
        />
        <StatCard
          title="Growth Rate"
          value={`${data.totalUsers > 0 ? Math.round((data.recentRegistrations / data.totalUsers) * 100) : 0}%`}
          icon={TrendingUp}
          color="bg-pink-500"
          subtitle="Monthly user growth"
        />
        <StatCard
          title="System Health"
          value="Healthy"
          icon={TrendingUp}
          color="bg-green-600"
          subtitle="All systems operational"
        />
      </div>

      {/* Quick Stats Summary */}
      <div className="bg-white p-6 rounded-lg border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">System Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primarycolor-500">{data.totalUsers}</div>
            <div className="text-sm text-gray-600">Registered Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primarycolor-500">{data.totalInstitutions}</div>
            <div className="text-sm text-gray-600">Partner Institutions</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primarycolor-500">{data.totalPrograms}</div>
            <div className="text-sm text-gray-600">Available Programs</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-gray-700">New user registrations this month</span>
            <span className="font-semibold text-primarycolor-500">{data.recentRegistrations}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-gray-700">Verified institutions</span>
            <span className="font-semibold text-green-600">{data.verifiedInstitutions}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-gray-700">Active programs</span>
            <span className="font-semibold text-blue-600">{data.activePrograms}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-700">Average program fee</span>
            <span className="font-semibold text-orange-600">${data.averageTuitionFee.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;