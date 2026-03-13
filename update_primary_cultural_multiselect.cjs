// Update primary_cultural column to support multiselect arrays
const { Client } = require('pg');

const connectionString = 'postgresql://postgres:MontBlanc3001@db.mnmisjprswpuvcojnbip.supabase.co:5432/postgres';

const client = new Client({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});

async function updatePrimaryCulturalColumn() {
  try {
    await client.connect();
    console.log('🔗 Connected to database');
    
    // Check current data
    const currentData = await client.query(`
      SELECT id, display_name, primary_cultural 
      FROM profiles 
      WHERE primary_cultural IS NOT NULL 
      ORDER BY created_at DESC
      LIMIT 3
    `);
    
    console.log('\n📝 CURRENT PRIMARY_CULTURAL DATA:');
    currentData.rows.forEach(row => {
      console.log(`User: ${row.display_name || row.id}`);
      console.log(`primary_cultural: ${JSON.stringify(row.primary_cultural)} (type: ${typeof row.primary_cultural})`);
    });
    
    // Convert JSON string arrays to PostgreSQL arrays if needed
    let conversions = 0;
    for (const row of currentData.rows) {
      if (typeof row.primary_cultural === 'string' && row.primary_cultural.startsWith('[')) {
        try {
          // Parse JSON and convert to PostgreSQL array format
          const parsedArray = JSON.parse(row.primary_cultural);
          const postgresArray = `{${parsedArray.map(item => `"${item}"`).join(',')}}`;
          
          await client.query(`
            UPDATE profiles 
            SET primary_cultural = $1 
            WHERE id = $2
          `, [postgresArray, row.id]);
          
          conversions++;
          console.log(`  ✅ Converted ${row.display_name || row.id}: ${postgresArray}`);
        } catch (parseErr) {
          console.log(`  ⚠️ Could not convert ${row.id}: ${parseErr.message}`);
        }
      }
    }
    
    if (conversions > 0) {
      console.log(`\n🔄 Converted ${conversions} profiles from JSON to PostgreSQL arrays`);
    } else {
      console.log('\n✅ Data already in correct format');
    }
    
    // Verify the changes
    const verifyData = await client.query(`
      SELECT id, display_name, primary_cultural 
      FROM profiles 
      WHERE primary_cultural IS NOT NULL 
      ORDER BY created_at DESC
      LIMIT 3
    `);
    
    console.log('\n🧪 VERIFIED DATA:');
    verifyData.rows.forEach(row => {
      console.log(`User: ${row.display_name || row.id}`);
      console.log(`primary_cultural: ${JSON.stringify(row.primary_cultural)} (type: ${typeof row.primary_cultural})`);
    });
    
    console.log('\n✅ Primary cultural identity is now ready for multiselect!');
    console.log('   Users can select multiple cultural identities in their profile.');
    
    await client.end();
    
  } catch (err) {
    console.error('❌ Update failed:', err.message);
    await client.end();
  }
}

updatePrimaryCulturalColumn();
