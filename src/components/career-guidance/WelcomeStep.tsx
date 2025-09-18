import React from 'react';
import { useTheme } from '@/hooks/useTheme';
import { GraduationCap, Brain, Target, ArrowRight } from 'lucide-react';

interface WelcomeStepProps {
  onNext: () => void;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext }) => {
  const { isDark } = useTheme();

  const features = [
    {
      icon: <GraduationCap className="w-6 h-6" />,
      title: 'Academic Analysis',
      description: 'We analyze your transcript including GPA, subjects, and credit hours.'
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'Personality Assessment',
      description: 'Complete a questionnaire using Big Five and Holland Code frameworks.'
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Personalized Recommendations',
      description: 'Get tailored major and career suggestions with detailed explanations.'
    }
  ];

  return (
    <div className="text-center">
      {/* Hero Section */}
      <div className="mb-8">
        <div className="mb-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            isDark ? 'bg-primarycolor-700' : 'bg-primarycolor-100'
          }`}>
            <GraduationCap className={`w-8 h-8 ${isDark ? 'text-primarycolor-300' : 'text-primarycolor-600'}`} />
          </div>
        </div>
        
        <h2 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Discover Your Academic Path
        </h2>
        
        <p className={`text-base max-w-2xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          Our career guidance system combines your academic performance with personality traits 
          to recommend the most suitable majors and career paths.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${
              isDark 
                ? 'bg-primarycolor-800 border-gray-700' 
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className={`inline-flex p-2 rounded-lg mb-3 ${
              isDark ? 'bg-primarycolor-700' : 'bg-primarycolor-100'
            }`}>
              <div className={isDark ? 'text-primarycolor-300' : 'text-primarycolor-600'}>
                {feature.icon}
              </div>
            </div>
            
            <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {feature.title}
            </h3>
            
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* Process Timeline */}
      <div className={`p-4 rounded-lg border mb-6 ${
        isDark ? 'bg-primarycolor-700 border-gray-600' : 'bg-secondarycolor-50 border-secondarycolor-200'
      }`}>
        <h3 className={`text-base font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          How It Works
        </h3>
        
        <div className="flex flex-wrap justify-center items-center gap-3 text-sm">
          <div className={`flex items-center ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium mr-2 ${
              isDark ? 'bg-primarycolor-500 text-white' : 'bg-primarycolor-500 text-white'
            }`}>
              1
            </span>
            Enter Academic Data
          </div>
          
          <ArrowRight className={`w-3 h-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
          
          <div className={`flex items-center ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium mr-2 ${
              isDark ? 'bg-primarycolor-500 text-white' : 'bg-primarycolor-500 text-white'
            }`}>
              2
            </span>
            Complete Assessment
          </div>
          
          <ArrowRight className={`w-3 h-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
          
          <div className={`flex items-center ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium mr-2 ${
              isDark ? 'bg-primarycolor-500 text-white' : 'bg-primarycolor-500 text-white'
            }`}>
              3
            </span>
            Get Recommendations
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="space-y-3">
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          The assessment takes approximately 10-15 minutes to complete.
        </p>
        
        <button
          onClick={onNext}
          className="inline-flex items-center px-6 py-2.5 bg-primarycolor-500 hover:bg-primarycolor-600 text-white font-medium rounded-lg transition-colors"
        >
          Get Started
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default WelcomeStep;
