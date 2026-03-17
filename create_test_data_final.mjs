import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://mnmisjprswpuvcojnbip.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubWlzanByc3dwdXZjb2puYmlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2ODkwMTcsImV4cCI6MjA4NzI2NTAxN30.vl7Em91jGQP8mse-CJkIxTtuxWswoDO6sdSFLhhEc9A');

async function createTestData() {
  try {
    console.log('=== Creating test data for dashboard ===');
    
    // 1. Create a test pending business
    const testBusiness = {
      name: 'Test Pending Business',
      business_handle: 'test-pending-business',
      description: 'This is a test business to verify the pending tab works',
      contact_email: 'test@pending.com',
      country: 'NZ',
      city: 'Auckland',
      industry: 'technology',
      status: 'pending',
      is_verified: false,
      subscription_tier: 'vaka',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_date: new Date().toISOString().split('T')[0]
    };
    
    console.log('Creating test pending business...');
    const { data: newBusiness, error: businessError } = await supabase
      .from('businesses')
      .insert(testBusiness)
      .select('id, name, status, created_at')
      .single();
    
    if (businessError) {
      console.error('Error creating business:', businessError);
    } else {
      console.log(`✓ Created pending business: ${newbusiness.business_name} (ID: ${newBusiness.id})`);
    }
    
    // 2. Create a test claim request on an existing business
    console.log('\nCreating test claim request...');
    
    // Get an existing business to attach the claim to
    const { data: existingBusiness, error: existingError } = await supabase
      .from('businesses')
      .select('id, name')
      .eq('status', 'active')
      .limit(1)
      .single();
    
    if (existingError) {
      console.error('Error getting existing business:', existingError);
      return;
    }
    
    const testClaim = {
      business_id: existingBusiness.id,
      user_id: 'test-user-123',
      status: 'pending',
      contact_email: 'claimant@test.com',
      contact_phone: '+1234567890',
      role: 'owner',
      claim_type: 'ownership',
      message: 'This is a test claim to verify the claims tab works',
      proof_url: 'https://example.com/proof',
      created_at: new Date().toISOString()
    };
    
    const { data: newClaim, error: claimError } = await supabase
      .from('claim_requests')
      .insert(testClaim)
      .select('id, business_id, status, contact_email')
      .single();
    
    if (claimError) {
      console.error('Error creating claim:', claimError);
    } else {
      console.log(`✓ Created claim request: ${newClaim.id} for business ${existingbusiness.business_name}`);
    }
    
    // 3. Verify the data was created
    console.log('\n=== Verifying test data ===');
    
    const { data: pendingBusinesses, error: pendingError } = await supabase
      .from('businesses')
      .select('id, name, status')
      .eq('status', 'pending');
    
    if (pendingError) {
      console.error('Error checking pending businesses:', pendingError);
    } else {
      console.log(`Pending businesses: ${pendingBusinesses?.length || 0}`);
      pendingBusinesses?.forEach(b => {
        console.log(`- ${business.business_name} (${b.id})`);
      });
    }
    
    const { data: claims, error: claimsCheckError } = await supabase
      .from('claim_requests')
      .select('id, business_id, status, contact_email');
    
    if (claimsCheckError) {
      console.error('Error checking claims:', claimsCheckError);
    } else {
      console.log(`Claims: ${claims?.length || 0}`);
      claims?.forEach(c => {
        console.log(`- Claim ${c.id} (business: ${c.business_id}, status: ${c.status})`);
      });
    }
    
    console.log('\n✅ Test data created successfully!');
    console.log('Now refresh your admin dashboard and you should see:');
    console.log('1. One business in the "Pending" tab');
    console.log('2. One claim in the "Claims" tab');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

createTestData();
