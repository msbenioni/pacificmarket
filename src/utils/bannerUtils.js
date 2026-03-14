/**
 * Banner utilities - shared logic for banner selection and display
 * Single source of truth for banner hierarchy across all components
 */

/**
 * Get banner URL with proper hierarchy (mobile first, then desktop fallback)
 * @param {Object} business - Business object containing banner URLs
 * @returns {string|null} Banner URL or null if no banner available
 */
export function getBannerUrl(business) {
  return business?.mobile_banner_url || business?.banner_url || business?.cover_image_url || null;
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
 * Render banner image with proper hierarchy
 * @param {Object} business - Business object
 * @param {Object} props - Additional img props (className, alt, etc.)
 * @returns {JSX.Element|null} Image element or null
 */
export function renderBanner(business, props = {}) {
  const bannerUrl = getBannerUrl(business);
  
  if (!bannerUrl) return null;
  
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
