/**
 * Visibility tier constants matching database constraint
 * 
 * Database constraint: CHECK ((visibility_tier = ANY (ARRAY['none'::text, 'homepage'::text, 'spotlight'::text])))
 */
export const VISIBILITY_TIER = {
  NONE: "none",
  HOMEPAGE: "homepage", 
  SPOTLIGHT: "spotlight",
};

/**
 * Visibility mode constants
 */
export const VISIBILITY_MODE = {
  AUTO: "auto",
  MANUAL: "manual",
};

/**
 * Default visibility for new businesses
 */
export const DEFAULT_VISIBILITY = {
  tier: VISIBILITY_TIER.NONE,
  mode: VISIBILITY_MODE.AUTO,
};
