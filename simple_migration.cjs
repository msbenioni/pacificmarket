// Simple migration with exact column matching
const { Client } = require('pg');

const connectionString = 'postgresql://postgres:MontBlanc3001@db.mnmisjprswpuvcojnbip.supabase.co:5432/postgres';

const client = new Client({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});

async function simpleMigration() {
  try {
    await client.connect();
    console.log('🔗 Connected to database');
    
    // Get business_insights columns
    const businessSchema = await client.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'business_insights' 
      AND table_schema = 'public'
      ORDER BY ordinal_position
    `);
    
    const businessColumns = businessSchema.rows.map(row => row.column_name);
    console.log(`Business insights has ${businessColumns.length} columns`);
    
    // Get old table data
    const oldData = await client.query('SELECT * FROM business_insights_snapshots');
    console.log(`Found ${oldData.rows.length} records to migrate`);
    
    if (oldData.rows.length === 0) {
      console.log('❌ No data to migrate');
      await client.end();
      return;
    }
    
    // Migrate only matching columns
    for (const record of oldData.rows) {
      const values = businessColumns.map(col => record[col]);
      const placeholders = businessColumns.map((_, index) => `$${index + 1}`);
      
      const query = `
        INSERT INTO business_insights (${businessColumns.join(', ')})
        VALUES (${placeholders.join(', ')})
        ON CONFLICT (id) DO NOTHING
      `;
      
      try {
        await client.query(query, values);
      } catch (err) {
        console.log(`⚠️ Error with record ${record.id}: ${err.message}`);
        // Continue with next record
      }
    }
    
    console.log(`✅ Migrated business data`);
    
    // Migrate founder data
    const founderSchema = await client.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'founder_insights' 
      AND table_schema = 'public'
      ORDER BY ordinal_position
    `);
    
    const founderColumns = founderSchema.rows.map(row => row.column_name);
    
    const founderRecords = oldData.rows.filter(record => 
      record.user_id && (record.gender || record.age_range || record.years_entrepreneurial)
    );
    
    if (founderRecords.length > 0) {
      console.log(`👤 Migrating ${founderRecords.length} founder records...`);
      
      for (const record of founderRecords) {
        const values = founderColumns.map(col => record[col]);
        const placeholders = founderColumns.map((_, index) => `$${index + 1}`);
        
        const query = `
          INSERT INTO founder_insights (${founderColumns.join(', ')})
          VALUES (${placeholders.join(', ')})
          ON CONFLICT (id) DO NOTHING
        `;
        
        try {
          await client.query(query, values);
        } catch (err) {
          console.log(`⚠️ Error with founder record ${record.id}: ${err.message}`);
        }
      }
      
      console.log(`✅ Migrated founder data`);
    }
    
    // Verify final state
    const founderCount = await client.query('SELECT COUNT(*) FROM founder_insights');
    const businessCount = await client.query('SELECT COUNT(*) FROM business_insights');
    
    console.log('\n🎉 Migration Complete!');
    console.log(`📊 Final Results:`);
    console.log(`   Founder insights: ${founderCount.rows[0].count} records`);
    console.log(`   Business insights: ${businessCount.rows[0].count} records`);
    
    // Show sample founder data
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

simpleMigration();
