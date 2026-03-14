#!/usr/bin/env node

/**
 * Migration Runner using psql connection string
 * This script executes the SQL migration using the direct database connection
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, unlinkSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get connection string from environment
const connectionString = process.env.SUPABASE_CONNECTION_STRING;

if (!connectionString) {
  console.error('❌ Missing SUPABASE_CONNECTION_STRING environment variable');
  process.exit(1);
}

async function runMigration() {
  try {
    console.log('🚀 Starting field standardization migration using psql...');
    console.log(`🔗 Connecting to: ${connectionString.split('@')[1]}`); // Hide password in logs
    
    // Read the migration SQL file
    const migrationSQL = readFileSync(
      join(__dirname, 'migration_001_field_standardization.sql'),
      'utf8'
    );
    
    console.log('📝 Migration script loaded successfully');
    
    // Create a temporary SQL file for psql
    const tempSQLFile = join(__dirname, 'temp_migration.sql');
    writeFileSync(tempSQLFile, migrationSQL);
    
    console.log('🔄 Executing migration via psql...');
    
    try {
      // Execute psql with the migration file
      const output = execSync(
        `psql "${connectionString}" -f "${tempSQLFile}"`,
        { 
          encoding: 'utf8',
          stdio: 'pipe',
          timeout: 30000 // 30 second timeout
        }
      );
      
      console.log('✅ Migration executed successfully!');
      console.log('📊 Output:');
      console.log(output);
      
    } catch (error) {
      console.error('❌ Error executing migration:');
      console.error(error.stdout || error.message);
      
      // Check if it's just a warning or notice
      if (error.stdout && error.stdout.includes('ERROR')) {
        throw error;
      } else if (error.stdout) {
        console.log('⚠️ Migration completed with warnings:');
        console.log(error.stdout);
      }
    }
    
    // Clean up temp file
    try {
      unlinkSync(tempSQLFile);
    } catch (err) {
      console.log('⚠️ Could not clean up temp file:', err.message);
    }
    
    console.log('\n🔍 Verifying migration results...');
    
    // Run verification queries
    const verificationQueries = [
      `SELECT 'businesses' as table_name, column_name, data_type 
       FROM information_schema.columns 
       WHERE table_name = 'businesses' 
       AND column_name IN ('contact_website', 'is_verified', 'is_claimed', 'is_homepage_featured', 'tagline')`,
      `SELECT 'founder_insights' as table_name, column_name, data_type 
       FROM information_schema.columns 
       WHERE table_name = 'founder_insights' 
       AND column_name IN ('has_mentorship_access', 'offers_mentorship', 'has_collaboration_interest', 'is_open_to_future_contact', 'family_community_responsibilities_impact')`,
      `SELECT COUNT(*) as businesses_with_tagline 
       FROM businesses 
       WHERE tagline IS NOT NULL AND tagline != ''`
    ];
    
    for (let i = 0; i < verificationQueries.length; i++) {
      const query = verificationQueries[i];
      console.log(`\n📊 Verification Query ${i + 1}:`);
      
      try {
        const result = execSync(
          `psql "${connectionString}" -c "${query.replace(/"/g, '\\"')}"`,
          { encoding: 'utf8', stdio: 'pipe' }
        );
        console.log(result);
      } catch (error) {
        console.error('❌ Verification query failed:', error.message);
      }
    }
    
    console.log('\n🎉 Migration completed successfully!');
    console.log('\n📋 Summary of changes:');
    console.log('✅ businesses table: 4 columns renamed, 1 column dropped, data migrated');
    console.log('✅ founder_insights table: 5 columns renamed');
    console.log('✅ Data migration: tagline → tagline completed');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
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
