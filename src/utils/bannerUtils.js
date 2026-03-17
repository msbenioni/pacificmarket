/**
 * Banner utilities - shared logic for banner selection and display
 * Single source of truth for banner hierarchy across all components
 * Automatic fallbacks: uploaded → generated → default placeholders
 */

/**
 * Get banner URL with proper hierarchy (mobile first, then desktop fallback, then generated fallbacks, then automatic fallback)
 * @param {Object} business - Business object containing banner URLs
 * @returns {string} Banner URL (never null - always has fallback)
 */
export function getBannerUrl(business) {
  return (
    business?.mobile_banner_url || 
    business?.banner_url || 
    business?.cover_image_url || 
    business?.generated_mobile_banner_url ||
    business?.generated_banner_url ||
    "/pm_logo_longbanner.png"
  );
}

/**
 * Get logo URL with proper hierarchy (uploaded → generated → automatic fallback)
 * @param {Object} business - Business object containing logo URL
 * @returns {string} Logo URL (never null - always has fallback)
 */
export function getLogoUrl(business) {
  return business?.logo_url || business?.generated_logo_url || "/pm_logo.png";
}

/**
 * Get desktop banner URL with proper hierarchy (uploaded → generated → automatic fallback)
 * @param {Object} business - Business object containing banner URLs
 * @returns {string} Desktop banner URL (never null - always has fallback)
 */
export function getDesktopBannerUrl(business) {
  return (
    business?.banner_url || 
    business?.cover_image_url || 
    business?.generated_banner_url ||
    "/pm_logo_longbanner.png"
  );
}

/**
 * Get mobile banner URL with proper hierarchy (uploaded → generated → automatic fallback)
 * @param {Object} business - Business object containing banner URLs
 * @returns {string} Mobile banner URL (never null - always has fallback)
 */
export function getMobileBannerUrl(business) {
  return (
    business?.mobile_banner_url || 
    business?.generated_mobile_banner_url ||
    "/pm_logo_longbanner.png"
  );
}

/**
 * Check if business has any banner available (uploaded or generated)
 * @param {Object} business - Business object
 * @returns {boolean} True if business has any banner
 */
export function hasBanner(business) {
  return !!(
    business?.mobile_banner_url || 
    business?.banner_url || 
    business?.cover_image_url ||
    business?.generated_mobile_banner_url ||
    business?.generated_banner_url
  );
}

/**
 * Check if business has mobile banner specifically (uploaded or generated)
 * @param {Object} business - Business object
 * @returns {boolean} True if business has mobile banner
 */
export function hasMobileBanner(business) {
  return !!(business?.mobile_banner_url || business?.generated_mobile_banner_url);
}

/**
 * Check if business has desktop banner specifically (uploaded or generated)
 * @param {Object} business - Business object
 * @returns {boolean} True if business has desktop banner
 */
export function hasDesktopBanner(business) {
  return !!(
    business?.banner_url || 
    business?.cover_image_url || 
    business?.generated_banner_url
  );
}

/**
 * Check if business has logo (uploaded or generated)
 * @param {Object} business - Business object
 * @returns {boolean} True if business has logo
 */
export function hasLogo(business) {
  return !!(business?.logo_url || business?.generated_logo_url);
}

/**
 * Get banner type for display purposes (checks uploaded first, then generated)
 * @param {Object} business - Business object
 * @returns {string} 'mobile', 'desktop', or 'none'
 */
export function getBannerType(business) {
  if (business?.mobile_banner_url || business?.generated_mobile_banner_url) return 'mobile';
  if (business?.banner_url || business?.cover_image_url || business?.generated_banner_url) return 'desktop';
  return 'none';
}

/**
 * Render banner image with proper hierarchy and automatic fallback
 * @param {Object} business - Business object
 * @param {Object} props - Additional img props (className, alt, etc.)
 * @returns {JSX.Element} Image element with automatic fallback
 */
export function renderBanner(business, props = {}) {
  const bannerUrl = getBannerUrl(business);
  
  return (
    <img
      src={bannerUrl}
      alt={props.alt || "Business banner"}
      className={props.className || ""}
      style={props.style || {}}
      loading={props.loading || "lazy"}
    />
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
 * Check if business has uploaded banner (not generated)
 * @param {Object} business - Business object
 * @returns {boolean} True if business has any uploaded banner
 */
export function hasUploadedBanner(business) {
  return !!(
    business?.mobile_banner_url || 
    business?.banner_url || 
    business?.cover_image_url
  );
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
 * Check if business is using generated fallback branding
 * @param {Object} business - Business object
 * @returns {boolean} True if business is using generated branding
 */
export function isUsingGeneratedBranding(business) {
  return (
    !hasUploadedLogo(business) && !!business?.generated_logo_url ||
    !hasUploadedBanner(business) && !!(
      business?.generated_logo_url ||
      business?.generated_banner_url ||
      business?.generated_mobile_banner_url
    )
  );
}
