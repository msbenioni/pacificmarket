const { createClient } = require('@supabase/supabase-js');

// Replace with your actual connection details
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  console.log('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  try {
    console.log('🔍 Checking existing businesses table schema...\n');

    // Get current table structure
    const { data: tableStructure, error: structureError } = await supabase
      .rpc('get_table_structure', { table_name: 'businesses' });

    if (structureError) {
      console.log('⚠️ RPC not available, using direct SQL...');
      
      // Fallback to direct SQL using Supabase SQL functions
      const { data, error } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable, column_default, character_maximum_length')
        .eq('table_name', 'businesses')
        .eq('table_schema', 'public')
        .order('ordinal_position');

      if (error) {
        console.error('Error fetching table structure:', error);
        return;
      }

      console.log('📋 Current Table Structure:');
      console.table(data);

      // Check for potential conflicts
      const conflictKeywords = ['operating', 'age', 'team', 'size', 'register', 'employ', 'sales', 'channel', 'primary', 'stage', 'import', 'export', 'revenue'];
      
      for (const keyword of conflictKeywords) {
        const { data: conflicts } = await supabase
          .from('information_schema.columns')
          .select('column_name')
          .eq('table_name', 'businesses')
          .eq('table_schema', 'public')
          .like('column_name', `%${keyword}%`);

        if (conflicts && conflicts.length > 0) {
          console.log(`\n⚠️ Potential conflicts with keyword "${keyword}":`, conflicts.map(c => c.column_name));
        }
      }

      // Check if our proposed columns exist
      const proposedColumns = [
        'business_operating_status', 'business_age', 'team_size_band', 'business_registered',
        'business_stage', 'employs_anyone', 'employs_family_community', 'sales_channels',
        'primary_industry', 'import_export_status', 'revenue_band'
      ];

      const { data: existingColumns } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type')
        .eq('table_name', 'businesses')
        .eq('table_schema', 'public')
        .in('column_name', proposedColumns);

      if (existingColumns && existingColumns.length > 0) {
        console.log('\n⚠️ These proposed columns already exist:');
        console.table(existingColumns);
      } else {
        console.log('\n✅ None of the proposed columns exist yet - safe to proceed!');
      }
    }

  } catch (error) {
    console.error('Error checking schema:', error);
  }
}

// Alternative approach using direct SQL if needed
async function checkSchemaWithSQL() {
  try {
    console.log('🔍 Running schema check with direct SQL...\n');

    const sql = `
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'businesses' 
        AND table_schema = 'public'
      ORDER BY ordinal_position;
    `;

    // This would need to be run via Supabase SQL Editor or a direct connection
    console.log('Please run this SQL in Supabase SQL Editor:');
    console.log(sql);

  } catch (error) {
    console.error('Error:', error);
  }
}

checkSchema().then(() => {
  console.log('\n🎯 Schema check complete!');
  console.log('\n📋 Next steps:');
  console.log('1. If no conflicts found, run the safe migration');
  console.log('2. If conflicts exist, review and adjust column names');
  console.log('3. Always test in development first!');
});
