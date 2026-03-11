/**
 * Business Rules and Visibility Logic
 * 
 * Centralized business logic for:
 * - Public visibility determination
 * - Homepage eligibility
 * - Premium tool access
 * - Verified display logic
 */

import { Business } from '../../types/business';
import { SUBSCRIPTION_TIER, BUSINESS_STATUS } from '../../constants/unifiedConstants';

/**
 * Check if a business should be publicly visible
 */
export function isPublicBusiness(business: Business | null): boolean {
  if (!business) return false;
  
  return business.status === BUSINESS_STATUS.ACTIVE;
}

/**
 * Check if a business can appear on the homepage
 */
export function canAppearOnHomepage(business: Business | null): boolean {
  if (!business) return false;
  
  return (
    business.status === BUSINESS_STATUS.ACTIVE &&
    business.visibility_tier === 'homepage'
  );
}

/**
 * Check if a business can use premium tools
 */
export function canUsePremiumTools(business: Business | null): boolean {
  if (!business) return false;
  
  return business.subscription_tier === SUBSCRIPTION_TIER.MOANA || 
         business.subscription_tier === SUBSCRIPTION_TIER.MANA;
}

/**
 * Get business visibility tier
 */
export function getBusinessVisibilityTier(business: Business | null): string {
  if (!business) return 'none';
  return business.visibility_tier || 'none';
}

/**
 * Check if business is verified
 */
export function isVerifiedBusiness(business: Business | null): boolean {
  if (!business) return false;
  return Boolean(business.verified);
}

/**
 * Check if business is claimed by its owner
 */
export function isClaimedBusiness(business: Business | null): boolean {
  if (!business) return false;
  return Boolean(business.claimed);
}

/**
 * Get business status for display
 */
export function getBusinessStatus(business: Business | null): string {
  if (!business) return 'unknown';
  return business.status || 'unknown';
}

/**
 * Check if business profile is complete
 */
export function isBusinessProfileComplete(business: Business | null): boolean {
  if (!business) return false;
  
  return !!(
    business.name &&
    business.description &&
    business.industry &&
    business.contact_email &&
    getBusinessWebsite(business)
  );
}

/**
 * Get business completion percentage
 */
export function getBusinessCompletionPercentage(business: Business | null): number {
  if (!business) return 0;
  
  const requiredFields = [
    'name',
    'description', 
    'industry',
    'contact_email',
    'contact_website'
  ];
  
  const completedFields = requiredFields.filter(field => {
    const value = business[field as keyof Business];
    return value && value.toString().trim() !== '';
  });
  
  return Math.round((completedFields.length / requiredFields.length) * 100);
}

/**
 * Check if business can be edited by user
 */
export function canEditBusiness(business: Business | null, userId: string | null): boolean {
  if (!business || !userId) return false;
  
  return business.owner_user_id === userId;
}

/**
 * Get business tier display name
 */
export function getBusinessTierDisplay(business: Business | null): string {
  if (!business) return 'Unknown';
  
  switch (business.subscription_tier) {
    case SUBSCRIPTION_TIER.VAKA:
      return 'Vaka (Free)';
    case SUBSCRIPTION_TIER.MANA:
      return 'Mana (Premium)';
    case SUBSCRIPTION_TIER.MOANA:
      return 'Moana (Enterprise)';
    default:
      return 'Unknown';
  }
}

/**
 * Check if business has premium features
 */
export function hasPremiumFeatures(business: Business | null): boolean {
  return canUsePremiumTools(business);
}

/**
 * Get business website URL (standardized field access)
 */
export function getBusinessWebsite(business: Business | null): string | null {
  return business?.contact_website || null;
}

/**
 * Get business tier
 */
export function getBusinessTier(business: Business | null): string {
  return business?.subscription_tier ?? 'vaka';
}

/**
 * Filter businesses by visibility rules
 */
export function filterBusinessesByVisibility(
  businesses: Business[], 
  visibility: 'public' | 'homepage' | 'all' = 'public'
): Business[] {
  switch (visibility) {
    case 'public':
      return businesses.filter(isPublicBusiness);
    case 'homepage':
      return businesses.filter(canAppearOnHomepage);
    case 'all':
      return businesses;
    default:
      return businesses.filter(isPublicBusiness);
  }
}

/**
 * Sort businesses by priority (homepage first, then premium, then basic)
 */
export function sortBusinessesByPriority(businesses: Business[]): Business[] {
  return [...businesses].sort((a, b) => {
    // Homepage businesses first
    const aHomepage = canAppearOnHomepage(a);
    const bHomepage = canAppearOnHomepage(b);
    if (aHomepage !== bHomepage) return bHomepage ? 1 : -1;
    
    // Premium businesses next
    const aPremium = canUsePremiumTools(a);
    const bPremium = canUsePremiumTools(b);
    if (aPremium !== bPremium) return bPremium ? 1 : -1;
    
    // Then verified businesses
    const aVerified = isVerifiedBusiness(a);
    const bVerified = isVerifiedBusiness(b);
    if (aVerified !== bVerified) return bVerified ? 1 : -1;
    
    // Finally by name
    return a.name.localeCompare(b.name);
  });
}
