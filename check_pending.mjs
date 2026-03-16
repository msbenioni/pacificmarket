import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://mnmisjprswpuvcojnbip.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubWlzanByc3dwdXZjb2puYmlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2ODkwMTcsImV4cCI6MjA4NzI2NTAxN30.vl7Em91jGQP8mse-CJkIxTtuxWswoDO6sdSFLhhEc9A');

async function checkAllTables() {
  try {
    console.log('=== Checking recent businesses ===');
    
    // Check recent businesses to see if any are pending
    const { data: recentBusinesses, error: recentError } = await supabase
      .from('businesses')
      .select('id, name, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (recentError) {
      console.error('Recent businesses error:', recentError);
    } else {
      console.log('Recent businesses:');
      recentBusinesses?.forEach(b => {
        console.log(`- ${b.name} (status: ${b.status}, created: ${b.created_at})`);
      });
    }

    console.log('\n=== Checking for any business with pending status ===');
    const { data: pendingBusinesses, error: pendingError } = await supabase
      .from('businesses')
      .select('id, name, status, created_at')
      .eq('status', 'pending');
    
    if (pendingError) {
      console.error('Pending businesses error:', pendingError);
    } else {
      console.log('Pending businesses found:', pendingBusinesses?.length || 0);
      pendingBusinesses?.forEach(b => {
        console.log(`- ${b.name} (status: ${b.status}, created: ${b.created_at})`);
      });
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

checkAllTables();
