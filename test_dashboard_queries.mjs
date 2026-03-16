import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://mnmisjprswpuvcojnbip.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubWlzanByc3dwdXZjb2puYmlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2ODkwMTcsImV4cCI6MjA4NzI2NTAxN30.vl7Em91jGQP8mse-CJkIxTtuxWswoDO6sdSFLhhEc9A');

async function testClaimsQuery() {
  try {
    console.log('=== Testing exact dashboard claims query ===');
    
    // This is the exact query from the dashboard
    const { data: claims, error: claimsError } = await supabase
      .from("claim_requests")
      .select(`
        id, business_id, user_id, status, contact_email, contact_phone,
        role, proof_url, created_at, claim_type, message,
        reviewed_by, reviewed_at
      `)
      .order("created_at", { ascending: false })
      .limit(100);
    
    if (claimsError) {
      console.error('Claims query error:', claimsError);
    } else {
      console.log(`Claims found: ${claims?.length || 0}`);
      claims?.forEach(c => {
        console.log(`- Claim ${c.id} (business: ${c.business_id}, status: ${c.status}, email: ${c.contact_email})`);
      });
    }
    
    console.log('\n=== Testing businesses query ===');
    
    // Test the businesses query too
    const { getSupabase } = await import('./src/lib/supabase/client.js');
    const supabaseClient = getSupabase();
    
    const { data: businesses, error: businessesError } = await supabaseClient
      .from('businesses')
      .select('id, name, status, created_at')
      .in('status', ['active', 'pending', 'rejected'])
      .order('created_at', { ascending: false })
      .limit(500);
    
    if (businessesError) {
      console.error('Businesses query error:', businessesError);
    } else {
      console.log(`Businesses found: ${businesses?.length || 0}`);
      const pendingCount = businesses?.filter(b => b.status === 'pending').length || 0;
      console.log(`Pending businesses: ${pendingCount}`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testClaimsQuery();
