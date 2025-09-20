import React, { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { Brain, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import type { PersonalityAssessmentProps, PersonalityResponse, PersonalityProfile, REBPathway } from '@/types/career';
import { personalityQuestions } from '@/data/careerGuidanceData';

const PersonalityAssessment: React.FC<PersonalityAssessmentProps> = ({ onSubmit }) => {
  const { isDark } = useTheme();
  const [responses, setResponses] = useState<PersonalityResponse[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);

  const questions = personalityQuestions;
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const scaleLabels = [
    'Strongly Disagree',
    'Disagree', 
    'Neutral',
    'Agree',
    'Strongly Agree'
  ];

  const getCurrentResponse = (): string | number | boolean | undefined  => {
    const response = responses.find(r => r.questionId === currentQuestion.id);
    return response?.answer;
  };

  const handleResponse = (answer: string | number) => {
    setResponses(prev => {
      const existing = prev.filter(r => r.questionId !== currentQuestion.id);
      return [...existing, { questionId: currentQuestion.id, answer }];
    });
    setErrors([]);
  };

  const goToNextQuestion = () => {
    const currentResponse = getCurrentResponse();
    if (currentResponse === undefined) {
      setErrors(['Please select an answer before proceeding']);
      return;
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateScores = (responses: PersonalityResponse[]): { [key in REBPathway]: number } => {
    const pathwayScores: { [key in REBPathway]: number } = {
      mathematics_science_1: 0,
      mathematics_science_2: 0,
      arts_humanities: 0,
      languages: 0
    };

    const pathwayCounts: { [key in REBPathway]: number } = {
      mathematics_science_1: 0,
      mathematics_science_2: 0,
      arts_humanities: 0,
      languages: 0
    };

    responses.forEach(response => {
      const question = questions.find(q => q.id === response.questionId);
      if (question) {
        const score = (typeof response.answer === 'number' ? response.answer : 3) * question.weight;
        pathwayScores[question.category] += score;
        pathwayCounts[question.category]++;
      }
    });

    // Calculate averages and convert to 0-100 scale
    Object.keys(pathwayScores).forEach(pathway => {
      const path = pathway as REBPathway;
      if (pathwayCounts[path] > 0) {
        pathwayScores[path] = Math.round((pathwayScores[path] / pathwayCounts[path]) * 20);
      }
    });

    return pathwayScores;
  };

  const getDominantTraits = (scores: { [key in REBPathway]: number }): REBPathway[] => {
    return Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2)
      .map(([trait]) => trait as REBPathway);
  };

  const handleSubmit = () => {
    if (responses.length < questions.length) {
      setErrors(['Please answer all questions before submitting']);
      return;
    }

    const scores = calculateScores(responses);
    const dominantTraits = getDominantTraits(scores);

    const personalityProfile: PersonalityProfile = {
      id: Date.now().toString(),
      responses,
      scores,
      dominantTraits,
      completedAt: new Date()
    };

    onSubmit(personalityProfile);
  };

  const renderScaleQuestion = () => {
    const currentResponse = getCurrentResponse() as number;
    
    return (
      <div className="space-y-4">
        <div className="text-center">
          <div className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Rate how much you agree with this statement:
          </div>
        </div>
        
        <div className="space-y-2">
          {scaleLabels.map((label, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleResponse(index + 1)}
              className={`w-full p-3 text-left border rounded-lg transition-colors ${
                currentResponse === index + 1
                  ? 'border-primarycolor-500 bg-primarycolor-50 dark:bg-primarycolor-900/20'
                  : isDark
                  ? 'border-gray-600 bg-primarycolor-700 hover:border-gray-500'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`font-medium text-sm ${
                  currentResponse === index + 1
                    ? 'text-primarycolor-700 dark:text-primarycolor-300'
                    : isDark ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  {label}
                </span>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  currentResponse === index + 1
                    ? 'border-primarycolor-500 bg-primarycolor-500'
                    : isDark ? 'border-gray-500' : 'border-gray-300'
                }`}>
                  {currentResponse === index + 1 && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Personality Assessment
        </h2>
        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          Complete this questionnaire to help us understand your personality traits and work preferences.
        </p>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-1">
          <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div className={`w-full h-1.5 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <div
            className="h-1.5 bg-primarycolor-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className={`p-4 rounded-lg border mb-4 ${
        isDark ? 'bg-primarycolor-700 border-gray-600' : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="flex items-start mb-4">
          <div className={`p-2 rounded-lg mr-3 ${
            isDark ? 'bg-primarycolor-600' : 'bg-primarycolor-100'
          }`}>
            <Brain className={`w-4 h-4 ${isDark ? 'text-primarycolor-300' : 'text-primarycolor-600'}`} />
          </div>
          <div className="flex-1">
            <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {currentQuestion.question}
            </h3>
            <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              REB Pathway: {currentQuestion.category.replace('_', ' & ').replace(/\b\w/g, l => l.toUpperCase())}
            </p>
          </div>
        </div>

        {renderScaleQuestion()}
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className={`p-3 rounded-lg border mb-4 ${
          isDark ? 'bg-red-900 border-red-700' : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center">
            <AlertCircle className={`w-4 h-4 mr-2 ${
              isDark ? 'text-red-400' : 'text-red-600'
            }`} />
            <div className={`font-medium text-sm ${isDark ? 'text-red-300' : 'text-red-800'}`}>
              {errors[0]}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={goToPreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg font-medium transition-colors ${
            currentQuestionIndex === 0
              ? 'opacity-50 cursor-not-allowed'
              : isDark
              ? 'text-gray-300 border-gray-600 hover:bg-primarycolor-600'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </button>

        {currentQuestionIndex < questions.length - 1 ? (
          <button
            type="button"
            onClick={goToNextQuestion}
            className="inline-flex items-center px-4 py-2 bg-primarycolor-500 hover:bg-primarycolor-600 text-white font-medium rounded-lg transition-colors"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex items-center px-6 py-2 bg-secondarycolor-200 hover:bg-secondarycolor-300 text-gray-800 font-medium rounded-lg transition-colors"
          >
            Complete Assessment
          </button>
        )}
      </div>
    </div>
  );
};

export default PersonalityAssessment;
