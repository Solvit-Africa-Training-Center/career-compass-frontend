import React from 'react';
import { Link } from 'react-router-dom';

const LogoHeader = () => {
  return (
    <div className='px-4 md:px-7 py-5'>
      <Link to="/">
      <img src="career compass logo.svg" alt="Logo" className="h-16 md:h-24" />
      </Link>
    </div>
  );
}

export default LogoHeader;
