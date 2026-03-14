"use client";

import { useState } from "react";
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

function FormSection({ title, subtitle, icon: Icon, isOpen, onToggle, children, onSaveSection, saving }) {
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
              onClick={onSaveSection}
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
  const [expandedSections, setExpandedSections] = useState(new Set(["core"]));

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleSection = (sectionKey) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionKey)) next.delete(sectionKey);
      else next.add(sectionKey);
      return next;
    });
  };

  const handleFileUpload = (event, type) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const tempUrl = URL.createObjectURL(file);

      if (type === "logo") {
        setFormData((prev) => ({
          ...prev,
          logo_url: tempUrl,
          logo_file: file,
        }));
      }

      if (type === "banner") {
        setFormData((prev) => ({
          ...prev,
          banner_url: tempUrl,
          banner_file: file,
        }));
      }
    } catch (error) {
      console.error("Error handling file upload:", error);
    }
  };

  const removeImage = (type) => {
    if (type === "logo") {
      setFormData((prev) => ({
        ...prev,
        logo_url: "",
        logo_file: null,
      }));
    }

    if (type === "banner") {
      setFormData((prev) => ({
        ...prev,
        banner_url: "",
        banner_file: null,
      }));
    }
  };

  const addOwnerEmail = () => {
    setFormData((prev) => ({
      ...prev,
      additional_owner_emails: [...(prev.additional_owner_emails || []), ""],
    }));
  };

  const updateOwnerEmail = (index, value) => {
    setFormData((prev) => {
      const next = [...(prev.additional_owner_emails || [])];
      next[index] = value;
      return {
        ...prev,
        additional_owner_emails: next,
      };
    });
  };

  const removeOwnerEmail = (index) => {
    setFormData((prev) => ({
      ...prev,
      additional_owner_emails: (prev.additional_owner_emails || []).filter(
        (_, i) => i !== index
      ),
    }));
  };

  const logoInputId = `${mode}-logo-upload-${formData?.id || "new"}`;
  const bannerInputId = `${mode}-banner-upload-${formData?.id || "new"}`;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

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
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Business Name *</label>
                <input
                  type="text"
                  value={formData?.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={inputCls}
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Business Handle</label>
                <input
                  type="text"
                  value={formData?.business_handle || ""}
                  onChange={(e) => handleInputChange("business_handle", e.target.value)}
                  className={inputCls}
                  placeholder="unique-business-handle"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">Short Description</label>
                <textarea
                  rows={3}
                  value={formData?.short_description || ""}
                  onChange={(e) => handleInputChange("short_description", e.target.value)}
                  className={textareaCls}
                  placeholder="Brief description for listing cards"
                  maxLength={150}
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">Full Description</label>
                <textarea
                  rows={15}
                  value={formData?.description || ""}
                  onChange={(e) => handleInputChange("description", e.target.value)}
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
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Logo</label>
                <div className="flex items-start gap-4">
                  {formData?.logo_url ? (
                    <div className="relative">
                      <div className="h-16 w-16 overflow-hidden rounded-2xl border-2 border-white bg-gradient-to-br from-[#0a1628] to-[#0d4f4f] shadow-md">
                        <img
                          src={formData.logo_url}
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
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50">
                      <span className="text-center text-xs text-slate-400">No logo</span>
                    </div>
                  )}

                  <div>
                    <input
                      type="file"
                      accept="image/*"
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
                  {formData?.banner_url ? (
                    <div className="relative">
                      <div className="h-20 w-48 overflow-hidden rounded-lg bg-gradient-to-br from-[#0a1628] to-[#0d4f4f]">
                        <img
                          src={formData.banner_url}
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
                    <div className="flex h-20 w-48 items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50">
                      <span className="text-center text-xs text-slate-400">No banner</span>
                    </div>
                  )}

                  <div>
                    <input
                      type="file"
                      accept="image/*"
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
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Business Owner</label>
                <input
                  type="text"
                  value={formData?.business_owner || ""}
                  onChange={(e) => handleInputChange("business_owner", e.target.value)}
                  className={inputCls}
                  placeholder="Primary business owner"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Business Owner Email</label>
                <input
                  type="email"
                  value={formData?.business_owner_email || ""}
                  onChange={(e) => handleInputChange("business_owner_email", e.target.value)}
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
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Public Contact Email</label>
                <input
                  type="email"
                  value={formData?.contact_email || ""}
                  onChange={(e) => handleInputChange("contact_email", e.target.value)}
                  className={inputCls}
                  placeholder="public@email.com"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Public Contact Phone</label>
                <input
                  type="tel"
                  value={formData?.public_phone || ""}
                  onChange={(e) => handleInputChange("public_phone", e.target.value)}
                  className={inputCls}
                  placeholder="Public phone number"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Website</label>
                <input
                  type="url"
                  value={formData?.contact_website || ""}
                  onChange={(e) => handleInputChange("contact_website", e.target.value)}
                  className={inputCls}
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Business Hours</label>
                <input
                  type="text"
                  value={formData?.business_hours || ""}
                  onChange={(e) => handleInputChange("business_hours", e.target.value)}
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
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Private Business Phone</label>
                <input
                  type="tel"
                  value={formData?.private_business_phone || ""}
                  onChange={(e) => handleInputChange("private_business_phone", e.target.value)}
                  className={inputCls}
                  placeholder="Internal business phone number"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Private Business Email</label>
                <input
                  type="email"
                  value={formData?.private_business_email || ""}
                  onChange={(e) => handleInputChange("private_business_email", e.target.value)}
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
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Country *</label>
                <select
                  value={formData?.country || ""}
                  onChange={(e) => handleInputChange("country", e.target.value)}
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
                  onChange={(e) => handleInputChange("industry", e.target.value)}
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
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className={inputCls}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Suburb</label>
                <input
                  type="text"
                  value={formData?.suburb || ""}
                  onChange={(e) => handleInputChange("suburb", e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium text-slate-700">Address</label>
              <input
                type="text"
                value={formData?.address || ""}
                onChange={(e) => handleInputChange("address", e.target.value)}
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
                  onChange={(e) => handleInputChange("state_region", e.target.value)}
                  className={inputCls}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Postal Code</label>
                <input
                  type="text"
                  value={formData?.postal_code || ""}
                  onChange={(e) => handleInputChange("postal_code", e.target.value)}
                  className={inputCls}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Year Started</label>
                <input
                  type="number"
                  value={formData?.year_started ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    handleInputChange("year_started", value === "" ? null : Number(value));
                  }}
                  className={inputCls}
                  min="1900"
                  max={new Date().getFullYear()}
                  placeholder="2020"
                />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Business Structure</label>
                <select
                  value={formData?.business_structure || ""}
                  onChange={(e) => handleInputChange("business_structure", e.target.value)}
                  className={selectCls}
                >
                  <option value="">Select Structure</option>
                  <option value="sole-proprietorship">Sole Proprietorship</option>
                  <option value="partnership">Partnership</option>
                  <option value="llc">LLC</option>
                  <option value="corporation">Corporation</option>
                  <option value="non-profit">Non-Profit</option>
                  <option value="cooperative">Cooperative</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Team Size</label>
                <select
                  value={formData?.team_size_band || ""}
                  onChange={(e) => handleInputChange("team_size_band", e.target.value)}
                  className={selectCls}
                >
                  <option value="">Select Team Size</option>
                  <option value="1">1 person</option>
                  <option value="2-5">2-5 people</option>
                  <option value="6-10">6-10 people</option>
                  <option value="11-20">11-20 people</option>
                  <option value="21-50">21-50 people</option>
                  <option value="51-100">51-100 people</option>
                  <option value="100+">100+ people</option>
                </select>
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
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Subscription Tier</label>
                  <select
                    value={formData?.subscription_tier || "vaka"}
                    onChange={(e) => handleInputChange("subscription_tier", e.target.value)}
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
                    onChange={(e) => handleInputChange("status", e.target.value)}
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
                      checked={!!formData?.verified}
                      onChange={(e) => handleInputChange("verified", e.target.checked)}
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
                      onChange={(e) => handleInputChange("claimed", e.target.checked)}
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
                      onChange={(e) => handleInputChange("homepage_featured", e.target.checked)}
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
            onClick={onSave}
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