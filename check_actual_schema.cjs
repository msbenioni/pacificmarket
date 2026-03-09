const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mnmisjprswpuvcojnbip.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubWlzanByc3dwdXZjb2puYmlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2ODkwMTcsImV4cCI6MjA4NzI2NTAxN30.vl7Em91jGQP8mse-CJkIxTtuxWswoDO6sdSFLhhEc9A';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkActualSchema() {
  try {
    console.log('Checking actual production database schema...');
    
    // Test if subscription_tier column exists by trying to select it specifically
    console.log('\n=== Testing subscription_tier column ===');
    const { data: testData, error: testError } = await supabase
      .from('businesses')
      .select('id, subscription_tier')
      .limit(1);
    
    if (testError) {
      console.log('❌ subscription_tier column test failed:', testError.message);
      console.log('Error code:', testError.code);
    } else {
      console.log('✅ subscription_tier column exists');
      if (testData && testData.length > 0) {
        console.log('Sample data:', testData[0]);
      }
    }
    
    // Check what columns we can actually select
    console.log('\n=== Checking all accessible columns ===');
    const { data: allData, error: allError } = await supabase
      .from('businesses')
      .select('*')
      .limit(1);
    
    if (allError) {
      console.log('Error selecting all columns:', allError.message);
    } else if (allData && allData.length > 0) {
      const columns = Object.keys(allData[0]);
      console.log('Actually available columns:');
      columns.forEach(col => console.log(`- ${col}`));
      
      // Look for any subscription-related columns
      const subColumns = columns.filter(col => 
        col.toLowerCase().includes('subscription') || 
        col.toLowerCase().includes('plan') ||
        col.toLowerCase().includes('tier')
      );
      
      console.log('\nSubscription/plan/tier related columns:');
      if (subColumns.length > 0) {
        subColumns.forEach(col => console.log(`- ${col}`));
      } else {
        console.log('❌ No subscription/plan/tier columns found');
      }
    }
    
    // Check if there's a plan_type column instead
    console.log('\n=== Testing plan_type column ===');
    const { data: planData, error: planError } = await supabase
      .from('businesses')
      .select('id, plan_type')
      .limit(1);
    
    if (planError) {
      console.log('❌ plan_type column test failed:', planError.message);
    } else {
      console.log('✅ plan_type column exists');
      if (planData && planData.length > 0) {
        console.log('Sample data:', planData[0]);
      }
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

checkActualSchema();
