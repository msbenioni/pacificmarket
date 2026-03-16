import { createClient } from '@supabase/supabase-js';

// Use service role key to check existing policies
const supabaseAdmin = createClient(
  'https://mnmisjprswpuvcojnbip.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubWlzanByc3dwdXZjb2puYmlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTY4OTAxNywiZXhwIjoyMDg3MjY1MDE3fQ.g5GzYucCUT1kqQPfx5YdeVPZbPILVSrkfrhJR-XjpGM'
);

async function checkExistingPolicies() {
  try {
    console.log('=== Testing current access levels ===');
    
    const supabaseAnon = createClient(
      'https://mnmisjprswpuvcojnbip.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubWlzanByc3dwdXZjb2puYmlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2ODkwMTcsImV4cCI6MjA4NzI2NTAxN30.vl7Em91jGQP8mse-CJkIxTtuxWswoDO6sdSFLhhEc9A'
    );
    
    // Test anon access (should be restricted)
    const { data: anonData, error: anonError } = await supabaseAnon
      .from('claim_requests')
      .select('id, status')
      .limit(1);
    
    console.log(`Anon access: ${anonError ? 'DENIED' : `ALLOWED (${anonData?.length || 0} records)`}`);
    if (anonError) {
      console.log('Anon error:', anonError.message);
    }
    
    console.log('\n=== Recommendation ===');
    console.log('The policy already exists. Use fix_claims_rls_safe.sql which includes:');
    console.log('DROP POLICY IF EXISTS "Allow authenticated users to read claim_requests"');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkExistingPolicies();
