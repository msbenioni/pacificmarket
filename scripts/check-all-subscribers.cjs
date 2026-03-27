#!/usr/bin/env node

/**
 * Check all subscribers including those with deleted emails
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const serviceClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function checkAllSubscribers() {
  try {
    console.log('🔍 Checking all subscribers...');
    
    const { data: subscribers, error } = await serviceClient
      .from('email_subscribers')
      .select(`
        id,
        email,
        first_name,
        status,
        source,
        created_at
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error:', error);
      return;
    }

    console.log(`✅ Total subscribers: ${subscribers.length}`);
    
    // Count by email status
    const withEmail = subscribers.filter(s => s.email).length;
    const withoutEmail = subscribers.filter(s => !s.email).length;
    
    console.log(`   With email: ${withEmail}`);
    console.log(`   Without email (deleted): ${withoutEmail}`);
    
    console.log('\n📧 All subscribers:');
    subscribers.forEach((sub, index) => {
      console.log(`   ${index + 1}. ${sub.email || 'EMAIL_DELETED'} (${sub.first_name || 'N/A'}) - ${sub.status}`);
    });

  } catch (error) {
    console.error('❌ Check failed:', error);
  }
}

checkAllSubscribers().catch(console.error);
