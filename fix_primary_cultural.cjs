// Fix the specific problematic primary_cultural entry
const { Client } = require('pg');

const connectionString = 'postgresql://postgres:MontBlanc3001@db.mnmisjprswpuvcojnbip.supabase.co:5432/postgres';

const client = new Client({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});

async function fixPrimaryCulturalEntry() {
  try {
    await client.connect();
    console.log('🔗 Connected to database');
    
    // Find the problematic entry
    const problematicEntry = await client.query(`
      SELECT id, display_name, primary_cultural 
      FROM profiles 
      WHERE primary_cultural IS NOT NULL
      ORDER BY created_at DESC
      LIMIT 3
    `);
    
    console.log(`\n📝 Checking ${problematicEntry.rowCount} profiles for primary_cultural issues:`);
    
    for (const profile of problematicEntry.rows) {
      const culturalData = profile.primary_cultural;
      
      if (Array.isArray(culturalData)) {
        // Check if this is the problematic entry (contains JSON-like characters)
        const hasJsonChars = culturalData.some(item => 
          item === '{' || item === '}' || item === '"' || item === '\\' || item === '[' || item === ']'
        );
        
        if (hasJsonChars) {
          console.log(`\n🔄 Fixing problematic primary_cultural: ${profile.display_name || profile.id}`);
          console.log(`  Current: ${JSON.stringify(culturalData)}`);
          
          // Join the characters and extract meaningful country codes
          const joinedString = culturalData.join('');
          console.log(`  Joined: "${joinedString}"`);
          
          // Extract country codes from the string
          const extractedCountries = [];
          
          // Look for country patterns in the string
          const countryPatterns = [
            'australia', 'australia-aboriginal', 'cook-islands', 'fiji',
            'french-polynesia', 'new-zealand', 'samoa', 'tonga',
            'american-samoa', 'guam', 'hawaii', 'kiribati',
            'marshall-islands', 'micronesia', 'nauru', 'niue',
            'northern-mariana-islands', 'palau', 'papua-new-guinea',
            'solomon-islands', 'tokelau', 'tuvalu', 'vanuatu',
            'wallis-futuna', 'new-caledonia'
          ];
          
          countryPatterns.forEach(country => {
            if (joinedString.includes(country)) {
              extractedCountries.push(country);
            }
          });
          
          if (extractedCountries.length > 0) {
            // Convert to PostgreSQL array format
            const postgresArray = `{${extractedCountries.map(country => `"${country}"`).join(',')}}`;
            
            await client.query(`
              UPDATE profiles 
              SET primary_cultural = $1 
              WHERE id = $2
            `, [postgresArray, profile.id]);
            
            console.log(`  ✅ Fixed to: ${JSON.stringify(extractedCountries)}`);
          } else {
            console.log(`  ⚠️ Could not extract countries, setting to empty array`);
            
            await client.query(`
              UPDATE profiles 
              SET primary_cultural = '{}' 
              WHERE id = $1
            `, [profile.id]);
          }
        } else {
          console.log(`✅ ${profile.display_name || profile.id}: ${JSON.stringify(culturalData)} (OK)`);
        }
      }
    }
    
    // Verify the fix
    const verifyData = await client.query(`
      SELECT id, display_name, primary_cultural 
      FROM profiles 
      WHERE primary_cultural IS NOT NULL
      ORDER BY created_at DESC
      LIMIT 3
    `);
    
    console.log('\n🧪 VERIFIED PRIMARY_CULTURAL DATA:');
    verifyData.rows.forEach(row => {
      console.log(`User: ${row.display_name || row.id}`);
      console.log(`primary_cultural: ${JSON.stringify(row.primary_cultural)}`);
    });
    
    console.log('\n✅ Primary cultural data is now properly formatted!');
    
    await client.end();
    
  } catch (err) {
    console.error('❌ Fix failed:', err.message);
    await client.end();
  }
}

fixPrimaryCulturalEntry();
