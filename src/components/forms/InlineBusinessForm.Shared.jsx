"use client";

import { useState, useEffect } from "react";
import {
  Upload,
  X,
  Plus,
  Users,
  Phone,
  PhoneCall,
  ImageIcon,
  Building2,
  MapPin,
  Settings,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { BUSINESS_STATUS } from "@/constants/unifiedConstants";
import { COUNTRIES, INDUSTRIES } from "@/constants/unifiedConstants";
import { 
  useSharedForm, 
  FORM_MODES, 
  AUTO_SAVE_CONFIG, 
  createValidator, 
  ValidationPatterns 
} from "@/hooks/useSharedForm";

function FormSection({ title, subtitle, icon: Icon, isOpen, onToggle, children, onSaveSection, saving, formData, errors }) {
  return (
    <div className="rounded-xl border border-slate-300 bg-white shadow-sm transition-all hover:shadow-md">
      <div className="w-full px-4 py-4 sm:px-6">
        <button
          type="button"
          onClick={onToggle}
          className="flex w-full items-start justify-between gap-3 text-left transition-colors"
        >
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <Icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#0d4f4f]" />
            <div className="min-w-0 flex-1">
              <h4 className="break-words text-sm font-semibold text-[#0a1628]">
                {title}
              </h4>
              <p className="mt-1 text-sm leading-5 text-slate-600">
                {subtitle}
              </p>
              {errors?.submit && (
                <p className="mt-1 text-xs text-red-600">{errors.submit}</p>
              )}
            </div>
          </div>

          <div className="mt-0.5 flex-shrink-0 text-slate-400">
            {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </div>
        </button>
      </div>

      {isOpen && (
        <>
          <div className="border-t border-slate-200 bg-slate-50 px-4 py-4 sm:px-6 sm:py-5 overflow-x-auto">
            <div className="min-w-0">
              {children}
            </div>
          </div>

          <div className="flex justify-end border-t border-slate-200 bg-gray-50 px-4 py-4 sm:px-6">
            <button
              type="button"
              onClick={() => onSaveSection(formData)}
              disabled={saving}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 flex-shrink-0"
            >
              {saving ? "Saving..." : "Save Section"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/**
 * 🏆 InlineBusinessForm with Shared Form Hook
 * 
 * This demonstrates the new standardized form pattern with:
 * - Consistent data flow
 * - Auto-save functionality
 * - Parent-child synchronization
 * - Built-in validation
 * - Debug logging
 */
const InlineBusinessFormShared = ({
  title = "Business Form",
  formData,
  setFormData,
  onSave,
  onCancel,
  saving = false,
  mode = "create",
  showAdminFields = false,
}) => {
  // 🎯 Shared Form Hook Configuration
  const form = useSharedForm({
    initialData: formData,
    onDataChange: (data, isDirty) => {
      // Keep parent in sync
      setFormData(data);
    },
    onSave: async (data, options) => {
      // Call the parent save function
      return await onSave(data);
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
      // Core listing details
      name: '',
      business_handle: '',
      tagline: '',
      description: '',
      
      // Brand media
      logo_url: '',
      banner_url: '',
      logo_file: null,
      banner_file: null,
      
      // Ownership & portal access
      business_owner: '',
      business_owner_email: '',
      additional_owner_emails: [],
      
      // Public contact info
      contact_email: '',
      public_phone: '',
      contact_website: '',
      business_hours: '',
      
      // Private contact details
      private_business_phone: '',
      private_business_email: '',
      
      // Location & industry
      country: '',
      industry: '',
      city: '',
      
      // Business details
      business_type: '',
      team_size: '',
      founded_year: '',
      
      // Status & verification (admin only)
      status: BUSINESS_STATUS.ACTIVE,
      verified: false,
      claimed: false,
      homepage_featured: false,
    },
    mode: formData?.id ? FORM_MODES.EDIT : FORM_MODES.CREATE,
    autoSave: AUTO_SAVE_CONFIG.ON_SECTION_TOGGLE,
    debug: process.env.NODE_ENV === 'development',
    autoSaveDelay: 1500,
    preserveData: true,
    dependencyFields: ['id'], // Re-initialize when business ID changes
  });

  // 🔄 Local state for UI concerns only
  const [expandedSections, setExpandedSections] = useState(new Set(["core"]));

  // 🎯 Section Management
  const toggleSection = (sectionKey) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionKey)) {
        next.delete(sectionKey);
        // Trigger auto-save when section closes
        if (form.autoSave === AUTO_SAVE_CONFIG.ON_SECTION_TOGGLE) {
          form.triggerAutoSave();
        }
      } else {
        next.add(sectionKey);
      }
      return next;
    });
  };

  // 🎯 File Upload Handlers
  const handleFileUpload = (event, type) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const tempUrl = URL.createObjectURL(file);

      if (type === "logo") {
        form.updateFields({
          logo_url: tempUrl,
          logo_file: file,
        });
      }

      if (type === "banner") {
        form.updateFields({
          banner_url: tempUrl,
          banner_file: file,
        });
      }
    } catch (error) {
      console.error("Error handling file upload:", error);
    }
  };

  const removeImage = (type) => {
    if (type === "logo") {
      form.updateFields({
        logo_url: "",
        logo_file: null,
      });
    }

    if (type === "banner") {
      form.updateFields({
        banner_url: "",
        banner_file: null,
      });
    }
  };

  // 🎯 Owner Email Handlers
  const addOwnerEmail = () => {
    form.addArrayItem("additional_owner_emails", "");
  };

  const updateOwnerEmail = (index, value) => {
    const currentEmails = form.formData.additional_owner_emails || [];
    const newEmails = [...currentEmails];
    newEmails[index] = value;
    form.updateFields({ additional_owner_emails: newEmails });
  };

  const removeOwnerEmail = (index) => {
    form.removeArrayItem("additional_owner_emails", index);
  };

  // 🎯 Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    form.handleSave();
  };

  // 🎯 Save Section
  const saveSection = (sectionData) => {
    form.triggerAutoSave();
  };

  // 🎯 Input Classes
  const inputCls =
    "w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-[#0d4f4f] focus:outline-none";
  const textareaCls =
    "w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-[#0d4f4f] focus:outline-none";
  const selectCls =
    "w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-[#0d4f4f] focus:outline-none";

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

  const logoInputId = `${mode}-logo-upload-${form.formData?.id || "new"}`;
  const bannerInputId = `${mode}-banner-upload-${form.formData?.id || "new"}`;

  return (
    <div className="rounded-2xl bg-white overflow-hidden max-w-full">
      {/* 🎯 Form Header with Status */}
      <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#0a1628]">{title}</h2>
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

      <form onSubmit={handleSubmit} className="p-4 sm:p-8">
        <div className="space-y-4 overflow-x-hidden">
          {/* 🎯 Core Details Section */}
          <FormSection
            title="Core listing details"
            subtitle="Public-facing name, handle, and descriptions"
            icon={Building2}
            isOpen={expandedSections.has("core")}
            onToggle={() => toggleSection("core")}
            onSaveSection={saveSection}
            saving={form.isSaving}
            formData={form.formData}
            errors={form.errors}
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Business Name *
                  {form.errors.name && <span className="text-red-500 ml-1">*</span>}
                </label>
                <input
                  type="text"
                  value={form.formData?.name || ""}
                  onChange={(e) => form.handleFieldChange("name", e.target.value)}
                  className={`${inputCls} ${form.errors.name ? 'border-red-500' : ''}`}
                  required
                />
                {form.errors.name && (
                  <p className="mt-1 text-xs text-red-600">{form.errors.name}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Business Handle</label>
                <input
                  type="text"
                  value={form.formData?.business_handle || ""}
                  onChange={(e) => form.handleFieldChange("business_handle", e.target.value)}
                  className={inputCls}
                  placeholder="unique-business-handle"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">Tagline</label>
                <textarea
                  rows={3}
                  value={form.formData?.tagline || ""}
                  onChange={(e) => form.handleFieldChange("tagline", e.target.value)}
                  className={textareaCls}
                  placeholder="Brief description for listing cards"
                  maxLength={150}
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">Full Description</label>
                <textarea
                  rows={15}
                  value={form.formData?.description || ""}
                  onChange={(e) => form.handleFieldChange("description", e.target.value)}
                  className={textareaCls}
                  placeholder="Detailed business description"
                />
              </div>
            </div>
          </FormSection>

          {/* 🎯 Brand Media Section */}
          <FormSection
            title="Brand media"
            subtitle="Logo and banner for the public profile"
            icon={ImageIcon}
            isOpen={expandedSections.has("media")}
            onToggle={() => toggleSection("media")}
            onSaveSection={saveSection}
            saving={form.isSaving}
            formData={form.formData}
            errors={form.errors}
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Logo</label>
                <div className="flex items-start gap-4">
                  {form.formData?.logo_url ? (
                    <div className="relative">
                      <div className="h-16 w-16 overflow-hidden rounded-2xl border-2 border-white bg-gradient-to-br from-[#0a1628] to-[#0d4f4f] shadow-md">
                        <img
                          src={form.formData.logo_url}
                          alt="Logo preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage("logo")}
                        className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="h-16 w-16 overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <input
                      id={logoInputId}
                      type="file"
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={(e) => handleFileUpload(e, "logo")}
                      className="hidden"
                    />
                    <label
                      htmlFor={logoInputId}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-500 px-3 py-2 text-sm font-medium text-white hover:bg-blue-600"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Logo
                    </label>
                    <p className="mt-2 text-xs text-slate-500">PNG, JPG up to 2MB</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Banner Image</label>
                <div className="flex items-start gap-4">
                  {form.formData?.banner_url ? (
                    <div className="relative">
                      <div className="h-20 w-48 overflow-hidden rounded-lg bg-gradient-to-br from-[#0a1628] to-[#0d4f4f]">
                        <img
                          src={form.formData.banner_url}
                          alt="Banner preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage("banner")}
                        className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="h-20 w-48 overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <input
                      id={bannerInputId}
                      type="file"
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={(e) => handleFileUpload(e, "banner")}
                      className="hidden"
                    />
                    <label
                      htmlFor={bannerInputId}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-500 px-3 py-2 text-sm font-medium text-white hover:bg-blue-600"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Banner
                    </label>
                    <p className="mt-2 text-xs text-slate-500">PNG, JPG up to 5MB</p>
                  </div>
                </div>
              </div>
            </div>
          </FormSection>

          {/* 🎯 Location & Industry Section */}
          <FormSection
            title="Location & Industry"
            subtitle="Business location and industry classification"
            icon={MapPin}
            isOpen={expandedSections.has("location")}
            onToggle={() => toggleSection("location")}
            onSaveSection={saveSection}
            saving={form.isSaving}
            formData={form.formData}
            errors={form.errors}
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Country *
                  {form.errors.country && <span className="text-red-500 ml-1">*</span>}
                </label>
                <select
                  value={form.formData?.country || ""}
                  onChange={(e) => form.handleFieldChange("country", e.target.value)}
                  className={`${selectCls} ${form.errors.country ? 'border-red-500' : ''}`}
                  required
                >
                  <option value="">Select country</option>
                  {COUNTRIES.map((country) => (
                    <option key={country.value} value={country.value}>
                      {country.label}
                    </option>
                  ))}
                </select>
                {form.errors.country && (
                  <p className="mt-1 text-xs text-red-600">{form.errors.country}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Industry *
                  {form.errors.industry && <span className="text-red-500 ml-1">*</span>}
                </label>
                <select
                  value={form.formData?.industry || ""}
                  onChange={(e) => form.handleFieldChange("industry", e.target.value)}
                  className={`${selectCls} ${form.errors.industry ? 'border-red-500' : ''}`}
                  required
                >
                  <option value="">Select industry</option>
                  {INDUSTRIES.map((industry) => (
                    <option key={industry.value} value={industry.value}>
                      {industry.label}
                    </option>
                  ))}
                </select>
                {form.errors.industry && (
                  <p className="mt-1 text-xs text-red-600">{form.errors.industry}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">City</label>
                <input
                  type="text"
                  value={form.formData?.city || ""}
                  onChange={(e) => form.handleFieldChange("city", e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>
          </FormSection>

          {/* 🎯 Admin Fields (Conditional) */}
          {showAdminFields && (
            <FormSection
              title="Admin Settings"
              subtitle="Administrative controls and verification status"
              icon={Settings}
              isOpen={expandedSections.has("admin")}
              onToggle={() => toggleSection("admin")}
              onSaveSection={saveSection}
              saving={form.isSaving}
              formData={form.formData}
              errors={form.errors}
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3">
                  <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={!!form.formData?.is_verified}
                      onChange={(e) => form.handleFieldChange("is_verified", e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300"
                    />
                    Verified
                  </label>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3">
                  <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={!!form.formData?.claimed}
                      onChange={(e) => form.handleFieldChange("claimed", e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300"
                    />
                    Claimed
                  </label>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3">
                  <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={!!form.formData?.homepage_featured}
                      onChange={(e) => form.handleFieldChange("homepage_featured", e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300"
                    />
                    Homepage Featured
                  </label>
                </div>
              </div>
            </FormSection>
          )}
        </div>

        {/* 🎯 Form Actions */}
        <div className="border-t border-gray-200 px-0 pt-5 mt-6 flex justify-between items-center">
          <div className="text-xs text-gray-500">
            {form.isDirty && 'You have unsaved changes'}
          </div>
          <div className="flex gap-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={form.isSaving || !form.isDirty}
              className="rounded-xl bg-[#0d4f4f] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0a3d3d] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {form.isSaving ? "Saving..." : "Save All Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InlineBusinessFormShared;
