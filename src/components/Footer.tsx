import { useTheme } from '@/hooks/useTheme';
import {  BookOpen } from 'lucide-react';
import React from 'react';

const Footer = () => {
  const {isDark}=useTheme()
  const sections = [
    // {
    //   title: "Career Campus",
    //   items: ["High Programs", "Career Guidance", "Application Tracking"]
    // },
    {
      title: "For Students",
      items: ["Find Programs", "Career Guidance", "Application Tracking"]
    },
    {
      title: "For Institutions",
      items: ["Join Network", "Manage Programs", "Student Analytics"]
    },
    {
      title: "Support",
      items: ["Help Center", "Contact Us"]
    }
  ];

  return (
    <footer className={`border-t-1 py-8 md:py-12 px-4 transition-colors ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-300'}`}>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className='flex gap-3 items-center mb-4'>
              <BookOpen className='text-primarycolor-500' size={32} />
              <h2 className={`text-xl md:text-2xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>Career <span className='text-primarycolor-500'>Compass</span> </h2>
            </div>
            <p className={`text-sm md:text-base leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Navigate future with intelligent technology and personalized guidance for education success
            </p>
          </div>
          
          {sections.map((section, index) => (
            <div key={index}>
              <h3 className={`font-semibold text-base md:text-lg mb-3 md:mb-4 ${isDark ? 'text-white' : 'text-black'}`}>{section.title}</h3>
              <ul className="space-y-2">
                {section.items.map((item, i) => (
                  <li key={i} className={`text-sm md:text-base hover:text-primarycolor-500 cursor-pointer transition-colors ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className={`pt-6 md:pt-8 border-t text-center ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
          <p className={`text-xs md:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>© 2025 Career Compass. All rights reserved. Empowering education journey with AI</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;