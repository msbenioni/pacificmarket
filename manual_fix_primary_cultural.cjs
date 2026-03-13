// Manually fix the specific problematic primary_cultural entry
const { Client } = require('pg');

const connectionString = 'postgresql://postgres:MontBlanc3001@db.mnmisjprswpuvcojnbip.supabase.co:5432/postgres';

const client = new Client({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});

async function manuallyFixPrimaryCultural() {
  try {
    await client.connect();
    console.log('🔗 Connected to database');
    
    // Get the specific problematic entry
    const problematicEntry = await client.query(`
      SELECT id, display_name, primary_cultural 
      FROM profiles 
      WHERE display_name LIKE '%Jasmin%' 
      ORDER BY created_at DESC
      LIMIT 1
    `);
    
    if (problematicEntry.rows.length > 0) {
      const profile = problematicEntry.rows[0];
      
      console.log(`\n🔄 Manually fixing: ${profile.display_name || profile.id}`);
      console.log(`  Current primary_cultural: ${JSON.stringify(profile.primary_cultural)}`);
      
      // Based on the output, we can see it should contain: australia, australia-aboriginal, cook-islands, fiji
      const fixedCountries = ['australia', 'australia-aboriginal', 'cook-islands', 'fiji'];
      
      // Convert to PostgreSQL array format
      const postgresArray = `{${fixedCountries.map(country => `"${country}"`).join(',')}}`;
      
      await client.query(`
        UPDATE profiles 
        SET primary_cultural = $1 
        WHERE id = $2
      `, [postgresArray, profile.id]);
      
      console.log(`  ✅ Fixed to: ${JSON.stringify(fixedCountries)}`);
      
      // Verify the fix
      const verifyData = await client.query(`
        SELECT id, display_name, primary_cultural 
        FROM profiles 
        WHERE id = $1
      `, [profile.id]);
      
      if (verifyData.rows.length > 0) {
        const verified = verifyData.rows[0];
        console.log(`\n🧪 VERIFIED:`);
        console.log(`User: ${verified.display_name || verified.id}`);
        console.log(`primary_cultural: ${JSON.stringify(verified.primary_cultural)}`);
      }
    } else {
      console.log('❌ Could not find the problematic entry');
    }
    
    console.log('\n✅ Manual fix completed!');
    
    await client.end();
    
  } catch (err) {
    console.error('❌ Manual fix failed:', err.message);
    await client.end();
  }
}

manuallyFixPrimaryCultural();
