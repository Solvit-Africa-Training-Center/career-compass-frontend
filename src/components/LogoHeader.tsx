import React from 'react';
import { Link } from 'react-router-dom';

const LogoHeader = () => {
  return (
    <div className='px-4 md:px-7 py-5'>
      <Link to="/">
      <img src="logo.png" alt="Logo" className="h-16 md:h-40" />
      </Link>
    </div>
  );
}

export default LogoHeader;
