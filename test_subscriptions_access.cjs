const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mnmisjprswpuvcojnbip.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubWlzanByc3dwdXZjb2puYmlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2ODkwMTcsImV4cCI6MjA4NzI2NTAxN30.vl7Em91jGQP8mse-CJkIxTtuxWswoDO6sdSFLhhEc9A';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSubscriptionsAccess() {
  try {
    console.log('Testing subscriptions table access...');
    
    // Test 1: Check if table exists by trying to select
    console.log('\n=== Test 1: SELECT from subscriptions ===');
    const { data: selectData, error: selectError } = await supabase
      .from('subscriptions')
      .select('*')
      .limit(1);
    
    if (selectError) {
      console.log('❌ SELECT failed:', selectError.message);
      console.log('Error code:', selectError.code);
      console.log('Error details:', selectError.details);
    } else {
      console.log('✅ SELECT successful');
      if (selectData && selectData.length > 0) {
        console.log('Columns:', Object.keys(selectData[0]));
        console.log('Sample data:', selectData[0]);
      } else {
        console.log('Table exists but is empty');
      }
    }
    
    // Test 2: Try to insert a test record
    console.log('\n=== Test 2: INSERT into subscriptions ===');
    const testRecord = {
      business_id: '00000000-0000-0000-0000-000000000000', // Dummy UUID
      user_id: '00000000-0000-0000-0000-000000000000', // Dummy UUID
      plan_type: 'basic',
      status: 'active',
      stripe_customer_id: 'test_customer_id'
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('subscriptions')
      .insert(testRecord)
      .select();
    
    if (insertError) {
      console.log('❌ INSERT failed:', insertError.message);
      console.log('Error code:', insertError.code);
      console.log('Error details:', insertError.details);
      console.log('Error hint:', insertError.hint);
    } else {
      console.log('✅ INSERT successful');
      console.log('Inserted data:', insertData);
      
      // Clean up the test record
      if (insertData && insertData[0]) {
        const { error: deleteError } = await supabase
          .from('subscriptions')
          .delete()
          .eq('id', insertData[0].id);
        
        if (deleteError) {
          console.log('⚠️ Could not delete test record:', deleteError.message);
        } else {
          console.log('✅ Test record cleaned up');
        }
      }
    }
    
    // Test 3: Try to update (if there are any records)
    console.log('\n=== Test 3: UPDATE subscriptions ===');
    const { data: existingData } = await supabase
      .from('subscriptions')
      .select('id')
      .limit(1);
    
    if (existingData && existingData.length > 0) {
      const { data: updateData, error: updateError } = await supabase
        .from('subscriptions')
        .update({ status: 'active' })
        .eq('id', existingData[0].id)
        .select();
      
      if (updateError) {
        console.log('❌ UPDATE failed:', updateError.message);
        console.log('Error code:', updateError.code);
      } else {
        console.log('✅ UPDATE successful');
      }
    } else {
      console.log('⚠️ No existing records to test UPDATE');
    }
    
    // Test 4: Check RLS policies
    console.log('\n=== Test 4: Check RLS/Permissions ===');
    // Try with service role key to see if it's a permissions issue
    console.log('Testing if this is a permissions issue...');
    console.log('Current key type: anon (limited permissions)');
    console.log('If operations fail, it might be due to RLS policies');
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testSubscriptionsAccess();
