#!/usr/bin/env node

/**
 * Check where all subscribers are from and their sources
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const serviceClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function checkSubscriberSources() {
  try {
    console.log('🔍 Checking subscriber sources...');
    
    const { data: subscribers, error } = await serviceClient
      .from('email_subscribers')
      .select(`
        id,
        email,
        first_name,
        status,
        source,
        created_at,
        email_subscriber_entities (
          entity_type,
          entity_name,
          relationship_type
        )
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('❌ Error:', error);
      return;
    }

    console.log('✅ Subscriber sources:');
    subscribers.forEach(sub => {
      console.log(`📧 ${sub.email} (${sub.first_name || 'N/A'})`);
      console.log(`   Source: ${sub.source || 'N/A'}`);
      console.log(`   Status: ${sub.status}`);
      console.log(`   Created: ${new Date(sub.created_at).toLocaleDateString()}`);
      if (sub.email_subscriber_entities && sub.email_subscriber_entities.length > 0) {
        console.log(`   Linked to: ${sub.email_subscriber_entities.map(e => `${e.entity_type}: ${e.entity_name}`).join(', ')}`);
      }
      console.log('');
    });

    // Count by source
    const { data: sourceCounts } = await serviceClient
      .from('email_subscribers')
      .select('source')
      .order('created_at', { ascending: false });

    const counts = {};
    sourceCounts.forEach(sub => {
      const source = sub.source || 'unknown';
      counts[source] = (counts[source] || 0) + 1;
    });

    console.log('📊 Subscriber counts by source:');
    Object.entries(counts).forEach(([source, count]) => {
      console.log(`   ${source}: ${count}`);
    });

  } catch (error) {
    console.error('❌ Check failed:', error);
  }
}

checkSubscriberSources().catch(console.error);
