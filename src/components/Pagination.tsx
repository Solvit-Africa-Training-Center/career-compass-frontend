import React from 'react';

const Pagination: React.FC = () => {
  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      <button className="px-3 py-2 text-gray-500 hover:text-gray-700">
        Previous
      </button>
      {[1, 2, 3].map((page) => (
        <button
          key={page}
          className={`px-3 py-2 rounded-md ${
            page === 1 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {page}
        </button>
      ))}
      <button className="px-3 py-2 text-gray-500 hover:text-gray-700">
        Next
      </button>
    </div>
  );
};

export default Pagination;