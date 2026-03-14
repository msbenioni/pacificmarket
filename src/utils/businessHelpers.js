/**
 * Business Helper Functions
 * Utilities for working with business ownership and profiles
 */

import { COUNTRIES, INDUSTRIES } from "@/constants/unifiedConstants";
import { TIER_STYLES } from "@/constants/portalUI";

/**
 * Get business owner information from profiles table
 * @param {string} ownerUserId - The owner_user_id from businesses table
 * @param {Array} profiles - Array of profile objects
 * @returns {Object|null} - Profile information for the business owner
 */
export function getBusinessOwner(ownerUserId, profiles = []) {
  if (!ownerUserId || !profiles.length) return null;
  
  return profiles.find(profile => profile.id === ownerUserId) || null;
}

/**
 * Get business owner display name
 * @param {string} ownerUserId - The owner_user_id from businesses table
 * @param {Array} profiles - Array of profile objects
 * @returns {string} - Display name for the business owner
 */
export function getBusinessOwnerName(ownerUserId, profiles = []) {
  const owner = getBusinessOwner(ownerUserId, profiles);
  return owner?.display_name || owner?.email || 'Unknown Owner';
}

/**
 * Get business owner email
 * @param {string} ownerUserId - The owner_user_id from businesses table
 * @param {Array} profiles - Array of profile objects
 * @returns {string} - Email for the business owner
 */
export function getBusinessOwnerEmail(ownerUserId, profiles = []) {
  const owner = getBusinessOwner(ownerUserId, profiles);
  return owner?.email || '';
}

/**
 * Check if user owns a specific business
 * @param {string} userId - User ID to check
 * @param {Object} business - Business object with owner_user_id
 * @returns {boolean} - True if user owns the business
 */
export function userOwnsBusiness(userId, business) {
  return userId && business && business.owner_user_id === userId;
}

/**
 * Get all businesses owned by a user
 * @param {string} userId - User ID
 * @param {Array} businesses - Array of business objects
 * @returns {Array} - Businesses owned by the user
 */
export function getUserBusinesses(userId, businesses = []) {
  if (!userId) return [];
  return businesses.filter(business => business.owner_user_id === userId);
}

/**
 * Format business owner information for display
 * @param {Object} business - Business object
 * @param {Array} profiles - Array of profile objects
 * @returns {Object} - Formatted owner information
 */
export function formatBusinessOwnerInfo(business, profiles = []) {
  if (!business) return null;
  
  const owner = getBusinessOwner(business.owner_user_id, profiles);
  
  return {
    id: business.owner_user_id,
    name: owner?.display_name || owner?.email || 'Unknown Owner',
    email: owner?.email || '',
    role: owner?.role || null,
    businessId: business.id,
    businessName: business.name
  };
}

/**
 * Get country label from country value
 * @param {string} countryValue - Country value from constants
 * @returns {string} - Human-readable country name
 */
export function getCountryLabel(countryValue) {
  const country = COUNTRIES.find((c) => c.value === countryValue);
  return country ? country.label : countryValue;
}

/**
 * Get industry label from industry value
 * @param {string} industryValue - Industry value from constants
 * @returns {string} - Human-readable industry name
 */
export function getIndustryLabel(industryValue) {
  const industry = INDUSTRIES.find((i) => i.value === industryValue);
  return industry ? industry.label : industryValue;
}

/**
 * Get business display information
 * @param {Object} business - Business object
 * @returns {Object} - Formatted business display info
 */
export function getBusinessDisplayInfo(business) {
  if (!business) return null;

  const metaParts = [
    business.city ? `${business.city}, ${getCountryLabel(business.country)}` : getCountryLabel(business.country),
    getIndustryLabel(business.industry),
  ].filter(Boolean);

  return {
    name: business.name,
    metaDescription: metaParts.join(" · "),
    tierStyles: TIER_STYLES.getTierStyles(business.subscription_tier),
    isVerified: business.is_verified,
    logoUrl: business.logo_url,
    subscriptionTier: business.subscription_tier,
  };
}

/**
 * Check if business needs upgrade prompt
 * @param {Array} businesses - Array of business objects
 * @returns {boolean} - True if should show upgrade prompt
 */
export function shouldShowUpgradePrompt(businesses = []) {
  return businesses.length > 0 && 
         !businesses.some((b) => b.subscription_tier !== "VAKA");
}

/**
 * Get available actions for a business based on user permissions
 * @param {Object} business - Business object
 * @param {Object} user - User object
 * @param {boolean} isEditing - Whether business is currently being edited
 * @returns {Array} - Available actions
 */
export function getBusinessActions(business, user, isEditing = false) {
  const actions = [];
  
  if (isEditing) {
    actions.push({
      key: "cancel",
      label: "Cancel",
      handler: "cancelEditingBusiness",
      style: "icon",
    });
  } else {
    actions.push({
      key: "edit",
      label: "Edit",
      handler: "startEditingBusiness",
      style: "iconPrimary",
    });
  }
  
  // Always available actions
  actions.push(
    {
      key: "delete",
      label: "Delete",
      handler: "handleDeleteBusiness",
      style: "danger",
    },
    {
      key: "addOwner",
      label: "Add Owner",
      handler: "handleAddOwner",
      style: "iconSecondary",
    },
    {
      key: "logo",
      label: "Logo",
      handler: "handleLogoUpload",
      style: "iconSecondary",
      isLabel: true,
    }
  );
  
  return actions;
}
