// Convert existing country codes in languages to proper language codes
const { Client } = require('pg');

const connectionString = 'postgresql://postgres:MontBlanc3001@db.mnmisjprswpuvcojnbip.supabase.co:5432/postgres';

const client = new Client({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});

// Map current country codes to language codes
const COUNTRY_TO_LANGUAGE_MAPPING = {
  'new-zealand': 'english',           // English in New Zealand
  'french-polynesia': 'french',      // French in French Polynesia
  'australia': 'english',             // English in Australia
  'samoa': 'samoan',                 // Samoan in Samoa
  'tonga': 'tongan',                 // Tongan in Tonga
  'fiji': 'fijian',                  // Fijian in Fiji
  'cook-islands': 'cook-islands-maori', // Cook Islands Māori
  'niue': 'niuean',                  // Niuean in Niue
  'tokelau': 'tokelauan',            // Tokelauan in Tokelau
  'tuvalu': 'tuvaluan',              // Tuvaluan in Tuvalu
  'kiribati': 'kiribati',            // Kiribati in Kiribati
  'marshall-islands': 'marshallese',  // Marshallese in Marshall Islands
  'palau': 'palauan',                // Palauan in Palau
  'guam': 'chamorro',                // Chamorro in Guam
  'papua-new-guinea': 'papua-new-guinea', // PNG languages
  'solomon-islands': 'solomon-islands', // SI languages
  'vanuatu': 'vanuatuan',            // Vanuatuan in Vanuatu
  'new-caledonia': 'new-caledonian', // New Caledonian languages
  'wallis-futuna': 'wallisian',      // Wallisian in Wallis & Futuna
  'micronesia': 'micronesian',       // Micronesian languages
  'hawaii': 'hawaiian',              // Hawaiian in Hawaii
};

async function convertCountryCodesToLanguageCodes() {
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
      if (Array.isArray(profile.languages) && profile.languages.length > 0) {
        console.log(`\n🔄 Processing: ${profile.display_name || profile.id}`);
        console.log(`  Current country codes: ${JSON.stringify(profile.languages)}`);
        
        const languageCodes = [];
        const unmappedCodes = [];
        
        // Convert each country code to language code
        for (const countryCode of profile.languages) {
          const languageCode = COUNTRY_TO_LANGUAGE_MAPPING[countryCode];
          if (languageCode) {
            if (!languageCodes.includes(languageCode)) {
              languageCodes.push(languageCode);
            }
          } else {
            unmappedCodes.push(countryCode);
          }
        }
        
        if (languageCodes.length > 0) {
          // Convert to PostgreSQL array format
          const postgresArray = `{${languageCodes.map(code => `"${code}"`).join(',')}}`;
          
          await client.query(`
            UPDATE profiles 
            SET languages = $1 
            WHERE id = $2
          `, [postgresArray, profile.id]);
          
          console.log(`  ✅ Converted to language codes: ${JSON.stringify(languageCodes)}`);
          totalUpdates++;
          
          if (unmappedCodes.length > 0) {
            console.log(`  ⚠️ Unmapped country codes: ${JSON.stringify(unmappedCodes)}`);
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
    }
    
    console.log(`\n📊 Conversion Summary:`);
    console.log(`  Total profiles processed: ${profilesData.rowCount}`);
    console.log(`  Successfully converted: ${totalUpdates}`);
    
    // Verify the conversion
    const verifyData = await client.query(`
      SELECT id, display_name, languages 
      FROM profiles 
      WHERE languages IS NOT NULL 
        AND array_length(languages, 1) > 0
      ORDER BY created_at DESC
      LIMIT 5
    `);
    
    console.log('\n🧪 VERIFIED CONVERTED DATA:');
    verifyData.rows.forEach(row => {
      console.log(`User: ${row.display_name || row.id}`);
      console.log(`languages: ${JSON.stringify(row.languages)}`);
    });
    
    console.log('\n✅ Languages converted from country codes to language codes!');
    console.log('   Users can now select from a comprehensive list of Pacific and world languages.');
    
    await client.end();
    
  } catch (err) {
    console.error('❌ Conversion failed:', err.message);
    await client.end();
  }
}

convertCountryCodesToLanguageCodes();
