// Check existing profile data and fix cultural identity schema
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
    
    // Step 2: Convert primary_cultural from text to array
    // First, let's see what data we have
    const textDataResult = await client.query(`
      SELECT id, primary_cultural 
      FROM profiles 
      WHERE primary_cultural IS NOT NULL 
        AND typeof(primary_cultural) != 'array'
    `);
    
    console.log(`\n🔄 Found ${textDataResult.rowCount} profiles with text primary_cultural`);
    
    if (textDataResult.rowCount > 0) {
      console.log('\n🔄 Converting text to array format...');
      
      // Update each profile to convert text to array
      for (const row of textDataResult.rows) {
        let newValue;
        
        if (typeof row.primary_cultural === 'string') {
          // Convert comma-separated string or single value to array
          newValue = row.primary_cultural
            .split(',')
            .map(item => item.trim().replace(/['"]/g, '')) // Remove quotes and trim
            .filter(item => item.length > 0);
        } else {
          // Handle other formats
          newValue = [row.primary_cultural];
        }
        
        await client.query(`
          UPDATE profiles 
          SET primary_cultural = $1 
          WHERE id = $2
        `, [newValue, row.id]);
        
        console.log(`  ✅ Updated ${row.id}: ${JSON.stringify(newValue)}`);
      }
    }
    
    // Step 3: Change column type to array (this might be tricky with existing data)
    try {
      await client.query(`
        ALTER TABLE profiles 
        ALTER COLUMN primary_cultural TYPE TEXT[] USING primary_cultural::TEXT[]
      `);
      console.log('\n✅ Changed primary_cultural column type to TEXT[]');
    } catch (err) {
      console.log('\n⚠️ Could not change column type automatically:', err.message);
      console.log('   Manual migration may be needed or data may already be in correct format');
    }
    
    // Verify the changes
    const verifyResult = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'profiles' 
        AND column_name IN ('primary_cultural', 'cultural_tags', 'languages')
      ORDER BY column_name
    `);
    
    console.log('\n📋 UPDATED TABLE STRUCTURE:');
    verifyResult.rows.forEach(row => {
      console.log(`${row.column_name}: ${row.data_type}`);
    });
    
    await client.end();
    
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    await client.end();
  }
}

fixCulturalIdentitySchema();
