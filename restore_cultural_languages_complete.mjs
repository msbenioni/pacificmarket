import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addColumnsAndRestoreData() {
  console.log('🚀 Starting complete restoration of cultural_identity and languages_spoken...');
  
  try {
    // Step 1: Add the columns back to the businesses table
    console.log('\n📋 Step 1: Adding cultural_identity and languages_spoken columns...');
    
    const { error: addCulturalError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE businesses ADD COLUMN IF NOT EXISTS cultural_identity TEXT;'
    });
    
    if (addCulturalError) {
      console.log('Note: Could not use RPC for cultural_identity column, trying direct approach...');
    }
    
    const { error: addLanguagesError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE businesses ADD COLUMN IF NOT EXISTS languages_spoken TEXT;'
    });
    
    if (addLanguagesError) {
      console.log('Note: Could not use RPC for languages_spoken column, trying direct approach...');
    }
    
    // Try using raw SQL execution through Supabase SQL editor approach
    console.log('⚠️  If columns were not added, please run this SQL manually in Supabase SQL Editor:');
    console.log('ALTER TABLE businesses ADD COLUMN IF NOT EXISTS cultural_identity TEXT;');
    console.log('ALTER TABLE businesses ADD COLUMN IF NOT EXISTS languages_spoken TEXT;');
    
    // Step 2: Wait a moment for schema to update
    console.log('\n⏳ Waiting for schema to update...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Step 3: Check if columns exist now
    console.log('\n🔍 Step 2: Checking if columns exist...');
    try {
      const { data: testData, error: testError } = await supabase
        .from('businesses')
        .select('id, cultural_identity, languages_spoken')
        .limit(1);
      
      if (testError) {
        console.error('❌ Columns still do not exist:', testError.message);
        console.log('\n📝 Please run these SQL commands in Supabase SQL Editor first:');
        console.log('ALTER TABLE businesses ADD COLUMN IF NOT EXISTS cultural_identity TEXT;');
        console.log('ALTER TABLE businesses ADD COLUMN IF NOT EXISTS languages_spoken TEXT;');
        console.log('\nThen run this script again.');
        return;
      }
      
      console.log('✅ Columns exist, proceeding with data restoration...');
    } catch (error) {
      console.error('❌ Error checking columns:', error);
      return;
    }
    
    // Step 4: Get data from businesses_duplicate table
    console.log('\n📥 Step 3: Fetching data from businesses_duplicate...');
    const { data: duplicateData, error: fetchError } = await supabase
      .from('businesses_duplicate')
      .select('id, cultural_identity, languages_spoken')
      .or('cultural_identity.not.is.null,languages_spoken.not.is.null');
    
    if (fetchError) {
      console.error('❌ Error fetching from businesses_duplicate:', fetchError);
      return;
    }
    
    if (!duplicateData || duplicateData.length === 0) {
      console.log('ℹ️  No data found in businesses_duplicate with cultural_identity or languages_spoken');
      return;
    }
    
    console.log(`📊 Found ${duplicateData.length} businesses with data to restore`);
    
    // Step 5: Restore data to businesses table
    console.log('\n♻️  Step 4: Restoring data to businesses table...');
    
    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;
    
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
          console.error(`❌ Error updating business ${business.id}:`, updateError.message);
          errorCount++;
        } else {
          console.log(`✅ Restored data for business ${business.id}`);
          successCount++;
        }
      } else {
        skippedCount++;
      }
    }
    
    // Step 6: Verification
    console.log('\n🔍 Step 5: Verification...');
    const { data: verification, error: verifyError } = await supabase
      .from('businesses')
      .select('id, cultural_identity, languages_spoken')
      .or('cultural_identity.not.is.null,languages_spoken.not.is.null');
    
    if (verifyError) {
      console.error('❌ Error verifying restoration:', verifyError);
    } else {
      console.log(`✅ Verification complete: Found ${verification.length} businesses with restored data`);
    }
    
    // Summary
    console.log('\n📈 RESTORATION SUMMARY:');
    console.log(`✅ Successfully restored: ${successCount} businesses`);
    console.log(`❌ Errors: ${errorCount} businesses`);
    console.log(`⏭️  Skipped (no data): ${skippedCount} businesses`);
    console.log(`📊 Total processed: ${duplicateData.length} businesses`);
    
    if (successCount > 0) {
      console.log('\n🎉 Restoration completed successfully!');
    } else {
      console.log('\n⚠️  No data was restored. Please check the errors above.');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the complete restoration
addColumnsAndRestoreData();
