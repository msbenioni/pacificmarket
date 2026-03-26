/**
 * Helper functions to handle cultural identity and languages for businesses
 * - For unclaimed businesses: use data from businesses table
 * - For claimed businesses: use data from user's profile
 * - Uses unified parsing logic from FlagIcon for consistency
 * Updated: Fixed module caching issues v3
 */

// Import unified parsing functions
import { parseIdentities, dedupe } from "@/utils/parsingUtils";

/**
 * Get resolved cultural and language data for a business
 * Returns comprehensive data structure for consistent rendering
 * @param {Object} business - Business object
 * @param {Object} userProfile - User profile object (optional)
 * @returns {Object} - Resolved cultural and language data
 */
export function getBusinessCulturalData(business, userProfile = null) {
  try {
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

    // Helper function to check if a value is non-empty
    const hasValue = (value) => {
      if (value === null || value === undefined) return false;
      if (typeof value === 'string') return value.trim().length > 0;
      if (Array.isArray(value)) return value.some((v) => String(v ?? "").trim().length > 0);
      return true;
    };

    // Resolve cultural identities
    let culturalSource = 'none';
    let culturalRaw = [];

    if (hasValue(userProfile?.cultural_identity)) {
      culturalRaw = userProfile.cultural_identity;
      culturalSource = 'user_profile';
    } else if (hasValue(business?.cultural_identity)) {
      culturalRaw = business.cultural_identity;
      culturalSource = 'business';
    }

    // Resolve languages
    let languagesSource = 'none';
    let languagesRaw = [];

    if (hasValue(userProfile?.languages_spoken)) {
      languagesRaw = userProfile.languages_spoken;
      languagesSource = 'user_profile';
    } else if (hasValue(business?.languages_spoken)) {
      languagesRaw = business.languages_spoken;
      languagesSource = 'business';
    }

    // Parse and dedupe using shared utilities
    const culturalParsed = parseIdentities(culturalRaw);
    const languagesParsed = parseIdentities(languagesRaw);

    // The parsed values are already the display labels (canonical form) and deduped
    const culturalDisplay = culturalParsed;
    const languagesDisplay = languagesParsed;
    
    return {
      culturalIdentitiesRaw: culturalRaw,
      culturalIdentitiesDisplay: culturalDisplay,
      primaryCulturalIdentity: culturalDisplay[0] || null,
      languagesRaw: languagesRaw,
      languagesDisplay: languagesDisplay,
      primaryLanguage: languagesDisplay[0] || null,
      hasCulturalInfo: !!(culturalDisplay.length > 0 || languagesDisplay.length > 0),
      sources: {
        cultural: culturalSource,
        languages: languagesSource
      }
    };
  } catch (error) {
    console.error("[businessCulturalHelpers] getBusinessCulturalData failed", { business, userProfile, error });
    return {
      culturalIdentitiesRaw: [],
      culturalIdentitiesDisplay: [],
      primaryCulturalIdentity: null,
      languagesRaw: [],
      languagesDisplay: [],
      primaryLanguage: null,
      hasCulturalInfo: false,
      sources: { cultural: 'error', languages: 'error' }
    };
  }
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
