const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mnmisjprswpuvcojnbip.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubWlzanByc3dwdXZjb2puYmlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTY4OTAxNywiZXhwIjoyMDg3MjY1MDE3fQ.g5GzYucCUT1kqQPfx5YdeVPZbPILVSrkfrhJR-XjpGM';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function checkPlanTypeConstraint() {
  try {
    console.log('Checking plan_type constraint...');
    
    // Check the constraint definition
    const { data: constraints, error: constraintError } = await supabase
      .from('information_schema.check_constraints')
      .select('constraint_name, check_clause')
      .eq('constraint_name', 'subscriptions_plan_type_check');
    
    if (constraintError) {
      console.log('Error checking constraint:', constraintError.message);
    } else {
      console.log('Constraint found:', constraints);
    }
    
    // Try with different plan_type values
    const testValues = ['basic', 'verified', 'featured', 'featured_plus', 'vaka', 'mana', 'moana'];
    
    console.log('\nTesting different plan_type values:');
    for (const planType of testValues) {
      const testRecord = {
        business_id: '00000000-0000-0000-0000-000000000001',
        user_id: '00000000-0000-0000-0000-000000000001',
        plan_type: planType,
        status: 'active',
        stripe_customer_id: 'test_' + planType
      };
      
      const { data, error } = await supabase
        .from('subscriptions')
        .insert(testRecord)
        .select();
      
      if (error) {
        console.log(`❌ ${planType}: ${error.message}`);
      } else {
        console.log(`✅ ${planType}: SUCCESS`);
        
        // Clean up
        await supabase
          .from('subscriptions')
          .delete()
          .eq('id', data[0].id);
        break; // Found a working value
      }
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

checkPlanTypeConstraint();
