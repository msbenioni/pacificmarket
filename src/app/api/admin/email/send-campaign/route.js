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
    const { campaignId, priority = 'normal', allSubscribers } = await request.json();

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

    // Check if campaign is in draft status
    if (campaign.status !== 'draft') {
      return Response.json({ error: 'Campaign already sent or queued' }, { status: 400 });
    }

    let emails = [];

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

    // Add campaign to processing queue
    const { data: queueItem, error: queueError } = await serviceClient
      .from('email_campaign_queue')
      .insert({
        campaign_id: campaignId,
        status: 'queued',
        priority: priority,
        created_at: new Date().toISOString(),
        scheduled_at: new Date().toISOString()
      })
      .select()
      .single();

    if (queueError) {
      return Response.json({ error: 'Failed to queue campaign' }, { status: 500 });
    }

    // Update campaign status to queued
    await userClient
      .from('email_campaigns')
      .update({ status: 'queued' })
      .eq('id', campaignId);

    return Response.json({
      success: true,
      message: 'Campaign queued for sending',
      queue_item: queueItem,
      campaign_status: 'queued'
    });

  } catch (error) {
    console.error('Queue campaign error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
