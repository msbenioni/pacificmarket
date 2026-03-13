// Replace existing language names with country codes from COUNTRIES list
const { Client } = require('pg');

const connectionString = 'postgresql://postgres:MontBlanc3001@db.mnmisjprswpuvcojnbip.supabase.co:5432/postgres';

const client = new Client({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});

// Simple mapping from existing language names to appropriate country codes
const LANGUAGE_TO_COUNTRY_CODE = {
  'English': 'new-zealand',        // English widely spoken in New Zealand
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
  'Hawaiian': 'hawaii',            // Hawaiian in Hawaii
};

async function replaceLanguagesWithCountryCodes() {
  try {
    await client.connect();
    console.log('🔗 Connected to database');
    
    // Get all profiles with languages data
    const profilesData = await client.query(`
      SELECT id, display_name, languages 
      FROM profiles 
      WHERE languages IS NOT NULL
      ORDER BY created_at DESC
    `);
    
    console.log(`\n📝 Found ${profilesData.rowCount} profiles with languages data`);
    
    let totalUpdates = 0;
    
    for (const profile of profilesData.rows) {
      console.log(`\n🔄 Processing: ${profile.display_name || profile.id}`);
      console.log(`  Current languages: ${JSON.stringify(profile.languages)}`);
      
      const countryCodes = [];
      const unmappedLanguages = [];
      
      // Convert each language name to country code
      for (const language of profile.languages) {
        const countryCode = LANGUAGE_TO_COUNTRY_CODE[language];
        if (countryCode) {
          if (!countryCodes.includes(countryCode)) {
            countryCodes.push(countryCode);
          }
        } else {
          unmappedLanguages.push(language);
        }
      }
      
      if (countryCodes.length > 0) {
        // Convert to PostgreSQL array format
        const postgresArray = `{${countryCodes.map(code => `"${code}"`).join(',')}}`;
        
        await client.query(`
          UPDATE profiles 
          SET languages = $1 
          WHERE id = $2
        `, [postgresArray, profile.id]);
        
        console.log(`  ✅ Replaced with country codes: ${JSON.stringify(countryCodes)}`);
        totalUpdates++;
        
        if (unmappedLanguages.length > 0) {
          console.log(`  ⚠️ Unmapped languages removed: ${JSON.stringify(unmappedLanguages)}`);
        }
      } else {
        console.log(`  ❌ No mappings found, setting to empty array`);
        
        await client.query(`
          UPDATE profiles 
          SET languages = '{}' 
          WHERE id = $1
        `, [profile.id]);
        
        totalUpdates++;
      }
    }
    
    console.log(`\n📊 Update Summary:`);
    console.log(`  Total profiles processed: ${profilesData.rowCount}`);
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
    
    console.log('\n✅ Languages have been replaced with country codes!');
    console.log('   The languages field now uses the same country codes as cultural identity.');
    
    await client.end();
    
  } catch (err) {
    console.error('❌ Update failed:', err.message);
    await client.end();
  }
}

replaceLanguagesWithCountryCodes();
