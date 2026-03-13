// Map existing language names to country codes and migrate data
const { Client } = require('pg');

const connectionString = 'postgresql://postgres:MontBlanc3001@db.mnmisjprswpuvcojnbip.supabase.co:5432/postgres';

const client = new Client({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});

// Language name to country code mapping
const LANGUAGE_TO_COUNTRY_MAPPING = {
  'English': 'australia',           // English widely spoken in Australia
  'French': 'french-polynesia',    // French in French Polynesia
  'Tahitian': 'french-polynesia',   // Tahitian in French Polynesia
  'Maori': 'new-zealand',          // Maori in New Zealand
  'Samoan': 'samoa',               // Samoan in Samoa
  'Tongan': 'tonga',               // Tongan in Tonga
  'Fijian': 'fiji',                // Fijian in Fiji
  'Cook Island Maori': 'cook-islands', // Cook Island Maori in Cook Islands
  'Niuean': 'niue',                // Niuean in Niue
  'Tokelauan': 'tokelau',          // Tokelauan in Tokelau
  'Tuvaluan': 'tuvalu',            // Tuvaluan in Tuvalu
  'Kiribati': 'kiribati',          // Kiribati in Kiribati
  'Marshallese': 'marshall-islands', // Marshallese in Marshall Islands
  'Palauan': 'palau',              // Palauan in Palau
  'Chamorro': 'guam',              // Chamorro in Guam
  'Papua New Guinean': 'papua-new-guinea', // PNG languages
  'Solomon Islands': 'solomon-islands', // SI languages
  'Vanuatuan': 'vanuatu',          // Vanuatuan in Vanuatu
  'New Caledonian': 'new-caledonia', // New Caledonian languages
  'Wallisian': 'wallis-futuna',    // Wallisian in Wallis & Futuna
  'Micronesian': 'micronesia',     // Micronesian languages
  'Northern Mariana': 'northern-mariana-islands', // CNMI languages
  'American Samoan': 'american-samoa', // American Samoan
  // Add more mappings as needed
};

async function migrateLanguagesToCountryCodes() {
  try {
    await client.connect();
    console.log('🔗 Connected to database');
    
    // Get all profiles with languages data
    const profilesData = await client.query(`
      SELECT id, display_name, languages 
      FROM profiles 
      WHERE languages IS NOT NULL 
        AND jsonb_typeof(languages) = 'array'
      ORDER BY created_at DESC
    `);
    
    console.log(`\n📝 Found ${profilesData.rowCount} profiles with languages data`);
    
    let totalMigrations = 0;
    
    for (const profile of profilesData.rows) {
      console.log(`\n🔄 Processing: ${profile.display_name || profile.id}`);
      console.log(`  Current languages: ${JSON.stringify(profile.languages)}`);
      
      const mappedLanguages = [];
      const unmappedLanguages = [];
      
      // Map each language name to country code
      for (const language of profile.languages) {
        const countryCode = LANGUAGE_TO_COUNTRY_MAPPING[language];
        if (countryCode) {
          if (!mappedLanguages.includes(countryCode)) {
            mappedLanguages.push(countryCode);
          }
        } else {
          if (!unmappedLanguages.includes(language)) {
            unmappedLanguages.push(language);
          }
        }
      }
      
      if (mappedLanguages.length > 0) {
        // Convert to PostgreSQL array format
        const postgresArray = `{${mappedLanguages.map(code => `"${code}"`).join(',')}}`;
        
        await client.query(`
          UPDATE profiles 
          SET languages = $1 
          WHERE id = $2
        `, [postgresArray, profile.id]);
        
        console.log(`  ✅ Mapped to: ${JSON.stringify(mappedLanguages)}`);
        totalMigrations++;
        
        if (unmappedLanguages.length > 0) {
          console.log(`  ⚠️ Unmapped languages: ${JSON.stringify(unmappedLanguages)}`);
        }
      } else {
        console.log(`  ⚠️ No mappings found for: ${JSON.stringify(profile.languages)}`);
      }
    }
    
    console.log(`\n📊 Migration Summary:`);
    console.log(`  Total profiles processed: ${profilesData.rowCount}`);
    console.log(`  Successfully migrated: ${totalMigrations}`);
    console.log(`  Failed/Unmapped: ${profilesData.rowCount - totalMigrations}`);
    
    // Verify the migration
    const verifyData = await client.query(`
      SELECT id, display_name, languages 
      FROM profiles 
      WHERE languages IS NOT NULL 
      ORDER BY created_at DESC
      LIMIT 5
    `);
    
    console.log('\n🧪 VERIFIED MIGRATED DATA:');
    verifyData.rows.forEach(row => {
      console.log(`User: ${row.display_name || row.id}`);
      console.log(`languages: ${JSON.stringify(row.languages)}`);
    });
    
    console.log('\n✅ Languages migration completed!');
    console.log('   Users can now select languages using the same country/region options as cultural identity.');
    
    await client.end();
    
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    await client.end();
  }
}

migrateLanguagesToCountryCodes();
