/**
 * Database Cleanup Script: Standardize Country Data Format
 * 
 * This script will:
 * 1. Update all businesses table country values to use consistent slug format
 * 2. Update all profiles table country values to use consistent slug format
 * 3. Ensure all country data matches the COUNTRIES.value format from unifiedConstants
 */

import { createClient } from '@supabase/supabase-js';

// Import the COUNTRIES constant to get the mapping
const COUNTRIES = [
  // Pacific Region
  { value: 'american-samoa', label: 'American Samoa' },
  { value: 'australia', label: 'Australia' },
  { value: 'australia-aboriginal', label: 'Australia Aboriginal' },
  { value: 'cook-islands', label: 'Cook Islands' },
  { value: 'fiji', label: 'Fiji' },
  { value: 'french-polynesia', label: 'French Polynesia' },
  { value: 'guam', label: 'Guam' },
  { value: 'kiribati', label: 'Kiribati' },
  { value: 'marshall-islands', label: 'Marshall Islands' },
  { value: 'micronesia', label: 'Micronesia' },
  { value: 'nauru', label: 'Nauru' },
  { value: 'new-caledonia', label: 'New Caledonia' },
  { value: 'new-zealand', label: 'New Zealand' },
  { value: 'new-zealand-maori', label: 'New Zealand Māori' },
  { value: 'niue', label: 'Niue' },
  { value: 'northern-mariana-islands', label: 'Northern Mariana Islands' },
  { value: 'palau', label: 'Palau' },
  { value: 'papua-new-guinea', label: 'Papua New Guinea' },
  { value: 'samoa', label: 'Samoa' },
  { value: 'solomon-islands', label: 'Solomon Islands' },
  { value: 'tokelau', label: 'Tokelau' },
  { value: 'tonga', label: 'Tonga' },
  { value: 'tuvalu', label: 'Tuvalu' },
  { value: 'vanuatu', label: 'Vanuatu' },
  { value: 'wallis-futuna', label: 'Wallis and Futuna' },
  { value: 'hawaii', label: 'Hawaii' },

  // Major Global Economies
  { value: 'usa', label: 'United States' },
  { value: 'canada', label: 'Canada' },
  { value: 'united-kingdom', label: 'United Kingdom' },
  { value: 'france', label: 'France' },
  { value: 'germany', label: 'Germany' },
  { value: 'netherlands', label: 'Netherlands' },
  { value: 'belgium', label: 'Belgium' },
  { value: 'switzerland', label: 'Switzerland' },
  { value: 'spain', label: 'Spain' },
  { value: 'italy', label: 'Italy' },
  { value: 'portugal', label: 'Portugal' },
  { value: 'norway', label: 'Norway' },
  { value: 'sweden', label: 'Sweden' },
  { value: 'denmark', label: 'Denmark' },
  { value: 'finland', label: 'Finland' },
  { value: 'ireland', label: 'Ireland' },

  // Asia-Pacific Major Economies
  { value: 'china', label: 'China' },
  { value: 'japan', label: 'Japan' },
  {value: 'south-korea', label: 'South Korea' },
  { value: 'singapore', label: 'Singapore' },
  { value: 'hong-kong', label: 'Hong Kong' },
  { value: 'taiwan', label: 'Taiwan' },
  { value: 'indonesia', label: 'Indonesia' },
  { value: 'malaysia', label: 'Malaysia' },
  { value: 'thailand', label: 'Thailand' },
  { value: 'philippines', label: 'Philippines' },
  { value: 'vietnam', label: 'Vietnam' },
  { value: 'india', label: 'India' },

  // Middle East
  { value: 'united-arab-emirates', label: 'United Arab Emirates' },
  { value: 'qatar', label: 'Qatar' },
  { value: 'saudi-arabia', label: 'Saudi Arabia' },

  // Americas
  { value: 'mexico', label: 'Mexico' },
  { value: 'brazil', label: 'Brazil' },
  { value: 'argentina', label: 'Argentina' },
  { value: 'chile', label: 'Chile' },
  { value: 'peru', label: 'Peru' },
  { value: 'colombia', label: 'Colombia' },

  // Africa
  { value: 'south-africa', label: 'South Africa' },
  { value: 'kenya', label: 'Kenya' },
  { value: 'nigeria', label: 'Nigeria' },
  { value: 'egypt', label: 'Egypt' },

  { value: 'other', label: 'Other' }
];

