import React from 'react';

const Topbar: React.FC = () => {
  return (
    <div className="bg-white shadow-sm border-b px-6 py-4 ml-64">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-600 hover:text-gray-800">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 7H4l5-5v5z" />
            </svg>
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">B</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Bryan</p>
              <p className="text-xs text-gray-500">Student</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;