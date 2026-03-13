// Restore languages data with correct mapping (English -> New Zealand)
const { Client } = require('pg');

const connectionString = 'postgresql://postgres:MontBlanc3001@db.mnmisjprswpuvcojnbip.supabase.co:5432/postgres';

const client = new Client({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});

// Original language data from the first check
const ORIGINAL_LANGUAGE_DATA = [
  {
    id: '364269e4-a6c5-4122-bf63-0d318607effd', // Jasmin Jesse Benioni
    languages: ['English', 'French']
  },
  {
    id: '695016f7-52f9-4593-b44a-297a273dfef4', // Empty profile
    languages: []
  },
  {
    id: 'another-user-id', // Daniel Maine (placeholder)
    languages: ['English', 'French', 'Tahitian']
  }
];

// Updated mapping with English -> New Zealand
const LANGUAGE_TO_COUNTRY_CODE = {
  'English': 'new-zealand',        // Updated to New Zealand
  'French': 'french-polynesia',    // French in French Polynesia
  'Tahitian': 'french-polynesia',   // Tahitian in French Polynesia
};

async function restoreLanguagesWithCorrectMapping() {
  try {
    await client.connect();
    console.log('🔗 Connected to database');
    
    // Get current profiles to match with original data
    const currentProfiles = await client.query(`
      SELECT id, display_name, languages 
      FROM profiles 
      ORDER BY created_at DESC
    `);
    
    console.log(`\n📝 Found ${currentProfiles.rowCount} profiles`);
    
    let totalRestored = 0;
    
    // Restore the known profiles with correct mapping
    for (const profile of currentProfiles.rows) {
      let originalLanguages = null;
      
      // Match known profiles
      if (profile.display_name?.includes('Jasmin')) {
        originalLanguages = ['English', 'French'];
      } else if (profile.display_name?.includes('Daniel')) {
        originalLanguages = ['English', 'French', 'Tahitian'];
      }
      
      if (originalLanguages) {
        console.log(`\n🔄 Restoring: ${profile.display_name || profile.id}`);
        console.log(`  Original: ${JSON.stringify(originalLanguages)}`);
        
        // Map to country codes with correct mapping
        const countryCodes = [];
        for (const language of originalLanguages) {
          const countryCode = LANGUAGE_TO_COUNTRY_CODE[language];
          if (countryCode && !countryCodes.includes(countryCode)) {
            countryCodes.push(countryCode);
          }
        }
        
        if (countryCodes.length > 0) {
          const postgresArray = `{${countryCodes.map(code => `"${code}"`).join(',')}}`;
          
          await client.query(`
            UPDATE profiles 
            SET languages = $1 
            WHERE id = $2
          `, [postgresArray, profile.id]);
          
          console.log(`  ✅ Restored as: ${JSON.stringify(countryCodes)}`);
          totalRestored++;
        }
      }
    }
    
    console.log(`\n📊 Restore Summary:`);
    console.log(`  Profiles restored: ${totalRestored}`);
    
    // Verify the restoration
    const verifyData = await client.query(`
      SELECT id, display_name, languages 
      FROM profiles 
      WHERE languages IS NOT NULL 
        AND array_length(languages, 1) > 0
      ORDER BY created_at DESC
      LIMIT 5
    `);
    
    console.log('\n🧪 VERIFIED RESTORED DATA:');
    verifyData.rows.forEach(row => {
      console.log(`User: ${row.display_name || row.id}`);
      console.log(`languages: ${JSON.stringify(row.languages)}`);
    });
    
    console.log('\n✅ Languages restored with English -> New Zealand mapping!');
    
    await client.end();
    
  } catch (err) {
    console.error('❌ Restore failed:', err.message);
    await client.end();
  }
}

restoreLanguagesWithCorrectMapping();
