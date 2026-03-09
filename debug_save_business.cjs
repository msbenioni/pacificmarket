const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mnmisjprswpuvcojnbip.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubWlzanByc3dwdXZjb2puYmlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2ODkwMTcsImV4cCI6MjA4NzI2NTAxN30.vl7Em91jGQP8mse-CJkIxTtuxWswoDO6sdSFLhhEc9A';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugSaveBusiness() {
  try {
    console.log('Debugging saveBusiness issue...');
    
    // Check what data types the businesses table expects
    console.log('\n=== Checking businesses table schema ===');
    const { data: schemaData, error: schemaError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable, column_default')
      .eq('table_name', 'businesses')
      .order('ordinal_position');
    
    if (schemaError) {
      console.log('Error checking schema:', schemaError.message);
    } else {
      console.log('Businesses table columns:');
      schemaData.forEach(col => {
        console.log(`${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
      });
    }
    
    // Check integer columns specifically
    console.log('\n=== Integer columns that might cause issues ===');
    const integerColumns = schemaData?.filter(col => 
      col.data_type.includes('int') || 
      col.data_type.includes('numeric') ||
      col.data_type.includes('serial')
    );
    
    if (integerColumns) {
      console.log('Integer columns:');
      integerColumns.forEach(col => {
        console.log(`- ${col.column_name}: ${col.data_type}`);
      });
    }
    
    // Test a simple update to see if the issue persists
    console.log('\n=== Testing simple update ===');
    const { data: businesses } = await supabase
      .from('businesses')
      .select('id, name')
      .limit(1);
    
    if (businesses && businesses.length > 0) {
      const testId = businesses[0].id;
      console.log(`Testing update on business: ${businesses[0].name} (${testId})`);
      
      // Test updating just name (should work)
      const { data: updateResult, error: updateError } = await supabase
        .from('businesses')
        .update({ name: 'Test Update ' + Date.now() })
        .eq('id', testId);
      
      if (updateError) {
        console.log('❌ Simple update failed:', updateError.message);
        console.log('Error code:', updateError.code);
      } else {
        console.log('✅ Simple update worked');
      }
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

debugSaveBusiness();
