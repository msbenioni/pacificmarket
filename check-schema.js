import { Pool } from 'pg';

const connectionString = 'postgresql://postgres:MontBlanc3001@db.mnmisjprswpuvcojnbip.supabase.co:5432/postgres';

const pool = new Pool({
  connectionString: connectionString,
});

async function checkSchema() {
  const client = await pool.connect();
  
  try {
    console.log('Checking businesses table schema...');
    
    const query = `
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'businesses' 
      ORDER BY ordinal_position
    `;
    
    const result = await client.query(query);
    
    console.log('Businesses table columns:');
    result.rows.forEach(row => {
      console.log(`- ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });
    
    // Also check a sample row to see the structure
    console.log('\nSample business data:');
    const sampleQuery = 'SELECT * FROM businesses LIMIT 1';
    const sampleResult = await client.query(sampleQuery);
    
    if (sampleResult.rows.length > 0) {
      console.log('Columns in sample row:');
      Object.keys(sampleResult.rows[0]).forEach(key => {
        console.log(`- ${key}: ${typeof sampleResult.rows[0][key]}`);
      });
    }
    
  } catch (error) {
    console.error('Error checking schema:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

checkSchema();
