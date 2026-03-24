import React from 'react';
import { Building2 } from 'lucide-react';
import { hasPremiumFeatures } from '@/lib/business/helpers';
import { isVerifiedBusiness, canAppearOnHomepage } from '@/lib/business/rules';
import { hasLogo, getLogoUrl } from '@/utils/bannerUtils';

/**
 * BusinessAvatar - Standardized business avatar component
 * 
 * Features:
 * - Fallback to building icon if no logo
 * - Verified badge for verified businesses
 * - Homepage visibility indicator
 * - Premium tier styling
 * - Responsive sizes
 */
export function BusinessAvatar({ 
  business, 
  size = 'md', 
  showBadge = true, 
  className = '',
  onClick 
}) {
  if (!business) return null;

  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8', 
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const badgeSizes = {
    xs: 'w-2 h-2 -bottom-0 -right-0',
    sm: 'w-2.5 h-2.5 -bottom-0 -right-0',
    md: 'w-3 h-3 -bottom-1 -right-1',
    lg: 'w-3.5 h-3.5 -bottom-1 -right-1',
    xl: 'w-4 h-4 -bottom-1 -right-1'
  };

  const businessHasLogo = hasLogo(business);
  const isVerified = isVerifiedBusiness(business);
  const isHomepage = canAppearOnHomepage(business);
  const isPremium = hasPremiumFeatures(business);

  const avatarContent = (
    <img
      src={getLogoUrl(business)}
      alt={`${business.business_name} logo`}
      className={`w-full h-full object-cover ${isPremium ? 'ring-2 ring-[#c9a84c]/20' : ''}`}
    />
  );

  const fallbackContent = (
    <div className={`w-full h-full flex items-center justify-center ${
      isPremium ? 'bg-gradient-to-br from-[#c9a84c]/20 to-[#0d4f4f]/20' : 'bg-gray-100'
    } ${!businessHasLogo ? '' : 'hidden'} [&.fallback-active]:flex`}>
      <Building2 className={`w-1/2 h-1/2 ${
        isPremium ? 'text-[#c9a84c]' : 'text-gray-400'
      }`} />
    </div>
  );

  return (
    <div className={`relative inline-flex ${sizes[size]} ${className}`}>
      <div 
        className={`w-full h-full rounded-full overflow-hidden cursor-pointer transition-all duration-200 ${
          isPremium ? 'shadow-[0_0_20px_rgba(201,168,76,0.3)]' : 'shadow-sm'
        } ${onClick ? 'hover:scale-105' : ''}`}
        onClick={onClick}
      >
        {avatarContent}
        {fallbackContent}
      </div>

      {/* Status Badges */}
      {showBadge && (isVerified || isHomepage) && (
        <div className={`absolute ${badgeSizes[size]} flex gap-1`}>
          {isVerified && (
            <div 
              className="w-full h-full rounded-full bg-green-500 border-2 border-white shadow-sm"
              title="Verified Business"
            />
          )}
          {isHomepage && (
            <div 
              className="w-full h-full rounded-full bg-[#00c4cc] border-2 border-white shadow-sm"
              title="Homepage Visibility"
            />
          )}
        </div>
      )}
    </div>
  );
}

export default BusinessAvatar;
