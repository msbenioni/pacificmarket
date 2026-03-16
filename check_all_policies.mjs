import { createClient } from '@supabase/supabase-js';

// Use service role key to check existing policies
const supabaseAdmin = createClient(
  'https://mnmisjprswpuvcojnbip.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubWlzanByc3dwdXZjb2puYmlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTY4OTAxNywiZXhwIjoyMDg3MjY1MDE3fQ.g5GzYucCUT1kqQPfx5YdeVPZbPILVSrkfrhJR-XjpGM'
);

async function checkAllPolicies() {
  try {
    console.log('=== Checking ALL existing RLS policies on claim_requests ===');
    
    // We'll try to drop all possible policy names that might exist
    const possiblePolicyNames = [
      "Users can view own claim_requests",
      "Users can insert own claim_requests", 
      "Users can update own claim_requests",
      "Users can delete own claim_requests",
      "Allow authenticated users to read claim_requests",
      "Allow users to insert own claim_requests",
      "Allow users to update own claim_requests",
      "Allow users to delete own claim_requests"
    ];
    
    console.log('Creating a comprehensive DROP script for all possible policies...\n');
    
    let dropScript = '-- Comprehensive RLS policy fix for claim_requests table\n';
    dropScript += '-- This drops ALL possible existing policies first\n\n';
    
    possiblePolicyNames.forEach(policyName => {
      dropScript += `DROP POLICY IF EXISTS "${policyName}" ON claim_requests;\n`;
    });
    
    dropScript += '\n-- Now create the correct policies\n\n';
    dropScript += '-- Allow authenticated users to read all claim requests (for admin dashboard)\n';
    dropScript += 'CREATE POLICY "Allow authenticated users to read claim_requests" ON claim_requests\n';
    dropScript += '  FOR SELECT USING (auth.role() = \'authenticated\');\n\n';
    
    dropScript += '-- Allow users to insert their own claim requests\n';
    dropScript += 'CREATE POLICY "Allow users to insert own claim_requests" ON claim_requests\n';
    dropScript += '  FOR INSERT WITH CHECK (auth.uid() = user_id);\n\n';
    
    dropScript += '-- Allow users to update their own claim requests\n';
    dropScript += 'CREATE POLICY "Allow users to update own claim_requests" ON claim_requests\n';
    dropScript += '  FOR UPDATE USING (auth.uid() = user_id);\n\n';
    
    dropScript += '-- Allow users to delete their own claim requests\n';
    dropScript += 'CREATE POLICY "Allow users to delete own claim_requests" ON claim_requests\n';
    dropScript += '  FOR DELETE USING (auth.uid() = user_id);\n\n';
    
    dropScript += '-- Ensure RLS is enabled\n';
    dropScript += 'ALTER TABLE claim_requests ENABLE ROW LEVEL SECURITY;\n';
    
    console.log('Generated SQL script:');
    console.log('================================');
    console.log(dropScript);
    console.log('================================');
    
    // Write the script to a file
    const fs = await import('fs');
    fs.writeFileSync('fix_claims_rls_comprehensive.sql', dropScript);
    console.log('\n✅ Script saved to: fix_claims_rls_comprehensive.sql');
    console.log('Copy this script to your Supabase SQL Editor and run it.');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkAllPolicies();
