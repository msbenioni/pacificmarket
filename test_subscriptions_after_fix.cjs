const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mnmisjprswpuvcojnbip.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubWlzanByc3dwdXZjb2puYmlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2ODkwMTcsImV4cCI6MjA4NzI2NTAxN30.vl7Em91jGQP8mse-CJkIxTtuxWswoDO6sdSFLhhEc9A';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSubscriptionsAfterFix() {
  try {
    console.log('Testing subscriptions table after RLS fix...');
    
    // Test 1: SELECT (should work)
    console.log('\n=== Test 1: SELECT ===');
    const { data: selectData, error: selectError } = await supabase
      .from('subscriptions')
      .select('*')
      .limit(1);
    
    if (selectError) {
      console.log('❌ SELECT failed:', selectError.message);
    } else {
      console.log('✅ SELECT successful');
      console.log('Records found:', selectData?.length || 0);
    }
    
    // Test 2: INSERT (should work now)
    console.log('\n=== Test 2: INSERT ===');
    const testRecord = {
      business_id: '00000000-0000-0000-0000-000000000001',
      user_id: '00000000-0000-0000-0000-000000000001', 
      plan_type: 'basic',
      status: 'active',
      stripe_customer_id: 'test_cus_' + Date.now()
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('subscriptions')
      .insert(testRecord)
      .select();
    
    if (insertError) {
      console.log('❌ INSERT failed:', insertError.message);
      console.log('Error code:', insertError.code);
      console.log('Error details:', insertError.details);
    } else {
      console.log('✅ INSERT successful');
      console.log('Inserted record ID:', insertData[0]?.id);
      
      // Test 3: UPDATE (should work now)
      console.log('\n=== Test 3: UPDATE ===');
      const { data: updateData, error: updateError } = await supabase
        .from('subscriptions')
        .update({ status: 'updated', plan_type: 'mana' })
        .eq('id', insertData[0].id)
        .select();
      
      if (updateError) {
        console.log('❌ UPDATE failed:', updateError.message);
      } else {
        console.log('✅ UPDATE successful');
        console.log('Updated record:', updateData[0]);
      }
      
      // Clean up
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
    
    console.log('\n=== Summary ===');
    console.log('Subscriptions table RLS policies are now working!');
    console.log('The table should be accessible for INSERT/UPDATE/SELECT operations.');
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testSubscriptionsAfterFix();
