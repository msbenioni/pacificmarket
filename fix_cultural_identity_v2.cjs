// Fix cultural identity schema with correct PostgreSQL syntax
const { Client } = require('pg');

const connectionString = 'postgresql://postgres:MontBlanc3001@db.mnmisjprswpuvcojnbip.supabase.co:5432/postgres';

const client = new Client({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});

async function fixCulturalIdentitySchema() {
  try {
    await client.connect();
    console.log('🔗 Connected to database');
    
    // Check existing profile data
    const dataResult = await client.query(`
      SELECT id, display_name, primary_cultural, languages 
      FROM profiles 
      ORDER BY created_at DESC
      LIMIT 3
    `);
    
    console.log('\n📝 EXISTING PROFILE DATA:');
    if (dataResult.rows.length === 0) {
      console.log('No profiles found');
    } else {
      dataResult.rows.forEach(row => {
        console.log(`\nUser: ${row.display_name || row.id}`);
        console.log(`primary_cultural: ${JSON.stringify(row.primary_cultural)}`);
        console.log(`languages: ${JSON.stringify(row.languages)}`);
      });
    }
    
    // Step 1: Add cultural_tags column if it doesn't exist
    try {
      await client.query(`
        ALTER TABLE profiles 
        ADD COLUMN IF NOT EXISTS cultural_tags TEXT[]
      `);
      console.log('\n✅ Added cultural_tags column (if not exists)');
    } catch (err) {
      console.log('\n⚠️ cultural_tags column may already exist:', err.message);
    }
    
    // Step 2: Check if primary_cultural is already properly formatted
    const textDataResult = await client.query(`
      SELECT id, primary_cultural 
      FROM profiles 
      WHERE primary_cultural IS NOT NULL
    `);
    
    console.log(`\n🔄 Found ${textDataResult.rowCount} profiles with primary_cultural data`);
    
    // Check if data is stored as JSON strings that need to be converted to proper arrays
    let needsConversion = false;
    for (const row of textDataResult.rows) {
      if (typeof row.primary_cultural === 'string' && row.primary_cultural.startsWith('[')) {
        needsConversion = true;
        break;
      }
    }
    
    if (needsConversion) {
      console.log('\n🔄 Converting JSON string arrays to proper PostgreSQL arrays...');
      
      // Update each profile to convert JSON string to array
      for (const row of textDataResult.rows) {
        if (typeof row.primary_cultural === 'string' && row.primary_cultural.startsWith('[')) {
          try {
            // Parse JSON string and convert to PostgreSQL array format
            const parsedArray = JSON.parse(row.primary_cultural);
            const postgresArray = `{${parsedArray.map(item => `"${item}"`).join(',')}}`;
            
            await client.query(`
              UPDATE profiles 
              SET primary_cultural = $1 
              WHERE id = $2
            `, [postgresArray, row.id]);
            
            console.log(`  ✅ Updated ${row.id}: ${postgresArray}`);
          } catch (parseErr) {
            console.log(`  ⚠️ Could not parse ${row.id}: ${row.primary_cultural}`);
          }
        }
      }
    }
    
    // Step 3: Verify the current column structure
    const verifyResult = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'profiles' 
        AND column_name IN ('primary_cultural', 'cultural_tags', 'languages')
      ORDER BY column_name
    `);
    
    console.log('\n📋 CURRENT TABLE STRUCTURE:');
    verifyResult.rows.forEach(row => {
      console.log(`${row.column_name}: ${row.data_type}`);
    });
    
    // Test the updated data
    const testResult = await client.query(`
      SELECT id, display_name, primary_cultural 
      FROM profiles 
      WHERE primary_cultural IS NOT NULL 
      LIMIT 2
    `);
    
    console.log('\n🧪 TEST UPDATED DATA:');
    testResult.rows.forEach(row => {
      console.log(`User: ${row.display_name || row.id}`);
      console.log(`primary_cultural: ${JSON.stringify(row.primary_cultural)} (type: ${typeof row.primary_cultural})`);
    });
    
    await client.end();
    
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    await client.end();
  }
}

fixCulturalIdentitySchema();
