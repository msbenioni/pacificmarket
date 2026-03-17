const { Client } = require('pg');

// Database connection
const client = new Client({
  connectionString: 'postgresql://postgres:MontBlanc3001@db.mnmisjprswpuvcojnbip.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function fixTrigger() {
  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    console.log('🔍 Dropping the problematic trigger...');
    const dropTrigger = await client.query(`
      DROP TRIGGER IF EXISTS update_claim_requests_updated_at ON claim_requests
    `);
    
    console.log('✅ Trigger dropped successfully');

    console.log('\n🔍 Testing claim update after trigger removal...');
    const testUpdate = await client.query(`
      UPDATE claim_requests 
      SET status = 'approved', reviewed_at = NOW()
      WHERE id = 'db99a9a4-8f30-44dd-8b14-77b663c7531e'
      RETURNING id, status, reviewed_at
    `);
    
    console.log('Update result:', testUpdate.rows[0]);

    console.log('\n🔍 Verifying the update...');
    const verifyUpdate = await client.query(`
      SELECT id, status, reviewed_at
      FROM claim_requests 
      WHERE id = 'db99a9a4-8f30-44dd-8b14-77b663c7531e'
    `);
    
    console.log('Final status:', verifyUpdate.rows[0]);

    console.log('✅ Trigger fix completed!');

  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await client.end();
  }
}

fixTrigger();
