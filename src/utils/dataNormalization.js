/**
 * Shared data normalization utilities for cultural identity and languages
 * Handles arrays, JSON strings, comma-separated values, and single strings
 */

/**
 * Normalize cultural identity data to consistent array format
 * @param {any} data - Raw cultural identity data
 * @returns {Array} - Normalized array of cultural identities
 */
export const normalizeCulturalIdentity = (data) => {
  if (!data) return [];
  
  let values = [];
  
  // If already an array, process it
  if (Array.isArray(data)) {
    values = data;
  } else if (typeof data === 'string') {
    try {
      // Try parsing as JSON array
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        values = parsed;
      } else {
        values = [data];
      }
    } catch (e) {
      // Not JSON, try parsing legacy format like "{samoan}"
      const legacyFixed = data.replace(/^{/, "[").replace(/}$/, "]");
      try {
        const parsed = JSON.parse(legacyFixed);
        if (Array.isArray(parsed)) {
          values = parsed;
        } else {
          values = [data];
        }
      } catch (e2) {
        // Handle comma-separated values
        if (data.includes(',')) {
          values = data.split(',').map(item => item.trim()).filter(Boolean);
        } else {
          // Single string value
          values = [data];
        }
      }
    }
  } else {
    values = [data];
  }
  
  // Normalize each value: trim, remove empty, normalize format
  const normalized = values
    .filter(Boolean)
    .map(val => String(val).trim())
    .filter(val => val.length > 0)
    .map(val => normalizeCulturalIdentityValue(val))
    .filter(Boolean);
  
  // Remove duplicates while preserving order
  return [...new Set(normalized)];
};

/**
 * Normalize individual cultural identity value to standard format
 * @param {string} value - Raw cultural identity value
 * @returns {string} - Normalized value
 */
const normalizeCulturalIdentityValue = (value) => {
  const normalized = value.toLowerCase().replace(/\s+/g, '-');
  
  // Map various formats to standard values
  const mappings = {
    'cook islands': 'cook-islands',
    'cook-islands': 'cook-islands',
    'cook islands māori': 'cook-islands-māori',
    'cook-islands-māori': 'cook-islands-māori',
    'cookislandsmaori': 'cook-islands-māori',
    'cook-islands-maori': 'cook-islands-māori',
    'rarotongan': 'cook-islands-māori',
    'french polynesia': 'french-polynesia',
    'french-polynesia': 'french-polynesia',
    'tahitian': 'tahitian',
    'māori': 'māori',
    'maori': 'māori',
    'te-reo-māori': 'māori',
    'te reo māori': 'māori',
    'samoan': 'samoan',
    'tongan': 'tongan',
    'fijian': 'fijian',
    'niuean': 'niuean',
    'tuvaluan': 'tuvaluan',
    'tokelauan': 'tokelauan',
    'pacific': 'pacific',
    'other-pacific': 'other-pacific'
  };
  
  return mappings[normalized] || normalized;
};

/**
 * Normalize languages spoken data to consistent array format
 * @param {any} data - Raw languages spoken data
 * @returns {Array} - Normalized array of languages
 */
export const normalizeLanguagesSpoken = (data) => {
  if (!data) return [];
  
  let values = [];
  
  // If already an array, process it
  if (Array.isArray(data)) {
    values = data;
  } else if (typeof data === 'string') {
    try {
      // Try parsing as JSON array
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        values = parsed;
      } else {
        values = [data];
      }
    } catch (e) {
      // Handle comma-separated values
      if (data.includes(',')) {
        values = data.split(',').map(item => item.trim()).filter(Boolean);
      } else {
        // Single string value
        values = [data];
      }
    }
  } else {
    values = [data];
  }
  
  // Normalize each value: trim, remove empty, normalize format
  const normalized = values
    .filter(Boolean)
    .map(val => String(val).trim())
    .filter(val => val.length > 0)
    .map(val => normalizeLanguageValue(val))
    .filter(Boolean);
  
  // Remove duplicates while preserving order
  return [...new Set(normalized)];
};

