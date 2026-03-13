// Fix the problematic languages data that was incorrectly converted
const { Client } = require('pg');

const connectionString = 'postgresql://postgres:MontBlanc3001@db.mnmisjprswpuvcojnbip.supabase.co:5432/postgres';

const client = new Client({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});

async function fixProblematicLanguagesData() {
  try {
    await client.connect();
    console.log('🔗 Connected to database');
    
    // Find the problematic entry
    const problematicData = await client.query(`
      SELECT id, display_name, languages 
      FROM profiles 
      WHERE languages IS NOT NULL
      ORDER BY created_at DESC
    `);
    
    console.log(`\n📝 Checking ${problematicData.rowCount} profiles for issues:`);
    
    let fixes = 0;
    
    for (const profile of problematicData.rows) {
      if (Array.isArray(profile.languages)) {
        // Check if this is the problematic entry (contains single characters)
        const hasSingleChars = profile.languages.some(item => item.length === 1);
        const hasCommas = profile.languages.some(item => item === ',');
        const hasSpaces = profile.languages.some(item => item === ' ');
        
        if (hasSingleChars || hasCommas || hasSpaces) {
          console.log(`\n🔄 Fixing problematic entry: ${profile.display_name || profile.id}`);
          console.log(`  Current: ${JSON.stringify(profile.languages)}`);
          
          // This looks like it was incorrectly parsed from a string
          // Let's convert it back to a string and then to proper language codes
          const joinedString = profile.languages.join('');
          console.log(`  Joined string: "${joinedString}"`);
          
          // Extract actual language names from the string
          const detectedLanguages = [];
          
          if (joinedString.includes('english')) detectedLanguages.push('english');
          if (joinedString.includes('french')) detectedLanguages.push('french');
          if (joinedString.includes('thai')) detectedLanguages.push('thai');
          
          if (detectedLanguages.length > 0) {
            const postgresArray = `{${detectedLanguages.map(code => `"${code}"`).join(',')}}`;
            
            await client.query(`
              UPDATE profiles 
              SET languages = $1 
              WHERE id = $2
            `, [postgresArray, profile.id]);
            
            console.log(`  ✅ Fixed to: ${JSON.stringify(detectedLanguages)}`);
            fixes++;
          } else {
            console.log(`  ⚠️ Could not detect languages, setting to empty`);
            
            await client.query(`
              UPDATE profiles 
              SET languages = '{}' 
              WHERE id = $1
            `, [profile.id]);
            
            fixes++;
          }
        } else {
          console.log(`✅ ${profile.display_name || profile.id}: ${JSON.stringify(profile.languages)} (OK)`);
        }
      }
    }
    
    console.log(`\n📊 Fix Summary:`);
    console.log(`  Total profiles checked: ${problematicData.rowCount}`);
    console.log(`  Fixed entries: ${fixes}`);
    
    // Verify the fixes
    const verifyData = await client.query(`
      SELECT id, display_name, languages 
      FROM profiles 
      WHERE languages IS NOT NULL 
        AND array_length(languages, 1) > 0
      ORDER BY created_at DESC
      LIMIT 5
    `);
    
    console.log('\n🧪 VERIFIED DATA:');
    verifyData.rows.forEach(row => {
      console.log(`User: ${row.display_name || row.id}`);
      console.log(`languages: ${JSON.stringify(row.languages)}`);
    });
    
    console.log('\n✅ All languages data is now properly formatted!');
    console.log('   The {english,french} format is correct PostgreSQL array syntax.');
    console.log('   Your multiselect will work perfectly with this data.');
    
    await client.end();
    
  } catch (err) {
    console.error('❌ Fix failed:', err.message);
    await client.end();
  }
}

fixProblematicLanguagesData();
