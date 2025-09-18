import React, { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { 
  Trophy, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Edit,
  Star,
  Users,
  BookOpen
} from 'lucide-react';
import type { RecommendationsProps, CareerRecommendation } from '@/types/career';
import { formatSalary, getMatchColor, getDifficultyColor } from '@/utils/careerGuidanceUtils';

const RecommendationsDashboard: React.FC<RecommendationsProps> = ({ 
  recommendations, 
  onRetake, 
  onModifyTranscript 
}) => {
  const { isDark } = useTheme();
  const [selectedRecommendation, setSelectedRecommendation] = useState<CareerRecommendation | null>(
    recommendations[0] || null
  );

  if (recommendations.length === 0) {
    return (
      <div className="text-center py-8">
        <div className={`text-base ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          No recommendations available. Please complete the assessment.
        </div>
      </div>
    );
  }

  const topMatch = recommendations[0];

  return (
    <div>
      <div className="mb-6">
        <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Your Career Recommendations
        </h2>
        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          Based on your academic performance and personality assessment.
        </p>
      </div>

      {/* Top Match Highlight */}
      <div className={`p-4 rounded-lg border mb-6 ${
        isDark 
          ? 'bg-primarycolor-700 border-secondarycolor-200' 
          : 'bg-secondarycolor-50 border-secondarycolor-200'
      }`}>
        <div className="flex items-start">
          <div className={`p-2 rounded-lg mr-3 ${
            isDark ? 'bg-secondarycolor-200/20' : 'bg-secondarycolor-100'
          }`}>
            <Trophy className={`w-5 h-5 ${isDark ? 'text-secondarycolor-200' : 'text-secondarycolor-600'}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <h3 className={`text-lg font-bold mr-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Best Match: {topMatch.major.name}
              </h3>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getMatchColor(topMatch.matchPercentage)}`}>
                {topMatch.matchPercentage}% Match
              </span>
            </div>
            <p className={`text-sm mb-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {topMatch.explanation}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="flex items-center">
                <TrendingUp className={`w-3 h-3 mr-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                  Academic: {topMatch.academicMatch}%
                </span>
              </div>
              <div className="flex items-center">
                <Users className={`w-3 h-3 mr-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                  Personality: {topMatch.personalityMatch}%
                </span>
              </div>
              <div className="flex items-center">
                <Clock className={`w-3 h-3 mr-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                  {topMatch.major.duration} years
                </span>
              </div>
              <div className="flex items-center">
                <DollarSign className={`w-3 h-3 mr-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                  {formatSalary(topMatch.major.averageSalary.entry)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Recommendations List */}
        <div className="lg:col-span-1">
          <h3 className={`text-base font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            All Recommendations
          </h3>
          <div className="space-y-2">
            {recommendations.map((recommendation, index) => (
              <button
                key={recommendation.id}
                onClick={() => setSelectedRecommendation(recommendation)}
                className={`w-full p-3 rounded-lg border text-left transition-colors ${
                  selectedRecommendation?.id === recommendation.id
                    ? isDark
                      ? 'bg-primarycolor-700 border-primarycolor-500'
                      : 'bg-primarycolor-50 border-primarycolor-300'
                    : isDark
                    ? 'bg-primarycolor-800 border-gray-600 hover:bg-primarycolor-700'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mr-2 ${
                      index === 0
                        ? 'bg-secondarycolor-200 text-gray-800'
                        : index === 1
                        ? 'bg-gray-400 text-white'
                        : index === 2
                        ? 'bg-orange-400 text-white'
                        : isDark
                        ? 'bg-gray-600 text-gray-300'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {index + 1}
                    </span>
                    <h4 className={`font-medium text-sm ${
                      selectedRecommendation?.id === recommendation.id
                        ? isDark ? 'text-white' : 'text-gray-900'
                        : isDark ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                      {recommendation.major.name}
                    </h4>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getMatchColor(recommendation.matchPercentage)}`}>
                    {recommendation.matchPercentage}%
                  </span>
                </div>
                <div className="flex items-center text-xs space-x-2">
                  <span className={`${getDifficultyColor(recommendation.major.difficulty)} px-1.5 py-0.5 rounded`}>
                    {recommendation.major.difficulty}
                  </span>
                  <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                    {formatSalary(recommendation.major.averageSalary.entry)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Detailed View */}
        <div className="lg:col-span-2">
          {selectedRecommendation && (
            <div className={`p-4 rounded-lg border ${
              isDark ? 'bg-primarycolor-800 border-gray-600' : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {selectedRecommendation.major.name}
                  </h3>
                  <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {selectedRecommendation.major.description}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded text-sm font-bold ${getMatchColor(selectedRecommendation.matchPercentage)}`}>
                  {selectedRecommendation.matchPercentage}% Match
                </span>
              </div>

              {/* REB Pathway */}
              <div className={`p-3 rounded-lg border mb-4 ${
                isDark ? 'bg-primarycolor-700 border-primarycolor-500' : 'bg-primarycolor-50 border-primarycolor-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`text-xs font-medium ${isDark ? 'text-primarycolor-300' : 'text-primarycolor-700'}`}>
                      REB Learning Pathway
                    </div>
                    <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-primarycolor-800'}`}>
                      {selectedRecommendation.major.rebPathway.replace('_', ' & ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                  </div>
                  <div className={`text-right`}>
                    <div className={`text-xs font-medium ${isDark ? 'text-primarycolor-300' : 'text-primarycolor-700'}`}>
                      Pathway Alignment
                    </div>
                    <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-primarycolor-800'}`}>
                      {selectedRecommendation.pathwayAlignment}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Match Breakdown */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className={`p-3 rounded-lg ${isDark ? 'bg-primarycolor-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Academic Match
                    </span>
                    <BookOpen className={`w-3 h-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                  </div>
                  <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {selectedRecommendation.academicMatch}%
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${isDark ? 'bg-primarycolor-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Interest Match
                    </span>
                    <Users className={`w-3 h-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                  </div>
                  <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {selectedRecommendation.personalityMatch}%
                  </div>
                </div>
              </div>

              {/* Program Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div>
                  <div className={`text-xs font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Duration
                  </div>
                  <div className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {selectedRecommendation.major.duration} years
                  </div>
                </div>
                <div>
                  <div className={`text-xs font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Difficulty
                  </div>
                  <span className={`text-xs px-2 py-1 rounded font-medium ${getDifficultyColor(selectedRecommendation.major.difficulty)}`}>
                    {selectedRecommendation.major.difficulty}
                  </span>
                </div>
                <div>
                  <div className={`text-xs font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Required GPA
                  </div>
                  <div className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {selectedRecommendation.major.requiredGPA}
                  </div>
                </div>
                <div>
                  <div className={`text-xs font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Entry Salary
                  </div>
                  <div className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {formatSalary(selectedRecommendation.major.averageSalary.entry)}
                  </div>
                </div>
              </div>

              {/* Salary Progression */}
              <div className={`p-3 rounded-lg border mb-4 ${
                isDark ? 'bg-primarycolor-700 border-gray-600' : 'bg-green-50 border-green-200'
              }`}>
                <h4 className={`font-medium mb-2 text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Salary Progression
                </h4>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className={`text-sm font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                      {formatSalary(selectedRecommendation.major.averageSalary.entry)}
                    </div>
                    <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Entry Level
                    </div>
                  </div>
                  <div>
                    <div className={`text-sm font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                      {formatSalary(selectedRecommendation.major.averageSalary.mid)}
                    </div>
                    <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Mid-Career
                    </div>
                  </div>
                  <div>
                    <div className={`text-sm font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                      {formatSalary(selectedRecommendation.major.averageSalary.senior)}
                    </div>
                    <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Senior Level
                    </div>
                  </div>
                </div>
              </div>

              {/* Career Opportunities & Universities */}
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className={`font-medium mb-2 text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Related Careers
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedRecommendation.major.relatedCareers.map((career, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 rounded text-xs ${
                          isDark 
                            ? 'bg-primarycolor-600 text-primarycolor-200 border border-primarycolor-500' 
                            : 'bg-primarycolor-100 text-primarycolor-700 border border-primarycolor-200'
                        }`}
                      >
                        {career}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className={`font-medium mb-2 text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Available in Rwanda
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedRecommendation.major.rwandanUniversities.map((university, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 rounded text-xs ${
                          isDark 
                            ? 'bg-secondarycolor-600 text-secondarycolor-200 border border-secondarycolor-500' 
                            : 'bg-secondarycolor-100 text-secondarycolor-700 border border-secondarycolor-200'
                        }`}
                      >
                        {university}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Strengths */}
              <div className="mb-4">
                <h4 className={`font-medium mb-2 text-sm flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                  Strengths for This Field
                </h4>
                <ul className="space-y-1">
                  {selectedRecommendation.strengths.map((strength, index) => (
                    <li key={index} className={`text-xs flex items-start ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      <Star className="w-2 h-2 mr-1 mt-1 text-green-500 flex-shrink-0" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Considerations */}
              {selectedRecommendation.considerations.length > 0 && (
                <div className="mb-4">
                  <h4 className={`font-medium mb-2 text-sm flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    <AlertTriangle className="w-3 h-3 mr-1 text-yellow-500" />
                    Things to Consider
                  </h4>
                  <ul className="space-y-1">
                    {selectedRecommendation.considerations.map((consideration, index) => (
                      <li key={index} className={`text-xs flex items-start ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        <AlertTriangle className="w-2 h-2 mr-1 mt-1 text-yellow-500 flex-shrink-0" />
                        {consideration}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Next Steps */}
              <div>
                <h4 className={`font-medium mb-2 text-sm flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <ArrowRight className="w-3 h-3 mr-1 text-primarycolor-500" />
                  Recommended Next Steps
                </h4>
                <ul className="space-y-1">
                  {selectedRecommendation.nextSteps.map((step, index) => (
                    <li key={index} className={`text-xs flex items-start ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      <ArrowRight className="w-2 h-2 mr-1 mt-1 text-primarycolor-500 flex-shrink-0" />
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onModifyTranscript}
          className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg font-medium transition-colors text-sm ${
            isDark 
              ? 'text-gray-300 border-gray-600 hover:bg-primarycolor-700' 
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Edit className="w-3 h-3 mr-1" />
          Modify Transcript
        </button>
        <button
          onClick={onRetake}
          className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg font-medium transition-colors text-sm ${
            isDark 
              ? 'text-gray-300 border-gray-600 hover:bg-primarycolor-700' 
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Retake Assessment
        </button>
      </div>
    </div>
  );
};

export default RecommendationsDashboard;
