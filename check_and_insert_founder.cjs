// Check founder_insights schema and insert data correctly
const { Client } = require('pg');

const connectionString = 'postgresql://postgres:MontBlanc3001@db.mnmisjprswpuvcojnbip.supabase.co:5432/postgres';

const client = new Client({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});

async function checkAndInsertFounderData() {
  try {
    await client.connect();
    console.log('🔗 Connected to database');
    
    // Get exact founder_insights schema
    const founderSchema = await client.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'founder_insights' 
      AND table_schema = 'public'
      ORDER BY ordinal_position
    `);
    
    const founderColumns = founderSchema.rows.map(row => row.column_name);
    console.log(`Founder insights has ${founderColumns.length} columns:`, founderColumns);
    
    // Insert only the essential data for Insights page to work
    const essentialData = {
      id: '633ff42e-0650-49b5-a7d2-e28c4394a110',
      user_id: '364269e4-a6c5-4122-bf63-0d318607effd',
      snapshot_year: 2026,
      submitted_date: '2026-03-10T02:41:36.616+00:00',
      gender: 'female',
      age_range: '45-54',
      years_entrepreneurial: '10+',
      founder_motivation_array: ['financial_independence', 'solving_problem', 'legacy_building'],
      collaboration_interest: true,
      mentorship_offering: true,
      angel_investor_interest: 'exploring-options',
      created_date: '2026-03-12T21:30:26.103862+00:00',
      updated_at: '2026-03-12T21:30:26.103862+00:00'
    };
    
    console.log('👤 Inserting essential founder data...');
    
    // Build query with only available columns
    const availableColumns = ['id', 'user_id', 'snapshot_year', 'submitted_date', 'gender', 'age_range', 'years_entrepreneurial', 'founder_motivation_array', 'collaboration_interest', 'mentorship_offering', 'angel_investor_interest', 'created_date', 'updated_at'];
    
    const query = `
      INSERT INTO founder_insights (${availableColumns.join(', ')})
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      ON CONFLICT (id) DO NOTHING
    `;
    
    await client.query(query, [
      essentialData.id, essentialData.user_id, essentialData.snapshot_year, essentialData.submitted_date,
      essentialData.gender, essentialData.age_range, essentialData.years_entrepreneurial,
      essentialData.founder_motivation_array, essentialData.collaboration_interest,
      essentialData.mentorship_offering, essentialData.angel_investor_interest,
      essentialData.created_date, essentialData.updated_at
    ]);
    
    console.log('✅ Founder data inserted successfully!');
    
    // Verify the insertion
    const result = await client.query('SELECT gender, age_range, years_entrepreneurial, founder_motivation_array FROM founder_insights WHERE id = $1', [essentialData.id]);
    
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

checkAndInsertFounderData();
