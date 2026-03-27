#!/usr/bin/env node

/**
 * Check existing subscribers and show what needs to be updated
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

async function checkExistingSubscribers() {
  console.log('🔍 Checking Existing Subscribers');
  console.log('================================\n');

  try {
    // Get all existing subscribers
    const { data: subscribers, error: subscriberError } = await supabase
      .from('email_subscribers')
      .select('id, email, first_name, source, status, created_at')
      .order('created_at', { ascending: false });

    if (subscriberError) {
      console.error('❌ Failed to fetch subscribers:', subscriberError);
      return;
    }

    console.log(`📊 Found ${subscribers?.length || 0} existing subscribers:`);
    
    subscribers?.forEach((sub, i) => {
      console.log(`  ${i + 1}. ${sub.first_name || 'No name'} (${sub.email})`);
      console.log(`     Source: ${sub.source}, Status: ${sub.status}`);
      console.log(`     Created: ${new Date(sub.created_at).toLocaleDateString()}`);
      console.log('');
    });

    // Check if any match our businesses
    console.log('🏢 Checking for business matches...');
    const { data: businesses, error: businessError } = await supabase
      .from('businesses')
      .select('business_name, business_email, business_contact_person')
      .not('business_email', 'is', null)
      .limit(10);

    if (businessError) {
      console.error('❌ Failed to fetch businesses:', businessError);
      return;
    }

    const businessEmails = new Set(businesses?.map(b => b.business_email.toLowerCase()) || []);
    const subscriberEmails = new Set(subscribers?.map(s => s.email.toLowerCase()) || []);
    
    const overlappingEmails = [...businessEmails].filter(email => subscriberEmails.has(email));
    
    console.log(`📊 Business emails: ${businessEmails.size}`);
    console.log(`📊 Subscriber emails: ${subscriberEmails.size}`);
    console.log(`📊 Overlapping emails: ${overlappingEmails.length}`);
    
    if (overlappingEmails.length > 0) {
      console.log('\n⚠️  These businesses are already subscribers:');
      overlappingEmails.forEach(email => {
        const business = businesses?.find(b => b.business_email.toLowerCase() === email);
        const subscriber = subscribers?.find(s => s.email.toLowerCase() === email);
        console.log(`  - ${business?.business_name} (${email})`);
        console.log(`    Business contact: ${business?.business_contact_person}`);
        console.log(`    Subscriber name: ${subscriber?.first_name}`);
        console.log(`    Source: ${subscriber?.source}, Status: ${subscriber?.status}`);
        console.log('');
      });
    }

    // Recommend next steps
    console.log('💡 Recommendations:');
    if (overlappingEmails.length === 0) {
      console.log('✅ No conflicts - can safely import all businesses');
    } else {
      console.log('⚠️  Some businesses are already subscribers:');
      console.log('   Option 1: Update existing subscribers to business_signup source');
      console.log('   Option 2: Skip existing and only import new businesses');
      console.log('   Option 3: Delete existing subscribers and re-import all');
    }

  } catch (error) {
    console.error('❌ Check failed:', error);
  }
}

checkExistingSubscribers().catch(console.error);
