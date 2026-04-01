"use client";

import { useState, useEffect, useRef, useMemo } from "react";
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
import { VISIBILITY_TIER } from "@/constants/visibilityConstants";
import { BUSINESS_FORM_DEFAULTS } from "./businessFormDefaults.js";
import { useFormPersistenceV2 } from "@/hooks/useFormPersistenceV2.js";
import { generateFormKey } from "@/utils/formPersistenceKeys.js";

// Helper function to generate business handle from name
function slugifyHandle(value = "") {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Import section components
import CoreInfoSection from "./FormSections/CoreInfoSection";
import BrandMediaSection from "./FormSections/BrandMediaSection";
import LocationSection from "./FormSections/LocationSection";
import BusinessOverviewSection from "./FormSections/BusinessOverviewSection";
import CommunitySection from "./FormSections/CommunitySection";
import SocialMediaSection from "./FormSections/SocialMediaSection";
import ContactDetailsSection from "./FormSections/ContactDetailsSection";
import AdminVisibilitySection from "./FormSections/AdminVisibilitySection";
import { ReferralDropdown } from "./ReferralDropdown";
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
    key: "referral",
    label: "Referral",
    icon: Building2,
    description: "Business referral information",
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
  // Prepare initial data with proper merging
  const initialFormData = useMemo(() => {
    const baseData = {
      ...BUSINESS_FORM_DEFAULTS,
      subscription_tier: subscriptionTier,
    };
    
    if (mode === "create" || !initialData) {
      return {
        ...baseData,
        ...(initialData || {}),
        // Deep merge for nested objects
        social_links: {
          ...BUSINESS_FORM_DEFAULTS.social_links,
          ...(initialData?.social_links || {}),
        },
      };
    }
    
    // For edit mode, merge server data with defaults
    return {
      ...baseData,
      ...initialData,
      // Deep merge for nested objects
      social_links: {
        ...BUSINESS_FORM_DEFAULTS.social_links,
        ...(initialData?.social_links || {}),
      },
    };
  }, [mode, initialData, subscriptionTier]);

  // Generate stable form key using centralized utility
  const formKey = useMemo(() => {
    try {
      if (mode === "create") {
        return generateFormKey({ mode: "create" });
      } else if (mode === "edit" && businessId) {
        return generateFormKey({ mode: "edit", businessId });
      } else {
        throw new Error(`Invalid mode/businessId combination: mode=${mode}, businessId=${businessId}`);
      }
    } catch (error) {
      console.error("Error generating form key:", error);
      return `admin_dashboard_business_${mode}_${businessId || 'unknown'}`;
    }
  }, [mode, businessId]);

  // Use the new consolidated persistence hook
  const {
    formData: form,
    setFormData: setForm,
    updateFormData,
    updateField,
    discardDraft,
    clearPersistedData,
    hasUnsavedChanges,
    isRestored,
    metadata,
    markSaveSuccess,
    markSaveFailure,
  } = useFormPersistenceV2({
    formKey,
    initialData: initialFormData,
    mode,
    businessId,
    onSaveSuccess: () => {
      console.log(`✅ Save success handled for ${mode} mode`);
    },
    onSaveFailure: (error) => {
      console.log(`❌ Save failure handled for ${mode} mode:`, error);
    },
  });

  const [expandedSections, setExpandedSections] = useState(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [savingSection, setSavingSection] = useState(null);
  const [errors, setErrors] = useState({ submit: undefined, fields: {} });
  const saveSuccessTimeoutRef = useRef(null);

  // Sync subscriptionTier prop to form state when it changes
  useEffect(() => {
    if (form.subscription_tier !== subscriptionTier) {
      updateField("subscription_tier", subscriptionTier);
    }
  }, [subscriptionTier, form.subscription_tier, updateField]);

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
    updateField(field, value);
    
    // Auto-generate handle from business name if handle is empty
    if (field === "business_name" && value && !form.business_handle) {
      const generatedHandle = slugifyHandle(value);
      updateField("business_handle", generatedHandle);
    }
  };

  const toggleArrayItem = (field, item) => {
    const currentArray = form[field] || [];

    if (currentArray.includes(item)) {
      updateField(field, currentArray.filter((i) => i !== item));
    } else {
      updateField(field, [...currentArray, item]);
    }
  };

  // File Upload Handlers
  const handleFileUpload = (event, type) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      if (type === "logo") {
        updateFormData({
          logo_file: file,
          logo_remove: false,
        });
      }

      if (type === "banner") {
        updateFormData({
          banner_file: file,
          banner_remove: false,
        });
      }

      if (type === "mobile_banner") {
        updateFormData({
          mobile_banner_file: file,
          mobile_banner_remove: false,
        });
      }
    } catch (error) {
      console.error("Error handling file upload:", error);
    }
  };

  const removeImage = (type) => {
    if (type === "logo") {
      // If there's a local file, clear it and keep persisted image.
      if (form.logo_file) {
        updateFormData({
          logo_file: null,
          logo_remove: false, // Don't remove persisted image
        });
        return;
      }
      // If there's a persisted image, mark it for removal.
      // Starter root-relative assets are not treated as removable persisted media.
      if (isPersistentMediaUrl(form.logo_url, { allowRootRelative: false })) {
        updateFormData({
          logo_file: null,
          logo_remove: true,
        });
      }
    }

    if (type === "banner") {
      // If there's a local file, clear it and keep persisted image.
      if (form.banner_file) {
        updateFormData({
          banner_file: null,
          banner_remove: false, // Don't remove persisted image
        });
        return;
      }
      // If there's a persisted image, mark it for removal.
      // Starter root-relative assets are not treated as removable persisted media.
      if (isPersistentMediaUrl(form.banner_url, { allowRootRelative: false })) {
        updateFormData({
          banner_file: null,
          banner_remove: true,
        });
      }
    }

    if (type === "mobile_banner") {
      // If there's a local file, clear it and keep persisted image.
      if (form.mobile_banner_file) {
        updateFormData({
          mobile_banner_file: null,
          mobile_banner_remove: false, // Don't remove persisted image
        });
        return;
      }
      // If there's a persisted image, mark it for removal.
      // Starter root-relative assets are not treated as removable persisted media.
      if (isPersistentMediaUrl(form.mobile_banner_url, { allowRootRelative: false })) {
        updateFormData({
          mobile_banner_file: null,
          mobile_banner_remove: true,
        });
      }
    }
  };

  // Helper to reconcile form state with saved business data
  const reconcileSavedBusiness = (savedBusiness) => {
    updateFormData({
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
      business_name: savedBusiness.business_name ?? form.business_name,
      description: savedBusiness.description ?? form.description,
      tagline: savedBusiness.tagline ?? form.tagline,
      business_email: savedBusiness.business_email ?? form.business_email,
      business_website: savedBusiness.business_website ?? form.business_website,
      business_phone: savedBusiness.business_phone ?? form.business_phone,
      business_hours: savedBusiness.business_hours ?? form.business_hours,
      // Explicitly reconcile admin visibility fields
      visibility_tier: savedBusiness.visibility_tier ?? form.visibility_tier,
      visibility_mode: savedBusiness.visibility_mode ?? form.visibility_mode,
      subscription_tier: savedBusiness.subscription_tier ?? form.subscription_tier,
    });
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
    setErrors({ submit: undefined, fields: {} });

    try {
      // Client-side validation first
      const validation = validateForm({ form, mode });
      
      if (!validation.isValid) {
        
        // Set field errors
        setErrors(prev => ({
          ...prev,
          fields: validation.fieldErrors,
          submit: validation.summaryMessage
        }));
        
        // Expand invalid sections
        const newExpandedSections = new Set(expandedSections);
        Object.keys(validation.sectionErrors).forEach(section => {
          newExpandedSections.add(section);
        });
        setExpandedSections(newExpandedSections);
        
        // Scroll to first invalid section
        if (validation.firstInvalidSection) {
          setTimeout(() => {
            const element = document.querySelector(`[data-section="${validation.firstInvalidSection}"]`);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
        }
        
        return; // Don't proceed to save
      }
      
      const { businessesData, businessInsightsData } = transformBusinessFormData(form);

      const saveResult = await onSave({
        businessId: businessId, // Use the prop
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
      console.log("Save result received:", saveResult);
      console.log("Save result type:", typeof saveResult);
      
      // Handle normalized result contract
      if (!saveResult) {
        console.error("Save result is falsy:", saveResult);
        throw new Error("Save completed but no result was returned. Please refresh and verify.");
      }
      
      // Accept both direct business objects and normalized result objects
      let business = null;
      let success = false;
      
      if (typeof saveResult === 'object' && saveResult !== null) {
        if (saveResult.success === true) {
          // Normalized result format
          success = true;
          business = saveResult.business;
        } else if (saveResult.id || saveResult.business_name) {
          // Direct business object
          success = true;
          business = saveResult;
        } else {
          console.error("Unexpected save result format:", saveResult);
          throw new Error("Save completed but returned unexpected data format. Please refresh and verify.");
        }
      } else {
        console.error("Invalid save result type:", typeof saveResult);
        throw new Error("Save completed but returned invalid data type. Please refresh and verify.");
      }
      
      console.log("Save validation passed - success:", success, "business:", business ? business.id : null);
      
      // Only reconcile if we have a concrete business row
      if (business && typeof business === 'object' && Object.keys(business).length > 0) {
        console.log("Reconciling saved business data");
        validateUploadedMediaPersistence(business);
        reconcileSavedBusiness(business);
      } else {
        console.log("Save succeeded but no business data to reconcile");
      }

      // Clear persisted data after successful save
      markSaveSuccess();

      setSaveSuccess(true);
      if (saveSuccessTimeoutRef.current) {
        clearTimeout(saveSuccessTimeoutRef.current);
      }
      saveSuccessTimeoutRef.current = setTimeout(() => setSaveSuccess(false), 2500);
    } catch (error) {
      console.error("Failed to save business profile:", error);
      markSaveFailure(error);
      setErrors((prev) => ({
        ...prev,
        submit: errorMessage,
      }));
    } finally {
      setSubmitting(false);
    }
  };

  // Form validation
  const validateForm = ({ form, mode }) => {
    const fieldErrors = {};
    const sectionErrors = {};
    let firstInvalidField = null;
    let firstInvalidSection = null;

    // Field to section mapping
    const FIELD_SECTION_MAP = {
      business_name: "core",
      business_handle: "core",
      tagline: "core",
      description: "core",
      country: "location",
      city: "location",
      address: "location",
      suburb: "location",
      state_region: "location",
      postal_code: "location",
      industry: "location",
      year_started: "overview",
      business_stage: "overview",
      business_structure: "overview",
      team_size_band: "overview",
      is_business_registered: "overview",
      business_acquisition_interest: "community",
      collaboration_interest: "community",
      mentorship_interest: "community",
      community_engagement: "community",
      business_contact_person: "contact",
      business_email: "contact",
      business_phone: "contact",
      business_website: "contact",
      business_hours: "contact",
      facebook: "social",
      instagram: "social",
      twitter: "social",
      linkedin: "social",
      youtube: "social",
      tiktok: "social",
      referred_by_business_id: "referral",
      logo_file: "brand",
      banner_file: "brand",
      mobile_banner_file: "brand",
      logo_remove: "brand",
      banner_remove: "brand",
      mobile_banner_remove: "brand",
    };

    // Required fields for create mode
    if (mode === "create") {
      // Business name validation
      if (!form.business_name || !form.business_name.trim()) {
        fieldErrors.business_name = "Business name is required";
        if (!firstInvalidField) {
          firstInvalidField = "business_name";
          firstInvalidSection = "core";
        }
      }

      // Business handle validation
      if (!form.business_handle || !form.business_handle.trim()) {
        fieldErrors.business_handle = "Business handle is required";
        if (!firstInvalidField) {
          firstInvalidField = "business_handle";
          firstInvalidSection = "core";
        }
      } else if (!/^[a-z0-9-]+$/.test(form.business_handle.trim())) {
        fieldErrors.business_handle = "Business handle can only contain lowercase letters, numbers, and hyphens";
        if (!firstInvalidField) {
          firstInvalidField = "business_handle";
          firstInvalidSection = "core";
        }
      }

      // Description validation
      if (!form.description || !form.description.trim()) {
        fieldErrors.description = "Business description is required";
        if (!firstInvalidField) {
          firstInvalidField = "description";
          firstInvalidSection = "core";
        }
      }

      // Location validation - Country
      if (!form.country || !form.country.trim()) {
        fieldErrors.country = "Country is required";
        if (!firstInvalidField) {
          firstInvalidField = "country";
          firstInvalidSection = "location";
        }
      }

      // Location validation - City
      if (!form.city || !form.city.trim()) {
        fieldErrors.city = "City is required";
        if (!firstInvalidField) {
          firstInvalidField = "city";
          firstInvalidSection = "location";
        }
      }

      // Industry validation
      if (!form.industry || !form.industry.trim()) {
        fieldErrors.industry = "Industry is required";
        if (!firstInvalidField) {
          firstInvalidField = "industry";
          firstInvalidSection = "location";
        }
      }

      // Contact validation - Email
      if (!form.business_email || !form.business_email.trim()) {
        fieldErrors.business_email = "Business email is required";
        if (!firstInvalidField) {
          firstInvalidField = "business_email";
          firstInvalidSection = "contact";
        }
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.business_email.trim())) {
        fieldErrors.business_email = "Please enter a valid email address";
        if (!firstInvalidField) {
          firstInvalidField = "business_email";
          firstInvalidSection = "contact";
        }
      }

      // Referral validation (only in create mode)
      if (!form.referred_by_business_id || !form.referred_by_business_id.trim()) {
        fieldErrors.referred_by_business_id = "Please select a referring business or choose 'No referral'";
        if (!firstInvalidField) {
          firstInvalidField = "referred_by_business_id";
          firstInvalidSection = "referral";
        }
      }
    }

    // Map field errors to sections
    Object.keys(fieldErrors).forEach(field => {
      const section = FIELD_SECTION_MAP[field];
      if (section) {
        sectionErrors[section] = true;
      }
    });

    const isValid = Object.keys(fieldErrors).length === 0;

    return {
      isValid,
      fieldErrors,
      sectionErrors,
      firstInvalidField,
      firstInvalidSection,
      summaryMessage: isValid ? null : 
        mode === "create" 
          ? "Please complete the required fields before saving your business."
          : "Please fix the highlighted fields before saving."
    };
  };

  // Save Handlers
  const saveSection = async (sectionKey) => {
    setSavingSection(sectionKey);
    try {
      await performSave({
        saveAll: false,
        errorMessage: "Failed to save section. Please try again.",
      });
    } finally {
      setSavingSection(null);
    }
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
            fieldErrors={errors.fields || {}}
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
            fieldErrors={errors.fields || {}}
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
            fieldErrors={errors.fields || {}}
          />
        );
      
      case "referral":
        // Only show referral dropdown during creation, not editing
        if (mode === 'create') {
          return (
            <ReferralDropdown
              value={form.referred_by_business_id}
              onChange={(value) => handleInputChange("referred_by_business_id", value)}
              disabled={submitting}
              excludeBusinessId={businessId}
              fieldErrors={errors.fields || {}}
            />
          );
        }
        return null;
      
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

  // Build visible sections array based on mode
  const visibleSections = [...SECTIONS, ...(showAdminFields ? ADMIN_SECTIONS : [])].filter(section => {
    // Only show referral section in create mode
    if (section.key === "referral") {
      return mode === 'create';
    }
    return true;
  });

  // Handle cancel with confirmation for unsaved changes
  const handleCancel = async () => {
    console.log(`❌ Cancel clicked. Has unsaved: ${hasUnsavedChanges()}`);
    if (hasUnsavedChanges()) {
      if (confirm("You have unsaved changes. Are you sure you want to cancel? Your draft will be discarded.")) {
        console.log(`🗑️ Discarding draft for ${mode} mode`);
        try {
          await discardDraft();
          console.log(`✅ Draft discard completed, navigating away`);
          onCancel();
        } catch (error) {
          console.error(`❌ Error during discard:`, error);
          // Still navigate even if discard fails
          onCancel();
        }
      }
    } else {
      console.log(`🗑️ No unsaved changes, proceeding with cancel`);
      onCancel();
    }
  };

  return (
    <div className="rounded-2xl bg-white overflow-hidden max-w-full">
      <form onSubmit={handleSubmit} className="p-3 sm:p-8">
        {/* Restore notification */}
        {isRestored && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-blue-800 text-sm font-medium">
              📝 Draft restored from previous session
            </p>
          </div>
        )}

        {/* Global validation message */}
        {errors.submit && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-800 text-sm font-medium">{errors.submit}</p>
          </div>
        )}

        {/* Unsaved changes indicator */}
        {hasUnsavedChanges() && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-amber-800 text-sm font-medium">
              💾 Unsaved changes are being stored locally
            </p>
          </div>
        )}
        
        <div className="space-y-3 sm:space-y-4 overflow-x-hidden">
          {visibleSections.map((section) => (
            <div key={section.key} data-section={section.key}>
              <FormSection
                title={section.label}
                subtitle={section.description}
                icon={section.icon}
                isOpen={expandedSections.has(section.key)}
                onToggle={() => toggleSection(section.key)}
                onSaveSection={() => saveSection(section.key)}
                saving={savingSection === section.key}
                formData={form}
                errors={errors}
                mode={mode}
                tierInfo={subscriptionTier}
                onUpgrade={onUpgrade}
                sectionKey={section.key}
              >
                {renderSectionContent(section.key)}
              </FormSection>
            </div>
          ))}

          {/* Global Save Actions */}
          <div className="flex justify-end items-center pt-6 border-t border-slate-200">
            <div className="flex gap-3">
              {saveSuccess && (
                <span className="text-green-600 text-sm font-medium">Saved successfully!</span>
              )}
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#0d4f4f] px-6 py-3 text-sm font-bold text-white hover:bg-[#1a6b6b] disabled:opacity-50 transition-colors sm:w-auto"
                disabled={submitting}
              >
                {submitting ? "Saving..." : mode === "create" ? "Create Business" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
