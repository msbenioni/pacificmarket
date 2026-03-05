"use client";

import React, { useEffect, useState } from 'react';
import { useOnboardingStatus } from '../../hooks/useOnboardingStatus';

/**
 * Premium Setup Progress Card
 * Shows user's onboarding progress with clear next action
 */
export function SetupProgressCard({ onOpenProfileModal, onOpenClaimModal, onOpenAddModal }) {
  const [isMounted, setIsMounted] = useState(false);
  const { onboardingStatus, getStepStatus, getStepTitle, getStepDescription, loading } = useOnboardingStatus();

  // Handle SSR/hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render until mounted and data is loaded
  if (!isMounted || loading) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-6 shadow-sm animate-pulse">
        <div className="h-4 bg-blue-200 rounded w-1/3 mb-2"></div>
        <div className="h-3 bg-blue-100 rounded w-1/2"></div>
      </div>
    );
  }

  if (onboardingStatus.isComplete) {
    return <CompletionCard />;
  }

  const handleContinue = () => {
    switch (onboardingStatus.nextAction) {
      case 'complete-profile':
        // Open profile setup modal
        if (onOpenProfileModal) {
          onOpenProfileModal();
        }
        break;
      case 'claim-or-add':
        // Show claim/add business modal
        if (onOpenClaimModal) {
          onOpenClaimModal();
        }
        break;
      case 'complete-business-profiles':
        // Open add business modal for profile completion
        if (onOpenAddModal) {
          onOpenAddModal();
        }
        break;
      default:
        break;
    }
  };

  const handleSkip = () => {
    // Allow skipping for non-critical steps
    if (onboardingStatus.nextAction === 'complete-business-profiles') {
      // Mark as skipped - just do nothing or hide the card
      // No navigation needed since we're using modals
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Finish your setup</h3>
          <p className="text-sm text-gray-600">
            {onboardingStatus.totalSteps - onboardingStatus.completedSteps} quick steps — 2 minutes
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-blue-600">
            {onboardingStatus.completedSteps}/{onboardingStatus.totalSteps}
          </span>
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold">
              {onboardingStatus.completedSteps}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="space-y-3 mb-6">
        {[1, 2, 3].map((step) => {
          const status = getStepStatus(step);
          const title = getStepTitle(step);
          const description = getStepDescription(step);
          
          return (
            <div key={step} className="flex items-center space-x-3">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                status === 'completed' 
                  ? 'bg-green-100 text-green-600' 
                  : status === 'current'
                  ? 'bg-blue-100 text-blue-600 border-2 border-blue-300'
                  : 'bg-gray-100 text-gray-400'
              }`}>
                {status === 'completed' ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span className="text-sm font-medium">{step}</span>
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  status === 'completed' ? 'text-gray-500' : 
                  status === 'current' ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {title}
                </p>
                <p className={`text-xs ${
                  status === 'completed' ? 'text-gray-400' : 
                  status === 'current' ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <button
            onClick={handleContinue}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <span>Continue setup</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
        
        {onboardingStatus.nextAction === 'complete-business-profiles' && (
          <button
            onClick={handleSkip}
            className="ml-3 text-gray-500 hover:text-gray-700 text-sm font-medium px-4 py-2"
          >
            Do this later
          </button>
        )}
      </div>

      {/* Trust Message */}
      <div className="mt-4 pt-4 border-t border-blue-100">
        <p className="text-xs text-gray-600 text-center">
          This helps us verify ownership and represent Pacific enterprise accurately.
        </p>
      </div>
    </div>
  );
}

/**
 * Completion Card - shown when onboarding is complete
 */
function CompletionCard() {
  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-6 shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">All set!</h3>
          <p className="text-sm text-gray-600">
            Your profile is complete and ready to go. You can now manage your business listings.
          </p>
        </div>
      </div>
    </div>
  );
}
