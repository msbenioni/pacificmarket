/**
 * Helper functions to handle cultural identity and languages for businesses
 * - For unclaimed businesses: use data from businesses table
 * - For claimed businesses: use data from user's profile
 * - Uses unified parsing logic from FlagIcon for consistency
 * Updated: Fixed module caching issues v3
 */

// Import unified parsing functions and constants
import { getCountryDisplayName } from "@/constants/unifiedConstants";
import { dedupe, parseIdentities } from "@/utils/parsingUtils";

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
        sources: { cultural: "none", languages: "none" }
      };
    }

    const hasValue = (value) => {
      if (value === null || value === undefined) return false;
      if (typeof value === "string") return value.trim().length > 0;
      if (Array.isArray(value)) return value.some((v) => String(v ?? "").trim().length > 0);
      return true;
    };

    let culturalSource = "none";
    let culturalInput = [];
    let languagesSource = "none";
    let languagesInput = [];

    if (hasValue(userProfile?.cultural_identity)) {
      culturalInput = userProfile.cultural_identity;
      culturalSource = "user_profile";
    } else if (hasValue(business?.cultural_identity)) {
      culturalInput = business.cultural_identity;
      culturalSource = "business";
    }

    if (hasValue(userProfile?.languages_spoken)) {
      languagesInput = userProfile.languages_spoken;
      languagesSource = "user_profile";
    } else if (hasValue(business?.languages_spoken)) {
      languagesInput = business.languages_spoken;
      languagesSource = "business";
    }

    const culturalParsed = dedupe(parseIdentities(culturalInput)).filter(Boolean);
    const languagesParsed = dedupe(parseIdentities(languagesInput)).filter(Boolean);

    // Fallback: if no cultural identity, use country as cultural identity
    let finalCulturalParsed = culturalParsed;
    let finalCulturalSource = culturalSource;
    
    if (finalCulturalParsed.length === 0 && business?.country) {
      // Use country display name as cultural identity fallback
      const countryDisplayName = getCountryDisplayName(business.country);
      finalCulturalParsed = [countryDisplayName];
      finalCulturalSource = "country_fallback";
    }

    return {
      culturalIdentitiesRaw: finalCulturalParsed,
      culturalIdentitiesDisplay: finalCulturalParsed,
      primaryCulturalIdentity: finalCulturalParsed[0] || null,
      languagesRaw: languagesParsed,
      languagesDisplay: languagesParsed,
      primaryLanguage: languagesParsed[0] || null,
      hasCulturalInfo: !!(finalCulturalParsed.length > 0 || languagesParsed.length > 0),
      sources: {
        cultural: finalCulturalSource,
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
      sources: { cultural: "error", languages: "error" }
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
