/**
 * Modern Audience Module for Email Campaigns
 * 
 * Clean implementation with no legacy compatibility:
 * - Database queries and recipient building
 * - Data transformation and validation
 * - Modern audience structure only
 */

import { createServiceClient } from '@/lib/server-auth';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get human-readable label for audience
 * @param {Object} campaign - Campaign object with audience fields
 * @returns {string} Human-readable audience label
 */
export const getAudienceLabel = (campaign) => {
  if (!campaign.audience_type) return 'Unknown Audience';

  switch (campaign.audience_type) {
    case 'all_businesses':
      return 'All Active Businesses';
    case 'plan':
      const planNames = { vaka: 'Vaka Plan', mana: 'Mana Plan', moana: 'Moana Plan' };
      return planNames[campaign.audience_value] || `${campaign.audience_value} Plan`;
    case 'language':
      return `Language: ${campaign.audience_value}`;
    case 'country':
      return `Country: ${campaign.audience_value}`;
    default:
      return 'Unknown Audience';
  }
};

/**
 * Validate audience structure for API routes
 * @param {Object} audienceData - Audience data to validate
 * @returns {Object} Validation result with error if invalid
 */
export const validateAudienceStructure = (audienceData) => {
  const { audience_type, audience_value } = audienceData;
  
  if (!audience_type) {
    return { valid: false, error: 'audience_type is required' };
  }

  if (!['all_businesses', 'plan', 'language', 'country'].includes(audience_type)) {
    return { valid: false, error: 'Invalid audience_type' };
  }

  if (audience_type !== 'all_businesses' && !audience_value) {
    return { valid: false, error: 'audience_value is required for this audience_type' };
  }

  if (audience_type === 'plan' && !['vaka', 'mana', 'moana'].includes(audience_value)) {
    return { valid: false, error: 'Invalid plan value' };
  }

  return { valid: true };
};

// ============================================================================
// DATABASE QUERY FUNCTIONS
// ============================================================================

/**
 * Build audience for all active businesses
 * @param {Object} serviceClient - Supabase service client
 * @returns {Array} Array of recipient objects
 */
async function buildAllBusinessesAudience(serviceClient) {
  const { data: businesses } = await serviceClient
    .from('businesses')
    .select('owner_user_id, business_handle, business_email, business_contact_person')
    .eq('is_active', true)
    .eq('status', 'active')
    .not('business_email', 'is', null);

  if (!businesses || businesses.length === 0) return [];

  const ownerIds = businesses.map(b => b.owner_user_id).filter(Boolean);
  const { data: owners } = await serviceClient
    .from('profiles')
    .select('id, private_email, display_name')
    .in('id', ownerIds);

  const businessEmails = businesses.map(b => b.business_email);
  const { data: subscribers } = await serviceClient
    .from('email_subscribers')
    .select('id, email, first_name')
    .in('email', businessEmails)
    .eq('status', 'subscribed');

  return businesses.map(business => {
    const owner = owners?.find(o => o.id === business.owner_user_id);
    const subscriber = subscribers?.find(s => 
      s.email?.toLowerCase() === business.business_email?.toLowerCase()
    );

    return {
      email: business.business_email,
      first_name: business.business_contact_person || owner?.display_name || subscriber?.first_name,
      business_handle: business.business_handle,
      subscriber_id: subscriber?.id || null
    };
  }).filter(recipient => recipient.email && recipient.subscriber_id);
}

/**
 * Build audience for specific subscription plan
 * @param {string} plan - Plan name (vaka, mana, moana)
 * @param {Object} serviceClient - Supabase service client
 * @returns {Array} Array of recipient objects
 */
async function buildPlanAudience(plan, serviceClient) {
  const { data: planBusinesses } = await serviceClient
    .from('businesses')
    .select('owner_user_id, business_handle, business_email, business_contact_person')
    .eq('subscription_tier', plan)
    .eq('is_active', true)
    .eq('status', 'active')
    .not('business_email', 'is', null);

  if (!planBusinesses || planBusinesses.length === 0) return [];

  const ownerIds = planBusinesses.map(b => b.owner_user_id).filter(Boolean);
  const { data: planOwners } = await serviceClient
    .from('profiles')
    .select('id, private_email, display_name')
    .in('id', ownerIds);

  const planEmails = planBusinesses.map(b => b.business_email);
  const { data: planSubscribers } = await serviceClient
    .from('email_subscribers')
    .select('id, email, first_name')
    .in('email', planEmails)
    .eq('status', 'subscribed');

  return planBusinesses.map(business => {
    const owner = planOwners?.find(o => o.id === business.owner_user_id);
    const subscriber = planSubscribers?.find(s => 
      s.email?.toLowerCase() === business.business_email?.toLowerCase()
    );

    return {
      email: business.business_email,
      first_name: business.business_contact_person || owner?.display_name || subscriber?.first_name,
      business_handle: business.business_handle,
      subscriber_id: subscriber?.id || null
    };
  }).filter(recipient => recipient.email && recipient.subscriber_id);
}

/**
 * Build audience for specific language
 * @param {string} language - Language code
 * @param {Object} serviceClient - Supabase service client
 * @returns {Array} Array of recipient objects
 */
