import { createServiceClient } from '@/lib/server-auth';
import { Resend } from 'resend';
import { extractTemplateVariables, BACKGROUND_BATCH_SIZE, BACKGROUND_BATCH_DELAY, EMAIL_SEND_DELAY } from '@/constants/emailConstants';
import { buildAudienceRecipients } from '@/lib/email/getAudienceRecipients';

const serviceClient = createServiceClient();
const resend = new Resend(process.env.RESEND_API_KEY);

// Background email processor - designed to be run by cron job
export async function POST(request) {
  try {
    // Verify internal secret for security
    const authHeader = request.headers.get('Authorization');
    const cronSecret = process.env.CRON_SECRET || process.env.INTERNAL_API_SECRET;
    
    if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] !== cronSecret) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Handle empty body safely for cron requests
    let limit = 10;
    try {
      const body = await request.json();
      limit = body?.limit ?? 10;
    } catch {
      // No body provided, use default limit
      limit = 10;
    }

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
        // Claim the queue item defensively (only if still queued)
        const { data: claimed, error: claimError } = await serviceClient
          .from('email_campaign_queue')
          .update({ 
            status: 'processing', 
            started_at: new Date().toISOString() 
          })
          .eq('id', queueItem.id)
          .eq('status', 'queued')
          .select()
          .maybeSingle();

        if (claimError || !claimed) {
          console.log(`Queue item ${queueItem.id} was not claimed (likely processed by another worker)`);
          continue; // Skip to next queue item
        }

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
        const { error: sendingError } = await serviceClient
          .from('email_campaigns')
          .update({ status: 'sending' })
          .eq('id', queueItem.campaign_id);

        if (sendingError) {
          throw new Error('Failed to mark campaign as sending');
        }

        // Build audience recipients using centralized utility
        const { recipients } = await buildAudienceRecipients(campaign, serviceClient);

        if (!recipients || recipients.length === 0) {
          throw new Error('No valid recipients found');
        }

        // Create recipient records using service client (elevated access needed)
        const recipientRecords = recipients.map((recipient) => ({
          campaign_id: campaign.id,
          subscriber_id: recipient.subscriber_id || null,
          email: recipient.email,
          status: 'pending'
        }));

        const { data: insertedRecipients, error: recipientsError } = await serviceClient
          .from('email_campaign_recipients')
          .insert(recipientRecords)
          .select();

        if (recipientsError) {
          throw new Error(recipientsError.message || 'Failed to create recipient records');
        }

        // Build email-to-record map using returned inserted rows (no ordering assumptions)
        const emailToRecordMap = new Map();
        insertedRecipients?.forEach(record => {
          emailToRecordMap.set(record.email.toLowerCase(), record);
        });

        // Extract template variables once per campaign
        const templateVariables = extractTemplateVariables(campaign.html_content);

        // Send emails (smaller batches for background processing)
        const batchSize = BACKGROUND_BATCH_SIZE;
        let sentCount = 0;
        let failedCount = 0;

        for (let i = 0; i < recipients.length; i += batchSize) {
          const batch = recipients.slice(i, i + batchSize);
          
          for (const recipient of batch) {
            try {
              // Create recipient data for personalization
              const recipientData = {
                first_name: recipient.first_name || 'Business Owner',
                email: recipient.email,
                referral_link: recipient.business_handle 
                  ? `https://www.pacificmarket.co.nz/register/${recipient.business_handle}`
                  : 'https://www.pacificmarket.co.nz'
              };

              // Personalize email content dynamically
              let personalizedHtml = campaign.html_content;
              for (const variable of templateVariables) {
                const value = recipientData[variable] || '';
                const regex = new RegExp(`\\{\\{\\s*${variable}\\s*\\}\\}`, 'g');
                personalizedHtml = personalizedHtml.replace(regex, value);
              }

              // Send email using Resend
              const resendResponse = await resend.emails.send({
                from: 'Pacific Market <team@pacificmarket.co.nz>',
                to: recipient.email,
                subject: campaign.subject,
                html: personalizedHtml
              });

              // Validate Resend response before treating as success
              if (!resendResponse || resendResponse.error) {
                throw new Error(`Resend API error: ${resendResponse?.error?.message || 'Unknown error'}`);
              }

              // Update recipient status with provider ID
              const recipientRecord = emailToRecordMap.get(recipient.email.toLowerCase());
              if (recipientRecord) {
                const { error: updateError } = await serviceClient
                  .from('email_campaign_recipients')
                  .update({
                    status: 'sent',
                    sent_at: new Date().toISOString(),
                    provider_message_id: resendResponse.data?.id
                  })
                  .eq('id', recipientRecord.id);

                if (updateError) {
                  console.error(`Failed to update recipient ${recipient.email} status to sent:`, updateError);
                  // Don't increment sentCount if update failed
                  continue;
                }
              } else {
                console.error(`No recipient record found for email ${recipient.email}`);
                failedCount++;
                continue;
              }

              sentCount++; // Only increment on successful update

              await new Promise(resolve => setTimeout(resolve, EMAIL_SEND_DELAY));

            } catch (error) {
              failedCount++;
              const recipientRecord = emailToRecordMap.get(recipient.email.toLowerCase());
              if (recipientRecord) {
                // Defensive error message handling
                const errorMessage = error instanceof Error ? error.message : 'Failed to send email';
                
                const { error: updateError } = await serviceClient
                  .from('email_campaign_recipients')
                  .update({ 
                    status: 'failed',
                    error_message: errorMessage
                  })
                  .eq('id', recipientRecord.id);

                if (updateError) {
                  console.error(`Failed to update recipient ${recipient.email} status to failed:`, updateError);
                }
              } else {
                console.error(`No recipient record found for failed email ${recipient.email}`);
              }
              
              // Log detailed error for debugging
              console.error(`Failed to send email to ${recipient.email}:`, {
                error: error instanceof Error ? error.message : 'Unknown error',
                recipient: recipient.email,
                campaign: campaign.id
              });
            }
          }

          // Only delay between batches, not after the final batch
          if (i + batchSize < recipients.length) {
            await new Promise(resolve => setTimeout(resolve, BACKGROUND_BATCH_DELAY));
          }
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

        const { error: finalStatusError } = await serviceClient
          .from('email_campaigns')
          .update({ 
            status: finalStatus,
            sent_at: new Date().toISOString()
          })
          .eq('id', queueItem.campaign_id);

        if (finalStatusError) {
          throw new Error('Failed to update final campaign status');
        }

        // Mark queue item as completed (defensive update)
        const { data: completed, error: completeError } = await serviceClient
          .from('email_campaign_queue')
          .update({ 
            status: 'completed',
            completed_at: new Date().toISOString(),
            sent_count: sentCount,
            failed_count: failedCount
          })
          .eq('id', queueItem.id)
          .eq('status', 'processing')
          .select()
          .maybeSingle();

        if (completeError || !completed) {
          console.log(`Queue item ${queueItem.id} completion update failed (may have been claimed by another worker)`);
        }

        results.push({
          queue_item_id: queueItem.id,
          campaign_id: queueItem.campaign_id,
          status: finalStatus,
          sent_count: sentCount,
          failed_count: failedCount,
          total_processed: recipients.length
        });
      } catch (error) {
        console.error(`Failed to process queue item ${queueItem.id}:`, error);
        
        // Defensive error message handling
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        // Mark as failed (defensive update)
        const { data: failed, error: failedError } = await serviceClient
          .from('email_campaign_queue')
          .update({ 
            status: 'failed',
            error_message: errorMessage,
            completed_at: new Date().toISOString()
          })
          .eq('id', queueItem.id)
          .eq('status', 'processing')
          .select()
          .maybeSingle();

        if (failedError || !failed) {
          console.error(`Queue item ${queueItem.id} failed update failed (may have been claimed by another worker)`);
        }

        // Update campaign status
        const { error: campaignFailedError } = await serviceClient
          .from('email_campaigns')
          .update({ status: 'failed' })
          .eq('id', queueItem.campaign_id);

        if (campaignFailedError) {
          console.error(`Failed to mark campaign ${queueItem.campaign_id} as failed`, campaignFailedError);
        }

        results.push({
          queue_item_id: queueItem.id,
          campaign_id: queueItem.campaign_id,
          status: 'failed',
          error: errorMessage
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