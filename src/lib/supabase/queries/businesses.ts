/**
 * Shared Supabase queries for businesses table
 * Centralized query logic to eliminate duplication and ensure consistency
 */

import type { BusinessCreate, BusinessUpdate, ReferralBusinessOption } from '../../../types/business';

// Explicit field selection for performance and consistency
const BUSINESS_PUBLIC_FIELDS = `
  id,
  business_name,
  description,
  tagline,
  business_handle,
  role,
  logo_url,
  banner_url,
  mobile_banner_url,
  business_contact_person,
  business_email,
  business_phone,
  business_website,
  business_hours,
  country,
  industry,
  city,
  address,
  suburb,
  state_region,
  postal_code,
  year_started,
  business_stage,
  business_structure,
  team_size_band,
  is_business_registered,
  status,
  is_verified,
  is_claimed,
  claimed_at,
  claimed_by,
  visibility_tier,
  visibility_mode,
  subscription_tier,
  cultural_identity,
  languages_spoken,
  owner_user_id,
  created_by,
  referred_by_business_id,
  referral_reward_applied,
  referral_reward_applied_at,
  tier_expires_at,
  referral_count,
  source,
  profile_completeness,
  created_at,
  updated_at,
  created_date,
  founder_story,
  age_range,
  gender,
  collaboration_interest,
  mentorship_offering,
  open_to_future_contact,
  business_acquisition_interest,
  team_size_band,
  social_links
`;

// Fields for referral dropdown (minimal data)
const BUSINESS_REFERRAL_FIELDS = `
  id,
  business_name,
  business_handle,
  status
`;

/**
 * Fetch businesses for referral dropdown
 * Only returns active businesses (no verification requirement)
 */
export async function getReferralBusinesses(supabase: any): Promise<ReferralBusinessOption[]> {
  const { data, error } = await supabase
    .from('businesses')
    .select(BUSINESS_REFERRAL_FIELDS)
    .eq('status', 'active')
    .order('business_name', { ascending: true });

  if (error) {
    console.error('Error fetching referral businesses:', error);
    return [];
  }

  return data || [];
}

/**
 * Enrich an array of businesses with profile fallback data
 * Used by both single and multi-business queries for consistency
 */
async function enrichBusinessesWithProfileFallback(businesses: any[]): Promise<any[]> {
  if (!businesses || businesses.length === 0) return businesses;

  // Collect all unique profile IDs from owner_user_id and claimed_by
  const profileIds = new Set<string>();
  businesses.forEach(business => {
    if (business?.owner_user_id) profileIds.add(business.owner_user_id);
    if (business?.claimed_by && business.claimed_by !== business?.owner_user_id) {
      profileIds.add(business.claimed_by);
    }
  });

  if (profileIds.size === 0) return businesses;

  try {
    // Import getSupabase dynamically
    const { getSupabase } = await import('../client');
    const supabase = getSupabase();

    // Batch fetch all needed profiles
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, cultural_identity, languages_spoken')
      .in('id', Array.from(profileIds));

    if (!profiles || profiles.length === 0) return businesses;

    // Create profile lookup map
    const profileMap = new Map(profiles.map((p: any) => [p.id, p]));

    // Enrich each business with fallback data
    return businesses.map(business => {
      // Mirror single-fetch logic: prefer owner profile, fallback to claimed_by profile
      let profile = null;
      
      // First try owner profile
      if (business?.owner_user_id) {
        profile = profileMap.get(business.owner_user_id);
      }
      
      // Fallback to claimed_by profile if owner not found
      if (!profile && business?.claimed_by) {
        profile = profileMap.get(business.claimed_by);
      }

      if (profile) {
        // Preserve both business and profile data separately for profile-first resolution
        const enrichedBusiness = {
          ...business,
          _profile_data: {
            cultural_identity: (profile as any).cultural_identity,
            languages_spoken: (profile as any).languages_spoken,
            profile_id: (profile as any).id
          }
        };

        return enrichedBusiness;
      }

      return business;
    });
  } catch (error: any) {
    console.warn('Could not enrich businesses with profile fallbacks:', error?.message || error);
    return businesses; // Return original businesses if enrichment fails
  }
}

/**
 * Get active businesses for public registry
 */
export async function getPublicBusinesses(options: {
  limit?: number;
  orderBy?: 'created_at' | 'updated_at' | 'business_name';
  orderDirection?: 'asc' | 'desc';
} = {}) {
  // Import getSupabase dynamically
  const { getSupabase } = await import('../client');
  const supabase = getSupabase();
  const { limit = 100, orderBy = 'created_at', orderDirection = 'desc' } = options;

  const { data: businesses, error } = await supabase
    .from('businesses')
    .select(BUSINESS_PUBLIC_FIELDS)
    .eq('status', 'active')
    .order(orderBy, { ascending: orderDirection === 'asc' })
    .limit(limit);

  if (error) {
    console.error('Public businesses query error:', error);
    return { data: null, error };
  }

  // Enrich with profile fallbacks for consistency with single business fetch
  const enrichedBusinesses = await enrichBusinessesWithProfileFallback(businesses || []);
  return { data: enrichedBusinesses, error: null };
}

