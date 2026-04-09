/**
 * Run cultural identity fix using direct database connection
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Database connection from .env.local
const connectionString = process.env.SUPABASE_DB_CONNECTION_STRING || 
  'postgresql://postgres:MontBlanc3001@db.mnmisjprswpuvcojnbip.supabase.co:5432/postgres';

async function runFix() {
  const client = new Client({
    connectionString: connectionString
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected successfully!');

    // Read and execute the SQL fix script
    const sqlScript = fs.readFileSync(
      path.join(__dirname, 'fix_cultural_identity.sql'), 
      'utf8'
    );

    console.log('Executing cultural identity fix...');
    const result = await client.query(sqlScript);
    
    console.log('Fix completed successfully!');
    console.log('Results:');
    console.log(result.rows);

  } catch (error) {
    console.error('Error running fix:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('Database connection closed.');
  }
}

// Run the fix
runFix();
