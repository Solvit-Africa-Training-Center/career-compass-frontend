import { StudentDashboardAnalytics } from "@/components/Analytics";
import { ApplicationTable, type Application } from "@/components/TableComp";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { useState, useEffect } from "react";
import CallApi from "@/utils/CallApi";
import { backend_path } from "@/utils/enum";
import { toast } from "sonner";

const StudentDashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const { authUser } = useAuth();
  const { isDark } = useTheme();

  useEffect(() => {
    fetchApplications();
  }, [currentPage]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      // Note: Replace with actual applications endpoint when available
      // For now, we'll fetch programs and simulate applications
      const response = await CallApi.get(`${backend_path.GET_PROGRAM}?page=${currentPage}`);
      const programs = response.data.results || response.data;
      
      // Transform programs to applications format (simulation)
      const mockApplications: Application[] = programs.slice(0, 5).map((program: any, index: number) => ({
        id: program.id.toString(),
        university: program.institution?.name || 'Unknown University',
        program: program.name,
        status: ['Pending', 'Accepted', 'Rejected', 'Under Review'][index % 4] as any,
      }));
      
      setApplications(mockApplications);
      setTotalPages(Math.ceil((response.data.count || programs.length) / 5));
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
      // Fallback to empty array
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  if (!authUser) {
    return null;
  }
  
  const userName = authUser.email.split("@")[0] || "User";

  return (
    <>
      <div
        className={`space-y-6 ${
          isDark
            ? "bg-primarycolor-900 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <div className={``}>
          {/* ${isDark ? 'text-gray-400' : 'text-gray-600'} */}
          <h1
            className={`text-3xl font-semibold text-gray-900 ${
              isDark ? "text-white" : "text-gray-600"
            }`}
          >
            How are you today,{" "}
            <span className="text-primarycolor-600">{userName} </span>!
          </h1>
          <p className="text-gray-600 mt-2">
            Ready to continue your educational journey
          </p>
        </div>

        <StudentDashboardAnalytics />

        {/* Table */}
        {loading ? (
          <div className={`p-6 rounded-lg border animate-pulse ${
            isDark ? 'bg-primarycolor-900 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="space-y-4">
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex space-x-4">
                  <div className="h-4 bg-gray-200 rounded flex-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <ApplicationTable
            applications={applications}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </>
  );
};

export default StudentDashboard;
