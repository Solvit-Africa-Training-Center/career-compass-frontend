import React from 'react';

const Sidebar: React.FC = () => {
  const menuItems = ['Dashboard', 'Programs', 'Applications', 'AI Guidance'];

  return (
    <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 z-10">
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-800">Student Portal</h1>
      </div>
      <nav className="mt-6">
        {menuItems.map((item, index) => (
          <a
            key={index}
            href="#"
            className={`block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
              item === 'Dashboard' ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : ''
            }`}
          >
            {item}
          </a>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;