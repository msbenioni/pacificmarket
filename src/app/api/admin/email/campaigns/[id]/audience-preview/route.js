import { requireAdmin } from '@/lib/server-auth';

export async function GET(request, { params }) {
  try {
    // Authenticate admin and get both clients
    const auth = await requireAdmin(request);
    if (auth.error) {
      return Response.json({ error: auth.error }, { status: auth.status });
    }

    const { userClient, serviceClient } = auth;
    const campaignId = params.id;

    if (!campaignId) {
      return Response.json({ error: 'Campaign ID is required' }, { status: 400 });
    }

    // Fetch campaign details using user client (respects RLS)
    const { data: campaign, error: campaignError } = await userClient
      .from('email_campaigns')
      .select('name, audience, subject')
      .eq('id', campaignId)
      .single();

    if (campaignError || !campaign) {
      return Response.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // Get audience emails based on campaign audience using service client
    let emails = [];
    
    switch (campaign.audience) {
      case 'all':
        const { data: allSubscribers } = await serviceClient
          .from('email_subscribers')
          .select('email, first_name')
          .eq('status', 'subscribed');
        
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
        return Response.json({ error: 'Invalid audience' }, { status: 400 });
    }

    // Remove duplicates by email (case-insensitive)
    const uniqueEmails = Array.from(
      new Map(
        emails
          .filter(e => e.email)
          .map(e => [e.email.toLowerCase(), { ...e, email: e.email.toLowerCase() }])
      ).values()
    );

    // Get sample emails for preview
    const sampleEmails = uniqueEmails.slice(0, 10).map(e => ({
      email: e.email,
      first_name: e.first_name,
      business_handle: e.business_handle
    }));

    // Audience labels
    const audienceLabels = {
      'all': 'All Subscribers',
      'business_owners': 'Business Owners',
      'mana_plan': 'Mana Plan Members',
      'moana_plan': 'Moana Plan Members',
      'referral_participants': 'Referral Participants'
    };

    return Response.json({
      success: true,
      campaign: {
        id: campaignId,
        name: campaign.name,
        audience: campaign.audience,
        audience_label: audienceLabels[campaign.audience] || campaign.audience,
        subject: campaign.subject
      },
      audience_preview: {
        total_raw: emails.length,
        total_unique: uniqueEmails.length,
        duplicates_removed: emails.length - uniqueEmails.length,
        sample_emails: sampleEmails,
        estimated_recipients: uniqueEmails.length
      }
    });

  } catch (error) {
    console.error('Audience preview error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
