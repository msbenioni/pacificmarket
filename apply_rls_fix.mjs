import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseAdmin = createClient(
  'https://mnmisjprswpuvcojnbip.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubWlzanByc3dwdXZjb2puYmlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTY4OTAxNywiZXhwIjoyMDg3MjY1MDE3fQ.g5GzYucCUT1kqQPfx5YdeVPZbPILVSrkfrhJR-XjpGM'
);

async function applyRLSFix() {
  try {
    console.log('=== Applying RLS Policy Fix ===');
    
    // Read the SQL file
    const sqlContent = fs.readFileSync('fix_claims_rls.sql', 'utf8');
    
    // Split into individual statements
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        console.log(`Executing statement ${i + 1}/${statements.length}: ${statement.substring(0, 50)}...`);
        
        // Use raw SQL execution via PostgREST
        const { error } = await supabaseAdmin
          .from('claim_requests')
          .select('*')
          .limit(1); // This is just to test connection
        
        if (error && error.code !== 'PGRST116') {
          console.error(`Connection test failed:`, error);
        }
        
        // For now, let's manually create the policies using individual calls
        console.log(`✓ Statement ${i + 1} prepared`);
      }
    }
    
    console.log('\n=== Manual RLS Policy Creation ===');
    
    // Create the policies manually using the service role
    const policies = [
      // Drop existing policies
      "DROP POLICY IF EXISTS \"Users can view own claim_requests\" ON claim_requests",
      "DROP POLICY IF EXISTS \"Users can insert own claim_requests\" ON claim_requests", 
      "DROP POLICY IF EXISTS \"Users can update own claim_requests\" ON claim_requests",
      "DROP POLICY IF EXISTS \"Users can delete own claim_requests\" ON claim_requests",
      
      // Create new policies
      "CREATE POLICY \"Allow authenticated users to read claim_requests\" ON claim_requests FOR SELECT USING (auth.role() = 'authenticated')",
      "CREATE POLICY \"Allow users to insert own claim_requests\" ON claim_requests FOR INSERT WITH CHECK (auth.uid() = user_id)",
      "CREATE POLICY \"Allow users to update own claim_requests\" ON claim_requests FOR UPDATE USING (auth.uid() = user_id)",
      "CREATE POLICY \"Allow users to delete own claim_requests\" ON claim_requests FOR DELETE USING (auth.uid() = user_id)",
      
      // Enable RLS
      "ALTER TABLE claim_requests ENABLE ROW LEVEL SECURITY"
    ];
    
    for (const policy of policies) {
      console.log(`Executing: ${policy.substring(0, 60)}...`);
      
      // We need to use raw SQL, but let's try a different approach
      console.log('Policy prepared (manual execution required)');
    }
    
    console.log('\n=== Next Steps ===');
    console.log('The SQL statements are prepared in fix_claims_rls.sql');
    console.log('You need to execute them manually in the Supabase dashboard:');
    console.log('1. Go to https://supabase.com/dashboard/project/mnmisjprswpuvcojnbip');
    console.log('2. Go to SQL Editor');
    console.log('3. Copy and paste the contents of fix_claims_rls.sql');
    console.log('4. Run the SQL script');
    
    console.log('\n=== Testing current state ===');
    
    // Test with anon key (simulating dashboard)
    const supabaseAnon = createClient(
      'https://mnmisjprswpuvcojnbip.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubWlzanByc3dwdXZjb2puYmlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2ODkwMTcsImV4cCI6MjA4NzI2NTAxN30.vl7Em91jGQP8mse-CJkIxTtuxWswoDO6sdSFLhhEc9A'
    );
    
    const { data: testClaims, error: testError } = await supabaseAnon
      .from('claim_requests')
      .select('id, business_id, status, contact_email')
      .limit(5);
    
    if (testError) {
      console.log('Current state - Anon key access:', testError.message);
    } else {
      console.log(`Current state - Found ${testClaims?.length || 0} claims with anon key`);
      testClaims?.forEach(c => {
        console.log(`- Claim ${c.id} (business: ${c.business_id}, status: ${c.status})`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

applyRLSFix();
