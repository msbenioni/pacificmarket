/**
 * Business Data Transformer
 * Consolidates all form data into the businesses table:
 * - businesses table: All business data (public + insights + founder data)
 */
import { isPersistentMediaUrl } from "@/utils/mediaUrlUtils";

export const transformBusinessFormData = (formData) => {
  // All data now goes to businesses table with new field names
  const businessesData = {
    // Core business info
    business_name: formData.business_name,
    business_handle: formData.business_handle,
    tagline: formData.tagline,
    description: formData.description,
    role: formData.role,
    
    // Brand media (include only persistent URLs; omit blob/transient values)
    ...(isPersistentMediaUrl(formData.logo_url, { allowRootRelative: false }) && {
      logo_url: formData.logo_url,
    }),
    ...(isPersistentMediaUrl(formData.banner_url, { allowRootRelative: false }) && {
      banner_url: formData.banner_url,
    }),
    ...(isPersistentMediaUrl(formData.mobile_banner_url, { allowRootRelative: false }) && {
      mobile_banner_url: formData.mobile_banner_url,
    }),
    
    // Business contact & website
    business_contact_person: formData.business_contact_person,
    business_email: formData.business_email,
    business_phone: formData.business_phone,
    business_website: formData.business_website,
    business_hours: formData.business_hours,
    
    // Location
    country: formData.country,
    city: formData.city,
    address: formData.address,
    suburb: formData.suburb,
    state_region: formData.state_region,
    postal_code: formData.postal_code,
    industry: formData.industry,
    
    // Business overview
    year_started: formData.year_started,
    business_stage: formData.business_stage,
    business_structure: formData.business_structure,
    team_size_band: formData.team_size_band,
    is_business_registered: formData.is_business_registered === true || formData.is_business_registered === "true" ? true : false,
    
    // Founder info
    founder_story: formData.founder_story,
    age_range: formData.age_range,
    gender: formData.gender,
    
    // Community & opportunities
    collaboration_interest: formData.collaboration_interest,
    mentorship_offering: formData.mentorship_offering,
    open_to_future_contact: formData.open_to_future_contact,
    business_acquisition_interest: formData.business_acquisition_interest,
    
    // Social media (without website)
    social_links: formData.social_links,
    
    // System fields
    status: formData.status,
    is_verified: formData.is_verified,
    is_claimed: formData.is_claimed,
    subscription_tier: formData.subscription_tier,
    visibility_tier: formData.visibility_tier,
    visibility_mode: formData.visibility_mode,
  };

  return {
    businessesData,
    businessInsightsData: {}, // Empty since we consolidated everything
  };
};

/**
 * Filter out empty values from form data
 */
export const filterEmptyValues = (data) => {
  const filtered = {};
  
  Object.keys(data).forEach(key => {
    const value = data[key];
    
    // Skip null, undefined, empty strings, and empty arrays
    if (value === null || value === undefined || value === "" || 
        (Array.isArray(value) && value.length === 0)) {
      return;
    }
    
    filtered[key] = value;
  });
  
  return filtered;
};

/**
 * Inherit cultural data from user profile if not explicitly set
 */
export const inheritProfileData = async (businessData, userId) => {
  try {
    const { getSupabase } = await import('../lib/supabase/client');
    const supabase = getSupabase();
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('cultural_identity, languages_spoken')
      .eq('id', userId)
      .single();
    
    if (profile) {
      // Only inherit if business doesn't already have these values
      const inheritedData = {
        ...businessData,
        cultural_identity: businessData.cultural_identity || profile.cultural_identity,
        languages_spoken: businessData.languages_spoken || profile.languages_spoken,
      };
      
      return inheritedData;
    }
  } catch (error) {
    console.warn('Could not fetch profile for inheritance:', error);
  }
  
  return businessData;
};

/**
 * Sanitize data for specific database tables
 */
export const sanitizeForBusinessesTable = (data) => {
  const sanitized = filterEmptyValues(data);
  
  // All fields are now allowed in businesses table after consolidation
  const allowedFields = [
    'business_name', 'business_handle', 'tagline', 'description', 'logo_url', 'banner_url', 'mobile_banner_url',
    'business_contact_person', 'business_email', 'business_phone', 'business_website', 'business_hours',
    'country', 'city', 'address', 'suburb', 'state_region', 'postal_code', 'industry',
    'year_started', 'business_stage', 'business_structure', 'team_size_band', 'is_business_registered',
    'status', 'is_verified', 'is_claimed', 'subscription_tier', 'visibility_tier', 'visibility_mode',
    // Claim request details
    'role',
    // Social media
    'social_links',
    // Cultural and language data
    'cultural_identity', 'languages_spoken',
    // Founder insights fields
    'founder_story', 'age_range', 'gender', 'collaboration_interest', 
    'mentorship_offering', 'open_to_future_contact', 'business_acquisition_interest'
  ];
  
  const result = {};
  allowedFields.forEach(field => {
    if (sanitized[field] !== undefined) {
      result[field] = sanitized[field];
    }
  });
  
  return result;
};
