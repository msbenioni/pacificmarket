import React from 'react';
import { Shield, Star, CheckCircle, Home, Crown } from 'lucide-react';
import { getBusinessTier, hasPremiumFeatures } from '@/lib/business/helpers';
import { isVerifiedBusiness, canAppearOnHomepage, getBusinessVisibilityTier } from '@/lib/business/rules';

/**
 * BusinessBadgeGroup - Standardized business status badges
 * 
 * Features:
 * - Verified badge
 * - Homepage featured badge
 * - Premium tier badges
 * - Visibility tier indicators
 * - Responsive sizing
 * - Customizable badge selection
 */
export function BusinessBadgeGroup({ 
  business, 
  size = 'sm', 
  variant = 'all', // 'all', 'status', 'tier', 'visibility'
  className = '',
  showLabels = false 
}) {
  if (!business) return null;

  const sizes = {
    xs: 'text-xs px-2 py-1 gap-1',
    sm: 'text-sm px-2.5 py-1.5 gap-1.5', 
    md: 'text-base px-3 py-2 gap-2',
    lg: 'text-lg px-3.5 py-2.5 gap-2.5'
  };

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4', 
    lg: 'w-4.5 h-4.5'
  };

  const isVerified = isVerifiedBusiness(business);
  const isHomepage = canAppearOnHomepage(business);
  const isPremium = hasPremiumFeatures(business);
  const tier = getBusinessTier(business);
  const visibilityTier = getBusinessVisibilityTier(business);

  const badges = [];

  // Status Badges
  if (variant === 'all' || variant === 'status') {
    if (isVerified) {
      badges.push({
        id: 'verified',
        icon: CheckCircle,
        label: 'Verified',
        color: 'bg-green-100 text-green-700 border-green-200',
        iconColor: 'text-green-600'
      });
    }

    if (isHomepage) {
      badges.push({
        id: 'homepage',
        icon: Home,
        label: 'Homepage',
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        iconColor: 'text-blue-600'
      });
    }
  }

  // Tier Badges
  if (variant === 'all' || variant === 'tier') {
    if (tier === 'moana') {
      badges.push({
        id: 'moana',
        icon: Crown,
        label: 'Moana',
        color: 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border-amber-200',
        iconColor: 'text-amber-600'
      });
    } else if (tier === 'mana') {
      badges.push({
        id: 'mana',
        icon: Shield,
        label: 'Mana',
        color: 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 border-purple-200',
        iconColor: 'text-purple-600'
      });
    }
  }

  // Visibility Badges
  if (variant === 'all' || variant === 'visibility') {
    if (visibilityTier === 'homepage') {
      badges.push({
        id: 'visibility-homepage',
        icon: Star,
        label: 'Featured',
        color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        iconColor: 'text-yellow-600'
      });
    } else if (visibilityTier === 'premium') {
      badges.push({
        id: 'visibility-premium',
        icon: Star,
        label: 'Premium',
        color: 'bg-purple-100 text-purple-700 border-purple-200',
        iconColor: 'text-purple-600'
      });
    }
  }

  if (badges.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center ${sizes[size]} ${className}`}>
      {badges.map((badge) => (
        <div
          key={badge.id}
          className={`inline-flex items-center rounded-full border ${badge.color} font-medium transition-all duration-200 hover:shadow-sm`}
          title={`${badge.label} Business`}
        >
          <badge.icon className={`${iconSizes[size]} ${badge.iconColor}`} />
          {showLabels && (
            <span className="ml-1">{badge.label}</span>
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * Individual badge components for specific use cases
 */
export function VerifiedBadge({ size = 'sm', className = '' }) {
  const sizes = {
    xs: 'text-xs px-2 py-1',
    sm: 'text-sm px-2.5 py-1.5', 
    md: 'text-base px-3 py-2'
  };

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4'
  };

  return (
    <div className={`inline-flex items-center rounded-full border bg-green-100 text-green-700 border-green-200 font-medium ${sizes[size]} ${className}`}>
      <CheckCircle className={`${iconSizes[size]} text-green-600 mr-1`} />
      Verified
    </div>
  );
}

export function PremiumBadge({ tier = 'mana', size = 'sm', className = '' }) {
  const sizes = {
    xs: 'text-xs px-2 py-1',
    sm: 'text-sm px-2.5 py-1.5', 
    md: 'text-base px-3 py-2'
  };

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4'
  };

  const tierConfig = {
    mana: {
      icon: Shield,
      label: 'Mana',
      color: 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 border-purple-200',
      iconColor: 'text-purple-600'
    },
    moana: {
      icon: Crown,
      label: 'Moana', 
      color: 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border-amber-200',
      iconColor: 'text-amber-600'
    }
  };

  const config = tierConfig[tier] || tierConfig.mana;
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center rounded-full border ${config.color} font-medium ${sizes[size]} ${className}`}>
      <Icon className={`${iconSizes[size]} ${config.iconColor} mr-1`} />
      {config.label}
    </div>
  );
}

export function HomepageBadge({ size = 'sm', className = '' }) {
  const sizes = {
    xs: 'text-xs px-2 py-1',
    sm: 'text-sm px-2.5 py-1.5', 
    md: 'text-base px-3 py-2'
  };

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4'
  };

  return (
    <div className={`inline-flex items-center rounded-full border bg-blue-100 text-blue-700 border-blue-200 font-medium ${sizes[size]} ${className}`}>
      <Home className={`${iconSizes[size]} text-blue-600 mr-1`} />
      Homepage
    </div>
  );
}

export default BusinessBadgeGroup;
