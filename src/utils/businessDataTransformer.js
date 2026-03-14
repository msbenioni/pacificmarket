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
    hiring_intentions: formData.hiring_intentions,
    business_operating_status: formData.business_operating_status,
    business_age: formData.business_age,
    is_business_registered: formData.is_business_registered,
    employs_anyone: formData.employs_anyone,
    employs_family_community: formData.employs_family_community,
    team_size_band: formData.team_size_band,
    revenue_band: formData.revenue_band,
    current_funding_source: formData.current_funding_source,
    funding_amount_needed: formData.funding_amount_needed,
    funding_purpose: formData.funding_purpose,
    investment_stage: formData.investment_stage,
    investment_exploration: formData.investment_exploration,
    community_impact_areas_array: formData.community_impact_areas_array,
    support_needed_next_array: formData.support_needed_next_array,
    current_support_sources_array: formData.current_support_sources_array,
    expansion_plans: formData.expansion_plans,
    industry: formData.industry,
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
