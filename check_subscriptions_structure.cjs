const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mnmisjprswpuvcojnbip.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubWlzanByc3dwdXZjb2puYmlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2ODkwMTcsImV4cCI6MjA4NzI2NTAxN30.vl7Em91jGQP8mse-CJkIxTtuxWswoDO6sdSFLhhEc9A';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSubscriptionsStructure() {
  try {
    console.log('Checking subscriptions table structure...');
    
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .limit(5);
    
    if (error) {
      console.error('Error:', error);
      return;
    }
    
    if (data && data.length > 0) {
      console.log('\nColumns in subscriptions table:');
      console.log('==================================');
      Object.keys(data[0]).forEach(col => {
        console.log(`- ${col}`);
      });
      
      console.log('\nSample subscription records:');
      console.log('=============================');
      data.forEach((record, index) => {
        console.log(`\nRecord ${index + 1}:`);
        Object.keys(record).forEach(key => {
          const value = record[key];
          const displayValue = value && typeof value === 'string' && value.length > 50 
            ? value.substring(0, 50) + '...' 
            : value;
          console.log(`  ${key}: ${displayValue}`);
        });
      });
    } else {
      console.log('No data in subscriptions table');
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

checkSubscriptionsStructure();
