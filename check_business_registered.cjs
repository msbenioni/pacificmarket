const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:MontBlanc3001@db.mnmisjprswpuvcojnbip.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function checkColumn() {
  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    const result = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'businesses' 
      AND table_schema = 'public'
      AND column_name IN ('business_registered', 'is_business_registered')
      ORDER BY column_name
    `);
    
    console.log('Business registration columns found:');
    if (result.rows.length === 0) {
      console.log('❌ Neither business_registered nor is_business_registered found');
      
      // Let's check all boolean columns to see what's available
      const boolCols = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'businesses' 
        AND table_schema = 'public'
        AND data_type = 'boolean'
        ORDER BY column_name
      `);
      
      console.log('\nAll boolean columns in businesses table:');
      boolCols.rows.forEach(col => {
        console.log(`- ${col.column_name}: ${col.data_type}`);
      });
    } else {
      result.rows.forEach(col => {
        console.log(`- ${col.column_name}: ${col.data_type}`);
      });
    }

    await client.end();
  } catch (error) {
    console.error('❌ Database error:', error.message);
  }
}

checkColumn();
