#!/usr/bin/env node

/**
 * Sync only new businesses that aren't already subscribers
 * This script can be run periodically to catch up new signups
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const serviceClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function syncNewBusinesses() {
  try {
    console.log('🔄 Syncing new businesses to email subscribers...');
    
    // Get all active businesses with emails
    const { data: businesses, error: businessError } = await serviceClient
      .from('businesses')
      .select(`
        id,
        business_name,
        business_email,
        business_contact_person,
        business_handle,
        is_active,
        status
      `)
      .eq('is_active', true)
      .eq('status', 'active')
      .not('business_email', 'is', null);

    if (businessError) {
      console.error('❌ Error fetching businesses:', businessError);
      return;
    }

    // Get existing subscriber emails
    const { data: existingSubscribers, error: subscriberError } = await serviceClient
      .from('email_subscribers')
      .select('email')
      .not('email', 'is', null);

    if (subscriberError) {
      console.error('❌ Error fetching existing subscribers:', subscriberError);
      return;
    }

    const existingEmails = new Set(existingSubscribers.map(s => s.email.toLowerCase()));
    
    // Find businesses that aren't subscribers yet
    const newBusinesses = businesses.filter(business => 
      !existingEmails.has(business.business_email.toLowerCase())
    );

    console.log(`📊 Sync Status:`);
    console.log(`   Total active businesses: ${businesses.length}`);
    console.log(`   Existing subscribers: ${existingSubscribers.length}`);
    console.log(`   New businesses to sync: ${newBusinesses.length}`);

    if (newBusinesses.length === 0) {
      console.log('✅ All businesses are already synced!');
      return;
    }

    console.log(`\n🆕 New businesses to add as subscribers:`);
    newBusinesses.forEach((business, index) => {
      console.log(`   ${index + 1}. ${business.business_name}`);
      console.log(`      Email: ${business.business_email}`);
      console.log(`      Contact: ${business.business_contact_person || 'N/A'}`);
    });

    // Ask for confirmation in non-dry run mode
    const isDryRun = process.argv.includes('--dry-run');
    
    if (isDryRun) {
      console.log('\n🔍 DRY RUN MODE - No changes made');
      console.log('Run without --dry-run to actually sync these businesses');
      return;
    }

    console.log('\n❓ Do you want to sync these businesses? (Add --auto to skip this prompt)');
    
    if (!process.argv.includes('--auto')) {
      // In a real script, you'd want to handle user input
      console.log('Run with --auto to automatically sync, or use the dashboard to manage subscribers');
      return;
    }

    // Sync new businesses
    const syncResults = [];
    
    for (const business of newBusinesses) {
      try {
        // Create subscriber
        const { data: subscriber, error: subscriberError } = await serviceClient
          .from('email_subscribers')
          .insert({
            email: business.business_email,
            first_name: business.business_contact_person || business.business_name.split(' ')[0],
            source: 'business_signup',
            status: 'subscribed',
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (subscriberError) {
          console.error(`❌ Failed to create subscriber for ${business.business_name}:`, subscriberError);
          syncResults.push({ business: business.business_name, success: false, error: subscriberError.message });
          continue;
        }

        // Link to business entity
        const { error: linkError } = await serviceClient
          .from('email_subscriber_entities')
          .insert({
            subscriber_id: subscriber.id,
            entity_type: 'business',
            entity_name: business.business_name,
            relationship_type: 'business_owner'
          });

        if (linkError) {
          console.error(`⚠️  Subscriber created but failed to link ${business.business_name}:`, linkError);
          syncResults.push({ business: business.business_name, success: true, linked: false, error: linkError.message });
        } else {
          console.log(`✅ Synced: ${business.business_name} -> ${business.business_email}`);
          syncResults.push({ business: business.business_name, success: true, linked: true });
        }

      } catch (error) {
        console.error(`❌ Failed to sync ${business.business_name}:`, error);
        syncResults.push({ business: business.business_name, success: false, error: error.message });
      }
    }

    // Summary
    const successful = syncResults.filter(r => r.success).length;
    const failed = syncResults.filter(r => !r.success).length;
    
    console.log(`\n📊 Sync Summary:`);
    console.log(`   Successfully synced: ${successful}`);
    console.log(`   Failed: ${failed}`);
    
    if (failed > 0) {
      console.log(`\n❌ Failed syncs:`);
      syncResults.filter(r => !r.success).forEach(result => {
        console.log(`   ${result.business}: ${result.error}`);
      });
    }

  } catch (error) {
    console.error('❌ Sync failed:', error);
  }
}

syncNewBusinesses().catch(console.error);
