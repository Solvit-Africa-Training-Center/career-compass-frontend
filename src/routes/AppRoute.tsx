import EmailVerification from '@/components/EmailVerification';
import ForgotPassword from '@/components/ForgotPassword';
import Layout from '@/layout/Layout';
import Home from '@/pages/Home';
import NotFound from '@/pages/NotFound';
import StudentDashboard from '@/pages/StudentDashboard';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import { useAuth } from '@/hooks/useAuth';
import { Route, Routes } from 'react-router-dom';

const AppRoute: React.FC = () => {
  const { authUser, logout } = useAuth();
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
            <Route path="/dashboard" element={<Layout><StudentDashboard /></Layout>} />
            <Route path="/programs" element={
              <Layout>
                <div className="space-y-6">
                  <h1 className="text-2xl font-bold text-gray-900">Programs</h1>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <p>Browse available programs</p>
                  </div>
                </div>
              </Layout>
            } />
            <Route path="/applications" element={
              <Layout>
                <div className="space-y-6">
                  <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <p>Manage your applications</p>
                  </div>
                </div>
              </Layout>
            } />
            <Route path="/guidance" element={
              <Layout>
                <div className="space-y-6">
                  <h1 className="text-2xl font-bold text-gray-900">AI Guidance</h1>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <p>Get AI-powered career guidance</p>
                  </div>
                </div>
              </Layout>
            } />
          </>
        )}
        

        
        {/* Catch all route */}
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default AppRoute;