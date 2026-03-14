"use client";

import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  Building2,
  ImageIcon,
  MapPin,
  Settings,
  TrendingUp,
  AlertCircle,
  Rocket,
  Lightbulb,
} from "lucide-react";
import { BUSINESS_STATUS } from "@/constants/unifiedConstants";
import { transformBusinessFormData } from "@/utils/businessDataTransformer";

// Import section components
import CoreInfoSection from "./FormSections/CoreInfoSection";
import BrandMediaSection from "./FormSections/BrandMediaSection";
import LocationSection from "./FormSections/LocationSection";
import BusinessOverviewSection from "./FormSections/BusinessOverviewSection";
import FinancialOverviewSection from "./FormSections/FinancialOverviewSection";
import ChallengesSection from "./FormSections/ChallengesSection";
import GrowthSection from "./FormSections/GrowthSection";
import CommunitySection from "./FormSections/CommunitySection";

// Form Section Component
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

// Option Card Component
function OptionCard({ checked, onChange, label, type = "checkbox" }) {
  return (
    <label
      className={`flex min-h-[64px] w-full cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition ${
        checked
          ? "border-[#0d4f4f]/30 bg-[#0d4f4f]/6 shadow-sm"
          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      <input
        type={type}
        checked={checked}
        onChange={onChange}
        className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 text-[#0d4f4f] focus:ring-[#0d4f4f]"
      />
      <span className="text-sm leading-6 text-slate-700">{label}</span>
    </label>
  );
}

// Form Styles
const inputCls =
  "w-full min-h-[44px] border border-slate-300 rounded-xl px-4 py-3 text-sm text-[#0a1628] placeholder:text-slate-400 focus:outline-none focus:border-[#0d4f4f] focus:ring-2 focus:ring-[#0d4f4f]/10 bg-white shadow-sm";

const textareaCls =
  "w-full border border-slate-300 rounded-xl px-4 py-3 text-sm text-[#0a1628] placeholder:text-slate-400 focus:outline-none focus:border-[#0d4f4f] focus:ring-2 focus:ring-[#0d4f4f]/10 bg-white resize-none shadow-sm";

const selectCls =
  "w-full min-h-[44px] border border-slate-300 rounded-xl px-4 py-3 pr-10 text-sm text-[#0a1628] focus:outline-none focus:border-[#0d4f4f] focus:ring-2 focus:ring-[#0d4f4f]/10 bg-white appearance-none shadow-sm";

const labelCls =
  "block text-xs font-semibold uppercase tracking-wider text-slate-700";

const helperCls = "mt-1 text-xs text-slate-500";

// Form Sections Configuration
const SECTIONS = [
  {
    key: "core",
    label: "Core Business Info",
    icon: Building2,
    description: "Public-facing name, handle, and descriptions",
  },
  {
    key: "brand",
    label: "Brand & Media",
    icon: ImageIcon,
    description: "Logo, banner, and visual assets",
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
    key: "financial",
    label: "Financial Overview",
    icon: TrendingUp,
    description: "Funding sources, revenue, and investment needs",
  },
  {
    key: "challenges",
    label: "Challenges & Support",
    icon: AlertCircle,
    description: "Help us identify real barriers and support gaps",
  },
  {
    key: "growth",
    label: "Growth & Future",
    icon: Rocket,
    description: "Your business growth plans and next-stage priorities",
  },
  {
    key: "community",
    label: "Community & Impact",
    icon: Lightbulb,
    description: "How your business contributes to the wider community",
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
    "business_stage",
    "revenue_band",
    "business_operating_status",
  ],
  financial: [
    "current_funding_source",
    "funding_amount_needed",
    "investment_stage",
    "financial_challenges",
  ],
  challenges: ["top_challenges_array", "support_needed_next_array"],
  growth: ["growth_stage", "goals_next_12_months_array", "goals_details"],
  community: [
    "community_impact_areas_array",
    "collaboration_interest",
    "mentorship_offering",
    "open_to_future_contact",
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
    
    // Status & Verification (admin only)
    status: BUSINESS_STATUS.ACTIVE,
    is_verified: false,
    is_claimed: false,
    is_homepage_featured: false,
    
    // Business Insights (from BusinessInsightsAccordion)
    business_stage: "",
    revenue_band: "",
    business_operating_status: "",
    business_age: "",
    is_business_registered: false,
    employs_anyone: false,
    employs_family_community: false,
    current_funding_source: "",
    funding_amount_needed: "",
    funding_purpose: "",
    investment_stage: "",
    investment_exploration: "",
    community_impact_areas_array: [],
    support_needed_next_array: [],
    current_support_sources_array: [],
    expansion_plans: "",
    import_export_status: "",
    import_countries: [],
    export_countries: [],
    growth_stage: "",
    top_challenges_array: "",
    hiring_intentions: "",
    founder_role: "",
    founder_story: "",
    founder_motivation: [],
    gender: "",
    age_range: "",
    based_in_country: "",
    based_in_city: "",
    based_in_suburb: "",
    cultural_background: "",
    family_responsibilities: "",
    goals_next_12_months: [],
    
    // Additional fields that exist in database
    financial_challenges: "",
    goals_next_12_months_array: [],
    goals_details: "",
    collaboration_interest: false,
    mentorship_offering: false,
    open_to_future_contact: false,
  });

  const [expandedSections, setExpandedSections] = useState(new Set(["core"]));
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
      const limit =
        field === "top_challenges_array"
          ? 5
          : field === "support_needed_next_array" ||
            field === "goals_next_12_months_array"
          ? 3
          : undefined;

      if (currentArray.includes(item)) {
        return { ...prev, [field]: currentArray.filter((i) => i !== item) };
      }

      if (limit && currentArray.length >= limit) {
        return prev;
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
      
      case "financial":
        return (
          <FinancialOverviewSection
            form={form}
            handleInputChange={handleInputChange}
            inputCls={inputCls}
            selectCls={selectCls}
            labelCls={labelCls}
            textareaCls={textareaCls}
          />
        );
      
      case "challenges":
        return (
          <ChallengesSection
            form={form}
            handleInputChange={handleInputChange}
            toggleArrayItem={toggleArrayItem}
            inputCls={inputCls}
            labelCls={labelCls}
            textareaCls={textareaCls}
            helperCls={helperCls}
          />
        );
      
      case "growth":
        return (
          <GrowthSection
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
      <form onSubmit={handleSubmit} className="p-4 sm:p-8">
        <div className="space-y-4 overflow-x-hidden">
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
            >
              {renderSectionContent(section.key)}
            </FormSection>
          ))}

          {/* Global Save/Cancel Actions */}
          <div className="flex justify-between items-center pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
            
            <div className="flex gap-3">
              {saveSuccess && (
                <span className="text-green-600 text-sm font-medium">Saved successfully!</span>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-[#0d4f4f] px-6 py-3 text-sm font-medium text-white hover:bg-[#0a3e3e] disabled:cursor-not-allowed disabled:opacity-50"
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
