/**
 * Banner utilities - prioritizes user uploads for business cards
 * Single source of truth for banner selection and display
 * Uses uploaded banners for cards, static banner with text overlay for defaults
 */

import { generateBusinessLogo } from "@/utils/businessImageGenerator.js";

/**
 * Get banner URL for business cards (homepage, featured spotlight)
 * Prioritizes user-uploaded banners over static banner
 * @param {Object} business - Business object containing banner URLs
 * @returns {string} Banner URL (user upload first, then static fallback)
 */
export function getBannerUrl(business) {
  return (
    business?.mobile_banner_url || 
    business?.banner_url || 
    business?.cover_image_url || 
    "/pacific_logo_banner.png" // static fallback for default banner
  );
}

/**
 * Check if business has uploaded banner (not the default)
 * @param {Object} business - Business object
 * @returns {boolean} True if business has uploaded banner
 */
export function hasUploadedBanner(business) {
  return !!(
    business?.mobile_banner_url || 
    business?.banner_url || 
    business?.cover_image_url
  );
}

/**
 * Get hero banner URL - always returns the static Pacific Market banner
 * @param {Object} business - Business object (not used in hero system)
 * @returns {string} Static banner URL
 */
export function getHeroBannerUrl(business) {
  return "/pacific_logo_banner.png";
}

/**
 * Get logo URL with proper hierarchy (uploaded → generated → automatic fallback)
 * For business cards, prioritizes uploaded logo, then generated logo for Vaka/no uploads
 * @param {Object} business - Business object containing logo URL and business name
 * @returns {string} Logo URL (uploaded first, then generated for Vaka/no uploads, then fallback)
 */
export function getLogoUrl(business) {
  // First priority: uploaded logo (for Mana/Moana or any business with custom logo)
  if (business?.logo_url) {
    return business.logo_url;
  }
  
  // Second priority: generated logo with initials (for Vaka plan or no uploads)
  if (business?.business_name) {
    const logoDataUrl = generateBusinessLogo(business.business_name);
    if (logoDataUrl) {
      return logoDataUrl;
    }
  }
  
  // Final fallback: generate logo with default initials "PD"
  const logoDataUrl = generateBusinessLogo("PD");
  return logoDataUrl;
}

/**
 * Get desktop banner URL for business cards (prioritizes uploads)
 * @param {Object} business - Business object containing banner URLs
 * @returns {string} Desktop banner URL (user upload first, then static fallback)
 */
export function getDesktopBannerUrl(business) {
  return (
    business?.banner_url || 
    business?.cover_image_url || 
    "/pacific_logo_banner.png"
  );
}

/**
 * Get mobile banner URL for business cards (prioritizes uploads)
 * @param {Object} business - Business object containing banner URLs
 * @returns {string} Mobile banner URL (user upload first, then static fallback)
 */
export function getMobileBannerUrl(business) {
  return (
    business?.mobile_banner_url || 
    business?.banner_url || 
    business?.cover_image_url || 
    "/pacific_logo_banner.png"
  );
}

/**
 * Check if business has uploaded logo (not generated)
 * @param {Object} business - Business object
 * @returns {boolean} True if business has uploaded logo
 */
export function hasUploadedLogo(business) {
  return !!business?.logo_url;
}

/**
 * Check if business has any uploaded branding (not generated)
 * @param {Object} business - Business object
 * @returns {boolean} True if business has any uploaded branding
 */
export function hasUploadedBranding(business) {
  return hasUploadedLogo(business) || hasUploadedBanner(business);
}

/**
 * Render banner image for business cards with teal background and white text
 * @param {Object} business - Business object
 * @param {Object} props - Additional img props (className, alt, etc.)
 * @returns {JSX.Element} Teal background with business name or uploaded banner
 */
export function renderBanner(business, props = {}) {
  const bannerUrl = getBannerUrl(business);
  const hasCustomBanner = hasUploadedBanner(business);
  
  if (hasCustomBanner) {
    // Show uploaded banner as-is
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
    // Show teal background with centered white business name text
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
