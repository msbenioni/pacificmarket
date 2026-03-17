/**
 * Business Data Transformer
 * Consolidates all form data into the businesses table:
 * - businesses table: All business data (public + insights + founder data)
 */

export const transformBusinessFormData = (formData) => {
  // All data now goes to businesses table
  const businessesData = {
    // Public business data
    name: formData.name,
    business_handle: formData.business_handle,
    tagline: formData.tagline,
    description: formData.description,
    logo_url: formData.logo_url,
    banner_url: formData.banner_url,
    mobile_banner_url: formData.mobile_banner_url,
    business_owner: formData.business_owner,
    business_owner_email: formData.business_owner_email,
    additional_owner_emails: formData.additional_owner_emails,
    contact_email: formData.contact_email,
    contact_phone: formData.contact_phone,
    contact_website: formData.contact_website,
    business_hours: formData.business_hours,
    country: formData.country,
    industry: formData.industry,
    city: formData.city,
    year_started: formData.year_started,
    business_structure: formData.business_structure,
    team_size_band: formData.team_size_band,
    status: formData.status,
    is_verified: formData.is_verified,
    is_claimed: formData.is_claimed,
    is_homepage_featured: formData.is_homepage_featured,
    subscription_tier: formData.subscription_tier,
    
    // Business insights data (now in businesses table)
    business_stage: formData.business_stage,
    business_registered: formData.is_business_registered === true || formData.is_business_registered === "true" ? true : false,
    
    // Founder insights data (now in businesses table)
    founder_story: formData.founder_story,
    age_range: formData.age_range,
    gender: formData.gender,
    collaboration_interest: formData.collaboration_interest,
    mentorship_offering: formData.mentorship_offering,
    open_to_future_contact: formData.open_to_future_contact,
    business_acquisition_interest: formData.business_acquisition_interest,
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
 * Sanitize data for specific database tables
 */
export const sanitizeForBusinessesTable = (data) => {
  const sanitized = filterEmptyValues(data);
  
  // All fields are now allowed in businesses table after consolidation
  const allowedFields = [
    'name', 'business_handle', 'tagline', 'description', 'logo_url', 'banner_url', 'mobile_banner_url',
    'business_owner', 'business_owner_email', 'additional_owner_emails',
    'contact_email', 'contact_phone', 'contact_website', 'business_hours',
    'country', 'industry', 'city', 'year_started', 'business_structure',
    'team_size_band', 'status', 'is_verified', 'is_claimed', 'is_homepage_featured',
    'subscription_tier',
    // Business insights fields (now in businesses table)
    'business_stage', 'business_registered',
    // Founder insights fields (now in businesses table)
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
