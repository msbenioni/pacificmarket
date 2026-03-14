/**
 * Shared business logic helpers
 * Centralized functions for common business operations and formatting
 */

import type { Business } from '../../types/business';
import { getTierDisplayName, getCountryDisplayName, getIndustryDisplayName } from '../../constants/unifiedConstants';

// === Core Field Accessors ===

/**
 * Get business subscription tier with fallback
 */
export function getBusinessTier(business: Business | null): string {
  return business?.subscription_tier ?? 'vaka';
}

/**
 * Get business website URL (standardized field name)
 */
export function getBusinessWebsite(business: Business | null): string | null {
  return business?.contact_website ?? null;
}

/**
 * Check if business is verified
 */
export function isVerifiedBusiness(business: Business | null): boolean {
  return Boolean(business?.is_verified);
}

/**
 * Check if business should appear on homepage
 */
export function isHomepageBusiness(business: Business | null): boolean {
  return business?.visibility_tier === 'homepage';
}

/**
 * Get business initial for avatar fallback
 */
export function getBusinessInitial(business: Business | null): string {
  return business?.name?.trim()?.charAt(0)?.toUpperCase() ?? '?';
}

/**
 * Get business logo URL
 */
export function getBusinessLogoUrl(business: Business | null): string | null {
  return business?.logo_url ?? null;
}

/**
 * Get business banner URL
 */
export function getBusinessBannerUrl(business: Business | null): string | null {
  return business?.mobile_banner_url ?? business?.banner_url ?? null;
}

/**
 * Get business contact email
 */
export function getBusinessEmail(business: Business | null): string | null {
  return business?.contact_email ?? null;
}

/**
 * Get business contact phone
 */
export function getBusinessPhone(business: Business | null): string | null {
  return business?.contact_phone ?? null;
}

/**
 * Get business display name (with fallback)
 */
export function getBusinessDisplayName(business: Business | null): string {
  return business?.name ?? 'Unknown Business';
}

// === Status and Verification Helpers ===

/**
 * Get business status with proper formatting
 */
export function getBusinessStatus(business: Business | null): string {
  return business?.status ?? 'pending';
}

/**
 * Check if business is active
 */
export function isActiveBusiness(business: Business | null): boolean {
  return business?.status === 'active';
}

/**
 * Check if business is is_claimed
 */
export function isClaimedBusiness(business: Business | null): boolean {
  return Boolean(business?.is_claimed);
}

/**
 * Get business claim date
 */
export function getBusinessClaimDate(business: Business | null): string | null {
  return business?.claimed_at ?? null;
}

// === Display and Formatting Helpers ===

/**
 * Get formatted tier display name
 */
export function getBusinessTierDisplay(business: Business | null): string {
  const tier = getBusinessTier(business);
  return getTierDisplayName(tier);
}

/**
 * Get formatted country display name
 */
export function getBusinessCountryDisplay(business: Business | null): string {
  if (!business?.country) return 'Not specified';
  return getCountryDisplayName(business.country);
}

/**
 * Get formatted industry display name
 */
export function getBusinessIndustryDisplay(business: Business | null): string {
  if (!business?.industry) return 'Not specified';
  return getIndustryDisplayName(business.industry);
}

/**
 * Get business location string (city, country)
 */
export function getBusinessLocation(business: Business | null): string {
  if (!business) return 'Unknown location';
  
  const parts = [];
  if (business.city) parts.push(business.city);
  if (business.country) {
    const countryDisplay = getCountryDisplayName(business.country);
    parts.push(countryDisplay);
  }
  
  return parts.length > 0 ? parts.join(', ') : 'Location not specified';
}

/**
 * Get business full address
 */
export function getBusinessFullAddress(business: Business | null): string {
  if (!business) return 'No address';
  
  const parts = [];
  if (business.address) parts.push(business.address);
  if (business.suburb) parts.push(business.suburb);
  if (business.city) parts.push(business.city);
  if (business.state_region) parts.push(business.state_region);
  if (business.postal_code) parts.push(business.postal_code);
  if (business.country) parts.push(getCountryDisplayName(business.country));
  
  return parts.length > 0 ? parts.join(', ') : 'No address provided';
}

// === Contact and Social Helpers ===

/**
 * Get business contact information as object
 */
export function getBusinessContactInfo(business: Business | null) {
  return {
    email: getBusinessEmail(business),
    phone: getBusinessPhone(business),
    website: getBusinessWebsite(business),
    name: business?.contact_name ?? null
  };
}

/**
 * Get business social links
 */
export function getBusinessSocialLinks(business: Business | null): Record<string, string> {
  return business?.social_links ?? {};
}

/**
 * Check if business has any contact information
 */
export function hasBusinessContactInfo(business: Business | null): boolean {
  const contact = getBusinessContactInfo(business);
  return !!(contact.email || contact.phone || contact.website);
}

// === Business Logic Helpers ===

/**
 * Check if business can be is_claimed by current user
 */
export function canClaimBusiness(business: Business | null, userId: string | null): boolean {
  if (!business || !userId) return false;
  return !business.is_claimed && business.owner_user_id !== userId;
}

/**
 * Check if business is owned by current user
 */
export function isUserBusiness(business: Business | null, userId: string | null): boolean {
  if (!business || !userId) return false;
  return business.owner_user_id === userId;
}

/**
 * Check if business has premium features (mana or moana tier)
 */
export function hasPremiumFeatures(business: Business | null): boolean {
  const tier = getBusinessTier(business);
  return tier === 'mana' || tier === 'moana';
}

/**
 * Check if business has maximum features (moana tier)
 */
export function hasMaximumFeatures(business: Business | null): boolean {
  return getBusinessTier(business) === 'moana';
}

// === Avatar and Image Helpers ===

/**
 * Get business avatar props for consistent rendering
 */
export function getBusinessAvatarProps(business: Business | null) {
  return {
    src: getBusinessLogoUrl(business),
    alt: getBusinessDisplayName(business),
    fallback: getBusinessInitial(business),
    verified: isVerifiedBusiness(business)
  };
}

/**
 * Check if business has complete profile
 */
export function hasCompleteProfile(business: Business | null): boolean {
  if (!business) return false;
  
  const requiredFields = [
    business.name,
    business.description,
    business.industry,
    business.country,
    business.contact_email
  ];
  
  return requiredFields.every(field => field && field.trim().length > 0);
}

// === Timestamp Helpers ===

/**
 * Get formatted creation date
 */
export function getBusinessCreatedDate(business: Business | null): string | null {
  return business?.created_at ?? null;
}

/**
 * Get formatted updated date
 */
export function getBusinessUpdatedDate(business: Business | null): string | null {
  return business?.updated_at ?? null;
}

/**
 * Get business age in years
 */
export function getBusinessAge(business: Business | null): number | null {
  if (!business?.year_started) return null;
  return new Date().getFullYear() - business.year_started;
}

// === Validation Helpers ===

/**
 * Validate business data for required fields
 */
export function validateBusiness(business: Partial<Business>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!business.name || business.name.trim().length === 0) {
    errors.push('Business name is required');
  }
  
  if (!business.industry) {
    errors.push('Industry is required');
  }
  
  if (!business.country) {
    errors.push('Country is required');
  }
  
  if (!business.contact_email) {
    errors.push('Contact email is required');
  } else if (!business.contact_email.includes('@')) {
    errors.push('Valid email address is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
