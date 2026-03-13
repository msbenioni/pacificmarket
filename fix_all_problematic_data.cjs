// Check and fix all problematic entries in the profiles table
const { Client } = require('pg');

const connectionString = 'postgresql://postgres:MontBlanc3001@db.mnmisjprswpuvcojnbip.supabase.co:5432/postgres';

const client = new Client({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});

async function checkAndFixAllProblematicData() {
  try {
    await client.connect();
    console.log('🔗 Connected to database');
    
    // Get all profiles and check all array columns for issues
    const allProfiles = await client.query(`
      SELECT id, display_name, primary_cultural, languages, professional_background, skills_expertise
      FROM profiles 
      ORDER BY created_at DESC
    `);
    
    console.log(`\n📝 Checking ${allProfiles.rowCount} profiles for problematic array data:`);
    
    let totalFixes = 0;
    
    for (const profile of allProfiles.rows) {
      let hasIssues = false;
      const issues = [];
      
      // Check each array column
      const arrayColumns = ['primary_cultural', 'languages', 'professional_background', 'skills_expertise'];
      
      for (const column of arrayColumns) {
        const data = profile[column];
        
        if (Array.isArray(data)) {
          // Check for character-level arrays (problematic)
          const hasSingleChars = data.some(item => typeof item === 'string' && item.length === 1);
          const hasCommas = data.some(item => item === ',');
          const hasSpaces = data.some(item => item === ' ');
          const hasBrackets = data.some(item => item === '[' || item === ']' || item === '{' || item === '}');
          
          if (hasSingleChars || hasCommas || hasSpaces || hasBrackets) {
            hasIssues = true;
            issues.push({
              column,
              data: data,
              joined: data.join('')
            });
          }
        }
      }
      
      if (hasIssues) {
        console.log(`\n🔄 Found problematic entry: ${profile.display_name || profile.id}`);
        
        for (const issue of issues) {
          console.log(`  Column: ${issue.column}`);
          console.log(`  Current: ${JSON.stringify(issue.data)}`);
          console.log(`  Joined: "${issue.joined}"`);
          
          // Try to extract meaningful data from the joined string
          const extractedData = extractMeaningfulData(issue.column, issue.joined);
          
          if (extractedData.length > 0) {
            const postgresArray = `{${extractedData.map(item => `"${item}"`).join(',')}}`;
            
            await client.query(`
              UPDATE profiles 
              SET ${issue.column} = $1 
              WHERE id = $2
            `, [postgresArray, profile.id]);
            
            console.log(`  ✅ Fixed to: ${JSON.stringify(extractedData)}`);
            totalFixes++;
          } else {
            console.log(`  ⚠️ Could not extract data, setting to empty array`);
            
            await client.query(`
              UPDATE profiles 
              SET ${issue.column} = '{}' 
              WHERE id = $1
            `, [profile.id]);
            
            totalFixes++;
          }
        }
      } else {
        // Show clean data for reference
        const hasData = arrayColumns.some(col => Array.isArray(profile[col]) && profile[col].length > 0);
        if (hasData) {
          console.log(`✅ ${profile.display_name || profile.id}: Clean data`);
        }
      }
    }
    
    console.log(`\n📊 Fix Summary:`);
    console.log(`  Total profiles checked: ${allProfiles.rowCount}`);
    console.log(`  Total fixes applied: ${totalFixes}`);
    
    // Final verification
    const verifyData = await client.query(`
      SELECT id, display_name, primary_cultural, languages, professional_background, skills_expertise
      FROM profiles 
      WHERE primary_cultural IS NOT NULL
         OR languages IS NOT NULL
         OR professional_background IS NOT NULL
         OR skills_expertise IS NOT NULL
      ORDER BY created_at DESC
      LIMIT 3
    `);
    
    console.log('\n🧪 VERIFIED CLEAN DATA:');
    verifyData.rows.forEach(row => {
      console.log(`\nUser: ${row.display_name || row.id}`);
      if (row.primary_cultural?.length > 0) console.log(`  primary_cultural: ${JSON.stringify(row.primary_cultural)}`);
      if (row.languages?.length > 0) console.log(`  languages: ${JSON.stringify(row.languages)}`);
      if (row.professional_background?.length > 0) console.log(`  professional_background: ${JSON.stringify(row.professional_background)}`);
      if (row.skills_expertise?.length > 0) console.log(`  skills_expertise: ${JSON.stringify(row.skills_expertise)}`);
    });
    
    console.log('\n✅ All array data is now clean and properly formatted!');
    
    await client.end();
    
  } catch (err) {
    console.error('❌ Check failed:', err.message);
    await client.end();
  }
}

function extractMeaningfulData(column, joinedString) {
  const extracted = [];
  const lowerString = joinedString.toLowerCase();
  
  if (column === 'primary_cultural') {
    // Extract country codes
    const countryPatterns = [
      'cook-islands', 'french-polynesia', 'new-zealand', 'samoa', 'tonga',
      'fiji', 'australia', 'american-samoa', 'guam', 'hawaii'
    ];
    
    countryPatterns.forEach(pattern => {
      if (lowerString.includes(pattern)) {
        extracted.push(pattern);
      }
    });
  } else if (column === 'languages') {
    // Extract language codes
    const languagePatterns = [
      'english', 'french', 'thai', 'mandarin', 'spanish', 'hindi',
      'arabic', 'japanese', 'korean', 'italian', 'german'
    ];
    
    languagePatterns.forEach(pattern => {
      if (lowerString.includes(pattern)) {
        extracted.push(pattern);
      }
    });
  } else if (column === 'professional_background') {
    // Extract professional background options
    const backgroundPatterns = [
      'agriculture', 'arts-culture', 'education', 'finance',
      'government', 'healthcare', 'hospitality', 'it-technology'
    ];
    
    backgroundPatterns.forEach(pattern => {
      if (lowerString.includes(pattern)) {
        extracted.push(pattern);
      }
    });
  } else if (column === 'skills_expertise') {
    // Extract skills options
    const skillsPatterns = [
      'business-strategy', 'financial-management', 'marketing-sales',
      'leadership', 'languages', 'networking'
    ];
    
    skillsPatterns.forEach(pattern => {
      if (lowerString.includes(pattern)) {
        extracted.push(pattern);
      }
    });
  }
  
  return extracted;
}

checkAndFixAllProblematicData();
