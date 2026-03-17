import { createClient } from '@supabase/supabase-js';

// Use service role key to check RLS policies
const supabaseAdmin = createClient(
  'https://mnmisjprswpuvcojnbip.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubWlzanByc3dwdXZjb2puYmlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTY4OTAxNywiZXhwIjoyMDg3MjY1MDE3fQ.g5GzYucCUT1kqQPfx5YdeVPZbPILVSrkfrhJR-XjpGM'
);

async function checkBusinessesRLS() {
  try {
    console.log('=== Testing Business Creation RLS ===');
    
    // Test with anon key (what the app uses)
    const supabaseAnon = createClient(
      'https://mnmisjprswpuvcojnbip.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubWlzanByc3dwdXZjb2puYmlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2ODkwMTcsImV4cCI6MjA4NzI2NTAxN30.vl7Em91jGQP8mse-CJkIxTtuxWswoDO6sdSFLhhEc9A'
    );
    
    // Test 1: Can we read businesses with anon key?
    console.log('\n--- Test 1: Reading businesses with anon key ---');
    const { data: readTest, error: readError } = await supabaseAnon
      .from('businesses')
      .select('id, name')
      .limit(1);
    
    if (readError) {
      console.log('❌ Read access denied:', readError.message);
    } else {
      console.log('✅ Read access allowed');
    }
    
    // Test 2: Can we insert a business with anon key?
    console.log('\n--- Test 2: Inserting business with anon key ---');
    const testBusiness = {
      name: 'Test Business for RLS Check',
      business_handle: 'test-rls-' + Date.now(),
      description: 'Testing RLS policies',
      contact_email: 'test@example.com',
      country: 'NZ',
      city: 'Auckland',
      industry: 'technology',
      status: 'pending',
      is_verified: false,
      subscription_tier: 'vaka',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_date: new Date().toISOString().split('T')[0]
    };
    
    const { data: insertTest, error: insertError } = await supabaseAnon
      .from('businesses')
      .insert(testBusiness)
      .select('id, name');
    
    if (insertError) {
      console.log('❌ Insert access denied:', insertError.message);
      console.log('This explains why new businesses are not saving!');
    } else {
      console.log('✅ Insert access allowed');
      console.log('Test business created:', insertTest);
      
      // Clean up the test business
      await supabaseAdmin
        .from('businesses')
        .delete()
        .eq('id', insertTest[0].id);
    }
    
    // Test 3: Check recent businesses to see if any were created
    console.log('\n--- Test 3: Checking recent businesses ---');
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    
    const { data: recentBusinesses, error: recentError } = await supabaseAdmin
      .from('businesses')
      .select('id, name, status, created_at, owner_user_id')
      .gte('created_at', fiveMinutesAgo)
      .order('created_at', { ascending: false });
    
    if (recentError) {
      console.error('Error checking recent businesses:', recentError);
    } else {
      console.log(`Businesses created in last 5 minutes: ${recentBusinesses?.length || 0}`);
      recentBusinesses?.forEach(b => {
        console.log(`- ${business.business_name} (status: ${b.status}, owner: ${b.owner_user_id || 'null'})`);
      });
    }
    
    console.log('\n=== RLS Policy Diagnosis ===');
    console.log('If insert access is denied, you need to add an RLS policy for business creation.');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkBusinessesRLS();
