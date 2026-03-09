const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mnmisjprswpuvcojnbip.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubWlzanByc3dwdXZjb2puYmlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2ODkwMTcsImV4cCI6MjA4NzI2NTAxN30.vl7Em91jGQP8mse-CJkIxTtuxWswoDO6sdSFLhhEc9A';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkVisibilityTier() {
  try {
    console.log('Checking visibility_tier values...');
    
    const { data, error } = await supabase
      .from('businesses')
      .select('id, name, visibility_tier')
      .limit(10);
    
    if (error) {
      console.error('Error:', error);
      return;
    }
    
    console.log('\nSample visibility_tier values:');
    console.log('=============================');
    data.forEach(business => {
      console.log(`${business.name}: ${business.visibility_tier}`);
    });
    
    // Check all unique values
    const { data: allData } = await supabase
      .from('businesses')
      .select('visibility_tier');
    
    if (allData) {
      const uniqueValues = [...new Set(allData.map(item => item.visibility_tier).filter(Boolean))];
      console.log('\nAll unique visibility_tier values:');
      console.log('==================================');
      uniqueValues.forEach(value => console.log(`- ${value}`));
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

checkVisibilityTier();
