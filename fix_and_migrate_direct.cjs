// Direct SQL approach to fix schema and migrate data
const { Client } = require('pg');

const connectionString = 'postgresql://postgres:MontBlanc3001@db.mnmisjprswpuvcojnbip.supabase.co:5432/postgres';

const client = new Client({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});

async function fixSchemaAndMigrate() {
  try {
    await client.connect();
    console.log('🔗 Connected to database');
    
    // Step 1: Fix the schema
    console.log('🔧 Adding missing user_id column to business_insights...');
    
    try {
      await client.query(`
        ALTER TABLE business_insights 
        ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
      `);
      console.log('✅ Schema fixed successfully');
    } catch (err) {
      console.log('ℹ️ Column may already exist or other schema issue:', err.message);
    }
    
    // Step 2: Migrate data from old table
    console.log('📊 Migrating data from business_insights_snapshots...');
    
    // Check old table data
    const oldDataResult = await client.query('SELECT * FROM business_insights_snapshots');
    const oldData = oldDataResult.rows;
    
    console.log(`Found ${oldData.length} records to migrate`);
    
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
        await client.query(`
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
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33)
          ON CONFLICT (id) DO UPDATE SET
            user_id = EXCLUDED.user_id,
            snapshot_year = EXCLUDED.snapshot_year,
            submitted_date = EXCLUDED.submitted_date,
            gender = EXCLUDED.gender,
            age_range = EXCLUDED.age_range,
            years_entrepreneurial = EXCLUDED.years_entrepreneurial,
            entrepreneurial_background = EXCLUDED.entrepreneurial_background,
            businesses_founded = EXCLUDED.businesses_founded,
            family_entrepreneurial_background = EXCLUDED.family_entrepreneurial_background,
            founder_role = EXCLUDED.founder_role,
            founder_story = EXCLUDED.founder_story,
            founder_motivation_array = EXCLUDED.founder_motivation_array,
            pacific_identity = EXCLUDED.pacific_identity,
            based_in_country = EXCLUDED.based_in_country,
            based_in_city = EXCLUDED.based_in_city,
            serves_pacific_communities = EXCLUDED.serves_pacific_communities,
            culture_influences_business = EXCLUDED.culture_influences_business,
            culture_influence_details = EXCLUDED.culture_influence_details,
            family_community_responsibilities_affect_business = EXCLUDED.family_community_responsibilities_affect_business,
            responsibilities_impact_details = EXCLUDED.responsibilities_impact_details,
            mentorship_access = EXCLUDED.mentorship_access,
            mentorship_offering = EXCLUDED.mentorship_offering,
            barriers_to_mentorship = EXCLUDED.barriers_to_mentorship,
            angel_investor_interest = EXCLUDED.angel_investor_interest,
            investor_capacity = EXCLUDED.investor_capacity,
            collaboration_interest = EXCLUDED.collaboration_interest,
            open_to_future_contact = EXCLUDED.open_to_future_contact,
            goals_details = EXCLUDED.goals_details,
            goals_next_12_months_array = EXCLUDED.goals_next_12_months_array,
            created_date = EXCLUDED.created_date,
            updated_at = EXCLUDED.updated_at
        `, [
          record.id, record.user_id, record.snapshot_year, record.submitted_date, 
          record.gender, record.age_range, record.years_entrepreneurial,
          record.entrepreneurial_background, record.businesses_founded,
          record.family_entrepreneurial_background, record.founder_role,
          record.founder_story, JSON.stringify(record.founder_motivation_array),
          JSON.stringify(record.pacific_identity), record.based_in_country,
          record.based_in_city, record.serves_pacific_communities,
          record.culture_influences_business, record.culture_influence_details,
          JSON.stringify(record.family_community_responsibilities_affect_business),
          record.responsibilities_impact_details, record.mentorship_access,
          record.mentorship_offering, record.barriers_to_mentorship,
          record.angel_investor_interest, record.investor_capacity,
          record.collaboration_interest, record.open_to_future_contact,
          record.goals_details, JSON.stringify(record.goals_next_12_months_array),
          record.created_date, record.updated_at
        ]);
      }
      
      console.log(`✅ Migrated ${founderRecords.length} founder records`);
    }
    
    // Migrate business data
    console.log(`💼 Migrating ${oldData.length} business records...`);
    
    for (const record of oldData) {
      await client.query(`
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
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45)
        ON CONFLICT (id) DO UPDATE SET
          business_id = EXCLUDED.business_id,
          user_id = EXCLUDED.user_id,
          snapshot_year = EXCLUDED.snapshot_year,
          submitted_date = EXCLUDED.submitted_date,
          year_started = EXCLUDED.year_started,
          problem_solved = EXCLUDED.problem_solved,
          team_size_band = EXCLUDED.team_size_band,
          business_model = EXCLUDED.business_model,
          family_involvement = EXCLUDED.family_involvement,
          customer_region = EXCLUDED.customer_region,
          sales_channels = EXCLUDED.sales_channels,
          import_export_status = EXCLUDED.import_export_status,
          import_countries = EXCLUDED.import_countries,
          export_countries = EXCLUDED.export_countries,
          business_stage = EXCLUDED.business_stage,
          top_challenges = EXCLUDED.top_challenges,
          hiring_intentions = EXCLUDED.hiring_intentions,
          business_operating_status = EXCLUDED.business_operating_status,
          business_age = EXCLUDED.business_age,
          business_registered = EXCLUDED.business_registered,
          employs_anyone = EXCLUDED.employs_anyone,
          employs_family_community = EXCLUDED.employs_family_community,
          team_size = EXCLUDED.team_size,
          revenue_band = EXCLUDED.revenue_band,
          current_funding_source = EXCLUDED.current_funding_source,
          funding_amount_needed = EXCLUDED.funding_amount_needed,
          funding_purpose = EXCLUDED.funding_purpose,
          investment_stage = EXCLUDED.investment_stage,
          revenue_streams = EXCLUDED.revenue_streams,
          financial_challenges = EXCLUDED.financial_challenges,
          investment_exploration = EXCLUDED.investment_exploration,
          community_impact_areas = EXCLUDED.community_impact_areas,
          support_needed_next = EXCLUDED.support_needed_next,
          current_support_sources = EXCLUDED.current_support_sources,
          expansion_plans = EXCLUDED.expansion_plans,
          industry = EXCLUDED.industry,
          created_date = EXCLUDED.created_date,
          updated_at = EXCLUDED.updated_at
        `, [
          record.id, record.business_id, record.user_id, record.snapshot_year, record.submitted_date,
          record.year_started, record.problem_solved, record.team_size_band, record.business_model,
          record.family_involvement, record.customer_region, record.sales_channels,
          record.import_export_status, record.import_countries, record.export_countries,
          record.business_stage, JSON.stringify(record.top_challenges),
          record.hiring_intentions, record.business_operating_status, record.business_age,
          record.business_registered, record.employs_anyone, record.employs_family_community,
          record.team_size, record.revenue_band, record.current_funding_source,
          record.funding_amount_needed, record.funding_purpose, record.investment_stage,
          JSON.stringify(record.revenue_streams), record.financial_challenges,
          record.investment_exploration, JSON.stringify(record.community_impact_areas),
          JSON.stringify(record.support_needed_next), JSON.stringify(record.current_support_sources),
          record.expansion_plans, record.industry, record.created_date, record.updated_at
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
    console.log('\n✅ Insights page should now work with real data! 🚀');
    
    await client.end();
    
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    await client.end();
  }
}

fixSchemaAndMigrate();
