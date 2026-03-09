import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Verify admin authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return Response.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Fetch campaigns with recipient counts
    const { data: campaigns, error } = await supabase
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
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Verify admin authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return Response.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { name, subject, html_content, audience, testEmail } = await request.json();

    // Validate required fields
    if (!name || !subject || !html_content || !audience) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (testEmail) {
      // Send test email
      try {
        const { data, error } = await resend.emails.send({
          from: 'Pacific Market <hello@pacificmarket.co.nz>',
          to: testEmail,
          subject: `[TEST] ${subject}`,
          html: html_content
        });

        if (error) {
          return Response.json({ error: 'Failed to send test email' }, { status: 500 });
        }

        return Response.json({ 
          success: true, 
          message: 'Test email sent successfully',
          data 
        });

      } catch (error) {
        console.error('Test email error:', error);
        return Response.json({ error: 'Failed to send test email' }, { status: 500 });
      }
    } else {
      // Create campaign
      const { data: campaign, error } = await supabase
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
