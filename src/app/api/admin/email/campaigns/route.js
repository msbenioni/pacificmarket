import { requireAdmin } from '@/lib/server-auth';
import nodemailer from 'nodemailer';

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

export async function GET(request) {
  try {
    // Authenticate admin and get all needed clients
    const auth = await requireAdmin(request);
    if (auth.error) {
      return Response.json({ error: auth.error }, { status: auth.status });
    }

    const { userClient } = auth;

    // Fetch campaigns using user client (respects RLS)
    const { data: campaigns, error } = await userClient
      .from('email_campaigns')
      .select(`
        *,
        email_campaign_recipients (
          id,
          status,
          opened,
          clicked
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      return Response.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
    }

    // Calculate stats for each campaign
    const campaignsWithStats = campaigns.map(campaign => ({
      ...campaign,
      recipients: campaign.email_campaign_recipients?.length || 0,
      opens: campaign.email_campaign_recipients?.filter(r => r.opened).length || 0,
      clicks: campaign.email_campaign_recipients?.filter(r => r.clicked).length || 0,
      open_rate: campaign.email_campaign_recipients?.length > 0 
        ? Math.round((campaign.email_campaign_recipients?.filter(r => r.opened).length / campaign.email_campaign_recipients?.length) * 100)
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

    const { user, userClient } = auth;
    const { name, subject, html_content, audience, testEmail } = await request.json();

    // Validate required fields
    if (!name || !subject || !html_content || !audience) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
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
      // Create campaign using user client (respects RLS)
      const { data: campaign, error } = await userClient
        .from('email_campaigns')
        .insert({
          name,
          subject,
          html_content,
          audience,
          status: 'draft',
          created_by: user.id
        })
        .select()
        .single();

      if (error) {
        return Response.json({ error: 'Failed to create campaign' }, { status: 500 });
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
