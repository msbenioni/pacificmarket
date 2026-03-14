"use client";

import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, CheckCircle, AlertCircle, Users, TrendingUp, Globe, AlertCircle as AlertIcon, Rocket, Lightbulb } from "lucide-react";
import { BUSINESS_STAGE, TEAM_SIZE_BAND, INDUSTRIES, FOUNDER_MOTIVATIONS, BUSINESS_CHALLENGES, SUPPORT_NEEDS, GOALS_NEXT_12_MONTHS, COMMUNITY_IMPACT_AREAS, FAMILY_RESPONSIBILITIES, GENDER_OPTIONS, AGE_RANGES, COUNTRIES, REVENUE_BAND, SALES_CHANNELS, BUSINESS_OPERATING_STATUS } from "@/constants/unifiedConstants";
import { 
  useSharedForm, 
  FORM_MODES, 
  AUTO_SAVE_CONFIG, 
  createValidator, 
  ValidationPatterns 
} from "@/hooks/useSharedForm";

const STEPS = [
  { key: "founder", label: "Founder Background", icon: Users },
  { key: "business", label: "Business Reality", icon: TrendingUp },
  { key: "pacific", label: "Pacific Context", icon: Globe },
  { key: "challenges", label: "Challenges & Support", icon: AlertIcon },
  { key: "growth", label: "Growth & Future", icon: Rocket },
  { key: "community", label: "Community & Impact", icon: Lightbulb },
];

const DEFAULT_FORM_STATE = {
  // Founder Background
  gender: "",
  age_range: "",
  years_entrepreneurial: "",
  businesses_founded: "",
  founder_role: "",
  founder_motivation_array: [],
  founder_story: "",

  // Business Reality
  business_operating_status: "",
  business_age: "",
  industry: "",
  team_size_band: "",
  revenue_band: "",
  is_business_registered: false,
  employs_anyone: false,
  employs_family_community: false,
  sales_channels_array: [],

  // Pacific Context
  pacific_identity_array: [],
  based_in_country: "",
  based_in_city: "",
  serves_pacific_communities: "",
  culture_influences_business: false,
  culture_influence_details: "",
  family_community_responsibilities_impact: [],
  responsibilities_impact_details: "",

  // Challenges & Support
  top_challenges_array: [],
  support_needed_next_array: [],
  current_support_sources_array: [],
  has_mentorship_access: false,
  offers_mentorship: false,
  barriers_to_mentorship: "",
  angel_investor_interest: false,
  investor_capacity: "",
  has_collaboration_interest: false,
  is_open_to_future_contact: false,

  // Growth & Future
  goals_next_12_months_array: [],
  funding_source: [],
  investment_stage: "",
  revenue_streams: [],
  next_milestones: "",
  scaling_plans: "",
  international_expansion: false,
  target_markets: [],
};

/**
 * 🏆 FounderInsightsForm with Shared Form Hook
 * 
 * Demonstrates the standardized form pattern with:
 * - Consistent data flow
 * - Auto-save functionality
 * - Parent-child synchronization
 * - Built-in validation
 * - Debug logging
 */