/**
 * Normalize individual language value to standard format
 * @param {string} value - Raw language value
 * @returns {string} - Normalized value
 */
const normalizeLanguageValue = (value) => {
  const normalized = value.toLowerCase().replace(/\s+/g, '-');
  
  // Map various formats to standard values
  const mappings = {
    'english': 'english',
    'en': 'english',
    'french': 'french',
    'fr': 'french',
    'māori': 'māori',
    'maori': 'māori',
    'mi': 'māori',
    'te-reo-māori': 'māori',
    'te reo māori': 'māori',
    'samoan': 'samoan',
    'sm': 'samoan',
    'tongan': 'tongan',
    'to': 'tongan',
    'fijian': 'fijian',
    'fj': 'fijian',
    'niuean': 'niuean',
    'ni': 'niuean',
    'tuvaluan': 'tuvaluan',
    'tv': 'tuvaluan',
    'tokelauan': 'tokelauan',
    'tkl': 'tokelauan',
    'tahitian': 'tahitian',
    'cook-islands-māori': 'cook-islands-māori',
    'cook islands māori': 'cook-islands-māori',
    'rarotongan': 'cook-islands-māori',
    'chinese': 'chinese',
    'zh': 'chinese',
    'japanese': 'japanese',
    'ja': 'japanese',
    'spanish': 'spanish',
    'es': 'spanish'
  };
  
  return mappings[normalized] || normalized;
};

/**
 * Get display label for cultural identity
 * @param {string} identity - Cultural identity value
 * @returns {string} - Display label
 */
export const getCulturalIdentityLabel = (identity) => {
  if (!identity) return '';
  
  // Map cultural identity codes to display names
  const labels = {
    'samoan': 'Samoan',
    'māori': 'Māori',
    'maori': 'Māori',
    'tongan': 'Tongan',
    'fijian': 'Fijian',
    'niuean': 'Niuean',
    'cook-islands': 'Cook Islands',
    'cook-islands-māori': 'Cook Islands Māori',
    'french-polynesia': 'French Polynesia',
    'tuvaluan': 'Tuvaluan',
    'tokelauan': 'Tokelauan',
    'other-pacific': 'Other Pacific',
    'māori-pacific': 'Māori Pacific',
    'pacific': 'Pacific',
    'tahitian': 'Tahitian',
    'rarotongan': 'Rarotongan'
  };
  
  const normalized = identity.toLowerCase();
  return labels[normalized] || identity;
};

/**
 * Get display label for language
 * @param {string} language - Language code or name
 * @returns {string} - Display label
 */
export const getLanguageLabel = (language) => {
  if (!language) return '';
  
  // Map language codes to display names
  const labels = {
    'en': 'English',
    'english': 'English',
    'fr': 'French',
    'french': 'French',
    'sm': 'Samoan',
    'samoan': 'Samoan',
    'mi': 'Māori',
    'māori': 'Māori',
    'maori': 'Māori',
    'te-reo-māori': 'Māori',
    'to': 'Tongan',
    'tongan': 'Tongan',
    'fj': 'Fijian',
    'fijian': 'Fijian',
    'ni': 'Niuean',
    'niuean': 'Niuean',
    'tv': 'Tuvaluan',
    'tuvaluan': 'Tuvaluan',
    'tkl': 'Tokelauan',
    'tokelauan': 'Tokelauan',
    'tahitian': 'Tahitian',
    'cook-islands-māori': 'Cook Islands Māori',
    'chinese': 'Chinese',
    'zh': 'Chinese',
    'japanese': 'Japanese',
    'ja': 'Japanese',
    'spanish': 'Spanish',
    'es': 'Spanish'
  };
  
  const normalized = language.toLowerCase();
  return labels[normalized] || language;
};
