// Script to update cultural_identity from "Samoa" to "Samoan" for all businesses

import { Pool } from 'pg';

const connection = {
  host: 'db.mnmisjprswpuvcojnbip.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'MontBlanc3001'
};

async function updateCulturalIdentity() {
  const pool = new Pool(connection);
  
  try {
    console.log('Connecting to database...');
    await pool.connect();
    
    console.log('Finding businesses with cultural_identity containing "Samoa"...');
    
    // First, find all businesses with "Samoa" in their cultural_identity
    const findResult = await pool.query(`
      SELECT id, business_name, business_handle, cultural_identity 
      FROM businesses 
      WHERE cultural_identity::text LIKE '%Samoa%'
      ORDER BY business_name
    `);
    
    console.log(`\nFound ${findResult.rows.length} businesses with "Samoa" in cultural_identity:`);
    
    if (findResult.rows.length === 0) {
      console.log('No businesses found with "Samoa" in cultural_identity');
      return;
    }
    
    // Display current state
    findResult.rows.forEach((business, index) => {
      console.log(`\n${index + 1}. ${business.business_name} (${business.business_handle})`);
      console.log(`   Current cultural_identity: ${business.cultural_identity}`);
    });
    
    console.log('\nUpdating cultural_identity from "Samoa" to "Samoan"...');
    
    let updatedCount = 0;
    
    for (const business of findResult.rows) {
      let newCulturalIdentity;
      
      // Parse the existing cultural_identity array
      if (business.cultural_identity) {
        try {
          let identities;
          
          if (typeof business.cultural_identity === 'string') {
            if (business.cultural_identity.startsWith('[')) {
              identities = JSON.parse(business.cultural_identity);
            } else {
              identities = [business.cultural_identity];
            }
          } else if (Array.isArray(business.cultural_identity)) {
            identities = business.cultural_identity;
          } else {
            console.log(`  Skipping ${business.business_name} - unexpected format`);
            continue;
          }
          
          // Replace "Samoa" with "Samoan" in the array
          identities = identities.map(identity => {
            if (identity === "Samoa") {
              return "Samoan";
            }
            return identity;
          });
          
          newCulturalIdentity = JSON.stringify(identities);
          
        } catch (error) {
          console.log(`  Error parsing ${business.business_name}: ${error.message}`);
          continue;
        }
      } else {
        console.log(`  Skipping ${business.business_name} - no cultural_identity`);
        continue;
      }
      
      // Update the business
      const updateResult = await pool.query(`
        UPDATE businesses 
        SET cultural_identity = $1
        WHERE id = $2
        RETURNING id, business_name, cultural_identity
      `, [newCulturalIdentity, business.id]);
      
      if (updateResult.rows.length > 0) {
        const updated = updateResult.rows[0];
        console.log(`  Updated: ${updated.business_name}`);
        console.log(`    Old: ${business.cultural_identity}`);
        console.log(`    New: ${updated.cultural_identity}`);
        updatedCount++;
      }
    }
    
    console.log(`\nSuccessfully updated ${updatedCount} businesses!`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

updateCulturalIdentity();
