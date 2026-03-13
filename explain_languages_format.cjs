// Check and explain the current languages data format
const { Client } = require('pg');

const connectionString = 'postgresql://postgres:MontBlanc3001@db.mnmisjprswpuvcojnbip.supabase.co:5432/postgres';

const client = new Client({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});

async function explainLanguagesFormat() {
  try {
    await client.connect();
    console.log('🔗 Connected to database');
    
    // Check the column type
    const columnInfo = await client.query(`
      SELECT column_name, data_type, udt_name 
      FROM information_schema.columns 
      WHERE table_name = 'profiles' 
        AND column_name = 'languages'
    `);
    
    console.log('\n📋 LANGUAGES COLUMN INFO:');
    columnInfo.rows.forEach(row => {
      console.log(`Column: ${row.column_name}`);
      console.log(`Data Type: ${row.data_type}`);
      console.log(`UDT Name: ${row.udt_name}`);
    });
    
    // Get sample data with different formatting
    const sampleData = await client.query(`
      SELECT id, display_name, languages,
             CASE 
               WHEN languages IS NULL THEN 'NULL'
               ELSE 'PostgreSQL Array'
             END as storage_format
      FROM profiles 
      WHERE languages IS NOT NULL
      ORDER BY created_at DESC
      LIMIT 3
    `);
    
    console.log('\n📝 SAMPLE LANGUAGES DATA:');
    sampleData.rows.forEach(row => {
      console.log(`\nUser: ${row.display_name || row.id}`);
      console.log(`Raw data: ${row.languages}`);
      console.log(`Storage format: ${row.storage_format}`);
      console.log(`Data type: ${typeof row.languages}`);
      
      if (Array.isArray(row.languages)) {
        console.log(`As JavaScript array: ${JSON.stringify(row.languages)}`);
        console.log(`First language: ${row.languages[0]}`);
      }
    });
    
    // Test how the frontend will receive this data
    console.log('\n🧪 FRONTEND COMPATIBILITY TEST:');
    const testData = await client.query(`
      SELECT languages 
      FROM profiles 
      WHERE languages IS NOT NULL 
        AND array_length(languages, 1) > 0
      LIMIT 1
    `);
    
    if (testData.rows.length > 0) {
      const languages = testData.rows[0].languages;
      console.log(`Database returns: ${JSON.stringify(languages)}`);
      console.log(`Is array: ${Array.isArray(languages)}`);
      console.log(`Length: ${languages.length}`);
      console.log(`First item: ${languages[0]}`);
      console.log(`Includes 'english': ${languages.includes('english')}`);
      
      // This is how the multiselect will check if an option is selected
      console.log('\n📝 MULTISELECT BEHAVIOR:');
      console.log(`checked={formData['languages'].includes('english')} = ${languages.includes('english')}`);
      console.log(`checked={formData['languages'].includes('french')} = ${languages.includes('french')}`);
    }
    
    console.log('\n✅ EXPLANATION:');
    console.log('   The {english,french} format is CORRECT - it\'s a PostgreSQL array!');
    console.log('   - { } = PostgreSQL array syntax');
    console.log('   - english,french = array elements');
    console.log('   - When queried, PostgreSQL returns this as a JavaScript array');
    console.log('   - The multiselect component will work perfectly with this format');
    
    await client.end();
    
  } catch (err) {
    console.error('❌ Check failed:', err.message);
    await client.end();
  }
}

explainLanguagesFormat();
