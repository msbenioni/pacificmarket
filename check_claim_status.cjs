const { Client } = require('pg');

// Database connection
const client = new Client({
  connectionString: 'postgresql://postgres:MontBlanc3001@db.mnmisjprswpuvcojnbip.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function checkClaimStatus() {
  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    const claimId = 'db99a9a4-8f30-44dd-8b14-77b663c7531e';
    const businessId = '8e3c51fd-f7f9-4873-a91e-5edafb7b10f0';

    console.log('🔍 Checking claim status after update...');
    const claimCheck = await client.query(`
      SELECT id, status, business_id, reviewed_at, reviewed_by, created_at
      FROM claim_requests 
      WHERE id = $1
    `, [claimId]);
    
    console.log('Claim status after update:', claimCheck.rows[0]);

    console.log('\n🔍 Checking business ownership status...');
    const businessCheck = await client.query(`
      SELECT id, name, status, owner_user_id, claimed_at, claimed_by, is_claimed, updated_at
      FROM businesses 
      WHERE id = $1
    `, [businessId]);
    
    console.log('Business ownership status:', businessCheck.rows[0]);

    // Check if there are any triggers or constraints that might be reverting the claim status
    console.log('\n🔍 Checking for any triggers on claim_requests table...');
    const triggerCheck = await client.query(`
      SELECT 
        trigger_name,
        event_manipulation,
        event_object_table,
        action_timing,
        action_statement
      FROM information_schema.triggers
      WHERE event_object_table = 'claim_requests'
      ORDER BY trigger_name
    `);
    
    console.log('Triggers on claim_requests table:');
    triggerCheck.rows.forEach(trigger => {
      console.log(`- ${trigger.trigger_name}`);
      console.log(`  Event: ${trigger.event_manipulation}`);
      console.log(`  Timing: ${trigger.action_timing}`);
      console.log(`  Statement: ${trigger.action_statement}`);
      console.log('');
    });

    console.log('✅ Status check completed!');

  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await client.end();
  }
}

checkClaimStatus();
