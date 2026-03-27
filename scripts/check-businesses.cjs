#!/usr/bin/env node

/**
 * Check businesses table schema and data
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function checkBusinesses() {
  console.log('🏢 Checking businesses table...');
  
  try {
    // Get sample data to see what fields exist
    const { data: businesses, error } = await supabase
      .from('businesses')
      .select('*')
      .limit(5);

    if (error) {
      console.error('❌ Failed to query businesses:', error);
      return;
    }

    console.log(`✅ Found ${businesses?.length || 0} businesses`);
    
    if (businesses && businesses.length > 0) {
      const sampleBusiness = businesses[0];
      const fields = Object.keys(sampleBusiness);
      
      console.log('\n📋 Available fields:');
      fields.forEach(field => {
        console.log(`  - ${field}: ${typeof sampleBusiness[field]}`);
      });

      console.log('\n📊 Sample business data:');
      businesses.forEach((business, i) => {
        console.log(`\n${i + 1}. ${business.business_name || business.name || 'No name'}`);
        console.log(`   Email: ${business.business_email || business.contact_email || 'Missing'}`);
        console.log(`   Contact: ${business.business_contact_person || business.contact_name || 'Missing'}`);
        console.log(`   Tier: ${business.subscription_tier || 'Missing'}`);
        console.log(`   Active: ${business.is_active !== false ? 'Yes' : 'No'}`);
        console.log(`   Verified: ${business.is_verified ? 'Yes' : 'No'}`);
        console.log(`   Handle: ${business.business_handle || 'Missing'}`);
      });

      // Check specific required fields
      const requiredFields = [
        'business_name',
        'business_email', 
        'business_contact_person',
        'subscription_tier',
        'is_active',
        'is_verified',
        'business_handle'
      ];

      const missingFields = requiredFields.filter(field => !fields.includes(field));
      const alternativeMappings = {
        'name': 'business_name',
        'contact_email': 'business_email',
        'contact_name': 'business_contact_person'
      };

      console.log('\n🔍 Field analysis:');
      requiredFields.forEach(field => {
        if (fields.includes(field)) {
          console.log(`✅ ${field}: Present`);
        } else {
          const altField = Object.keys(alternativeMappings).find(alt => alt === field);
          if (altField && fields.includes(altField)) {
            console.log(`⚠️  ${field}: Found as '${altField}' (legacy field)`);
          } else {
            console.log(`❌ ${field}: Missing`);
          }
        }
      });

      // Count businesses with emails
      const emailField = fields.includes('business_email') ? 'business_email' : 
                        fields.includes('contact_email') ? 'contact_email' : null;
      
      if (emailField) {
        const { count: totalBusinesses } = await supabase
          .from('businesses')
          .select('*', { count: 'exact', head: true });

        const { count: businessesWithEmail } = await supabase
          .from('businesses')
          .select('*', { count: 'exact', head: true })
          .not(emailField, 'is', null);

        console.log(`\n📈 Email coverage:`);
        console.log(`   Total businesses: ${totalBusinesses}`);
        console.log(`   With email (${emailField}): ${businessesWithEmail}`);
        console.log(`   Coverage: ${totalBusinesses > 0 ? Math.round((businessesWithEmail / totalBusinesses) * 100) : 0}%`);
      }

    } else {
      console.log('❌ No businesses found in database');
    }

  } catch (error) {
    console.error('❌ Check failed:', error);
  }
}

checkBusinesses().catch(console.error);
