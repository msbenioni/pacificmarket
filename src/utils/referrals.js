/**
 * Referral utility functions for Pacific Discovery Network
 * Handles referral tracking and creation during business signup
 */

/**
 * Creates a referral record if a valid referral code is present
 * @param {string} referralCode - The referral code from user metadata or URL
 * @param {string} businessId - The newly created business ID
 * @returns {Promise<void>}
 */
export async function createReferralIfPresent(referralCode, businessId) {
  if (!referralCode || !businessId) {
    return;
  }

  try {
    // Import getSupabase dynamically
    const { getSupabase } = await import("@/lib/supabase/client");
    const supabase = getSupabase();
    
    // Call the database function to create the referral
    const { error } = await supabase.rpc('create_referral_if_present', {
      p_referrer_code: referralCode,
      p_referred_business_id: businessId
    });

    if (error) {
      console.error('Error creating referral:', error);
      // Don't throw - referral creation failure shouldn't break business creation
    } else {
      console.log('Referral created successfully');
    }
  } catch (error) {
    console.error('Error in createReferralIfPresent:', error);
    // Don't throw - referral creation failure shouldn't break business creation
  }
}

/**
 * Gets referral statistics for a business
 * @param {string} businessId - The business ID to get stats for
 * @returns {Promise<Object>} Referral statistics
 */
export async function getReferralStats(businessId) {
  if (!businessId) {
    return {
      total_referrals: 0,
      pending_referrals: 0,
      approved_referrals: 0,
      draw_entries: 0
    };
  }

  try {
    // Import getSupabase dynamically
    const { getSupabase } = await import("@/lib/supabase/client");
    const supabase = getSupabase();
    
    const { data, error } = await supabase.rpc('get_referral_stats', {
      p_business_id: businessId
    });

    if (error) {
      console.error('Error getting referral stats:', error);
      return {
        total_referrals: 0,
        pending_referrals: 0,
        approved_referrals: 0,
        draw_entries: 0
      };
    }

    return data?.[0] || {
      total_referrals: 0,
      pending_referrals: 0,
      approved_referrals: 0,
      draw_entries: 0
    };
  } catch (error) {
    console.error('Error in getReferralStats:', error);
    return {
      total_referrals: 0,
      pending_referrals: 0,
      approved_referrals: 0,
      draw_entries: 0
    };
  }
}

/**
 * Gets the referral link for a business (uses business_handle)
 * @param {string} businessHandle - The business handle to use as referral code
 * @returns {string} The referral link
 */
export function getReferralLink(businessHandle) {
  if (!businessHandle) {
    return '';
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pacificmarket.co.nz';
  return `${baseUrl}/register/${businessHandle}`;
}

/**
 * Selects a monthly referral winner (admin function)
 * @returns {Promise<Object>} Winner information
 */
export async function selectMonthlyWinner() {
  try {
    // Import getSupabase dynamically
    const { getSupabase } = await import("@/lib/supabase/client");
    const supabase = getSupabase();
    
    const { data, error } = await supabase.rpc('select_monthly_referral_winner');

    if (error) {
      console.error('Error selecting monthly winner:', error);
      throw error;
    }

    return data?.[0] || null;
  } catch (error) {
    console.error('Error in selectMonthlyWinner:', error);
    throw error;
  }
}

/**
 * Extracts referral code from current user's metadata
 * @returns {Promise<string|null>} The referral code if present
 */
export async function getUserReferralCode() {
  try {
    // Import getSupabase dynamically
    const { getSupabase } = await import("@/lib/supabase/client");
    const supabase = getSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    
    return user?.user_metadata?.referral_code || null;
  } catch (error) {
    console.error('Error getting user referral code:', error);
    return null;
  }
}
