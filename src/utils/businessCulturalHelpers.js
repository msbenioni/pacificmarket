/**
 * Helper functions to handle cultural identity and languages for businesses
 * - For unclaimed businesses: use data from businesses table
 * - For claimed businesses: use data from user's profile
 * - Uses shared normalization utilities for consistent data handling
 */
import { normalizeCulturalIdentity, normalizeLanguagesSpoken, getCulturalIdentityLabel, getLanguageLabel } from './dataNormalization';

/**
 * Get resolved cultural and language data for a business
 * Returns comprehensive data structure for consistent rendering
 * @param {Object} business - Business object
 * @param {Object} userProfile - User profile object (optional)
 * @returns {Object} - Resolved cultural and language data
 */
export function getBusinessCulturalData(business, userProfile = null) {
  // Input validation
  if (!business) {
    return {
      culturalIdentitiesRaw: [],
      culturalIdentitiesDisplay: [],
      primaryCulturalIdentity: null,
      languagesRaw: [],
      languagesDisplay: [],
      primaryLanguage: null,
      hasCulturalInfo: false,
      sources: { cultural: 'none', languages: 'none' }
    };
  }

  // PROFILE-FIRST precedence: profile first, then business, then none
  let culturalSource = 'none';
  let languagesSource = 'none';
  
  let culturalRaw = [];
  let languagesRaw = [];
  
  // Helper function to check if a value is non-empty
  const hasValue = (value) => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return false;
  };
  
  // Check if business has merged profile data available
  const profileData = business?._profile_data || userProfile;
  
  // PROFILE-FIRST: Cultural identity resolution
  if (hasValue(profileData?.cultural_identity)) {
    culturalRaw = normalizeCulturalIdentity(profileData.cultural_identity);
    culturalSource = 'profile';
  } else if (hasValue(business?.cultural_identity)) {
    culturalRaw = normalizeCulturalIdentity(business.cultural_identity);
    culturalSource = 'business';
  }
  
  // PROFILE-FIRST: Languages resolution
  if (hasValue(profileData?.languages_spoken)) {
    languagesRaw = normalizeLanguagesSpoken(profileData.languages_spoken);
    languagesSource = 'profile';
  } else if (hasValue(business?.languages_spoken)) {
    languagesRaw = normalizeLanguagesSpoken(business.languages_spoken);
    languagesSource = 'business';
  }
  
  // Apply display labels with fallback to raw values if no label found
  const culturalDisplay = culturalRaw.map(id => getCulturalIdentityLabel(id) || id).filter(Boolean);
  const languagesDisplay = languagesRaw.map(lang => getLanguageLabel(lang) || lang).filter(Boolean);
  
  // Remove duplicates while preserving order
  const uniqueCulturalRaw = [...new Set(culturalRaw)];
  const uniqueCulturalDisplay = [...new Set(culturalDisplay)];
  const uniqueLanguagesRaw = [...new Set(languagesRaw)];
  const uniqueLanguagesDisplay = [...new Set(languagesDisplay)];
  
  return {
    culturalIdentitiesRaw: uniqueCulturalRaw,
    culturalIdentitiesDisplay: uniqueCulturalDisplay,
    primaryCulturalIdentity: uniqueCulturalDisplay[0] || null,
    languagesRaw: uniqueLanguagesRaw,
    languagesDisplay: uniqueLanguagesDisplay,
    primaryLanguage: uniqueLanguagesDisplay[0] || null,
    hasCulturalInfo: !!(uniqueCulturalDisplay.length > 0 || uniqueLanguagesDisplay.length > 0),
    sources: {
      cultural: culturalSource,
      languages: languagesSource
    }
  };
}

/**
 * Get cultural identity for display on business cards (legacy compatibility)
 * @param {Object} business - Business object
 * @param {Object} userProfile - User profile object (optional)
 * @returns {string|null} - Cultural identity to display
 */
export function getBusinessCulturalIdentity(business, userProfile = null) {
  const culturalData = getBusinessCulturalData(business, userProfile);
  return culturalData.primaryCulturalIdentity;
}

/**
 * Get languages spoken for display on business cards (legacy compatibility)
 * @param {Object} business - Business object
 * @param {Object} userProfile - User profile object (optional)
 * @returns {Array} - Languages array to display
 */
export function getBusinessLanguagesSpoken(business, userProfile = null) {
  const culturalData = getBusinessCulturalData(business, userProfile);
  return culturalData.languagesDisplay;
}

/**
 * Check if business should display cultural information
 * @param {Object} business - Business object
 * @param {Object} userProfile - User profile object (optional)
 * @returns {boolean} - Whether to show cultural info
 */
export function shouldShowCulturalInfo(business, userProfile = null) {
  const culturalData = getBusinessCulturalData(business, userProfile);
  return culturalData.hasCulturalInfo;
}
