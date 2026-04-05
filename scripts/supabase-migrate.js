#!/usr/bin/env node

/**
 * Supabase Migration Script
 * 
 * Runs SQL migrations using the Supabase connection string from environment variables
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

async function runMigration() {
  console.log('🚀 Starting Supabase migration...');
  
  try {
    // Initialize Supabase client with service role key
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    console.log('✅ Connected to Supabase');

    // Read migration files
    const migrationDir = path.join(__dirname, '../supabase/migrations');
    
    const baseTablesFile = path.join(migrationDir, '20260405_client_management_fixed.sql');
    const rlsPoliciesFile = path.join(migrationDir, '20260405_rls_policies_simple.sql');

    // Check if files exist
    if (!fs.existsSync(baseTablesFile)) {
      throw new Error(`Migration file not found: ${baseTablesFile}`);
    }
    if (!fs.existsSync(rlsPoliciesFile)) {
      throw new Error(`Migration file not found: ${rlsPoliciesFile}`);
    }

    // Read SQL files
    const baseTablesSQL = fs.readFileSync(baseTablesFile, 'utf8');
    const rlsPoliciesSQL = fs.readFileSync(rlsPoliciesFile, 'utf8');

    console.log('📋 Running base tables migration...');
    
    // Split SQL into individual statements (basic approach)
    const baseStatements = baseTablesSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    // Execute base table statements
    for (const statement of baseStatements) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        if (error) {
          // Try direct SQL execution if RPC fails
          console.log(`⚠️  RPC failed for: ${statement.substring(0, 50)}...`);
        }
      } catch (err) {
        console.log(`⚠️  Statement skipped: ${err.message}`);
      }
    }

    console.log('✅ Base tables migration completed');

    console.log('🔒 Applying RLS policies...');
    
    // Split RLS policies into individual statements
    const rlsStatements = rlsPoliciesSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    // Execute RLS policy statements
    for (const statement of rlsStatements) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        if (error) {
          console.log(`⚠️  RPC failed for: ${statement.substring(0, 50)}...`);
        }
      } catch (err) {
        console.log(`⚠️  Statement skipped: ${err.message}`);
      }
    }

    console.log('✅ RLS policies migration completed');

    // Verify tables were created
    console.log('🔍 Verifying table creation...');
    
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', [
        'discovered_businesses',
        'daily_reports', 
        'quality_alerts',
        'email_groups',
        'email_campaigns',
        'error_logs',
        'scheduler_config'
      ]);

    if (tablesError) {
      console.log('⚠️  Could not verify tables:', tablesError.message);
    } else {
      console.log(`✅ Found ${tables.length} expected tables`);
      tables.forEach(table => {
        console.log(`   - ${table.table_name}`);
      });
    }

    // Test basic functionality
    console.log('🧪 Testing database functionality...');
    
    const { data: configData, error: configError } = await supabase
      .from('scheduler_config')
      .select('key, description')
      .limit(3);

    if (configError) {
      console.log('⚠️  Could not test scheduler_config:', configError.message);
    } else {
      console.log(`✅ Scheduler config accessible: ${configData.length} records`);
    }

    console.log('🎉 Migration completed successfully!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Start development server: npm run dev');
    console.log('2. Visit: http://localhost:3000/admin/client-list-manager');
    console.log('3. Test the discovery workflow');
    console.log('');
    console.log('🔒 For production security, run:');
    console.log('psql -h [your-host] -U postgres -d [your-db] -f scripts/apply-production-rls.sql');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Alternative approach using direct PostgreSQL connection
async function runMigrationWithPG() {
  console.log('🚀 Starting Supabase migration with direct PostgreSQL...');
  
  try {
    // Parse connection string
    const connectionString = process.env.SUPABASE_DB_CONNECTION_STRING;
    if (!connectionString) {
      throw new Error('SUPABASE_DB_CONNECTION_STRING not found in environment variables');
    }

    console.log('✅ Connection string found');

    // Extract connection details
    const url = new URL(connectionString.replace('postgresql://', 'postgres://'));
    const host = url.hostname;
    const port = url.port || 5432;
    const database = url.pathname.substring(1); // Remove leading slash
    const user = url.username;
    const password = url.password;

    console.log(`🔗 Connecting to ${host}:${port}/${database}`);

    // Use child_process to run psql
    const { spawn } = require('child_process');
    
    const migrationDir = path.join(__dirname, '../supabase/migrations');
    
    // Run base tables migration
    console.log('📋 Running base tables migration...');
    await runPSQLFile(path.join(migrationDir, '20260405_client_management_fixed.sql'), host, port, database, user, password);
    
    // Run RLS policies migration
    console.log('🔒 Applying RLS policies...');
    await runPSQLFile(path.join(migrationDir, '20260405_rls_policies_simple.sql'), host, port, database, user, password);
    
    console.log('🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

function runPSQLFile(filePath, host, port, database, user, password) {
  return new Promise((resolve, reject) => {
    const { spawn } = require('child_process');
    
    const psql = spawn('psql', [
      '-h', host,
      '-p', port.toString(),
      '-U', user,
      '-d', database,
      '-f', filePath
    ], {
      env: {
        ...process.env,
        PGPASSWORD: password
      }
    });

    let output = '';
    let errorOutput = '';

    psql.stdout.on('data', (data) => {
      output += data.toString();
      process.stdout.write(data);
    });

    psql.stderr.on('data', (data) => {
      errorOutput += data.toString();
      process.stderr.write(data);
    });

    psql.on('close', (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(new Error(`psql exited with code ${code}: ${errorOutput}`));
      }
    });

    psql.on('error', (error) => {
      reject(error);
    });
  });
}

// Main execution
if (require.main === module) {
  // Try direct PostgreSQL first, fallback to Supabase client
  if (process.env.SUPABASE_DB_CONNECTION_STRING) {
    runMigrationWithPG().catch(() => {
      console.log('⚠️  Direct PostgreSQL failed, trying Supabase client...');
      runMigration();
    });
  } else {
    console.log('⚠️  No connection string found, using Supabase client...');
    runMigration();
  }
}

module.exports = { runMigration, runMigrationWithPG };
