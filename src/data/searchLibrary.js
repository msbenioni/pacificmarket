// Master Search Library for PDN
// Based on comprehensive regional and linguistic targeting

export const SEARCH_LIBRARY = [
  // NZ Pasifika - High Priority
  {
    region: 'NZ Pasifika',
    language: 'English',
    query: 'site:.nz "Pacific-owned"',
    priority: 'High',
    source_type: 'Website search',
    expected_signal: 'Strong ownership signal',
    what_to_extract: 'business_name, website, email, ownership_signal, source_url',
    notes: 'Very low-noise'
  },
  {
    region: 'NZ Pasifika',
    language: 'English',
    query: 'site:.nz "Pasifika-owned"',
    priority: 'High',
    source_type: 'Website search',
    expected_signal: 'Strong ownership signal',
    what_to_extract: 'business_name, website, email, ownership_signal, source_url',
    notes: 'Very low-noise'
  },
  {
    region: 'NZ Pasifika',
    language: 'English',
    query: 'site:.nz "Pacific business"',
    priority: 'High',
    source_type: 'Website search',
    expected_signal: 'Medium ownership signal',
    what_to_extract: 'business_name, website, email, source_url',
    notes: 'Broader than owned'
  },
  {
    region: 'NZ Pasifika',
    language: 'English',
    query: 'site:.nz "Pasifika business"',
    priority: 'High',
    source_type: 'Website search',
    expected_signal: 'Medium ownership signal',
    what_to_extract: 'business_name, website, email, source_url',
    notes: 'Broader than owned'
  },
  {
    region: 'NZ Pasifika',
    language: 'English',
    query: 'site:.nz "Pacific founder"',
    priority: 'High',
    source_type: 'Website search',
    expected_signal: 'Founder identity signal',
    what_to_extract: 'business_name, founder_name, website, email, source_url',
    notes: 'Useful for About pages'
  },
  {
    region: 'NZ Pasifika',
    language: 'English',
    query: 'site:.nz "Pasifika founder"',
    priority: 'High',
    source_type: 'Website search',
    expected_signal: 'Founder identity signal',
    what_to_extract: 'business_name, founder_name, website, email, source_url',
    notes: 'Useful for About pages'
  },
  {
    region: 'NZ Pasifika',
    language: 'English',
    query: 'site:.nz ("about us" OR "our story" OR "about") ("Pacific" OR "Pasifika")',
    priority: 'High',
    source_type: 'Website search',
    expected_signal: 'Identity on About page',
    what_to_extract: 'business_name, website, email, ownership_signal, source_url',
    notes: 'Strong for hidden businesses'
  },
  {
    region: 'NZ Pasifika',
    language: 'English',
    query: 'site:.nz ("founded by" OR "who we are") ("Pacific" OR "Pasifika")',
    priority: 'High',
    source_type: 'Website search',
    expected_signal: 'Founder/story signal',
    what_to_extract: 'business_name, founder_name, website, source_url',
    notes: 'Use when home page doesn\'t show identity'
  },
  {
    region: 'NZ Pasifika',
    language: 'English',
    query: 'site:.nz "Samoan-owned"',
    priority: 'High',
    source_type: 'Website search',
    expected_signal: 'Strong ethnicity signal',
    what_to_extract: 'business_name, website, email, ownership_signal, source_url',
    notes: 'Repeat for all ethnicities'
  },
  {
    region: 'NZ Pasifika',
    language: 'English',
    query: 'site:.nz "Tongan-owned"',
    priority: 'High',
    source_type: 'Website search',
    expected_signal: 'Strong ethnicity signal',
    what_to_extract: 'business_name, website, email, ownership_signal, source_url',
    notes: 'Repeat for all ethnicities'
  },
  {
    region: 'NZ Pasifika',
    language: 'English',
    query: 'site:.nz "Cook Islands-owned"',
    priority: 'High',
    source_type: 'Website search',
    expected_signal: 'Strong ethnicity signal',
    what_to_extract: 'business_name, website, email, ownership_signal, source_url',
    notes: 'High value for PDN'
  },
  {
    region: 'NZ Pasifika',
    language: 'English',
    query: 'site:.nz "Niuean-owned"',
    priority: 'High',
    source_type: 'Website search',
    expected_signal: 'Strong ethnicity signal',
    what_to_extract: 'business_name, website, email, ownership_signal, source_url',
    notes: 'High value for PDN'
  },
  {
    region: 'NZ Pasifika',
    language: 'English',
    query: 'site:.nz "Fijian-owned"',
    priority: 'High',
    source_type: 'Website search',
    expected_signal: 'Strong ethnicity signal',
    what_to_extract: 'business_name, website, email, ownership_signal, source_url',
    notes: 'Useful for filtering'
  },
  {
    region: 'NZ Pasifika',
    language: 'English',
    query: 'site:.nz "Tokelauan-owned"',
    priority: 'Medium',
    source_type: 'Website search',
    expected_signal: 'Strong ethnicity signal',
    what_to_extract: 'business_name, website, email, ownership_signal, source_url',
    notes: 'Lower volume'
  },
  {
    region: 'NZ Pasifika',
    language: 'English',
    query: 'site:.nz "Tuvaluan-owned"',
    priority: 'Medium',
    source_type: 'Website search',
    expected_signal: 'Strong ethnicity signal',
    what_to_extract: 'business_name, website, email, ownership_signal, source_url',
    notes: 'Lower volume'
  },
  {
    region: 'NZ Pasifika',
    language: 'English',
    query: 'site:.nz "Kiribati-owned"',
    priority: 'Medium',
    source_type: 'Website search',
    expected_signal: 'Strong ethnicity signal',
    what_to_extract: 'business_name, website, email, ownership_signal, source_url',
    notes: 'Lower volume'
  },
  {
    region: 'NZ Pasifika',
    language: 'English',
    query: 'site:pacificbusiness.co.nz business',
    priority: 'High',
    source_type: 'Directory/source search',
    expected_signal: 'Directory lead',
    what_to_extract: 'business_name, website, email, source_url',
    notes: 'Seed source'
  },
  {
    region: 'NZ Pasifika',
    language: 'English',
    query: 'site:pacificbusiness.co.nz entrepreneur',
    priority: 'High',
    source_type: 'Directory/source search',
    expected_signal: 'Directory lead',
    what_to_extract: 'business_name, website, email, source_url',
    notes: 'Seed source'
  },
  {
    region: 'NZ Pasifika',
    language: 'English',
    query: 'site:amotai.nz supplier Pasifika',
    priority: 'High',
    source_type: 'Directory/source search',
    expected_signal: 'Supplier directory signal',
    what_to_extract: 'business_name, website, email, source_url',
    notes: 'Strong structured source'
  },
  {
    region: 'NZ Pasifika',
    language: 'English',
    query: 'site:amotai.nz supplier Pacific',
    priority: 'High',
    source_type: 'Directory/source search',
    expected_signal: 'Supplier directory signal',
    what_to_extract: 'business_name, website, email, source_url',
    notes: 'Good fallback'
  },

  // NZ Māori - High Priority
  {
    region: 'NZ Māori',
    language: 'English/Māori',
    query: 'site:.nz "Māori-owned"',
    priority: 'High',
    source_type: 'Website search',
    expected_signal: 'Strong ownership signal',
    what_to_extract: 'business_name, website, email, ownership_signal, source_url',
    notes: 'Top Māori search'
  },
  {
    region: 'NZ Māori',
    language: 'English/Māori',
    query: 'site:.nz "Maori-owned"',
    priority: 'High',
    source_type: 'Website search',
    expected_signal: 'Strong ownership signal',
    what_to_extract: 'business_name, website, email, ownership_signal, source_url',
    notes: 'Needed without macron'
  },
  {
    region: 'NZ Māori',
    language: 'English/Māori',
    query: 'site:.nz "pakihi Māori"',
    priority: 'High',
    source_type: 'Website search',
    expected_signal: 'Strong Māori business signal',
    what_to_extract: 'business_name, website, email, ownership_signal, source_url',
    notes: 'Strong cultural signal'
  },
  {
    region: 'NZ Māori',
    language: 'English/Māori',
    query: 'site:.nz "iwi-owned"',
    priority: 'High',
    source_type: 'Website search',
    expected_signal: 'Ownership/community signal',
    what_to_extract: 'business_name, website, email, ownership_signal, source_url',
    notes: 'Useful for collectives'
  },
  {
    region: 'NZ Māori',
    language: 'English/Māori',
    query: 'site:.nz "whānau business"',
    priority: 'Medium',
    source_type: 'Website search',
    expected_signal: 'Community/family signal',
    what_to_extract: 'business_name, website, email, source_url',
    notes: 'Can be noisy'
  },
  {
    region: 'NZ Māori',
    language: 'English/Māori',
    query: 'site:.nz "whanau business"',
    priority: 'Medium',
    source_type: 'Website search',
    expected_signal: 'Community/family signal',
    what_to_extract: 'business_name, website, email, source_url',
    notes: 'No-macron fallback'
  },
  {
    region: 'NZ Māori',
    language: 'English/Māori',
    query: 'site:.nz "kaupapa Māori"',
    priority: 'High',
    source_type: 'Website search',
    expected_signal: 'Cultural identity signal',
    what_to_extract: 'business_name, website, email, source_url',
    notes: 'Strong about-page keyword'
  },
  {
    region: 'NZ Māori',
    language: 'English/Māori',
    query: 'site:.nz "kaupapa Maori"',
    priority: 'High',
    source_type: 'Website search',
    expected_signal: 'Cultural identity signal',
    what_to_extract: 'business_name, website, email, source_url',
    notes: 'No-macron fallback'
  },
  {
    region: 'NZ Māori',
    language: 'English/Māori',
    query: 'site:.nz ("about us" OR "our story") ("Māori" OR "Maori" OR "whakapapa")',
    priority: 'High',
    source_type: 'Website search',
    expected_signal: 'Identity on story page',
    what_to_extract: 'business_name, website, email, ownership_signal, source_url',
    notes: 'Best hidden-business query'
  },
  {
    region: 'NZ Māori',
    language: 'English/Māori',
    query: 'site:amotai.nz supplier Māori',
    priority: 'High',
    source_type: 'Directory/source search',
    expected_signal: 'Supplier directory signal',
    what_to_extract: 'business_name, website, email, source_url',
    notes: 'Structured directory'
  },
  {
    region: 'NZ Māori',
    language: 'English/Māori',
    query: 'site:amotai.nz supplier Maori',
    priority: 'High',
    source_type: 'Directory/source search',
    expected_signal: 'Supplier directory signal',
    what_to_extract: 'business_name, website, email, source_url',
    notes: 'Fallback spelling'
  },

  // Hawaiʻi - High Priority
  {
    region: 'Hawaiʻi',
    language: 'English',
    query: 'site:nativehawaiianchamberofcommerce.org directory',
    priority: 'High',
    source_type: 'Directory/source search',
    expected_signal: 'Directory member signal',
    what_to_extract: 'business_name, website, email, source_url',
    notes: 'Top Hawaiʻi source'
  },
  {
    region: 'Hawaiʻi',
    language: 'English',
    query: 'site:nativehawaiianchamberofcommerce.org business',
    priority: 'High',
    source_type: 'Directory/source search',
    expected_signal: 'Directory member signal',
    what_to_extract: 'business_name, website, email, source_url',
    notes: 'Top Hawaiʻi source'
  },
  {
    region: 'Hawaiʻi',
    language: 'English',
    query: 'site:.org "Native Hawaiian business"',
    priority: 'High',
    source_type: 'Website search',
    expected_signal: 'Strong indigenous identity signal',
    what_to_extract: 'business_name, website, email, ownership_signal, source_url',
    notes: 'Good discovery'
  },
  {
    region: 'Hawaiʻi',
    language: 'English',
    query: 'site:.org "Native Hawaiian-owned business"',
    priority: 'High',
    source_type: 'Website search',
    expected_signal: 'Strong indigenous ownership signal',
    what_to_extract: 'business_name, website, email, ownership_signal, source_url',
    notes: 'Low-noise'
  },
  {
    region: 'Hawaiʻi',
    language: 'English',
    query: 'site:.com "Native Hawaiian-owned"',
    priority: 'High',
    source_type: 'Website search',
    expected_signal: 'Strong indigenous ownership signal',
    what_to_extract: 'business_name, website, email, ownership_signal, source_url',
    notes: 'Broadens coverage'
  },
  {
    region: 'Hawaiʻi',
    language: 'English',
    query: 'site:.com "Hawaiian-owned business"',
    priority: 'High',
    source_type: 'Website search',
    expected_signal: 'Ownership signal',
    what_to_extract: 'business_name, website, email, ownership_signal, source_url',
    notes: 'May catch tourism noise'
  },
  {
    region: 'Hawaiʻi',
    language: 'English',
    query: 'site:.org "Kanaka Maoli business"',
    priority: 'Medium',
    source_type: 'Website search',
    expected_signal: 'Cultural identity signal',
    what_to_extract: 'business_name, website, email, ownership_signal, source_url',
    notes: 'Lower volume, valuable'
  },
  {
    region: 'Hawaiʻi',
    language: 'English',
    query: '"Honolulu" "Native Hawaiian business"',
    priority: 'Medium',
    source_type: 'Location search',
    expected_signal: 'Location + identity',
    what_to_extract: 'business_name, website, email, source_url',
    notes: 'Use city variants'
  },
  {
    region: 'Hawaiʻi',
    language: 'English',
    query: '"Maui" "Hawaiian-owned business"',
    priority: 'Medium',
    source_type: 'Location search',
    expected_signal: 'Location + identity',
    what_to_extract: 'business_name, website, email, source_url',
    notes: 'Use island variants'
  },

  // PNG - High Priority
  {
    region: 'PNG',
    language: 'English',
    query: 'site:pomcci.org.pg "business directory"',
    priority: 'High',
    source_type: 'Directory/source search',
    expected_signal: 'Chamber member signal',
    what_to_extract: 'business_name, website, email, source_url',
    notes: 'Top PNG source'
  },
  {
    region: 'PNG',
    language: 'English',
    query: 'site:pomcci.org.pg member',
    priority: 'High',
    source_type: 'Directory/source search',
    expected_signal: 'Chamber member signal',
    what_to_extract: 'business_name, website, email, source_url',
    notes: 'Structured source'
  },
  {
    region: 'PNG',
    language: 'English',
    query: '"Papua New Guinea" "business directory"',
    priority: 'High',
    source_type: 'Directory search',
    expected_signal: 'Directory signal',
    what_to_extract: 'business_name, website, email, source_url',
    notes: 'Broad discovery'
  },
  {
    region: 'PNG',
    language: 'English',
    query: '"Papua New Guinea" "member directory"',
    priority: 'High',
    source_type: 'Directory search',
    expected_signal: 'Directory signal',
    what_to_extract: 'business_name, website, email, source_url',
    notes: 'Good for chambers'
  },
  {
    region: 'PNG',
    language: 'English',
    query: '"PNG" "business directory"',
    priority: 'Medium',
    source_type: 'Directory search',
    expected_signal: 'Directory signal',
    what_to_extract: 'business_name, website, email, source_url',
    notes: 'Can be noisy'
  },
  {
    region: 'PNG',
    language: 'English',
    query: 'site:.pg "business directory"',
    priority: 'High',
    source_type: 'Website/domain search',
    expected_signal: 'Local domain signal',
    what_to_extract: 'business_name, website, email, source_url',
    notes: 'Country-specific'
  },

  // Pacific Islands - High Priority
  {
    region: 'Pacific Islands',
    language: 'English',
    query: 'site:pipso.org.fj chamber',
    priority: 'High',
    source_type: 'Regional source search',
    expected_signal: 'Regional chamber signal',
    what_to_extract: 'organisation_name, member_businesses, source_url',
    notes: 'Use as chamber map'
  },
  {
    region: 'Pacific Islands',
    language: 'English',
    query: '"Samoa" "business directory"',
    priority: 'High',
    source_type: 'Directory search',
    expected_signal: 'Country directory signal',
    what_to_extract: 'business_name, website, email, source_url',
    notes: 'Start with directory'
  },
  {
    region: 'Pacific Islands',
    language: 'English',
    query: '"Samoa" "member directory"',
    priority: 'High',
    source_type: 'Directory search',
    expected_signal: 'Country directory signal',
    what_to_extract: 'business_name, website, email, source_url',
    notes: 'Useful for chambers'
  },
  {
    region: 'Pacific Islands',
    language: 'English',
    query: '"Samoa" "chamber members"',
    priority: 'High',
    source_type: 'Directory search',
    expected_signal: 'Country chamber signal',
    what_to_extract: 'business_name, website, email, source_url',
    notes: 'Chamber-led'
  },
  {
    region: 'Pacific Islands',
    language: 'English',
    query: '"Tonga" "business directory"',
    priority: 'High',
    source_type: 'Directory search',
    expected_signal: 'Country directory signal',
    what_to_extract: 'business_name, website, email, source_url',
    notes: 'Core query'
  },
  {
    region: 'Pacific Islands',
    language: 'English',
    query: '"Tonga" "member directory"',
    priority: 'High',
    source_type: 'Directory search',
    expected_signal: 'Country directory signal',
    what_to_extract: 'business_name, website, email, source_url',
    notes: 'Core query'
  },
  {
    region: 'Pacific Islands',
    language: 'English',
    query: '"Cook Islands" "business directory"',
    priority: 'High',
    source_type: 'Directory search',
    expected_signal: 'Country directory signal',
    what_to_extract: 'business_name, website, email, source_url',
    notes: 'High PDN relevance'
  },
  {
    region: 'Pacific Islands',
    language: 'English',
    query: '"Cook Islands" "chamber of commerce"',
    priority: 'High',
    source_type: 'Directory search',
    expected_signal: 'Chamber signal',
    what_to_extract: 'business_name, website, email, source_url',
    notes: 'High PDN relevance'
  },
  {
    region: 'Pacific Islands',
    language: 'English',
    query: '"Fiji" "business directory"',
    priority: 'High',
    source_type: 'Directory search',
    expected_signal: 'Country directory signal',
    what_to_extract: 'business_name, website, email, source_url',
    notes: 'High volume'
  },
  {
    region: 'Pacific Islands',
    language: 'English',
    query: '"Fiji" "commerce members"',
    priority: 'Medium',
    source_type: 'Directory search',
    expected_signal: 'Member signal',
    what_to_extract: 'business_name, website, email, source_url',
    notes: 'Alternative source wording'
  },
  {
    region: 'Pacific Islands',
    language: 'English',
    query: '"Solomon Islands" "business directory"',
    priority: 'High',
    source_type: 'Directory search',
    expected_signal: 'Country directory signal',
    what_to_extract: 'business_name, website, email, source_url',
    notes: 'Useful chamber discovery'
  },
  {
    region: 'Pacific Islands',
    language: 'English',
    query: '"Niue" "chamber of commerce"',
    priority: 'Medium',
    source_type: 'Directory search',
    expected_signal: 'Chamber signal',
    what_to_extract: 'business_name, website, email, source_url',
    notes: 'Lower volume'
  },
  {
    region: 'Pacific Islands',
    language: 'English',
    query: '"Kiribati" "business directory"',
    priority: 'Medium',
    source_type: 'Directory search',
    expected_signal: 'Country directory signal',
    what_to_extract: 'business_name, website, email, source_url',
    notes: 'Smaller market'
  },
  {
    region: 'Pacific Islands',
    language: 'English',
    query: '"Tuvalu" "business directory"',
    priority: 'Medium',
    source_type: 'Directory search',
    expected_signal: 'Country directory signal',
    what_to_extract: 'business_name, website, email, source_url',
    notes: 'Smaller market'
  },
  {
    region: 'Pacific Islands',
    language: 'English',
    query: '"Vanuatu" "business directory"',
    priority: 'Medium',
    source_type: 'Directory search',
    expected_signal: 'Country directory signal',
    what_to_extract: 'business_name, website, email, source_url',
    notes: 'Useful expansion'
  }
];

