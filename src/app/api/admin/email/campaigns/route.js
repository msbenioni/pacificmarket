import { requireAdmin } from '@/lib/server-auth';
import { validateAudienceStructure } from '@/lib/email/audience';
import nodemailer from 'nodemailer';

// Helper for consistent error logging and responses
const handleSupabaseError = (error, operation, context = {}) => {
  const errorDetails = {
    operation,
    error: error.message,
    details: error.details,
    hint: error.hint,
    code: error.code,
    ...context
  };
  
  console.error(`Failed to ${operation}:`, errorDetails);
  
  return {
    error: `Failed to ${operation}`,
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  };
};

// Create SMTP transporter using Google Workspace
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587, // Safely default to 587
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export async function GET(request) {
  try {
    // Authenticate admin and get all needed clients
    const auth = await requireAdmin(request);
    if (auth.error) {
      return Response.json({ error: auth.error }, { status: auth.status });
    }

    const { serviceClient } = auth;

    // Fetch campaigns using service client (bypasses RLS temporarily)
    const { data: campaigns, error } = await serviceClient
      .from('email_campaigns')
      .select(`
        *,
        email_campaign_recipients (
          id,
          status,
          opened_at,
          clicked_at
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      const errorResponse = handleSupabaseError(error, 'fetch campaigns');
      return Response.json(errorResponse, { status: 500 });
    }

    // Calculate stats for each campaign
    const campaignsWithStats = campaigns.map(campaign => ({
      ...campaign,
      recipients: campaign.email_campaign_recipients?.length || 0,
      opens: campaign.email_campaign_recipients?.filter(r => r.opened_at).length || 0,
      clicks: campaign.email_campaign_recipients?.filter(r => r.clicked_at).length || 0,
      open_rate: campaign.email_campaign_recipients?.length > 0 
        ? Math.round((campaign.email_campaign_recipients?.filter(r => r.opened_at).length / campaign.email_campaign_recipients?.length) * 100)
        : 0
    }));

    return Response.json({ campaigns: campaignsWithStats });

  } catch (error) {
    console.error('Campaigns API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    // Authenticate admin and get all needed clients
    const auth = await requireAdmin(request);
    if (auth.error) {
      return Response.json({ error: auth.error }, { status: auth.status });
    }

    const { user, serviceClient } = auth;
    const { name, subject, html_content, audience_type, audience_value, testEmail } = await request.json();

    // Validate required fields
    if (!name || !subject || !html_content) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate audience structure
    const validation = validateAudienceStructure({ audience_type, audience_value });
    if (!validation.valid) {
      return Response.json({ error: validation.error }, { status: 400 });
    }

    if (testEmail) {
      // Send test email using SMTP
      try {
        const transporter = createTransporter();
        
        const mailOptions = {
          from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
          to: testEmail,
          subject: `[TEST] ${subject}`,
          html: html_content
        };

        const info = await transporter.sendMail(mailOptions);

        return Response.json({ 
          success: true, 
          message: 'Test email sent successfully',
          data: { messageId: info.messageId }
        });

      } catch (error) {
        console.error('Test email error:', error);
        return Response.json({ error: 'Failed to send test email' }, { status: 500 });
      }
    } else {
      // Create campaign using service client
      const campaignData = {
        name,
        subject, 
        html_content,
        audience_type,
        audience_value,
        created_by: user.id
      };

      const { data: campaign, error } = await serviceClient
        .from('email_campaigns')
        .insert(campaignData)
        .select()
        .single();

      if (error) {
        const errorResponse = handleSupabaseError(error, 'create campaign', { campaignData });
        return Response.json(errorResponse, { status: 500 });
      }

      return Response.json({ 
        success: true, 
        campaign,
        message: 'Campaign created successfully'
      });
    }

  } catch (error) {
    console.error('Create campaign error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
