// Check profiles table for cultural identity data
const { Client } = require('pg');

const connectionString = 'postgresql://postgres:MontBlanc3001@db.mnmisjprswpuvcojnbip.supabase.co:5432/postgres';

const client = new Client({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});

async function checkProfilesCulturalIdentity() {
  try {
    await client.connect();
    console.log('🔗 Connected to database');
    
    // Check profiles table structure
    const structureResult = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'profiles' 
        AND column_name IN ('primary_cultural', 'cultural_tags', 'languages')
      ORDER BY column_name
    `);
    
    console.log('\n📋 PROFILES TABLE STRUCTURE:');
    structureResult.rows.forEach(row => {
      console.log(`${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });
    
    // Check sample profile data
    const dataResult = await client.query(`
      SELECT id, display_name, primary_cultural, cultural_tags, languages 
      FROM profiles 
      WHERE primary_cultural IS NOT NULL 
      LIMIT 5
    `);
    
    console.log('\n📝 SAMPLE PROFILE DATA:');
    if (dataResult.rows.length === 0) {
      console.log('No profiles with cultural identity data found');
    } else {
      dataResult.rows.forEach(row => {
        console.log(`\nUser: ${row.display_name || row.id}`);
        console.log(`primary_cultural: ${JSON.stringify(row.primary_cultural)}`);
        console.log(`cultural_tags: ${JSON.stringify(row.cultural_tags)}`);
        console.log(`languages: ${JSON.stringify(row.languages)}`);
      });
    }
    
    // Count profiles with cultural data
    const countResult = await client.query(`
      SELECT 
        COUNT(*) as total_profiles,
        COUNT(primary_cultural) as with_cultural,
        COUNT(cultural_tags) as with_tags,
        COUNT(languages) as with_languages
      FROM profiles
    `);
    
    console.log('\n📊 CULTURAL DATA SUMMARY:');
    console.log(`Total profiles: ${countResult.rows[0].total_profiles}`);
    console.log(`With primary_cultural: ${countResult.rows[0].with_cultural}`);
    console.log(`With cultural_tags: ${countResult.rows[0].with_tags}`);
    console.log(`With languages: ${countResult.rows[0].with_languages}`);
    
    await client.end();
    
  } catch (err) {
    console.error('❌ Check failed:', err.message);
    await client.end();
  }
}

checkProfilesCulturalIdentity();
