#!/usr/bin/env node

/**
 * Analyze why there are 38 businesses but only 34 subscribers
 * and identify which businesses are missing from email subscribers
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const serviceClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function analyzeBusinessSubscriberGap() {
  try {
    console.log('🔍 Analyzing business vs subscriber gap...');
    
    // Get all active businesses with emails
    const { data: businesses, error: businessError } = await serviceClient
      .from('businesses')
      .select(`
        id,
        business_name,
        business_email,
        business_contact_person,
        is_active,
        status,
        created_at
      `)
      .eq('is_active', true)
      .eq('status', 'active')
      .not('business_email', 'is', null)
      .order('created_at', { ascending: false });

    if (businessError) {
      console.error('❌ Error fetching businesses:', businessError);
      return;
    }

    console.log(`✅ Found ${businesses.length} active businesses with emails`);

    // Get all subscribers
    const { data: subscribers, error: subscriberError } = await serviceClient
      .from('email_subscribers')
      .select(`
        id,
        email,
        first_name,
        source,
        created_at,
        email_subscriber_entities (
          entity_type,
          entity_name,
          relationship_type
        )
      `)
      .eq('source', 'business_signup')
      .order('created_at', { ascending: false });

    if (subscriberError) {
      console.error('❌ Error fetching subscribers:', subscriberError);
      return;
    }

    console.log(`✅ Found ${subscribers.length} business subscribers`);

    // Create a set of subscriber emails for quick lookup
    const subscriberEmails = new Set(subscribers.map(sub => sub.email.toLowerCase()));
    
    // Find businesses that don't have subscribers
    const businessesWithoutSubscribers = businesses.filter(business => 
      !subscriberEmails.has(business.business_email.toLowerCase())
    );

    console.log(`\n📊 Gap Analysis:`);
    console.log(`   Total active businesses with emails: ${businesses.length}`);
    console.log(`   Total business subscribers: ${subscribers.length}`);
    console.log(`   Businesses without subscribers: ${businessesWithoutSubscribers.length}`);

    if (businessesWithoutSubscribers.length > 0) {
      console.log(`\n❌ Businesses missing from email subscribers:`);
      businessesWithoutSubscribers.forEach((business, index) => {
        console.log(`   ${index + 1}. ${business.business_name}`);
        console.log(`      Email: ${business.business_email}`);
        console.log(`      Contact: ${business.business_contact_person || 'N/A'}`);
        console.log(`      Created: ${new Date(business.created_at).toLocaleDateString()}`);
        console.log('');
      });

      console.log(`\n🔧 Recommended Actions:`);
      console.log(`   1. Run the sync script to add missing subscribers`);
      console.log(`   2. Set up automatic sync for new business signups`);
      console.log(`   3. Consider adding a webhook or trigger for real-time sync`);
    } else {
      console.log(`\n✅ All businesses are synced as subscribers!`);
    }

    // Check for any subscribers that don't correspond to current businesses
    const businessEmails = new Set(businesses.map(b => b.business_email.toLowerCase()));
    const orphanedSubscribers = subscribers.filter(sub => 
      !businessEmails.has(sub.email.toLowerCase())
    );

    if (orphanedSubscribers.length > 0) {
      console.log(`\n⚠️  Subscribers without corresponding active businesses:`);
      orphanedSubscribers.forEach((subscriber, index) => {
        console.log(`   ${index + 1}. ${subscriber.email} (${subscriber.first_name})`);
        console.log(`      Source: ${subscriber.source}`);
        console.log(`      Created: ${new Date(subscriber.created_at).toLocaleDateString()}`);
      });
    }

  } catch (error) {
    console.error('❌ Analysis failed:', error);
  }
}

analyzeBusinessSubscriberGap().catch(console.error);
