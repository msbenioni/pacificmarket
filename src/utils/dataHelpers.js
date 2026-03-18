/**
 * Helper functions for data transformation and validation
 */

/**
 * Safely handle languages_spoken data - ensures it's always an array
 * @param {string|Array} languagesSpoken - Languages data from database
 * @returns {Array} - Always returns an array of languages
 */
export function safeLanguagesSpoken(languagesSpoken) {
  if (Array.isArray(languagesSpoken)) {
    return languagesSpoken;
  }
  
  if (typeof languagesSpoken === 'string') {
    return languagesSpoken.split(',').map(lang => lang.trim()).filter(Boolean);
  }
  
  return [];
}

/**
 * Format languages for display with truncation
 * @param {Array} languages - Array of language strings
 * @param {number} maxDisplay - Maximum languages to display before showing "+X more"
 * @returns {string} - Formatted string for display
 */
export function formatLanguagesDisplay(languages, maxDisplay = 2) {
  if (!Array.isArray(languages) || languages.length === 0) {
    return '';
  }
  
  const displayLanguages = languages.slice(0, maxDisplay);
  const result = displayLanguages.join(', ');
  
  if (languages.length > maxDisplay) {
    return `${result} +${languages.length - maxDisplay}`;
  }
  
  return result;
}
