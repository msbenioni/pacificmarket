"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { pacificMarket } from '../../lib/pacificMarketClient';
import { ONBOARDING_STEPS, ONBOARDING_VALIDATION_RULES } from '../../constants/profileOnboarding';
import { useOnboardingStatus } from '../../hooks/useOnboardingStatus';

/**
 * Profile Setup Modal
 * Premium guided profile completion experience
 */
export function ProfileSetupModal({ isOpen, onClose, onComplete, initialStep = 1 }) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({ submit: undefined });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { onboardingStatus, getStepStatus, getStepTitle, getStepDescription } = useOnboardingStatus();

  // Handle SSR/hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Initialize form data from user profile
  useEffect(() => {
    if (isOpen && isMounted) {
      // Load existing profile data
      loadProfileData();
    }
  }, [isOpen, isMounted]);

  // Don't render until mounted to avoid hydration issues
  if (!isMounted) {
    return null;
  }

  // Handle router not being mounted (SSR or outside context)
  if (!router) {
    return null;
  }

  const loadProfileData = async () => {
    try {
      const userData = await pacificMarket.auth.me();
      if (userData) {
        // Use direct Supabase client for profile data
        const { getSupabase } = await import('../../lib/supabase/client');
        const supabase = getSupabase();
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userData.id)
          .single();
        
        if (profileData) {
          setFormData({
            display_name: profileData.display_name || userData?.user_metadata?.full_name || userData?.user_metadata?.display_name || '',
            city: profileData.city || '',
            country: profileData.country || '',
            cultural_identity: profileData.cultural_identity || [],
            languages: profileData.languages || [],
            years_operating: profileData.years_operating || '',
            business_role: profileData.business_role || '',
            market_region: profileData.market_region || ''
          });
        } else {
          // If no profile exists, initialize with user metadata
          setFormData({
            display_name: userData?.user_metadata?.full_name || userData?.user_metadata?.display_name || '',
            city: '',
            country: '',
            cultural_identity: [],
            languages: [],
            years_operating: '',
            business_role: '',
            market_region: ''
          });
        }
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateCurrentStep = () => {
    const stepFields = ONBOARDING_STEPS[currentStep - 1]?.fields || [];
    const newErrors = {};

    stepFields.forEach(field => {
      const value = formData[field.id];
      const rules = ONBOARDING_VALIDATION_RULES[field.id];

      if (field.required && (!value || (Array.isArray(value) && value.length === 0))) {
        newErrors[field.id] = `${field.label} is required`;
      } else if (rules && value) {
        if (rules.minLength && value.length < rules.minLength) {
          newErrors[field.id] = `Must be at least ${rules.minLength} characters`;
        } else if (rules.maxLength && value.length > rules.maxLength) {
          newErrors[field.id] = `Must be no more than ${rules.maxLength} characters`;
        } else if (rules.type === 'number' && isNaN(value)) {
          newErrors[field.id] = 'Must be a valid number';
        }
      }
    });

    setErrors({ ...newErrors, submit: undefined });
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < ONBOARDING_STEPS.length) {
        setCurrentStep(currentStep + 1);
      } else {
        handleComplete();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setSaving(true);
    try {
      const userData = await pacificMarket.auth.me();
      if (!userData) throw new Error('User not authenticated');

      // Use direct Supabase client for profile update
      const { getSupabase } = await import('../../lib/supabase/client');
      const supabase = getSupabase();
      
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: userData.id,
          ...formData,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setSaveSuccess(true);
      
      // Auto-close after success
      setTimeout(() => {
        if (onComplete) {
          onComplete();
        } else {
          onClose();
          // Redirect back to business portal
          router.push('/businessportal');
        }
      }, 1500);

    } catch (error) {
      console.error('Error saving profile:', error);
      setErrors({ ...errors, submit: 'Failed to save profile. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const renderStepContent = () => {
    const step = ONBOARDING_STEPS[currentStep - 1];
    if (!step) return null;

    return (
      <div className="space-y-6">
        {/* Step Header */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {step.title}
          </h3>
          <p className="text-gray-600">
            {step.description}
          </p>
        </div>

        {/* Step Fields */}
        {step.fields.map(field => (
          <div key={field.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            
            {field.type === 'select' ? (
              <select
                value={formData[field.id] || ''}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={saving}
              >
                <option value="">Select {field.label}</option>
                {field.options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : field.type === 'multiselect' ? (
              <div className="space-y-2">
                {field.options.map(option => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(formData[field.id] || []).includes(option.value)}
                      onChange={(e) => {
                        const current = formData[field.id] || [];
                        if (e.target.checked) {
                          handleInputChange(field.id, [...current, option.value]);
                        } else {
                          handleInputChange(field.id, current.filter(v => v !== option.value));
                        }
                      }}
                      className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      disabled={saving}
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            ) : field.type === 'textarea' ? (
              <textarea
                value={formData[field.id] || ''}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={saving}
              />
            ) : (
              <input
                type={field.type}
                value={formData[field.id] || ''}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={saving}
              />
            )}
            
            {field.description && (
              <p className="text-xs text-gray-500">{field.description}</p>
            )}
            
            {errors[field.id] && (
              <p className="text-sm text-red-600">{errors[field.id]}</p>
            )}
          </div>
        ))}

        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Complete Your Profile</h2>
              <p className="text-sm text-gray-600 mt-1">
                Step {currentStep} of {ONBOARDING_STEPS.length}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              disabled={saving}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              {ONBOARDING_STEPS.map((_, index) => (
                <span key={index} className={index < currentStep ? 'text-blue-600' : ''}>
                  {index + 1}
                </span>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / ONBOARDING_STEPS.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {saveSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile Complete!</h3>
              <p className="text-gray-600">Your profile has been saved successfully.</p>
            </div>
          ) : (
            renderStepContent()
          )}
        </div>

        {/* Footer */}
        {!saveSuccess && (
          <div className="p-6 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1 || saving}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <button
                onClick={handleNext}
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <span>{currentStep === ONBOARDING_STEPS.length ? 'Complete' : 'Next'}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
