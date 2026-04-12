// Script to unclaim the 4 businesses by setting claimed_at and claimed_by to null

import { Pool } from 'pg';

const connection = {
  host: 'db.mnmisjprswpuvcojnbip.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'MontBlanc3001'
};

const businessesToUnclaim = [
  'usobeer',           // USO Beer
  'digitaldna',        // DigitalDNA  
  'readyhomespacific', // Ready Homes Pacific
  'jacksshippingcontainers' // Jack's Shipping Containers
];

async function unclaimBusinesses() {
  const pool = new Pool(connection);
  
  try {
    console.log('Connecting to database...');
    await pool.connect();
    
    console.log('Unclaiming businesses...');
    
    for (const businessHandle of businessesToUnclaim) {
      console.log(`\nUnclaiming: ${businessHandle}`);
      
      const result = await pool.query(`
        UPDATE businesses 
        SET claimed_at = NULL, 
            claimed_by = NULL,
            is_claimed = false
        WHERE business_handle = $1
        RETURNING id, business_name, business_handle, claimed_at, claimed_by, is_claimed
      `, [businessHandle]);
      
      if (result.rows.length > 0) {
        const business = result.rows[0];
        console.log(`  Updated: ${business.business_name}`);
        console.log(`  ID: ${business.id}`);
        console.log(`  claimed_at: ${business.claimed_at}`);
        console.log(`  claimed_by: ${business.claimed_by}`);
        console.log(`  is_claimed: ${business.is_claimed}`);
      } else {
        console.log(`  No business found with handle: ${businessHandle}`);
      }
    }
    
    console.log('\nSuccessfully unclaimed all businesses!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

unclaimBusinesses();
