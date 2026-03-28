/**
 * Core Business type contract for Pacific Discovery Network
 * Single source of truth for business data structure
 */

// Smaller type for referral dropdown options
export type ReferralBusinessOption = {
  id: string;
  business_name: string;
  business_handle: string | null;
  status: string;
};

export type Business = {
  // Core identity
  id: string;
  business_name: string;
  description: string | null;
  tagline: string | null;
  business_handle: string | null;
  role: string | null;

  // Visual assets
  logo_url: string | null;
  banner_url: string | null;
  mobile_banner_url: string | null;

  // Contact information
  business_contact_person: string | null;
  business_email: string | null;
  business_phone: string | null;
  business_website: string | null;
  business_hours: string | null;

  // Location
  address: string | null;
  suburb: string | null;
  city: string | null;
  state_region: string | null;
  postal_code: string | null;
  country: string | null;

  // Business details
  industry: string | null;
  social_links: Record<string, string> | null;
  business_structure: string | null;
  year_started: number | null;
  business_stage: string | null;
  is_business_registered: boolean;

  // Founder information
  founder_story: string | null;
  age_range: string | null;
  gender: string | null;

  // Community & opportunities
  collaboration_interest: boolean;
  mentorship_offering: boolean;
  open_to_future_contact: boolean;
  business_acquisition_interest: boolean;

  // Status and verification
  status: string;
  is_verified: boolean;
  is_claimed: boolean;
  claimed_at: string | null;
  claimed_by: string | null;

  // Visibility and tiers
  visibility_tier: 'homepage' | 'pacific-businesses' | 'none';
  visibility_mode: 'auto' | 'manual';
  subscription_tier: 'vaka' | 'mana' | 'moana';

  // Ownership
  owner_user_id: string | null;
  created_by: string | null;

  // Referral system
  referred_by_business_id: string | null;
  referral_reward_applied: boolean;
  referral_reward_applied_at: string | null;
  tier_expires_at: string | null;
  referral_count: number;

  // Metadata
  source: 'user' | 'admin' | 'import' | 'claim';
  profile_completeness: number;
  referral_code: string | null;

  // Timestamps
  created_at: string;
  updated_at: string;
  created_date: string | null;
};

// Helper type for partial updates
export type BusinessUpdate = Partial<Omit<Business, 'id' | 'created_at' | 'created_date'>>;

// Type for business creation
export type BusinessCreate = Omit<Business, 'id' | 'created_at' | 'updated_at' | 'created_date'>;