// Create a mapping for various country formats to standardized values
function createCountryMapping() {
  const mapping = {};
  
  COUNTRIES.forEach(country => {
    // Map the standard value to itself
    mapping[country.value.toLowerCase()] = country.value;
    
    // Map the label to the value
    mapping[country.label.toLowerCase()] = country.value;
    
    // Map common variations
    if (country.value === 'united-states') {
      mapping['usa'] = country.value;
      mapping['us'] = country.value;
      mapping['united states'] = country.value;
    }
    
    if (country.value === 'united-kingdom') {
      mapping['uk'] = country.value;
      mapping['united kingdom'] = country.value;
    }
    
    if (country.value === 'new-zealand') {
      mapping['nz'] = country.value;
      mapping['new zealand'] = country.value;
    }
    
    if (country.value === 'australia') {
      mapping['au'] = country.value;
    }
    
    // Map space-separated to hyphen-separated
    const spaceToHyphen = country.value.replace(/-/g, ' ').toLowerCase();
    const hyphenToSpace = country.value.replace(/ /g, '-').toLowerCase();
    mapping[spaceToHyphen] = country.value;
    mapping[hyphenToSpace] = country.value;
  });
  
  return mapping;
}

// Function to standardize country value
function standardizeCountry(countryValue) {
  if (!countryValue) return null;
  
  const mapping = createCountryMapping();
  const normalized = countryValue.toString().trim().toLowerCase();
  
  return mapping[normalized] || null;
}

async function cleanupCountryData() {
  console.log('🧹 Starting country data cleanup...');
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  
  try {
    // Clean up businesses table
    console.log('📊 Cleaning businesses table...');
    const { data: businesses, error: businessesError } = await supabase
      .from('businesses')
      .select('id, business_name, country');
    
    if (businessesError) {
      console.error('❌ Error fetching businesses:', businessesError);
      return;
    }
    
    console.log(`📋 Found ${businesses.length} businesses`);
    
    let businessesUpdated = 0;
    for (const business of businesses) {
      if (business.country) {
        const standardizedCountry = standardizeCountry(business.country);
        
        if (standardizedCountry && standardizedCountry !== business.country) {
          const { error: updateError } = await supabase
            .from('businesses')
            .update({ country: standardizedCountry })
            .eq('id', business.id);
          
          if (updateError) {
            console.error(`❌ Error updating business ${business.id}:`, updateError);
          } else {
            console.log(`✅ Updated business ${business.id}: "${business.country}" → "${standardizedCountry}"`);
            businessesUpdated++;
          }
        }
      }
    }
    
    // Clean up profiles table
    console.log('👥 Cleaning profiles table...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, country');
    
    if (profilesError) {
      console.error('❌ Error fetching profiles:', profilesError);
      return;
    }
    
    console.log(`📋 Found ${profiles.length} profiles`);
    
    let profilesUpdated = 0;
    for (const profile of profiles) {
      if (profile.country) {
        const standardizedCountry = standardizeCountry(profile.country);
        
        if (standardizedCountry && standardizedCountry !== profile.country) {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ country: standardizedCountry })
            .eq('id', profile.id);
          
          if (updateError) {
            console.error(`❌ Error updating profile ${profile.id}:`, updateError);
          } else {
            console.log(`✅ Updated profile ${profile.id}: "${profile.country}" → "${standardizedCountry}"`);
            profilesUpdated++;
          }
        }
      }
    }
    
    console.log('🎉 Cleanup completed!');
    console.log(`📊 Businesses updated: ${businessesUpdated}`);
    console.log(`👥 Profiles updated: ${profilesUpdated}`);
    
    // Show sample of updated data
    console.log('\n📋 Sample updated country values:');
    const { data: sampleBusinesses } = await supabase
      .from('businesses')
      .select('id, business_name, country')
      .limit(10);
    
    sampleBusinesses?.forEach(business => {
      console.log(`  ${business.business_name}: ${business.country}`);
    });
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
  }
}

// Run the cleanup
cleanupCountryData();
