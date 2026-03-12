// Node.js script to migrate data from business_insights_snapshots to separated tables
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mnmisjprswpuvcojnbip.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubWlzanByc3dwdXZjb2puYmlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2ODkwMTcsImV4cCI6MjA4NzI2NTAxN30.vl7Em91jGQP8mse-CJkIxTtuxWswoDO6sdSFLhhEc9A';

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateInsightsData() {
  try {
    console.log('🔄 Starting migration from business_insights_snapshots...');
    
    // First, check what's in the old table
    const { data: oldData, error: oldError } = await supabase
      .from('business_insights_snapshots')
      .select('*');
    
    if (oldError) {
      console.error('❌ Error reading old table:', oldError);
      return;
    }
    
    console.log(`📊 Found ${oldData?.length || 0} records in business_insights_snapshots`);
    
    if (!oldData || oldData.length === 0) {
      console.log('❌ No data to migrate');
      return;
    }
    
    // Migrate founder data
    console.log('👤 Migrating founder insights...');
    const founderRecords = oldData.filter(record => 
      record.user_id && (record.gender || record.age_range || record.years_entrepreneurial)
    );
    
    if (founderRecords.length > 0) {
      const { error: founderError } = await supabase
        .from('founder_insights')
        .upsert(founderRecords.map(record => ({
          id: record.id,
          user_id: record.user_id,
          snapshot_year: record.snapshot_year,
          submitted_date: record.submitted_date,
          gender: record.gender,
          age_range: record.age_range,
          years_entrepreneurial: record.years_entrepreneurial,
          entrepreneurial_background: record.entrepreneurial_background,
          businesses_founded: record.businesses_founded,
          family_entrepreneurial_background: record.family_entrepreneurial_background,
          founder_role: record.founder_role,
          founder_story: record.founder_story,
          founder_motivation_array: record.founder_motivation_array,
          pacific_identity: record.pacific_identity,
          based_in_country: record.based_in_country,
          based_in_city: record.based_in_city,
          serves_pacific_communities: record.serves_pacific_communities,
          culture_influences_business: record.culture_influences_business,
          culture_influence_details: record.culture_influence_details,
          family_community_responsibilities_affect_business: record.family_community_responsibilities_affect_business,
          responsibilities_impact_details: record.responsibilities_impact_details,
          mentorship_access: record.mentorship_access,
          mentorship_offering: record.mentorship_offering,
          barriers_to_mentorship: record.barriers_to_mentorship,
          angel_investor_interest: record.angel_investor_interest,
          investor_capacity: record.investor_capacity,
          collaboration_interest: record.collaboration_interest,
          open_to_future_contact: record.open_to_future_contact,
          goals_details: record.goals_details,
          goals_next_12_months_array: record.goals_next_12_months_array,
          created_date: record.created_date,
          updated_at: record.updated_at
        })));
      
      if (founderError) {
        console.error('❌ Error migrating founder data:', founderError);
      } else {
        console.log(`✅ Migrated ${founderRecords.length} founder records`);
      }
    }
    
    // Migrate business data
    console.log('💼 Migrating business insights...');
    const businessRecords = oldData.map(record => ({
      id: record.id,
      business_id: record.business_id,
      user_id: record.user_id,
      snapshot_year: record.snapshot_year,
      submitted_date: record.submitted_date,
      year_started: record.year_started,
      problem_solved: record.problem_solved,
      team_size_band: record.team_size_band,
      business_model: record.business_model,
      family_involvement: record.family_involvement,
      customer_region: record.customer_region,
      sales_channels: record.sales_channels,
      import_export_status: record.import_export_status,
      import_countries: record.import_countries,
      export_countries: record.export_countries,
      business_stage: record.business_stage,
      top_challenges: record.top_challenges,
      hiring_intentions: record.hiring_intentions,
      business_operating_status: record.business_operating_status,
      business_age: record.business_age,
      business_registered: record.business_registered,
      employs_anyone: record.employs_anyone,
      employs_family_community: record.employs_family_community,
      team_size: record.team_size,
      revenue_band: record.revenue_band,
      current_funding_source: record.current_funding_source,
      funding_amount_needed: record.funding_amount_needed,
      funding_purpose: record.funding_purpose,
      investment_stage: record.investment_stage,
      revenue_streams: record.revenue_streams,
      financial_challenges: record.financial_challenges,
      investment_exploration: record.investment_exploration,
      community_impact_areas: record.community_impact_areas,
      support_needed_next: record.support_needed_next,
      current_support_sources: record.current_support_sources,
      expansion_plans: record.expansion_plans,
      industry: record.industry,
      created_date: record.created_date,
      updated_at: record.updated_at
    }));
    
    const { error: businessError } = await supabase
      .from('business_insights')
      .upsert(businessRecords);
    
    if (businessError) {
      console.error('❌ Error migrating business data:', businessError);
    } else {
      console.log(`✅ Migrated ${businessRecords.length} business records`);
    }
    
    // Verify migration
    console.log('\n🔍 Verifying migration...');
    
    const { data: founderCount } = await supabase
      .from('founder_insights')
      .select('id', { count: 'exact' });
    
    const { data: businessCount } = await supabase
      .from('business_insights')
      .select('id', { count: 'exact' });
    
    console.log(`📊 Migration Results:`);
    console.log(`   Founder insights: ${founderCount?.length || 0} records`);
    console.log(`   Business insights: ${businessCount?.length || 0} records`);
    console.log('\n✅ Migration complete! 🎉');
    
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
  }
}

migrateInsightsData();
