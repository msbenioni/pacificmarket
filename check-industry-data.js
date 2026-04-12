// Script to check industry data consistency in the database

import { Pool } from 'pg';

const connection = {
  host: 'db.mnmisjprswpuvcojnbip.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'MontBlanc3001'
};

async function checkIndustryData() {
  const pool = new Pool(connection);
  
  try {
    console.log('Connecting to database...');
    await pool.connect();
    
    console.log('\n=== INDUSTRY DATA ANALYSIS ===\n');
    
    // Get all unique industry values
    const industryResult = await pool.query(`
      SELECT industry, COUNT(*) as count
      FROM businesses 
      WHERE industry IS NOT NULL AND industry != ''
      GROUP BY industry
      ORDER BY count DESC
    `);
    
    console.log('All industry values in database:');
    industryResult.rows.forEach((row, index) => {
      console.log(`${index + 1}. "${row.industry}" - ${row.count} businesses`);
    });
    
    console.log('\n=== CONSTRUCTION & TRADE SPECIFIC ===\n');
    
    // Check specifically for construction-related industries
    const constructionResult = await pool.query(`
      SELECT id, business_name, business_handle, industry
      FROM businesses 
      WHERE industry IS NOT NULL 
      AND (industry ILIKE '%construction%' OR industry ILIKE '%trade%')
      ORDER BY business_name
    `);
    
    console.log(`Found ${constructionResult.rows.length} businesses with construction/trade in industry:`);
    constructionResult.rows.forEach((business, index) => {
      console.log(`${index + 1}. ${business.business_name} - "${business.industry}"`);
    });
    
    console.log('\n=== EXPECTED VS ACTUAL ===\n');
    
    // Expected industry values from constants
    const expectedIndustries = [
      'agriculture',
      'arts_crafts', 
      'beauty_personal_care',
      'books_publishing',
      'clothing_fashion',
      'coaching_business_personal',
      'construction_trade',  // This should be the correct value
      'digital_it_technology',
      'education_training',
      'fashion_accessories',
      'finance_insurance',
      'food_beverage',
      'health_wellness',
      'hospitality',
      'import_export',
      'manufacturing',
      'media_entertainment',
      'nonprofit',
      'professional_services',
      'retail',
      'technology',
      'transport_logistics',
      'travel_tourism',
      'other'
    ];
    
    console.log('Expected industry values:');
    expectedIndustries.forEach(industry => {
      const count = industryResult.rows.find(row => row.industry === industry)?.count || 0;
      console.log(`  ${industry}: ${count} businesses`);
    });
    
    console.log('\n=== INCONSISTENT VALUES ===\n');
    
    // Find inconsistent values
    const inconsistentValues = industryResult.rows.filter(row => 
      !expectedIndustries.includes(row.industry)
    );
    
    if (inconsistentValues.length > 0) {
      console.log('Inconsistent industry values that need fixing:');
      inconsistentValues.forEach(row => {
        console.log(`  "${row.industry}" - ${row.count} businesses`);
      });
    } else {
      console.log('All industry values are consistent! ');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

checkIndustryData();
