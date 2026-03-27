#!/usr/bin/env node

/**
 * Sync existing businesses into email subscriber system
 * Safe import with deduplication and business entity linking
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

async function syncBusinessSubscribers() {
  console.log('🔄 Syncing Business Subscribers to Email System');
  console.log('=============================================\n');

  try {
    // 1. Check if email tables exist
    console.log('📋 Checking email tables...');
    const { data: tablesCheck, error: tablesError } = await supabase
      .from('email_subscribers')
      .select('id')
      .limit(1);

    if (tablesError) {
      console.error('❌ Email tables not found. Please run migration first:', tablesError.message);
      return;
    }
    console.log('✅ Email tables exist');

    // 2. Get all businesses with emails
    console.log('\n🏢 Fetching businesses...');
    const { data: businesses, error: businessError } = await supabase
      .from('businesses')
      .select(`
        id,
        business_name,
        business_email,
        business_contact_person,
        subscription_tier,
        business_handle,
        is_verified,
        created_at
      `)
      .not('business_email', 'is', null)
      .eq('is_active', true);

    if (businessError) {
      console.error('❌ Failed to fetch businesses:', businessError);
      return;
    }

    console.log(`✅ Found ${businesses?.length || 0} active businesses with emails`);

    // 3. Check existing subscribers
    console.log('\n👥 Checking existing subscribers...');
    const { data: existingSubscribers, error: subscriberError } = await supabase
      .from('email_subscribers')
      .select('email, first_name, source, status');

    if (subscriberError) {
      console.error('❌ Failed to check existing subscribers:', subscriberError);
      return;
    }

    const existingEmails = new Set(existingSubscribers?.map(s => s.email.toLowerCase()) || []);
    console.log(`✅ Found ${existingEmails.size} existing subscribers`);

    // 4. Prepare new subscribers (exclude any existing emails)
    const newSubscribers = businesses.filter(business => 
      !existingEmails.has(business.business_email.toLowerCase())
    );

    console.log(`📊 Need to import ${newSubscribers.length} new subscribers`);
    console.log(`📊 Will skip ${businesses.length - newSubscribers.length} existing subscribers`);

    if (newSubscribers.length === 0) {
      console.log('✅ All businesses already synced as subscribers');
      return;
    }

    // 5. Show preview of what will be imported
    console.log('\n📋 Preview of new subscribers:');
    newSubscribers.slice(0, 5).forEach((business, i) => {
      console.log(`  ${i + 1}. ${business.business_name}`);
      console.log(`     Email: ${business.business_email}`);
      console.log(`     Contact: ${business.business_contact_person || 'Not specified'}`);
      console.log(`     Tier: ${business.subscription_tier}`);
      console.log(`     Verified: ${business.is_verified ? 'Yes' : 'No'}`);
      console.log('');
    });

    if (newSubscribers.length > 5) {
      console.log(`     ... and ${newSubscribers.length - 5} more`);
    }

    // 6. Dry run mode by default - ask for confirmation
    console.log('\n⚠️  DRY RUN MODE - No data will be imported');
    console.log('To actually import, run with: node scripts/sync-business-subscribers.cjs --import');
    
    if (process.argv.includes('--import')) {
      console.log('\n🚀 Starting import...');
      
      // 7. Insert new subscribers
      const subscriberRecords = newSubscribers.map(business => ({
        email: business.business_email.toLowerCase(),
        first_name: business.business_contact_person || business.business_name,
        source: 'business_signup',
        status: 'subscribed'
      }));

      const { data: insertedSubscribers, error: insertError } = await supabase
        .from('email_subscribers')
        .insert(subscriberRecords)
        .select('id, email, first_name');

      if (insertError) {
        console.error('❌ Failed to insert subscribers:', insertError);
        return;
      }

      console.log(`✅ Inserted ${insertedSubscribers?.length || 0} subscribers`);

      // 8. Link subscribers to businesses
      console.log('\n🔗 Linking subscribers to businesses...');
      
      const entityRecords = [];
      for (const business of newSubscribers) {
        const subscriber = insertedSubscribers?.find(s => 
          s.email.toLowerCase() === business.business_email.toLowerCase()
        );
        
        if (subscriber) {
          entityRecords.push({
            subscriber_id: subscriber.id,
            entity_type: 'business',
            entity_id: business.id,
            entity_name: business.business_name,
            relationship_type: 'contact'
          });
        }
      }

      if (entityRecords.length > 0) {
        const { data: insertedEntities, error: entityError } = await supabase
          .from('email_subscriber_entities')
          .upsert(entityRecords, {
            onConflict: 'subscriber_id,entity_type,entity_id',
            ignoreDuplicates: false
          });

        if (entityError) {
          console.error('❌ Failed to link entities:', entityError);
        } else {
          console.log(`✅ Linked ${entityRecords.length} subscribers to businesses`);
        }
      }

      console.log('\n🎉 Import completed successfully!');
      
    } else {
      console.log('\n💡 To perform the actual import, run:');
      console.log('   node scripts/sync-business-subscribers.cjs --import');
    }

    // 9. Show segmentation summary
    console.log('\n📊 Segmentation Summary:');
    const tierCounts = {};
    businesses.forEach(business => {
      const tier = business.subscription_tier || 'unknown';
      tierCounts[tier] = (tierCounts[tier] || 0) + 1;
    });

    Object.entries(tierCounts).forEach(([tier, count]) => {
      console.log(`   ${tier}: ${count} businesses`);
    });

    console.log(`\n📧 Total email coverage: ${businesses.length} businesses`);
    console.log(`👥 Total subscribers: ${existingEmails.size + newSubscribers.length}`);

  } catch (error) {
    console.error('❌ Sync failed:', error);
  }
}

syncBusinessSubscribers().catch(console.error);
