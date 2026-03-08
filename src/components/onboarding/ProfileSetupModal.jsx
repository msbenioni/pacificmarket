"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ModalWrapper, ModalHeader, ModalContent, ModalFooter, MODAL_SIZES } from '@/components/shared/ModalWrapper';
import { getSupabase } from '../../lib/supabase/client';
import { ONBOARDING_STEPS, ONBOARDING_VALIDATION_RULES } from '../../constants/profileOnboarding';

// Premium mobile-first input styling
const inputCls =
  "w-full min-h-[44px] rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-[#0a1628] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/10 focus:border-[#0d4f4f] disabled:opacity-50";

const textareaCls =
  "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-[#0a1628] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/10 focus:border-[#0d4f4f] resize-none disabled:opacity-50";

const selectCls =
  "w-full min-h-[44px] rounded-xl border border-gray-300 bg-white px-4 py-3 pr-10 text-sm text-[#0a1628] focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/10 focus:border-[#0d4f4f] disabled:opacity-50 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzZiNzI4MCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K')] bg-no-repeat bg-[center_right_1rem] bg-[length:0.75rem]";

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
          <h3 className="text-xl font-semibold text-[#0a1628] mb-2">
            {step.title}
          </h3>
          <p className="text-gray-600 text-sm leading-6">
            {step.description}
          </p>
        </div>

        {/* Step Fields in Premium Card */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-6 shadow-[0_12px_40px_rgba(10,22,40,0.04)] space-y-5">
          {step.fields.map(field => (
            <div key={field.id} className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              
              {field.type === 'select' ? (
                <select
                  value={formData[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className={selectCls}
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
                    <label
                      key={option.value}
                      className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white px-3 py-3 hover:bg-gray-50 cursor-pointer"
                    >
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
                        className="mt-0.5 rounded border-gray-300 text-[#0d4f4f] focus:ring-[#0d4f4f]"
                        disabled={saving}
                      />
                      <span className="text-sm leading-5 text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              ) : field.type === 'textarea' ? (
                <textarea
                  value={formData[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  rows={3}
                  className={textareaCls}
                  disabled={saving}
                />
              ) : field.type === 'checkbox' ? (
                <label className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white px-3 py-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData[field.id] || false}
                    onChange={(e) => handleInputChange(field.id, e.target.checked)}
                    className="mt-0.5 rounded border-gray-300 text-[#0d4f4f] focus:ring-[#0d4f4f]"
                    disabled={saving}
                  />
                  <span className="text-sm leading-5 text-gray-700">{field.text || field.label}</span>
                </label>
              ) : (
                <input
                  type={field.type}
                  value={formData[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  className={inputCls}
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
      {/* Premium Progress Header */}
      <div className="mb-6 rounded-2xl border border-gray-100 bg-white px-4 py-4 sm:px-5">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#0d4f4f]">
              Profile Setup
            </p>
            <p className="text-sm text-gray-600">
              Step {currentStep} of {ONBOARDING_STEPS.length}
            </p>
          </div>

          <span className="text-xs font-medium text-gray-500">
            {Math.round((currentStep / ONBOARDING_STEPS.length) * 100)}%
          </span>
        </div>

        <div className="flex items-center gap-2">
          {ONBOARDING_STEPS.map((_, index) => (
            <div
              key={index}
              className={`h-2 flex-1 rounded-full transition-all ${
                index < currentStep
                  ? "bg-[#0d4f4f]"
                  : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step Content */}
      {renderStepContent()}
    </ModalContent>
    
    <ModalFooter>
      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 w-full">
        <div className="w-full sm:w-auto">
          {currentStep > 1 ? (
            <button
              onClick={handlePrevious}
              disabled={saving}
              className="inline-flex min-h-[44px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              ← Previous
            </button>
          ) : (
            <div className="hidden sm:block" />
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          {!saveSuccess && (
            <button
              onClick={onClose}
              disabled={saving}
              className="inline-flex min-h-[44px] w-full sm:w-auto items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
          )}

          {saveSuccess ? (
            <div className="inline-flex min-h-[44px] w-full sm:w-auto items-center justify-center rounded-xl bg-green-50 px-4 py-3 text-green-700 border border-green-200">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Profile Complete!</span>
            </div>
          ) : (
            <button
              onClick={currentStep === ONBOARDING_STEPS.length ? handleComplete : handleNext}
              disabled={saving}
              className="inline-flex min-h-[44px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#0d4f4f] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1a6b6b] disabled:opacity-50"
            >
              {saving ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V8C8 4.477 9.477 3 12 3s4 1.477 4 4v8z" />
                  </svg>
                  {currentStep === ONBOARDING_STEPS.length ? "Saving..." : "Next"}
                </>
              ) : (
                <>
                  {currentStep === ONBOARDING_STEPS.length ? "Complete Profile" : "Next"}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
