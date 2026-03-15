/**
 * Business Data Transformer
 * Splits unified form data by table destination:
 * - businesses table: Public data for Insights/Registry pages
 * - business_insights table: Internal business tracking data
 * - founder_insights table: Founder-specific insights data
 */

export const transformBusinessFormData = (formData) => {
  // Public data for businesses table (displayed on Insights/Registry pages)
  const businessesData = {
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
  };

  // Business insights data for business_insights table (internal tracking)
  const businessInsightsData = {
    business_stage: formData.business_stage,
    top_challenges_array: formData.top_challenges_array,
    is_business_registered: formData.is_business_registered === true || formData.is_business_registered === "true" ? true : false,
    private_business_phone: formData.private_business_phone,
    private_business_email: formData.private_business_email,
  };

  return {
    businessesData,
    businessInsightsData,
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
  
  // Remove any fields that don't belong in businesses table
  const allowedFields = [
    'name', 'business_handle', 'tagline', 'description', 'logo_url', 'banner_url', 'mobile_banner_url',
    'business_owner', 'business_owner_email', 'additional_owner_emails',
    'contact_email', 'contact_phone', 'contact_website', 'business_hours',
    'country', 'industry', 'city', 'year_started', 'business_structure',
    'team_size_band', 'status', 'is_verified', 'is_claimed', 'is_homepage_featured'
  ];
  
  const result = {};
  allowedFields.forEach(field => {
    if (sanitized[field] !== undefined) {
      result[field] = sanitized[field];
    }
  });
  
  return result;
};

export const sanitizeForBusinessInsightsTable = (data) => {
  const sanitized = filterEmptyValues(data);
  
  // Remove any fields that don't belong in business_insights table
  const disallowedFields = [
    'name', 'business_handle', 'tagline', 'description', 'logo_url', 'banner_url', 'mobile_banner_url',
    'contact_email', 'contact_phone', 'contact_website', 'business_hours',
    'country', 'industry', 'city', 'status', 'is_verified', 'is_claimed', 'is_homepage_featured'
  ];
  
  const result = { ...sanitized };
  disallowedFields.forEach(field => {
    delete result[field];
  });
  
  return result;
};
