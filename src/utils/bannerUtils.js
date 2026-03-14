/**
 * Banner utilities - shared logic for banner selection and display
 * Single source of truth for banner hierarchy across all components
 * Automatic fallbacks: logos → /pm_logo.png, banners → /pm_logo_longbanner.png
 */

/**
 * Get banner URL with proper hierarchy (mobile first, then desktop fallback, then automatic fallback)
 * @param {Object} business - Business object containing banner URLs
 * @returns {string} Banner URL (never null - always has fallback)
 */
export function getBannerUrl(business) {
  return business?.mobile_banner_url || business?.banner_url || business?.cover_image_url || "/pm_logo_longbanner.png";
}

/**
 * Get logo URL with automatic fallback
 * @param {Object} business - Business object containing logo URL
 * @returns {string} Logo URL (never null - always has fallback)
 */
export function getLogoUrl(business) {
  return business?.logo_url || "/pm_logo.png";
}

/**
 * Check if business has any banner available
 * @param {Object} business - Business object
 * @returns {boolean} True if business has any banner
 */
export function hasBanner(business) {
  return !!(business?.mobile_banner_url || business?.banner_url || business?.cover_image_url);
}

/**
 * Check if business has mobile banner specifically
 * @param {Object} business - Business object
 * @returns {boolean} True if business has mobile banner
 */
export function hasMobileBanner(business) {
  return !!business?.mobile_banner_url;
}

/**
 * Check if business has desktop banner specifically
 * @param {Object} business - Business object
 * @returns {boolean} True if business has desktop banner
 */
export function hasDesktopBanner(business) {
  return !!business?.banner_url || !!business?.cover_image_url;
}

/**
 * Check if business has logo
 * @param {Object} business - Business object
 * @returns {boolean} True if business has logo
 */
export function hasLogo(business) {
  return !!business?.logo_url;
}

/**
 * Get banner type for display purposes
 * @param {Object} business - Business object
 * @returns {string} 'mobile', 'desktop', or 'none'
 */
export function getBannerType(business) {
  if (business?.mobile_banner_url) return 'mobile';
  if (business?.banner_url || business?.cover_image_url) return 'desktop';
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
 * Render logo image with automatic fallback
 * @param {Object} business - Business object
 * @param {Object} props - Additional img props (className, alt, etc.)
 * @returns {JSX.Element} Image element with automatic fallback
 */
export function renderLogo(business, props = {}) {
  const logoUrl = getLogoUrl(business);
  
  return (
    <img
      src={logoUrl}
      alt={props.alt || "Business logo"}
      className={props.className || ""}
      style={props.style || {}}
      loading={props.loading || "lazy"}
      onError={props.onError}
    />
  );
}
