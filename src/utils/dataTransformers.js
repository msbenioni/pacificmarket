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
    logo_remove,
    banner_remove,
    mobile_banner_remove,
    banner_file,
    mobile_banner_file,
    owner_user_id,
    created_by,
    claimed_at,
    claimed_by,
    profile_completeness,
    source,
    ...rest
  } = formData;

  const allowedFields = [
    "business_name",
    "business_handle",
    "tagline",
    "description",
    "business_email",
    "business_phone",
    "business_website",
    "business_hours",
    "address",
    "suburb",
    "city",
    "state_region",
    "postal_code",
    "country",
    "industry",
    "year_started",
    "business_stage",
    "business_structure",
    "team_size_band",
    "is_business_registered",
    "founder_story",
    "age_range",
    "gender",
    "collaboration_interest",
    "mentorship_offering",
    "open_to_future_contact",
    "business_acquisition_interest",
    "social_links",
    "role",
    "business_contact_person",
    "logo_url",
    "banner_url",
    "mobile_banner_url",
    "subscription_tier",
    "visibility_tier",
    "visibility_mode",
    "status",
    "is_verified",
    "is_claimed"
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

  // Only warn about unexpected fields (not standard file/metadata fields we expect to filter)
  const expectedFilteredFields = [
    'logo_file', 'banner_file', 'mobile_banner_file', 'logo_remove', 'banner_remove', 'mobile_banner_remove',
    'id', 'created_at', 'created_date', 'updated_at', 'verification_source', 'owner_user_id', 
    'created_by', 'claimed_at', 'claimed_by', 'profile_completeness', 'source'
  ];
  
  const unexpectedFields = filteredFields.filter(field => !expectedFilteredFields.includes(field));
  
  if (unexpectedFields.length > 0) {
    console.warn('Unexpected fields filtered out during sanitization:', unexpectedFields);
  }

  return payload;
}

/**
 * Validate business data - no required fields for any updates
 * @param {Object} data - Business data to validate
 * @returns {Object} - Validation result with errors
 */
export function validateBusinessData(data) {
  const errors = {};

  // No required fields - allow saving any fields without validation
  // Only validate format if fields are provided
  
  if (data.business_handle && !data.business_handle.trim()) {
    errors.business_handle = "Business handle can only contain lowercase letters, numbers, and hyphens";
  } else if (data.business_handle && !/^[a-z0-9-]+$/.test(data.business_handle)) {
    errors.business_handle = "Business handle can only contain lowercase letters, numbers, and hyphens";
  }

  if (data.business_email && !data.business_email.trim()) {
    errors.business_email = "Please enter a valid email address";
  } else if (data.business_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.business_email)) {
    errors.business_email = "Please enter a valid email address";
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
      return businesses.some((b) => b.subscription_tier === "moana");
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
  const enhancedUser = {
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
    private_email: profileData?.private_email || authUser.email || "",
  };
  return enhancedUser;
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
