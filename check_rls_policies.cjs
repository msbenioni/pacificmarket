const { createClient } = require('@supabase/supabase-js');

// Use service role key to check RLS policies
const supabaseUrl = 'https://mnmisjprswpuvcojnbip.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubWlzanByc3dwdXZjb2puYmlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTY4OTAxNywiZXhwIjoyMDg3MjY1MDE3fQ.g5GzYucCUT1kqQPfx5YdeVPZbPILVSrkfrhJR-XjpGM';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function checkRLSPolicies() {
  try {
    console.log('Checking RLS policies for subscriptions table...');
    
    // Check RLS status
    const { data: rlsStatus, error: rlsError } = await supabase
      .from('pg_stat_user_tables')
      .select('relname, rowsecurity')
      .eq('relname', 'subscriptions');
    
    if (rlsError) {
      console.log('Error checking RLS status:', rlsError.message);
    } else {
      console.log('RLS enabled on subscriptions:', rlsStatus);
    }
    
    // Check existing policies
    const { data: policies, error: policyError } = await supabase
      .from('pg_policies')
      .select('*')
      .eq('tablename', 'subscriptions');
    
    if (policyError) {
      console.log('Error checking policies:', policyError.message);
    } else {
      console.log('\nExisting RLS policies for subscriptions:');
      console.log('==========================================');
      if (policies && policies.length > 0) {
        policies.forEach(policy => {
          console.log(`Policy: ${policy.policyname}`);
          console.log(`Command: ${policy.permissive ? 'PERMISSIVE' : 'RESTRICTIVE'}`);
          console.log(`Roles: ${policy.roles}`);
          console.log(`Using: ${policy.cmd}`);
          console.log(`Expression: ${policy.qual}`);
          console.log('---');
        });
      } else {
        console.log('❌ No RLS policies found (this is the problem!)');
      }
    }
    
    // Try to create a simple policy for testing
    console.log('\n=== Testing policy creation ===');
    console.log('The issue is likely that RLS is enabled but there are no policies allowing access');
    console.log('This means even the service role might be blocked');
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

checkRLSPolicies();
