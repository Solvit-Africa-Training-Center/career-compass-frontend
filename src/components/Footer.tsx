import React from 'react';

const Footer = () => {
  const sections = [
    {
      title: "For Students",
      items: ["High Programs", "Career Guidance", "Application Tracking"]
    },
    {
      title: "For Institutions",
      items: ["Join Network", "Managing Programs", "Student Analytics"]
    },
    {
      title: "Support",
      items: ["Help Center", "Contact Us"]
    }
  ];

  return (
    <footer className="bg-neutralcolor-50  py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold mb-2">Career Campus</h2>
          <p className=" max-w-md">
            Navigate future with intelligent technology and personalized guidance for education success
          </p>
        </div>

        {/* Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sections.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-lg mb-4">{section.title}</h3>
              <ul className="space-y-2 ">
                {section.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-gray-700 text-center ">
          <p>© 2025 Career Campus. All rights reserved. Empowering education journey with AI</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;