/**
 * Unified Parsing Utilities
 * Single source of truth for all cultural identity and language parsing logic
 * Used across FlagIcon, FeaturedSpotlight, RegistryFilters, and businessCulturalHelpers
 */

import { COUNTRIES, CULTURAL_IDENTITIES } from '@/constants/unifiedConstants';

const ALL_VALID_LABELS = [
  ...CULTURAL_IDENTITIES,
  ...COUNTRIES.map((c) => c.label),
];

/**
 * Clean and normalize token by removing braces and quotes
 */
export function cleanToken(value) {
  return String(value ?? "")
    .trim()
    .replace(/^\{+|\}+$/g, "")
    .replace(/^"(.*)"$/, "$1")
    .trim();
}

/**
 * Resolve canonical label for a token using exact or case-insensitive match
 */
export function resolveCanonicalLabel(value) {
  const cleaned = cleanToken(value);
  if (!cleaned) return "";

  const exactMatch = ALL_VALID_LABELS.find((item) => item === cleaned);
  if (exactMatch) return exactMatch;

  const caseInsensitiveMatch = ALL_VALID_LABELS.find(
    (item) => item.toLowerCase() === cleaned.toLowerCase()
  );
  if (caseInsensitiveMatch) return caseInsensitiveMatch;

  return cleaned;
}

/**
 * Parse cultural identity or language strings in various formats
 * Handles: arrays, JSON arrays, curly braces, comma-separated, single values
 */
export function parseIdentities(identity) {
  if (!identity) return [];

  if (Array.isArray(identity)) {
    return identity.map(resolveCanonicalLabel).filter(Boolean);
  }

  const raw = String(identity).trim();
  if (!raw) return [];

  if (raw.startsWith("[") && raw.endsWith("]")) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map(resolveCanonicalLabel).filter(Boolean);
      }
    } catch {}
  }

  if (raw.startsWith("{") && raw.endsWith("}")) {
    return raw
      .slice(1, -1)
      .split(",")
      .map(resolveCanonicalLabel)
      .filter(Boolean);
  }

  if (raw.includes(",")) {
    return raw.split(",").map(resolveCanonicalLabel).filter(Boolean);
  }

  return [resolveCanonicalLabel(raw)];
}

/**
 * Remove duplicate values (case-insensitive)
 */
export function dedupe(values) {
  const seen = new Set();
  return values.filter((value) => {
    const key = value.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
