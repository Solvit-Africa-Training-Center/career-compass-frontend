import React from 'react';
import { Program } from '../types';

interface Props {
  program: Program;
}

const ProgramCard: React.FC<Props> = ({ program }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{program.title}</h3>
      <p className="text-gray-600 mb-1">{program.university}</p>
      <p className="text-gray-500 text-sm mb-3">{program.location}</p>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Deadline:</span>
          <span className="font-medium">{program.deadline}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Seats:</span>
          <span className="font-medium">{program.seats} remaining</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Time:</span>
          <span className="font-medium">{program.timeRemaining}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          program.status === 'Open' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {program.status}
        </span>
      </div>

      <div className="flex space-x-2">
        <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700">
          Apply Now
        </button>
        <button className="flex-1 border border-blue-600 text-blue-600 py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-50">
          Learn More
        </button>
      </div>
    </div>
  );
};

export default ProgramCard;