import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://mnmisjprswpuvcojnbip.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubWlzanByc3dwdXZjb2puYmlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2ODkwMTcsImV4cCI6MjA4NzI2NTAxN30.vl7Em91jGQP8mse-CJkIxTtuxWswoDO6sdSFLhhEc9A');

async function findClaims() {
  try {
    console.log('=== Looking for claims in different tables ===');
    
    // Check for tables with 'claim' in the name
    const possibleTables = [
      'claim_requests',
      'claims',
      'business_claims',
      'claim_requests_old',
      'claim_requests_backup'
    ];
    
    for (const tableName of possibleTables) {
      console.log(`\n--- Checking table: ${tableName} ---`);
      
      try {
        const { count, error: countError } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });
        
        if (countError) {
          console.log(`Table ${tableName}: ${countError.message}`);
        } else {
          console.log(`Table ${tableName}: ${count} records found`);
          
          if (count > 0) {
            // Get a few records to see the structure
            const { data: records, error: dataError } = await supabase
              .from(tableName)
              .select('*')
              .limit(3);
            
            if (!dataError && records) {
              console.log('Sample records:');
              records.forEach(r => {
                console.log(`  - ID: ${r.id}, Status: ${r.status}, Email: ${r.contact_email || r.email || 'no email'}`);
              });
            }
          }
        }
      } catch (tableError) {
        console.log(`Table ${tableName}: Error - ${tableError.message}`);
      }
    }
    
    console.log('\n=== Checking recent activity ===');
    
    // Check if there are any recent business creation attempts
    const { data: recentBusinesses, error: recentError } = await supabase
      .from('businesses')
      .select('id, name, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (recentError) {
      console.error('Recent businesses error:', recentError);
    } else {
      console.log('Most recent businesses:');
      recentBusinesses?.forEach(b => {
        console.log(`- ${business.business_name} (status: ${b.status}, created: ${b.created_at})`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

findClaims();
