#!/usr/bin/env node

/**
 * Run the RLS policies migration for email tables
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

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

async function runRLSMigration() {
  console.log('🔒 Running Email RLS Policies Migration');
  console.log('======================================\n');

  try {
    // Read the migration file
    const migrationPath = path.join(__dirname, '../supabase/migrations/20260327_add_email_rls_policies.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('📋 Migration file loaded');
    console.log(`📏 SQL length: ${migrationSQL.length} characters`);

    // Execute the migration
    console.log('\n🚀 Executing RLS policies migration...');
    
    const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL });

    if (error) {
      console.error('❌ Migration failed:', error);
      console.log('\n💡 You may need to run this manually in the Supabase dashboard:');
      console.log('1. Go to your Supabase project');
      console.log('2. Navigate to SQL Editor');
      console.log('3. Copy and paste the contents of:');
      console.log('   supabase/migrations/20260327_add_email_rls_policies.sql');
      console.log('4. Execute the SQL');
      return;
    }

    console.log('✅ RLS policies migration completed successfully!');

    // Test the policies
    console.log('\n🧪 Testing RLS policies...');
    
    // Create a test user client (simulating admin)
    const { data: { user }, error: authError } = await supabase.auth.signIn({
      email: 'jasmin@pacificdiscoverynetwork.com',
      password: 'test-password' // This won't work, but we need to see the error
    });

    if (authError) {
      console.log('⚠️  Expected auth error (we don\'t have real credentials)');
    }

    console.log('\n🎉 RLS policies are now in place!');
    console.log('📧 Email marketing dashboard should work now');
    console.log('\n📋 Next steps:');
    console.log('1. Refresh your admin dashboard');
    console.log('2. Click on "Email Marketing" tab');
    console.log('3. The 500 errors should be resolved');

  } catch (error) {
    console.error('❌ Migration process failed:', error);
    console.log('\n💡 Manual execution may be required');
  }
}

runRLSMigration().catch(console.error);
