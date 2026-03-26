import { createClient } from '@supabase/supabase-js';

// Database connection
const supabaseUrl = 'https://mnmisjprswpuvcojnbip.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tbWlzanByc3dwdXZjb2puYmlwIiwicm9sZSI6ImFwaV9hZG1pbiIsImlhdCI6MTczNzUzNjU4NCwiZXhwIjoyMDUzMTEyNTg0fQ.KqTqH8Lz_Xs-BNW2yJ3qQ3qJx3L_G9pJlJ5o7u8L0x8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCurrentData() {
  try {
    console.log('Checking current cultural identity data...');
    
    const { data, error } = await supabase
      .from('businesses')
      .select('id, business_name, cultural_identity')
      .not('cultural_identity', 'is', null)
      .limit(10);
    
    if (error) {
      console.error('Error:', error);
      return;
    }
    
    console.log('Sample current data:');
    data.forEach((business, i) => {
      console.log(`${i+1}. ${business.business_name}: ${JSON.stringify(business.cultural_identity)}`);
    });
    
    // Get summary of all unique cultural identities
    const { data: allData, error: allError } = await supabase
      .from('businesses')
      .select('cultural_identity')
      .not('cultural_identity', 'is', null);
    
    if (allError) {
      console.error('Error getting all data:', allError);
      return;
    }
    
    const uniqueIdentities = new Set();
    allData.forEach(business => {
      const identities = business.cultural_identity;
      if (Array.isArray(identities)) {
        identities.forEach(id => uniqueIdentities.add(id));
      } else if (identities) {
        uniqueIdentities.add(identities);
      }
    });
    
    console.log('\nAll unique cultural identities found:');
    Array.from(uniqueIdentities).sort().forEach((identity, i) => {
      console.log(`${i+1}. ${identity}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkCurrentData();
