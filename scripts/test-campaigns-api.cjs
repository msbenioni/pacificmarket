#!/usr/bin/env node

/**
 * Test the campaigns API directly to debug 500 errors
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const serviceClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function testCampaignsAPI() {
  try {
    console.log('🧪 Testing campaigns API directly...');
    
    // Test the exact query from the API
    console.log('📊 Testing campaigns query with recipients...');
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
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('❌ Campaigns query error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return;
    } else {
      console.log('✅ Campaigns query successful');
      console.log('Campaigns found:', campaigns?.length || 0);
      if (campaigns && campaigns.length > 0) {
        console.log('Sample campaign:', {
          id: campaigns[0].id,
          name: campaigns[0].name,
          status: campaigns[0].status,
          recipients_count: campaigns[0].email_campaign_recipients?.length || 0
        });
      }
    }
    
    // Test if email_campaign_recipients table exists
    console.log('📋 Testing recipients table...');
    const { data: recipients, error: recipientsError } = await serviceClient
      .from('email_campaign_recipients')
      .select('count')
      .limit(1);
    
    if (recipientsError) {
      console.error('❌ Recipients table error:', recipientsError);
    } else {
      console.log('✅ Recipients table accessible');
    }

    // Test simple campaigns query without recipients
    console.log('📋 Testing simple campaigns query...');
    const { data: simpleCampaigns, error: simpleError } = await serviceClient
      .from('email_campaigns')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (simpleError) {
      console.error('❌ Simple campaigns query error:', simpleError);
    } else {
      console.log('✅ Simple campaigns query successful');
      console.log('Simple campaigns found:', simpleCampaigns?.length || 0);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testCampaignsAPI().catch(console.error);
