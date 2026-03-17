const { Client } = require('pg');

// Database connection
const client = new Client({
  connectionString: 'postgresql://postgres:MontBlanc3001@db.mnmisjprswpuvcojnbip.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function checkCurrentState() {
  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Check the specific claim and business
    const claimId = 'db99a9a4-8f30-44dd-8b14-77b663c7531e';
    const businessId = '8e3c51fd-f7f9-4873-a91e-5edafb7b10f0';

    console.log('🔍 Checking claim status...');
    const claimCheck = await client.query(`
      SELECT id, status, business_id, reviewed_at, reviewed_by
      FROM claim_requests 
      WHERE id = $1
    `, [claimId]);
    
    console.log('Claim status:', claimCheck.rows[0]);

    console.log('\n🔍 Checking business status...');
    const businessCheck = await client.query(`
      SELECT id, name, status, updated_at
      FROM businesses 
      WHERE id = $1
    `, [businessId]);
    
    console.log('Business status:', businessCheck.rows[0]);

    // Check if there are any pending claims for active businesses
    console.log('\n🔍 Checking all pending claims and their business statuses...');
    const pendingClaimsCheck = await client.query(`
      SELECT 
        cr.id as claim_id,
        cr.status as claim_status,
        cr.business_id,
        business.business_name as business_name,
        b.status as business_status,
        cr.created_at as claim_created,
        cr.reviewed_at as claim_reviewed
      FROM claim_requests cr
      LEFT JOIN businesses b ON cr.business_id = b.id
      WHERE cr.status = 'pending'
      ORDER BY cr.created_at DESC
    `);
    
    console.log(`Found ${pendingClaimsCheck.rows.length} pending claims:`);
    pendingClaimsCheck.rows.forEach(row => {
      console.log(`- Claim: ${row.claim_id}`);
      console.log(`  Business: ${row.business_name} (${row.business_id})`);
      console.log(`  Claim Status: ${row.claim_status}`);
      console.log(`  Business Status: ${row.business_status}`);
      console.log(`  Claim Created: ${row.claim_created}`);
      console.log(`  Claim Reviewed: ${row.claim_reviewed}`);
      console.log('');
    });

    console.log('✅ State check completed!');

  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await client.end();
  }
}

checkCurrentState();