// Priority tiers for execution order
export const PRIORITY_TIERS = {
  'High': 1,
  'Medium': 2,
  'Low': 3
};

// Get queries by region and priority
export function getQueriesByRegion(region, maxPriority = 'High') {
  const maxPriorityLevel = PRIORITY_TIERS[maxPriority];
  return SEARCH_LIBRARY
    .filter(query => query.region === region)
    .filter(query => PRIORITY_TIERS[query.priority] <= maxPriorityLevel)
    .sort((a, b) => PRIORITY_TIERS[a.priority] - PRIORITY_TIERS[b.priority]);
}

// Get all high-priority queries
export function getHighPriorityQueries() {
  return SEARCH_LIBRARY.filter(query => query.priority === 'High');
}

// Get queries by source type
export function getQueriesBySourceType(sourceType) {
  return SEARCH_LIBRARY.filter(query => query.source_type === sourceType);
}

// Confidence scoring rules
export const CONFIDENCE_RULES = {
  High: 'business explicitly says Pacific-owned, Pasifika-owned, Māori-owned, Native Hawaiian-owned, entreprise polynésienne, société calédonienne',
  Medium: 'identity is inferred from About page, founder bio, chamber/supplier directory',
  Low: 'only location suggests relevance, but no direct ownership/identity wording found'
};

// Extraction field mapping
export const EXTRACTION_FIELDS = [
  'business_name',
  'country_or_region',
  'source_url',
  'source_type',
  'website',
  'email',
  'phone',
  'instagram_handle',
  'facebook_handle',
  'linkedin_url',
  'ownership_signal',
  'language',
  'confidence_level',
  'notes'
];

// Regional groups for batch processing
export const REGIONAL_GROUPS = [
  'NZ Pasifika',
  'NZ Māori', 
  'Hawaiʻi',
  'Pacific Islands',
  'PNG',
  'French Pacific'
];
