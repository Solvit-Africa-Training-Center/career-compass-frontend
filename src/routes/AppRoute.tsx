import EmailVerification from "@/components/EmailVerification";
import ForgotPassword from "@/components/ForgotPassword";
import Layout from "@/layout/Layout";
import Home from "@/pages/Home";
import Profile from "@/pages/StudentDashboard/Profile";
import NotFound from "@/pages/NotFound";
import StudentDashboard from "@/pages/StudentDashboard/StudentDashboard";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import { useAuth } from "@/hooks/useAuth";
import { Route, Routes } from "react-router-dom";
import Analytics from "@/components/Analytics";
import ProgramsList from "@/components/ProgramsList";
import ProgramDetails from "@/components/program-details";
import AdminDashboard from "@/pages/AdminDashboard/AdminDashboard";
import Users from "@/pages/AdminDashboard/Users";
import InstitutionDashboard from "@/pages/InstitutionDashboard/InstitutionDashboard";

const AppRoute: React.FC = () => {
  const { authUser } = useAuth();
  const isAuthenticated = !!authUser;

  return (
    <>
      <Routes>
        {/* Public routes without sidebar */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/email-verification" element={<EmailVerification />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ForgotPassword />} />

        {/* Protected routes */}
        {isAuthenticated && authUser && (
          <>
            <Route
              path="/dashboard"
              element={
                <Layout>
                  <StudentDashboard />
                </Layout>
              }
            />
            <Route
              path="/programs"
              element={
                <Layout>
                  <ProgramsList />
                </Layout>
              }
            />
            <Route
              path="/program-details/:id"
              element={
                <Layout>
                  <ProgramDetails />
                </Layout>
              }
            />
            <Route
              path="/applications"
              element={
                <Layout>
                  <div className="space-y-6">
                    <h1 className="text-2xl font-bold text-gray-900">
                      Applications
                    </h1>
                    <div className="bg-white p-6 rounded-lg shadow">
                      <p>Manage your applications</p>
                      {/* Custom analytics */}
                      <Analytics showDeadlines={false} />
                    </div>
                  </div>
                </Layout>
              }
            />
            <Route
              path="/guidance"
              element={
                <Layout>
                  <div className="space-y-6">
                    <h1 className="text-2xl font-bold text-gray-900">
                      AI Guidance
                    </h1>
                    <div className="bg-white p-6 rounded-lg shadow">
                      <p>Get AI-powered career guidance</p>
                    </div>
                  </div>
                </Layout>
              }
            />
            <Route
              path="/profile"
              element={
                <Layout>
                  <Profile />
                </Layout>
              }
            />
            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <Layout>
                  <AdminDashboard />
                </Layout>
              }
            />
            <Route
              path="/admin/users"
              element={
                <Layout>
                  <Users />
                </Layout>
              }
            />
            <Route
              path="/admin/institutions"
              element={
                <Layout>
                  <InstitutionDashboard />
                </Layout>
              }
            />
            <Route
              path="/admin/programs"
              element={
                <Layout>
                  <ProgramsList />
                </Layout>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <Layout>
                  <AdminDashboard />
                </Layout>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <Layout>
                  <AdminDashboard />
                </Layout>
              }
            />
          </>
        )}

        {/* Catch all route */}
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default AppRoute;
