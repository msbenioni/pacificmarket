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

  // Determine source of truth: business-level first, then profile fallback
  let culturalSource = 'business';
  let languagesSource = 'business';
  
  let culturalRaw = [];
  let languagesRaw = [];
  
  // Check if business already has profile fallback data merged
  if (business?._profile_fallback) {
    // Business already has fallback data applied
    culturalRaw = normalizeCulturalIdentity(business.cultural_identity);
    languagesRaw = normalizeLanguagesSpoken(business.languages_spoken);
    culturalSource = business._profile_fallback.cultural_identity ? 'profile' : 'business';
    languagesSource = business._profile_fallback.languages_spoken ? 'profile' : 'business';
  } else {
    // Manual fallback logic for when profile data isn't pre-merged
    // Cultural identity resolution
    if (business?.cultural_identity && business.cultural_identity !== null) {
      culturalRaw = normalizeCulturalIdentity(business.cultural_identity);
      culturalSource = 'business';
    } else if (userProfile?.cultural_identity && userProfile.cultural_identity !== null) {
      culturalRaw = normalizeCulturalIdentity(userProfile.cultural_identity);
      culturalSource = 'profile';
    }
    
    // Languages resolution
    if (business?.languages_spoken && business.languages_spoken !== null) {
      languagesRaw = normalizeLanguagesSpoken(business.languages_spoken);
      languagesSource = 'business';
    } else if (userProfile?.languages_spoken && userProfile.languages_spoken !== null) {
      languagesRaw = normalizeLanguagesSpoken(userProfile.languages_spoken);
      languagesSource = 'profile';
    }
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
