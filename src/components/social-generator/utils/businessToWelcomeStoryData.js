/**
 * Maps business data to welcome story slide data
 * Transforms raw business data into structured content for 4-slide welcome story
 */

export function businessToWelcomeStoryData(business) {
  if (!business) {
    return getEmptyWelcomeStoryData();
  }

  // Extract and process business images
  const images = extractBusinessImages(business);
  
  return {
    // Core business info
    businessName: business.business_name || '',
    industry: business.industry || '',
    location: formatLocation(business),
    logoUrl: business.logo_url || '',
    
    // Images for slides
    selectedImages: images.slice(0, 4), // Max 4 images
    
    // Content for slides
    shortDescription: extractShortDescription(business),
    highlights: extractHighlights(business),
    culturalIdentityStory: business.cultural_identity || '',
    founderStory: business.founder_story || '',
    
    // CTA content
    ctaText: 'Discover the full story on Pacific Discovery Network',
    pdnUrl: `https://pacificdiscovery.network/businesses/${business.id}`,
    
    // Visual settings
    accentColor: '#0a1628', // Default navy
    backgroundTheme: 'clean', // Default theme
    
    // Metadata
    businessId: business.id,
    createdAt: new Date().toISOString()
  };
}

/**
 * Extract available images from business data
 */
function extractBusinessImages(_business) {
  // Cover images are uploaded manually — only the logo is auto-loaded via logoUrl.
  // This function no longer auto-populates selectedImages with banners.
  return [];
}

/**
 * Extract short description for overview slide
 */
function extractShortDescription(business) {
  // Try different description fields in order of preference
  const description = business.description || 
                     business.tagline || 
                     business.business_description || '';
  
  // Return first sentence or truncated version
  if (description) {
    const firstSentence = description.split('.')[0];
    return firstSentence.length > 150 ? 
           firstSentence.substring(0, 147) + '...' : 
           firstSentence + (description.includes('.') ? '.' : '');
  }
  
  return `A ${business.industry || 'business'} from ${business.city || 'the Pacific'}`;
}

/**
 * Extract highlights for overview slide
 */
function extractHighlights(business) {
  const highlights = [];
  
  // Add industry if available
  if (business.industry) {
    highlights.push({
      type: 'industry',
      text: business.industry,
      icon: 'briefcase'
    });
  }
  
  // Add location
  const location = formatLocation(business);
  if (location) {
    highlights.push({
      type: 'location',
      text: location,
      icon: 'map-pin'
    });
  }
  
  // Add languages spoken (guard against non-array values)
  if (Array.isArray(business.languages_spoken) && business.languages_spoken.length > 0) {
    highlights.push({
      type: 'languages',
      text: business.languages_spoken.slice(0, 2).join(', '),
      icon: 'globe'
    });
  }
  
  // Add business registration status
  if (business.is_business_registered) {
    highlights.push({
      type: 'registered',
      text: 'Registered Business',
      icon: 'check-circle'
    });
  }
  
  return highlights.slice(0, 4); // Max 4 highlights
}

/**
 * Format location string
 */
function formatLocation(business) {
  const parts = [business.city, business.country].filter(Boolean);
  return parts.join(', ');
}

/**
 * Get empty welcome story data structure
 */
function getEmptyWelcomeStoryData() {
  return {
    businessName: '',
    industry: '',
    location: '',
    logoUrl: '',
    selectedImages: [],
    shortDescription: '',
    highlights: [],
    culturalIdentityStory: '',
    founderStory: '',
    ctaText: 'Discover the full story on Pacific Discovery Network',
    pdnUrl: 'https://pacificdiscovery.network',
    accentColor: '#0a1628',
    backgroundTheme: 'clean',
    businessId: '',
    createdAt: new Date().toISOString()
  };
}

/**
 * Validate welcome story data
 */
export function validateWelcomeStoryData(data) {
  const errors = [];
  
  if (!data.businessName?.trim()) {
    errors.push('Business name is required');
  }
  
  if (!data.shortDescription?.trim()) {
    errors.push('Short description is required');
  }
  
  if (data.shortDescription?.length > 200) {
    errors.push('Short description must be 200 characters or less');
  }
  
  if (!data.selectedImages || data.selectedImages.length === 0) {
    errors.push('At least one image is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
