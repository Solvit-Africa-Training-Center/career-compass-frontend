import React, { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import type { CareerGuidanceFormData, FormStep, Transcript, PersonalityProfile } from '@/types/career';
import { generateRecommendations } from '@/utils/careerGuidanceUtils';
import ProgressIndicator from './ProgressIndicator';
import TranscriptForm from './TranscriptForm';
import PersonalityAssessment from './PersonalityAssessment';
import RecommendationsDashboard from './RecommendationsDashboard';
import WelcomeStep from './WelcomeStep';

const CareerGuidance: React.FC = () => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState<CareerGuidanceFormData>({
    step: 0,
    transcript: null,
    personalityProfile: null,
    recommendations: [],
    isComplete: false
  });

  const steps: FormStep[] = [
    {
      id: 0,
      title: 'Welcome',
      description: 'Introduction to Career Guidance',
      isComplete: formData.step > 0,
      isActive: formData.step === 0
    },
    {
      id: 1,
      title: 'Academic Transcript',
      description: 'Enter your academic performance',
      isComplete: formData.transcript !== null,
      isActive: formData.step === 1
    },
    {
      id: 2,
      title: 'Personality Assessment',
      description: 'Complete personality questionnaire',
      isComplete: formData.personalityProfile !== null,
      isActive: formData.step === 2
    },
    {
      id: 3,
      title: 'Recommendations',
      description: 'View your career guidance results',
      isComplete: formData.isComplete,
      isActive: formData.step === 3
    }
  ];

  // Generate recommendations when both transcript and personality are complete
  useEffect(() => {
    if (formData.transcript && formData.personalityProfile && formData.recommendations.length === 0) {
      const recommendations = generateRecommendations(formData.transcript, formData.personalityProfile);
      setFormData(prev => ({
        ...prev,
        recommendations,
        isComplete: true
      }));
    }
  }, [formData.transcript, formData.personalityProfile]);

  const handleTranscriptSubmit = (transcript: Transcript) => {
    setFormData(prev => ({
      ...prev,
      transcript,
      step: 2
    }));
  };

  const handlePersonalitySubmit = (personalityProfile: PersonalityProfile) => {
    setFormData(prev => ({
      ...prev,
      personalityProfile,
      step: 3
    }));
  };

  const handleRetakeAssessment = () => {
    setFormData({
      step: 0,
      transcript: null,
      personalityProfile: null,
      recommendations: [],
      isComplete: false
    });
  };

  const handleModifyTranscript = () => {
    setFormData(prev => ({
      ...prev,
      step: 1,
      recommendations: [],
      isComplete: false
    }));
  };

  const handleNextStep = () => {
    setFormData(prev => ({
      ...prev,
      step: prev.step + 1
    }));
  };

  const renderCurrentStep = () => {
    switch (formData.step) {
      case 0:
        return <WelcomeStep onNext={handleNextStep} />;
      case 1:
        return (
          <TranscriptForm
            onSubmit={handleTranscriptSubmit}
            initialData={formData.transcript || undefined}
          />
        );
      case 2:
        return <PersonalityAssessment onSubmit={handlePersonalitySubmit} />;
      case 3:
        return (
          <RecommendationsDashboard
            recommendations={formData.recommendations}
            onRetake={handleRetakeAssessment}
            onModifyTranscript={handleModifyTranscript}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-primarycolor-900' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Career Guidance
          </h1>
          <p className={`text-base ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Discover your ideal academic major and career path
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <ProgressIndicator steps={steps} currentStep={formData.step} />
        </div>

        {/* Main Content */}
        <div className={`rounded-lg shadow-sm p-6 ${isDark ? 'bg-primarycolor-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
          {renderCurrentStep()}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Career guidance recommendations are based on academic performance and personality traits.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CareerGuidance;
