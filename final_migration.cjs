// Final migration with proper null handling
const { Client } = require('pg');

const connectionString = 'postgresql://postgres:MontBlanc3001@db.mnmisjprswpuvcojnbip.supabase.co:5432/postgres';

const client = new Client({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});

async function finalMigration() {
  try {
    await client.connect();
    console.log('🔗 Connected to database');
    
    // Get all data from old table
    const oldDataResult = await client.query('SELECT * FROM business_insights_snapshots');
    const oldData = oldDataResult.rows;
    
    console.log(`📊 Found ${oldData.length} records to migrate`);
    
    if (oldData.length === 0) {
      console.log('❌ No data to migrate');
      await client.end();
      return;
    }
    
    // Migrate founder data
    const founderRecords = oldData.filter(record => 
      record.user_id && (record.gender || record.age_range || record.years_entrepreneurial)
    );
    
    if (founderRecords.length > 0) {
      console.log(`👤 Migrating ${founderRecords.length} founder records...`);
      
      for (const record of founderRecords) {
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
          record.id, record.user_id, record.snapshot_year, record.submitted_date,
          record.gender, record.age_range, record.years_entrepreneurial,
          record.entrepreneurial_background, record.businesses_founded,
          record.family_entrepreneurial_background, record.founder_role,
          record.founder_story, record.founder_motivation_array,
          record.pacific_identity, record.based_in_country, record.based_in_city,
          record.serves_pacific_communities, record.culture_influences_business,
          record.culture_influence_details, record.family_community_responsibilities_affect_business,
          record.responsibilities_impact_details, record.mentorship_access,
          record.mentorship_offering, record.barriers_to_mentorship,
          record.angel_investor_interest, record.investor_capacity,
          record.collaboration_interest, record.open_to_future_contact,
          record.goals_details, record.goals_next_12_months_array,
          record.created_date, record.updated_at
        ]);
      }
      
      console.log(`✅ Migrated ${founderRecords.length} founder records`);
    }
    
    // Migrate business data
    console.log(`💼 Migrating ${oldData.length} business records...`);
    
    for (const record of oldData) {
      const query = `
        INSERT INTO business_insights (
          id, business_id, user_id, snapshot_year, submitted_date, year_started,
          problem_solved, team_size_band, business_model, family_involvement,
          customer_region, sales_channels, import_export_status, import_countries,
          export_countries, business_stage, top_challenges, hiring_intentions,
          business_operating_status, business_age, business_registered, employs_anyone,
          employs_family_community, team_size, revenue_band, current_funding_source,
          funding_amount_needed, funding_purpose, investment_stage, revenue_streams,
          financial_challenges, investment_exploration, community_impact_areas,
          support_needed_next, current_support_sources, expansion_plans,
          industry, created_date, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44
        )
        ON CONFLICT (id) DO NOTHING
      `;
      
      await client.query(query, [
        record.id, record.business_id, record.user_id, record.snapshot_year, record.submitted_date,
        record.year_started, record.problem_solved, record.team_size_band, record.business_model,
        record.family_involvement, record.customer_region, record.sales_channels,
        record.import_export_status, record.import_countries, record.export_countries,
        record.business_stage, record.top_challenges, record.hiring_intentions,
        record.business_operating_status, record.business_age, record.business_registered,
        record.employs_anyone, record.employs_family_community, record.team_size,
        record.revenue_band, record.current_funding_source, record.funding_amount_needed,
        record.funding_purpose, record.investment_stage, record.revenue_streams,
        record.financial_challenges, record.investment_exploration, record.community_impact_areas,
        record.support_needed_next, record.current_support_sources, record.expansion_plans,
        record.industry, record.created_date, record.updated_at
      ]);
    }
    
    console.log(`✅ Migrated ${oldData.length} business records`);
    
    // Verify final state
    const founderCountResult = await client.query('SELECT COUNT(*) FROM founder_insights');
    const businessCountResult = await client.query('SELECT COUNT(*) FROM business_insights');
    
    console.log('\n🎉 Migration Complete!');
    console.log(`📊 Final Results:`);
    console.log(`   Founder insights: ${founderCountResult.rows[0].count} records`);
    console.log(`   Business insights: ${businessCountResult.rows[0].count} records`);
    
    // Show sample data
    const sampleFounder = await client.query('SELECT gender, age_range, years_entrepreneurial, founder_motivation_array FROM founder_insights LIMIT 1');
    if (sampleFounder.rows.length > 0) {
      console.log('\n📝 Sample founder data:');
      console.log(sampleFounder.rows[0]);
    }
    
    console.log('\n✅ Insights page should now work with real data! 🚀');
    
    await client.end();
    
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    await client.end();
  }
}

finalMigration();
