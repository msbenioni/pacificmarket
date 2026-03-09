#!/usr/bin/env node

/**
 * Script to run the queue unique constraint migration
 * Usage: node run_queue_constraint_migration.js
 */

const { createServiceClient } = require('./src/lib/server-auth');

async function runMigration() {
  console.log('🚀 Starting queue unique constraint migration...');
  
  const serviceClient = createServiceClient();
  
  try {
    // Read the migration SQL
    const fs = require('fs');
    const path = require('path');
    const migrationSQL = fs.readFileSync(
      path.join(__dirname, 'add_queue_unique_constraint.sql'), 
      'utf8'
    );
    
    // Execute the migration
    const { error } = await serviceClient.rpc('exec_sql', { sql: migrationSQL });
    
    if (error) {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    }
    
    console.log('✅ Queue unique constraint migration completed successfully!');
    console.log('📋 Added protections:');
    console.log('   - Partial unique index for active queue records');
    console.log('   - Status check constraint');
    console.log('   - Performance optimization index');
    console.log('   - Documentation comments');
    
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
}

runMigration();
