#!/usr/bin/env node

/**
 * Check for duplicate emails across businesses
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const serviceClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function checkDuplicateEmails() {
  try {
    console.log('🔍 Checking for duplicate emails...');
    
    const { data: businesses, error } = await serviceClient
      .from('businesses')
      .select('business_email, business_name')
      .eq('is_active', true)
      .eq('status', 'active')
      .not('business_email', 'is', null)
      .order('business_email');

    if (error) {
      console.error('❌ Error:', error);
      return;
    }

    // Group by email
    const emailGroups = {};
    businesses.forEach(business => {
      const email = business.business_email.toLowerCase();
      if (!emailGroups[email]) {
        emailGroups[email] = [];
      }
      emailGroups[email].push(business);
    });

    // Find duplicates
    const duplicates = Object.entries(emailGroups).filter(([email, group]) => group.length > 1);
    
    console.log(`📊 Email Analysis:`);
    console.log(`   Total businesses: ${businesses.length}`);
    console.log(`   Unique emails: ${Object.keys(emailGroups).length}`);
    console.log(`   Duplicate emails: ${duplicates.length}`);

    if (duplicates.length > 0) {
      console.log(`\n🔄 Businesses sharing emails:`);
      duplicates.forEach(([email, group]) => {
        console.log(`   ${email}:`);
        group.forEach(business => {
          console.log(`     - ${business.business_name}`);
        });
      });
    }

    // Show unique emails that should be subscribers
    const uniqueEmails = Object.keys(emailGroups);
    console.log(`\n📧 Expected subscriber count: ${uniqueEmails.length}`);

  } catch (error) {
    console.error('❌ Check failed:', error);
  }
}

checkDuplicateEmails().catch(console.error);
