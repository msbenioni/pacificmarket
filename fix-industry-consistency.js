// Script to fix industry data consistency across all businesses

import { Pool } from 'pg';

const connection = {
  host: 'db.mnmisjprswpuvcojnbip.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'MontBlanc3001'
};

// Mapping from display format to correct snake_case values
const industryMapping = {
  "Arts & Crafts": "arts_crafts",
  "Professional Services": "professional_services", 
  "Food & Beverage": "food_beverage",
  "Health & Wellness": "health_wellness",
  "Construction & Trade": "construction_trade",
  "Beauty & Personal Care": "beauty_personal_care",
  "Media & Entertainment": "media_entertainment"
};

async function fixIndustryConsistency() {
  const pool = new Pool(connection);
  
  try {
    console.log('Connecting to database...');
    await pool.connect();
    
    console.log('\n=== FIXING INDUSTRY CONSISTENCY ===\n');
    
    let totalUpdated = 0;
    
    for (const [displayFormat, correctValue] of Object.entries(industryMapping)) {
      console.log(`\nFixing "${displayFormat}" -> "${correctValue}"`);
      
      // Find businesses with the incorrect format
      const findResult = await pool.query(`
        SELECT id, business_name, business_handle, industry
        FROM businesses 
        WHERE industry = $1
        ORDER BY business_name
      `, [displayFormat]);
      
      if (findResult.rows.length === 0) {
        console.log(`  No businesses found with "${displayFormat}"`);
        continue;
      }
      
      console.log(`  Found ${findResult.rows.length} businesses to update:`);
      
      // Update each business
      for (const business of findResult.rows) {
        console.log(`    - ${business.business_name} (${business.business_handle})`);
        
        const updateResult = await pool.query(`
          UPDATE businesses 
          SET industry = $1
          WHERE id = $2
          RETURNING id, business_name, industry
        `, [correctValue, business.id]);
        
        if (updateResult.rows.length > 0) {
          console.log(`      Updated to: "${updateResult.rows[0].industry}"`);
          totalUpdated++;
        }
      }
    }
    
    console.log(`\n=== SUMMARY ===`);
    console.log(`Total businesses updated: ${totalUpdated}`);
    
    // Verify the fixes
    console.log('\n=== VERIFICATION ===');
    
    // Check construction_trade specifically
    const constructionResult = await pool.query(`
      SELECT business_name, industry
      FROM businesses 
      WHERE industry = 'construction_trade'
      ORDER BY business_name
    `);
    
    console.log(`\nBusinesses with industry = "construction_trade" (${constructionResult.rows.length} total):`);
    constructionResult.rows.forEach((business, index) => {
      console.log(`${index + 1}. ${business.business_name}`);
    });
    
    // Check all industries are now consistent
    const finalResult = await pool.query(`
      SELECT industry, COUNT(*) as count
      FROM businesses 
      WHERE industry IS NOT NULL AND industry != ''
      GROUP BY industry
      ORDER BY count DESC
    `);
    
    console.log('\nFinal industry count:');
    finalResult.rows.forEach((row, index) => {
      console.log(`${index + 1}. "${row.industry}" - ${row.count} businesses`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

fixIndustryConsistency();
