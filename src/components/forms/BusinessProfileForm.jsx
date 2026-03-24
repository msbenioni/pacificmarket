"use client";

import { useState, useEffect, useRef } from "react";
import {
  Building2,
  ImageIcon,
  MapPin,
  Lightbulb,
  Share2,
  Phone,
  Shield,
} from "lucide-react";
import { transformBusinessFormData } from "@/utils/businessDataTransformer";
import { isPersistentMediaUrl } from "@/utils/mediaUrlUtils";
import { SUBSCRIPTION_TIER } from "@/constants/unifiedConstants";

// Import section components
import CoreInfoSection from "./FormSections/CoreInfoSection";
import BrandMediaSection from "./FormSections/BrandMediaSection";
import LocationSection from "./FormSections/LocationSection";
import BusinessOverviewSection from "./FormSections/BusinessOverviewSection";
import CommunitySection from "./FormSections/CommunitySection";
import SocialMediaSection from "./FormSections/SocialMediaSection";
import ContactDetailsSection from "./FormSections/ContactDetailsSection";
import AdminVisibilitySection from "./FormSections/AdminVisibilitySection";
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

// Admin-only sections (added conditionally)
const ADMIN_SECTIONS = [
  {
    key: "admin",
    label: "Admin Controls",
    icon: Shield,
    description: "Visibility and administrative settings",
  },
];

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
    logo_file: null,
    banner_file: null,
    mobile_banner_file: null,
    logo_remove: false,
    banner_remove: false,
    mobile_banner_remove: false,
    
    // Admin & Visibility
    visibility_tier: "none",
    visibility_mode: "auto",
    
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
  const saveSuccessTimeoutRef = useRef(null);

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

  // Sync subscriptionTier prop to form state when it changes (only if not already set by initialData)
  useEffect(() => {
    if (!initialData?.subscription_tier && form.subscription_tier !== subscriptionTier) {
      setForm((prev) => ({ ...prev, subscription_tier: subscriptionTier }));
    }
  }, [subscriptionTier, initialData?.subscription_tier, form.subscription_tier]);

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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveSuccessTimeoutRef.current) {
        clearTimeout(saveSuccessTimeoutRef.current);
      }
    };
  }, []);

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
      if (type === "logo") {
        setForm((prev) => ({
          ...prev,
          logo_file: file,
          logo_remove: false,
        }));
      }

      if (type === "banner") {
        setForm((prev) => ({
          ...prev,
          banner_file: file,
          banner_remove: false,
        }));
      }

      if (type === "mobile_banner") {
        setForm((prev) => ({
          ...prev,
          mobile_banner_file: file,
          mobile_banner_remove: false,
        }));
      }
    } catch (error) {
      console.error("Error handling file upload:", error);
    }
  };

  const removeImage = (type) => {
    if (type === "logo") {
      setForm((prev) => {
        // If there's a local file, clear it and keep persisted image.
        if (prev.logo_file) {
          return {
            ...prev,
            logo_file: null,
            logo_remove: false, // Don't remove persisted image
          };
        }
        // If there's a persisted image, mark it for removal.
        // Starter root-relative assets are not treated as removable persisted media.
        if (isPersistentMediaUrl(prev.logo_url, { allowRootRelative: false })) {
          return {
            ...prev,
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
        // If there's a local file, clear it and keep persisted image.
        if (prev.banner_file) {
          return {
            ...prev,
            banner_file: null,
            banner_remove: false, // Don't remove persisted image
          };
        }
        // If there's a persisted image, mark it for removal.
        // Starter root-relative assets are not treated as removable persisted media.
        if (isPersistentMediaUrl(prev.banner_url, { allowRootRelative: false })) {
          return {
            ...prev,
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
        // If there's a local file, clear it and keep persisted image.
        if (prev.mobile_banner_file) {
          return {
            ...prev,
            mobile_banner_file: null,
            mobile_banner_remove: false, // Don't remove persisted image
          };
        }
        // If there's a persisted image, mark it for removal.
        // Starter root-relative assets are not treated as removable persisted media.
        if (isPersistentMediaUrl(prev.mobile_banner_url, { allowRootRelative: false })) {
          return {
            ...prev,
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
    setForm(prev => ({
      ...prev,
      // Update persisted URLs from saved row (explicit assignment)
      logo_url: savedBusiness.logo_url ?? "",
      banner_url: savedBusiness.banner_url ?? "",
      mobile_banner_url: savedBusiness.mobile_banner_url ?? "",
      // Clear local files
      logo_file: null,
      banner_file: null,
      mobile_banner_file: null,
      // Clear removal flags
      logo_remove: false,
      banner_remove: false,
      mobile_banner_remove: false,
      // Explicitly reconcile other important fields
      business_name: savedBusiness.business_name ?? prev.business_name,
      description: savedBusiness.description ?? prev.description,
      tagline: savedBusiness.tagline ?? prev.tagline,
      business_email: savedBusiness.business_email ?? prev.business_email,
      business_website: savedBusiness.business_website ?? prev.business_website,
      business_phone: savedBusiness.business_phone ?? prev.business_phone,
      business_hours: savedBusiness.business_hours ?? prev.business_hours,
      // Explicitly reconcile admin visibility fields
      visibility_tier: savedBusiness.visibility_tier ?? prev.visibility_tier,
      visibility_mode: savedBusiness.visibility_mode ?? prev.visibility_mode,
      subscription_tier: savedBusiness.subscription_tier ?? prev.subscription_tier,
    }));
  };

  const validateUploadedMediaPersistence = (saveResult) => {
    const validationErrors = [];

    if (form.logo_file && form.logo_file instanceof File && !saveResult.logo_url) {
      validationErrors.push("Logo upload did not persist correctly. Please try again.");
    }
    if (form.banner_file && form.banner_file instanceof File && !saveResult.banner_url) {
      validationErrors.push("Banner upload did not persist correctly. Please try again.");
    }
    if (
      form.mobile_banner_file &&
      form.mobile_banner_file instanceof File &&
      !saveResult.mobile_banner_url
    ) {
      validationErrors.push("Mobile banner upload did not persist correctly. Please try again.");
    }

    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join(" "));
    }
  };

  const performSave = async ({ saveAll = false, errorMessage }) => {
    setSubmitting(true);
    setErrors({ submit: undefined });

    try {
      const { businessesData, businessInsightsData } = transformBusinessFormData(form);

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
        saveAll,
      });

      // Validate save result and reconcile form state
      if (!saveResult || typeof saveResult !== 'object') {
        throw new Error("Save completed but no updated record was returned. Please refresh and verify.");
      }

      validateUploadedMediaPersistence(saveResult);

      // Reconcile form state with saved data
      reconcileSavedBusiness(saveResult);

      setSaveSuccess(true);
      if (saveSuccessTimeoutRef.current) {
        clearTimeout(saveSuccessTimeoutRef.current);
      }
      saveSuccessTimeoutRef.current = setTimeout(() => setSaveSuccess(false), 2500);
    } catch (error) {
      console.error("Failed to save business profile:", error);
      setErrors((prev) => ({
        ...prev,
        submit: errorMessage,
      }));
    } finally {
      setSubmitting(false);
    }
  };

  // Save Handlers
  const saveSection = async () => {
    await performSave({
      saveAll: false,
      errorMessage: "Failed to save section. Please try again.",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await performSave({
      saveAll: true,
      errorMessage: "Failed to save business profile. Please try again.",
    });
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
      
      case "admin":
        return (
          <AdminVisibilitySection
            form={form}
            handleInputChange={handleInputChange}
            showAdminFields={showAdminFields}
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
          {[...SECTIONS, ...(showAdminFields ? ADMIN_SECTIONS : [])].map((section) => (
            <FormSection
              key={section.key}
              title={section.label}
              subtitle={section.description}
              icon={section.icon}
              isOpen={expandedSections.has(section.key)}
              onToggle={() => toggleSection(section.key)}
              onSaveSection={saveSection}
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
