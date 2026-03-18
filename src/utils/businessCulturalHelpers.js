/**
 * Helper functions to handle cultural identity and languages for businesses
 * - For unclaimed businesses: use data from businesses table
 * - For claimed businesses: use data from user's profile
 */

/**
 * Get cultural identity for display on business cards
 * @param {Object} business - Business object
 * @param {Object} userProfile - User profile object (optional)
 * @returns {string|null} - Cultural identity to display
 */
export function getBusinessCulturalIdentity(business, userProfile = null) {
  // If business is claimed and we have user profile data, use profile data
  if (business?.is_claimed && userProfile?.cultural_identity) {
    // Handle different data formats in profile
    if (Array.isArray(userProfile.cultural_identity) && userProfile.cultural_identity.length > 0) {
      return userProfile.cultural_identity[0]; // Return first cultural identity
    }
    return userProfile.cultural_identity;
  }
  
  // For unclaimed businesses, use business table data
  return business?.cultural_identity || null;
}

/**
 * Get languages spoken for display on business cards
 * @param {Object} business - Business object
 * @param {Object} userProfile - User profile object (optional)
 * @returns {Array} - Languages array to display
 */
export function getBusinessLanguagesSpoken(business, userProfile = null) {
  // If business is claimed and we have user profile data, use profile data
  if (business?.is_claimed && userProfile?.languages_spoken) {
    // Handle different data formats in profile
    if (Array.isArray(userProfile.languages_spoken)) {
      return userProfile.languages_spoken;
    }
    if (typeof userProfile.languages_spoken === 'string') {
      return userProfile.languages_spoken.split(',').map(lang => lang.trim()).filter(Boolean);
    }
    return [];
  }
  
  // For unclaimed businesses, use business table data
  if (business?.languages_spoken) {
    if (Array.isArray(business.languages_spoken)) {
      return business.languages_spoken;
    }
    if (typeof business.languages_spoken === 'string') {
      return business.languages_spoken.split(',').map(lang => lang.trim()).filter(Boolean);
    }
  }
  
  return [];
}

/**
 * Check if business should display cultural information
 * @param {Object} business - Business object
 * @param {Object} userProfile - User profile object (optional)
 * @returns {boolean} - Whether to show cultural info
 */
export function shouldShowCulturalInfo(business, userProfile = null) {
  const culturalIdentity = getBusinessCulturalIdentity(business, userProfile);
  const languagesSpoken = getBusinessLanguagesSpoken(business, userProfile);
  
  return !!(culturalIdentity || (languagesSpoken && languagesSpoken.length > 0));
}
