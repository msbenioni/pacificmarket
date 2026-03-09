const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mnmisjprswpuvcojnbip.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubWlzanByc3dwdXZjb2puYmlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2ODkwMTcsImV4cCI6MjA4NzI2NTAxN30.vl7Em91jGQP8mse-CJkIxTtuxWswoDO6sdSFLhhEc9A';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLogoUrls() {
  try {
    console.log('Checking logo URLs in businesses table...');
    
    // Check logo_url values in businesses table
    const { data: businesses, error } = await supabase
      .from('businesses')
      .select('id, name, logo_url, status')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) {
      console.error('Error fetching businesses:', error);
      return;
    }
    
    console.log('\nSample businesses and their logo status:');
    console.log('==========================================');
    
    businesses.forEach(business => {
      const logoStatus = business.logo_url ? 
        (business.logo_url.includes('supabase') ? 'SUPABASE_URL' : 'OTHER_URL') : 
        'NULL';
      
      console.log(`Business: ${business.name}`);
      console.log(`ID: ${business.id}`);
      console.log(`Logo URL: ${business.logo_url || 'NULL'}`);
      console.log(`Status: ${logoStatus}`);
      console.log('---');
    });
    
    // Count businesses with/without logos
    const { count, error: countError } = await supabase
      .from('businesses')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');
    
    const { count: withLogos, error: logosError } = await supabase
      .from('businesses')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
      .not('logo_url', 'is', null);
    
    if (countError || logosError) {
      console.error('Error counting businesses:', countError || logosError);
    } else {
      console.log(`\nSummary:`);
      console.log(`Total active businesses: ${count}`);
      console.log(`Businesses with logos: ${withLogos}`);
      console.log(`Businesses without logos: ${count - withLogos}`);
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

checkLogoUrls();
