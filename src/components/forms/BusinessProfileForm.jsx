"use client";

import { useState, useEffect } from "react";
import {
  Building2,
  ImageIcon,
  MapPin,
  Settings,
  TrendingUp,
  AlertCircle,
  Lightbulb,
} from "lucide-react";
import { BUSINESS_STATUS } from "@/constants/unifiedConstants";
import { transformBusinessFormData } from "@/utils/businessDataTransformer";
import { SUBSCRIPTION_TIER } from "@/constants/unifiedConstants";

// Import section components
import CoreInfoSection from "./FormSections/CoreInfoSection";
import BrandMediaSection from "./FormSections/BrandMediaSection";
import LocationSection from "./FormSections/LocationSection";
import BusinessOverviewSection from "./FormSections/BusinessOverviewSection";
import CommunitySection from "./FormSections/CommunitySection";
import { OptionCard, inputCls, textareaCls, selectCls, labelCls, helperCls, FormSection, badgeCls, cardCls, buttonCls, textXs, textSm, textBase } from "./shared/FormComponents";

// Form Sections Configuration
const SECTIONS = [
  {
    key: "core",
    label: "Core Business Info",
    icon: Building2,
    description: "Public-facing name, handle, and descriptions",
  },
  {
    key: "location",
    label: "Location & Operations",
    icon: MapPin,
    description: "Business location and industry classification",
  },
  {
    key: "overview",
    label: "Business Overview",
    icon: Building2,
    description: "Year started, structure, team size, and business operations",
  },
  {
    key: "community",
    label: "Community & Impact",
    icon: Lightbulb,
    description: "Collaboration interests, mentorship, and community engagement",
  },
  {
    key: "brand",
    label: "Brand & Media",
    icon: ImageIcon,
    description: "Logo, banner, and visual assets",
  },
];

// Section Fields Mapping
const SECTION_FIELDS = {
  core: ["name", "business_handle", "tagline", "description"],
  brand: ["logo_url", "banner_url", "mobile_banner_url"],
  location: ["country", "industry", "city"],
  overview: [
    "year_started",
    "business_structure",
    "team_size_band",
    "founder_story",
    "age_range",
    "gender",
  ],
  community: [
    "collaboration_interest",
    "mentorship_offering",
    "open_to_future_contact",
    "business_acquisition_interest",
  ],
};

