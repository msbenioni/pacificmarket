/**
 * Unified Audience Module for Email Campaigns
 * 
 * This module consolidates all audience-related functionality:
 * - Database queries and recipient building
 * - Data transformation and validation
 * - Legacy compatibility utilities
 */

import { createServiceClient } from '@/lib/server-auth';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Convert new audience structure to legacy format for backward compatibility
 * @param {string} type - Audience type (all_businesses, plan, language, country)
 * @param {string|null} value - Audience value (plan name, language code, country code)
 * @returns {string} Legacy audience value
 */
export const getLegacyAudienceValue = (type, value) => {
  if (type === 'all_businesses') return 'all_businesses';
  if (type === 'plan' && value) return `${value}_plan`;
  if (type === 'language' && value) return `language:${value}`;
  if (type === 'country' && value) return `country:${value}`;
  return 'all_businesses'; // fallback
};

/**
 * Get human-readable label for audience (both new and legacy structures)
 * @param {Object} campaign - Campaign object with audience fields
 * @returns {string} Human-readable audience label
 */
export const getAudienceLabel = (campaign) => {
  // New audience structure
  if (campaign.audience_type) {
    if (campaign.audience_type === 'all_businesses') return 'All Active Businesses';
    if (campaign.audience_type === 'plan') {
      const planNames = { vaka: 'Vaka Plan', mana: 'Mana Plan', moana: 'Moana Plan' };
      return planNames[campaign.audience_value] || `${campaign.audience_value} Plan`;
    }
    if (campaign.audience_type === 'language') {
      return `Language: ${campaign.audience_value}`;
    }
    if (campaign.audience_type === 'country') {
      return `Country: ${campaign.audience_value}`;
    }
  }
  
  // Legacy audience labels
  const legacyLabels = {
    'all': 'All Subscribers',
    'business_owners': 'Business Owners',
    'mana_plan': 'Mana Plan Members',
    'moana_plan': 'Moana Plan Members',
    'referral_participants': 'Referral Participants',
    'all_businesses': 'All Active Businesses'
  };
  
  return legacyLabels[campaign.audience] || campaign.audience;
};

/**
 * Validate audience structure for API routes
 * @param {Object} audienceData - Audience data to validate
 * @returns {Object} Validation result with error if invalid
 */
