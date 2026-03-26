/**
 * Shared utilities for cultural identity and flag rendering
 * Single source of truth for parsing, display, and flag mapping
 */

import { COUNTRIES, CULTURAL_IDENTITIES } from "@/constants/unifiedConstants";
import { resolveCanonicalLabel, parseIdentities, dedupe } from "@/utils/parsingUtils";

// All valid labels for canonical resolution
const ALL_VALID_LABELS = [
  ...CULTURAL_IDENTITIES,
  ...COUNTRIES.map((c) => c.label),
];

// Mapping from display identity to flag country
export const DISPLAY_TO_FLAG_COUNTRY = {
  "New Zealand Maori": "New Zealand",
  "Cook Islands Maori": "Cook Islands",
  "I-Kiribati": "Kiribati",
  "Marshallese": "Marshall Islands",
  "Chuukese": "Micronesia",
  "Pohnpeian": "Micronesia",
  "Yapese": "Micronesia",
  "Kosraean": "Micronesia",
  "Nauruan": "Nauru",
  "Niuean": "Niue",
  "Palauan": "Palau",
  "Papuan": "Papua New Guinea",
  "Samoan": "Samoa",
  "Tongan": "Tonga",
  "Tuvaluan": "Tuvalu",
  "Ni-Vanuatu": "Vanuatu",
  "Fijian": "Fiji",
  "Indo-Fijian": "Fiji",
  "Rotuman": "Fiji",
  "Australia - Torres Strait Islander": "Australia",
  "Australia - Aboriginal": "Australia",
};

// Mapping from country to ISO flag codes
export const COUNTRY_FLAG_CODES = {
  "American Samoa": "AS",
  "Australia": "AU",
  "Cook Islands": "CK",
  "Fiji": "FJ",
  "French Polynesia": "PF",
  "Guam": "GU",
  "Kiribati": "KI",
  "Marshall Islands": "MH",
  "Micronesia": "FM",
  "Nauru": "NR",
  "New Caledonia": "NC",
  "New Zealand": "NZ",
  "Niue": "NU",
  "Northern Mariana Islands": "MP",
  "Palau": "PW",
  "Papua New Guinea": "PG",
  "Samoa": "WS",
  "Solomon Islands": "SB",
  "Tokelau": "TK",
  "Tonga": "TO",
  "Tuvalu": "TV",
  "Vanuatu": "VU",
  "Wallis and Futuna": "WF",
  "Hawaii": "US",
  "United States": "US",
  "Ireland": "IE",
  "China": "CN",
  "India": "IN",
  "Italy": "IT",
  "Japan": "JP",
  "South Korea": "KR",
};

/**
 * Get canonical display label for an identity
 * @param {string} identity - Raw identity value
 * @returns {string} - Canonical display label
 */
export function getDisplayLabel(identity) {
  return resolveCanonicalLabel(identity);
}

/**
 * Get flag country for a display identity
 * @param {string} identity - Display identity
 * @returns {string|null} - Country name or null
 */
export function getFlagCountry(identity) {
  const label = getDisplayLabel(identity);
  return DISPLAY_TO_FLAG_COUNTRY[label] || label || null;
}

/**
 * Get ISO flag code for an identity
 * @param {string} identity - Identity value
 * @returns {string|null} - ISO country code or null
 */
export function getFlagCode(identity) {
  const country = getFlagCountry(identity);
  return country ? COUNTRY_FLAG_CODES[country] || null : null;
}

/**
 * Get parsed flag items for rendering
 * @param {string|string[]} input - Raw identity input
 * @param {Object} options - Options object
 * @returns {Array} - Array of flag item objects
 */
export function getFlagItems(input, options = {}) {
  const { maxItems = null, debug = false } = options;
  
  // Parse and dedupe identities
  const identities = dedupe(parseIdentities(input));
  
  if (debug) {
    console.log('🔍 Flag Debug - Input:', input);
    console.log('🔍 Flag Debug - Parsed:', identities);
  }
  
  // Convert to flag items
  let flagItems = identities.map(identity => {
    const displayLabel = getDisplayLabel(identity);
    const flagCountry = getFlagCountry(identity);
    const flagCode = getFlagCode(identity);
    
    if (debug) {
      console.log('🔍 Flag Debug - Item:', {
        identity,
        displayLabel,
        flagCountry,
        flagCode
      });
    }
    
    return {
      identity,
      displayLabel,
      flagCountry,
      flagCode,
    };
  });
  
  // Apply max limit if specified
  if (maxItems && maxItems > 0) {
    flagItems = flagItems.slice(0, maxItems);
  }
  
  return flagItems;
}

/**
 * Get flag items with overflow indicator
 * @param {string|string[]} input - Raw identity input
 * @param {Object} options - Options object
 * @returns {Object} - { items: Array, overflow: number }
 */
export function getFlagItemsWithOverflow(input, options = {}) {
  const { maxItems = 3 } = options;
  const allItems = getFlagItems(input, { ...options, maxItems: null });
  const items = allItems.slice(0, maxItems);
  const overflow = Math.max(0, allItems.length - maxItems);
  
  return { items, overflow };
}
