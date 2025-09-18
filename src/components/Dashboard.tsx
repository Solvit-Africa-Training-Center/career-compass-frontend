import { useAuth } from "@/hooks/useAuth";

function  Dashboard  ()  {
  const { authUser, logout } = useAuth();
  
  // Extract user name from email (before @) as fallback
  const userName = authUser?.email?.split('@')[0] || 'User';
  const displayName = userName.charAt(0).toUpperCase() + userName.slice(1);
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4">
        <h2 className="text-xl font-bold mb-6">Career Compass</h2>
        <nav className="space-y-4">
          <a href="#" className="block text-gray-700 hover:text-blue-600">Dashboard</a>
          <a href="#" className="block text-gray-700 hover:text-blue-600">Programs</a>
          <a href="#" className="block text-gray-700 hover:text-blue-600">Applications</a>
          <a href="#" className="block text-gray-700 hover:text-blue-600">AI Guidance</a>
        </nav>
        <div className="absolute bottom-6 space-y-2">
          <button onClick={logout} className="block text-sm text-gray-600 hover:text-red-600">Logout</button>
          <a href="#" className="block text-sm text-gray-600">Rate Us</a>
          <a href="#" className="block text-sm text-gray-600">Help</a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">How are you Today, <span className="text-blue-600">{displayName}</span></h1>
          <div className="flex items-center space-x-4">
            <span className="font-medium">{authUser?.email || 'Guest'}</span>
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
              {displayName.charAt(0)}
            </div>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow p-6 rounded-lg">
            <p className="text-gray-500">Eligibility score</p>
            <h2 className="text-2xl font-bold text-green-600">92%</h2>
          </div>
          <div className="bg-white shadow p-6 rounded-lg">
            <p className="text-gray-500">Weekly Application</p>
            <h2 className="text-2xl font-bold">30</h2>
            <span className="text-sm text-gray-400">+2 this week</span>
          </div>
          <div className="bg-white shadow p-6 rounded-lg">
            <p className="text-gray-500">Monthly Application</p>
            <h2 className="text-2xl font-bold">12</h2>
            <span className="text-sm text-gray-400">+2 this month</span>
          </div>
        </div>

        {/* Career Path Analysis */}
        <section className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-2">Career path analysis</h2>
          <p className="text-sm text-gray-600 mb-4">
            Based on your interests in AI and strong mathematical background, a career in Machine Learning Engineering
            or Data Science would be ideal.
          </p>
          <ul className="space-y-2">
            <li className="flex justify-between">
              <span>Machine Learning Engineer</span>
              <span className="bg-yellow-200 px-2 rounded">96% Match</span>
            </li>
            <li className="flex justify-between">
              <span>Data Scientist</span>
              <span className="bg-green-200 px-2 rounded">92% Match</span>
            </li>
            <li className="flex justify-between">
              <span>AI Research Scientist</span>
              <span className="bg-green-200 px-2 rounded">89% Match</span>
            </li>
          </ul>
        </section>

        {/* Program Recommendations */}
        <section className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-2">Program Recommendations</h2>
          <p className="text-sm text-gray-600 mb-4">
            Focus on programs with strong theoretical foundations and practical applications. 
            Look for research opportunities and industry partnerships.
          </p>
          <ul className="space-y-2">
            <li className="flex justify-between">
              <span>Computer Science (AI Focus)</span>
              <span className="bg-green-200 px-2 rounded">Perfect Fit</span>
            </li>
            <li className="flex justify-between">
              <span>Data Science & Analytics</span>
              <span className="bg-yellow-200 px-2 rounded">Great Fit</span>
            </li>
          </ul>
        </section>

        {/* AI Career Guider */}
        <section className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-2">Ask AI Career Guider</h2>
          <p className="text-sm text-gray-600 mb-4">
            Get personalized career advice powered by AI.
          </p>
          <div className="flex">
            <input 
              type="text" 
              placeholder="Ask about career paths, programs..." 
              className="flex-1 border rounded-l px-3 py-2 outline-none"
            />
            <button className="bg-blue-600 text-white px-4 rounded-r">Send</button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
