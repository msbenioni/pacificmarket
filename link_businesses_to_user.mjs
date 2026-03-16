import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  'https://mnmisjprswpuvcojnbip.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubWlzanByc3dwdXZjb2puYmlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTY4OTAxNywiZXhwIjoyMDg3MjY1MDE3fQ.g5GzYucCUT1kqQPfx5YdeVPZbPILVSrkfrhJR-XjpGM'
);

async function linkBusinessesToUser() {
  try {
    console.log('=== Finding your user account ===');
    
    // Find the user account for saasycookies@gmail.com
    const { data: profiles, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, email, display_name')
      .eq('email', 'saasycookies@gmail.com');
    
    if (profileError) {
      console.error('Error finding profile:', profileError);
      return;
    }
    
    if (!profiles || profiles.length === 0) {
      console.log('No profile found for saasycookies@gmail.com');
      return;
    }
    
    const userProfile = profiles[0];
    console.log(`Found profile: ${userProfile.display_name} (ID: ${userProfile.id})`);
    
    console.log('\n=== Linking businesses to your account ===');
    
    // Update SaaSy Cookies
    const { error: saasyError } = await supabaseAdmin
      .from('businesses')
      .update({ owner_user_id: userProfile.id })
      .eq('id', '1ceaf4d4-8a5e-4f25-b75f-43a05cd656fb');
    
    if (saasyError) {
      console.error('Error updating SaaSy Cookies:', saasyError);
    } else {
      console.log('✓ SaaSy Cookies linked to your account');
    }
    
    // Update SenseAI
    const { error: senseError } = await supabaseAdmin
      .from('businesses')
      .update({ owner_user_id: userProfile.id })
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
        console.log(`- ${b.name} (owner_user_id: ${b.owner_user_id})`);
      });
    }
    
    console.log('\n✅ Success! Now refresh your business portal and you should see both businesses.');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

linkBusinessesToUser();
