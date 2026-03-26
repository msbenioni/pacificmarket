/**
 * Shared hook for business cultural data with automatic profile-first resolution
 * Ensures consistent data fetching pattern across all components
 */

import { useMemo } from 'react';
import { getBusinessCulturalData } from '@/utils/businessCulturalHelpers';

/**
 * Hook to get cultural data with automatic profile-first resolution
 * @param {Object} business - Business object with optional _profile_data
 * @returns {Object} - Cultural data with source tracking
 */
export function useBusinessCulturalData(business) {
  return useMemo(() => {
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

    // Automatically pass profile data if available
    const profileData = business._profile_data || null;
    return getBusinessCulturalData(business, profileData);
  }, [business]);
}

/**
 * Utility function for non-hook usage (class components or outside React)
 * @param {Object} business - Business object with optional _profile_data
 * @returns {Object} - Cultural data with source tracking
 */
export function getBusinessCulturalDataAuto(business) {
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

  // Automatically pass profile data if available
  const profileData = business._profile_data || null;
  return getBusinessCulturalData(business, profileData);
}
