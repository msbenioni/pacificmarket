import { createClient } from '@supabase/supabase-js';

// Use service role key to check user ID format
const supabaseAdmin = createClient(
  'https://mnmisjprswpuvcojnbip.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubWlzanByc3dwdXZjb2puYmlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTY4OTAxNywiZXhwIjoyMDg3MjY1MDE3fQ.g5GzYucCUT1kqQPfx5YdeVPZbPILVSrkfrhJR-XjpGM'
);

async function checkUserIdFormat() {
  try {
    console.log('=== Checking User ID Format ===');
    
    // Get a sample user to check the ID format
    const { data: profiles, error } = await supabaseAdmin
      .from('profiles')
      .select('id, email, display_name')
      .limit(3);
    
    if (error) {
      console.error('Error fetching profiles:', error);
      return;
    }
    
    console.log('Sample user IDs from database:');
    profiles?.forEach(profile => {
      console.log(`- ID: ${profile.id}`);
      console.log(`- Email: ${profile.email}`);
      console.log(`- Display Name: ${profile.display_name}`);
      console.log('');
    });
    
    // Check if the IDs are valid UUIDs
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
    profiles?.forEach(profile => {
      const isValidUuid = uuidRegex.test(profile.id);
      console.log(`ID "${profile.id}" is ${isValidUuid ? 'valid' : 'invalid'} UUID`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkUserIdFormat();
