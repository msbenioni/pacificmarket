#!/usr/bin/env node

/**
 * Create the founder campaign for Pacific Market -> Pacific Discovery Network transition
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Campaign HTML template
const campaignHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pacific Discovery Network - Exciting Evolution</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fc; color: #0a1628;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #0d4f4f 0%, #0a1628 100%); padding: 40px 30px; text-align: center;">
            <div style="width: 80px; height: 80px; background: #00c4cc; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <div style="width: 40px; height: 40px; background: white; border-radius: 50%;"></div>
            </div>
            <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700; line-height: 1.2;">Pacific Discovery Network</h1>
            <p style="color: #baf7f9; margin: 10px 0 0 0; font-size: 16px;">Trusted Pacific business discovery platform</p>
        </div>

        <!-- Main Content -->
        <div style="padding: 40px 30px;">
            <!-- Personalization -->
            <p style="font-size: 18px; color: #334155; margin-bottom: 30px; line-height: 1.6;">
                Hi <strong>{{first_name}}</strong>,
            </p>

            <!-- Main Message -->
            <div style="background: #f0f9ff; border-left: 4px solid #0d4f4f; padding: 25px; margin-bottom: 30px; border-radius: 0 8px 8px 0;">
                <h2 style="color: #0d4f4f; margin: 0 0 15px 0; font-size: 24px; font-weight: 600;">Exciting Evolution: Pacific Market is now Pacific Discovery Network!</h2>
                <p style="color: #334155; margin: 0; line-height: 1.6;">
                    We are thrilled to announce our evolution from Pacific Market to Pacific Discovery Network! This is not just a name change – it is a commitment to better serve our vibrant Pacific business community with enhanced features, broader reach, and deeper connections.
                </p>
            </div>

            <!-- What This Means -->
            <h3 style="color: #0a1628; margin: 30px 0 20px 0; font-size: 20px; font-weight: 600;">What This Means For You</h3>
            
            <div style="margin-bottom: 30px;">
                <div style="display: flex; align-items: flex-start; margin-bottom: 20px;">
                    <div style="width: 24px; height: 24px; background: #00c4cc; border-radius: 50%; flex-shrink: 0; margin-right: 15px; margin-top: 2px;"></div>
                    <div>
                        <h4 style="color: #0a1628; margin: 0 0 5px 0; font-size: 16px; font-weight: 600;">Your Business Listing is Preserved</h4>
                        <p style="color: #334155; margin: 0; line-height: 1.6; font-size: 14px;">Your existing business profile, logo, and banner are fully retained and now featured on our enhanced platform.</p>
                    </div>
                </div>

                <div style="display: flex; align-items: flex-start; margin-bottom: 20px;">
                    <div style="width: 24px; height: 24px; background: #00c4cc; border-radius: 50%; flex-shrink: 0; margin-right: 15px; margin-top: 2px;"></div>
                    <div>
                        <h4 style="color: #0a1628; margin: 0 0 5px 0; font-size: 16px; font-weight: 600;">Same Vaka Plan Benefits</h4>
                        <p style="color: #334155; margin: 0; line-height: 1.6; font-size: 14px;">Your current Vaka plan benefits continue unchanged – no action needed from your side.</p>
                    </div>
                </div>

                <div style="display: flex; align-items: flex-start; margin-bottom: 20px;">
                    <div style="width: 24px; height: 24px; background: #00c4cc; border-radius: 50%; flex-shrink: 0; margin-right: 15px; margin-top: 2px;"></div>
                    <div>
                        <h4 style="color: #0a1628; margin: 0 0 5px 0; font-size: 16px; font-weight: 600;">Enhanced Discovery Features</h4>
                        <p style="color: #334155; margin: 0; line-height: 1.6; font-size: 14px;">Enjoy improved business discovery, better networking opportunities, and enhanced visibility across the Pacific region.</p>
                    </div>
                </div>
            </div>

            <!-- Upgrade Opportunity -->
            <div style="background: linear-gradient(135deg, #f5df9a 0%, #c9a84c 100%); padding: 30px; margin: 30px 0; border-radius: 12px; text-align: center;">
                <h3 style="color: #0a1628; margin: 0 0 15px 0; font-size: 20px; font-weight: 600;">✨ Upgrade to Mana for Brand Evolution</h3>
                <p style="color: #0a1628; margin: 0 0 20px 0; line-height: 1.6; font-size: 15px;">
                    Ready to refresh your branding? Upgrade to our Mana plan to update your logo, banner, and unlock premium features including advanced analytics and priority placement.
                </p>
                <div style="background: white; padding: 15px; border-radius: 8px; display: inline-block;">
                    <p style="color: #0a1628; margin: 0; font-weight: 600; font-size: 14px;">Mana Plan Benefits:</p>
                    <ul style="color: #334155; margin: 10px 0; text-align: left; font-size: 13px;">
                        <li>✓ Brand customization (logo, banner, mobile banner)</li>
                        <li>✓ Enhanced business profile features</li>
                        <li>✓ Priority placement in search results</li>
                        <li>✓ Advanced analytics dashboard</li>
                        <li>✓ Direct customer inquiry features</li>
                    </ul>
                </div>
            </div>

            <!-- Call to Action -->
            <div style="text-align: center; margin: 40px 0;">
                <a href="https://pacificdiscoverynetwork.com/PacificBusinesses" 
                   style="display: inline-block; background: #0d4f4f; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                    Explore Your Enhanced Business Profile
                </a>
                <div style="margin-top: 15px;">
                    <a href="https://pacificdiscoverynetwork.com/BusinessPortal" 
                       style="display: inline-block; background: transparent; color: #0d4f4f; padding: 12px 25px; text-decoration: none; border: 2px solid #0d4f4f; border-radius: 8px; font-weight: 600; font-size: 14px;">
                        Upgrade to Mana Plan
                    </a>
                </div>
            </div>

            <!-- Support -->
            <div style="background: #f8f9fc; padding: 25px; border-radius: 8px; margin: 30px 0;">
                <h4 style="color: #0a1628; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">Questions? We are Here to Help!</h4>
                <p style="color: #334155; margin: 0; line-height: 1.6; font-size: 14px;">
                    Our team is dedicated to supporting you through this transition. Whether you have questions about your existing listing, want to explore upgrade options, or need assistance with any aspect of your business profile, we are just an email away.
                </p>
                <p style="margin: 15px 0 0 0; font-size: 14px;">
                    <strong>Email:</strong> <a href="mailto:hello@pacificdiscoverynetwork.com" style="color: #0d4f4f;">hello@pacificdiscoverynetwork.com</a>
                </p>
            </div>

            <!-- Thank You -->
            <p style="color: #334155; margin: 30px 0; line-height: 1.6; font-size: 16px; font-style: italic;">
                Thank you for being part of our journey. We are excited to continue serving the Pacific business community and helping your business thrive in our enhanced discovery network.
            </p>

            <p style="color: #334155; margin: 0; line-height: 1.6;">
                Warm regards,<br>
                The Pacific Discovery Network Team
            </p>
        </div>

        <!-- Footer -->
        <div style="background: #0a1628; padding: 30px; text-align: center; border-top: 4px solid #00c4cc;">
            <p style="color: #94a3b8; margin: 0 0 10px 0; font-size: 12px;">
                © 2026 Pacific Discovery Network. All rights reserved.
            </p>
            <p style="color: #94a3b8; margin: 0; font-size: 11px;">
                Pacific Market has evolved into Pacific Discovery Network
            </p>
            <div style="margin-top: 15px;">
                <a href="https://pacificdiscoverynetwork.com/PacificBusinesses" style="color: #00c4cc; text-decoration: none; font-size: 12px; margin: 0 10px;">Discover Businesses</a>
                <span style="color: #94a3b8; font-size: 12px;">•</span>
                <a href="https://pacificdiscoverynetwork.com/BusinessPortal" style="color: #00c4cc; text-decoration: none; font-size: 12px; margin: 0 10px;">Business Portal</a>
            </div>
        </div>
    </div>
</body>
</html>
`;

async function createFounderCampaign() {
  console.log('📧 Creating Founder Campaign');
  console.log('==========================\n');

  try {
    // Check if email tables exist
    console.log('📋 Checking email system...');
    const { data: check, error: checkError } = await supabase
      .from('email_campaigns')
      .select('id')
      .limit(1);

    if (checkError) {
      console.error('❌ Email tables not found. Please run migration first:', checkError.message);
      return;
    }
    console.log('✅ Email system ready');

    // Create the campaign
    console.log('\n🎯 Creating founder campaign...');
    
    const campaignData = {
      name: 'Pacific Market Evolution to Pacific Discovery Network',
      subject: 'Exciting Evolution: Pacific Market is now Pacific Discovery Network!',
      html_content: campaignHTML,
      audience: 'all',
      status: 'draft'
    };

    const { data: campaign, error: campaignError } = await supabase
      .from('email_campaigns')
      .insert(campaignData)
      .select()
      .single();

    if (campaignError) {
      console.error('❌ Failed to create campaign:', campaignError);
      return;
    }

    console.log('✅ Campaign created successfully!');
    console.log(`📋 Campaign ID: ${campaign.id}`);
    console.log(`📝 Campaign Name: ${campaign.name}`);
    console.log(`🎯 Target Audience: ${campaign.audience}`);
    console.log(`📊 Status: ${campaign.status}`);

    // Preview audience
    console.log('\n👥 Previewing audience...');
    const { data: businesses, error: businessError } = await supabase
      .from('businesses')
      .select('business_name, business_email, subscription_tier')
      .eq('is_active', true)
      .not('business_email', 'is', null)
      .limit(10);

    if (businessError) {
      console.error('❌ Failed to preview audience:', businessError);
      return;
    }

    console.log(`✅ Sample businesses (${businesses?.length || 0} shown):`);
    businesses?.forEach((business, i) => {
      console.log(`  ${i + 1}. ${business.business_name} (${business.business_email})`);
    });

    // Count total audience
    const { count: totalBusinesses } = await supabase
      .from('businesses')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .not('business_email', 'is', null);

    console.log(`\n📊 Total audience: ${totalBusinesses} businesses`);

    console.log('\n🎉 Campaign ready for review!');
    console.log('\n📋 Next Steps:');
    console.log('1. Review the campaign in admin dashboard');
    console.log('2. Test send to yourself first');
    console.log('3. Preview audience with dry run');
    console.log('4. Queue for sending when ready');
    console.log('\n🔗 Admin Dashboard: https://pacificdiscoverynetwork.com/AdminDashboard');

  } catch (error) {
    console.error('❌ Campaign creation failed:', error);
  }
}

createFounderCampaign().catch(console.error);
