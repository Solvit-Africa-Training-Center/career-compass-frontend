import { StudentDashboardAnalytics } from "@/components/Analytics";
import { ApplicationTable, type Application } from "@/components/TableComp";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { useState } from "react";
// Mock data - replace with your actual data source
const mockApplications: Application[] = [
  {
    id: "1",
    university: "University of Toronto",
    program: "Computer Engineering",
    status: "Accepted",
  },
  {
    id: "2",
    university: "University of Toronto",
    program: "Computer Engineering",
    status: "Accepted",
  },
  {
    id: "3",
    university: "University of Toronto",
    program: "Computer Engineering",
    status: "Accepted",
  },
  {
    id: "4",
    university: "University of Toronto",
    program: "Computer Engineering",
    status: "Accepted",
  },
  {
    id: "5",
    university: "University of Toronto",
    program: "Computer Engineering",
    status: "Accepted",
  },
];
const StudentDashboard = () => {
  const { authUser } = useAuth();
  const { isDark } = useTheme();
  if (!authUser) return null;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;
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
        <ApplicationTable
          applications={mockApplications}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
};

export default StudentDashboard;
