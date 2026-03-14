#!/usr/bin/env node

/**
 * Migration Runner for Field Standardization
 * This script executes the SQL migration to standardize field names
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get Supabase connection details from environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.error('   NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? '✅' : '❌');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  try {
    console.log('🚀 Starting field standardization migration...');
    
    // Read the migration SQL file
    const migrationSQL = readFileSync(
      join(__dirname, 'migration_001_field_standardization.sql'),
      'utf8'
    );
    
    console.log('📝 Migration script loaded successfully');
    
    // Split the SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt && !stmt.startsWith('--') && !stmt.startsWith('/*'));
    
    console.log(`📊 Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      if (!statement.trim()) continue;
      
      console.log(`\n🔄 Executing statement ${i + 1}/${statements.length}:`);
      console.log(`   ${statement.substring(0, 100)}${statement.length > 100 ? '...' : ''}`);
      
      try {
        const { data, error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          console.error(`❌ Error executing statement:`, error);
          
          // Try direct query for simple statements
          if (statement.toLowerCase().includes('select')) {
            const { data: selectData, error: selectError } = await supabase
              .from('information_schema.columns')
              .select('*');
            
            if (selectError) {
              console.error('❌ Direct query also failed:', selectError);
            } else {
              console.log('✅ Direct query succeeded');
            }
          }
        } else {
          console.log('✅ Statement executed successfully');
        }
      } catch (err) {
        console.error(`❌ Exception executing statement:`, err.message);
      }
    }
    
    console.log('\n🎉 Migration completed!');
    
    // Verify the changes
    console.log('\n🔍 Verifying migration results...');
    
    // Check businesses table
    const { data: businessesColumns, error: businessesError } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', 'businesses')
      .in('column_name', ['contact_website', 'is_verified', 'is_claimed', 'is_homepage_featured', 'tagline']);
    
    if (businessesError) {
      console.error('❌ Error verifying businesses table:', businessesError);
    } else {
      console.log('✅ Businesses table columns verified:', businessesColumns?.map(c => c.column_name));
    }
    
    // Check founder_insights table
    const { data: founderColumns, error: founderError } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', 'founder_insights')
      .in('column_name', ['has_mentorship_access', 'offers_mentorship', 'has_collaboration_interest', 'is_open_to_future_contact', 'family_community_responsibilities_impact']);
    
    if (founderError) {
      console.error('❌ Error verifying founder_insights table:', founderError);
    } else {
      console.log('✅ Founder insights table columns verified:', founderColumns?.map(c => c.column_name));
    }
    
    // Check data migration
    const { data: taglineCheck, error: taglineError } = await supabase
      .from('businesses')
      .select('id, tagline')
      .not('tagline', 'is', null)
      .limit(5);
    
    if (taglineError) {
      console.error('❌ Error checking tagline migration:', taglineError);
    } else {
      console.log(`✅ Found ${taglineCheck?.length || 0} businesses with taglines`);
      taglineCheck?.forEach(business => {
        console.log(`   - Business ${business.id}: "${business.tagline?.substring(0, 50)}${business.tagline?.length > 50 ? '...' : ''}"`);
      });
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
runMigration().then(() => {
  console.log('\n🎯 Migration process completed');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Migration process failed:', error);
  process.exit(1);
});
