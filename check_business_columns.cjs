const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mnmisjprswpuvcojnbip.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubWlzanByc3dwdXZjb2puYmlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2ODkwMTcsImV4cCI6MjA4NzI2NTAxN30.vl7Em91jGQP8mse-CJkIxTtuxWswoDO6sdSFLhhEc9A';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBusinessColumns() {
  try {
    console.log('Checking businesses table columns...');
    
    // Try to select a single business to see what columns are available
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error fetching business:', error);
      return;
    }
    
    if (data && data.length > 0) {
      const columns = Object.keys(data[0]);
      console.log('\nAvailable columns in businesses table:');
      console.log('=====================================');
      columns.forEach(column => {
        console.log(`- ${column}`);
      });
      
      // Check specifically for subscription-related columns
      console.log('\nSubscription-related columns:');
      console.log('=============================');
      const subscriptionColumns = columns.filter(col => 
        col.includes('subscription') || 
        col.includes('tier') || 
        col.includes('plan') ||
        col.includes('billing')
      );
      
      if (subscriptionColumns.length > 0) {
        subscriptionColumns.forEach(col => console.log(`- ${col}`));
      } else {
        console.log('No subscription-related columns found');
      }
      
      // Check sample data for a specific business
      console.log('\nSample business data:');
      console.log('====================');
      const sample = data[0];
      Object.keys(sample).forEach(key => {
        const value = sample[key];
        const displayValue = typeof value === 'string' && value.length > 50 
          ? value.substring(0, 50) + '...' 
          : value;
        console.log(`${key}: ${displayValue}`);
      });
    } else {
      console.log('No businesses found in the table');
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

checkBusinessColumns();
