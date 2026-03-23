/**
 * Business Banner Component - Handles responsive banner display with proper aspect ratios
 */
import { useState } from 'react';

export default function BusinessBanner({ business, className = "" }) {
  const [imageError, setImageError] = useState(false);
  
  const hasBanner = (business?.banner_url || business?.mobile_banner_url) && !imageError;
  
  // Responsive banner logic
  const getBannerProps = () => {
    if (!hasBanner) {
      return {
        height: 'h-20 sm:h-24 lg:h-28',
        className: 'bg-[#0d4f4f] flex items-center justify-center'
      };
    }
    
    // For uploaded banners, use a more generous aspect ratio to reduce cropping
    return {
      height: 'h-32 sm:h-40 md:h-48 lg:h-56', // Taller, more flexible height
      className: 'relative bg-gray-100'
    };
  };
  
  const bannerProps = getBannerProps();
  
  // Determine which banner to use based on screen size
  const getBannerUrl = () => {
    if (!hasBanner) return null;
    
    // On mobile, prefer mobile banner if available
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return business.mobile_banner_url || business.banner_url;
    }
    
    // On desktop, prefer desktop banner
    return business.banner_url || business.mobile_banner_url;
  };
  
  return (
    <div className={`relative w-full ${bannerProps.height} ${className}`}>
      {hasBanner ? (
        <>
          <img
            src={getBannerUrl()}
            alt={`${business.business_name} banner`}
            className="h-full w-full object-cover object-center"
            onError={() => setImageError(true)}
          />
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
