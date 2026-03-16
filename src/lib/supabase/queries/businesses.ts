/**
 * Shared Supabase queries for businesses table
 * Centralized query logic to eliminate duplication and ensure consistency
 */

import type { Business, BusinessUpdate, BusinessCreate } from '../../../types/business';

// Explicit field selection for performance and consistency
const BUSINESS_PUBLIC_FIELDS = `
  id,
  name,
  description,
  tagline,
  business_handle,
  logo_url,
  banner_url,
  mobile_banner_url,
  contact_email,
  contact_phone,
  contact_website,
  business_hours,
  country,
  industry,
  city,
  year_started,
  business_structure,
  team_size_band,
  business_registered,
  status,
  is_verified,
  is_claimed,
  claimed_at,
  claimed_by,
  is_homepage_featured,
  subscription_tier,
  owner_user_id,
  created_by,
  source,
  profile_completeness,
  referral_code,
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
  business_stage
`;

/**
 * Get active businesses for public registry
 */
export async function getPublicBusinesses(options: {
  limit?: number;
  orderBy?: 'created_at' | 'updated_at' | 'name';
  orderDirection?: 'asc' | 'desc';
} = {}) {
  // Import getSupabase dynamically
  const { getSupabase } = await import('../client');
  const supabase = getSupabase();
  const { limit = 100, orderBy = 'created_at', orderDirection = 'desc' } = options;

  return supabase
    .from('businesses')
    .select(BUSINESS_PUBLIC_FIELDS)
    .eq('status', 'active')
    .order(orderBy, { ascending: orderDirection === 'asc' })
    .limit(limit);
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

  return supabase
    .from('businesses')
    .select(BUSINESS_PUBLIC_FIELDS)
    .eq('status', 'active')
    .eq('visibility_tier', 'homepage')
    .order(orderBy, { ascending: false })
    .limit(limit);
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

    return data;
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

    return data;
  }
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

  return query.order('created_at', { ascending: false });
}

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
    .select(BUSINESS_PUBLIC_FIELDS);

  if (status && status.length > 0) {
    query = query.in('status', status);
  }

  return query
    .order('created_at', { ascending: false })
    .limit(limit);
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
  const supabase = getSupabase();

  return supabase
    .from('businesses')
    .insert({
      ...business,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_date: new Date().toISOString().split('T')[0]
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

  return supabase
    .from('businesses')
    .delete()
    .eq('id', id);
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

  return supabase
    .from('businesses')
    .select(BUSINESS_PUBLIC_FIELDS)
    .eq('status', status)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%,tagline.ilike.%${query}%`)
    .limit(limit);
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

  return supabase
    .from('businesses')
    .select(BUSINESS_PUBLIC_FIELDS)
    .eq('status', 'active')
    .eq('industry', industry)
    .order('created_at', { ascending: false })
    .limit(limit);
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

  return supabase
    .from('businesses')
    .select(BUSINESS_PUBLIC_FIELDS)
    .eq('status', 'active')
    .eq('country', country)
    .order('created_at', { ascending: false })
    .limit(limit);
}
