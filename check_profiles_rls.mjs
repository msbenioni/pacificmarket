import { createClient } from '@supabase/supabase-js';

// Use service role key to check RLS policies
const supabaseAdmin = createClient(
  'https://mnmisjprswpuvcojnbip.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubWlzanByc3dwdXZjb2puYmlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTY4OTAxNywiZXhwIjoyMDg3MjY1MDE3fQ.g5GzYucCUT1kqQPfx5YdeVPZbPILVSrkfrhJR-XjpGM'
);

async function checkProfilesRLS() {
  try {
    console.log('=== Testing Profiles RLS Policies ===');
    
    // Test with anon key (what the app uses)
    const supabaseAnon = createClient(
      'https://mnmisjprswpuvcojnbip.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubWlzanByc3dwdXZjb2puYmlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2ODkwMTcsImV4cCI6MjA4NzI2NTAxN30.vl7Em91jGQP8mse-CJkIxTtuxWswoDO6sdSFLhhEc9A'
    );
    
    // Test 1: Can we read profiles with anon key?
    console.log('\n--- Test 1: Reading profiles with anon key ---');
    const { data: readTest, error: readError } = await supabaseAnon
      .from('profiles')
      .select('id, email')
      .limit(1);
    
    if (readError) {
      console.log('❌ Read access denied:', readError.message);
      console.log('This explains why profile creation fails');
    } else {
      console.log('✅ Read access allowed');
    }
    
    // Test 2: Can we insert a profile with anon key?
    console.log('\n--- Test 2: Inserting profile with anon key ---');
    const testProfile = {
      id: 'test-user-id',
      email: 'test@example.com',
      display_name: 'Test User',
      role: 'owner',
      status: 'active',
      gdpr_consent: true,
      gdpr_consent_date: new Date().toISOString()
    };
    
    const { data: insertTest, error: insertError } = await supabaseAnon
      .from('profiles')
      .insert(testProfile)
      .select('id, email')
      .single();
    
    if (insertError) {
      console.log('❌ Insert access denied:', insertError.message);
      console.log('This is the root cause of the profile creation error');
    } else {
      console.log('✅ Insert access allowed:', insertTest);
      
      // Clean up the test profile
      await supabaseAdmin
        .from('profiles')
        .delete()
        .eq('id', 'test-user-id');
    }
    
    // Test 3: Check existing policies on profiles table
    console.log('\n--- Test 3: Checking existing policies ---');
    // We can't easily check policies with anon key, but we can infer from the errors
    
    console.log('\n=== Recommendation ===');
    if (readError || insertError) {
      console.log('The profiles table likely has restrictive RLS policies.');
      console.log('Authenticated users need policies to:');
      console.log('1. Insert their own profile (for signup)');
      console.log('2. Read their own profile (for login)');
      console.log('3. Update their own profile (for editing)');
    } else {
      console.log('RLS policies appear to be working correctly.');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkProfilesRLS();
