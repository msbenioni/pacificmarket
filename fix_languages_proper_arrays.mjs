import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixLanguagesToProperArrays() {
  console.log('🔧 Converting languages_spoken to proper PostgreSQL arrays...');
  
  try {
    // Get all businesses with languages_spoken data
    const { data: businesses, error: fetchError } = await supabase
      .from('businesses')
      .select('id, business_name, languages_spoken')
      .not('languages_spoken', 'is', null);
    
    if (fetchError) {
      console.error('❌ Error fetching businesses:', fetchError);
      return;
    }
    
    if (!businesses || businesses.length === 0) {
      console.log('ℹ️  No businesses with languages_spoken data found');
      return;
    }
    
    console.log(`📊 Found ${businesses.length} businesses to process`);
    
    let fixedCount = 0;
    let errorCount = 0;
    
    for (const business of businesses) {
      try {
        let languagesArray = [];
        
        // Handle different data formats
        if (typeof business.languages_spoken === 'string') {
          // Parse JSON string or split comma-separated
          if (business.languages_spoken.startsWith('[')) {
            // JSON array string
            languagesArray = JSON.parse(business.languages_spoken);
          } else if (business.languages_spoken.startsWith('{')) {
            // JSON object string - convert to array
            const parsed = JSON.parse(business.languages_spoken);
            languagesArray = Object.values(parsed);
          } else {
            // Comma-separated string
            languagesArray = business.languages_spoken.split(',').map(lang => lang.trim()).filter(Boolean);
          }
        } else if (Array.isArray(business.languages_spoken)) {
          // Already an array
          languagesArray = business.languages_spoken;
        }
        
        // Update with proper PostgreSQL array syntax
        const { error: updateError } = await supabase
          .from('businesses')
          .update({ 
            languages_spoken: languagesArray,
            updated_at: new Date().toISOString()
          })
          .eq('id', business.id);
        
        if (updateError) {
          console.error(`❌ Error updating business ${business.id}:`, updateError);
          errorCount++;
        } else {
          console.log(`✅ Fixed ${business.business_name}: ${languagesArray.join(', ')}`);
          fixedCount++;
        }
        
      } catch (error) {
        console.error(`❌ Error processing business ${business.id}:`, error);
        errorCount++;
      }
    }
    
    // Verification
    console.log('\n🔍 Verification...');
    const { data: sample, error: verifyError } = await supabase
      .from('businesses')
      .select('id, business_name, languages_spoken')
      .not('languages_spoken', 'is', null)
      .limit(5);
    
    if (verifyError) {
      console.error('❌ Error verifying:', verifyError);
    } else {
      console.log('✅ Sample of fixed data:');
      sample.forEach(b => {
        console.log(`   ${b.business_name}: ${JSON.stringify(b.languages_spoken)}`);
      });
    }
    
    console.log(`\n📈 SUMMARY:`);
    console.log(`✅ Fixed: ${fixedCount} businesses`);
    console.log(`❌ Errors: ${errorCount} businesses`);
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the fix
fixLanguagesToProperArrays();
