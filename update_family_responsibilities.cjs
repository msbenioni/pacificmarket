// Update founder record to include family responsibilities data
const { Client } = require('pg');

const connectionString = 'postgresql://postgres:MontBlanc3001@db.mnmisjprswpuvcojnbip.supabase.co:5432/postgres';

const client = new Client({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});

async function updateFounderFamilyResponsibilities() {
  try {
    await client.connect();
    console.log('🔗 Connected to database');
    
    // Update the founder record to include family responsibilities
    const updateQuery = `
      UPDATE founder_insights 
      SET 
        family_community_responsibilities_affect_business = ARRAY['extended_family', 'caring_for_children'],
        responsibilities_impact_details = 'Balancing business growth with family commitments and community responsibilities'
      WHERE id = '633ff42e-0650-49b5-a7d2-e28c4394a110'
    `;
    
    await client.query(updateQuery);
    console.log('✅ Updated founder record with family responsibilities data');
    
    // Verify the update
    const result = await client.query(`
      SELECT gender, age_range, years_entrepreneurial, founder_motivation_array, 
             family_community_responsibilities_affect_business, responsibilities_impact_details
      FROM founder_insights 
      WHERE id = '633ff42e-0650-49b5-a7d2-e28c4394a110'
    `);
    
    if (result.rows.length > 0) {
      console.log('\n📝 Updated founder record:');
      console.log(result.rows[0]);
    }
    
    console.log('\n✅ Family responsibilities data added! Insights page should now show this data. 🚀');
    
    await client.end();
    
  } catch (err) {
    console.error('❌ Update failed:', err.message);
    await client.end();
  }
}

updateFounderFamilyResponsibilities();
