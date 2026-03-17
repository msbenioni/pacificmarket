import { createServiceClient } from '@/lib/server-auth';

/**
 * Centralized audience building utility for email campaigns
 * Used by preview endpoint, queue endpoint, and background processor
 * 
 * Returns normalized array of recipients with consistent structure
 */

export async function buildAudienceRecipients(campaign, serviceClient) {
  let rawEmails = [];
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
      const { data: manaBusinesses } = await serviceClient
        .from('businesses')
        .select('owner_user_id, business_handle')
        .eq('subscription_tier', 'mana');
      
      if (manaBusinesses && manaBusinesses.length > 0) {
        const manaOwnerIds = manaBusinesses.map(b => b.owner_user_id).filter(Boolean);
        const { data: manaOwners } = await serviceClient
          .from('profiles')
          .select('id, private_email, display_name')
          .in('id', manaOwnerIds);
        
        // Get subscriber data for mana plan owners
        const manaEmails = manaOwners?.map(o => o.private_email) || [];
        const { data: manaSubscribers } = await serviceClient
          .from('email_subscribers')
          .select('id, email, first_name')
          .in('email', manaEmails)
          .eq('status', 'subscribed');
        
        subscriberData = manaSubscribers || [];
        
        rawEmails = manaOwners?.map(owner => {
          const business = manaBusinesses.find(b => b.owner_user_id === owner.id);
          const subscriber = manaSubscribers?.find(s => 
            s.email?.toLowerCase() === owner.private_email?.toLowerCase()
          );
          return {
            email: owner.private_email,
            first_name: owner.display_name,
            business_handle: business?.business_handle,
            subscriber_id: subscriber?.id || null
          };
        }).filter(recipient => recipient.email && recipient.subscriber_id) || [];
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
          .select('id, private_email, display_name')
          .in('id', moanaOwnerIds);
        
        // Get subscriber data for moana plan owners
        const moanaEmails = moanaOwners?.map(o => o.private_email) || [];
        const { data: moanaSubscribers } = await serviceClient
          .from('email_subscribers')
          .select('id, email, first_name')
          .in('email', moanaEmails)
          .eq('status', 'subscribed');
        
        subscriberData = moanaSubscribers || [];
        
        rawEmails = moanaOwners?.map(owner => {
          const business = moanaBusinesses.find(b => b.owner_user_id === owner.id);
          const subscriber = moanaSubscribers?.find(s => 
            s.email?.toLowerCase() === owner.private_email?.toLowerCase()
          );
          return {
            email: owner.private_email,
            first_name: owner.display_name,
            business_handle: business?.business_handle,
            subscriber_id: subscriber?.id || null
          };
        }).filter(recipient => recipient.email && recipient.subscriber_id) || [];
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
            .select('id, private_email, display_name')
            .in('id', referrerOwnerIds);
          
          // Get subscriber data for referrers
          const referrerEmails = referrerOwners?.map(o => o.private_email) || [];
          const { data: referrerSubscribers } = await serviceClient
            .from('email_subscribers')
            .select('id, email, first_name')
            .in('email', referrerEmails)
            .eq('status', 'subscribed');
          
          subscriberData = referrerSubscribers || [];
          
          rawEmails = referrerOwners?.map(owner => {
            const business = referrerBusinesses?.find(b => b.owner_user_id === owner.id);
            const subscriber = referrerSubscribers?.find(s => 
              s.email?.toLowerCase() === owner.private_email?.toLowerCase()
            );
            return {
              email: owner.private_email,
              first_name: owner.display_name,
              business_handle: business?.business_handle,
              subscriber_id: subscriber?.id || null
            };
          }).filter(recipient => recipient.email && recipient.subscriber_id) || [];
        }
      }
      break;

    default:
      throw new Error(`Unsupported audience type: ${campaign.audience}`);
  }

  // Remove duplicates by email (case-insensitive) and normalize structure
  const uniqueEmails = new Map();
  rawEmails.forEach(email => {
    const lowerEmail = email.email.toLowerCase();
    if (!uniqueEmails.has(lowerEmail)) {
      uniqueEmails.set(lowerEmail, {
        email: email.email,
        first_name: email.first_name || '',
        business_handle: email.business_handle || null,
        subscriber_id: email.subscriber_id
      });
    }
  });

  const normalizedRecipients = Array.from(uniqueEmails.values());

  return {
    rawCount: rawEmails.length,
    recipients: normalizedRecipients,
    subscriberData,
    totalRecipients: normalizedRecipients.length
  };
}

// Legacy export for backward compatibility
export const getAudienceRecipients = buildAudienceRecipients;
