import { createServiceClient } from '@/lib/server-auth';
import { requireAdmin } from '@/lib/server-auth';
import { QUEUE_PRIORITY } from '@/constants/emailConstants';

// Queue email campaign for background processing
export async function POST(request) {
  try {
    // Authenticate admin and get both clients
    const auth = await requireAdmin(request);
    if (auth.error) {
      return Response.json({ error: auth.error }, { status: auth.status });
    }

    const { userClient, serviceClient } = auth;
    const { campaignId, priority = 'normal' } = await request.json();

    if (!campaignId) {
      return Response.json({ error: 'Campaign ID is required' }, { status: 400 });
    }

    // Convert string priority to numeric
    const numericPriority = priority === 'high' ? QUEUE_PRIORITY.HIGH : 
                            priority === 'low' ? QUEUE_PRIORITY.LOW : 
                            QUEUE_PRIORITY.NORMAL;

    // Validate campaign exists and is in draft status
    const { data: campaign, error: campaignError } = await serviceClient
      .from('email_campaigns')
      .select('*')
      .eq('id', campaignId)
      .single();

    if (campaignError || !campaign) {
      return Response.json({ error: 'Campaign not found' }, { status: 404 });
    }

    if (campaign.status !== 'draft') {
      return Response.json({ error: 'Campaign is not in draft status' }, { status: 400 });
    }

    // Check if campaign is already queued or processing
    const { data: existingQueueItem } = await serviceClient
      .from('email_campaign_queue')
      .select('id, status')
      .eq('campaign_id', campaignId)
      .in('status', ['queued', 'processing'])
      .single();

    if (existingQueueItem) {
      return Response.json({ 
        error: 'Campaign is already queued or processing', 
        status: 400 
      });
    }

    // Add campaign to processing queue
    const { data: queueItem, error: queueError } = await serviceClient
      .from('email_campaign_queue')
      .insert({
        campaign_id: campaignId,
        status: 'queued',
        priority: numericPriority,
        created_at: new Date().toISOString(),
        scheduled_at: new Date().toISOString()
      })
      .select()
      .single();

    if (queueError) {
      return Response.json({ error: 'Failed to queue campaign' }, { status: 500 });
    }

    // Update campaign status to queued
    await serviceClient
      .from('email_campaigns')
      .update({ status: 'queued' })
      .eq('id', campaignId);

    return Response.json({
      success: true,
      message: 'Campaign queued for sending',
      queue_item: queueItem
    });

  } catch (error) {
    console.error('Queue campaign error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Get queue status
export async function GET(request) {
  try {
    // Authenticate admin and get both clients
    const auth = await requireAdmin(request);
    if (auth.error) {
      return Response.json({ error: auth.error }, { status: auth.status });
    }

    const { serviceClient } = auth;
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('campaign_id');

    let query = serviceClient
      .from('email_campaign_queue')
      .select(`
        *,
        email_campaigns (
          name,
          subject,
          status
        )
      `)
      .order('created_at', { ascending: false });

    if (campaignId) {
      query = query.eq('campaign_id', campaignId);
    }

    const { data: queueItems, error } = await query;

    if (error) {
      return Response.json({ error: 'Failed to fetch queue status' }, { status: 500 });
    }

    // Transform data to rename campaign_status for clarity
    const transformedItems = queueItems.map(item => ({
      ...item,
      email_campaigns: item.email_campaigns ? {
        ...item.email_campaigns,
        campaign_status: item.email_campaigns.status
      } : null
    }));

    return Response.json({ queue_items: transformedItems });

  } catch (error) {
    console.error('Queue status error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
