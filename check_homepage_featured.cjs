const { Client } = require('pg');

// Database connection
const client = new Client({
  connectionString: 'postgresql://postgres:MontBlanc3001@db.mnmisjprswpuvcojnbip.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function checkHomepageFeatured() {
  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    console.log('🔍 Checking for homepage_featured column...');
    const columnCheck = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns 
      WHERE table_name = 'businesses' 
      AND table_schema = 'public'
      AND (column_name LIKE '%homepage%' OR column_name LIKE '%featured%')
      ORDER BY column_name
    `);
    
    console.log('Homepage/Featured related columns:');
    columnCheck.rows.forEach(col => {
      console.log(`- ${col.column_name}: ${col.data_type}`);
    });

    console.log('\n🔍 Checking all boolean columns in businesses table...');
    const booleanCheck = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns 
      WHERE table_name = 'businesses' 
      AND table_schema = 'public'
      AND data_type = 'boolean'
      ORDER BY column_name
    `);
    
    console.log('All boolean columns:');
    booleanCheck.rows.forEach(col => {
      console.log(`- ${col.column_name}: ${col.data_type}`);
    });

    console.log('✅ Check completed!');

  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await client.end();
  }
}

checkHomepageFeatured();
