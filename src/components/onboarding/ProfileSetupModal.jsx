"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ModalWrapper, ModalHeader, ModalContent, ModalFooter, MODAL_SIZES } from '@/components/shared/ModalWrapper';
import { getSupabase } from '../../lib/supabase/client';
import { ONBOARDING_STEPS, ONBOARDING_VALIDATION_RULES } from '../../constants/profileOnboarding';

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
      const supabase = getSupabase();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Use direct Supabase client for profile data
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profileData) {
          setFormData({
            display_name: profileData.display_name || user?.user_metadata?.full_name || user?.user_metadata?.display_name || '',
            city: profileData.city || '',
            country: profileData.country || '',
            primary_cultural: profileData.primary_cultural || [],
            languages: Array.isArray(profileData.languages) ? profileData.languages.join(', ') : (profileData.languages || ''),
            years_operating: profileData.years_operating || '',
            market_region: profileData.market_region || ''
          });
        } else {
          // If no profile exists, initialize with user metadata
          setFormData({
            display_name: user?.user_metadata?.full_name || user?.user_metadata?.display_name || '',
            city: '',
            country: '',
            primary_cultural: [],
            languages: '',
            years_operating: '',
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
      const supabase = getSupabase();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Apply transformation rules before saving
      const transformedData = { ...formData };
      
      // Transform languages field from comma-separated string to array
      if (transformedData['languages'] && typeof transformedData['languages'] === 'string') {
        transformedData['languages'] = transformedData['languages']
          .split(',')
          .map(lang => lang.trim())
          .filter(lang => lang.length > 0);
      }
      
      // Use direct Supabase client for profile update
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...transformedData,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setSaveSuccess(true);
      
      if (onComplete) {
        await onComplete();
      } else {
        onClose();
        // Redirect back to business portal
        router.push('/businessportal');
      }

    } catch (error) {
      console.error('Error saving profile:', error);
      setErrors((prev) => ({
        ...prev,
        submit: 'Failed to save profile. Please try again.',
      }));
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
            ) : field.type === 'checkbox' ? (
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData[field.id] || false}
                  onChange={(e) => handleInputChange(field.id, e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  disabled={saving}
                />
                <span className="text-sm text-gray-700">{field.text || field.label}</span>
              </label>
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
  <ModalWrapper 
    isOpen={isOpen} 
    onClose={onClose}
    className={MODAL_SIZES['2xl']}
  >
    <ModalHeader 
      title="Complete Your Profile"
      subtitle={`Step ${currentStep} of ${ONBOARDING_STEPS.length}`}
      onClose={onClose}
    />
    
    <ModalContent>
      {/* Progress Steps */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {ONBOARDING_STEPS.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full ${
                  index < currentStep - 1
                    ? 'bg-blue-600'
                    : index === currentStep - 1
                    ? 'bg-blue-600'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-4">
            {currentStep}/{ONBOARDING_STEPS.length}
          </span>
        </div>
      </div>

      {/* Step Content */}
      {renderStepContent()}
    </ModalContent>
    
    <ModalFooter>
      <div className="flex items-center justify-between">
        <div>
          {currentStep > 1 && (
            <button
              onClick={handlePrevious}
              disabled={saving}
              className="text-gray-500 hover:text-gray-700 font-medium py-2 disabled:opacity-50"
            >
              ← Previous
            </button>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          {!saveSuccess && (
            <button
              onClick={onClose}
              disabled={saving}
              className="text-gray-500 hover:text-gray-700 font-medium py-2 disabled:opacity-50"
            >
              Cancel
            </button>
          )}
          
          {saveSuccess ? (
            <div className="flex items-center text-green-600">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Profile Complete!</span>
            </div>
          ) : (
            <button
              onClick={currentStep === ONBOARDING_STEPS.length ? handleComplete : handleNext}
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V8C8 4.477 9.477 3 12 3s4 1.477 4 4v8z" />
                  </svg>
                  {currentStep === ONBOARDING_STEPS.length ? 'Saving...' : 'Next'}
                </>
              ) : (
                <>
                  {currentStep === ONBOARDING_STEPS.length ? 'Complete Profile' : 'Next'}
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </ModalFooter>
  </ModalWrapper>
);
}
