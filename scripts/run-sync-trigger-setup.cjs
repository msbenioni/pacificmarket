#!/usr/bin/env node

/**
 * Instructions and helper for setting up the automatic business sync trigger
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

function showInstructions() {
  console.log('🔧 Automatic Business Sync Trigger Setup');
  console.log('==========================================\n');
  
  console.log('📋 What this does:');
  console.log('   • Automatically adds new businesses as email subscribers');
  console.log('   • Handles shared emails correctly (no duplicates)');
  console.log('   • Links subscribers to their business entities');
  console.log('   • Only syncs active businesses with valid emails\n');
  
  console.log('🚀 To set up the trigger:\n');
  
  console.log('1. Go to your Supabase Dashboard');
  console.log('2. Navigate to: SQL Editor → New query');
  console.log('3. Copy and paste the SQL from: supabase/migrations/20260327_create_business_sync_trigger.sql');
  console.log('4. Click "Run" to execute the migration\n');
  
  console.log('📁 Migration file created at:');
  console.log('   supabase/migrations/20260327_create_business_sync_trigger.sql\n');
  
  console.log('✅ After running the migration:');
  console.log('   • New businesses will auto-sync to subscribers');
  console.log('   • Updated businesses will sync if they become active');
  console.log('   • No more manual sync needed!\n');
  
  // Show the SQL content
  const sqlFile = path.join(process.cwd(), 'supabase/migrations/20260327_create_business_sync_trigger.sql');
  
  if (fs.existsSync(sqlFile)) {
    console.log('📄 SQL Migration Content:');
    console.log('========================\n');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');
    console.log(sqlContent);
  } else {
    console.log('❌ Migration file not found');
  }
}

showInstructions();
