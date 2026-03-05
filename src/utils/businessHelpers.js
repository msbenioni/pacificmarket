/**
 * Business Helper Functions
 * Utilities for working with business ownership and profiles
 */

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
