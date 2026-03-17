import { createClient } from '@supabase/supabase-js';

// Use service role key to see the actual claims
const supabaseAdmin = createClient(
  'https://mnmisjprswpuvcojnbip.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubWlzanByc3dwdXZjb2puYmlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTY4OTAxNywiZXhwIjoyMDg3MjY1MDE3fQ.g5GzYucCUT1kqQPfx5YdeVPZbPILVSrkfrhJR-XjpGM'
);

async function checkActualClaims() {
  try {
    console.log('=== Checking actual claims with service role ===');
    
    const { data: claims, error: claimsError } = await supabaseAdmin
      .from('claim_requests')
      .select(`
        id, business_id, user_id, status, contact_email, contact_phone,
        role, proof_url, created_at, claim_type, message,
        reviewed_by, reviewed_at
      `)
      .order('created_at', { ascending: false });
    
    if (claimsError) {
      console.error('Error:', claimsError);
    } else {
      console.log(`Found ${claims?.length || 0} claims:`);
      claims?.forEach(c => {
        console.log(`\n--- Claim ${c.id} ---`);
        console.log(`Business ID: ${c.business_id}`);
        console.log(`Status: ${c.status}`);
        console.log(`Email: ${c.contact_email}`);
        console.log(`Created: ${c.created_at}`);
        console.log(`Message: ${c.message}`);
        
        // Get the business name
        supabaseAdmin
          .from('businesses')
          .select('name, status')
          .eq('id', c.business_id)
          .single()
          .then(({ data: business, error: businessError }) => {
            if (!businessError && business) {
              console.log(`Business: ${business.business_name} (status: ${business.status})`);
            }
          });
      });
    }
    
    console.log('\n=== The issue is RLS policies ===');
    console.log('The dashboard uses the anon key, but RLS policies prevent it from seeing claims.');
    console.log('We need to update the RLS policy to allow authenticated users to see claims.');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkActualClaims();