/**
 * Get businesses featured on homepage
 */
export async function getHomepageBusinesses(options: {
  limit?: number;
  orderBy?: 'updated_at' | 'created_at';
} = {}) {
  // Import getSupabase dynamically
  const { getSupabase } = await import('../client');
  const supabase = getSupabase();
  const { limit = 12, orderBy = 'updated_at' } = options;

  const { data: businesses, error } = await supabase
    .from('businesses')
    .select(BUSINESS_PUBLIC_FIELDS)
    .eq('status', 'active')
    .eq('visibility_tier', 'homepage')
    .order(orderBy, { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Homepage businesses query error:', error);
    return { data: null, error };
  }

  // Enrich with profile fallbacks for consistency with single business fetch
  const enrichedBusinesses = await enrichBusinessesWithProfileFallback(businesses || []);
  return { data: enrichedBusinesses, error: null };
}

/**
 * Get single business by ID or handle
 */
export async function getBusinessById(id: string) {
  // Import getSupabase dynamically
  const { getSupabase } = await import('../client');
  const supabase = getSupabase();

  // Check if the ID looks like a UUID (8-4-4-4-12 format with hyphens)
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  
  let business: any;
  
  if (isUUID) {
    // Query by UUID - all data now in businesses table
    const { data, error } = await supabase
      .from('businesses')
      .select(BUSINESS_PUBLIC_FIELDS)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Business query error:', error);
      throw new Error(`Failed to fetch business: ${error.message}`);
    }

    business = data;
  } else {
    // Query by business handle - all data now in businesses table
    const { data, error } = await supabase
      .from('businesses')
      .select(BUSINESS_PUBLIC_FIELDS)
      .eq('business_handle', id)
      .single();

    if (error) {
      console.error('Business query error:', error);
      throw new Error(`Failed to fetch business: ${error.message}`);
    }

    business = data;
  }

  // If business exists and has owner, fetch profile for cultural/language fallbacks
  // Use both owner_user_id and claimed_by as potential profile sources
  const profileIds = [];
  if (business?.owner_user_id) profileIds.push(business.owner_user_id);
  if (business?.claimed_by && business.claimed_by !== business?.owner_user_id) profileIds.push(business.claimed_by);
  
  if (profileIds.length > 0) {
    try {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, cultural_identity, languages_spoken')
        .in('id', profileIds);

      if (profiles && profiles.length > 0) {
        // Prefer owner profile, fallback to claimed_by profile
        const profile = profiles.find((p: any) => p.id === business.owner_user_id) || profiles[0];
        
        // Preserve both business and profile data separately for profile-first resolution
        business = {
          ...business,
          _profile_data: {
            cultural_identity: profile.cultural_identity,
            languages_spoken: profile.languages_spoken,
            profile_id: profile.id
          }
        };
      }
    } catch (profileError: any) {
      // Profile fetch should not break business fetch
      console.warn('Could not fetch profile for cultural fallbacks:', profileError?.message || profileError);
    }
  }

  return business;
}

export async function getBusinessByHandle(handle: string) {
  // Import getSupabase dynamically
  const { getSupabase } = await import('../client');
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('businesses')
    .select(BUSINESS_PUBLIC_FIELDS)
    .eq('business_handle', handle)
    .single();

  if (error) {
    console.error('Business query error:', error);
    return null;
  }

  return data;
}

/**
 * Get businesses owned by a specific user
 */
export async function getUserBusinesses(userId: string, options: {
  includeStatus?: ('active' | 'pending' | 'rejected')[];
} = {}) {
  // Import getSupabase dynamically
  const { getSupabase } = await import('../client');
  const supabase = getSupabase();
  const { includeStatus = ['active', 'pending'] } = options;

  let query = supabase
    .from('businesses')
    .select(BUSINESS_PUBLIC_FIELDS)
    .eq('owner_user_id', userId);

  // Apply status filters if specified
  if (includeStatus.length > 0) {
    query = query.in('status', includeStatus);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('User businesses query error:', error);
    return { data: null, error };
  }

  return { data, error: null };
}

