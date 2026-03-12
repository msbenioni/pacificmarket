// Manually insert founder data to fix Insights page
const { Client } = require('pg');

const connectionString = 'postgresql://postgres:MontBlanc3001@db.mnmisjprswpuvcojnbip.supabase.co:5432/postgres';

const client = new Client({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});

async function insertFounderData() {
  try {
    await client.connect();
    console.log('🔗 Connected to database');
    
    // Insert the founder data manually based on the sample record provided
    const founderData = {
      id: '633ff42e-0650-49b5-a7d2-e28c4394a110',
      user_id: '364269e4-a6c5-4122-bf63-0d318607effd', // Use the user_id from the second record
      snapshot_year: 2026,
      submitted_date: '2026-03-10T02:41:36.616+00:00',
      gender: 'female',
      age_range: '45-54',
      years_entrepreneurial: '10+',
      entrepreneurial_background: null,
      businesses_founded: 'multiple',
      family_entrepreneurial_background: false,
      founder_role: null,
      founder_story: null,
      founder_motivation_array: ['financial_independence', 'solving_problem', 'legacy_building'],
      pacific_identity: null,
      based_in_country: null,
      based_in_city: null,
      serves_pacific_communities: null,
      culture_influences_business: false,
      culture_influence_details: null,
      family_community_responsibilities_affect_business: null,
      responsibilities_impact_details: null,
      mentorship_access: false,
      mentorship_offering: true,
      barriers_to_mentorship: null,
      angel_investor_interest: 'exploring-options',
      investor_capacity: null,
      collaboration_interest: true,
      open_to_future_contact: false,
      goals_details: null,
      goals_next_12_months_array: null,
      created_date: '2026-03-12T21:30:26.103862+00:00',
      updated_at: '2026-03-12T21:30:26.103862+00:00'
    };
    
    console.log('👤 Inserting founder data...');
    
    const query = `
      INSERT INTO founder_insights (
        id, user_id, snapshot_year, submitted_date, gender, age_range,
        years_entrepreneurial, entrepreneurial_background, businesses_founded,
        family_entrepreneurial_background, founder_role, founder_story,
        founder_motivation_array, pacific_identity, based_in_country,
        based_in_city, serves_pacific_communities, culture_influences_business,
        culture_influence_details, family_community_responsibilities_affect_business,
        responsibilities_impact_details, mentorship_access, mentorship_offering,
        barriers_to_mentorship, angel_investor_interest, investor_capacity,
        collaboration_interest, open_to_future_contact, goals_details,
        goals_next_12_months_array, created_date, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33
      )
      ON CONFLICT (id) DO NOTHING
    `;
    
    await client.query(query, [
      founderData.id, founderData.user_id, founderData.snapshot_year, founderData.submitted_date,
      founderData.gender, founderData.age_range, founderData.years_entrepreneurial,
      founderData.entrepreneurial_background, founderData.businesses_founded,
      founderData.family_entrepreneurial_background, founderData.founder_role,
      founderData.founder_story, founderData.founder_motivation_array,
      founderData.pacific_identity, founderData.based_in_country, founderData.based_in_city,
      founderData.serves_pacific_communities, founderData.culture_influences_business,
      founderData.culture_influence_details, founderData.family_community_responsibilities_affect_business,
      founderData.responsibilities_impact_details, founderData.mentorship_access,
      founderData.mentorship_offering, founderData.barriers_to_mentorship,
      founderData.angel_investor_interest, founderData.investor_capacity,
      founderData.collaboration_interest, founderData.open_to_future_contact,
      founderData.goals_details, founderData.goals_next_12_months_array,
      founderData.created_date, founderData.updated_at
    ]);
    
    console.log('✅ Founder data inserted successfully!');
    
    // Verify the insertion
    const result = await client.query('SELECT gender, age_range, years_entrepreneurial, founder_motivation_array FROM founder_insights WHERE id = $1', [founderData.id]);
    
    if (result.rows.length > 0) {
      console.log('\n📝 Founder data verification:');
      console.log(result.rows[0]);
    }
    
    // Check final counts
    const founderCount = await client.query('SELECT COUNT(*) FROM founder_insights');
    const businessCount = await client.query('SELECT COUNT(*) FROM business_insights');
    
    console.log('\n🎉 Final Database State:');
    console.log(`📊 Results:`);
    console.log(`   Founder insights: ${founderCount.rows[0].count} records`);
    console.log(`   Business insights: ${businessCount.rows[0].count} records`);
    
    console.log('\n✅ Insights page should now show real data! 🚀');
    
    await client.end();
    
  } catch (err) {
    console.error('❌ Insert failed:', err.message);
    await client.end();
  }
}

insertFounderData();
