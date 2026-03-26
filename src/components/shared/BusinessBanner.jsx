"use client";

/**
 * Business Banner Component - renders persisted banner media when available,
 * with resilient text fallback for missing/corrupt media.
 */
import { useState } from 'react';
import { isPersistentMediaUrl } from '@/utils/mediaUrlUtils';

export default function BusinessBanner({ business, className = "" }) {
  const [imageError, setImageError] = useState(false);
  
  const hasBanner =
    (isPersistentMediaUrl(business?.banner_url, { allowRootRelative: true }) ||
      isPersistentMediaUrl(business?.mobile_banner_url, { allowRootRelative: true })) &&
    !imageError;
  
  // Responsive banner logic
  const getBannerProps = () => {
    if (!hasBanner) {
      return {
        height: 'h-20 sm:h-24 lg:h-28',
        className: 'bg-[#0d4f4f] flex items-center justify-center'
      };
    }
    
    // For saved banner media, use a more generous aspect ratio to reduce cropping.
    return {
      height: 'h-32 sm:h-40 md:h-48 lg:h-56', // Taller, more flexible height
      className: 'relative bg-gray-100'
    };
  };
  
  const bannerProps = getBannerProps();

  const mobileBanner = isPersistentMediaUrl(business?.mobile_banner_url, {
    allowRootRelative: true,
  })
    ? business.mobile_banner_url
    : null;

  const desktopBanner = isPersistentMediaUrl(business?.banner_url, {
    allowRootRelative: true,
  })
    ? business.banner_url
    : null;

  // Default image src: mobile-first, fallback to desktop if mobile missing
  const defaultImgSrc = mobileBanner || desktopBanner;
  
  return (
    <div className={`relative w-full ${bannerProps.height} ${className}`}>
      {hasBanner ? (
        <>
          <picture>
            {desktopBanner ? <source media="(min-width: 768px)" srcSet={desktopBanner} /> : null}
            <img
              src={defaultImgSrc}
              alt={`${business.business_name} banner`}
              className="h-full w-full object-cover object-center"
              onError={() => setImageError(true)}
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </>
      ) : (
        <div className={`w-full h-full ${bannerProps.className}`}>
          <h1 className="text-base sm:text-lg lg:text-xl font-bold text-white drop-shadow-lg px-4 text-center">
            {business?.business_name || "Business Name"}
          </h1>
        </div>
      )}
    </div>
  );
}
