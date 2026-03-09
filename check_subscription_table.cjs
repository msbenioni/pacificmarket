const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mnmisjprswpuvcojnbip.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubWlzanByc3dwdXZjb2puYmlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2ODkwMTcsImV4cCI6MjA4NzI2NTAxN30.vl7Em91jGQP8mse-CJkIxTtuxWswoDO6sdSFLhhEc9A';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSubscriptionTable() {
  try {
    console.log('Checking subscription-related tables and columns...');
    
    // Check if there's a subscriptions table
    console.log('\n=== Checking for subscriptions table ===');
    const { data: subscriptionsData, error: subscriptionsError } = await supabase
      .from('subscriptions')
      .select('*')
      .limit(1);
    
    if (subscriptionsError) {
      console.log('Subscriptions table error:', subscriptionsError.message);
    } else {
      console.log('✅ Subscriptions table exists');
      if (subscriptionsData && subscriptionsData.length > 0) {
        console.log('Columns in subscriptions table:', Object.keys(subscriptionsData[0]));
      }
    }
    
    // Check businesses table for subscription/plan columns
    console.log('\n=== Checking businesses table for subscription columns ===');
    const { data: businessData, error: businessError } = await supabase
      .from('businesses')
      .select('*')
      .limit(1);
    
    if (businessError) {
      console.log('Businesses table error:', businessError.message);
    } else if (businessData && businessData.length > 0) {
      const columns = Object.keys(businessData[0]);
      const subscriptionColumns = columns.filter(col => 
        col.toLowerCase().includes('subscription') || 
        col.toLowerCase().includes('plan') ||
        col.toLowerCase().includes('tier')
      );
      
      console.log('Subscription/plan/tier related columns in businesses:');
      subscriptionColumns.forEach(col => console.log(`- ${col}`));
      
      // Show sample values for these columns
      console.log('\nSample values:');
      subscriptionColumns.forEach(col => {
        console.log(`${col}: ${businessData[0][col]}`);
      });
    }
    
    // Check user_profiles or profiles table for subscription info
    console.log('\n=== Checking profiles table ===');
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (profileError) {
      console.log('Profiles table error:', profileError.message);
    } else if (profileData && profileData.length > 0) {
      const columns = Object.keys(profileData[0]);
      const subscriptionColumns = columns.filter(col => 
        col.toLowerCase().includes('subscription') || 
        col.toLowerCase().includes('plan') ||
        col.toLowerCase().includes('tier')
      );
      
      console.log('Subscription/plan/tier related columns in profiles:');
      subscriptionColumns.forEach(col => console.log(`- ${col}`));
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

checkSubscriptionTable();
