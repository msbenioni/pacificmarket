"use client";

import { useState, useEffect } from "react";
import { COUNTRIES, INDUSTRIES, BUSINESS_STATUS, SUBSCRIPTION_TIER, BUSINESS_SOURCE, TEAM_SIZE_BAND, BUSINESS_OPERATING_STATUS, SALES_CHANNELS, REVENUE_BAND } from "@/constants/unifiedConstants";
import { ChevronRight, ChevronLeft, CheckCircle, AlertCircle, Upload } from "lucide-react";
import PremiumStepper from "@/components/shared/PremiumStepper";
import { 
  useSharedForm, 
  FORM_MODES, 
  AUTO_SAVE_CONFIG, 
  createValidator, 
  ValidationPatterns 
} from "@/hooks/useSharedForm";

const STEPS = [
  { key: "identity", label: "Business Identity" },
  { key: "operations", label: "Business Operations" },
  { key: "media", label: "Media & Details" },
  { key: "contact", label: "Contact Info" },
  { key: "description", label: "Description" },
  { key: "review", label: "Review" },
];

/**
 * 🏆 DetailedBusinessForm with Shared Form Hook
 * 
 * Demonstrates complex form migration with step-based navigation,
 * field transformations, and array management.
 */
const DetailedBusinessFormRestored = ({ 
  onSubmit, 
  isLoading, 
  excludeFields = [], 
  initialData = null, 
  onStepChange,
  mode = FORM_MODES.BUSINESS_CREATE 
}) => {
  // 🎯 Shared Form Hook Configuration
  const form = useSharedForm({
    initialData: initialData,
    onSave: async (data, options) => {
      // Transform form data back to database format before saving
      const transformedData = {
        ...data,
        // Handle business_stage mapping (now standardized)
        business_stage: data.business_stage || "",
        // Transform array fields back to database format
        sales_channels: data.sales_channels_array || [],
        social_links: data.social_links_array || [],
        cultural_identity: data.cultural_identity_array || [],
        languages_spoken: data.languages_spoken_array || [],
        // Remove form-specific array fields
        sales_channels_array: undefined,
        social_links_array: undefined,
        cultural_identity_array: undefined,
        languages_spoken_array: undefined,
      };
      
      return await onSubmit(transformedData);
    },
    onValidate: createValidator({
      name: [ValidationPatterns.required],
      industry: [ValidationPatterns.required],
      country: [ValidationPatterns.required],
      contact_email: [
        (value) => {
          if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return 'Please enter a valid email address';
          }
          return null;
        }
      ],
      contact_website: [
        (value) => {
          if (value && !/^https?:\/\/.+/.test(value)) {
            return 'Please enter a valid URL starting with http:// or https://';
          }
          return null;
        }
      ],
    }),
    defaultState: {
      // Identity fields
      name: "", 
      business_handle: "", 
      industry: "", 
      country: "", 
      city: "", 
      year_started: "",
      
      // Business Operations fields
      business_operating_status: "",
      business_age: "",
      team_size_band: "",
      is_business_registered: false,
      employs_anyone: false,
      employs_family_community: false,
      sales_channels_array: [],
      revenue_band: "",
      
      // Media fields
      logo_url: "", 
      banner_url: "",
      
      // Contact fields
      contact_email: "", 
      contact_phone: "", 
      contact_website: "", 
      social_links_array: [],
      
      // Description fields
      description: "", 
      tagline: "",
      
      // Additional fields
      business_structure: "",
      primary_market: "",
      business_stage: "",
      funding_source: "",
      competitive_advantage: "",
      future_plans: "",
      customer_segments: "",
      business_challenges: "",
      tech_stack: "",
      full_time_employees: null,
      part_time_employees: null,
      cultural_identity_array: [],
      languages_spoken_array: [],
    },
    mode: mode,
    autoSave: AUTO_SAVE_CONFIG.ON_BLUR,
    debug: process.env.NODE_ENV === 'development',
    autoSaveDelay: 2000,
    preserveData: true,
    dependencyFields: ['id'],
  });

  // 🔄 Local state for UI concerns only
  const [step, setStep] = useState(1);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

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
      case 1: // Business Identity
        return form.formData.name && form.formData.country && form.formData.industry;
      case 2: // Business Operations
        return form.formData.business_operating_status && form.formData.team_size_band;
      case 5: // Description
        return form.formData.description;
      default:
        return true;
    }
  };

  // 🎯 Social Links Management (using shared form helpers)
  const addSocialLink = (platform, url) => {
    if (!url.trim()) return;
    const existingLinks = Array.isArray(form.formData.social_links_array) ? form.formData.social_links_array : [];
    const filteredLinks = existingLinks.filter(link => link.platform !== platform);
    form.updateFields({ 
      social_links_array: [...filteredLinks, { platform, url: url.trim() }] 
    });
  };

  const removeSocialLink = (platform) => {
    const socialLinks = Array.isArray(form.formData.social_links_array) ? form.formData.social_links_array : [];
    const filteredLinks = socialLinks.filter(link => link.platform !== platform);
    form.updateFields({ social_links_array: filteredLinks });
  };

  const getSocialUrl = (platform) => {
    const socialLinks = Array.isArray(form.formData.social_links_array) ? form.formData.social_links_array : [];
    const link = socialLinks.find(link => link.platform === platform);
    return link?.url || "";
  };

  // 🎯 Image Upload Handler
  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (type === "logo") setUploadingLogo(true);
    else setUploadingBanner(true);

    try {
      // Upload file to Supabase storage
      const bucket = "admin-listings";
      const folder = type === "logo" ? "logos" : "banners";
      const filePath = `${folder}/${Date.now()}-${file.name}`;
      
      // Import getSupabase dynamically
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);
      
      const file_url = data.publicUrl;
      
      form.updateFields({
        [type === "logo" ? "logo_url" : "banner_url"]: file_url
      });
    } catch (error) {
      console.error('Upload failed:', error);
      alert(`Upload failed: ${error.message || 'Unable to upload image. Please try again.'}`);
    } finally {
      if (type === "logo") setUploadingLogo(false);
      else setUploadingBanner(false);
    }
  };

  // 🎯 Handle Generation
  const handleGenerateHandle = () => {
    if (form.formData.name) {
      const handle = form.formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      form.updateFields({ business_handle: handle });
    }
  };

  // 🎯 Form Submission
  const handleSubmit = async () => {
    try {
      await form.handleSave();
    } catch (error) {
      console.error('Form submission failed:', error);
    }
  };

  // 🎯 Input Classes
  const inputCls = "w-full min-h-[44px] border border-slate-300 rounded-xl px-4 py-3 text-sm text-[#0a1628] placeholder:text-slate-400 focus:outline-none focus:border-[#0d4f4f] focus:ring-2 focus:ring-[#0d4f4f]/10 bg-white shadow-sm";
  const textareaCls = "w-full border border-slate-300 rounded-xl px-4 py-3 text-sm text-[#0a1628] placeholder:text-slate-400 focus:outline-none focus:border-[#0d4f4f] focus:ring-2 focus:ring-[#0d4f4f]/10 bg-white resize-none shadow-sm";
  const selectCls = "w-full min-h-[44px] border border-slate-300 rounded-xl px-4 py-3 pr-10 text-sm text-[#0a1628] focus:outline-none focus:border-[#0d4f4f] focus:ring-2 focus:ring-[#0d4f4f]/10 bg-white appearance-none shadow-sm";
  const labelCls = "block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5";

  // 🎯 Notify parent when step changes
  useEffect(() => {
    if (onStepChange) {
      onStepChange({
        currentStep: step,
        canGoNext: () => canGoNext(),
        nextStep: () => setStep(s => s + 1),
        prevStep: () => setStep(s => s - 1),
        submit: () => handleSubmit()
      });
    }
  }, [step, form.formData]);

  return (
    <div className="space-y-6">
      {/* 🎯 Form Header with Status */}
      <div className="border-b border-gray-200 px-6 py-4 bg-gray-50 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#0a1628]">Detailed Business Form</h2>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-xs text-gray-500">
                {form.isDirty ? 'Unsaved changes' : 'All changes saved'}
              </span>
              {form.autoSaveStatus === 'saving' && (
                <span className="text-xs text-blue-600">Saving...</span>
              )}
              {form.autoSaveStatus === 'success' && (
                <span className="text-xs text-green-600">Saved!</span>
              )}
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
        {/* Step 1: Business Identity */}
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-[#0a1628]">Business Identity</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelCls}>Business Name *</label>
                <input
                  type="text"
                  value={form.formData.name || ""}
                  onChange={(e) => form.handleFieldChange("name", e.target.value)}
                  onBlur={handleGenerateHandle}
                  placeholder="e.g. Your Business Name"
                  className={`${inputCls} ${form.errors.name ? 'border-red-500' : ''}`}
                />
                {form.errors.name && (
                  <p className="mt-1 text-xs text-red-600">{form.errors.name}</p>
                )}
              </div>

              <div>
                <label className={labelCls}>Business Handle *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.formData.business_handle || ""}
                    onChange={(e) => form.handleFieldChange("business_handle", e.target.value)}
                    placeholder="tala-pacific-consulting"
                    className={inputCls}
                  />
                  <button
                    type="button"
                    onClick={handleGenerateHandle}
                    className="text-xs bg-[#0a1628] text-white px-3 py-2 rounded-xl hover:bg-[#122040] flex-shrink-0"
                  >
                    Auto
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">Unique URL identifier. Lowercase letters, numbers and hyphens only.</p>
              </div>

              <div>
                <label className={labelCls}>Country *</label>
                <select
                  value={form.formData.country || ""}
                  onChange={(e) => form.handleFieldChange("country", e.target.value)}
                  className={`${selectCls} ${form.errors.country ? 'border-red-500' : ''}`}
                >
                  <option value="">Select country</option>
                  {COUNTRIES.map(c => (
                    <option key={`country-${c.value}`} value={c.value}>{c.label}</option>
                  ))}
                </select>
                {form.errors.country && (
                  <p className="mt-1 text-xs text-red-600">{form.errors.country}</p>
                )}
              </div>

              <div>
                <label className={labelCls}>City</label>
                <input
                  type="text"
                  value={form.formData.city || ""}
                  onChange={(e) => form.handleFieldChange("city", e.target.value)}
                  placeholder="e.g. Auckland"
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Industry *</label>
                <select
                  value={form.formData.industry || ""}
                  onChange={(e) => form.handleFieldChange("industry", e.target.value)}
                  className={`${selectCls} ${form.errors.industry ? 'border-red-500' : ''}`}
                >
                  <option value="">Select industry</option>
                  {INDUSTRIES.map(c => (
                    <option key={`industry-${c.value}`} value={c.value}>{c.label}</option>
                  ))}
                </select>
                {form.errors.industry && (
                  <p className="mt-1 text-xs text-red-600">{form.errors.industry}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Business Operations */}
        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-[#0a1628]">Business Operations</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelCls}>Operating Status</label>
                <select
                  value={form.formData.business_operating_status || ""}
                  onChange={(e) => form.handleFieldChange("business_operating_status", e.target.value)}
                  className={selectCls}
                >
                  <option value="">Select status</option>
                  {BUSINESS_OPERATING_STATUS.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
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
                <label className={labelCls}>Revenue Band</label>
                <select
                  value={form.formData.revenue_band || ""}
                  onChange={(e) => form.handleFieldChange("revenue_band", e.target.value)}
                  className={selectCls}
                >
                  <option value="">Select revenue range</option>
                  {REVENUE_BAND.map(band => (
                    <option key={band.value} value={band.value}>{band.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelCls}>Sales Channels</label>
                <div className="space-y-2">
                  {SALES_CHANNELS.map(channel => (
                    <label key={channel.value} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={form.formData.sales_channels?.includes(channel.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            form.addArrayItem("sales_channels", channel.value);
                          } else {
                            form.removeArrayItem("sales_channels", form.formData.sales_channels.indexOf(channel.value));
                          }
                        }}
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
                {form.isSaving ? "Saving..." : "Submit Business"}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default DetailedBusinessFormRestored;
