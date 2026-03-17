const { Client } = require('pg');

// Database connection
const client = new Client({
  connectionString: 'postgresql://postgres:MontBlanc3001@db.mnmisjprswpuvcojnbip.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function checkRLSIssues() {
  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Check if RLS is enabled on businesses table
    console.log('🔍 Checking RLS status on businesses table...');
    const rlsCheck = await client.query(`
      SELECT schemaname, tablename, rowsecurity 
      FROM pg_tables 
      WHERE tablename = 'businesses' AND schemaname = 'public'
    `);
    
    console.log('RLS Status:', rlsCheck.rows);

    // Check existing RLS policies on businesses table
    console.log('\n🔍 Checking RLS policies on businesses table...');
    const policies = await client.query(`
      SELECT 
        schemaname,
        tablename,
        policyname,
        permissive,
        roles,
        cmd,
        qual,
        with_check
      FROM pg_policies 
      WHERE tablename = 'businesses' AND schemaname = 'public'
    `);
    
    console.log('RLS Policies:');
    policies.rows.forEach(policy => {
      console.log(`- ${policy.policyname}`);
      console.log(`  Roles: ${policy.roles}`);
      console.log(`  Command: ${policy.cmd}`);
      console.log(`  Qual: ${policy.qual}`);
      console.log(`  With Check: ${policy.with_check}`);
      console.log('');
    });

    // Check if there are any businesses stuck in pending status
    console.log('🔍 Checking businesses with pending status...');
    const pendingBusinesses = await client.query(`
      SELECT id, name, status, created_date, updated_at 
      FROM businesses 
      WHERE status = 'pending'
      ORDER BY created_date DESC
      LIMIT 10
    `);
    
    console.log(`Found ${pendingBusinesses.rows.length} pending businesses:`);
    pendingBusinesses.rows.forEach(business => {
      console.log(`- ${business.business_name} (${business.id}) - Status: ${business.status}`);
      console.log(`  Created: ${business.created_date}`);
      console.log(`  Updated: ${business.updated_at}`);
      console.log('');
    });

    // Check claim requests and their associated business statuses
    console.log('🔍 Checking claim requests and business status mismatch...');
    const claimStatusCheck = await client.query(`
      SELECT 
        cr.id as claim_id,
        cr.status as claim_status,
        cr.business_id,
        business.business_name as business_name,
        b.status as business_status,
        cr.created_at as claim_created,
        cr.reviewed_at as claim_reviewed
      FROM claim_requests cr
      LEFT JOIN businesses b ON cr.business_id = b.id
      WHERE cr.status = 'approved' AND (b.status IS NULL OR b.status != 'active')
      ORDER BY cr.created_at DESC
      LIMIT 10
    `);
    
    console.log(`Found ${claimStatusCheck.rows.length} approved claims with non-active businesses:`);
    claimStatusCheck.rows.forEach(row => {
      console.log(`- Claim: ${row.claim_id}`);
      console.log(`  Business: ${row.business_name} (${row.business_id})`);
      console.log(`  Claim Status: ${row.claim_status}`);
      console.log(`  Business Status: ${row.business_status}`);
      console.log(`  Claim Created: ${row.claim_created}`);
      console.log(`  Claim Reviewed: ${row.claim_reviewed}`);
      console.log('');
    });

    // Test direct update on a pending business (if any exist)
    if (pendingBusinesses.rows.length > 0) {
      const testBusiness = pendingBusinesses.rows[0];
      console.log('🧪 Testing direct status update...');
      
      const originalStatus = testBusiness.status;
      console.log(`Testing business: ${testbusiness.business_name} (${testBusiness.id})`);
      
      // Test update
      const updateTest = await client.query(`
        UPDATE businesses 
        SET status = 'active', updated_at = NOW() 
        WHERE id = $1 
        RETURNING id, name, status, updated_at
      `, [testBusiness.id]);
      
      console.log('Update result:', updateTest.rows[0]);
      
      // Verify the update
      const verifyUpdate = await client.query(`
        SELECT id, name, status, updated_at 
        FROM businesses 
        WHERE id = $1
      `, [testBusiness.id]);
      
      console.log('Verification:', verifyUpdate.rows[0]);
      
      // If it was originally pending, set it back to pending for testing
      if (originalStatus === 'pending') {
        await client.query(`
          UPDATE businesses 
          SET status = 'pending', updated_at = NOW() 
          WHERE id = $1
        `, [testBusiness.id]);
        console.log('Reset test business back to pending');
      }
    }

    // Check for any triggers that might be interfering
    console.log('\n🔍 Checking for triggers on businesses table...');
    const triggers = await client.query(`
      SELECT 
        trigger_name,
        event_manipulation,
        event_object_table,
        action_timing,
        action_condition,
        action_statement
      FROM information_schema.triggers
      WHERE event_object_table = 'businesses'
      ORDER BY trigger_name
    `);
    
    console.log('Triggers on businesses table:');
    triggers.rows.forEach(trigger => {
      console.log(`- ${trigger.trigger_name}`);
      console.log(`  Event: ${trigger.event_manipulation}`);
      console.log(`  Timing: ${trigger.action_timing}`);
      console.log(`  Statement: ${trigger.action_statement}`);
      console.log('');
    });

    console.log('✅ Database check completed successfully!');

  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await client.end();
  }
}

checkRLSIssues();
