/**
 * Database script to fix cultural_identity consistency
 * Converts all cultural_identity values to JSON array format
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Parse cultural identity in various formats and return consistent JSON array
 */
function parseCulturalIdentity(value) {
  if (!value) return null;
  
  if (Array.isArray(value)) {
    return JSON.stringify(value);
  }
  
  const raw = String(value).trim();
  if (!raw) return null;
  
  try {
    // Handle JSON array format: ["samoa","new-zealand"]
    if (raw.startsWith('[') && raw.endsWith(']')) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return JSON.stringify(parsed);
      }
    }
    
    // Handle brace format: {Samoan} or {"Cook Islands Maori","French Polynesia"}
    if (raw.startsWith('{') && raw.endsWith('}')) {
      const items = raw
        .slice(1, -1)
        .split(',')
        .map(item => item.replace(/^"(.*)"$/, '$1').trim())
        .filter(Boolean);
      return JSON.stringify(items);
    }
    
    // Handle string format: new-zealand
    return JSON.stringify([raw]);
  } catch (error) {
    console.error('Error parsing cultural identity:', value, error);
    return null;
  }
}

/**
 * Fix cultural_identity consistency in profiles table
 */
export async function fixProfileCulturalIdentity() {
  try {
    console.log('Starting cultural identity consistency fix for profiles...');
    
    // Get all profiles with cultural_identity
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, cultural_identity')
      .not('cultural_identity', 'is', null);
    
    if (error) throw error;
    
    console.log(`Found ${profiles.length} profiles with cultural_identity data`);
    
    let fixedCount = 0;
    
    for (const profile of profiles) {
      const fixedValue = parseCulturalIdentity(profile.cultural_identity);
      
      if (fixedValue && fixedValue !== profile.cultural_identity) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ cultural_identity: fixedValue })
          .eq('id', profile.id);
        
        if (updateError) {
          console.error(`Failed to update profile ${profile.id}:`, updateError);
        } else {
          console.log(`Fixed profile ${profile.id}: ${profile.cultural_identity} -> ${fixedValue}`);
          fixedCount++;
        }
      }
    }
    
    console.log(`Successfully fixed ${fixedCount} profiles`);
    return fixedCount;
    
  } catch (error) {
    console.error('Error fixing cultural identity consistency:', error);
    throw error;
  }
}

/**
 * Fix cultural_identity consistency in businesses table
 */
export async function fixBusinessCulturalIdentity() {
  try {
    console.log('Starting cultural identity consistency fix for businesses...');
    
    // Get all businesses with cultural_identity
    const { data: businesses, error } = await supabase
      .from('businesses')
      .select('id, cultural_identity')
      .not('cultural_identity', 'is', null);
    
    if (error) throw error;
    
    console.log(`Found ${businesses.length} businesses with cultural_identity data`);
    
    let fixedCount = 0;
    
    for (const business of businesses) {
      const fixedValue = parseCulturalIdentity(business.cultural_identity);
      
      if (fixedValue && fixedValue !== business.cultural_identity) {
        const { error: updateError } = await supabase
          .from('businesses')
          .update({ cultural_identity: fixedValue })
          .eq('id', business.id);
        
        if (updateError) {
          console.error(`Failed to update business ${business.id}:`, updateError);
        } else {
          console.log(`Fixed business ${business.id}: ${business.cultural_identity} -> ${fixedValue}`);
          fixedCount++;
        }
      }
    }
    
    console.log(`Successfully fixed ${fixedCount} businesses`);
    return fixedCount;
    
  } catch (error) {
    console.error('Error fixing cultural identity consistency:', error);
    throw error;
  }
}

/**
 * Run all fixes
 */
export async function fixAllCulturalIdentity() {
  try {
    const profileCount = await fixProfileCulturalIdentity();
    const businessCount = await fixBusinessCulturalIdentity();
    
    console.log(`Cultural identity consistency fix complete:`);
    console.log(`- Profiles fixed: ${profileCount}`);
    console.log(`- Businesses fixed: ${businessCount}`);
    
    return { profileCount, businessCount };
  } catch (error) {
    console.error('Error running cultural identity fixes:', error);
    throw error;
  }
}

// Run if called directly
if (typeof window === 'undefined' && require.main === module) {
  fixAllCulturalIdentity()
    .then(() => {
      console.log('Cultural identity consistency fix completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Cultural identity consistency fix failed:', error);
      process.exit(1);
    });
}
