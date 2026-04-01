/**
 * Production-matching banner preview components
 * These mimic the exact rendering behavior of real banner components
 */

import { isPersistentMediaUrl } from "@/utils/mediaUrlUtils";

/**
 * Desktop Banner Preview - matches BusinessBanner desktop rendering
 */
export function DesktopBannerPreview({ 
  bannerUrl, 
  businessName = "Business Name",
  className = "" 
}) {
  // Debug logging to see what URL we're getting
  console.log("🖼️ DesktopBannerPreview:", { bannerUrl, businessName });
  
  // Show uploaded banner if exists, otherwise show fallback
  const hasBanner = isPersistentMediaUrl(bannerUrl, { allowRootRelative: false });

  return (
    <div className={`relative w-full max-w-[400px] h-[100px] bg-gray-100 ${className}`} style={{ aspectRatio: '4/1' }}>
      {hasBanner ? (
        <>
          <img
            src={bannerUrl}
            alt={`${businessName} desktop banner`}
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </>
      ) : (
        <div className="w-full h-full bg-[#0d4f4f] flex items-center justify-center">
          <h1 className="text-sm font-bold text-white drop-shadow-lg px-2 text-center">
            {businessName}
          </h1>
        </div>
      )}
    </div>
  );
}

/**
 * Mobile Banner Preview - matches FeaturedSpotlight mobile banner rendering
 */
export function MobileBannerPreview({ 
  bannerUrl, 
  mobileBannerUrl, 
  businessName = "Business Name",
  className = "" 
}) {
  // Debug logging to see what URLs we're getting
  console.log("📱 MobileBannerPreview:", { bannerUrl, mobileBannerUrl, businessName });
  
  // Show uploaded mobile banner if exists, otherwise show fallback
  const displayUrl = isPersistentMediaUrl(mobileBannerUrl, { allowRootRelative: false })
    ? mobileBannerUrl
    : null;

  return (
    <div className={`relative w-full max-w-[800px] h-[160px] overflow-hidden rounded-t-[24px] bg-[#0d4f4f] flex-shrink-0 ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-[#0d4f4f] to-[#1a6b6b]" />
      {displayUrl && (
        <img
          src={displayUrl}
          alt={`${businessName} mobile banner`}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
    </div>
  );
}
