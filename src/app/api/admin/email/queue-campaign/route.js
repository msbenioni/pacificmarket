import { requireAdmin } from '@/lib/server-auth';
import { QUEUE_PRIORITY } from '@/constants/emailConstants';

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

    // Convert string priority to numeric
    const numericPriority = priority === 'high' ? QUEUE_PRIORITY.HIGH : 
                            priority === 'low' ? QUEUE_PRIORITY.LOW : 
                            QUEUE_PRIORITY.NORMAL;

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
      // Handle unique constraint violation (race condition protection)
      if (queueError.code === '23505' || queueError.message?.includes('duplicate key')) {
        return Response.json({ 
          error: 'Campaign is already queued or processing (race condition detected)', 
          status: 400 
        });
      }
      
      console.error('Queue insertion error:', queueError);
      return Response.json({ 
        error: 'Failed to queue campaign', 
        details: queueError.message 
      }, { status: 500 });
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
