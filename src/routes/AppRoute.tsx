
import EmailVerification from '@/components/EmailVerification';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import React from 'react';
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
        {/* <Route path="/" element={<LandingPage />} /> */}
        <Route path="/register" element={<Register />} />
        <Route path="/email-verification" element={<EmailVerification />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Routes>
    </>
  );
};

export default AppRoute;
