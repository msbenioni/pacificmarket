/**
 * Verify the cultural identity fix worked correctly
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = process.env.SUPABASE_DB_CONNECTION_STRING || 
  'postgresql://postgres:MontBlanc3001@db.mnmisjprswpuvcojnbip.supabase.co:5432/postgres';

async function verifyFix() {
  const client = new Client({
    connectionString: connectionString
  });

  try {
    console.log('Connecting to database for verification...');
    await client.connect();
    console.log('Connected successfully!');

    const sqlScript = fs.readFileSync(
      path.join(__dirname, 'verify_fix.sql'), 
      'utf8'
    );

    console.log('Running verification queries...');
    
    // Split the SQL script into individual queries
    const queries = sqlScript.split(';').filter(q => q.trim().length > 0);
    
    console.log('Verification Results:');
    console.log('==================');
    
    for (let i = 0; i < queries.length; i++) {
      const query = queries[i].trim();
      if (!query) continue;
      
      try {
        const result = await client.query(query);
        
        if (result.rows.length > 0) {
          // Determine the section based on the query content
          if (query.includes('display_name')) {
            console.log('\n--- PROFILES TABLE ---');
          } else if (query.includes('business_name')) {
            console.log('\n--- BUSINESSES TABLE ---');
          } else if (query.includes('GROUP BY format_status')) {
            console.log('\n--- FORMAT SUMMARY ---');
          }
          
          result.rows.forEach(row => {
            console.log(JSON.stringify(row, null, 2));
          });
        }
      } catch (error) {
        console.error(`Error in query ${i + 1}:`, error.message);
      }
    }

  } catch (error) {
    console.error('Error verifying fix:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\nDatabase connection closed.');
  }
}

verifyFix();
