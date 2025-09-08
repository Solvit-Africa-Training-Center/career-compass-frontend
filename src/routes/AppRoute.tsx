
import EmailVerification from '@/components/EmailVerification';
import ForgotPassword from '@/components/ForgotPassword';
import Home from '@/pages/Home';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';

import { Route, Routes, useLocation } from 'react-router-dom';

const AppRoute = () => {
  const location = useLocation();

  // Define routes where NavBar should not appear
//   const hideNavbarRoutes = ["/login"];
//   const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {/* {!hideNavbar && <NavBar />} */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/email-verification" element={<EmailVerification />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ForgotPassword />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Routes>
    </>
  );
};

export default AppRoute;
