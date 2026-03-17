const { Client } = require('pg');

// Database connection
const client = new Client({
  connectionString: 'postgresql://postgres:MontBlanc3001@db.mnmisjprswpuvcojnbip.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function checkTrigger() {
  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    console.log('🔍 Checking the trigger function definition...');
    const triggerFunction = await client.query(`
      SELECT routine_definition
      FROM information_schema.routines 
      WHERE routine_name = 'update_updated_at_column'
      AND routine_schema = 'public'
    `);
    
    console.log('Trigger function definition:');
    console.log(triggerFunction.rows[0]?.routine_definition || 'Function not found');

    console.log('\n🔍 Testing direct claim update...');
    const testUpdate = await client.query(`
      UPDATE claim_requests 
      SET status = 'approved', reviewed_at = NOW()
      WHERE id = 'db99a9a4-8f30-44dd-8b14-77b663c7531e'
      RETURNING id, status, reviewed_at
    `);
    
    console.log('Direct update result:', testUpdate.rows[0]);

    console.log('\n🔍 Checking status after direct update...');
    const afterUpdate = await client.query(`
      SELECT id, status, reviewed_at, reviewed_by
      FROM claim_requests 
      WHERE id = 'db99a9a4-8f30-44dd-8b14-77b663c7531e'
    `);
    
    console.log('Status after direct update:', afterUpdate.rows[0]);

    console.log('✅ Trigger check completed!');

  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await client.end();
  }
}

checkTrigger();