export const validateAudienceStructure = (audienceData) => {
  const { audience_type, audience_value, audience } = audienceData;
  
  // Validate new audience structure
  if (audience_type) {
    if (!['all_businesses', 'plan', 'language', 'country'].includes(audience_type)) {
      return { valid: false, error: 'Invalid audience_type' };
    }
    if (audience_type !== 'all_businesses' && !audience_value) {
      return { valid: false, error: 'audience_value is required for this audience_type' };
    }
  } else if (!audience) {
    // Legacy structure requires audience
    return { valid: false, error: 'audience is required' };
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
  // languages_spoken is stored as text containing JSON arrays like '["English","French"]'
  // Use JSON containment operator for proper matching
  const { data: languageBusinesses } = await serviceClient
    .from('businesses')
    .select('owner_user_id, business_handle, business_email, business_contact_person, languages_spoken')
    .eq('is_active', true)
    .eq('status', 'active')
    .not('business_email', 'is', null)
    .contains('languages_spoken', `"${language}"`); // Proper JSON array containment

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
 * Centralized audience building utility for email campaigns
 * Used by preview endpoint, queue endpoint, and background processor
 * 
 * Supports both legacy audience format and new audience_type/audience_value structure
 * 
 * @param {Object} campaign - Campaign object with audience information
 * @param {Object} serviceClient - Supabase service client
 * @returns {Object} Object with recipients array and metadata
 */
export async function buildAudienceRecipients(campaign, serviceClient) {
  let rawEmails = [];
  let subscriberData = [];

  // Handle new audience structure first
  if (campaign.audience_type) {
    return await buildAudienceFromNewStructure(campaign, serviceClient);
  }

  // Fallback to legacy audience handling for backward compatibility
  switch (campaign.audience) {
    case 'all':
      const { data: allSubscribers } = await serviceClient
        .from('email_subscribers')
        .select('id, email, first_name')
        .eq('status', 'subscribed');
      
      subscriberData = allSubscribers || [];
      
      // Enrich with business handles for referral links
      if (allSubscribers && allSubscribers.length > 0) {
        const subscriberEmails = allSubscribers.map(s => s.email);
        const { data: subscriberProfiles } = await serviceClient
          .from('profiles')
          .select('id, private_email')
          .in('private_email', subscriberEmails);
        
        if (subscriberProfiles && subscriberProfiles.length > 0) {
          const profileIds = subscriberProfiles.map(p => p.id);
          const { data: subscriberBusinesses } = await serviceClient
            .from('businesses')
            .select('owner_user_id, business_handle')
            .in('owner_user_id', profileIds);
          
          rawEmails = allSubscribers.map(subscriber => {
            const profile = subscriberProfiles?.find(p => 
              p.private_email?.toLowerCase() === subscriber.email?.toLowerCase()
            );
            const business = subscriberBusinesses?.find(b => b.owner_user_id === profile?.id);
            return {
              email: subscriber.email,
              first_name: subscriber.first_name,
              business_handle: business?.business_handle,
              subscriber_id: subscriber.id
            };
          }).filter(recipient => recipient.email); // Filter out invalid emails
        } else {
          rawEmails = allSubscribers.map(subscriber => ({
            email: subscriber.email,
            first_name: subscriber.first_name,
            business_handle: null,
            subscriber_id: subscriber.id
          }));
        }
      } else {
        rawEmails = [];
      }
      break;

    case 'business_owners':
      const { data: businessOwners } = await serviceClient
        .from('profiles')
        .select('id, private_email, display_name')
        .in('role', ['owner', 'admin']);
      
      // Enrich with business handles
      if (businessOwners && businessOwners.length > 0) {
        const ownerIds = businessOwners.map(o => o.id);
        const { data: ownerBusinesses } = await serviceClient
          .from('businesses')
          .select('owner_user_id, business_handle')
          .in('owner_user_id', ownerIds);
        
        // Get subscriber data for business owners
        const ownerEmails = businessOwners.map(o => o.private_email);
        const { data: ownerSubscribers } = await serviceClient
          .from('email_subscribers')
          .select('id, email, first_name')
          .in('email', ownerEmails)
          .eq('status', 'subscribed');
        
        subscriberData = ownerSubscribers || [];
        
        rawEmails = businessOwners.map(owner => {
          const subscriber = ownerSubscribers?.find(s => 
            s.email?.toLowerCase() === owner.private_email?.toLowerCase()
          );
          const business = ownerBusinesses?.find(b => b.owner_user_id === owner.id);
          return {
            email: owner.private_email,
            first_name: owner.display_name,
            business_handle: business?.business_handle,
            subscriber_id: subscriber?.id || null
          };
        }).filter(recipient => recipient.email && recipient.subscriber_id); // Only include actual subscribers with valid emails
      }
      break;

    case 'mana_plan':
      rawEmails = await buildPlanAudience('mana', serviceClient);
      subscriberData = rawEmails.map(r => ({ 
        id: r.subscriber_id, 
        email: r.email, 
        first_name: r.first_name 
      }));
      break;

    case 'moana_plan':
      rawEmails = await buildPlanAudience('moana', serviceClient);
      subscriberData = rawEmails.map(r => ({ 
        id: r.subscriber_id, 
        email: r.email, 
        first_name: r.first_name 
      }));
      break;

    case 'all_businesses':
      rawEmails = await buildAllBusinessesAudience(serviceClient);
      subscriberData = rawEmails.map(r => ({ 
        id: r.subscriber_id, 
        email: r.email, 
        first_name: r.first_name 
      }));
      break;

    default:
      rawEmails = [];
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

/**
 * Build audience using the new audience_type/audience_value structure
 * @param {Object} campaign - Campaign object with new audience structure
 * @param {Object} serviceClient - Supabase service client
 * @returns {Object} Object with recipients array and metadata
 */
async function buildAudienceFromNewStructure(campaign, serviceClient) {
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

// ============================================================================
// LEGACY EXPORTS FOR BACKWARD COMPATIBILITY
// ============================================================================

// Legacy export for backward compatibility
export const getAudienceRecipients = buildAudienceRecipients;
