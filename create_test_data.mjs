import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://mnmisjprswpuvcojnbip.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubWlzanByc3dwdXZjb2puYmlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2ODkwMTcsImV4cCI6MjA4NzI2NTAxN30.vl7Em91jGQP8mse-CJkIxTtuxWswoDO6sdSFLhhEc9A');

async function createTestData() {
  try {
    console.log('=== Creating test data ===');
    
    // Get the most recent business to use for testing
    const { data: recentBusiness, error: businessError } = await supabase
      .from('businesses')
      .select('id, name, status')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (businessError) {
      console.error('Error getting recent business:', businessError);
      return;
    }
    
    console.log(`Using business: ${recentbusiness.business_name} (ID: ${recentBusiness.id})`);
    
    // Update the most recent business to pending status
    const { error: updateError } = await supabase
      .from('businesses')
      .update({ status: 'pending' })
      .eq('id', recentBusiness.id);
    
    if (updateError) {
      console.error('Error updating business status:', updateError);
    } else {
      console.log(`✓ Updated ${recentbusiness.business_name} to pending status`);
    }
    
    // Create a test claim
    const claimData = {
      business_id: recentBusiness.id,
      user_id: 'test-user-id',
      status: 'pending',
      contact_email: 'test@example.com',
      contact_phone: '+1234567890',
      role: 'owner',
      claim_type: 'ownership',
      message: 'This is a test claim for the business',
      created_at: new Date().toISOString()
    };
    
    const { data: claim, error: claimError } = await supabase
      .from('claim_requests')
      .insert(claimData)
      .select()
      .single();
    
    if (claimError) {
      console.error('Error creating claim:', claimError);
    } else {
      console.log(`✓ Created test claim with ID: ${claim.id}`);
    }
    
    // Create a second test claim
    const claimData2 = {
      ...claimData,
      contact_email: 'test2@example.com',
      message: 'This is a second test claim'
    };
    
    const { data: claim2, error: claimError2 } = await supabase
      .from('claim_requests')
      .insert(claimData2)
      .select()
      .single();
    
    if (claimError2) {
      console.error('Error creating second claim:', claimError2);
    } else {
      console.log(`✓ Created second test claim with ID: ${claim2.id}`);
    }
    
    console.log('\n=== Test data created successfully! ===');
    console.log('Now check the admin dashboard - you should see:');
    console.log('1. One business in the "Pending" tab');
    console.log('2. Two claims in the "Claims" tab');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

createTestData();
