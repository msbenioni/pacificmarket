import { createClient } from '@supabase/supabase-js';

// Use the service role key to check RLS policies (has admin permissions)
const supabaseAdmin = createClient(
  'https://mnmisjprswpuvcojnbip.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubWlzanByc3dwdXZjb2puYmlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTY4OTAxNywiZXhwIjoyMDg3MjY1MDE3fQ.g5GzYucCUT1kqQPfx5YdeVPZbPILVSrkfrhJR-XjpGM'
);

async function checkRLSPolicies() {
  try {
    console.log('=== Checking RLS Policies ===');
    
    // Check RLS policies for businesses table
    console.log('\n--- Businesses Table RLS Policies ---');
    const { data: businessPolicies, error: businessPolicyError } = await supabaseAdmin
      .from('pg_policies')
      .select('policyname, tablename, cmd, roles, qual')
      .eq('tablename', 'businesses')
      .eq('schemaname', 'public');
    
    if (businessPolicyError) {
      console.error('Error checking business policies:', businessPolicyError);
    } else {
      console.log(`Found ${businessPolicies?.length || 0} policies for businesses table:`);
      businessPolicies?.forEach(policy => {
        console.log(`- ${policy.policyname} (${policy.cmd}) for roles: ${policy.roles}`);
        console.log(`  Condition: ${policy.qual}`);
      });
    }
    
    // Check RLS policies for claim_requests table
    console.log('\n--- Claim Requests Table RLS Policies ---');
    const { data: claimPolicies, error: claimPolicyError } = await supabaseAdmin
      .from('pg_policies')
      .select('policyname, tablename, cmd, roles, qual')
      .eq('tablename', 'claim_requests')
      .eq('schemaname', 'public');
    
    if (claimPolicyError) {
      console.error('Error checking claim policies:', claimPolicyError);
    } else {
      console.log(`Found ${claimPolicies?.length || 0} policies for claim_requests table:`);
      claimPolicies?.forEach(policy => {
        console.log(`- ${policy.policyname} (${policy.cmd}) for roles: ${policy.roles}`);
        console.log(`  Condition: ${policy.qual}`);
      });
    }
    
    // Test with anon key vs service role
    console.log('\n=== Testing Access with Different Keys ===');
    
    const supabaseAnon = createClient(
      'https://mnmisjprswpuvcojnbip.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubWlzanByc3dwdXZjb2puYmlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2ODkwMTcsImV4cCI6MjA4NzI2NTAxN30.vl7Em91jGQP8mse-CJkIxTtuxWswoDO6sdSFLhhEc9A'
    );
    
    // Test businesses access with anon key
    const { data: anonBusinesses, error: anonBusinessError } = await supabaseAnon
      .from('businesses')
      .select('id, name, status')
      .limit(3);
    
    console.log(`Anon key businesses access: ${anonBusinessError ? 'DENIED' : `ALLOWED (${anonBusinesses?.length} records)`}`);
    if (anonBusinessError) {
      console.log(`Error: ${anonBusinessError.message}`);
    }
    
    // Test claims access with anon key
    const { data: anonClaims, error: anonClaimsError } = await supabaseAnon
      .from('claim_requests')
      .select('id, status')
      .limit(3);
    
    console.log(`Anon key claims access: ${anonClaimsError ? 'DENIED' : `ALLOWED (${anonClaims?.length} records)`}`);
    if (anonClaimsError) {
      console.log(`Error: ${anonClaimsError.message}`);
    }
    
    // Test claims access with service role
    const { data: adminClaims, error: adminClaimsError } = await supabaseAdmin
      .from('claim_requests')
      .select('id, status')
      .limit(3);
    
    console.log(`Service role claims access: ${adminClaimsError ? 'DENIED' : `ALLOWED (${adminClaims?.length} records)`}`);
    if (adminClaimsError) {
      console.log(`Error: ${adminClaimsError.message}`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkRLSPolicies();