export default function BusinessProfileForm({
  title = "Business Profile",
  businessId,
  initialData = null,
  onSave,
  onCancel,
  saving = false,
  mode = "create",
  showAdminFields = false,
  subscriptionTier = SUBSCRIPTION_TIER.VAKA,
  onUpgrade = null
}) {
  // Unified form state combining both forms
  const [form, setForm] = useState({
    // Core Business Info (from InlineBusinessForm)
    name: "",
    business_handle: "",
    tagline: "",
    description: "",
    
    // Brand Media (from InlineBusinessForm)
    logo_url: "",
    banner_url: "",
    mobile_banner_url: "",
    logo_file: null,
    banner_file: null,
    mobile_banner_file: null,
    
    // Ownership & Contact (from InlineBusinessForm)
    business_owner: "",
    business_owner_email: "",
    additional_owner_emails: [],
    contact_email: "",
    contact_phone: "",
    contact_website: "",
    business_hours: "",
    
    // Private Contact Details (from InlineBusinessForm)
    private_business_phone: "",
    private_business_email: "",
    
    // Location & Industry (from InlineBusinessForm)
    country: "",
    industry: "",
    city: "",
    
    // Business Details (moved from InlineBusinessForm)
    year_started: null,
    business_structure: "",
    team_size_band: "",
    
    // Founder Information
    founder_story: "",
    age_range: "",
    gender: "",
    
    // Status & Verification (admin only)
    status: BUSINESS_STATUS.ACTIVE,
    is_verified: false,
    is_claimed: false,
    is_homepage_featured: false,
    
    collaboration_interest: false,
    mentorship_offering: false,
    open_to_future_contact: false,
    business_acquisition_interest: false,
  });

  const [expandedSections, setExpandedSections] = useState(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errors, setErrors] = useState({ submit: undefined });

  // Initialize form with existing data
  useEffect(() => {
    if (initialData) {
      setForm((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  // Section Management
  const toggleSection = (sectionKey) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionKey)) {
        next.delete(sectionKey);
      } else {
        next.add(sectionKey);
      }
      return next;
    });
  };

  // Form Handlers
  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field, item) => {
    setForm((prev) => {
      const currentArray = prev[field] || [];

      if (currentArray.includes(item)) {
        return { ...prev, [field]: currentArray.filter((i) => i !== item) };
      }

      return { ...prev, [field]: [...currentArray, item] };
    });
  };

  // File Upload Handlers
  const handleFileUpload = (event, type) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const tempUrl = URL.createObjectURL(file);

      if (type === "logo") {
        setForm((prev) => ({
          ...prev,
          logo_url: tempUrl,
          logo_file: file,
        }));
      }

      if (type === "banner") {
        setForm((prev) => ({
          ...prev,
          banner_url: tempUrl,
          banner_file: file,
        }));
      }

      if (type === "mobile_banner") {
        setForm((prev) => ({
          ...prev,
          mobile_banner_url: tempUrl,
          mobile_banner_file: file,
        }));
      }
    } catch (error) {
      console.error("Error handling file upload:", error);
    }
  };

  const removeImage = (type) => {
    if (type === "logo") {
      setForm((prev) => ({
        ...prev,
        logo_url: "",
        logo_file: null,
      }));
    }

    if (type === "banner") {
      setForm((prev) => ({
        ...prev,
        banner_url: "",
        banner_file: null,
      }));
    }

    if (type === "mobile_banner") {
      setForm((prev) => ({
        ...prev,
        mobile_banner_url: "",
        mobile_banner_file: null,
      }));
    }
  };

  // Owner Email Handlers
  const addOwnerEmail = () => {
    setForm((prev) => ({
      ...prev,
      additional_owner_emails: [...(prev.additional_owner_emails || []), ""],
    }));
  };

  const updateOwnerEmail = (index, value) => {
    const currentEmails = form.additional_owner_emails || [];
    const newEmails = [...currentEmails];
    newEmails[index] = value;
    setForm({ ...form, additional_owner_emails: newEmails });
  };

  const removeOwnerEmail = (index) => {
    const currentEmails = form.additional_owner_emails || [];
    const newEmails = currentEmails.filter((_, i) => i !== index);
    setForm({ ...form, additional_owner_emails: newEmails });
  };

  // Save Handlers
  const saveSection = async (sectionData) => {
    setSubmitting(true);
    setErrors({ submit: undefined });

    try {
      const { businessesData, businessInsightsData } = transformBusinessFormData(form);
      
      await onSave({
        businessId,
        businessesData,
        businessInsightsData,
        files: {
          logo_file: form.logo_file,
          banner_file: form.banner_file,
          mobile_banner_file: form.mobile_banner_file,
        },
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (error) {
      console.error("Failed to save section:", error);
      setErrors((prev) => ({
        ...prev,
        submit: "Failed to save section. Please try again.",
      }));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({ submit: undefined });

    try {
      const { businessesData, businessInsightsData } = transformBusinessFormData(form);
      
      await onSave({
        businessId,
        businessesData,
        businessInsightsData,
        files: {
          logo_file: form.logo_file,
          banner_file: form.banner_file,
          mobile_banner_file: form.mobile_banner_file,
        },
        saveAll: true,
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (error) {
      console.error("Failed to save business profile:", error);
      setErrors((prev) => ({
        ...prev,
        submit: "Failed to save business profile. Please try again.",
      }));
    } finally {
      setSubmitting(false);
    }
  };

  const logoInputId = `${mode}-logo-upload-${businessId || "new"}`;
  const bannerInputId = `${mode}-banner-upload-${businessId || "new"}`;
  const mobileBannerInputId = `${mode}-mobile-banner-upload-${businessId || "new"}`;

  // Render Section Content
  const renderSectionContent = (sectionKey) => {
    switch (sectionKey) {
      case "core":
        return (
          <CoreInfoSection
            form={form}
            handleInputChange={handleInputChange}
            inputCls={inputCls}
            textareaCls={textareaCls}
            labelCls={labelCls}
            selectCls={selectCls}
          />
        );
      
      case "brand":
        return (
          <BrandMediaSection
            form={form}
            handleInputChange={handleInputChange}
            handleFileUpload={handleFileUpload}
            removeImage={removeImage}
            logoInputId={logoInputId}
            bannerInputId={bannerInputId}
            mobileBannerInputId={mobileBannerInputId}
            inputCls={inputCls}
            labelCls={labelCls}
            subscriptionTier={subscriptionTier}
            mode={mode}
          />
        );
      
      case "location":
        return (
          <LocationSection
            form={form}
            handleInputChange={handleInputChange}
            inputCls={inputCls}
            selectCls={selectCls}
            labelCls={labelCls}
          />
        );
      
      case "overview":
        return (
          <BusinessOverviewSection
            form={form}
            handleInputChange={handleInputChange}
            inputCls={inputCls}
            selectCls={selectCls}
            labelCls={labelCls}
            textareaCls={textareaCls}
          />
        );
      
      case "community":
        return (
          <CommunitySection
            form={form}
            handleInputChange={handleInputChange}
            toggleArrayItem={toggleArrayItem}
            inputCls={inputCls}
            labelCls={labelCls}
            textareaCls={textareaCls}
            selectCls={selectCls}
            helperCls={helperCls}
          />
        );
      
      default:
        return (
          <div className="p-4">
            <p className="text-slate-600">Section content for {sectionKey} will be implemented here.</p>
          </div>
        );
    }
  };

  return (
    <div className="rounded-2xl bg-white overflow-hidden max-w-full">
      <form onSubmit={handleSubmit} className="p-3 sm:p-8">
        <div className="space-y-3 sm:space-y-4 overflow-x-hidden">
          {SECTIONS.map((section) => (
            <FormSection
              key={section.key}
              title={section.label}
              subtitle={section.description}
              icon={section.icon}
              isOpen={expandedSections.has(section.key)}
              onToggle={() => toggleSection(section.key)}
              onSaveSection={() => saveSection(form)}
              saving={submitting}
              formData={form}
              errors={errors}
              mode={mode}
              tierInfo={section.key === "brand" ? { label: subscriptionTier } : null}
              onUpgrade={section.key === "brand" ? onUpgrade : null}
              sectionKey={section.key}
            >
              {renderSectionContent(section.key)}
            </FormSection>
          ))}

          {/* Global Save Actions */}
          <div className="flex justify-end items-center pt-6 border-t border-slate-200">
            <div className="flex gap-3">
              {saveSuccess && (
                <span className="text-green-600 text-sm font-medium">Saved successfully!</span>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-[#0d4f4f] px-4 py-2 text-xs sm:text-sm sm:px-6 sm:py-3 font-medium text-white hover:bg-[#0a3e3e] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Saving..." : "Save All"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
