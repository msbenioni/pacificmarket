import { createServiceClient } from '@/lib/server-auth';

/**
 * Shared utility to build audience recipients for email campaigns
 * Used by preview endpoint, queue endpoint, and background processor
 */

export async function getAudienceRecipients(campaign, serviceClient) {
  let emails = [];
  let subscriberData = [];

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
          .select('id, email')
          .in('email', subscriberEmails);
        
        if (subscriberProfiles && subscriberProfiles.length > 0) {
          const profileIds = subscriberProfiles.map(p => p.id);
          const { data: subscriberBusinesses } = await serviceClient
            .from('businesses')
            .select('owner_user_id, business_handle')
            .in('owner_user_id', profileIds);
          
          emails = allSubscribers.map(subscriber => {
            const profile = subscriberProfiles?.find(p => 
              p.email?.toLowerCase() === subscriber.email.toLowerCase()
            );
            const business = subscriberBusinesses?.find(b => b.owner_user_id === profile?.id);
            return {
              email: subscriber.email,
              first_name: subscriber.first_name,
              business_handle: business?.business_handle
            };
          });
        } else {
          emails = allSubscribers.map(subscriber => ({
            email: subscriber.email,
            first_name: subscriber.first_name,
            business_handle: null
          }));
        }
      } else {
        emails = [];
      }
      break;

    case 'business_owners':
      const { data: businessOwners } = await serviceClient
        .from('profiles')
        .select('id, email, display_name')
        .in('role', ['business', 'admin']);
      
      // Enrich with business handles
      if (businessOwners && businessOwners.length > 0) {
        const ownerIds = businessOwners.map(o => o.id);
        const { data: ownerBusinesses } = await serviceClient
          .from('businesses')
          .select('owner_user_id, business_handle')
          .in('owner_user_id', ownerIds);
        
        emails = businessOwners.map(owner => ({
          email: owner.email,
          first_name: owner.display_name,
          business_handle: ownerBusinesses?.find(b => b.owner_user_id === owner.id)?.business_handle
        }));
      }
      break;

    case 'mana_plan':
      const { data: manaBusinesses } = await serviceClient
        .from('businesses')
        .select('owner_user_id, business_handle')
        .eq('subscription_tier', 'mana');
      
      if (manaBusinesses && manaBusinesses.length > 0) {
        const manaOwnerIds = manaBusinesses.map(b => b.owner_user_id).filter(Boolean);
        const { data: manaOwners } = await serviceClient
          .from('profiles')
          .select('id, email, display_name')
          .in('id', manaOwnerIds);
        
        emails = manaOwners?.map(owner => {
          const business = manaBusinesses.find(b => b.owner_user_id === owner.id);
          return {
            email: owner.email,
            first_name: owner.display_name,
            business_handle: business?.business_handle
          };
        }) || [];
      }
      break;

    case 'moana_plan':
      const { data: moanaBusinesses } = await serviceClient
        .from('businesses')
        .select('owner_user_id, business_handle')
        .eq('subscription_tier', 'moana');
      
      if (moanaBusinesses && moanaBusinesses.length > 0) {
        const moanaOwnerIds = moanaBusinesses.map(b => b.owner_user_id).filter(Boolean);
        const { data: moanaOwners } = await serviceClient
          .from('profiles')
          .select('id, email, display_name')
          .in('id', moanaOwnerIds);
        
        emails = moanaOwners?.map(owner => {
          const business = moanaBusinesses.find(b => b.owner_user_id === owner.id);
          return {
            email: owner.email,
            first_name: owner.display_name,
            business_handle: business?.business_handle
          };
        }) || [];
      }
      break;

    case 'referral_participants':
      const { data: referrers } = await serviceClient
        .from('referrals')
        .select('referrer_business_id')
        .eq('status', 'approved');
      
      const referrerBusinessIds = referrers?.map(r => r.referrer_business_id).filter(Boolean);
      if (referrerBusinessIds.length > 0) {
        const { data: referrerBusinesses } = await serviceClient
          .from('businesses')
          .select('owner_user_id, business_handle')
          .in('id', referrerBusinessIds);
        
        const referrerOwnerIds = referrerBusinesses?.map(b => b.owner_user_id).filter(Boolean);
        if (referrerOwnerIds.length > 0) {
          const { data: referrerOwners } = await serviceClient
            .from('profiles')
            .select('id, email, display_name')
            .in('id', referrerOwnerIds);
          
          emails = referrerOwners?.map(owner => {
            const business = referrerBusinesses?.find(b => b.owner_user_id === owner.id);
            return {
              email: owner.email,
              first_name: owner.display_name,
              business_handle: business?.business_handle
            };
          }) || [];
        }
      }
      break;

    default:
      throw new Error(`Unsupported audience type: ${campaign.audience}`);
  }

  // Remove duplicates by email (case-insensitive)
  const uniqueEmails = new Map();
  emails.forEach(email => {
    const lowerEmail = email.email.toLowerCase();
    if (!uniqueEmails.has(lowerEmail)) {
      uniqueEmails.set(lowerEmail, email);
    }
  });

  return {
    emails: Array.from(uniqueEmails.values()),
    subscriberData,
    totalRecipients: uniqueEmails.size
  };
}
