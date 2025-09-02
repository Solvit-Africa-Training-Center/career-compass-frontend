import { BookOpen } from 'lucide-react';
import React, { useState } from 'react';
const navigation = {
    home: 'Home',
    features: 'Features',
    about: 'About',
    howItWorks: 'How It Works'
};
const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false)
  return (
    <>
            <header>
                <nav className="flex justify-between items-center mx-auto px-7 py-7 border-b-1">
                    <div className="flex gap-2 justify-center items-center text-2xl font-bold">
                        {/* <img src="/src/assets/logo-1.jpg" alt="Logo" className='w-12 h-12 rounded-full'/>
                        Career <span className="text-primarycolor-500 ">Campus</span> */}
                        <BookOpen className='text-primarycolor-500' size={32} />
                        <h1>Career <span className="text-primarycolor-500 ">Campus</span></h1>
                    </div>
                    {/* Desktop Navigation */}
                    <ul className="hidden md:flex space-x-7">
                        {Object.entries(navigation).map(([key, value]) => (
                            <li key={key} className="hover:text-primaryColor-50 cursor-pointer transition-colors">
                                <a href={`#${key}`}>{value}</a>
                            </li>
                        ))}
                    </ul>
                    {/* Mobile Hamburger Button */}
                    <button 
                        className="md:hidden focus:outline-none"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle navigation"
                    >
                        {isOpen ? (
                            // Close Icon
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            // Hamburger Icon
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </nav>
                {/* Mobile Navigation Menu */}
                {isOpen && (
                    <div className="md:hidden bg-white shadow-md">
                        <ul className="flex flex-col space-y-4 px-7 py-4">
                            {Object.entries(navigation).map(([key, value]) => (
                                <li key={key} className="hover:text-primaryColor-50 cursor-pointer transition-colors">
                                    <a href={`#${key}`} onClick={() => setIsOpen(false)}>{value}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </header>
        </>
  );
}

export default NavBar;
