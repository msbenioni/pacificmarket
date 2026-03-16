import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://mnmisjprswpuvcojnbip.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubWlzanByc3dwdXZjb2puYmlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2ODkwMTcsImV4cCI6MjA4NzI2NTAxN30.vl7Em91jGQP8mse-CJkIxTtuxWswoDO6sdSFLhhEc9A');

async function debugClaims() {
  try {
    console.log('=== Debugging claims issue ===');
    
    // First try a simple count
    const { count, error: countError } = await supabase
      .from('claim_requests')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('Count error:', countError);
    } else {
      console.log(`Total claims in table: ${count}`);
    }
    
    // Try a simple select without specific fields
    const { data: allClaims, error: allError } = await supabase
      .from('claim_requests')
      .select('*')
      .limit(10);
    
    if (allError) {
      console.error('All claims error:', allError);
    } else {
      console.log(`All claims query returned: ${allClaims?.length || 0} items`);
      allClaims?.forEach(c => {
        console.log(`- ID: ${c.id}, Status: ${c.status}, Email: ${c.contact_email}`);
      });
    }
    
    // Try the exact query but with different field selection
    const { data: exactClaims, error: exactError } = await supabase
      .from("claim_requests")
      .select("id, business_id, user_id, status, contact_email")
      .order("created_at", { ascending: false })
      .limit(100);
    
    if (exactError) {
      console.error('Exact query error:', exactError);
    } else {
      console.log(`Exact query returned: ${exactClaims?.length || 0} items`);
      exactClaims?.forEach(c => {
        console.log(`- Claim ${c.id} (business: ${c.business_id}, status: ${c.status})`);
      });
    }
    
    console.log('\n=== Checking if dashboard is using different auth ===');
    
    // Check if the dashboard is using a different supabase client
    try {
      const { getSupabase } = await import('./src/lib/supabase/client.js');
      const dashboardSupabase = getSupabase();
      
      const { data: dashboardClaims, error: dashboardError } = await dashboardSupabase
        .from("claim_requests")
        .select("id, business_id, user_id, status, contact_email")
        .order("created_at", { ascending: false })
        .limit(5);
      
      if (dashboardError) {
        console.error('Dashboard claims error:', dashboardError);
      } else {
        console.log(`Dashboard query returned: ${dashboardClaims?.length || 0} items`);
        dashboardClaims?.forEach(c => {
          console.log(`- Claim ${c.id} (business: ${c.business_id}, status: ${c.status})`);
        });
      }
    } catch (importError) {
      console.error('Could not import dashboard supabase client:', importError);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

debugClaims();
