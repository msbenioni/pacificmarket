import { Pool } from 'pg';

const connectionString = 'postgresql://postgres:MontBlanc3001@db.mnmisjprswpuvcojnbip.supabase.co:5432/postgres';

const pool = new Pool({
  connectionString: connectionString,
});

async function checkConstraints() {
  const client = await pool.connect();
  
  try {
    console.log('Checking visibility_tier constraint...');
    
    console.log('Checking existing visibility_tier values...');
    
    const valuesQuery = `
      SELECT DISTINCT visibility_tier, COUNT(*) as count
      FROM businesses 
      WHERE visibility_tier IS NOT NULL
      GROUP BY visibility_tier
    `;
    
    const valuesResult = await client.query(valuesQuery);
    console.log('Existing visibility_tier values:');
    valuesResult.rows.forEach(row => {
      console.log(`- ${row.visibility_tier}: ${row.count} businesses`);
    });
    
  } catch (error) {
    console.error('Error checking constraints:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

checkConstraints();
