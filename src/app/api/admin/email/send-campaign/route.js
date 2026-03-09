import { Resend } from 'resend';
import { requireAdmin } from '@/lib/server-auth';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    // Authenticate admin and get both clients
    const auth = await requireAdmin(request);
    if (auth.error) {
      return Response.json({ error: auth.error }, { status: auth.status });
    }

    const { userClient, serviceClient } = auth;
    const { campaignId } = await request.json();

    if (!campaignId) {
      return Response.json({ error: 'Campaign ID required' }, { status: 400 });
    }

    // Fetch campaign details using user client (respects RLS)
    const { data: campaign, error: campaignError } = await userClient
      .from('email_campaigns')
      .select('*')
      .eq('id', campaignId)
      .single();

    if (campaignError || !campaign) {
      return Response.json({ error: 'Campaign not found' }, { status: 404 });
    }

    if (campaign.status !== 'draft') {
      return Response.json({ error: 'Campaign already sent' }, { status: 400 });
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
            .select('id')
            .in('email', subscriberEmails);
          
          if (subscriberProfiles && subscriberProfiles.length > 0) {
            const profileIds = subscriberProfiles.map(p => p.id);
            const { data: subscriberBusinesses } = await serviceClient
              .from('businesses')
              .select('owner_user_id, business_handle')
              .in('owner_user_id', profileIds);
            
            emails = allSubscribers.map(subscriber => {
              const profile = subscriberProfiles?.find(p => 
                allSubscribers.find(s => s.email === subscriber.email)?.email === subscriber.email
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
        } else {
          emails = [];
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
        } else {
          emails = [];
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
        } else {
          emails = [];
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
            
            // Combine with business handles for personalization
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

    if (emails.length === 0) {
      return Response.json({ error: 'No subscribers found for this audience' }, { status: 400 });
    }

    // Remove duplicates by email (case-insensitive)
    const uniqueEmails = Array.from(
      new Map(
        emails
          .filter(e => e.email)
          .map(e => [e.email.toLowerCase(), { ...e, email: e.email.toLowerCase() }])
      ).values()
    );

    if (uniqueEmails.length === 0) {
      return Response.json({ error: 'No valid subscribers found after deduplication' }, { status: 400 });
    }

    console.log(`Found ${emails.length} total emails, deduplicated to ${uniqueEmails.length} unique emails`);

    // Update campaign status to sending using user client
    await userClient
      .from('email_campaigns')
      .update({ status: 'sending' })
      .eq('id', campaignId);

    // Create recipient records using service client (elevated access needed)
    const recipientRecords = uniqueEmails.map(email => ({
      campaign_id: campaignId,
      email: email.email,
      status: 'pending'
    }));

    const { error: recipientsError } = await serviceClient
      .from('email_campaign_recipients')
      .insert(recipientRecords);

    if (recipientsError) {
      await userClient
        .from('email_campaigns')
        .update({ status: 'draft' })
        .eq('id', campaignId);
      
      return Response.json({ error: 'Failed to create recipient records' }, { status: 500 });
    }

    // Send emails (process in batches to avoid rate limits)
    const batchSize = 50;
    let sentCount = 0;
    let failedCount = 0;

    for (let i = 0; i < uniqueEmails.length; i += batchSize) {
      const batch = uniqueEmails.slice(i, i + batchSize);
      
      for (const recipient of batch) {
        try {
          // Personalize email content
          let personalizedHtml = campaign.html_content;
          personalizedHtml = personalizedHtml.replace(/\{\{first_name\}\}/g, recipient.first_name || 'Business Owner');
          personalizedHtml = personalizedHtml.replace(/\{\{email\}\}/g, recipient.email);
          
          // Add referral link if template requires it
          if (personalizedHtml.includes('{{referral_link}}')) {
            const referralLink = recipient.business_handle 
              ? `https://www.pacificmarket.co.nz/register/${recipient.business_handle}`
              : 'https://www.pacificmarket.co.nz';
            
            personalizedHtml = personalizedHtml.replace(/\{\{referral_link\}\}/g, referralLink);
          }

          // Send email via Resend
          const { data, error } = await resend.emails.send({
            from: 'Pacific Market <hello@pacificmarket.co.nz>',
            to: recipient.email,
            subject: campaign.subject,
            html: personalizedHtml
          });

          if (error) {
            console.error(`Failed to send to ${recipient.email}:`, error);
            failedCount++;
            
            // Update recipient status to failed
            await serviceClient
              .from('email_campaign_recipients')
              .update({ status: 'failed' })
              .eq('campaign_id', campaignId)
              .eq('email', recipient.email);
          } else {
            sentCount++;
            
            // Update recipient status to sent
            await serviceClient
              .from('email_campaign_recipients')
              .update({ status: 'sent', sent_at: new Date().toISOString() })
              .eq('campaign_id', campaignId)
              .eq('email', recipient.email);
          }

          // Add delay between emails to avoid rate limits
          await new Promise(resolve => setTimeout(resolve, 100));

        } catch (error) {
          console.error(`Error sending to ${recipient.email}:`, error);
          failedCount++;
          
          // Update recipient status to failed
          await serviceClient
            .from('email_campaign_recipients')
            .update({ status: 'failed' })
            .eq('campaign_id', campaignId)
            .eq('email', recipient.email);
        }
      }

      // Add delay between batches
      if (i + batchSize < uniqueEmails.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Update campaign status using user client
    let finalStatus;
    if (sentCount === 0) {
      finalStatus = 'failed';
    } else if (failedCount > 0) {
      finalStatus = 'sent_with_errors';
    } else {
      finalStatus = 'sent';
    }

    await userClient
      .from('email_campaigns')
      .update({ 
        status: finalStatus,
        sent_at: new Date().toISOString()
      })
      .eq('id', campaignId);

    const statusMessage = {
      'sent': 'Campaign sent successfully!',
      'sent_with_errors': 'Campaign sent with some errors',
      'failed': 'Campaign failed to send'
    };

    return Response.json({
      success: true,
      message: `${statusMessage[finalStatus]} ${sentCount} emails sent, ${failedCount} failed.`,
      stats: {
        total: uniqueEmails.length,
        sent: sentCount,
        failed: failedCount,
        duplicates_removed: emails.length - uniqueEmails.length,
        status: finalStatus
      }
    });

  } catch (error) {
    console.error('Send campaign error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
