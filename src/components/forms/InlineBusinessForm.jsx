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

function FormSection({ title, subtitle, icon: Icon, isOpen, onToggle, children, onSaveSection, saving, formData }) {
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

const InlineBusinessForm = ({
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
      contact_phone: '',
      contact_website: '',
      business_hours: '',
      
      // Private contact details
      private_business_phone: '',
      private_business_email: '',
      
      // Location & industry
      country: '',
      industry: '',
      city: '',
      
      // Status & verification (admin only)
      status: BUSINESS_STATUS.ACTIVE,
      is_verified: false,
      is_claimed: false,
      is_homepage_featured: false,
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

  // Pacific Market default assets
  const defaultLogoUrl = "/pm_logo.png";
  const defaultBannerUrl = "/pm_logo_longbanner.png";

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

  const logoInputId = `${mode}-logo-upload-${form.formData?.id || "new"}`;
  const bannerInputId = `${mode}-banner-upload-${form.formData?.id || "new"}`;

  const inputCls =
    "w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-[#0d4f4f] focus:outline-none";
  const textareaCls =
    "w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-[#0d4f4f] focus:outline-none";
  const selectCls =
    "w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-[#0d4f4f] focus:outline-none";

  return (
    <div className="rounded-2xl bg-white overflow-hidden max-w-full">
      <form onSubmit={handleSubmit} className="p-4 sm:p-8">
        <div className="space-y-4 overflow-x-hidden">
          <FormSection
            title="Core listing details"
            subtitle="Public-facing name, handle, and descriptions"
            icon={Building2}
            isOpen={expandedSections.has("core")}
            onToggle={() => toggleSection("core")}
            onSaveSection={onSave}
            saving={saving}
            formData={formData}
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Business Name *</label>
                <input
                  type="text"
                  value={form.formData?.name || ""}
                  onChange={(e) => form.handleFieldChange("name", e.target.value)}
                  className={inputCls}
                  required
                />
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

          <FormSection
            title="Brand media"
            subtitle="Logo and banner for the public profile"
            icon={ImageIcon}
            isOpen={expandedSections.has("media")}
            onToggle={() => toggleSection("media")}
            onSaveSection={onSave}
            saving={saving}
            formData={formData}
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
                    <div className="relative">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-slate-200 bg-white shadow-sm">
                        <img
                          src={defaultLogoUrl}
                          alt="Pacific Market logo"
                          className="h-full w-full object-cover rounded-2xl"
                        />
                      </div>
                      <div className="absolute bottom-0 right-0 rounded-full bg-black/50 px-1.5 py-0.5">
                        <span className="text-[10px] text-white">Default</span>
                      </div>
                    </div>
                  )}

                  <div>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={(e) => handleFileUpload(e, "logo")}
                      className="hidden"
                      id={logoInputId}
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
                    <div className="relative">
                      <div className="h-20 w-48 overflow-hidden rounded-lg bg-gradient-to-br from-[#0a1628] to-[#0d4f4f]">
                        <img
                          src={defaultBannerUrl}
                          alt="Pacific Market banner"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="absolute bottom-1 right-1 rounded-full bg-black/50 px-2 py-1">
                        <span className="text-xs text-white">Default</span>
                      </div>
                    </div>
                  )}

                  <div>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={(e) => handleFileUpload(e, "banner")}
                      className="hidden"
                      id={bannerInputId}
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

          <FormSection
            title="Ownership & portal access"
            subtitle="Primary owner and additional owner access"
            icon={Users}
            isOpen={expandedSections.has("owners")}
            onToggle={() => toggleSection("owners")}
            onSaveSection={onSave}
            saving={saving}
            formData={formData}
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Business Owner</label>
                <input
                  type="text"
                  value={formData?.business_owner || ""}
                  onChange={(e) => form.handleFieldChange("business_owner", e.target.value)}
                  className={inputCls}
                  placeholder="Primary business owner"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Business Owner Email</label>
                <input
                  type="email"
                  value={formData?.business_owner_email || ""}
                  onChange={(e) => form.handleFieldChange("business_owner_email", e.target.value)}
                  className={inputCls}
                  placeholder="owner@email.com"
                />
              </div>
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Additional Business Owners
                  </label>
                  <p className="mt-1 text-xs text-slate-500">
                    Add portal access for more business owners.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addOwnerEmail}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-[#0a1628] hover:bg-slate-50"
                >
                  <Plus className="h-4 w-4" />
                  Add Owner
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {(formData?.additional_owner_emails || []).length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                    No additional owners added yet.
                  </div>
                ) : (
                  (formData?.additional_owner_emails || []).map((email, index) => (
                    <div
                      key={index}
                      className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:flex-row"
                    >
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => updateOwnerEmail(index, e.target.value)}
                        className={inputCls}
                        placeholder="additional-owner@email.com"
                      />
                      <button
                        type="button"
                        onClick={() => removeOwnerEmail(index)}
                        className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-white px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </FormSection>

          <FormSection
            title="Public contact details"
            subtitle="These may appear on the public listing"
            icon={Phone}
            isOpen={expandedSections.has("publicContact")}
            onToggle={() => toggleSection("publicContact")}
            onSaveSection={onSave}
            saving={saving}
            formData={formData}
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Public Contact Email</label>
                <input
                  type="email"
                  value={formData?.contact_email || ""}
                  onChange={(e) => form.handleFieldChange("contact_email", e.target.value)}
                  className={inputCls}
                  placeholder="public@email.com"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Public Contact Phone</label>
                <input
                  type="tel"
                  value={formData?.contact_phone || ""}
                  onChange={(e) => form.handleFieldChange("contact_phone", e.target.value)}
                  className={inputCls}
                  placeholder="Public phone number"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Website</label>
                <input
                  type="url"
                  value={formData?.contact_website || ""}
                  onChange={(e) => form.handleFieldChange("contact_website", e.target.value)}
                  className={inputCls}
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Business Hours</label>
                <input
                  type="text"
                  value={formData?.business_hours || ""}
                  onChange={(e) => form.handleFieldChange("business_hours", e.target.value)}
                  className={inputCls}
                  placeholder="Mon-Fri 9AM-5PM"
                />
              </div>
            </div>
          </FormSection>

          <FormSection
            title="Private business contact"
            subtitle="Internal management contact details only"
            icon={PhoneCall}
            isOpen={expandedSections.has("privateContact")}
            onToggle={() => toggleSection("privateContact")}
            onSaveSection={onSave}
            saving={saving}
            formData={formData}
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Private Business Phone</label>
                <input
                  type="tel"
                  value={formData?.private_business_phone || ""}
                  onChange={(e) => form.handleFieldChange("private_business_phone", e.target.value)}
                  className={inputCls}
                  placeholder="Internal business phone number"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Private Business Email</label>
                <input
                  type="email"
                  value={formData?.private_business_email || ""}
                  onChange={(e) => form.handleFieldChange("private_business_email", e.target.value)}
                  className={inputCls}
                  placeholder="Internal email"
                />
              </div>
            </div>
          </FormSection>

          <FormSection
            title="Location & classification"
            subtitle="Industry, address, structure, and operating details"
            icon={MapPin}
            isOpen={expandedSections.has("location")}
            onToggle={() => toggleSection("location")}
            onSaveSection={onSave}
            saving={saving}
            formData={formData}
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Country *</label>
                <select
                  value={formData?.country || ""}
                  onChange={(e) => form.handleFieldChange("country", e.target.value)}
                  className={selectCls}
                  required
                >
                  <option value="">Select Country</option>
                  {COUNTRIES.map((country) => (
                    <option key={country.value} value={country.value}>
                      {country.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Industry *</label>
                <select
                  value={formData?.industry || ""}
                  onChange={(e) => form.handleFieldChange("industry", e.target.value)}
                  className={selectCls}
                  required
                >
                  <option value="">Select Industry</option>
                  {INDUSTRIES.map((industry) => (
                    <option key={industry.value} value={industry.value}>
                      {industry.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">City</label>
                <input
                  type="text"
                  value={formData?.city || ""}
                  onChange={(e) => form.handleFieldChange("city", e.target.value)}
                  className={inputCls}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Suburb</label>
                <input
                  type="text"
                  value={formData?.suburb || ""}
                  onChange={(e) => form.handleFieldChange("suburb", e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium text-slate-700">Address</label>
              <input
                type="text"
                value={formData?.address || ""}
                onChange={(e) => form.handleFieldChange("address", e.target.value)}
                className={inputCls}
                placeholder="Street address"
              />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">State/Region</label>
                <input
                  type="text"
                  value={formData?.state_region || ""}
                  onChange={(e) => form.handleFieldChange("state_region", e.target.value)}
                  className={inputCls}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Postal Code</label>
                <input
                  type="text"
                  value={formData?.postal_code || ""}
                  onChange={(e) => form.handleFieldChange("postal_code", e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>
          </FormSection>

          {showAdminFields && (
            <FormSection
              title="Admin controls"
              subtitle="Visibility, status, and subscription level"
              icon={Settings}
              isOpen={expandedSections.has("admin")}
              onToggle={() => toggleSection("admin")}
              onSaveSection={onSave}
              saving={saving}
              formData={formData}
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Subscription Tier</label>
                  <select
                    value={formData?.subscription_tier || "vaka"}
                    onChange={(e) => form.handleFieldChange("subscription_tier", e.target.value)}
                    className={selectCls}
                  >
                    <option value="vaka">Vaka (Free)</option>
                    <option value="mana">Mana (Premium)</option>
                    <option value="moana">Moana (Featured+)</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
                  <select
                    value={formData?.status || BUSINESS_STATUS.PENDING}
                    onChange={(e) => form.handleFieldChange("status", e.target.value)}
                    className={selectCls}
                  >
                    <option value={BUSINESS_STATUS.PENDING}>Pending</option>
                    <option value={BUSINESS_STATUS.ACTIVE}>Active</option>
                    <option value={BUSINESS_STATUS.REJECTED}>Rejected</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3">
                  <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={!!formData?.is_verified}
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
                      checked={!!formData?.claimed}
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
                      checked={!!formData?.homepage_featured}
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

        <div className="border-t border-gray-200 px-0 pt-5 mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => onSave(formData)}
            disabled={saving}
            className="rounded-xl bg-[#0d4f4f] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0a3d3d] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save All Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InlineBusinessForm;