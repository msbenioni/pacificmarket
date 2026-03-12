// Check actual schema and fix the migration
const { Client } = require('pg');

const connectionString = 'postgresql://postgres:MontBlanc3001@db.mnmisjprswpuvcojnbip.supabase.co:5432/postgres';

const client = new Client({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});

async function checkSchemaAndMigrate() {
  try {
    await client.connect();
    console.log('🔗 Connected to database');
    
    // Check actual business_insights schema
    console.log('🔍 Checking business_insights schema...');
    const schemaResult = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'business_insights' 
      AND table_schema = 'public'
      ORDER BY ordinal_position
    `);
    
    console.log('Business insights columns:');
    schemaResult.rows.forEach(row => {
      console.log(`  ${row.column_name}: ${row.data_type}`);
    });
    
    // Check old table schema
    console.log('\n🔍 Checking business_insights_snapshots schema...');
    const oldSchemaResult = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'business_insights_snapshots' 
      AND table_schema = 'public'
      ORDER BY ordinal_position
    `);
    
    console.log('Old table columns:');
    oldSchemaResult.rows.forEach(row => {
      console.log(`  ${row.column_name}: ${row.data_type}`);
    });
    
    // Get sample data to work with
    const sampleData = await client.query('SELECT * FROM business_insights_snapshots LIMIT 1');
    
    if (sampleData.rows.length === 0) {
      console.log('❌ No data in old table');
      await client.end();
      return;
    }
    
    const sample = sampleData.rows[0];
    console.log('\n📝 Sample record structure:');
    console.log(Object.keys(sample).map(key => `${key}: ${sample[key]}`).join('\n'));
    
    // Build migration SQL based on actual schema
    console.log('\n🔧 Building migration based on actual schema...');
    
    // Migrate founder data first
    const founderRecords = sampleData.rows.filter(record => 
      record.user_id && (record.gender || record.age_range || record.years_entrepreneurial)
    );
    
    if (founderRecords.length > 0) {
      console.log(`👤 Migrating ${founderRecords.length} founder records...`);
      
      // Build founder columns dynamically
      const founderColumns = [
        'id', 'user_id', 'snapshot_year', 'submitted_date', 'gender', 'age_range',
        'years_entrepreneurial', 'entrepreneurial_background', 'businesses_founded',
        'family_entrepreneurial_background', 'founder_role', 'founder_story',
        'founder_motivation_array', 'pacific_identity', 'based_in_country',
        'based_in_city', 'serves_pacific_communities', 'culture_influences_business',
        'culture_influence_details', 'family_community_responsibilities_affect_business',
        'responsibilities_impact_details', 'mentorship_access', 'mentorship_offering',
        'barriers_to_mentorship', 'angel_investor_interest', 'investor_capacity',
        'collaboration_interest', 'open_to_future_contact', 'goals_details',
        'goals_next_12_months_array', 'created_date', 'updated_at'
      ];
      
      for (const record of founderRecords) {
        const values = founderColumns.map(col => record[col]);
        const placeholders = founderColumns.map((_, index) => `$${index + 1}`);
        
        const query = `
          INSERT INTO founder_insights (${founderColumns.join(', ')})
          VALUES (${placeholders.join(', ')})
          ON CONFLICT (id) DO UPDATE SET
            ${founderColumns.slice(1).map((col, index) => `${col} = EXCLUDED.${col}`).join(', ')}
        `;
        
        await client.query(query, values);
      }
      
      console.log(`✅ Migrated ${founderRecords.length} founder records`);
    }
    
    // Migrate business data with correct column mapping
    console.log(`💼 Migrating ${sampleData.rows.length} business records...`);
    
    // Build business columns dynamically from schema
    const businessColumns = [
      'id', 'business_id', 'user_id', 'snapshot_year', 'submitted_date', 'year_started',
      'problem_solved', 'team_size_band', 'business_model', 'family_involvement',
      'customer_region', 'sales_channels', 'import_export_status', 'import_countries',
      'export_countries', 'business_stage', 'top_challenges', 'hiring_intentions',
      'business_operating_status', 'business_age', 'business_registered', 'employs_anyone',
      'employs_family_community', 'team_size', 'revenue_band', 'current_funding_source',
      'funding_amount_needed', 'funding_purpose', 'investment_stage', 'revenue_streams',
      'financial_challenges', 'investment_exploration', 'community_impact_areas',
      'support_needed_next', 'current_support_sources', 'expansion_plans',
      'industry', 'created_date', 'updated_at'
    ];
    
    for (const record of sampleData.rows) {
      const values = businessColumns.map(col => {
        // Handle JSON/array fields
        if (col === 'top_challenges' || col === 'import_countries' || col === 'export_countries' || 
            col === 'revenue_streams' || col === 'community_impact_areas' || 
            col === 'support_needed_next' || col === 'current_support_sources') {
          return JSON.stringify(record[col]);
        }
        return record[col];
      });
      
      const placeholders = businessColumns.map((_, index) => `$${index + 1}`);
      
      const query = `
        INSERT INTO business_insights (${businessColumns.join(', ')})
        VALUES (${placeholders.join(', ')})
        ON CONFLICT (id) DO UPDATE SET
          ${businessColumns.slice(1).map((col, index) => {
            if (col === 'top_challenges' || col === 'import_countries' || col === 'export_countries' || 
                col === 'revenue_streams' || col === 'community_impact_areas' || 
                col === 'support_needed_next' || col === 'current_support_sources') {
              return `${col} = EXCLUDED.${col}`;
            }
            return `${col} = EXCLUDED.${col}`;
          }).join(', ')}
      `;
      
      await client.query(query, values);
    }
    
    console.log(`✅ Migrated ${sampleData.rows.length} business records`);
    
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

checkSchemaAndMigrate();
