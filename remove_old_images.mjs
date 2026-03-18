// Script to remove old generated banner/logo URLs for specific business
// Using the existing database connection pattern

import { getSupabase } from './src/lib/supabase/client.js';

async function removeOldGeneratedImages() {
  const businessId = 'fcf11781-96da-4c8b-b16c-bca3c50724a3';
  
  try {
    const supabase = getSupabase();
    
    console.log(`Removing old generated images for business: ${businessId}`);
    
    // Update the business to remove banner and logo URLs
    const { data, error } = await supabase
      .from('businesses')
      .update({
        logo_url: null,
        banner_url: null,
        mobile_banner_url: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', businessId);
    
    if (error) {
      console.error('Error updating business:', error);
      throw error;
    }
    
    console.log('Successfully removed old generated images');
    console.log('Business will now use:');
    console.log('- Logo: Generated initials with Pacific brand colors');
    console.log('- Banner: Teal background with white business name text');
    
    // Verify the update
    const { data: verifyData } = await supabase
      .from('businesses')
      .select('id, business_name, logo_url, banner_url, mobile_banner_url')
      .eq('id', businessId)
      .single();
    
    console.log('Updated business data:', verifyData);
    
  } catch (error) {
    console.error('Script failed:', error);
    process.exit(1);
  }
}

removeOldGeneratedImages();
