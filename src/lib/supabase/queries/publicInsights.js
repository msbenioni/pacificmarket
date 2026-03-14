// ================================================================
// PUBLIC INSIGHTS API
// Only shows aggregated, non-sensitive data for public viewing
// ================================================================

import { getSupabase } from '../client';

// Fetch public insights data (aggregated and anonymized)
export const getPublicInsightsData = async () => {
  try {
    const supabase = getSupabase();
    
    // Get public statistics from the secure function
    const { data: statsData, error: statsError } = await supabase
      .rpc('get_public_insights_stats');

    // Get public business directory
    const { data: businessData, error: businessError } = await supabase
      .from('public_business_directory')
      .select(`
        id,
        name,
        industry,
        country,
        city,
        subscription_tier,
        created_at
      `)
      .order('created_at', { ascending: false })
      .limit(100);

    // Get public statistics
    const { data: statisticsData, error: statisticsError } = await supabase
      .from('public_business_statistics')
      .select('*')
      .single();

    if (statsError) {
      console.warn('Stats not available, using fallback:', statsError);
    }

    // Combine public data safely
    return {
      businesses: businessData || [],
      stats: statsData || {
        totalBusinesses: businessData?.length || 0,
        topIndustries: [],
        topCountries: [],
        topStages: [],
        subscriptionStats: [],
        monthlyGrowth: []
      },
      statistics: statisticsData || {}
    };
  } catch (error) {
    console.error('Error fetching public insights:', error);
    return {
      businesses: [],
      stats: {
        totalBusinesses: 0,
        topIndustries: [],
        topCountries: [],
        topStages: [],
        subscriptionStats: [],
        monthlyGrowth: []
      },
      statistics: {}
    };
  }
};

// Get public business directory data
export const getPublicBusinessDirectory = async (filters = {}) => {
  try {
    const supabase = getSupabase();
    
    let query = supabase
      .from('public_business_listings')
      .select(`
        id,
        name,
        business_handle,
        short_description,
        logo_url,
        industry,
        country,
        city,
        subscription_tier,
        verified,
        created_at,
        owner_name,
        owner_avatar
      `)
      .eq('status', 'active')
      .eq('verified', true);

    // Apply filters
    if (filters.industry && filters.industry !== 'all') {
      query = query.eq('industry', filters.industry);
    }
    
    if (filters.country && filters.country !== 'all') {
      query = query.eq('country', filters.country);
    }
    
    if (filters.subscriptionTier && filters.subscriptionTier !== 'all') {
      query = query.eq('subscription_tier', filters.subscriptionTier);
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching business directory:', error);
    return [];
  }
};

// Get public industry statistics
export const getPublicIndustryStats = async () => {
  try {
    const supabase = getSupabase();
    
    const { data, error } = await supabase
      .from('public_business_listings')
      .select('industry')
      .eq('status', 'active')
      .eq('verified', true);

    if (error) throw error;

    // Aggregate industry counts
    const industryCounts = data?.reduce((acc, business) => {
      const industry = business.industry || 'other';
      acc[industry] = (acc[industry] || 0) + 1;
      return acc;
    }, {}) || {};

    return industryCounts;
  } catch (error) {
    console.error('Error fetching industry stats:', error);
    return {};
  }
};

// Get public country statistics
export const getPublicCountryStats = async () => {
  try {
    const supabase = getSupabase();
    
    const { data, error } = await supabase
      .from('public_business_listings')
      .select('country')
      .eq('status', 'active')
      .eq('verified', true);

    if (error) throw error;

    // Aggregate country counts
    const countryCounts = data?.reduce((acc, business) => {
      const country = business.country || 'other';
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {}) || {};

    return countryCounts;
  } catch (error) {
    console.error('Error fetching country stats:', error);
    return {};
  }
};
