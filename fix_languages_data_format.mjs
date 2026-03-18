import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixLanguagesDataFormat() {
  console.log('🔧 Starting fix for languages_spoken data format...');
  
  try {
    // Step 1: Get all businesses with languages_spoken data
    console.log('\n📥 Step 1: Fetching businesses with languages_spoken data...');
    
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
    
    console.log(`📊 Found ${businesses.length} businesses with languages_spoken data`);
    
    // Step 2: Fix data format
    console.log('\n🔨 Step 2: Fixing data format...');
    
    let fixedCount = 0;
    let errorCount = 0;
    let skippedCount = 0;
    
    for (const business of businesses) {
      try {
        // Check if languages_spoken is already an array (stored as JSON array)
        if (typeof business.languages_spoken === 'object' && Array.isArray(business.languages_spoken)) {
          console.log(`✅ Business ${business.business_name} (${business.id}): Already correct format`);
          skippedCount++;
          continue;
        }
        
        // Check if it's a string that needs to be converted
        if (typeof business.languages_spoken === 'string') {
          // Parse the string into an array
          let languagesArray;
          
          // Handle different string formats
          if (business.languages_spoken.startsWith('[') || business.languages_spoken.startsWith('{')) {
            // JSON format
            try {
              const parsed = JSON.parse(business.languages_spoken);
              languagesArray = Array.isArray(parsed) ? parsed : Object.values(parsed);
            } catch (e) {
              // Fallback to comma-separated parsing
              languagesArray = business.languages_spoken.split(',').map(lang => lang.trim()).filter(Boolean);
            }
          } else {
            // Comma-separated format
            languagesArray = business.languages_spoken.split(',').map(lang => lang.trim()).filter(Boolean);
          }
          
          // Update the database with proper array format
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
            console.log(`✅ Fixed business ${business.business_name} (${business.id}): ${languagesArray.join(', ')}`);
            fixedCount++;
          }
        } else {
          console.log(`⚠️  Business ${business.business_name} (${business.id}): Unexpected data type: ${typeof business.languages_spoken}`);
          skippedCount++;
        }
        
      } catch (error) {
        console.error(`❌ Error processing business ${business.id}:`, error);
        errorCount++;
      }
    }
    
    // Step 3: Verification
    console.log('\n🔍 Step 3: Verification...');
    
    const { data: updatedBusinesses, error: verifyError } = await supabase
      .from('businesses')
      .select('id, business_name, languages_spoken')
      .not('languages_spoken', 'is', null)
      .limit(10);
    
    if (verifyError) {
      console.error('❌ Error verifying updates:', verifyError);
    } else {
      console.log('✅ Sample of updated businesses:');
      updatedBusinesses.forEach(b => {
        const dataType = Array.isArray(b.languages_spoken) ? 'Array' : typeof b.languages_spoken;
        const display = Array.isArray(b.languages_spoken) 
          ? b.languages_spoken.join(', ')
          : JSON.stringify(b.languages_spoken);
        console.log(`   ${b.business_name}: ${dataType} - ${display}`);
      });
    }
    
    // Summary
    console.log('\n📈 FIX SUMMARY:');
    console.log(`✅ Successfully fixed: ${fixedCount} businesses`);
    console.log(`❌ Errors: ${errorCount} businesses`);
    console.log(`⏭️  Skipped (already correct): ${skippedCount} businesses`);
    console.log(`📊 Total processed: ${businesses.length} businesses`);
    
    if (fixedCount > 0) {
      console.log('\n🎉 Data format fix completed successfully!');
      console.log('💡 All languages_spoken fields should now be stored as proper arrays');
    } else {
      console.log('\nℹ️  No fixes needed - data format was already correct');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the fix
fixLanguagesDataFormat();
