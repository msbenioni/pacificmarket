import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function restoreCulturalAndLanguages() {
  console.log('Starting restoration of cultural_identity and languages_spoken...');
  
  try {
    // First, check if businesses_duplicate table exists and has data
    console.log('Checking businesses_duplicate table...');
    const { data: duplicateCheck, error: duplicateError } = await supabase
      .from('businesses_duplicate')
      .select('id, cultural_identity, languages_spoken')
      .limit(1);
    
    if (duplicateError) {
      console.error('Error accessing businesses_duplicate table:', duplicateError);
      return;
    }
    
    if (!duplicateCheck || duplicateCheck.length === 0) {
      console.log('No data found in businesses_duplicate table');
      return;
    }
    
    console.log(`Found data in businesses_duplicate table`);
    
    // Get all businesses with cultural_identity and languages_spoken from duplicate table
    const { data: duplicateData, error: fetchError } = await supabase
      .from('businesses_duplicate')
      .select('id, cultural_identity, languages_spoken');
    
    if (fetchError) {
      console.error('Error fetching data from businesses_duplicate:', fetchError);
      return;
    }
    
    console.log(`Found ${duplicateData.length} businesses to restore`);
    
    // Update each business in the main table
    let successCount = 0;
    let errorCount = 0;
    
    for (const business of duplicateData) {
      if (business.cultural_identity || business.languages_spoken) {
        const { error: updateError } = await supabase
          .from('businesses')
          .update({
            cultural_identity: business.cultural_identity,
            languages_spoken: business.languages_spoken,
            updated_at: new Date().toISOString()
          })
          .eq('id', business.id);
        
        if (updateError) {
          console.error(`Error updating business ${business.id}:`, updateError);
          errorCount++;
        } else {
          console.log(`✅ Restored cultural_identity and languages_spoken for business ${business.id}`);
          successCount++;
        }
      }
    }
    
    console.log(`\nRestoration complete:`);
    console.log(`✅ Successfully restored: ${successCount} businesses`);
    console.log(`❌ Errors: ${errorCount} businesses`);
    
    // Verify the restoration
    const { data: verification, error: verifyError } = await supabase
      .from('businesses')
      .select('id, cultural_identity, languages_spoken')
      .or('cultural_identity.not.is.null,languages_spoken.not.is.null');
    
    if (verifyError) {
      console.error('Error verifying restoration:', verifyError);
    } else {
      console.log(`\nVerification: Found ${verification.length} businesses with cultural_identity or languages_spoken`);
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the restoration
restoreCulturalAndLanguages();
