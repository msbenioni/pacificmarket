const { createClient } = require('@supabase/supabase-js');

// Database connection from environment
const supabaseUrl = 'https://mnmisjprswpuvcojnbip.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubWlzanByc3dwdXZjb2puYmlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwOTc5MTU3MiwiZXhwIjoyMDI1MzY3NTcyfQ.nXqS8Q8WzJHlM9Y7pWn1L8w7jK1X2m3l4k5j6h7g8f9e';

const supabase = createClient(supabaseUrl, supabaseKey);

async function analyzeProfilesAndAuth() {
  console.log('🔍 ANALYZING PROFILES TABLE & AUTH SYSTEM...\n');

  try {
    // 1. Check profiles table structure
    console.log('📋 PROFILES TABLE STRUCTURE:');
    const { data: profilesColumns, error: profilesError } = await supabase
      .rpc('get_table_columns', { table_name: 'profiles' });
    
    if (profilesError) {
      console.log('❌ Error getting profiles columns:', profilesError);
    } else {
      console.log(profilesColumns);
    }

    // 2. Check RLS policies
    console.log('\n🔒 RLS POLICIES FOR PROFILES:');
    const { data: rlsPolicies, error: rlsError } = await supabase
      .from('pg_policies')
      .select('*')
      .eq('tablename', 'profiles');
    
    if (rlsError) {
      console.log('❌ Error getting RLS policies:', rlsError.message);
    } else {
      console.log(rlsPolicies);
    }

    // 3. Check sample profiles data
    console.log('\n📊 SAMPLE PROFILES DATA:');
    const { data: profilesData, error: dataError } = await supabase
      .from('profiles')
      .select('id, user_id, email, display_name, city, country, primary_cultural, languages, role')
      .limit(3);
    
    if (dataError) {
      console.log('❌ Error getting profiles data:', dataError.message);
    } else {
      console.log(profilesData);
    }

    // 4. Test current user access
    console.log('\n👤 CURRENT USER ACCESS TEST:');
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.log('❌ Error getting current user:', userError.message);
    } else {
      console.log('Current user:', user);
      
      // Test profile access
      const { data: userProfiles, error: accessError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id);
      
      if (accessError) {
        console.log('❌ Error accessing user profile:', accessError.message);
      } else {
        console.log('User profiles:', userProfiles);
      }
    }

    // 5. Check auth.users metadata
    console.log('\n🔐 AUTH.USERS METADATA STRUCTURE:');
    // Note: We can't directly query auth.users, but we can see what metadata we get
    
    console.log('✅ Analysis complete!');

  } catch (error) {
    console.error('❌ Analysis failed:', error);
  }
}

analyzeProfilesAndAuth();
