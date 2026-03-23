"use client";

import { useState, useEffect } from "react";
import {
  Building2,
  ImageIcon,
  MapPin,
  Lightbulb,
  Share2,
  Phone,
} from "lucide-react";
import { transformBusinessFormData } from "@/utils/businessDataTransformer";
import { SUBSCRIPTION_TIER } from "@/constants/unifiedConstants";

// Import section components
import CoreInfoSection from "./FormSections/CoreInfoSection";
import BrandMediaSection from "./FormSections/BrandMediaSection";
import LocationSection from "./FormSections/LocationSection";
import BusinessOverviewSection from "./FormSections/BusinessOverviewSection";
import CommunitySection from "./FormSections/CommunitySection";
import SocialMediaSection from "./FormSections/SocialMediaSection";
import ContactDetailsSection from "./FormSections/ContactDetailsSection";
import { inputCls, textareaCls, selectCls, labelCls, helperCls, FormSection } from "./shared/FormComponents";

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
    key: "social",
    label: "Social Media & Web",
    icon: Share2,
    description: "Website and social media profiles",
  },
  {
    key: "contact",
    label: "Contact Details",
    icon: Phone,
    description: "Contact information for customer inquiries",
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
  core: ["business_name", "business_handle", "tagline", "description", "role"],
  contact: ["business_contact_person", "business_email", "business_phone", "business_website", "business_hours"],
  location: ["country", "city", "address", "suburb", "state_region", "postal_code", "industry"],
  overview: [
    "year_started",
    "business_stage",
    "business_structure",
    "team_size_band",
    "is_business_registered",
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
  social: ["social_links"],
  brand: ["logo_url", "banner_url", "mobile_banner_url"],
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
  // Unified form state with new field names
  const [form, setForm] = useState({
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
    country: "",
    city: "",
    address: "",
    suburb: "",
    state_region: "",
    postal_code: "",
    industry: "",
    
    // Brand Media
    logo_url: "",
    banner_url: "",
    mobile_banner_url: "",
    logo_preview_url: "",
    banner_preview_url: "",
    mobile_banner_preview_url: "",
    logo_file: null,
    banner_file: null,
    mobile_banner_file: null,
    logo_remove: false,
    banner_remove: false,
    mobile_banner_remove: false,
    
    // Business Overview
    year_started: null,
    business_stage: "",
    business_structure: "",
    team_size_band: "",
    is_business_registered: false,
    founder_story: "",
    age_range: "",
    gender: "",
    
    // Community & Opportunities
    collaboration_interest: false,
    mentorship_offering: false,
    open_to_future_contact: false,
    business_acquisition_interest: false,
    
    // Social Media
    social_links: {
      facebook: "",
      instagram: "",
      twitter: "",
      linkedin: "",
      youtube: "",
      tiktok: "",
    },
    
    // System fields
    subscription_tier: subscriptionTier,
  });

  const [expandedSections, setExpandedSections] = useState(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errors, setErrors] = useState({ submit: undefined });

  // Initialize form with existing data
  useEffect(() => {
    if (initialData) {
      // Use only final field names - no legacy mapping needed
      const mappedData = {
        ...initialData,
        // Ensure social_links doesn't include website
        social_links: {
          facebook: initialData.social_links?.facebook || "",
          instagram: initialData.social_links?.instagram || "",
          twitter: initialData.social_links?.twitter || "",
          linkedin: initialData.social_links?.linkedin || "",
          youtube: initialData.social_links?.youtube || "",
          tiktok: initialData.social_links?.tiktok || "",
        },
      };
      
      setForm((prev) => ({ ...prev, ...mappedData }));
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
          logo_preview_url: tempUrl,
          logo_file: file,
        }));
      }

      if (type === "banner") {
        setForm((prev) => ({
          ...prev,
          banner_preview_url: tempUrl,
          banner_file: file,
        }));
      }

      if (type === "mobile_banner") {
        setForm((prev) => ({
          ...prev,
          mobile_banner_preview_url: tempUrl,
          mobile_banner_file: file,
        }));
      }
    } catch (error) {
      console.error("Error handling file upload:", error);
    }
  };

  const removeImage = (type) => {
    console.log("🗑️ removeImage called for:", type);
    
    if (type === "logo") {
      setForm((prev) => {
        // If there's a local file/preview, just clear it and revert to saved
        if (prev.logo_file || prev.logo_preview_url) {
          console.log("🗑️ Removing local logo preview, reverting to saved");
          return {
            ...prev,
            logo_preview_url: "",
            logo_file: null,
            logo_remove: false, // Don't remove persisted image
          };
        }
        // If there's a persisted image, mark it for removal
        if (prev.logo_url && prev.logo_url.startsWith('http')) {
          console.log("🗑️ Marking persisted logo for removal");
          return {
            ...prev,
            logo_preview_url: "",
            logo_file: null,
            logo_remove: true,
          };
        }
        // No image to remove
        return prev;
      });
    }

    if (type === "banner") {
      setForm((prev) => {
        // If there's a local file/preview, just clear it and revert to saved
        if (prev.banner_file || prev.banner_preview_url) {
          console.log("🗑️ Removing local banner preview, reverting to saved");
          return {
            ...prev,
            banner_preview_url: "",
            banner_file: null,
            banner_remove: false, // Don't remove persisted image
          };
        }
        // If there's a persisted image, mark it for removal
        if (prev.banner_url && prev.banner_url.startsWith('http')) {
          console.log("🗑️ Marking persisted banner for removal");
          return {
            ...prev,
            banner_preview_url: "",
            banner_file: null,
            banner_remove: true,
          };
        }
        // No image to remove
        return prev;
      });
    }

    if (type === "mobile_banner") {
      setForm((prev) => {
        // If there's a local file/preview, just clear it and revert to saved
        if (prev.mobile_banner_file || prev.mobile_banner_preview_url) {
          console.log("🗑️ Removing local mobile banner preview, reverting to saved");
          return {
            ...prev,
            mobile_banner_preview_url: "",
            mobile_banner_file: null,
            mobile_banner_remove: false, // Don't remove persisted image
          };
        }
        // If there's a persisted image, mark it for removal
        if (prev.mobile_banner_url && prev.mobile_banner_url.startsWith('http')) {
          console.log("🗑️ Marking persisted mobile banner for removal");
          return {
            ...prev,
            mobile_banner_preview_url: "",
            mobile_banner_file: null,
            mobile_banner_remove: true,
          };
        }
        // No image to remove
        return prev;
      });
    }
  };

  // Helper to reconcile form state with saved business data
  const reconcileSavedBusiness = (savedBusiness) => {
    console.log("🔄 reconcileSavedBusiness called with:", {
      id: savedBusiness.id,
      brandingFields: {
        logo_url: savedBusiness.logo_url,
        banner_url: savedBusiness.banner_url,
        mobile_banner_url: savedBusiness.mobile_banner_url
      }
    });

    setForm(prev => ({
      ...prev,
      // Update persisted URLs from saved row
      logo_url: savedBusiness.logo_url || "",
      banner_url: savedBusiness.banner_url || "",
      mobile_banner_url: savedBusiness.mobile_banner_url || "",
      // Clear preview state and files
      logo_preview_url: "",
      banner_preview_url: "",
      mobile_banner_preview_url: "",
      logo_file: null,
      banner_file: null,
      mobile_banner_file: null,
      // Clear removal flags
      logo_remove: false,
      banner_remove: false,
      mobile_banner_remove: false,
      // Merge other returned fields if present
      ...(savedBusiness.business_name && { business_name: savedBusiness.business_name }),
      ...(savedBusiness.description && { description: savedBusiness.description }),
      ...(savedBusiness.tagline && { tagline: savedBusiness.tagline }),
      ...(savedBusiness.business_email && { business_email: savedBusiness.business_email }),
      ...(savedBusiness.business_website && { business_website: savedBusiness.business_website }),
      ...(savedBusiness.business_phone && { business_phone: savedBusiness.business_phone }),
      ...(savedBusiness.business_hours && { business_hours: savedBusiness.business_hours }),
    }));

    console.log("✅ Form state reconciled successfully");
  };

  // Save Handlers
  const saveSection = async (sectionData) => {
    setSubmitting(true);
    setErrors({ submit: undefined });

    try {
      const { businessesData, businessInsightsData } = transformBusinessFormData(form);
      
      console.log("🎨 BusinessProfileForm save:", {
        businessId,
        hasFiles: !!(form.logo_file || form.banner_file || form.mobile_banner_file),
        hasRemovals: !!(form.logo_remove || form.banner_remove || form.mobile_banner_remove),
        businessesDataKeys: Object.keys(businessesData),
        previewUrls: {
          logo_preview_url: form.logo_preview_url,
          banner_preview_url: form.banner_preview_url,
          mobile_banner_preview_url: form.mobile_banner_preview_url
        }
      });
      
      const saveResult = await onSave({
        businessId,
        businessesData,
        businessInsightsData,
        files: {
          logo_file: form.logo_file,
          banner_file: form.banner_file,
          mobile_banner_file: form.mobile_banner_file,
        },
        removals: {
          logo_remove: form.logo_remove,
          banner_remove: form.banner_remove,
          mobile_banner_remove: form.mobile_banner_remove,
        },
      });

      // Validate save result and reconcile form state
      if (!saveResult || typeof saveResult !== 'object') {
        throw new Error("Save completed but no updated record was returned. Please refresh and verify.");
      }

      console.log("🔄 Reconciling form state with saved data:", saveResult);
      
      // Validate that uploaded files persisted correctly
      const validationErrors = [];
      if (form.logo_file && !saveResult.logo_url) {
        validationErrors.push("Logo upload did not persist correctly. Please try again.");
      }
      if (form.banner_file && !saveResult.banner_url) {
        validationErrors.push("Banner upload did not persist correctly. Please try again.");
      }
      if (form.mobile_banner_file && !saveResult.mobile_banner_url) {
        validationErrors.push("Mobile banner upload did not persist correctly. Please try again.");
      }

      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(" "));
      }

      // Reconcile form state with saved data
      reconcileSavedBusiness(saveResult);

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
      
      console.log("🎨 BusinessProfileForm handleSubmit (saveAll):", {
        businessId,
        hasFiles: !!(form.logo_file || form.banner_file || form.mobile_banner_file),
        hasRemovals: !!(form.logo_remove || form.banner_remove || form.mobile_banner_remove),
        businessesDataKeys: Object.keys(businessesData),
        previewUrls: {
          logo_preview_url: form.logo_preview_url,
          banner_preview_url: form.banner_preview_url,
          mobile_banner_preview_url: form.mobile_banner_preview_url
        }
      });
      
      const saveResult = await onSave({
        businessId,
        businessesData,
        businessInsightsData,
        files: {
          logo_file: form.logo_file,
          banner_file: form.banner_file,
          mobile_banner_file: form.mobile_banner_file,
        },
        removals: {
          logo_remove: form.logo_remove,
          banner_remove: form.banner_remove,
          mobile_banner_remove: form.mobile_banner_remove,
        },
        saveAll: true,
      });

      // Validate save result and reconcile form state
      if (!saveResult || typeof saveResult !== 'object') {
        throw new Error("Save completed but no updated record was returned. Please refresh and verify.");
      }

      console.log("🔄 Reconciling form state with saved data (saveAll):", saveResult);
      
      // Validate that uploaded files persisted correctly
      const validationErrors = [];
      if (form.logo_file && !saveResult.logo_url) {
        validationErrors.push("Logo upload did not persist correctly. Please try again.");
      }
      if (form.banner_file && !saveResult.banner_url) {
        validationErrors.push("Banner upload did not persist correctly. Please try again.");
      }
      if (form.mobile_banner_file && !saveResult.mobile_banner_url) {
        validationErrors.push("Mobile banner upload did not persist correctly. Please try again.");
      }

      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(" "));
      }

      // Reconcile form state with saved data
      reconcileSavedBusiness(saveResult);

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
            showAdminFields={showAdminFields}
          />
        );
      
      case "brand":
        return (
          <BrandMediaSection
            form={form}
            handleFileUpload={handleFileUpload}
            removeImage={removeImage}
            logoInputId={logoInputId}
            bannerInputId={bannerInputId}
            mobileBannerInputId={mobileBannerInputId}
            labelCls={labelCls}
            subscriptionTier={form.subscription_tier}
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
      
      case "social":
        return (
          <SocialMediaSection
            form={form}
            handleInputChange={handleInputChange}
            inputCls={inputCls}
            labelCls={labelCls}
          />
        );
      
      case "contact":
        return (
          <ContactDetailsSection
            form={form}
            handleInputChange={handleInputChange}
            inputCls={inputCls}
            textareaCls={textareaCls}
            labelCls={labelCls}
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
