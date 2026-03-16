import { createServiceClient } from '@/lib/server-auth';
import nodemailer from 'nodemailer';
import { extractTemplateVariables, BACKGROUND_BATCH_SIZE, BACKGROUND_BATCH_DELAY, EMAIL_SEND_DELAY } from '@/constants/emailConstants';
import { buildAudienceRecipients } from '@/lib/email/getAudienceRecipients';

const serviceClient = createServiceClient();

// Create SMTP transporter using Google Workspace
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

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

        // Check for existing recipients to avoid duplicate insert conflicts
        const { data: existingRecipients } = await serviceClient
          .from('email_campaign_recipients')
          .select('email')
          .eq('campaign_id', campaign.id);

        const existingEmailSet = new Set(
          (existingRecipients || []).map(r => r.email.toLowerCase())
        );

        // Filter out existing recipients and create records only for new ones
        const newRecipientRecords = recipients
          .filter(recipient => !existingEmailSet.has(recipient.email.toLowerCase()))
          .map((recipient) => ({
            campaign_id: campaign.id,
            subscriber_id: recipient.subscriber_id || null,
            email: recipient.email,
            status: 'pending'
          }));

        // Build email-to-record map using returned inserted rows (no ordering assumptions)
        const emailToRecordMap = new Map();
        
        if (newRecipientRecords.length === 0) {
          console.log(`All recipients already exist for campaign ${campaign.id}`);
        } else {
          // Create recipient records using service client (elevated access needed)
          const { data: insertedRecipients, error: recipientsError } = await serviceClient
            .from('email_campaign_recipients')
            .insert(newRecipientRecords)
            .select();

          if (recipientsError) {
            throw new Error(recipientsError.message || 'Failed to create recipient records');
          }

          // Populate map with newly inserted records
          insertedRecipients?.forEach(record => {
            emailToRecordMap.set(record.email.toLowerCase(), record);
          });
        }

        // Add existing recipients to map for email sending (they won't be resent)
        existingRecipients?.forEach(record => {
          emailToRecordMap.set(record.email.toLowerCase(), { 
            id: null, // No ID needed for existing records
            email: record.email 
          });
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
                  ? `https://pacificdiscoverynetwork.com/PacificBusinesses`
                  : 'https://pacificdiscoverynetwork.com/PacificBusinesses'
              };

              // Personalize email content dynamically
              let personalizedHtml = campaign.html_content;
              for (const variable of templateVariables) {
                const value = recipientData[variable] || '';
                const regex = new RegExp(`\\{\\{\\s*${variable}\\s*\\}\\}`, 'g');
                personalizedHtml = personalizedHtml.replace(regex, value);
              }

              // Send email using SMTP
              const transporter = createTransporter();
              
              const mailOptions = {
                from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
                to: recipient.email,
                subject: campaign.subject,
                html: personalizedHtml
              };

              const smtpResponse = await transporter.sendMail(mailOptions);

              // Validate SMTP response before treating as success
              if (!smtpResponse || !smtpResponse.messageId) {
                throw new Error(`SMTP error: Failed to send email to ${recipient.email}`);
              }

              // Update recipient status with provider ID
              const recipientRecord = emailToRecordMap.get(recipient.email.toLowerCase());
              if (recipientRecord && recipientRecord.id) {
                const { error: updateError } = await serviceClient
                  .from('email_campaign_recipients')
                  .update({
                    status: 'sent',
                    sent_at: new Date().toISOString(),
                    provider_message_id: smtpResponse.messageId
                  })
                  .eq('id', recipientRecord.id);

                if (updateError) {
                  console.error(`Failed to update recipient ${recipient.email} status to sent:`, updateError);
                  // Don't increment sentCount if update failed
                  continue;
                }
              } else if (!recipientRecord) {
                console.error(`No recipient record found for email ${recipient.email}`);
                failedCount++;
                continue;
              } else {
                // Existing recipient, already processed
                console.log(`Skipping already processed email ${recipient.email}`);
                continue;
              }

              sentCount++; // Only increment on successful update

              await new Promise(resolve => setTimeout(resolve, EMAIL_SEND_DELAY));

            } catch (error) {
              failedCount++;
              const recipientRecord = emailToRecordMap.get(recipient.email.toLowerCase());
              if (recipientRecord && recipientRecord.id) {
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
              } else if (!recipientRecord) {
                console.error(`No recipient record found for failed email ${recipient.email}`);
                failedCount++;
              } else {
                // Existing recipient, already processed - this shouldn't happen in error path
                console.error(`Unexpected error for already processed email ${recipient.email}:`, error);
                failedCount++;
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
          total_processed: newRecipientRecords.length
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