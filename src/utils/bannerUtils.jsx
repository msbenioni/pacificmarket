/**
 * Banner utilities for persistent business media.
 * Primary source of truth is saved business media URLs from storage.
 * Static/text rendering remains as resilience fallback for missing/corrupt legacy data.
 */

import { isPersistentMediaUrl } from "@/utils/mediaUrlUtils";
import { generateBusinessLogo } from "@/utils/businessImageGenerator";

const getFirstDisplayableMediaUrl = (...candidates) => {
  for (const candidate of candidates) {
    if (isPersistentMediaUrl(candidate, { allowRootRelative: true })) {
      return candidate;
    }
  }
  return "";
};

/**
 * Get banner URL for business cards (homepage, featured spotlight)
 * Prioritizes saved/persisted business media over static fallback.
 * @param {Object} business - Business object containing banner URLs
 * @returns {string} Banner URL (persisted URL first, then static fallback)
 */
export function getBannerUrl(business) {
  return getFirstDisplayableMediaUrl(
    business?.mobile_banner_url,
    business?.banner_url,
    business?.cover_image_url
  );
}

/**
 * Check if business has persisted banner media.
 * @param {Object} business - Business object
 * @returns {boolean} True if business has saved banner media
 */
export function hasPersistedBanner(business) {
  return !!(
    isPersistentMediaUrl(business?.mobile_banner_url, { allowRootRelative: false }) ||
    isPersistentMediaUrl(business?.banner_url, { allowRootRelative: false }) ||
    isPersistentMediaUrl(business?.cover_image_url, { allowRootRelative: false })
  );
}

/**
 * Get hero banner URL - always returns the static Pacific Market banner
 * @param {Object} business - Business object (not used in hero system)
 * @returns {string} Static banner URL
 */
export function getHeroBannerUrl(business) {
  return null; // No static fallback - should use generated banner or text fallback
}

/**
 * Get logo URL with proper hierarchy (saved business logo → generated logo → fallback)
 * @param {Object} business - Business object containing logo URL and business name
 * @returns {string} Logo URL (saved URL first, then generated, then static fallback)
 */
export function getLogoUrl(business) {
  // First priority: saved/persisted logo URL.
  if (isPersistentMediaUrl(business?.logo_url, { allowRootRelative: true })) {
    return business.logo_url;
  }

  // Second priority: generated logo from business name
  if (business?.business_name) {
    const generatedLogo = generateBusinessLogo(business.business_name);
    if (generatedLogo) {
      return generatedLogo;
    }
  }

  // No static fallback - return null for text fallback
  return null;
}

/**
 * Get desktop banner URL for business cards (persisted-first)
 * @param {Object} business - Business object containing banner URLs
 * @returns {string} Desktop banner URL (saved URL first, then static fallback)
 */
export function getDesktopBannerUrl(business) {
  return getFirstDisplayableMediaUrl(business?.banner_url, business?.cover_image_url);
}

/**
 * Get mobile banner URL for business cards (persisted-first)
 * @param {Object} business - Business object containing banner URLs
 * @returns {string} Mobile banner URL (saved URL first, then static fallback)
 */
export function getMobileBannerUrl(business) {
  return getFirstDisplayableMediaUrl(
    business?.mobile_banner_url,
    business?.banner_url,
    business?.cover_image_url
  );
}

/**
 * Check if business has a persisted logo URL.
 * @param {Object} business - Business object
 * @returns {boolean} True if business has saved logo media
 */
export function hasPersistedLogo(business) {
  return isPersistentMediaUrl(business?.logo_url, { allowRootRelative: false });
}

/**
 * Check if business has any persisted branding media.
 * @param {Object} business - Business object
 * @returns {boolean} True if business has any saved branding media
 */
export function hasPersistedBranding(business) {
  return hasPersistedLogo(business) || hasPersistedBanner(business);
}

/**
 * Render banner media for cards.
 * Uses persisted banner media when available, otherwise resilience fallback.
 * @param {Object} business - Business object
 * @param {Object} props - Additional img props (className, alt, etc.)
 * @returns {JSX.Element} Banner image or fallback banner block
 */
export function renderBanner(business, props = {}) {
  const bannerUrl = getBannerUrl(business);
  const hasCustomBanner = hasPersistedBanner(business);
  
  if (hasCustomBanner) {
    // Primary path: show persisted media from storage.
    return (
      <img
        src={bannerUrl}
        alt={props.alt || "Business banner"}
        className={props.className || ""}
        style={props.style || {}}
        loading={props.loading || "lazy"}
      />
    );
  } else {
    // Resilience fallback for missing/corrupt legacy media.
    return (
      <div className={`relative ${props.className || ""}`} style={props.style || {}}>
        <div className="w-full h-full bg-[#0d4f4f] flex items-center justify-center">
          <h3 className="text-white font-bold text-center px-4 drop-shadow-lg" 
              style={{ fontSize: props.className?.includes('sm:') ? '1.25rem' : '0.875rem', lineHeight: '1.2' }}>
            {business?.business_name || "Business Name"}
          </h3>
        </div>
      </div>
    );
  }
}