// Fields for admin queries (includes referral info)
const BUSINESS_ADMIN_FIELDS = `
  id,
  business_name,
  description,
  tagline,
  business_handle,
  role,
  logo_url,
  banner_url,
  mobile_banner_url,
  business_contact_person,
  business_email,
  business_phone,
  business_website,
  business_hours,
  country,
  industry,
  city,
  address,
  suburb,
  state_region,
  postal_code,
  year_started,
  business_stage,
  business_structure,
  team_size_band,
  is_business_registered,
  status,
  is_verified,
  is_claimed,
  claimed_at,
  claimed_by,
  visibility_tier,
  visibility_mode,
  subscription_tier,
  cultural_identity,
  languages_spoken,
  owner_user_id,
  created_by,
  referred_by_business_id,
  referral_reward_applied,
  referral_reward_applied_at,
  tier_expires_at,
  referral_count,
  source,
  profile_completeness,
  created_at,
  updated_at,
  created_date,
  founder_story,
  age_range,
  gender,
  collaboration_interest,
  mentorship_offering,
  open_to_future_contact,
  business_acquisition_interest,
  team_size_band,
  social_links,
  referrer_business:referred_by_business_id(
    business_name,
    business_handle
  )
`;

/**
 * Get businesses for admin dashboard (all statuses)
 */
export async function getAdminBusinesses(options: {
  limit?: number;
  status?: ('active' | 'pending' | 'rejected')[];
} = {}) {
  // Import getSupabase dynamically
  const { getSupabase } = await import('../client');
  const supabase = getSupabase();
  const { limit = 500, status } = options;

  let query = supabase
    .from('businesses')
    .select(BUSINESS_ADMIN_FIELDS);

  if (status && status.length > 0) {
    query = query.in('status', status);
  }

  const { data, error } = await query
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Admin businesses query error:', error);
    return { data: null, error };
  }

  return { data, error: null };
}

/**
 * Update a business
 */
export async function updateBusiness(id: string, updates: BusinessUpdate) {
  // Import getSupabase dynamically
  const { getSupabase } = await import('../client');
  const supabase = getSupabase();

  return supabase
    .from('businesses')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select(BUSINESS_PUBLIC_FIELDS)
    .single();
}

/**
 * Create a new business
 */
export async function createBusiness(business: BusinessCreate) {
  // Import getSupabase dynamically
  const { getSupabase } = await import('../client');
  const { inheritProfileData } = await import('../../../utils/businessDataTransformer');
  const supabase = getSupabase();

  // Inherit cultural data from user profile if not explicitly set
  const businessData = await inheritProfileData(business, business.owner_user_id);

  const businessWithTimestamps = businessData as BusinessCreate & {
    created_at?: string;
    updated_at?: string;
    created_date?: string | null;
  };
  const now = new Date();
  const created_at = businessWithTimestamps.created_at ?? now.toISOString();
  const updated_at = businessWithTimestamps.updated_at ?? now.toISOString();
  const created_date =
    businessWithTimestamps.created_date ?? now.toISOString().split('T')[0];

  return supabase
    .from('businesses')
    .insert({
      ...businessData,
      created_at,
      updated_at,
      created_date
    })
    .select(BUSINESS_PUBLIC_FIELDS)
    .single();
}

/**
 * Delete a business (admin only)
 */
export async function deleteBusiness(id: string) {
  // Import getSupabase dynamically
  const { getSupabase } = await import('../client');
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('businesses')
    .delete()
    .eq('id', id);

  return { data, error };
}

/**
 * Search businesses by name or description
 */
export async function searchBusinesses(query: string, options: {
  limit?: number;
  status?: ('active' | 'pending' | 'rejected')[];
} = {}) {
  // Import getSupabase dynamically
  const { getSupabase } = await import('../client');
  const supabase = getSupabase();
  const { limit = 50, status } = options;

  let queryBuilder = supabase
    .from('businesses')
    .select(BUSINESS_PUBLIC_FIELDS)
    .or(`business_name.ilike.%${query}%,description.ilike.%${query}%,tagline.ilike.%${query}%`);

  // Apply status filter only if status array is provided and not empty
  if (status && status.length > 0) {
    queryBuilder = queryBuilder.in('status', status);
  }

  const { data, error } = await queryBuilder.limit(limit);

  if (error) {
    console.error('Search businesses query error:', error);
    return { data: null, error };
  }

  return { data, error: null };
}

/**
 * Get businesses by industry
 */
export async function getBusinessesByIndustry(industry: string, options: {
  limit?: number;
} = {}) {
  // Import getSupabase dynamically
  const { getSupabase } = await import('../client');
  const supabase = getSupabase();
  const { limit = 100 } = options;

  const { data, error } = await supabase
    .from('businesses')
    .select(BUSINESS_PUBLIC_FIELDS)
    .eq('status', 'active')
    .eq('industry', industry)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Businesses by industry query error:', error);
    return { data: null, error };
  }

  return { data, error: null };
}

/**
 * Get businesses by country
 */
export async function getBusinessesByCountry(country: string, options: {
  limit?: number;
} = {}) {
  // Import getSupabase dynamically
  const { getSupabase } = await import('../client');
  const supabase = getSupabase();
  const { limit = 100 } = options;

  const { data, error } = await supabase
    .from('businesses')
    .select(BUSINESS_PUBLIC_FIELDS)
    .eq('status', 'active')
    .eq('country', country)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Businesses by country query error:', error);
    return { data: null, error };
  }

  return { data, error: null };
}
