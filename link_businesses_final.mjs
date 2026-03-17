import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  'https://mnmisjprswpuvcojnbip.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubWlzanByc3dwdXZjb2puYmlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTY4OTAxNywiZXhwIjoyMDg3MjY1MDE3fQ.g5GzYucCUT1kqQPfx5YdeVPZbPILVSrkfrhJR-XjpGM'
);

async function linkBusinessesToUser() {
  try {
    const userId = '1eb66672-7581-4184-96a8-553abed10682';
    
    console.log('=== Getting user profile ===');
    
    // Get the user profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, email, display_name')
      .eq('id', userId)
      .single();
    
    if (profileError) {
      console.error('Error finding profile:', profileError);
      return;
    }
    
    console.log(`Found profile: ${profile.display_name} (${profile.email})`);
    console.log(`User ID: ${profile.id}`);
    
    console.log('\n=== Linking businesses to your account ===');
    
    // Update SaaSy Cookies
    const { error: saasyError } = await supabaseAdmin
      .from('businesses')
      .update({ owner_user_id: profile.id })
      .eq('id', '1ceaf4d4-8a5e-4f25-b75f-43a05cd656fb');
    
    if (saasyError) {
      console.error('Error updating SaaSy Cookies:', saasyError);
    } else {
      console.log('✓ SaaSy Cookies linked to your account');
    }
    
    // Update SenseAI
    const { error: senseError } = await supabaseAdmin
      .from('businesses')
      .update({ owner_user_id: profile.id })
      .eq('id', 'e0e03cd4-3a8b-48f9-8ffa-546abfa7925c');
    
    if (senseError) {
      console.error('Error updating SenseAI:', senseError);
    } else {
      console.log('✓ SenseAI linked to your account');
    }
    
    console.log('\n=== Verification ===');
    
    // Check the updated businesses
    const { data: updatedBusinesses, error: checkError } = await supabaseAdmin
      .from('businesses')
      .select('id, name, owner_user_id')
      .in('id', ['1ceaf4d4-8a5e-4f25-b75f-43a05cd656fb', 'e0e03cd4-3a8b-48f9-8ffa-546abfa7925c']);
    
    if (checkError) {
      console.error('Error checking updates:', checkError);
    } else {
      console.log('Updated businesses:');
      updatedBusinesses?.forEach(b => {
        console.log(`- ${business.business_name} (owner_user_id: ${b.owner_user_id})`);
      });
    }
    
    console.log('\n=== Cleaning up claim requests ===');
    
    // Since we're directly linking the businesses, we can remove the claim requests
    const { error: deleteClaimsError } = await supabaseAdmin
      .from('claim_requests')
      .delete()
      .in('business_id', ['1ceaf4d4-8a5e-4f25-b75f-43a05cd656fb', 'e0e03cd4-3a8b-48f9-8ffa-546abfa7925c']);
    
    if (deleteClaimsError) {
      console.error('Error removing claim requests:', deleteClaimsError);
    } else {
      console.log('✓ Claim requests removed (no longer needed)');
    }
    
    console.log('\n✅ Success! Now refresh your business portal and you should see both businesses.');
    console.log('Your verified businesses are now directly linked to your account.');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

linkBusinessesToUser();
