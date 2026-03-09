import { createServiceClient } from '@/lib/server-auth';
import { Resend } from 'resend';

const serviceClient = createServiceClient();
const resend = new Resend(process.env.RESEND_API_KEY);

// Background email processor - designed to be run by cron job
export async function POST(request) {
  try {
    const { limit = 10 } = await request.json();

    // Get next batch of queued campaigns
    const { data: queueItems, error: queueError } = await serviceClient
      .from('email_campaign_queue')
      .select('*')
      .eq('status', 'queued')
      .order('priority', { ascending: false }) // High priority first
      .order('created_at', { ascending: true })
      .limit(limit);

    if (queueError) {
      return Response.json({ error: 'Failed to fetch queue items' }, { status: 500 });
    }

    if (!queueItems || queueItems.length === 0) {
      return Response.json({ message: 'No campaigns in queue' });
    }

    const results = [];

    // Process each queued campaign
    for (const queueItem of queueItems) {
      try {
        // Mark as processing
        await serviceClient
          .from('email_campaign_queue')
          .update({ status: 'processing', started_at: new Date().toISOString() })
          .eq('id', queueItem.id);

        // Get campaign details
        const { data: campaign, error: campaignError } = await serviceClient
          .from('email_campaigns')
          .select('*')
          .eq('id', queueItem.campaign_id)
          .single();

        if (campaignError || !campaign) {
          throw new Error('Campaign not found');
        }

        // Update campaign status
        await serviceClient
          .from('email_campaigns')
          .update({ status: 'sending' })
          .eq('id', queueItem.campaign_id);

        // Get audience emails (reuse existing logic)
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
                  const profile = subscriberProfiles?.find(p => p.email === subscriber.email);
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

          // Add other audience types as needed...
          default:
            throw new Error(`Unsupported audience type: ${campaign.audience}`);
        }

        // Deduplicate emails
        const uniqueEmails = Array.from(
          new Map(
            emails
              .filter(e => e.email)
              .map(e => [e.email.toLowerCase(), { ...e, email: e.email.toLowerCase() }])
          ).values()
        );

        if (uniqueEmails.length === 0) {
          throw new Error('No valid subscribers found');
        }

        // Create recipient records
        const recipientRecords = uniqueEmails.map(email => ({
          campaign_id: campaign.id,
          email: email.email,
          status: 'pending'
        }));

        const { error: recipientsError } = await serviceClient
          .from('email_campaign_recipients')
          .insert(recipientRecords);

        if (recipientsError) {
          throw new Error('Failed to create recipient records');
        }

        // Send emails (smaller batches for background processing)
        const batchSize = 25;
        let sentCount = 0;
        let failedCount = 0;

        for (let i = 0; i < uniqueEmails.length; i += batchSize) {
          const batch = uniqueEmails.slice(i, i + batchSize);
          
          for (const recipient of batch) {
            try {
              let personalizedHtml = campaign.html_content;
              personalizedHtml = personalizedHtml.replace(/\{\{first_name\}\}/g, recipient.first_name || 'Business Owner');
              personalizedHtml = personalizedHtml.replace(/\{\{email\}\}/g, recipient.email);
              
              if (personalizedHtml.includes('{{referral_link}}')) {
                const referralLink = recipient.business_handle 
                  ? `https://www.pacificmarket.co.nz/register/${recipient.business_handle}`
                  : 'https://www.pacificmarket.co.nz';
                
                personalizedHtml = personalizedHtml.replace(/\{\{referral_link\}\}/g, referralLink);
              }

              const { data, error } = await resend.emails.send({
                from: 'Pacific Market <hello@pacificmarket.co.nz>',
                to: recipient.email,
                subject: campaign.subject,
                html: personalizedHtml
              });

              if (error) {
                failedCount++;
                await serviceClient
                  .from('email_campaign_recipients')
                  .update({ status: 'failed' })
                  .eq('campaign_id', campaign.id)
                  .eq('email', recipient.email);
              } else {
                sentCount++;
                await serviceClient
                  .from('email_campaign_recipients')
                  .update({ status: 'sent', sent_at: new Date().toISOString() })
                  .eq('campaign_id', campaign.id)
                  .eq('email', recipient.email);
              }

              await new Promise(resolve => setTimeout(resolve, 200));

            } catch (error) {
              failedCount++;
              await serviceClient
                .from('email_campaign_recipients')
                .update({ status: 'failed' })
                .eq('campaign_id', campaign.id)
                .eq('email', recipient.email);
            }
          }

          await new Promise(resolve => setTimeout(resolve, 2000));
        }

        // Update final campaign status
        let finalStatus;
        if (sentCount === 0) {
          finalStatus = 'failed';
        } else if (failedCount > 0) {
          finalStatus = 'sent_with_errors';
        } else {
          finalStatus = 'sent';
        }

        await serviceClient
          .from('email_campaigns')
          .update({ 
            status: finalStatus,
            sent_at: new Date().toISOString()
          })
          .eq('id', queueItem.campaign_id);

        // Mark queue item as completed
        await serviceClient
          .from('email_campaign_queue')
          .update({ 
            status: 'completed',
            completed_at: new Date().toISOString(),
            sent_count: sentCount,
            failed_count: failedCount
          })
          .eq('id', queueItem.id);

        results.push({
          queue_item_id: queueItem.id,
          campaign_id: queueItem.campaign_id,
          status: finalStatus,
          sent_count: sentCount,
          failed_count: failedCount,
          total_processed: uniqueEmails.length
        });

      } catch (error) {
        console.error(`Failed to process queue item ${queueItem.id}:`, error);
        
        // Mark as failed
        await serviceClient
          .from('email_campaign_queue')
          .update({ 
            status: 'failed',
            error_message: error.message,
            completed_at: new Date().toISOString()
          })
          .eq('id', queueItem.id);

        // Update campaign status
        await serviceClient
          .from('email_campaigns')
          .update({ status: 'failed' })
          .eq('id', queueItem.campaign_id);

        results.push({
          queue_item_id: queueItem.id,
          campaign_id: queueItem.campaign_id,
          status: 'failed',
          error: error.message
        });
      }
    }

    return Response.json({
      success: true,
      message: `Processed ${queueItems.length} campaigns`,
      results
    });

  } catch (error) {
    console.error('Background processor error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