async function buildLanguageAudience(language, serviceClient) {
  // languages_spoken is a text column storing JSON-like strings, not real JSON/array
  // Use text-safe quoted match with ilike for proper matching
  const { data: languageBusinesses } = await serviceClient
    .from('businesses')
    .select('owner_user_id, business_handle, business_email, business_contact_person, languages_spoken')
    .eq('is_active', true)
    .eq('status', 'active')
    .not('business_email', 'is', null)
    .ilike('languages_spoken', `%"${language}"%`); // Text-safe quoted match

  if (!languageBusinesses || languageBusinesses.length === 0) return [];

  const ownerIds = languageBusinesses.map(b => b.owner_user_id).filter(Boolean);
  const { data: languageOwners } = await serviceClient
    .from('profiles')
    .select('id, private_email, display_name')
    .in('id', ownerIds);

  const languageEmails = languageBusinesses.map(b => b.business_email);
  const { data: languageSubscribers } = await serviceClient
    .from('email_subscribers')
    .select('id, email, first_name')
    .in('email', languageEmails)
    .eq('status', 'subscribed');

  return languageBusinesses.map(business => {
    const owner = languageOwners?.find(o => o.id === business.owner_user_id);
    const subscriber = languageSubscribers?.find(s => 
      s.email?.toLowerCase() === business.business_email?.toLowerCase()
    );

    return {
      email: business.business_email,
      first_name: business.business_contact_person || owner?.display_name || subscriber?.first_name,
      business_handle: business.business_handle,
      subscriber_id: subscriber?.id || null
    };
  }).filter(recipient => recipient.email && recipient.subscriber_id);
}

/**
 * Build audience for specific country
 * @param {string} country - Country code
 * @param {Object} serviceClient - Supabase service client
 * @returns {Array} Array of recipient objects
 */
async function buildCountryAudience(country, serviceClient) {
  const { data: countryBusinesses } = await serviceClient
    .from('businesses')
    .select('owner_user_id, business_handle, business_email, business_contact_person')
    .eq('country', country)
    .eq('is_active', true)
    .eq('status', 'active')
    .not('business_email', 'is', null);

  if (!countryBusinesses || countryBusinesses.length === 0) return [];

  const ownerIds = countryBusinesses.map(b => b.owner_user_id).filter(Boolean);
  const { data: countryOwners } = await serviceClient
    .from('profiles')
    .select('id, private_email, display_name')
    .in('id', ownerIds);

  const countryEmails = countryBusinesses.map(b => b.business_email);
  const { data: countrySubscribers } = await serviceClient
    .from('email_subscribers')
    .select('id, email, first_name')
    .in('email', countryEmails)
    .eq('status', 'subscribed');

  return countryBusinesses.map(business => {
    const owner = countryOwners?.find(o => o.id === business.owner_user_id);
    const subscriber = countrySubscribers?.find(s => 
      s.email?.toLowerCase() === business.business_email?.toLowerCase()
    );

    return {
      email: business.business_email,
      first_name: business.business_contact_person || owner?.display_name || subscriber?.first_name,
      business_handle: business.business_handle,
      subscriber_id: subscriber?.id || null
    };
  }).filter(recipient => recipient.email && recipient.subscriber_id);
}

// ============================================================================
// MAIN AUDIENCE BUILDING FUNCTION
// ============================================================================

/**
 * Build audience recipients for email campaigns
 * Used by preview endpoint, queue endpoint, and background processor
 * 
 * @param {Object} campaign - Campaign object with audience_type and audience_value
 * @param {Object} serviceClient - Supabase service client
 * @returns {Object} Object with recipients array and metadata
 */
export async function buildAudienceRecipients(campaign, serviceClient) {
  if (!campaign.audience_type) {
    throw new Error('audience_type is required');
  }

  let rawEmails = [];

  switch (campaign.audience_type) {
    case 'all_businesses':
      rawEmails = await buildAllBusinessesAudience(serviceClient);
      break;

    case 'plan':
      if (!campaign.audience_value) {
        throw new Error('audience_value is required for plan audience type');
      }
      rawEmails = await buildPlanAudience(campaign.audience_value, serviceClient);
      break;

    case 'language':
      if (!campaign.audience_value) {
        throw new Error('audience_value is required for language audience type');
      }
      rawEmails = await buildLanguageAudience(campaign.audience_value, serviceClient);
      break;

    case 'country':
      if (!campaign.audience_value) {
        throw new Error('audience_value is required for country audience type');
      }
      rawEmails = await buildCountryAudience(campaign.audience_value, serviceClient);
      break;

    default:
      throw new Error(`Unsupported audience_type: ${campaign.audience_type}`);
  }

  // Deduplicate by email
  const uniqueEmails = new Map();
  rawEmails.forEach(recipient => {
    if (recipient.email && !uniqueEmails.has(recipient.email)) {
      uniqueEmails.set(recipient.email, recipient);
    }
  });

  return {
    recipients: Array.from(uniqueEmails.values()),
    totalRecipients: uniqueEmails.size,
    rawCount: rawEmails.length
  };
}
