const { createClient } = require('@supabase/supabase-js');

// Use your connection string
const supabaseUrl = 'https://mnmisjprswpuvcojnbip.supabase.co';
const supabaseKey = 'your-service-role-key'; // You'll need to get this from Supabase dashboard

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  try {
    // Read the SQL file
    const fs = require('fs');
    const sql = fs.readFileSync('add_general_founder_insights_fields.sql', 'utf8');
    
    // Execute the migration
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      console.error('Migration failed:', error);
    } else {
      console.log('Migration completed successfully!');
      console.log('Verification results:', data);
    }
  } catch (err) {
    console.error('Error running migration:', err);
  }
}

runMigration();
