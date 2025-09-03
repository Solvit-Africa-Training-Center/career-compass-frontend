import { Book, BookOpen } from 'lucide-react';
import React from 'react';

const Footer = () => {
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
    <footer className="bg-gray-50 border-t-1 py-8 md:py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className='flex gap-3 items-center mb-4'>
              <BookOpen className='text-primarycolor-500' size={32} />
              <h2 className="text-xl md:text-2xl font-bold">Career<span className='text-primarycolor-500'>Compass</span> </h2>
            </div>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              Navigate future with intelligent technology and personalized guidance for education success
            </p>
          </div>
          
          {sections.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-base md:text-lg mb-3 md:mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.items.map((item, i) => (
                  <li key={i} className="text-sm md:text-base text-gray-600 hover:text-primarycolor-500 cursor-pointer transition-colors">{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="pt-6 md:pt-8 border-t border-gray-300 text-center">
          <p className="text-xs md:text-sm text-gray-600">© 2025 Career Compass. All rights reserved. Empowering education journey with AI</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;