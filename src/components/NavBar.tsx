import { BookOpen } from 'lucide-react';
import React, { useState } from 'react';

const navigation = {
    home: 'Home',
    features: 'Features',
    about: 'About',
    howItWorks: 'How It Works',
    contact: 'Contact Us'
};

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        setIsOpen(false);
    };
  return (
    <>
            <header>
                <nav className="flex justify-between items-center max-w-6xl mx-auto px-4 md:px-7 py-4 md:py-7 border-b border-gray-200">
                    <div className="flex gap-2 items-center text-xl md:text-2xl font-bold">
                        {/* <img src="/src/assets/logo-1.jpg" alt="Logo" className='w-12 h-12 rounded-full'/>
                        Career <span className="text-primarycolor-500 ">Campus</span> */}
                        <BookOpen className='text-primarycolor-500' size={32} />
                        <h1>Career <span className="text-primarycolor-500 ">Compass</span></h1>
                    </div>
                    {/* Desktop Navigation */}
                    <ul className="hidden md:flex space-x-6 lg:space-x-8">
                        {Object.entries(navigation).map(([key, value]) => (
                            <li key={key}>
                                <button 
                                    onClick={() => scrollToSection(key)}
                                    className="text-gray-700 hover:text-primarycolor-500 cursor-pointer transition-colors duration-300 font-medium"
                                >
                                    {value}
                                </button>
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
                    <div className="md:hidden bg-white shadow-lg border-t">
                        <ul className="flex flex-col space-y-2 px-4 py-4">
                            {Object.entries(navigation).map(([key, value]) => (
                                <li key={key}>
                                    <button 
                                        onClick={() => scrollToSection(key)}
                                        className="w-full text-left py-2 px-3 text-gray-700 hover:text-primarycolor-500 hover:bg-gray-50 rounded-md transition-colors duration-300 font-medium"
                                    >
                                        {value}
                                    </button>
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
