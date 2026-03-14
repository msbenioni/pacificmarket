import { EMPTY_STATE_CONFIG } from "@/constants/businessCardConfig";

/**
 * Data transformation utilities for business operations
 */

/**
 * Sanitize and transform business payload for API submission
 * @param {Object} formData - Raw form data
 * @returns {Object} - Sanitized payload
 */
export function sanitizeBusinessPayload(formData) {
  const {
    id,
    created_at,
    created_date,
    updated_at,
    verification_source,
    logo_file,
    banner_file,
    owner_user_id,
    created_by,
    claimed_at,
    claimed_by,
    profile_completeness,
    referral_code,
    source,
    visibility_tier,
    social_links,
    primary_market,
    growth_stage,
    business_operating_status,
    business_age,
    full_time_employees,
    part_time_employees,
    business_registered,
    sales_channels,
    import_export_status,
    revenue_band,
    competitive_advantage,
    ...rest
  } = formData;

  const allowedFields = [
    "name",
    "business_handle",
    "tagline",
    "description",
    "contact_name",
    "contact_email",
    "contact_phone",
    "contact_website",
    "business_hours",
    "country",
    "city",
    "suburb",
    "address",
    "state_region",
    "postal_code",
    "industry",
    "business_structure",
    "team_size_band",
    "cultural_identity",
    "languages_spoken",
    "year_started",
    "subscription_tier",
    "status",
    "is_verified",
    "is_claimed",
    "is_homepage_featured",
    "owner_user_id",
    "created_by",
    "source",
    "profile_completeness",
    "referral_code",
    "logo_url",
    "banner_url",
    "social_links",
    "business_age",
    "business_operating_status",
    "business_registered",
    "full_time_employees",
    "part_time_employees",
    "sales_channels",
    "import_export_status",
    "revenue_band",
    "primary_market",
    "competitive_advantage",
    "visibility_tier",
    "business_owner",
    "business_owner_email",
    "additional_owner_emails",
    "public_phone",
    "annual_revenue_exact",
    "business_challenges",
    "future_plans",
    "tech_stack",
    "customer_segments",
    "funding_source",
    "growth_stage",
    "proof_links"
  ];

  const payload = {};
  const filteredFields = [];
  
  allowedFields.forEach((field) => {
    if (rest[field] !== undefined) {
      payload[field] = rest[field];
    }
  });

  // Check for fields that exist in formData but not in allowedFields
  Object.keys(rest).forEach(field => {
    if (!allowedFields.includes(field)) {
      filteredFields.push(field);
    }
  });

  if (filteredFields.length > 0) {
    console.warn('Fields filtered out during sanitization:', filteredFields);
  }

  console.log('Sanitized payload:', payload);
  return payload;
}

/**
 * Validate business data with flexible validation for partial updates
 * @param {Object} data - Business data to validate
 * @param {boolean} isCompleteProfile - If true, validate all required fields for complete profile
 * @returns {Object} - Validation result with errors
 */
export function validateBusinessData(data, isCompleteProfile = false) {
  const errors = {};

  // Only validate required fields if this is a complete business profile creation/update
  if (!isCompleteProfile) {
    // For partial updates, allow saving any fields without validation
    return {
      isValid: true,
      errors: {},
    };
  }

  // Full validation only for complete business profiles
  if (!data.name?.trim()) {
    errors.name = "Business name is required";
  }

  if (!data.business_handle?.trim()) {
    errors.business_handle = "Business handle is required";
  } else if (!/^[a-z0-9-]+$/.test(data.business_handle)) {
    errors.business_handle = "Business handle can only contain lowercase letters, numbers, and hyphens";
  }

  if (!data.contact_email?.trim()) {
    errors.contact_email = "Contact email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact_email)) {
    errors.contact_email = "Please enter a valid email address";
  }

  if (!data.country) {
    errors.country = "Country is required";
  }

  if (!data.industry) {
    errors.industry = "Industry is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Portal-specific helper utilities
 */

/**
 * Get empty state configuration based on context
 * @param {string} type - Type of empty state ('noBusinesses', 'needsProfile', etc.)
 * @param {Object} onboardingStatus - User's onboarding status
 * @returns {Object} - Empty state configuration
 */
export function getEmptyStateConfig(type, onboardingStatus = {}) {
  const baseConfig = EMPTY_STATE_CONFIG[type];
  if (!baseConfig) return null;

  // Adjust actions based on onboarding status
  if (type === 'noBusinesses' && onboardingStatus.needsProfile) {
    return EMPTY_STATE_CONFIG.needsProfile;
  }

  return baseConfig;
}

/**
 * Get tab status for display
 * @param {string} tabId - Tab identifier
 * @param {Object} data - Data object with relevant info
 * @returns {string|undefined} - Status indicator
 */
export function getTabStatus(tabId, data = {}) {
  const { insightSnapshots = [], insightsStarted = false } = data;
  
  if (tabId === "insights") {
    return insightSnapshots.length > 0
      ? "completed"
      : insightsStarted
      ? "started"
      : "not-started";
  }
  
  return undefined;
}

/**
 * Check if user can access specific tab
 * @param {string} tabId - Tab identifier
 * @param {Object} user - User object
 * @param {Array} businesses - User's businesses
 * @returns {boolean} - Whether user can access tab
 */
export function canAccessTab(tabId, user, businesses = []) {
  switch (tabId) {
    case "tools":
      return businesses.some((b) => b.subscription_tier === "MOANA");
    case "insights":
      return !!user; // Must be logged in
    case "my-businesses":
    case "claims":
      return true; // Always accessible
    default:
      return false;
  }
}

/**
 * Format user data for display
 * @param {Object} authUser - Auth user data
 * @param {Object} profileData - Profile data
 * @returns {Object} - Enhanced user object
 */
export function formatUserData(authUser, profileData) {
  return {
    ...authUser,
    role: profileData?.role || "owner",
    permissions: profileData?.role === "admin" ? ["read", "write", "delete"] : [],
    full_name:
      profileData?.display_name ||
      authUser.user_metadata?.full_name ||
      authUser.user_metadata?.display_name,
    display_name:
      profileData?.display_name ||
      authUser.user_metadata?.display_name ||
      authUser.user_metadata?.full_name,
  };
}

/**
 * Generate business handle from business name
 * @param {string} name - Business name
 * @returns {string} - Generated handle
 */
export function generateBusinessHandle(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

/**
 * Check if business handle is available
 * @param {string} handle - Handle to check
 * @param {Array} existingBusinesses - Existing businesses
 * @param {string} excludeId - Business ID to exclude from check (for updates)
 * @returns {boolean} - Whether handle is available
 */
export function isBusinessHandleAvailable(handle, existingBusinesses = [], excludeId = null) {
  return !existingBusinesses.some(
    business => business.business_handle === handle && business.id !== excludeId
  );
}
