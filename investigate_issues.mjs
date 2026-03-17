import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://mnmisjprswpuvcojnbip.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubWlzanByc3dwdXZjb2puYmlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2ODkwMTcsImV4cCI6MjA4NzI2NTAxN30.vl7Em91jGQP8mse-CJkIxTtuxWswoDO6sdSFLhhEc9A');

async function investigateIssues() {
  try {
    console.log('=== Investigating business creation issue ===');
    
    // Check for businesses created in the last few hours
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    
    const { data: recentBusinesses, error: recentError } = await supabase
      .from('businesses')
      .select('id, name, status, created_at, created_by')
      .gte('created_at', twoHoursAgo)
      .order('created_at', { ascending: false });
    
    if (recentError) {
      console.error('Error checking recent businesses:', recentError);
    } else {
      console.log(`Businesses created in last 2 hours: ${recentBusinesses?.length || 0}`);
      recentBusinesses?.forEach(b => {
        console.log(`- ${business.business_name} (status: ${b.status}, created: ${b.created_at}, by: ${b.created_by})`);
      });
    }
    
    console.log('\n=== Testing claims query (exact dashboard query) ===');
    
    // Test the exact claims query from dashboard
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
    
    console.log('\n=== Checking business table schema ===');
    
    // Check if there are any issues with the business table structure
    const { data: businessColumns, error: schemaError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'businesses')
      .eq('table_schema', 'public')
      .in('column_name', ['status', 'is_claimed', 'claimed', 'claimed_at', 'claimed_by']);
    
    if (schemaError) {
      console.error('Schema check error:', schemaError);
    } else {
      console.log('Business table claim-related columns:');
      businessColumns?.forEach(col => {
        console.log(`- ${col.column_name} (${col.data_type}, nullable: ${col.is_nullable})`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

investigateIssues();
