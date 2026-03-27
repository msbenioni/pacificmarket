import { requireAdmin } from '@/lib/server-auth';
import { QUEUE_PRIORITY } from '@/constants/emailConstants';
import { createServiceClient } from '@/lib/server-auth';
import nodemailer from 'nodemailer';
import { extractTemplateVariables, EMAIL_SEND_DELAY } from '@/constants/emailConstants';
import { buildAudienceRecipients } from '@/lib/email/audience';

export async function POST(request) {
  try {
    // Authenticate admin and get both clients
    const auth = await requireAdmin(request);
    if (auth.error) {
      return Response.json({ error: auth.error }, { status: auth.status });
    }

    const { userClient } = auth;
    const { campaignId } = await request.json();

    if (!campaignId) {
      return Response.json({ error: 'Campaign ID required' }, { status: 400 });
    }

    // Fetch campaign details using userClient (RLS policy grants admin access)
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

    // Update campaign status to sending immediately
    const { error: sendingError } = await userClient
      .from('email_campaigns')
      .update({ status: 'sending' })
      .eq('id', campaignId);

    if (sendingError) {
      return Response.json({ error: 'Failed to update campaign status' }, { status: 500 });
    }

    // Process campaign immediately
    const serviceClient = createServiceClient();
    
    try {
      // Build audience recipients using centralized utility
      const { recipients } = await buildAudienceRecipients(campaign, serviceClient);

      if (!recipients || recipients.length === 0) {
        await userClient
          .from('email_campaigns')
          .update({ status: 'failed' })
          .eq('id', campaignId);
        
        return Response.json({ error: 'No valid recipients found' }, { status: 400 });
      }

      // Create recipient records
      const recipientRecords = recipients.map(recipient => ({
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
        await userClient
          .from('email_campaigns')
          .update({ status: 'failed' })
          .eq('id', campaignId);
        
        return Response.json({ error: 'Failed to create recipient records' }, { status: 500 });
      }

      // Create email-to-record map
      const emailToRecordMap = new Map();
      insertedRecipients?.forEach(record => {
        emailToRecordMap.set(record.email.toLowerCase(), record);
      });

      // Extract template variables once per campaign
      const templateVariables = extractTemplateVariables(campaign.html_content);

      // Create SMTP transporter
      const createTransporter = () => {
        return nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });
      };

      const transporter = createTransporter();
      let sentCount = 0;
      let failedCount = 0;

      // Send emails to all recipients
      for (const recipient of recipients) {
        try {
          // Create recipient data for personalization
          const recipientData = {
            first_name: recipient.first_name || 'Business Owner',
            email: recipient.email,
            referral_link: recipient.business_handle 
              ? 'https://pacificdiscoverynetwork.com/PacificBusinesses'
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
          const mailOptions = {
            from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
            to: recipient.email,
            subject: campaign.subject,
            html: personalizedHtml
          };

          const smtpResponse = await transporter.sendMail(mailOptions);

          // Validate SMTP response
          if (!smtpResponse || !smtpResponse.messageId) {
            throw new Error(`SMTP error: Failed to send email to ${recipient.email}`);
          }

          // Update recipient status
          const recipientRecord = emailToRecordMap.get(recipient.email.toLowerCase());
          if (recipientRecord) {
            await serviceClient
              .from('email_campaign_recipients')
              .update({
                status: 'sent',
                sent_at: new Date().toISOString(),
                provider_message_id: smtpResponse.messageId
              })
              .eq('id', recipientRecord.id);
          }

          sentCount++;

          // Small delay between emails to avoid overwhelming SMTP server
          await new Promise(resolve => setTimeout(resolve, EMAIL_SEND_DELAY));

        } catch (error) {
          failedCount++;
          const recipientRecord = emailToRecordMap.get(recipient.email.toLowerCase());
          if (recipientRecord) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to send email';
            
            await serviceClient
              .from('email_campaign_recipients')
              .update({ 
                status: 'failed',
                error_message: errorMessage
              })
              .eq('id', recipientRecord.id);
          }
          
          console.error(`Failed to send email to ${recipient.email}:`, error);
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

      await userClient
        .from('email_campaigns')
        .update({ 
          status: finalStatus,
          sent_at: new Date().toISOString()
        })
        .eq('id', campaignId);

      return Response.json({
        success: true,
        message: `Campaign sent successfully! ${sentCount} emails delivered, ${failedCount} failed`,
        campaign_status: finalStatus,
        sent_count: sentCount,
        failed_count: failedCount,
        total_recipients: recipients.length
      });

    } catch (processingError) {
      console.error('Campaign processing error:', processingError);
      
      // Mark campaign as failed
      await userClient
        .from('email_campaigns')
        .update({ status: 'failed' })
        .eq('id', campaignId);
      
      return Response.json({ 
        error: 'Failed to send campaign: ' + (processingError instanceof Error ? processingError.message : 'Unknown error')
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Queue campaign error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
