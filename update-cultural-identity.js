import { Pool } from 'pg';

const connectionString = 'postgresql://postgres:MontBlanc3001@db.mnmisjprswpuvcojnbip.supabase.co:5432/postgres';

const pool = new Pool({
  connectionString: connectionString,
});

async function updateCulturalIdentity() {
  const client = await pool.connect();
  
  try {
    console.log('Looking for business with handle: new-zealand-home-loans-and-insurance-northwest-auckland');
    
    // First, find the business by handle
    const findQuery = `
      SELECT id, business_name, business_handle, cultural_identity
      FROM businesses 
      WHERE business_handle = 'new-zealand-home-loans-and-insurance-northwest-auckland'
    `;
    
    const findResult = await client.query(findQuery);
    
    if (findResult.rows.length === 0) {
      console.log('Business not found with that handle.');
      
      // Let's search for similar handles
      const searchQuery = `
        SELECT business_handle, business_name, cultural_identity
        FROM businesses 
        WHERE business_handle LIKE '%northwest%' OR business_handle LIKE '%home-loans%'
        LIMIT 10
      `;
      
      const searchResult = await client.query(searchQuery);
      console.log('Similar businesses found:');
      searchResult.rows.forEach(row => {
        console.log(`- ${row.business_handle}: ${row.business_name} (cultural_identity: ${row.cultural_identity})`);
      });
      return;
    }
    
    const business = findResult.rows[0];
    console.log('Found business:');
    console.log(`- ID: ${business.id}`);
    console.log(`- Name: ${business.business_name}`);
    console.log(`- Handle: ${business.business_handle}`);
    console.log(`- Current cultural_identity: ${business.cultural_identity}`);
    
    // Update the cultural identity to Tonga
    const updateQuery = `
      UPDATE businesses 
      SET cultural_identity = '["Tonga"]', updated_at = NOW()
      WHERE id = $1
    `;
    
    await client.query(updateQuery, [business.id]);
    
    console.log('Successfully updated cultural_identity to Tonga!');
    
    // Verify the update
    const verifyQuery = `
      SELECT business_name, business_handle, cultural_identity, updated_at
      FROM businesses 
      WHERE id = $1
    `;
    
    const verifyResult = await client.query(verifyQuery, [business.id]);
    const updatedBusiness = verifyResult.rows[0];
    
    console.log('Updated business details:');
    console.log(`- Name: ${updatedBusiness.business_name}`);
    console.log(`- Handle: ${updatedBusiness.business_handle}`);
    console.log(`- New cultural_identity: ${updatedBusiness.cultural_identity}`);
    console.log(`- Updated at: ${updatedBusiness.updated_at}`);
    
  } catch (error) {
    console.error('Error updating cultural identity:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

updateCulturalIdentity();
