const { Pool } = require('pg');
const fs = require('fs');

// Connection string from .env.local
const connectionString = 'postgresql://postgres:MontBlanc3001@db.mnmisjprswpuvcojnbip.supabase.co:5432/postgres';

const pool = new Pool({
  connectionString: connectionString,
  ssl: { 
    rejectUnauthorized: false 
  }
});

async function getDatabaseDump() {
  const client = await pool.connect();
  
  try {
    console.log('=== CONNECTED TO SUPABASE DATABASE ===\n');
    
    // Get all tables
    const tablesResult = await client.query(`
      SELECT table_name, table_type 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('TABLES IN PUBLIC SCHEMA:');
    console.table(tablesResult.rows);
    
    // Get table structures
    console.log('\n=== TABLE STRUCTURES ===');
    for (const table of tablesResult.rows) {
      const columnsResult = await client.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = $1
        ORDER BY ordinal_position
      `, [table.table_name]);
      
      console.log(`\n--- ${table.table_name.toUpperCase()} ---`);
      console.table(columnsResult.rows);
    }
    
    // Get row counts
    console.log('\n=== ROW COUNTS ===');
    for (const table of tablesResult.rows) {
      try {
        const countResult = await client.query(`SELECT COUNT(*) as count FROM ${table.table_name}`);
        console.log(`${table.table_name}: ${countResult.rows[0].count} rows`);
      } catch (err) {
        console.log(`${table.table_name}: Error getting count - ${err.message}`);
      }
    }
    
    // Sample data from key tables
    console.log('\n=== SAMPLE DATA ===');
    
    try {
      const businessesSample = await client.query('SELECT * FROM businesses LIMIT 3');
      console.log('\n--- BUSINESSES (3 records) ---');
      console.table(businessesSample.rows);
    } catch (err) {
      console.log('Businesses table error:', err.message);
    }
    
    try {
      const founderInsightsSample = await client.query('SELECT * FROM founder_insights LIMIT 3');
      console.log('\n--- FOUNDER_INSIGHTS (3 records) ---');
      console.table(founderInsightsSample.rows);
    } catch (err) {
      console.log('Founder insights table error:', err.message);
    }
    
    try {
      const businessInsightsSample = await client.query('SELECT * FROM business_insights LIMIT 3');
      console.log('\n--- BUSINESS_INSIGHTS (3 records) ---');
      console.table(businessInsightsSample.rows);
    } catch (err) {
      console.log('Business insights table error:', err.message);
    }
    
  } finally {
    client.release();
    await pool.end();
  }
}

getDatabaseDump().catch(console.error);
