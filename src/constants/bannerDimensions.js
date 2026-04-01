/**
 * Banner Dimensions Configuration - Single Source of Truth
 * 
 * These are the canonical stored asset sizes for business banners.
 * Upload guidance should be based on these stored asset sizes,
 * not device screen ratios or preview container dimensions.
 */

export const BANNER_DIMENSIONS = {
  // Canonical stored asset sizes
  DESKTOP: {
    width: 1200,
    height: 300,
    aspectRatio: '1200:300',
    recommendedSize: '1200×300px',
    description: 'Desktop banner for business registry pages'
  },
  
  MOBILE: {
    width: 800,
    height: 160,
    aspectRatio: '800:160',
    recommendedSize: '800×160px',
    description: 'Mobile banner for mobile cards and homepage (optimized for spotlight cards)'
  },
  
  // Preview container information (for reference only)
  PREVIEW_CONTAINERS: {
    desktop: {
      height: 'h-32 sm:h-40 md:h-48 lg:h-56', // Responsive heights in preview
      aspectRatio: 'variable', // Width varies, height fixed
      note: 'Preview shows how banner will be displayed and cropped on site'
    },
    mobile: {
      height: 'h-[160px]', // Fixed height matching new mobile banner dimensions
      width: 'max-w-[800px]', // Max width matching new mobile banner
      aspectRatio: 'variable', // Width varies up to max, height fixed
      note: 'Preview shows how banner will be displayed and cropped on site'
    },
    spotlight: {
      height: 'h-[160px]', // Spotlight panel height matching mobile banner aspect ratio
      aspectRatio: 'variable', // Width varies, height fixed
      description: 'Homepage featured spotlight panel'
    }
  }
};

// Helper function to get consistent help text
export const getBannerHelpText = (type) => {
  const dimensions = type === 'desktop' ? BANNER_DIMENSIONS.DESKTOP : BANNER_DIMENSIONS.MOBILE;
  return `${dimensions.recommendedSize} recommended.`;
};

// Helper function to get consistent guide text
export const getBannerGuideText = (type) => {
  const dimensions = type === 'desktop' ? BANNER_DIMENSIONS.DESKTOP : BANNER_DIMENSIONS.MOBILE;
  return `${dimensions.description}: ${dimensions.recommendedSize}`;
};