const FounderInsightsFormShared = ({ 
  businessId, 
  onSubmit, 
  isLoading, 
  initialData = null 
}) => {
  // 🎯 Shared Form Hook Configuration
  const form = useSharedForm({
    initialData: initialData,
    onSave: async (data, options) => {
      return await onSubmit({ ...data, business_id: businessId });
    },
    onValidate: createValidator({
      industry: [ValidationPatterns.required],
      business_operating_status: [ValidationPatterns.required],
      team_size_band: [ValidationPatterns.required],
      revenue_band: [ValidationPatterns.required],
      based_in_country: [ValidationPatterns.required],
      based_in_city: [ValidationPatterns.required],
      founder_story: [ValidationPatterns.required],
    }),
    defaultState: DEFAULT_FORM_STATE,
    mode: FORM_MODES.EDIT,
    autoSave: AUTO_SAVE_CONFIG.ON_BLUR,
    debug: process.env.NODE_ENV === 'development',
    autoSaveDelay: 2000,
    preserveData: true,
    dependencyFields: ['business_id'],
  });

  // 🔄 Local state for UI concerns only
  const [step, setStep] = useState(1);

  // 🎯 Step Management
  const nextStep = () => {
    if (step < STEPS.length) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const canGoNext = () => {
    // Basic validation for each step
    switch (step) {
      case 1: // Founder Background
        return form.formData.gender && form.formData.age_range && form.formData.founder_story;
      case 2: // Business Reality
        return form.formData.business_operating_status && form.formData.business_age && 
               form.formData.industry && form.formData.team_size_band && form.formData.revenue_band;
      case 3: // Pacific Context
        return form.formData.based_in_country && form.formData.based_in_city;
      default:
        return true;
    }
  };

  // 🎯 Array Field Handlers (using shared form helpers)
  const toggleArrayItem = (field, item) => {
    form.toggleArrayItem(field, item);
  };

  const addArrayItem = (field, item) => {
    form.addArrayItem(field, item);
  };

  const removeArrayItem = (field, index) => {
    form.removeArrayItem(field, index);
  };

  // 🎯 Form Submission
  const handleSubmit = async () => {
    try {
      await form.handleSave();
    } catch (error) {
      console.error('Form submission failed:', error);
    }
  };

  // 🎯 Auto-save Status Indicator
  const AutoSaveStatus = () => {
    if (form.autoSave === AUTO_SAVE_CONFIG.DISABLED) return null;
    
    const statusConfig = {
      idle: { color: 'text-gray-500', text: '' },
      pending: { color: 'text-yellow-600', text: 'Changes pending...' },
      saving: { color: 'text-blue-600', text: 'Saving...' },
      success: { color: 'text-green-600', text: 'Saved!' },
      error: { color: 'text-red-600', text: 'Save failed' },
    };
    
    const config = statusConfig[form.autoSaveStatus];
    if (!config.text) return null;
    
    return (
      <div className={`text-xs ${config.color} flex items-center gap-1`}>
        <div className={`w-2 h-2 rounded-full ${
          form.autoSaveStatus === 'saving' ? 'animate-pulse bg-blue-600' :
          form.autoSaveStatus === 'success' ? 'bg-green-600' :
          form.autoSaveStatus === 'error' ? 'bg-red-600' :
          'bg-yellow-600'
        }`} />
        {config.text}
      </div>
    );
  };

  // 🎯 Input Classes
  const inputCls = "w-full min-h-[44px] border border-slate-300 rounded-xl px-4 py-3 text-sm text-[#0a1628] placeholder:text-slate-400 focus:outline-none focus:border-[#0d4f4f] focus:ring-2 focus:ring-[#0d4f4f]/10 bg-white shadow-sm";
  const textareaCls = "w-full border border-slate-300 rounded-xl px-4 py-3 text-sm text-[#0a1628] placeholder:text-slate-400 focus:outline-none focus:border-[#0d4f4f] focus:ring-2 focus:ring-[#0d4f4f]/10 bg-white resize-none shadow-sm";
  const selectCls = "w-full min-h-[44px] border border-slate-300 rounded-xl px-4 py-3 pr-10 text-sm text-[#0a1628] focus:outline-none focus:border-[#0d4f4f] focus:ring-2 focus:ring-[#0d4f4f]/10 bg-white appearance-none shadow-sm";
  const labelCls = "block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5";

  return (
    <div className="space-y-6">
      {/* 🎯 Form Header with Status */}
      <div className="border-b border-gray-200 px-6 py-4 bg-gray-50 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#0a1628]">Founder Insights</h2>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-xs text-gray-500">
                {form.isDirty ? 'Unsaved changes' : 'All changes saved'}
              </span>
              <AutoSaveStatus />
            </div>
          </div>
          {form.isDirty && (
            <button
              type="button"
              onClick={() => form.resetForm()}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* 🎯 Progress Stepper */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
        {STEPS.map((stepInfo, index) => (
          <div key={stepInfo.key} className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium ${
              index + 1 < step ? 'bg-green-500 text-white' :
              index + 1 === step ? 'bg-[#0d4f4f] text-white' :
              'bg-gray-200 text-gray-500'
            }`}>
              {index + 1}
            </div>
            <div className="ml-2 hidden sm:block">
              <div className={`text-xs font-medium ${
                index + 1 <= step ? 'text-[#0a1628]' : 'text-gray-400'
              }`}>
                {stepInfo.label}
              </div>
            </div>
            {index < STEPS.length - 1 && (
              <div className="ml-4 sm:ml-8 w-8 h-0.5 bg-gray-200" />
            )}
          </div>
        ))}
      </div>

      {/* 🎯 Form Content */}
      <form onSubmit={handleSubmit} className="bg-white rounded-b-2xl p-6">
        {/* Step 1: Founder Background */}
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-[#0a1628] flex items-center gap-2">
              <Users className="h-5 w-5 text-[#0d4f4f]" />
              Founder Background
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelCls}>Gender *</label>
                <select
                  value={form.formData.gender || ""}
                  onChange={(e) => form.handleFieldChange("gender", e.target.value)}
                  className={`${selectCls} ${form.errors.gender ? 'border-red-500' : ''}`}
                >
                  <option value="">Select gender</option>
                  {GENDER_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                {form.errors.gender && (
                  <p className="mt-1 text-xs text-red-600">{form.errors.gender}</p>
                )}
              </div>

              <div>
                <label className={labelCls}>Age Range *</label>
                <select
                  value={form.formData.age_range || ""}
                  onChange={(e) => form.handleFieldChange("age_range", e.target.value)}
                  className={`${selectCls} ${form.errors.age_range ? 'border-red-500' : ''}`}
                >
                  <option value="">Select age range</option>
                  {AGE_RANGES.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                {form.errors.age_range && (
                  <p className="mt-1 text-xs text-red-600">{form.errors.age_range}</p>
                )}
              </div>

              <div>
                <label className={labelCls}>Years as Entrepreneur</label>
                <select
                  value={form.formData.years_entrepreneurial || ""}
                  onChange={(e) => form.handleFieldChange("years_entrepreneurial", e.target.value)}
                  className={selectCls}
                >
                  <option value="">Select years</option>
                  <option value="0-1">Less than 1 year</option>
                  <option value="1-3">1-3 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5-10">5-10 years</option>
                  <option value="10+">More than 10 years</option>
                </select>
              </div>

              <div>
                <label className={labelCls}>Businesses Founded</label>
                <select
                  value={form.formData.businesses_founded || ""}
                  onChange={(e) => form.handleFieldChange("businesses_founded", e.target.value)}
                  className={selectCls}
                >
                  <option value="">Select option</option>
                  <option value="first">Yes, this is my first business</option>
                  <option value="multiple">No, I've founded other businesses before</option>
                </select>
              </div>

              <div>
                <label className={labelCls}>Current Role</label>
                <select
                  value={form.formData.founder_role || ""}
                  onChange={(e) => form.handleFieldChange("founder_role", e.target.value)}
                  className={selectCls}
                >
                  <option value="">Select role</option>
                  <option value="founder">Founder/Owner</option>
                  <option value="cofounder">Co-founder</option>
                  <option value="partner">Partner</option>
                  <option value="executive">Executive</option>
                  <option value="manager">Manager</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className={labelCls}>Founder Motivation (max 3)</label>
                <div className="space-y-2">
                  {FOUNDER_MOTIVATIONS.map(motivation => (
                    <label key={motivation.value} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={form.formData.founder_motivation_array?.includes(motivation.value)}
                        onChange={e => toggleArrayItem("founder_motivation_array", motivation.value)}
                        className="h-4 w-4 rounded border-slate-300"
                      />
                      <span className="text-sm text-slate-700">{motivation.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className={labelCls}>Founder Story *</label>
                <textarea
                  value={form.formData.founder_story || ""}
                  onChange={(e) => form.handleFieldChange("founder_story", e.target.value)}
                  className={`${textareaCls} ${form.errors.founder_story ? 'border-red-500' : ''}`}
                  rows={4}
                  placeholder="Share your story, what led you to entrepreneurship, or any context you'd like to provide..."
                />
                {form.errors.founder_story && (
                  <p className="mt-1 text-xs text-red-600">{form.errors.founder_story}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Business Reality */}
        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-[#0a1628] flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#0d4f4f]" />
              Business Reality
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelCls}>Industry *</label>
                <select
                  value={form.formData.industry || ""}
                  onChange={(e) => form.handleFieldChange("industry", e.target.value)}
                  className={`${selectCls} ${form.errors.industry ? 'border-red-500' : ''}`}
                >
                  <option value="">Select industry</option>
                  {INDUSTRIES.map(industry => (
                    <option key={industry.value} value={industry.value}>{industry.label}</option>
                  ))}
                </select>
                {form.errors.industry && (
                  <p className="mt-1 text-xs text-red-600">{form.errors.industry}</p>
                )}
              </div>

              <div>
                <label className={labelCls}>Team Size *</label>
                <select
                  value={form.formData.team_size_band || ""}
                  onChange={(e) => form.handleFieldChange("team_size_band", e.target.value)}
                  className={`${selectCls} ${form.errors.team_size_band ? 'border-red-500' : ''}`}
                >
                  <option value="">Select team size</option>
                  {TEAM_SIZE_BAND.map(size => (
                    <option key={size.value} value={size.value}>{size.label}</option>
                  ))}
                </select>
                {form.errors.team_size_band && (
                  <p className="mt-1 text-xs text-red-600">{form.errors.team_size_band}</p>
                )}
              </div>

              <div>
                <label className={labelCls}>Revenue Band *</label>
                <select
                  value={form.formData.revenue_band || ""}
                  onChange={(e) => form.handleFieldChange("revenue_band", e.target.value)}
                  className={`${selectCls} ${form.errors.revenue_band ? 'border-red-500' : ''}`}
                >
                  <option value="">Select revenue range</option>
                  {REVENUE_BAND.map(band => (
                    <option key={band.value} value={band.value}>{band.label}</option>
                  ))}
                </select>
                {form.errors.revenue_band && (
                  <p className="mt-1 text-xs text-red-600">{form.errors.revenue_band}</p>
                )}
              </div>

              <div>
                <label className={labelCls}>Sales Channels</label>
                <div className="space-y-2">
                  {SALES_CHANNELS.map(channel => (
                    <label key={channel.value} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={form.formData.sales_channels?.includes(channel.value)}
                        onChange={e => toggleArrayItem("sales_channels", channel.value)}
                        className="h-4 w-4 rounded border-slate-300"
                      />
                      <span className="text-sm text-slate-700">{channel.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add more steps as needed... */}

        {/* 🎯 Form Actions */}
        <div className="border-t border-gray-200 pt-6 mt-8 flex justify-between items-center">
          <div className="text-xs text-gray-500">
            {form.isDirty && 'You have unsaved changes'}
          </div>
          <div className="flex gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Previous
              </button>
            )}
            {step < STEPS.length ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!canGoNext()}
                className="rounded-xl bg-[#0d4f4f] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0a3d3d] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={form.isSaving || !form.isDirty}
                className="rounded-xl bg-[#0d4f4f] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0a3d3d] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {form.isSaving ? "Saving..." : "Submit Insights"}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default FounderInsightsFormShared;
