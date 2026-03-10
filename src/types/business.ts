/**
 * Core Business type contract for Pacific Market
 * Single source of truth for business data structure
 */

export type Business = {
  // Core identity
  id: string;
  name: string;
  description: string | null;
  short_description: string | null;
  business_handle: string | null;

  // Visual assets
  logo_url: string | null;
  banner_url: string | null;

  // Contact information
  contact_email: string | null;
  contact_phone: string | null;
  contact_website: string | null;
  contact_name: string | null;

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
  business_hours: string | null;
  business_structure: string | null;
  year_started: number | null;
  languages_spoken: string[] | null;
  cultural_identity: string | null;

  // Status and verification
  status: 'active' | 'pending' | 'rejected';
  verified: boolean;
  claimed: boolean;
  claimed_at: string | null;
  claimed_by: string | null;

  // Visibility and tiers
  visibility_tier: 'homepage' | 'registry' | 'none';
  homepage_featured: boolean;
  subscription_tier: 'vaka' | 'mana' | 'moana';

  // Ownership
  owner_user_id: string | null;
  created_by: string | null;

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
