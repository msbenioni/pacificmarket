"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { AlertTriangle, CheckCircle2, Save } from "lucide-react";
import { FormSectionCard } from "./FormSectionCard";
import { FormSectionTabs } from "./FormSectionTabs";
import { FormField, TextInput, TextArea, SelectInput } from "./FormFields";
import { useFormPersistence } from "@/hooks/useFormPersistence";
import {
  useTabPersistenceWarning,
  useFormRestore,
} from "@/hooks/useTabPersistenceWarning";
import { BUSINESS_FORM_DEFAULTS } from "./businessFormDefaults";

export default function BusinessProfileFormFixed({
  title = "Create New Business",
  businessId = null,
  initialData = {},
  onSave,
  onCancel,
  saving = false,
  mode = "create",
  showAdminFields = false,
}) {
  // Generate unique form key for persistence
  // Use stable keys that don't change when switching between modes
  const formKey = useMemo(() => {
    if (businessId) {
      return `admin_dashboard_business_edit_${businessId}`;
    }
    return "admin_dashboard_business_create_draft";
  }, [businessId]);

  // Proper initialization with shared schema
  const mergedInitialData = useMemo(() => {
    return {
      ...BUSINESS_FORM_DEFAULTS,
      ...initialData,
      social_links: {
        ...BUSINESS_FORM_DEFAULTS.social_links,
        ...(initialData?.social_links || {}),
      },
    };
  }, [initialData]);

  // Use form persistence hook
  const {
    formData,
    setFormData,
    updateField,
    clearPersistedData,
    hasUnsavedChanges,
  } = useFormPersistence(formKey, mergedInitialData);

  // Add tab persistence warning
  useTabPersistenceWarning(hasUnsavedChanges, `${mode} form`);
  
  // Check for restored data
  const { isRestored } = useFormRestore(formKey, mergedInitialData);

  // Initialize form data properly
  useEffect(() => {
    setFormData((prev) => ({
      ...mergedInitialData,
      ...prev,
      social_links: {
        ...mergedInitialData.social_links,
        ...(prev?.social_links || {}),
      },
    }));
  }, [mergedInitialData, setFormData]);

  // UI state
  const [activeSection, setActiveSection] = useState("core");
  const [errors, setErrors] = useState({});

  // Section order for navigation
  const sectionOrder = showAdminFields
    ? ["core", "location", "overview", "contact", "social", "identity", "media", "referral", "admin"]
    : ["core", "location", "overview", "contact", "social", "identity", "media", "referral"];

  const currentIndex = sectionOrder.indexOf(activeSection);
  const isFirstSection = currentIndex === 0;
  const isLastSection = currentIndex === sectionOrder.length - 1;

  // Navigation functions
  const goBack = useCallback(() => {
    if (!isFirstSection) setActiveSection(sectionOrder[currentIndex - 1]);
  }, [isFirstSection, currentIndex, sectionOrder]);

  const goNext = useCallback(() => {
    if (!validateSection(activeSection)) return;
    if (!isLastSection) setActiveSection(sectionOrder[currentIndex + 1]);
  }, [activeSection, isLastSection, currentIndex, sectionOrder]);

  // Update field handlers
  const updateFieldHandler = useCallback((field, value) => {
    updateField(field, value);
    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [updateField, errors]);

  const updateSocialLink = useCallback((platform, value) => {
    updateField('social_links', {
      ...formData.social_links,
      [platform]: value
    });
  }, [updateField, formData.social_links]);

  // Section validation
  const validateSection = useCallback((section) => {
    const nextErrors = {};

    if (section === "core") {
      if (!formData.business_name?.trim()) nextErrors.business_name = "Business name is required";
      if (!formData.description?.trim()) nextErrors.description = "Description is required";
      if (!formData.industry?.trim()) nextErrors.industry = "Industry is required";
    }

    if (section === "location") {
      if (!formData.country?.trim()) nextErrors.country = "Country is required";
      if (!formData.city?.trim()) nextErrors.city = "City is required";
    }

    if (section === "contact") {
      if (!formData.business_email?.trim()) nextErrors.business_email = "Business email is required";
      if (formData.business_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.business_email)) {
        nextErrors.business_email = "Please enter a valid email address";
      }
    }

    setErrors(prev => ({ ...prev, ...nextErrors }));
    return Object.keys(nextErrors).length === 0;
  }, [formData]);

  // Form submission
  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();
    
    // Validate all sections
    let allValid = true;
    for (const section of sectionOrder) {
      if (!validateSection(section)) {
        allValid = false;
        // Switch to first invalid section
        setActiveSection(section);
        break;
      }
    }

    if (!allValid) return;

    try {
      await onSave?.(formData);
      clearPersistedData();
    } catch (error) {
      console.error("Form submission error:", error);
    }
  }, [formData, validateSection, sectionOrder, onSave, clearPersistedData]);

  const handleCancel = useCallback(() => {
    if (hasUnsavedChanges()) {
      if (window.confirm("You have unsaved changes. Are you sure you want to cancel?")) {
        onCancel?.();
      }
    } else {
      onCancel?.();
    }
  }, [hasUnsavedChanges, onCancel]);

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
              onClick={handleCancel}
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
            error={errors.business_name}
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
              error={errors.description}
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

          <FormField
            label="Industry"
            htmlFor="industry"
            required
            error={errors.industry}
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

          <FormField label="Business stage" htmlFor="business_stage">
            <SelectInput
              id="business_stage"
              value={formData.business_stage}
              onChange={(e) => updateFieldHandler("business_stage", e.target.value)}
            >
              <option value="">Select stage</option>
              <option value="idea">Idea/Concept</option>
              <option value="startup">Startup</option>
              <option value="growth">Growth</option>
              <option value="established">Established</option>
              <option value="mature">Mature</option>
            </SelectInput>
          </FormField>

          <FormField label="Business structure" htmlFor="business_structure">
            <SelectInput
              id="business_structure"
              value={formData.business_structure}
              onChange={(e) => updateFieldHandler("business_structure", e.target.value)}
            >
              <option value="">Select structure</option>
              <option value="sole-proprietor">Sole Proprietor</option>
              <option value="partnership">Partnership</option>
              <option value="company">Company</option>
              <option value="trust">Trust</option>
              <option value="other">Other</option>
            </SelectInput>
          </FormField>

          <FormField label="Year started" htmlFor="year_started">
            <TextInput
              id="year_started"
              placeholder="2020"
              value={formData.year_started}
              onChange={(e) => updateFieldHandler("year_started", e.target.value)}
            />
          </FormField>

          <FormField label="Team size" htmlFor="team_size_band">
            <SelectInput
              id="team_size_band"
              value={formData.team_size_band}
              onChange={(e) => updateFieldHandler("team_size_band", e.target.value)}
            >
              <option value="">Select team size</option>
              <option value="1">Just me</option>
              <option value="2-5">2-5 people</option>
              <option value="6-10">6-10 people</option>
              <option value="11-20">11-20 people</option>
              <option value="21-50">21-50 people</option>
              <option value="51+">51+ people</option>
            </SelectInput>
          </FormField>
        </FormSectionCard>
      )}

      {activeSection === "location" && (
        <FormSectionCard
          title="Location & Operations"
          description="Where the business operates and its geographical reach."
        >
          <FormField
            label="Country"
            htmlFor="country"
            required
            error={errors.country}
          >
            <TextInput
              id="country"
              placeholder="New Zealand"
              value={formData.country}
              onChange={(e) => updateFieldHandler("country", e.target.value)}
            />
          </FormField>

          <FormField
            label="City"
            htmlFor="city"
            required
            error={errors.city}
          >
            <TextInput
              id="city"
              placeholder="Auckland"
              value={formData.city}
              onChange={(e) => updateFieldHandler("city", e.target.value)}
            />
          </FormField>

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
            required
            error={errors.business_email}
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
        </FormSectionCard>
      )}

      {activeSection === "social" && (
        <FormSectionCard
          title="Social Media"
          description="Connect with customers on their preferred platforms."
        >
          <FormField label="Facebook" htmlFor="facebook">
            <TextInput
              id="facebook"
              placeholder="https://facebook.com/yourbusiness"
              value={formData.social_links.facebook}
              onChange={(e) => updateSocialLink("facebook", e.target.value)}
            />
          </FormField>

          <FormField label="Instagram" htmlFor="instagram">
            <TextInput
              id="instagram"
              placeholder="https://instagram.com/yourbusiness"
              value={formData.social_links.instagram}
              onChange={(e) => updateSocialLink("instagram", e.target.value)}
            />
          </FormField>

          <FormField label="LinkedIn" htmlFor="linkedin">
            <TextInput
              id="linkedin"
              placeholder="https://linkedin.com/company/yourbusiness"
              value={formData.social_links.linkedin}
              onChange={(e) => updateSocialLink("linkedin", e.target.value)}
            />
          </FormField>

          <FormField label="YouTube" htmlFor="youtube">
            <TextInput
              id="youtube"
              placeholder="https://youtube.com/yourbusiness"
              value={formData.social_links.youtube}
              onChange={(e) => updateSocialLink("youtube", e.target.value)}
            />
          </FormField>

          <FormField label="TikTok" htmlFor="tiktok">
            <TextInput
              id="tiktok"
              placeholder="https://tiktok.com/@yourbusiness"
              value={formData.social_links.tiktok}
              onChange={(e) => updateSocialLink("tiktok", e.target.value)}
            />
          </FormField>

          <FormField label="Website" htmlFor="website">
            <TextInput
              id="website"
              placeholder="https://yourbusiness.com"
              value={formData.social_links.website}
              onChange={(e) => updateSocialLink("website", e.target.value)}
            />
          </FormField>
        </FormSectionCard>
      )}

      {activeSection === "identity" && (
        <FormSectionCard
          title="Business Identity & Story"
          description="Share what makes your business unique and your community impact."
        >
          <div className="md:col-span-2">
            <FormField
              label="Founder story"
              htmlFor="founder_story"
              hint="The story behind starting your business"
            >
              <TextArea
                id="founder_story"
                placeholder="Share your journey and what inspired you to start this business..."
                value={formData.founder_story}
                onChange={(e) => updateFieldHandler("founder_story", e.target.value)}
              />
            </FormField>
          </div>

          <FormField label="Cultural identity" htmlFor="cultural_identity">
            <SelectInput
              id="cultural_identity"
              value={formData.cultural_identity}
              onChange={(e) => updateFieldHandler("cultural_identity", e.target.value)}
            >
              <option value="">Select cultural identity</option>
              <option value="māori">Māori</option>
              <option value="pasifika">Pasifika</option>
              <option value="asian">Asian</option>
              <option value="middle-eastern">Middle Eastern</option>
              <option value="african">African</option>
              <option value="european">European</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </SelectInput>
          </FormField>

          <FormField label="Languages spoken" htmlFor="languages_spoken">
            <TextInput
              id="languages_spoken"
              placeholder="English, Māori, Samoan"
              value={formData.languages_spoken}
              onChange={(e) => updateFieldHandler("languages_spoken", e.target.value)}
            />
          </FormField>

          <FormField label="Age range" htmlFor="age_range">
            <SelectInput
              id="age_range"
              value={formData.age_range}
              onChange={(e) => updateFieldHandler("age_range", e.target.value)}
            >
              <option value="">Select age range</option>
              <option value="18-24">18-24</option>
              <option value="25-34">25-34</option>
              <option value="35-44">35-44</option>
              <option value="45-54">45-54</option>
              <option value="55-64">55-64</option>
              <option value="65+">65+</option>
            </SelectInput>
          </FormField>

          <FormField label="Gender" htmlFor="gender">
            <SelectInput
              id="gender"
              value={formData.gender}
              onChange={(e) => updateFieldHandler("gender", e.target.value)}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </SelectInput>
          </FormField>

          <FormField label="Business registered" htmlFor="is_business_registered">
            <SelectInput
              id="is_business_registered"
              value={formData.is_business_registered ? "true" : "false"}
              onChange={(e) => updateFieldHandler("is_business_registered", e.target.value === "true")}
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </SelectInput>
          </FormField>
        </FormSectionCard>
      )}

      {activeSection === "media" && (
        <FormSectionCard
          title="Brand & Media"
          description="Upload your logo and banner to showcase your brand."
        >
          <FormField
            label="Logo URL"
            htmlFor="logo_url"
            hint="Direct link to your business logo"
          >
            <TextInput
              id="logo_url"
              placeholder="https://example.com/logo.png"
              value={formData.logo_url}
              onChange={(e) => updateFieldHandler("logo_url", e.target.value)}
            />
          </FormField>

          <FormField
            label="Banner URL"
            htmlFor="banner_url"
            hint="Direct link to your business banner"
          >
            <TextInput
              id="banner_url"
              placeholder="https://example.com/banner.png"
              value={formData.banner_url}
              onChange={(e) => updateFieldHandler("banner_url", e.target.value)}
            />
          </FormField>

          <FormField
            label="Mobile banner URL"
            htmlFor="mobile_banner_url"
            hint="Direct link to your mobile-optimized banner"
          >
            <TextInput
              id="mobile_banner_url"
              placeholder="https://example.com/mobile-banner.png"
              value={formData.mobile_banner_url}
              onChange={(e) => updateFieldHandler("mobile_banner_url", e.target.value)}
            />
          </FormField>
        </FormSectionCard>
      )}

      {activeSection === "referral" && (
        <FormSectionCard
          title="Referral Information"
          description="How did you hear about Pacific Discovery Network?"
        >
          <FormField
            label="Referred by business ID"
            htmlFor="referred_by_business_id"
            hint="If another business referred you"
          >
            <TextInput
              id="referred_by_business_id"
              placeholder="business-id-here"
              value={formData.referred_by_business_id || ""}
              onChange={(e) => updateFieldHandler("referred_by_business_id", e.target.value)}
            />
          </FormField>

          <FormField
            label="Referral code"
            htmlFor="referral_code"
            hint="If you have a referral code"
          >
            <TextInput
              id="referral_code"
              placeholder="REFERRAL-CODE"
              value={formData.referral_code}
              onChange={(e) => updateFieldHandler("referral_code", e.target.value)}
            />
          </FormField>
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
              <option value="pending">Pending Review</option>
              <option value="active">Active</option>
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
              <option value="none">None</option>
              <option value="basic">Basic</option>
              <option value="premium">Premium</option>
              <option value="featured">Featured</option>
            </SelectInput>
          </FormField>

          <FormField
            label="Visibility mode"
            htmlFor="visibility_mode"
          >
            <SelectInput
              id="visibility_mode"
              value={formData.visibility_mode}
              onChange={(e) => updateFieldHandler("visibility_mode", e.target.value)}
            >
              <option value="auto">Auto</option>
              <option value="manual">Manual</option>
              <option value="hidden">Hidden</option>
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

          <FormField
            label="Is active"
            htmlFor="is_active"
          >
            <SelectInput
              id="is_active"
              value={formData.is_active ? "true" : "false"}
              onChange={(e) => updateFieldHandler("is_active", e.target.value === "true")}
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </SelectInput>
          </FormField>

          <FormField label="Source" htmlFor="source">
            <TextInput
              id="source"
              placeholder="admin-dashboard"
              value={formData.source}
              onChange={(e) => updateFieldHandler("source", e.target.value)}
            />
          </FormField>

          <FormField label="Created via" htmlFor="created_via">
            <TextInput
              id="created_via"
              placeholder="web"
              value={formData.created_via}
              onChange={(e) => updateFieldHandler("created_via", e.target.value)}
            />
          </FormField>
        </FormSectionCard>
      )}

      {/* Navigation actions */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-slate-500">
          Step {currentIndex + 1} of {sectionOrder.length}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={goBack}
            disabled={isFirstSection}
            className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 disabled:opacity-50"
          >
            Back
          </button>

          {!isLastSection ? (
            <button
              type="button"
              onClick={goNext}
              className="h-11 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={saving}
              className="h-11 rounded-xl bg-teal-700 px-5 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Business"}
            </button>
          )}
        </div>
      </div>

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
              onClick={handleCancel}
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
