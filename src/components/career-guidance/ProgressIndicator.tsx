import React from 'react';
import { useTheme } from '@/hooks/useTheme';
import { CheckCircle, Circle } from 'lucide-react';
import type { ProgressIndicatorProps } from '@/types/career';

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ steps, currentStep }) => {
  const { isDark } = useTheme();

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Step Circle */}
            <div className="flex flex-col items-center relative">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                  step.isComplete
                    ? 'bg-primarycolor-500 border-primarycolor-500 text-white'
                    : step.isActive
                    ? 'bg-primarycolor-500 border-primarycolor-500 text-white'
                    : isDark
                    ? 'bg-primarycolor-800 border-gray-600 text-gray-400'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}
              >
                {step.isComplete ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{step.id + 1}</span>
                )}
              </div>
              
              {/* Step Label */}
              <div className="mt-2 text-center max-w-24">
                <div
                  className={`text-xs font-medium ${
                    step.isActive || step.isComplete
                      ? isDark
                        ? 'text-white'
                        : 'text-gray-900'
                      : isDark
                      ? 'text-gray-400'
                      : 'text-gray-500'
                  }`}
                >
                  {step.title}
                </div>
                <div
                  className={`text-xs mt-1 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  {step.description}
                </div>
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-3">
                <div
                  className={`h-0.5 transition-colors ${
                    steps[index + 1].isActive || steps[index + 1].isComplete
                      ? 'bg-primarycolor-500'
                      : isDark
                      ? 'bg-gray-600'
                      : 'bg-gray-300'
                  }`}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex justify-between text-sm mb-1">
          <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
            Progress
          </span>
          <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
            {Math.round(((currentStep + 1) / steps.length) * 100)}%
          </span>
        </div>
        <div className={`w-full h-1.5 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <div
            className="h-1.5 bg-primarycolor-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
