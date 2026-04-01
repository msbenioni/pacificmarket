"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
import { useFormPersistence } from "@/hooks/useFormPersistence";
import { useTabPersistenceWarning, useFormRestore } from "@/hooks/useTabPersistenceWarning";

// Import section components
import CoreInfoSection from "./FormSections/CoreInfoSection";
import BrandMediaSection from "./FormSections/BrandMediaSection";
import LocationSection from "./FormSections/LocationSection";
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
    key: "contact",
    label: "Contact Details",
    icon: Phone,
    description: "Business contact information and hours",
  },
  {
    key: "social",
    label: "Social Media",
    icon: Share2,
    description: "Social media profiles and links",
  },
  {
    key: "community",
    label: "Community Impact",
    icon: Lightbulb,
    description: "Cultural identity and community involvement",
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

export default function BusinessProfileFormPersistent({
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
  useTabPersistenceWarning(hasUnsavedChanges, `${mode} form`);
  
  // Check for restored data
  const { isRestored } = useFormRestore(formKey, initialFormData);

  // Initialize with initialData if provided
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      // Merge initialData with current formData, preserving any unsaved changes
      const mergedData = { ...initialFormData, ...initialData };
      setFormData(mergedData);
    }
  }, [initialData]);

  // UI state
  const [activeSection, setActiveSection] = useState("core");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refs for auto-save
  const autoSaveTimeoutRef = useRef(null);
  const lastSaveTimeRef = useRef(Date.now());

  // Auto-save functionality
  const triggerAutoSave = useCallback(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    
    autoSaveTimeoutRef.current = setTimeout(() => {
      lastSaveTimeRef.current = Date.now();
      console.log(`🔄 Auto-saved form data for ${formKey}`);
    }, 2000); // Save after 2 seconds of inactivity
  }, [formKey]);

  // Handle form field changes with auto-save
  const handleFieldChange = useCallback((field, value) => {
    updateField(field, value);
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    
    // Trigger auto-save
    triggerAutoSave();
  }, [updateField, errors, triggerAutoSave]);

  // Handle section data updates
  const handleSectionUpdate = useCallback((sectionKey, sectionData) => {
    updateFormData(sectionData);
    triggerAutoSave();
  }, [updateFormData, triggerAutoSave]);

  // Form validation
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    // Required fields validation
    if (!formData.business_name?.trim()) {
      newErrors.business_name = "Business name is required";
    }
    
    if (!formData.business_handle?.trim()) {
      newErrors.business_handle = "Business handle is required";
    }
    
    if (!formData.description?.trim()) {
      newErrors.description = "Description is required";
    }
    
    if (!formData.country?.trim()) {
      newErrors.country = "Country is required";
    }
    
    if (!formData.industry?.trim()) {
      newErrors.industry = "Industry is required";
    }
    
    // Email validation
    if (formData.business_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.business_email)) {
      newErrors.business_email = "Please enter a valid email address";
    }
    
    // Website validation
    if (formData.business_website && !formData.business_website.match(/^https?:\/\/.+/)) {
      newErrors.business_website = "Website must start with http:// or https://";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const transformedData = transformBusinessFormData(formData);
      await onSave(transformedData);
      
      // Clear persisted data on successful save
      clearPersistedData();
      
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, onSave, clearPersistedData]);

  // Handle form cancellation with confirmation if there are unsaved changes
  const handleCancel = useCallback(() => {
    if (hasUnsavedChanges()) {
      if (window.confirm("You have unsaved changes. Are you sure you want to cancel?")) {
        resetForm();
        onCancel?.();
      }
    } else {
      onCancel?.();
    }
  }, [hasUnsavedChanges, resetForm, onCancel]);

  // Cleanup auto-save timeout on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  // Determine which sections to show
  const sections = showAdminFields ? [...SECTIONS, ...ADMIN_SECTIONS] : SECTIONS;

  return (
    <div className="w-full">
      {/* Form Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#0a1628]">{title}</h2>
            {isRestored && (
              <p className="text-sm text-green-600 mt-1">
                ✅ Form data restored from previous session.
              </p>
            )}
            {hasUnsavedChanges() && (
              <p className="text-sm text-amber-600 mt-1">
                ⚠️ You have unsaved changes. Data is automatically saved locally.
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving || isSubmitting}
              className="px-6 py-2 bg-[#0d4f4f] text-white rounded-lg hover:bg-[#1a6b6b] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving || isSubmitting ? "Saving..." : "Save Business"}
            </button>
          </div>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {sections.map((section) => (
            <button
              key={section.key}
              onClick={() => setActiveSection(section.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeSection === section.key
                  ? "bg-[#0d4f4f] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <section.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{section.label}</span>
              {errors[section.key] && (
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {activeSection === "core" && (
          <CoreInfoSection
            form={formData}
            onChange={handleFieldChange}
            errors={errors}
            touched={touched}
          />
        )}
        
        {activeSection === "location" && (
          <LocationSection
            form={formData}
            onChange={handleFieldChange}
            errors={errors}
            touched={touched}
          />
        )}
        
        {activeSection === "overview" && (
          <div className="p-4 text-center text-gray-500">
            Overview section is being consolidated. Please use BusinessProfileFormStable instead.
          </div>
        )}
        
        {activeSection === "contact" && (
          <ContactDetailsSection
            form={formData}
            onChange={handleFieldChange}
            errors={errors}
            touched={touched}
          />
        )}
        
        {activeSection === "social" && (
          <SocialMediaSection
            form={formData}
            onChange={handleFieldChange}
            errors={errors}
            touched={touched}
          />
        )}
        
        {activeSection === "community" && (
          <CommunitySection
            form={formData}
            onChange={handleFieldChange}
            errors={errors}
            touched={touched}
          />
        )}
        
        {activeSection === "referral" && (
          <div className="space-y-4">
            <FormSection
              title="Referral Information"
              description="How did you hear about Pacific Discovery Network?"
            >
              <ReferralDropdown
                referralSource={formData.referral_source}
                referralDetails={formData.referral_details}
                onReferralSourceChange={(value) => handleFieldChange("referral_source", value)}
                onReferralDetailsChange={(value) => handleFieldChange("referral_details", value)}
              />
            </FormSection>
          </div>
        )}
        
        {activeSection === "brand" && (
          <BrandMediaSection
            form={formData}
            onChange={handleFieldChange}
            errors={errors}
            touched={touched}
          />
        )}
        
        {activeSection === "admin" && showAdminFields && (
          <AdminVisibilitySection
            form={formData}
            onChange={handleFieldChange}
            errors={errors}
            touched={touched}
          />
        )}
      </div>
    </div>
  );
}
