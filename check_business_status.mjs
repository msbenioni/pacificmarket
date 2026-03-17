import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://mnmisjprswpuvcojnbip.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubWlzanByc3dwdXZjb2puYmlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2ODkwMTcsImV4cCI6MjA4NzI2NTAxN30.vl7Em91jGQP8mse-CJkIxTtuxWswoDO6sdSFLhhEc9A');

async function checkBusinessStatus() {
  try {
    console.log('=== Checking business details ===');
    
    // Check the businesses referenced in the claims
    const businessIds = [
      'e0e03cd4-3a8b-48f9-8ffa-546abfa7925c',
      '1ceaf4d4-8a5e-4f25-b75f-43a05cd656fb'
    ];
    
    for (const businessId of businessIds) {
      console.log(`\n--- Checking business ${businessId} ---`);
      
      const { data: business, error: businessError } = await supabase
        .from('businesses')
        .select('id, name, status, created_at, created_date')
        .eq('id', businessId)
        .single();
      
      if (businessError) {
        console.error(`Error for business ${businessId}:`, businessError);
      } else {
        console.log(`Business: ${business.business_name}`);
        console.log(`Status: ${business.status}`);
        console.log(`Created at: ${business.created_at}`);
        console.log(`Created date: ${business.created_date}`);
      }
    }
    
    console.log('\n=== All businesses with pending status ===');
    const { data: pendingBusinesses, error: pendingError } = await supabase
      .from('businesses')
      .select('id, name, status, created_at')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    
    if (pendingError) {
      console.error('Error getting pending businesses:', pendingError);
    } else {
      console.log(`Pending businesses found: ${pendingBusinesses?.length || 0}`);
      pendingBusinesses?.forEach(b => {
        console.log(`- ${business.business_name} (ID: ${b.id}, created: ${b.created_at})`);
      });
    }
    
    console.log('\n=== Most recent businesses ===');
    const { data: recentBusinesses, error: recentError } = await supabase
      .from('businesses')
      .select('id, name, status, created_at')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (recentError) {
      console.error('Error getting recent businesses:', recentError);
    } else {
      console.log('Recent businesses:');
      recentBusinesses?.forEach(b => {
        console.log(`- ${business.business_name} (status: ${b.status}, created: ${b.created_at})`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkBusinessStatus();
