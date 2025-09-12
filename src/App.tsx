import React from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import SummaryCard from './components/SummaryCard';
import ProgramCard from './components/ProgramCard';
import Pagination from './components/Pagination';
import { Program, SummaryCard as SummaryCardType } from './types/index';

const App: React.FC = () => {
  const summaryCards: SummaryCardType[] = [
    { title: 'Related Programs', count: 200, color: 'orange' },
    { title: 'Weekly Programs', count: 30, growth: '+2 this week', color: 'green' },
    { title: 'Monthly Programs', count: 12, growth: '+2 this month', color: 'red' }
  ];

  const programs: Program[] = [
    {
      id: '1',
      title: 'Computer Science',
      university: 'MIT',
      location: 'Cambridge, USA',
      deadline: '12 Sept, 2026',
      seats: 120,
      timeRemaining: '2 months to close',
      status: 'Open'
    },
    {
      id: '2',
      title: 'Data Science',
      university: 'Stanford University',
      location: 'Stanford, USA',
      deadline: '15 Oct, 2026',
      seats: 85,
      timeRemaining: '23 hours to close',
      status: 'Open'
    },
    {
      id: '3',
      title: 'Business Administration',
      university: 'Harvard Business School',
      location: 'Boston, USA',
      deadline: '01 Aug, 2026',
      seats: 0,
      timeRemaining: 'Closed',
      status: 'Closed'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Topbar />
      
      <main className="ml-64 p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            How are you today, Bryan. Ready to Continue your educational journey
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {summaryCards.map((card, index) => (
            <SummaryCard key={index} card={card} />
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Programs related to your interest
          </h2>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Search programs..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Download table</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Category</option>
              <option>University</option>
              <option>Program</option>
              <option>Duration</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>

          <Pagination />
        </div>
      </main>
    </div>
  );
};

export default App;