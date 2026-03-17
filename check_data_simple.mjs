import { createClient } from '@supabase/supabase-js';

// Load environment variables
const supabaseUrl = 'https://mnmisjprswpuvcojnbip.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubWlzanByc3dwdXZjb2puYmlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2ODkwMTcsImV4cCI6MjA4NzI2NTAxN30.vl7Em91jGQP8mse-CJkIxTtuxWswoDO6sdSFLhhEc9A';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  try {
    console.log('=== Checking Businesses ===');
    const { data: businesses, error: businessError } = await supabase
      .from('businesses')
      .select('id, name, status, created_at')
      .order('created_at', { ascending: false });
    
    if (businessError) {
      console.error('Business error:', businessError);
    } else {
      console.log('Businesses found:', businesses?.length || 0);
      businesses?.forEach(b => {
        console.log(`- ${business.business_name} (status: ${b.status}, created: ${b.created_at})`);
      });
    }

    console.log('\n=== Checking Claims ===');
    const { data: claims, error: claimsError } = await supabase
      .from('claim_requests')
      .select('id, business_id, user_id, status, created_at, contact_email')
      .order('created_at', { ascending: false });
    
    if (claimsError) {
      console.error('Claims error:', claimsError);
    } else {
      console.log('Claims found:', claims?.length || 0);
      claims?.forEach(c => {
        console.log(`- Claim ${c.id} (business_id: ${c.business_id}, status: ${c.status}, email: ${c.contact_email})`);
      });
    }

  } catch (error) {
    console.error('Connection error:', error);
  }
}

checkData();
