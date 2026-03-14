/**
 * Business Data Transformer
 * Splits unified form data into public and private data for different database tables
 */

export const transformBusinessFormData = (formData) => {
  // Public data for businesses table
  const publicData = {
    name: formData.name,
    business_handle: formData.business_handle,
    tagline: formData.tagline,
    description: formData.description,
    logo_url: formData.logo_url,
    banner_url: formData.banner_url,
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

  // Private data for business_insights table
  const privateData = {
    business_stage: formData.business_stage,
    revenue_band: formData.revenue_band,
    business_operating_status: formData.business_operating_status,
    business_age: formData.business_age,
    business_registered: formData.business_registered,
    employs_anyone: formData.employs_anyone,
    employs_family_community: formData.employs_family_community,
    current_funding_source: formData.current_funding_source,
    funding_amount_needed: formData.funding_amount_needed,
    funding_purpose: formData.funding_purpose,
    investment_stage: formData.investment_stage,
    investment_exploration: formData.investment_exploration,
    community_impact_areas: formData.community_impact_areas,
    support_needed_next: formData.support_needed_next,
    current_support_sources: formData.current_support_sources,
    expansion_plans: formData.expansion_plans,
    import_export_status: formData.import_export_status,
    import_countries: formData.import_countries,
    export_countries: formData.export_countries,
    growth_stage: formData.growth_stage,
    top_challenges: formData.top_challenges,
    hiring_intentions: formData.hiring_intentions,
    founder_role: formData.founder_role,
    founder_story: formData.founder_story,
    founder_motivation: formData.founder_motivation,
    gender: formData.gender,
    age_range: formData.age_range,
    based_in_country: formData.based_in_country,
    based_in_city: formData.based_in_city,
    based_in_suburb: formData.based_in_suburb,
    cultural_background: formData.cultural_background,
    family_responsibilities: formData.family_responsibilities,
    goals_next_12_months: formData.goals_next_12_months,
    financial_challenges: formData.financial_challenges,
    goals_next_12_months_array: formData.goals_next_12_months_array,
    goals_details: formData.goals_details,
    collaboration_interest: formData.collaboration_interest,
    mentorship_offering: formData.mentorship_offering,
    open_to_future_contact: formData.open_to_future_contact,
    private_business_phone: formData.private_business_phone,
    private_business_email: formData.private_business_email,
  };

  return { publicData, privateData };
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
    'name', 'business_handle', 'tagline', 'description', 'logo_url', 'banner_url',
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
    'name', 'business_handle', 'tagline', 'description', 'logo_url', 'banner_url',
    'contact_email', 'contact_phone', 'contact_website', 'business_hours',
    'country', 'industry', 'city', 'status', 'is_verified', 'is_claimed', 'is_homepage_featured'
  ];
  
  const result = { ...sanitized };
  disallowedFields.forEach(field => {
    delete result[field];
  });
  
  return result;
};
