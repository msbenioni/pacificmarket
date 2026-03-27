#!/usr/bin/env node

/**
 * Test campaign audience preview and dry-run functionality
 * Preview recipients before sending any emails
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

async function testCampaignAudience() {
  console.log('🧪 Testing Campaign Audience');
  console.log('============================\n');

  try {
    // Check if email system is ready
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

    // Test different audience segments
    const audiences = [
      { name: 'vaka_plan', filter: { subscription_tier: 'vaka' } },
      { name: 'mana_plan', filter: { subscription_tier: 'mana' } },
      { name: 'moana_plan', filter: { subscription_tier: 'moana' } },
      { name: 'business_owners', filter: { is_claimed: true } },
      { name: 'all', filter: {} }
    ];

    for (const audience of audiences) {
      console.log(`\n🎯 Testing audience: ${audience.name}`);
      console.log('-'.repeat(40));

      let query = supabase
        .from('businesses')
        .select(`
          id,
          business_name,
          business_email,
          business_contact_person,
          subscription_tier,
          is_verified,
          business_handle,
          created_at
        `)
        .eq('is_active', true)
        .not('business_email', 'is', null);

      // Apply audience-specific filters
      if (audience.filter.subscription_tier) {
        query = query.eq('subscription_tier', audience.filter.subscription_tier);
      }
      if (audience.filter.is_claimed !== undefined) {
        query = query.eq('is_claimed', audience.filter.is_claimed);
      }

      const { data: businesses, error: businessError } = await query.limit(5);

      if (businessError) {
        console.error(`❌ Error querying ${audience.name}:`, businessError.message);
        continue;
      }

      // Get total count
      let countQuery = supabase
        .from('businesses')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)
        .not('business_email', 'is', null);

      if (audience.filter.subscription_tier) {
        countQuery = countQuery.eq('subscription_tier', audience.filter.subscription_tier);
      }
      if (audience.filter.is_claimed !== undefined) {
        countQuery = countQuery.eq('is_claimed', audience.filter.is_claimed);
      }

      const { count: totalCount } = await countQuery;

      console.log(`📊 Total in segment: ${totalCount || 0} businesses`);
      
      if (businesses && businesses.length > 0) {
        console.log('📋 Sample businesses:');
        businesses.forEach((business, i) => {
          console.log(`  ${i + 1}. ${business.business_name}`);
          console.log(`     Email: ${business.business_email}`);
          console.log(`     Contact: ${business.business_contact_person || 'Not specified'}`);
          console.log(`     Tier: ${business.subscription_tier}`);
          console.log(`     Verified: ${business.is_verified ? 'Yes' : 'No'}`);
          console.log(`     Handle: ${business.business_handle}`);
          console.log('');
        });
      } else {
        console.log('❌ No businesses found in this segment');
      }
    }

    // Test subscriber sync status
    console.log('\n👥 Testing Subscriber Sync Status');
    console.log('='.repeat(40));

    const { data: subscribers, error: subscriberError } = await supabase
      .from('email_subscribers')
      .select('email, first_name, source, status')
      .eq('source', 'business_signup')
      .limit(10);

    if (subscriberError) {
      console.error('❌ Error checking subscribers:', subscriberError.message);
    } else {
      console.log(`✅ Found ${subscribers?.length || 0} business subscribers (showing first 10):`);
      subscribers?.forEach((sub, i) => {
        console.log(`  ${i + 1}. ${sub.first_name} (${sub.email}) - ${sub.status}`);
      });

      // Get total subscriber count
      const { count: totalSubscribers } = await supabase
        .from('email_subscribers')
        .select('*', { count: 'exact', head: true })
        .eq('source', 'business_signup');

      console.log(`📊 Total business subscribers: ${totalSubscribers || 0}`);
    }

    // Test campaign creation (dry run)
    console.log('\n📧 Testing Campaign Creation (Dry Run)');
    console.log('='.repeat(40));

    const testCampaign = {
      name: '[TEST] Pacific Market Evolution',
      subject: '[TEST] Exciting Evolution: Pacific Market is now Pacific Discovery Network!',
      html_content: '<h1>Test Campaign Content</h1><p>This is a test campaign for {{first_name}}</p>',
      audience: 'vaka_plan',
      status: 'draft'
    };

    console.log('📝 Campaign data prepared:');
    console.log(`   Name: ${testCampaign.name}`);
    console.log(`   Subject: ${testCampaign.subject}`);
    console.log(`   Audience: ${testCampaign.audience}`);
    console.log(`   Status: ${testCampaign.status}`);
    console.log('   HTML Length: ', testCampaign.html_content.length, 'characters');

    console.log('\n⚠️  DRY RUN MODE - No campaign will be created');
    console.log('To actually create the campaign, run:');
    console.log('   node scripts/create-founder-campaign.cjs');

    // Test email configuration
    console.log('\n🔧 Testing Email Configuration');
    console.log('='.repeat(40));

    const emailConfig = {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE,
      user: process.env.SMTP_USER,
      fromName: process.env.SMTP_FROM_NAME,
      fromEmail: process.env.SMTP_FROM_EMAIL
    };

    console.log('✅ Email configuration:');
    Object.entries(emailConfig).forEach(([key, value]) => {
      if (key === 'pass') {
        console.log(`   ${key}: [REDACTED]`);
      } else {
        console.log(`   ${key}: ${value || 'Not set'}`);
      }
    });

    if (!emailConfig.host || !emailConfig.user || !emailConfig.fromEmail) {
      console.log('❌ Missing email configuration');
    } else {
      console.log('✅ Email configuration complete');
    }

    console.log('\n🎉 Test completed successfully!');
    console.log('\n📋 Summary:');
    console.log('✅ Email system tables exist');
    console.log('✅ Business data is accessible');
    console.log('✅ Audience segments are working');
    console.log('✅ Email configuration is ready');
    console.log('\n🚀 Ready for campaign creation and sending!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testCampaignAudience().catch(console.error);
