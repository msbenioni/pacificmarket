const { Client } = require('pg');

// Database connection
const client = new Client({
  connectionString: 'postgresql://postgres:MontBlanc3001@db.mnmisjprswpuvcojnbip.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function checkBusinessSchema() {
  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    console.log('🔍 Checking businesses table schema...');
    const schemaCheck = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'businesses' 
      AND table_schema = 'public'
      ORDER BY ordinal_position
    `);
    
    console.log('Businesses table columns:');
    schemaCheck.rows.forEach(col => {
      console.log(`- ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });

    console.log('\n🔍 Checking for claimed vs is_claimed columns...');
    const claimedCheck = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'businesses' 
      AND table_schema = 'public'
      AND column_name IN ('claimed', 'is_claimed')
    `);
    
    console.log('Claim-related columns found:', claimedCheck.rows.map(row => row.column_name));

    console.log('\n🔍 Checking sample data for claimed fields...');
    const dataCheck = await client.query(`
      SELECT id, name, is_verified, is_claimed, claimed_at, claimed_by 
      FROM businesses 
      WHERE id IN ('fcf11781-96da-4c8b-b16c-bca3c50724a3')
      LIMIT 1
    `);
    
    console.log('Sample business data:', dataCheck.rows[0]);

    console.log('✅ Schema check completed!');

  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await client.end();
  }
}

checkBusinessSchema();
