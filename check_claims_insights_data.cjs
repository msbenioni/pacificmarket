const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mnmisjprswpuvcojnbip.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubWlzanByc3dwdXZjb2puYmlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2ODkwMTcsImV4cCI6MjA4NzI2NTAxN30.vl7Em91jGQP8mse-CJkIxTtuxWswoDO6sdSFLhhEc9A';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkClaimsAndInsights() {
  try {
    console.log('Checking claims and insights data...');
    
    // Check claim_requests table structure and data
    console.log('\n=== Checking claim_requests table ===');
    const { data: claimsData, error: claimsError } = await supabase
      .from('claim_requests')
      .select('*')
      .limit(10);
    
    if (claimsError) {
      console.log('❌ Claims query failed:', claimsError.message);
      console.log('Error code:', claimsError.code);
    } else {
      console.log(`✅ Found ${claimsData?.length || 0} claim requests`);
      if (claimsData && claimsData.length > 0) {
        console.log('Sample claim request:', claimsData[0]);
        console.log('Available columns:', Object.keys(claimsData[0]));
      }
    }
    
    // Check business_insights_snapshots table
    console.log('\n=== Checking business_insights_snapshots table ===');
    const { data: snapshotsData, error: snapshotsError } = await supabase
      .from('business_insights_snapshots')
      .select('*')
      .limit(10);
    
    if (snapshotsError) {
      console.log('❌ Snapshots query failed:', snapshotsError.message);
      console.log('Error code:', snapshotsError.code);
    } else {
      console.log(`✅ Found ${snapshotsData?.length || 0} insight snapshots`);
      if (snapshotsData && snapshotsData.length > 0) {
        console.log('Sample snapshot:', snapshotsData[0]);
        console.log('Available columns:', Object.keys(snapshotsData[0]));
      }
    }
    
    // Check if tables exist by trying different approaches
    console.log('\n=== Checking table existence ===');
    
    // Try to get table info
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['claim_requests', 'business_insights_snapshots']);
    
    if (tablesError) {
      console.log('Cannot check table existence:', tablesError.message);
    } else {
      console.log('Found tables:', tables?.map(t => t.table_name) || []);
    }
    
    // Test the exact query from AdminDashboard
    console.log('\n=== Testing AdminDashboard claims query ===');
    const { data: adminClaimsData, error: adminClaimsError } = await supabase
      .from('claim_requests')
      .select(`
        id, business_id, user_id, status, contact_email, contact_phone,
        verification_documents, rejection_reason, reviewed_by, reviewed_at,
        business_name, user_email, role, proof_url, created_at
      `)
      .order('created_at', { ascending: false })
      .limit(100);
    
    if (adminClaimsError) {
      console.log('❌ AdminDashboard claims query failed:', adminClaimsError.message);
      console.log('Trying created_date instead...');
      
      // Try with created_date
      const { data: altClaimsData, error: altClaimsError } = await supabase
        .from('claim_requests')
        .select('*')
        .order('created_date', { ascending: false })
        .limit(5);
      
      if (altClaimsError) {
        console.log('❌ Alternative claims query also failed:', altClaimsError.message);
      } else {
        console.log('✅ Alternative query worked, found:', altClaimsData?.length || 0);
      }
    } else {
      console.log(`✅ AdminDashboard claims query worked: ${adminClaimsData?.length || 0} claims`);
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

checkClaimsAndInsights();
