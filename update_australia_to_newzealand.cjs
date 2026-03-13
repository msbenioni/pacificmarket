// Update existing languages from Australia to New Zealand
const { Client } = require('pg');

const connectionString = 'postgresql://postgres:MontBlanc3001@db.mnmisjprswpuvcojnbip.supabase.co:5432/postgres';

const client = new Client({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});

async function updateAustraliaToNewZealand() {
  try {
    await client.connect();
    console.log('🔗 Connected to database');
    
    // Get all profiles with languages containing 'australia'
    const profilesData = await client.query(`
      SELECT id, display_name, languages 
      FROM profiles 
      WHERE languages IS NOT NULL
      ORDER BY created_at DESC
    `);
    
    console.log(`\n📝 Found ${profilesData.rowCount} profiles with languages data`);
    
    let totalUpdates = 0;
    
    for (const profile of profilesData.rows) {
      if (Array.isArray(profile.languages) && profile.languages.includes('australia')) {
        console.log(`\n🔄 Processing: ${profile.display_name || profile.id}`);
        console.log(`  Current languages: ${JSON.stringify(profile.languages)}`);
        
        // Replace 'australia' with 'new-zealand' in the languages array
        const updatedLanguages = profile.languages.map(lang => 
          lang === 'australia' ? 'new-zealand' : lang
        );
        
        // Remove duplicates
        const uniqueLanguages = [...new Set(updatedLanguages)];
        
        // Convert to PostgreSQL array format
        const postgresArray = `{${uniqueLanguages.map(code => `"${code}"`).join(',')}}`;
        
        await client.query(`
          UPDATE profiles 
          SET languages = $1 
          WHERE id = $2
        `, [postgresArray, profile.id]);
        
        console.log(`  ✅ Updated to: ${JSON.stringify(uniqueLanguages)}`);
        totalUpdates++;
      }
    }
    
    console.log(`\n📊 Update Summary:`);
    console.log(`  Total profiles checked: ${profilesData.rowCount}`);
    console.log(`  Successfully updated: ${totalUpdates}`);
    
    // Verify the updates
    const verifyData = await client.query(`
      SELECT id, display_name, languages 
      FROM profiles 
      WHERE languages IS NOT NULL 
      ORDER BY created_at DESC
      LIMIT 5
    `);
    
    console.log('\n🧪 VERIFIED UPDATED DATA:');
    verifyData.rows.forEach(row => {
      console.log(`User: ${row.display_name || row.id}`);
      console.log(`languages: ${JSON.stringify(row.languages)}`);
    });
    
    console.log('\n✅ Australia updated to New Zealand in languages!');
    
    await client.end();
    
  } catch (err) {
    console.error('❌ Update failed:', err.message);
    await client.end();
  }
}

updateAustraliaToNewZealand();
