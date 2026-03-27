#!/usr/bin/env node

/**
 * Run the email marketing tables migration
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

async function runMigration() {
  console.log('🚀 Running Email Marketing Migration');
  console.log('===================================\n');

  try {
    // Read the migration file
    const migrationPath = path.join(__dirname, '../supabase/migrations/20260327_create_email_marketing_tables.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('📋 Migration file loaded');
    console.log('📝 SQL length:', migrationSQL.length, 'characters');

    // For now, show the migration content and instructions
    console.log('\n📄 Migration SQL Preview:');
    console.log('='.repeat(50));
    
    // Show first few lines of the migration
    const lines = migrationSQL.split('\n');
    lines.slice(0, 20).forEach((line, i) => {
      console.log(`${(i + 1).toString().padStart(3)}: ${line}`);
    });
    
    if (lines.length > 20) {
      console.log(`... and ${lines.length - 20} more lines`);
    }

    console.log('\n⚠️  MANUAL MIGRATION REQUIRED');
    console.log('This migration must be run manually in your Supabase dashboard:');
    console.log('');
    console.log('1. Go to Supabase Dashboard > Database > SQL Editor');
    console.log('2. Copy the entire contents of:');
    console.log(`   ${migrationPath}`);
    console.log('3. Run the SQL to create all email marketing tables');
    console.log('4. Verify tables were created successfully');
    console.log('');
    console.log('After running the migration, you can:');
    console.log('- Run: node scripts/sync-business-subscribers.cjs');
    console.log('- Run: node scripts/sync-business-subscribers.cjs --import (to actually import)');

  } catch (error) {
    console.error('❌ Migration preparation failed:', error);
  }
}

runMigration().catch(console.error);
