"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, Save } from "lucide-react";
import { FormSectionCard } from "./FormSectionCard";
import { FormSectionTabs } from "./FormSectionTabs";
import { FormField, TextInput, TextArea, SelectInput } from "./FormFields";
import { useFormPersistence, useTabPersistenceWarning, useFormRestore } from "@/hooks/useFormPersistence";
import { useTabPersistenceWarning as useTabWarning, useFormRestore as useFormRestoreHook } from "@/hooks/useTabPersistenceWarning";
import { SUBSCRIPTION_TIER } from "@/constants/unifiedConstants";
import { VISIBILITY_TIER } from "@/constants/visibilityConstants";

export default function BusinessProfileFormRedesigned({
  title = "Create New Business",
  businessId = null,
  initialData = {},
  onSave,
  onCancel,
  saving = false,
  mode = "create",
  showAdminFields = false,
  subscriptionTier = SUBSCRIPTION_TIER.VAKA,
}) {
  // Generate unique form key for persistence
  const formKey = `business_${mode}_${businessId || 'new'}`;
  
  // Initial form data structure
  const initialFormData = {
    // Core Business Info
    business_name: "",
    business_handle: "",
    tagline: "",
    description: "",
    role: "",
    
    // Business Contact & Website
    business_contact_person: "",
    business_email: "",
    business_phone: "",
    business_website: "",
    business_hours: "",
    
    // Location
    address: "",
    suburb: "",
    state_region: "",
    postal_code: "",
    country: "",
    city: "",
    industry: "",
    
    // Business Overview
    year_started: "",
    business_structure: "",
    team_size: "",
    annual_revenue: "",
    target_market: "",
    unique_value: "",
    
    // Community
    cultural_identity: "",
    community_involvement: "",
    indigenous_partnership: false,
    community_story: "",
    
    // Social Media
    social_links: {
      facebook: "",
      instagram: "",
      linkedin: "",
      twitter: "",
      youtube: "",
      tiktok: "",
    },
    
    // Referral
    referral_source: "",
    referral_details: "",
    
    // Brand Media
    logo_url: "",
    banner_url: "",
    mobile_banner_url: "",
    
    // Admin fields
    status: "draft",
    visibility_tier: VISIBILITY_TIER.BASIC,
    is_featured: false,
    is_verified: false,
    subscription_tier: subscriptionTier,
    rejection_reason: "",
    admin_notes: "",
  };

  // Use form persistence hook
  const {
    formData,
    setFormData,
    updateFormData,
    updateField,
    resetForm,
    clearPersistedData,
    hasUnsavedChanges,
  } = useFormPersistence(formKey, initialFormData);

  // Add tab persistence warning
  useTabWarning(hasUnsavedChanges, `${mode} form`);
  
  // Check for restored data
  const { isRestored } = useFormRestoreHook(formKey, initialFormData);

  // Initialize with initialData if provided
  useState(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      // Merge initialData with current formData, preserving any unsaved changes
      const mergedData = { ...initialFormData, ...initialData };
      setFormData(mergedData);
    }
  });

  const [activeSection, setActiveSection] = useState("core");

  const updateFieldHandler = (field, value) => {
    updateField(field, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave?.(formData);
    clearPersistedData();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-6xl mx-auto">
      {/* Top bar */}
      <div className="sticky top-0 z-20 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950">
              {title}
            </h1>
            {isRestored && (
              <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                <CheckCircle2 size={16} />
                Form data restored from previous session
              </div>
            )}
            {hasUnsavedChanges() && (
              <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700">
                <AlertTriangle size={16} />
                Unsaved changes are being stored locally
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-teal-700 px-5 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-60"
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save Business"}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <FormSectionTabs
        activeSection={activeSection}
        onChange={setActiveSection}
      />

      {/* Section content */}
      {activeSection === "core" && (
        <FormSectionCard
          title="Core business information"
          description="Start with the basics people need to recognise and trust the business."
        >
          <FormField
            label="Business name"
            htmlFor="business_name"
            required
          >
            <TextInput
              id="business_name"
              placeholder="Pacific Creative Studio"
              value={formData.business_name}
              onChange={(e) => updateFieldHandler("business_name", e.target.value)}
            />
          </FormField>

          <FormField
            label="Business handle"
            htmlFor="business_handle"
            hint="Used for profile URLs. Keep it short and unique."
          >
            <TextInput
              id="business_handle"
              placeholder="pacific-creative-studio"
              value={formData.business_handle}
              onChange={(e) => updateFieldHandler("business_handle", e.target.value)}
            />
          </FormField>

          <div className="md:col-span-2">
            <FormField
              label="Tagline"
              htmlFor="tagline"
              hint="One clear sentence that explains the business fast."
            >
              <TextInput
                id="tagline"
                placeholder="Helping Pacific businesses grow online with practical systems."
                value={formData.tagline}
                onChange={(e) => updateFieldHandler("tagline", e.target.value)}
              />
            </FormField>
          </div>

          <div className="md:col-span-2">
            <FormField
              label="Business description"
              htmlFor="description"
              required
              hint="What you do, who you serve, and what makes you different."
            >
              <TextArea
                id="description"
                placeholder="Describe the business, your services, your audience, and the value you deliver..."
                value={formData.description}
                onChange={(e) => updateFieldHandler("description", e.target.value)}
              />
            </FormField>
          </div>

          <FormField label="Your role" htmlFor="role">
            <SelectInput
              id="role"
              value={formData.role}
              onChange={(e) => updateFieldHandler("role", e.target.value)}
            >
              <option value="">Select your role</option>
              <option value="founder">Founder</option>
              <option value="owner">Owner</option>
              <option value="director">Director</option>
              <option value="manager">Manager</option>
            </SelectInput>
          </FormField>

          <FormField label="Country" htmlFor="country" required>
            <TextInput
              id="country"
              placeholder="New Zealand"
              value={formData.country}
              onChange={(e) => updateFieldHandler("country", e.target.value)}
            />
          </FormField>

          <FormField label="City" htmlFor="city" required>
            <TextInput
              id="city"
              placeholder="Auckland"
              value={formData.city}
              onChange={(e) => updateFieldHandler("city", e.target.value)}
            />
          </FormField>
        </FormSectionCard>
      )}

      {activeSection === "location" && (
        <FormSectionCard
          title="Location & Operations"
          description="Where the business operates and its industry classification."
        >
          <FormField
            label="Street address"
            htmlFor="address"
          >
            <TextInput
              id="address"
              placeholder="123 Queen Street"
              value={formData.address}
              onChange={(e) => updateFieldHandler("address", e.target.value)}
            />
          </FormField>

          <FormField
            label="Suburb"
            htmlFor="suburb"
          >
            <TextInput
              id="suburb"
              placeholder="CBD"
              value={formData.suburb}
              onChange={(e) => updateFieldHandler("suburb", e.target.value)}
            />
          </FormField>

          <FormField
            label="State/Region"
            htmlFor="state_region"
          >
            <TextInput
              id="state_region"
              placeholder="Auckland"
              value={formData.state_region}
              onChange={(e) => updateFieldHandler("state_region", e.target.value)}
            />
          </FormField>

          <FormField
            label="Postal code"
            htmlFor="postal_code"
          >
            <TextInput
              id="postal_code"
              placeholder="1010"
              value={formData.postal_code}
              onChange={(e) => updateFieldHandler("postal_code", e.target.value)}
            />
          </FormField>

          <FormField
            label="Industry"
            htmlFor="industry"
            required
          >
            <SelectInput
              id="industry"
              value={formData.industry}
              onChange={(e) => updateFieldHandler("industry", e.target.value)}
            >
              <option value="">Select industry</option>
              <option value="technology">Technology</option>
              <option value="retail">Retail</option>
              <option value="hospitality">Hospitality</option>
              <option value="professional-services">Professional Services</option>
              <option value="creative">Creative</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="education">Education</option>
              <option value="health">Health</option>
              <option value="other">Other</option>
            </SelectInput>
          </FormField>
        </FormSectionCard>
      )}

      {activeSection === "contact" && (
        <FormSectionCard
          title="Contact Information"
          description="How customers can reach the business."
        >
          <FormField
            label="Contact person"
            htmlFor="business_contact_person"
          >
            <TextInput
              id="business_contact_person"
              placeholder="John Smith"
              value={formData.business_contact_person}
              onChange={(e) => updateFieldHandler("business_contact_person", e.target.value)}
            />
          </FormField>

          <FormField
            label="Business email"
            htmlFor="business_email"
            hint="Public email address for customer inquiries."
          >
            <TextInput
              id="business_email"
              type="email"
              placeholder="contact@business.com"
              value={formData.business_email}
              onChange={(e) => updateFieldHandler("business_email", e.target.value)}
            />
          </FormField>

          <FormField
            label="Business phone"
            htmlFor="business_phone"
          >
            <TextInput
              id="business_phone"
              placeholder="+64 9 123 4567"
              value={formData.business_phone}
              onChange={(e) => updateFieldHandler("business_phone", e.target.value)}
            />
          </FormField>

          <FormField
            label="Business website"
            htmlFor="business_website"
            hint="Include https:// or http://"
          >
            <TextInput
              id="business_website"
              placeholder="https://www.business.com"
              value={formData.business_website}
              onChange={(e) => updateFieldHandler("business_website", e.target.value)}
            />
          </FormField>

          <div className="md:col-span-2">
            <FormField
              label="Business hours"
              htmlFor="business_hours"
              hint="Regular operating hours"
            >
              <TextInput
                id="business_hours"
                placeholder="Mon-Fri 9am-5pm, Sat 10am-2pm"
                value={formData.business_hours}
                onChange={(e) => updateFieldHandler("business_hours", e.target.value)}
              />
            </FormField>
          </div>
        </FormSectionCard>
      )}

      {activeSection === "admin" && showAdminFields && (
        <FormSectionCard
          title="Admin Controls"
          description="Visibility and administrative settings for this business."
        >
          <FormField
            label="Status"
            htmlFor="status"
          >
            <SelectInput
              id="status"
              value={formData.status}
              onChange={(e) => updateFieldHandler("status", e.target.value)}
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="pending">Pending Review</option>
              <option value="rejected">Rejected</option>
            </SelectInput>
          </FormField>

          <FormField
            label="Visibility tier"
            htmlFor="visibility_tier"
          >
            <SelectInput
              id="visibility_tier"
              value={formData.visibility_tier}
              onChange={(e) => updateFieldHandler("visibility_tier", e.target.value)}
            >
              <option value={VISIBILITY_TIER.BASIC}>Basic</option>
              <option value={VISIBILITY_TIER.PREMIUM}>Premium</option>
              <option value={VISIBILITY_TIER.FEATURED}>Featured</option>
            </SelectInput>
          </FormField>

          <FormField
            label="Is featured"
            htmlFor="is_featured"
          >
            <SelectInput
              id="is_featured"
              value={formData.is_featured ? "true" : "false"}
              onChange={(e) => updateFieldHandler("is_featured", e.target.value === "true")}
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </SelectInput>
          </FormField>

          <FormField
            label="Is verified"
            htmlFor="is_verified"
          >
            <SelectInput
              id="is_verified"
              value={formData.is_verified ? "true" : "false"}
              onChange={(e) => updateFieldHandler("is_verified", e.target.value === "true")}
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </SelectInput>
          </FormField>

          <div className="md:col-span-2">
            <FormField
              label="Rejection reason"
              htmlFor="rejection_reason"
              hint="Only if status is rejected"
            >
              <TextArea
                id="rejection_reason"
                placeholder="Reason for rejection..."
                value={formData.rejection_reason}
                onChange={(e) => updateFieldHandler("rejection_reason", e.target.value)}
              />
            </FormField>
          </div>

          <div className="md:col-span-2">
            <FormField
              label="Admin notes"
              htmlFor="admin_notes"
              hint="Internal notes about this business"
            >
              <TextArea
                id="admin_notes"
                placeholder="Internal admin notes..."
                value={formData.admin_notes}
                onChange={(e) => updateFieldHandler("admin_notes", e.target.value)}
              />
            </FormField>
          </div>
        </FormSectionCard>
      )}

      {/* Bottom bar */}
      <div className="sticky bottom-0 z-20 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="inline-flex items-center gap-2 text-sm text-slate-500">
            <CheckCircle2 size={16} className="text-emerald-600" />
            Draft is stored locally while you work
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="h-11 rounded-xl bg-teal-700 px-5 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Business"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
