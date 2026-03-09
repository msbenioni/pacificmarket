import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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

    const { campaignId } = await request.json();

    if (!campaignId) {
      return Response.json({ error: 'Campaign ID required' }, { status: 400 });
    }

    // Fetch campaign details
    const { data: campaign, error: campaignError } = await supabase
      .from('email_campaigns')
      .select('*')
      .eq('id', campaignId)
      .single();

    if (campaignError || !campaign) {
      return Response.json({ error: 'Campaign not found' }, { status: 404 });
    }

    if (campaign.status !== 'draft') {
      return Response.json({ error: 'Campaign already sent' }, { status: 400 });
    }

    // Get audience emails based on campaign audience
    let emails = [];
    
    switch (campaign.audience) {
      case 'all':
        const { data: allSubscribers } = await supabase
          .from('email_subscribers')
          .select('email, first_name')
          .eq('status', 'subscribed');
        emails = allSubscribers || [];
        break;

      case 'business_owners':
        const { data: businessOwners } = await supabase
          .from('profiles')
          .select('email, display_name as first_name')
          .in('role', ['business', 'admin']);
        emails = businessOwners || [];
        break;

      case 'mana_plan':
        const { data: manaBusinesses } = await supabase
          .from('businesses')
          .select('owner_user_id')
          .eq('subscription_tier', 'mana');
        
        const manaOwnerIds = manaBusinesses?.map(b => b.owner_user_id).filter(Boolean);
        if (manaOwnerIds.length > 0) {
          const { data: manaOwners } = await supabase
            .from('profiles')
            .select('email, display_name as first_name')
            .in('id', manaOwnerIds);
          emails = manaOwners || [];
        }
        break;

      case 'moana_plan':
        const { data: moanaBusinesses } = await supabase
          .from('businesses')
          .select('owner_user_id')
          .eq('subscription_tier', 'moana');
        
        const moanaOwnerIds = moanaBusinesses?.map(b => b.owner_user_id).filter(Boolean);
        if (moanaOwnerIds.length > 0) {
          const { data: moanaOwners } = await supabase
            .from('profiles')
            .select('email, display_name as first_name')
            .in('id', moanaOwnerIds);
          emails = moanaOwners || [];
        }
        break;

      case 'referral_participants':
        const { data: referrers } = await supabase
          .from('referrals')
          .select('referrer_business_id')
          .eq('status', 'approved');
        
        const referrerBusinessIds = referrers?.map(r => r.referrer_business_id).filter(Boolean);
        if (referrerBusinessIds.length > 0) {
          const { data: referrerBusinesses } = await supabase
            .from('businesses')
            .select('owner_user_id')
            .in('id', referrerBusinessIds);
          
          const referrerOwnerIds = referrerBusinesses?.map(b => b.owner_user_id).filter(Boolean);
          if (referrerOwnerIds.length > 0) {
            const { data: referrerOwners } = await supabase
              .from('profiles')
              .select('email, display_name as first_name')
              .in('id', referrerOwnerIds);
            emails = referrerOwners || [];
          }
        }
        break;

      default:
        return Response.json({ error: 'Invalid audience' }, { status: 400 });
    }

    if (emails.length === 0) {
      return Response.json({ error: 'No subscribers found for this audience' }, { status: 400 });
    }

    // Update campaign status to sending
    await supabase
      .from('email_campaigns')
      .update({ status: 'sending' })
      .eq('id', campaignId);

    // Create recipient records
    const recipientRecords = emails.map(email => ({
      campaign_id: campaignId,
      email: email.email,
      status: 'pending'
    }));

    const { error: recipientsError } = await supabase
      .from('email_campaign_recipients')
      .insert(recipientRecords);

    if (recipientsError) {
      await supabase
        .from('email_campaigns')
        .update({ status: 'draft' })
        .eq('id', campaignId);
      
      return Response.json({ error: 'Failed to create recipient records' }, { status: 500 });
    }

    // Send emails (process in batches to avoid rate limits)
    const batchSize = 50;
    let sentCount = 0;
    let failedCount = 0;

    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      
      for (const recipient of batch) {
        try {
          // Personalize email content
          let personalizedHtml = campaign.html_content;
          personalizedHtml = personalizedHtml.replace(/\{\{first_name\}\}/g, recipient.first_name || 'Business Owner');
          personalizedHtml = personalizedHtml.replace(/\{\{email\}\}/g, recipient.email);
          
          // Add referral link if template requires it
          if (personalizedHtml.includes('{{referral_link}}')) {
            // Get business handle for referral link
            const { data: userBusiness } = await supabase
              .from('businesses')
              .select('business_handle')
              .eq('owner_user_id', user.id)
              .single();
            
            const referralLink = userBusiness?.business_handle 
              ? `https://www.pacificmarket.co.nz/register/${userBusiness.business_handle}`
              : 'https://www.pacificmarket.co.nz';
            
            personalizedHtml = personalizedHtml.replace(/\{\{referral_link\}\}/g, referralLink);
          }

          // Send email via Resend
          const { data, error } = await resend.emails.send({
            from: 'Pacific Market <hello@pacificmarket.co.nz>',
            to: recipient.email,
            subject: campaign.subject,
            html: personalizedHtml
          });

          if (error) {
            console.error(`Failed to send to ${recipient.email}:`, error);
            failedCount++;
            
            // Update recipient status to failed
            await supabase
              .from('email_campaign_recipients')
              .update({ status: 'failed' })
              .eq('campaign_id', campaignId)
              .eq('email', recipient.email);
          } else {
            sentCount++;
            
            // Update recipient status to sent
            await supabase
              .from('email_campaign_recipients')
              .update({ status: 'sent', sent_at: new Date().toISOString() })
              .eq('campaign_id', campaignId)
              .eq('email', recipient.email);
          }

          // Add delay between emails to avoid rate limits
          await new Promise(resolve => setTimeout(resolve, 100));

        } catch (error) {
          console.error(`Error sending to ${recipient.email}:`, error);
          failedCount++;
          
          // Update recipient status to failed
          await supabase
            .from('email_campaign_recipients')
            .update({ status: 'failed' })
            .eq('campaign_id', campaignId)
            .eq('email', recipient.email);
        }
      }

      // Add delay between batches
      if (i + batchSize < emails.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Update campaign status
    await supabase
      .from('email_campaigns')
      .update({ 
        status: 'sent',
        sent_at: new Date().toISOString()
      })
      .eq('id', campaignId);

    return Response.json({
      success: true,
      message: `Campaign sent successfully! ${sentCount} emails sent, ${failedCount} failed.`,
      stats: {
        total: emails.length,
        sent: sentCount,
        failed: failedCount
      }
    });

  } catch (error) {
    console.error('Send campaign error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
