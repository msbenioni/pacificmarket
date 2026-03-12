// Fix business_insights schema by adding missing user_id column
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mnmisjprswpuvcojnbip.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubWlzanByc3dwdXZjb2puYmlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2ODkwMTcsImV4cCI6MjA4NzI2NTAxN30.vl7Em91jGQP8mse-CJkIxTtuxWswoDO6sdSFLhhEc9A';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixBusinessInsightsSchema() {
  try {
    console.log('🔧 Fixing business_insights schema...');
    
    // Add the missing user_id column
    const { error } = await supabase.rpc('sql', {
      sql: `
        DO $$
        BEGIN
          -- Check if user_id column exists
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'business_insights' 
            AND column_name = 'user_id'
            AND table_schema = 'public'
          ) THEN
            ALTER TABLE business_insights 
            ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
            
            RAISE NOTICE 'Added missing user_id column to business_insights table';
          END IF;
        END $$;
      `
    });
    
    if (error) {
      console.error('❌ Error fixing schema:', error);
      return false;
    }
    
    console.log('✅ Schema fixed successfully!');
    return true;
    
  } catch (err) {
    console.error('❌ Schema fix failed:', err.message);
    return false;
  }
}

async function retryMigration() {
  console.log('🔄 Retrying migration after schema fix...');
  
  // Now run the migration again
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const { data: oldData, error: oldError } = await supabase
    .from('business_insights_snapshots')
    .select('*');
  
  if (oldError) {
    console.error('❌ Error reading old table:', oldError);
    return;
  }
  
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
  
  // Verify final state
  const { data: founderCount } = await supabase
    .from('founder_insights')
    .select('id', { count: 'exact' });
  
  const { data: businessCount } = await supabase
    .from('business_insights')
    .select('id', { count: 'exact' });
  
  console.log('\n🎉 Final Migration Results:');
  console.log(`   Founder insights: ${founderCount?.length || 0} records`);
  console.log(`   Business insights: ${businessCount?.length || 0} records`);
  console.log('\n✅ Migration complete! Insights page should now work! 🚀');
}

// Run the fix and retry
fixBusinessInsightsSchema().then(success => {
  if (success) {
    retryMigration();
  }
});
