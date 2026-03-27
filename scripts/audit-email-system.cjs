#!/usr/bin/env node

/**
 * Database audit script for PDN email system
 * Verifies tables exist and checks business data completeness
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Create service client for full database access
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

async function auditDatabase() {
  console.log('🔍 PDN Email System Database Audit');
  console.log('=====================================\n');

  try {
    // 1. Check if email tables exist
    console.log('📋 Checking email tables...');
    
    // Query information_schema directly
    const { data: schemaTables, error: schemaError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .ilike('table_name', '%email%');

    if (schemaError) {
      console.error('❌ Failed to query information_schema:', schemaError);
      return;
    }

    const emailTableNames = schemaTables?.map(t => t.table_name) || [];
    console.log('📧 Email tables found:', emailTableNames);
    
    const expectedTables = [
      'email_campaigns',
      'email_subscribers', 
      'email_campaign_recipients',
      'email_campaign_queue',
      'email_subscriber_entities',
      'email_templates',
      'email_events',
      'unsubscribe_tokens'
    ];

    const missingTables = expectedTables.filter(table => !emailTableNames.includes(table));
    const existingTables = emailTableNames.filter(table => expectedTables.includes(table));

    console.log('✅ Existing email tables:', existingTables);
    if (missingTables.length > 0) {
      console.log('❌ Missing email tables:', missingTables);
    }

    // 2. Check businesses table schema
    console.log('\n🏢 Checking businesses table schema...');
    const { data: businessColumns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_schema', 'public')
      .eq('table_name', 'businesses')
      .order('ordinal_position');

    if (columnsError) {
      console.error('❌ Failed to query businesses table schema:', columnsError);
      return;
    }

    const requiredFields = [
      'business_name',
      'business_email', 
      'business_contact_person',
      'subscription_tier',
      'is_active',
      'is_verified',
      'business_handle'
    ];

    const existingColumns = businessColumns?.map(c => c.column_name) || [];
    const missingFields = requiredFields.filter(field => !existingColumns.includes(field));
    const foundFields = requiredFields.filter(field => existingColumns.includes(field));

    console.log('✅ Required fields found:', foundFields);
    if (missingFields.length > 0) {
      console.log('❌ Missing required fields:', missingFields);
    }

    // 3. Check businesses data quality
    console.log('\n📊 Checking businesses data quality...');
    const { data: businesses, error: businessesError } = await supabase
      .from('businesses')
      .select(`
        id,
        business_name,
        business_email,
        business_contact_person,
        subscription_tier,
        is_active,
        is_verified,
        business_handle,
        created_at
      `)
      .limit(10);

    if (businessesError) {
      console.error('❌ Failed to query businesses:', businessesError);
      return;
    }

    console.log(`📈 Sample businesses data (${businesses?.length || 0} records):`);
    businesses?.forEach((business, i) => {
      console.log(`  ${i + 1}. ${business.business_name || 'No name'}`);
      console.log(`     Email: ${business.business_email || 'Missing'}`);
      console.log(`     Contact: ${business.business_contact_person || 'Missing'}`);
      console.log(`     Tier: ${business.subscription_tier || 'Missing'}`);
      console.log(`     Active: ${business.is_active !== false ? 'Yes' : 'No'}`);
      console.log(`     Verified: ${business.is_verified ? 'Yes' : 'No'}`);
      console.log('');
    });

    // 4. Count total businesses with emails
    const { count: totalBusinesses, error: countError } = await supabase
      .from('businesses')
      .select('*', { count: 'exact', head: true });

    const { count: businessesWithEmail, error: emailCountError } = await supabase
      .from('businesses')
      .select('*', { count: 'exact', head: true })
      .not('business_email', 'is', null);

    if (!countError && !emailCountError) {
      console.log(`📈 Total businesses: ${totalBusinesses}`);
      console.log(`📧 Businesses with email: ${businessesWithEmail}`);
      console.log(`📊 Email coverage: ${totalBusinesses > 0 ? Math.round((businessesWithEmail / totalBusinesses) * 100) : 0}%`);
    }

    // 5. Check if email_subscribers table exists and has data
    console.log('\n👥 Checking email subscribers...');
    try {
      const { data: subscribers, error: subscriberError } = await supabase
        .from('email_subscribers')
        .select('id, email, first_name, source, status')
        .limit(5);

      if (subscriberError) {
        console.log('❌ email_subscribers table error:', subscriberError.message);
      } else {
        console.log(`✅ email_subscribers exists with ${subscribers?.length || 0} records`);
        subscribers?.forEach((sub, i) => {
          console.log(`  ${i + 1}. ${sub.email} (${sub.source}, ${sub.status})`);
        });
      }
    } catch (err) {
      console.log('❌ email_subscribers table does not exist or is not accessible');
    }

    // 6. Generate schema update recommendations
    if (missingFields.length > 0) {
      console.log('\n🔧 Recommended schema updates:');
      console.log('-- Add missing fields to businesses table');
      missingFields.forEach(field => {
        let dataType = 'VARCHAR(255)';
        if (field === 'subscription_tier') dataType = 'VARCHAR(20) DEFAULT \'vaka\'';
        if (field === 'is_active') dataType = 'BOOLEAN DEFAULT true';
        
        console.log(`ALTER TABLE businesses ADD COLUMN ${field} ${dataType};`);
      });
    }

  } catch (error) {
    console.error('❌ Audit failed:', error);
  }
}

// Alternative table check function
async function checkTablesDirectly() {
  try {
    const tables = [
      'email_campaigns',
      'email_subscribers',
      'email_campaign_recipients', 
      'email_campaign_queue',
      'email_subscriber_entities'
    ];

    console.log('📋 Direct table check:');
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`❌ ${table}: ${error.message}`);
        } else {
          console.log(`✅ ${table}: Exists and accessible`);
        }
      } catch (err) {
        console.log(`❌ ${table}: Does not exist or not accessible`);
      }
    }
  } catch (error) {
    console.error('Direct check failed:', error);
  }
}

// Run both checks
auditDatabase().then(() => {
  console.log('\n' + '='.repeat(50));
  return checkTablesDirectly();
}).catch(console.error);
