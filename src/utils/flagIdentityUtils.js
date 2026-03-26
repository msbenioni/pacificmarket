/**
 * Flag utilities - Clean implementation
 * Single source of truth for cultural identity and flag rendering
 */

import { DISPLAY_TO_FLAG_COUNTRY, COUNTRY_FLAG_CODES } from "@/constants/unifiedConstants";
import { resolveCanonicalLabel, parseIdentities, dedupe } from "@/utils/parsingUtils";

/**
 * Get canonical display label for an identity
 */
export function getDisplayLabel(identity) {
  return resolveCanonicalLabel(identity);
}

/**
 * Get flag country for a display identity
 */
export function getFlagCountry(identity) {
  const label = getDisplayLabel(identity);
  return DISPLAY_TO_FLAG_COUNTRY[label] || label || null;
}

/**
 * Get ISO flag code for an identity
 */
export function getFlagCode(identity) {
  const country = getFlagCountry(identity);
  return country ? COUNTRY_FLAG_CODES[country] || null : null;
}

/**
 * Get flag asset URL (SVG for better scaling)
 */
export function getFlagAssetUrl(code) {
  if (!code) return null;
  return `https://flagcdn.com/${code.toLowerCase()}.svg`;
}

/**
 * Get parsed flag items for rendering
 */
export function getFlagItems(input, options = {}) {
  const { maxItems = null } = options;

  try {
    const identities = dedupe(parseIdentities(input)).filter(Boolean);

    let flagItems = identities
      .map((identity) => {
        const displayLabel = getDisplayLabel(identity);
        const flagCountry = getFlagCountry(identity);
        const flagCode = getFlagCode(identity);

        return {
          identity,
          displayLabel,
          flagCountry,
          flagCode,
        };
      })
      .filter((item) => item && item.displayLabel);

    if (maxItems && maxItems > 0) {
      flagItems = flagItems.slice(0, maxItems);
    }

    return flagItems;
  } catch (error) {
    console.error("[flagIdentityUtils] getFlagItems failed", { input, error });
    return [];
  }
}

/**
 * Get flag items with overflow information
 */
export function getFlagItemsWithOverflow(input, options = {}) {
  const { maxItems = 3 } = options;
  
  const allItems = getFlagItems(input);
  const items = allItems.slice(0, maxItems);
  const overflow = Math.max(0, allItems.length - maxItems);
  
  return { items, overflow };
}
