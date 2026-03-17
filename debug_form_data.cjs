const { Client } = require('pg');

// Database connection
const client = new Client({
  connectionString: 'postgresql://postgres:MontBlanc3001@db.mnmisjprswpuvcojnbip.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function debugFormData() {
  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    const businessId = 'fcf11781-96da-4c8b-b16c-bca3c50724a3';

    console.log('🔍 Checking business data (without claimed field)...');
    const businessCheck = await client.query(`
      SELECT 
        id, name, is_claimed, claimed_at, claimed_by, is_verified
      FROM businesses 
      WHERE id = $1
    `, [businessId]);
    
    console.log('Business data:', businessCheck.rows[0]);

    // Check if there's actually a 'claimed' column
    console.log('\n🔍 Checking for any claimed-related columns...');
    const columnCheck = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns 
      WHERE table_name = 'businesses' 
      AND table_schema = 'public'
      AND (column_name LIKE '%claimed%' OR column_name LIKE '%verify%')
      ORDER BY column_name
    `);
    
    console.log('Claim/Verify related columns:');
    columnCheck.rows.forEach(col => {
      console.log(`- ${col.column_name}: ${col.data_type}`);
    });

    console.log('✅ Debug completed!');

  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await client.end();
  }
}

debugFormData();
