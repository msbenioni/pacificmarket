#!/usr/bin/env node

/**
 * Force sync business subscribers with better error handling
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

async function forceSyncSubscribers() {
  console.log('🔄 Force Sync Business Subscribers');
  console.log('===============================\n');

  try {
    // 1. Get all businesses with emails
    console.log('🏢 Fetching businesses...');
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

    // 2. Process businesses one by one to avoid conflicts
    console.log('\n🔄 Processing businesses individually...');
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const business of businesses) {
      try {
        // Try to insert subscriber
        const subscriberData = {
          email: business.business_email.toLowerCase(),
          first_name: business.business_contact_person || business.business_name,
          source: 'business_signup',
          status: 'subscribed'
        };

        const { data: subscriber, error: insertError } = await supabase
          .from('email_subscribers')
          .insert(subscriberData)
          .select('id, email, first_name')
          .single();

        if (insertError) {
          if (insertError.code === '23505') {
            // Duplicate - update existing
            console.log(`⚠️  ${business.business_name} - Already exists, updating...`);
            
            const { data: updated, error: updateError } = await supabase
              .from('email_subscribers')
              .update({
                first_name: business.business_contact_person || business.business_name,
                source: 'business_signup',
                status: 'subscribed',
                updated_at: new Date().toISOString()
              })
              .eq('email', business.business_email.toLowerCase())
              .select('id, email, first_name')
              .single();

            if (updateError) {
              console.error(`❌ Failed to update ${business.business_name}:`, updateError.message);
              errorCount++;
            } else {
              console.log(`✅ Updated ${business.business_name} (${updated.email})`);
              successCount++;
            }
          } else {
            console.error(`❌ Failed to insert ${business.business_name}:`, insertError.message);
            errorCount++;
          }
        } else {
          console.log(`✅ Added ${business.business_name} (${subscriber.email})`);
          successCount++;
        }

        // Link to business entity
        if (subscriber || !insertError || insertError.code !== '23505') {
          const subscriberId = subscriber?.id;
          if (!subscriberId) {
            // Get the subscriber ID after update
            const { data: existingSub } = await supabase
              .from('email_subscribers')
              .select('id')
              .eq('email', business.business_email.toLowerCase())
              .single();
            
            if (existingSub) {
              await linkToBusiness(existingSub.id, business);
            }
          } else {
            await linkToBusiness(subscriberId, business);
          }
        }

      } catch (err) {
        console.error(`❌ Error processing ${business.business_name}:`, err.message);
        errorCount++;
      }
    }

    console.log('\n📊 Sync Summary:');
    console.log(`✅ Successfully processed: ${successCount}`);
    console.log(`⚠️  Skipped/Updated: ${skipCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`📊 Total businesses: ${businesses.length}`);

    // 3. Verify final count
    const { count: finalCount } = await supabase
      .from('email_subscribers')
      .select('*', { count: 'exact', head: true })
      .eq('source', 'business_signup');

    console.log(`👥 Final business subscriber count: ${finalCount}`);

  } catch (error) {
    console.error('❌ Sync failed:', error);
  }
}

async function linkToBusiness(subscriberId, business) {
  try {
    const { error: entityError } = await supabase
      .from('email_subscriber_entities')
      .upsert({
        subscriber_id: subscriberId,
        entity_type: 'business',
        entity_id: business.id,
        entity_name: business.business_name,
        relationship_type: 'contact'
      }, {
        onConflict: 'subscriber_id,entity_type,entity_id',
        ignoreDuplicates: true
      });

    if (entityError) {
      console.error(`❌ Failed to link ${business.business_name}:`, entityError.message);
    }
  } catch (err) {
    console.error(`❌ Link error for ${business.business_name}:`, err.message);
  }
}

forceSyncSubscribers().catch(console.error);
