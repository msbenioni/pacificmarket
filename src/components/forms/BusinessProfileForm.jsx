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
  // Wizard state
  const [currentStep, setCurrentStep] = useState(0);
  
  // Define wizard steps
  const wizardSteps = useMemo(() => {
    const baseSteps = [
      {
        key: "core",
        label: "Core Info",
        icon: Building2,
        description: "Business name, handle, and description",
      },
      {
        key: "location", 
        label: "Location",
        icon: MapPin,
        description: "Business location and contact details",
      },
      {
        key: "overview",
        label: "Business Details", 
        icon: Building2,
        description: "Industry, size, and operations",
      },
      {
        key: "social",
        label: "Online Presence",
        icon: Share2, 
        description: "Website and social media profiles",
      },
      {
        key: "brand",
        label: "Brand & Media",
        icon: ImageIcon,
        description: "Logo, banner, and visual assets",
      },
    ];

    if (showAdminFields) {
      return [
        ...baseSteps,
        {
          key: "admin",
          label: "Admin Settings",
          icon: Shield,
          description: "Visibility and administrative controls",
        }
      ];
    }

    return baseSteps;
  }, [showAdminFields]);

  // Navigation functions
  const goToNextStep = () => {
    if (currentStep < wizardSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepIndex) => {
    if (stepIndex >= 0 && stepIndex < wizardSteps.length) {
      setCurrentStep(stepIndex);
    }
  };

  // Get current step data
  const currentStepData = wizardSteps[currentStep];
  
  // Debug logging to track current step
  console.log(`🔍 Current Step: ${currentStep + 1} of ${wizardSteps.length} (${currentStepData.label})`);
  console.log(`🔍 Next button should show: ${currentStep > 0 && currentStep < wizardSteps.length - 1}`);
  console.log(`🔍 Save button should show: ${currentStep === wizardSteps.length - 1}`);
  console.log(`🔍 showAdminFields: ${showAdminFields}`);
  
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
    markSaveSuccess,
    markSaveFailure,
    expandedSections,
    setExpandedSections,
  } = useFormPersistenceV2({
    formKey,
    initialData: initialData || BUSINESS_FORM_DEFAULTS,
    mode,
    businessId,
    onSaveSuccess: (saveResult) => {
      console.log(`✅ Save success handled for ${mode} mode`);
    },
    onSaveFailure: (error) => {
      console.log(`❌ Save failure handled for ${mode} mode:`, error);
    },
  });

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

  // Progress Bar Component
  const ProgressBar = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Step {currentStep + 1} of {wizardSteps.length}</h3>
        <span className="text-sm text-gray-500">{currentStepData.label}</span>
      </div>
      
      {/* Progress Steps */}
      <div className="flex items-center space-x-2">
        {wizardSteps.map((step, index) => (
          <div key={step.key} className="flex items-center flex-1">
            <button
              onClick={() => goToStep(index)}
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                index === currentStep
                  ? "bg-teal-600 text-white"
                  : index < currentStep
                  ? "bg-teal-100 text-teal-600 hover:bg-teal-200"
                  : "bg-gray-100 text-gray-400 hover:bg-gray-200"
              }`}
            >
              {index < currentStep ? "✓" : index + 1}
            </button>
            
            {index < wizardSteps.length - 1 && (
              <div className={`flex-1 h-1 mx-2 ${
                index < currentStep ? "bg-teal-200" : "bg-gray-200"
              }`} />
            )}
          </div>
        ))}
      </div>
      
      {/* Step Labels */}
      <div className="flex items-center justify-between mt-3">
        {wizardSteps.map((step, index) => (
          <div
            key={step.key}
            className={`flex-1 text-center text-xs ${
              index === currentStep ? "text-teal-600 font-medium" : "text-gray-500"
            }`}
            style={{ maxWidth: `${100 / wizardSteps.length}%` }}
          >
            <div className="truncate">{step.label}</div>
          </div>
        ))}
      </div>
    </div>
  );

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

        {/* Form Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600">
            {mode === 'create' 
              ? 'Fill in the information below to create a new business listing'
              : 'Update the business information below'
            }
          </p>
        </div>

        {/* Progress Bar */}
        <ProgressBar />

        {/* Current Step Content */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <currentStepData.icon className="w-6 h-6 text-teal-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{currentStepData.label}</h3>
              <p className="text-sm text-gray-500">{currentStepData.description}</p>
            </div>
          </div>
          
          {/* Render current step content */}
          <div className="space-y-6">
            {renderSectionContent(currentStepData.key)}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={currentStep === 0 ? handleCancel : goToPreviousStep}
            className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
          >
            {currentStep === 0 ? 'Cancel' : 'Back'}
          </button>
          
          <div className="flex gap-4">
            {currentStep >= 0 && currentStep < wizardSteps.length - 1 && (
              <button
                type="button"
                onClick={goToNextStep}
                className="px-6 py-3 border border-teal-600 text-teal-600 rounded-xl hover:bg-teal-50 transition-colors font-medium"
              >
                Next
              </button>
            )}
            
            {currentStep === wizardSteps.length - 1 && (
              <button
                type="submit"
                disabled={submitting || saving}
                className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {submitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V8c0 2.5 1.23 4.88 3.29 6.58l1.41 1.41A10.96 10.96 0 0112 20c4.42 0 8.5-1.72 11.58-4.58l1.41-1.41A9.96 9.96 0 0020 12z"></path>
                    </svg>
                    {mode === 'create' ? 'Creating...' : 'Saving...'}
                  </span>
                ) : (
                  <span>{mode === 'create' ? 'Create Business' : 'Save Changes'}</span>
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
