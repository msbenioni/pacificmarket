// Referral rewards queries for admin dashboard
import { getSupabase } from '../client';
import { SupabaseClient } from '@supabase/supabase-js';

// Get referral rewards for a business
export async function getBusinessReferralRewards(supabase: SupabaseClient, businessId: string) {
  const { data, error } = await supabase
    .from('business_referral_rewards')
    .select(`
      *,
      referrer_business:referrer_business_id(id, business_name, business_handle),
      referred_business:referred_business_id(id, business_name, business_handle, status)
    `)
    .or(`referrer_business_id.eq.${businessId},referred_business_id.eq.${businessId}`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Get referral summary for a business
export async function getBusinessReferralSummary(supabase: SupabaseClient, businessId: string) {
  const { data, error } = await supabase
    .rpc('get_business_referral_summary', { p_business_id: businessId });

  if (error) throw error;
  return data;
}

// Get all pending referral rewards (for admin overview)
export async function getPendingReferralRewards(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from('business_referral_rewards')
    .select(`
      *,
      referrer_business:referrer_business_id(id, business_name, business_handle),
      referred_business:referred_business_id(id, business_name, business_handle, status, tier_expires_at)
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Get referral statistics for admin dashboard
export async function getReferralStatistics(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from('business_referral_rewards')
    .select('status, reward_days')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Manually process pending rewards (admin function)
export async function processPendingReferralRewards(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .rpc('process_pending_referral_rewards');

  if (error) throw error;
  return data;
}

// Apply referral reward manually (admin retry function)
export async function applyReferralReward(supabase: SupabaseClient, businessId: string) {
  const { data, error } = await supabase
    .rpc('apply_referral_reward_for_business', { p_referred_business_id: businessId });

  if (error) throw error;
  return data;
}
