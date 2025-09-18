import EmailVerification from '@/components/EmailVerification';
import ForgotPassword from '@/components/ForgotPassword';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/components/Dashboard';

import { Route, Routes } from 'react-router-dom';

const AppRoute = () => {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/email-verification" element={<EmailVerification />} />
        <Route path="/login" element={<Login />} />
         <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reset-password" element={<ForgotPassword />} />
      </Routes>
    </>
  );
};

export default AppRoute;

