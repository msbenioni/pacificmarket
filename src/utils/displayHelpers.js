/**
 * Unified Display Helpers
 * Single source of truth for formatting and display utilities
 * Used across FeaturedSpotlight, BusinessCard, and other components
 */

import { COUNTRIES, INDUSTRIES, LANGUAGES } from "@/constants/unifiedConstants";

/**
 * Format language code to readable name using unified constants
 */
export function formatLanguageName(languageCode) {
  if (!languageCode) return "";

  // Use unified constants from unifiedConstants.js
  const language = LANGUAGES.find(l => l.value === languageCode.toLowerCase());
  if (language) return language.label;

  // Fallback: try case-insensitive match
  const caseInsensitiveMatch = LANGUAGES.find(l => 
    l.value.toLowerCase() === languageCode.toLowerCase().trim()
  );
  if (caseInsensitiveMatch) return caseInsensitiveMatch.label;

  // Final fallback: format the code
  const normalized = String(languageCode).trim().toLowerCase();
  return normalized
    .replace(/[[\]"]/g, "")
    .split(/[-_, ]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Format languages array for display with proper joining
 */
export function formatLanguages(languages) {
  if (!languages || languages.length === 0) return '';
  
  const formattedLanguages = Array.isArray(languages) 
    ? languages.map(lang => formatLanguageName(lang))
    : [formatLanguageName(languages)];
  
  if (formattedLanguages.length <= 2) {
    return formattedLanguages.join(' & ');
  }
  
  return `${formattedLanguages.slice(0, 2).join(' & ')} +${formattedLanguages.length - 2} more`;
}

/**
 * Convert country slug to readable display name
 */
export function getCountryDisplayName(countrySlug) {
  if (!countrySlug) return "";
  
  const country = COUNTRIES.find(c => c.value === countrySlug);
  return country ? country.label : countrySlug;
}

/**
 * Convert industry slug to readable display name
 */
export function getIndustryDisplayName(industrySlug) {
  if (!industrySlug) return "";
  
  const industry = INDUSTRIES.find(i => i.value === industrySlug);
  return industry ? industry.label : industrySlug;
}

/**
 * Alias functions for backward compatibility with BusinessCard
 */
export const getCountryLabel = getCountryDisplayName;
export const getIndustryLabel = getIndustryDisplayName;

/**
 * Format display list with proper joining and truncation
 */
export function formatDisplayList(items, options = {}) {
  const { max = 3, separator = ", ", finalSeparator = " & " } = options;
  
  if (!items || !Array.isArray(items)) return "";
  
  const unique = [...new Set(items.filter(Boolean))];
  if (unique.length === 0) return "";
  
  if (unique.length === 1) return unique[0];
  if (unique.length === 2) return unique.join(finalSeparator);
  if (unique.length <= max) {
    return unique.slice(0, -1).join(separator) + finalSeparator + unique[unique.length - 1];
  }
  
  return unique.slice(0, max - 1).join(separator) + finalSeparator + unique[max - 1] + ` +${unique.length - max} more`;
}
