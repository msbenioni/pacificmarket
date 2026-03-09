// Unified Constants for Pacific Market
// Single source of truth for all countries and industries

export const COUNTRIES = [
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

  // Major Global Economies - Where Pacific-owned businesses operate
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
  { value: 'south-korea', label: 'South Korea' },
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

export const INDUSTRIES = [
  { value: 'agriculture', label: 'Agriculture/Fishing' },
  { value: 'arts_crafts', label: 'Arts & Crafts' },
  { value: 'beauty_personal_care', label: 'Beauty & Personal Care' },
  { value: 'books_publishing', label: 'Books & Publishing' },
  { value: 'clothing_fashion', label: 'Clothing & Fashion' },
  { value: 'coaching_business_personal', label: 'Coaching (Business & Personal)' },
  { value: 'construction_trade', label: 'Construction & Trade' },
  { value: 'digital_it_technology', label: 'Digital & IT Technology' },
  { value: 'education_training', label: 'Education & Training' },
  { value: 'fashion_accessories', label: 'Fashion Accessories' },
  { value: 'finance_insurance', label: 'Finance & Insurance' },
  { value: 'food_beverage', label: 'Food & Beverage' },
  { value: 'health_wellness', label: 'Health & Wellness' },
  { value: 'hospitality', label: 'Hospitality' },
  { value: 'import_export', label: 'Import/Export' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'media_entertainment', label: 'Media & Entertainment' },
  { value: 'nonprofit', label: 'Nonprofit' },
  { value: 'professional_services', label: 'Professional Services' },
  { value: 'retail', label: 'Retail' },
  { value: 'technology', label: 'Technology' },
  { value: 'transport_logistics', label: 'Transport & Logistics' },
  { value: 'travel_tourism', label: 'Travel & Tourism' },
  { value: 'other', label: 'Other' }
];

// Business constants
export const BUSINESS_STATUS = {
  ACTIVE: 'active',
  PENDING: 'pending',
  REJECTED: 'rejected',
};

export const BUSINESS_TIER = {
  VAKA: 'vaka',
  MANA: 'mana', 
  MOANA: 'moana',
};

export const getTierDisplayName = (tier) => {
  const displayNames = {
    'vaka': 'Vaka',
    'mana': 'Mana',
    'moana': 'Moana',
  };
  return displayNames[tier] || tier;
};

export const BUSINESS_SOURCE = {
  USER: 'user',
  ADMIN: 'admin',
  IMPORT: 'import',
  CLAIM: 'claim',
};

export const TEAM_SIZE_BAND = [
  { value: 'solo', label: 'Just me (1 person)' },
  { value: '2-5', label: '2-5 people' },
  { value: '6-10', label: '6-10 people' },
  { value: '11-50', label: '11-50 people' },
  { value: '51+', label: '51+ people' },
];

export const BUSINESS_STAGE = [
  { value: 'idea', label: 'Idea/Concept' },
  { value: 'startup', label: 'Startup/Launch' },
  { value: 'growth', label: 'Growth/Scaling' },
  { value: 'mature', label: 'Mature/Established' },
];

export const IMPORT_EXPORT_STATUS = {
  NONE: 'none',
  IMPORT_ONLY: 'import_only',
  EXPORT_ONLY: 'export_only',
  BOTH: 'both',
};

// Business operations constants
export const BUSINESS_OPERATING_STATUS = [
  { value: 'planning', label: 'Planning' },
  { value: 'operating', label: 'Operating' },
  { value: 'paused', label: 'Paused' },
  { value: 'closed', label: 'Closed' },
];

export const SALES_CHANNELS = [
  { value: 'online', label: 'Online/E-commerce' },
  { value: 'retail', label: 'Retail Store' },
  { value: 'market', label: 'Market/Stall' },
  { value: 'direct', label: 'Direct to Customer' },
  { value: 'wholesale', label: 'Wholesale' },
  { value: 'export', label: 'Export' },
  { value: 'services', label: 'Services' },
  { value: 'other', label: 'Other' },
];

export const REVENUE_BAND = [
  { value: '0-10k', label: 'Under $10,000' },
  { value: '10k-25k', label: '$10,000 - $25,000' },
  { value: '25k-50k', label: '$25,000 - $50,000' },
  { value: '50k-100k', label: '$50,000 - $100,000' },
  { value: '100k-250k', label: '$100,000 - $250,000' },
  { value: '250k+', label: '$250,000+' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
];

// Financial & Investment constants
export const FUNDING_SOURCES = [
  { value: 'personal-savings', label: 'Personal savings' },
  { value: 'family-friends', label: 'Family and friends' },
  { value: 'bank-loan', label: 'Bank loan' },
  { value: 'government-grant', label: 'Government grant' },
  { value: 'angel-investor', label: 'Angel investor' },
  { value: 'venture-capital', label: 'Venture capital' },
  { value: 'crowdfunding', label: 'Crowdfunding' },
  { value: 'revenue-profit', label: 'Revenue/profit reinvested' },
  { value: 'no-funding', label: 'No external funding' },
  { value: 'other', label: 'Other' },
];

export const FUNDING_AMOUNTS = [
  { value: '0-5k', label: 'Under $5,000' },
  { value: '5k-10k', label: '$5,000 - $10,000' },
  { value: '10k-25k', label: '$10,000 - $25,000' },
  { value: '25k-50k', label: '$25,000 - $50,000' },
  { value: '50k-100k', label: '$50,000 - $100,000' },
  { value: '100k-250k', label: '$100,000 - $250,000' },
  { value: '250k-500k', label: '$250,000 - $500,000' },
  { value: '500k-1m', label: '$500,000 - $1,000,000' },
  { value: '1m+', label: '$1,000,000+' },
  { value: 'not-sure', label: 'Not sure yet' },
];

export const FUNDING_PURPOSES = [
  { value: 'product-development', label: 'Product development/R&D' },
  { value: 'marketing-sales', label: 'Marketing and sales' },
  { value: 'hiring-staff', label: 'Hiring staff' },
  { value: 'equipment-assets', label: 'Equipment and assets' },
  { value: 'operations-expansion', label: 'Operations expansion' },
  { value: 'working-capital', label: 'Working capital' },
  { value: 'debt-consolidation', label: 'Debt consolidation' },
  { value: 'international-expansion', label: 'International expansion' },
  { value: 'technology-upgrade', label: 'Technology upgrade' },
  { value: 'other', label: 'Other' },
];

export const INVESTMENT_STAGES = [
  { value: 'pre-seed', label: 'Pre-seed (idea stage)' },
  { value: 'seed', label: 'Seed (early development)' },
  { value: 'early-stage', label: 'Early stage (product launched)' },
  { value: 'growth-stage', label: 'Growth stage (scaling)' },
  { value: 'established', label: 'Established (mature business)' },
  { value: 'not-seeking', label: 'Not seeking investment' },
];

export const INVESTMENT_EXPLORATION = [
  { value: 'actively-seeking', label: 'Actively seeking investment now' },
  { value: 'exploring-options', label: 'Exploring investment options' },
  { value: 'considering-future', label: 'Considering for future (6+ months)' },
  { value: 'researching-only', label: 'Just researching, not ready to engage' },
  { value: 'not-interested', label: 'Not interested in investment' },
  { value: 'not-sure', label: 'Not sure about investment' },
];

export const INVESTMENT_TIMELINE = [
  { value: 'immediate', label: 'Immediate (next 1-3 months)' },
  { value: 'short-term', label: 'Short term (3-6 months)' },
  { value: 'medium-term', label: 'Medium term (6-12 months)' },
  { value: 'long-term', label: 'Long term (1-2 years)' },
  { value: 'beyond-2-years', label: 'Beyond 2 years' },
  { value: 'no-timeline', label: 'No specific timeline' },
];

export const ANGEL_INVESTOR_INTEREST = [
  { value: 'actively-investing', label: 'Actively investing in Pacific businesses' },
  { value: 'considering-future', label: 'Considering investing in future (6+ months)' },
  { value: 'exploring-options', label: 'Exploring angel investing options' },
  { value: 'interested-learning', label: 'Interested in learning more first' },
  { value: 'not-interested', label: 'Not interested in investing' },
  { value: 'already-investing', label: 'Already investing in other businesses' },
];

export const INVESTOR_CAPACITY = [
  { value: 'under-5k', label: 'Under $5,000 per investment' },
  { value: '5k-25k', label: '$5,000 - $25,000 per investment' },
  { value: '25k-100k', label: '$25,000 - $100,000 per investment' },
  { value: '100k-500k', label: '$100,000 - $500,000 per investment' },
  { value: '500k+', label: '$500,000+ per investment' },
  { value: 'varies', label: 'Varies by opportunity' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
];

export const REVENUE_STREAMS = [
  { value: 'product-sales', label: 'Product sales' },
  { value: 'service-fees', label: 'Service fees' },
  { value: 'subscription', label: 'Subscription/recurring' },
  { value: 'consulting', label: 'Consulting/advisory' },
  { value: 'licensing', label: 'Licensing royalties' },
  { value: 'advertising', label: 'Advertising/sponsorship' },
  { value: 'commission', label: 'Commission/referral' },
  { value: 'rental', label: 'Rental/leasing' },
  { value: 'other', label: 'Other' },
];

// Founder Insights constants
export const FOUNDER_MOTIVATIONS = [
  { value: 'financial_independence', label: 'Financial independence' },
  { value: 'family_opportunities', label: 'Creating opportunities for family' },
  { value: 'serving_community', label: 'Serving community' },
  { value: 'preserving_culture', label: 'Preserving culture' },
  { value: 'solving_problem', label: 'Solving a problem' },
  { value: 'building_wealth', label: 'Building wealth' },
  { value: 'creative_freedom', label: 'Creative freedom' },
  { value: 'legacy_building', label: 'Legacy building' },
  { value: 'other', label: 'Other' },
];

export const BUSINESS_CHALLENGES = [
  { value: 'access_funding', label: 'Access to funding' },
  { value: 'finding_customers', label: 'Finding customers' },
  { value: 'pricing_sales', label: 'Pricing and sales' },
  { value: 'marketing_visibility', label: 'Marketing and visibility' },
  { value: 'time_workload', label: 'Time and workload' },
  { value: 'family_community_obligations', label: 'Balancing family/community obligations' },
  { value: 'admin_compliance', label: 'Admin and compliance' },
  { value: 'hiring_staffing', label: 'Hiring and staffing' },
  { value: 'digital_tools', label: 'Digital tools and systems' },
  { value: 'confidence_growth', label: 'Confidence in growth planning' },
  { value: 'shipping_costs', label: 'Shipping or supply costs' },
  { value: 'small_market', label: 'Small market size' },
  { value: 'limited_support', label: 'Limited trusted support' },
  { value: 'cultural_barriers', label: 'Cultural barriers in business' },
  { value: 'geographic_isolation', label: 'Geographic isolation' },
  { value: 'other', label: 'Other' },
];

export const SUPPORT_NEEDS = [
  { value: 'funding_grants', label: 'Funding or grants' },
  { value: 'mentoring', label: 'Mentoring' },
  { value: 'marketing_support', label: 'Marketing support' },
  { value: 'digital_support', label: 'Website or digital support' },
  { value: 'bookkeeping_help', label: 'Bookkeeping or finance help' },
  { value: 'legal_help', label: 'Legal or compliance help' },
  { value: 'business_planning', label: 'Business planning' },
  { value: 'export_scaling', label: 'Export or scaling support' },
  { value: 'networking', label: 'Networking opportunities' },
  { value: 'training_programs', label: 'Training programs' },
  { value: 'community_connections', label: 'Community connections' },
  { value: 'confidence_accountability', label: 'Confidence and accountability' },
  { value: 'other', label: 'Other' },
];

export const GOALS_NEXT_12_MONTHS = [
  { value: 'grow_revenue', label: 'Grow revenue' },
  { value: 'get_customers', label: 'Get more customers' },
  { value: 'strengthen_systems', label: 'Strengthen systems and processes' },
  { value: 'improve_digital', label: 'Improve digital presence' },
  { value: 'launch_products', label: 'Launch new products or services' },
  { value: 'hire_staff', label: 'Hire staff' },
  { value: 'expand_markets', label: 'Expand to new markets' },
  { value: 'secure_funding', label: 'Secure funding' },
  { value: 'build_visibility', label: 'Build brand visibility' },
  { value: 'community_impact', label: 'Create more community impact' },
  { value: 'other', label: 'Other' },
];

export const COMMUNITY_IMPACT_AREAS = [
  { value: 'family_income', label: 'Creates income for family' },
  { value: 'creates_jobs', label: 'Creates jobs' },
  { value: 'pacific_visibility', label: 'Supports Pacific visibility' },
  { value: 'preserves_culture', label: 'Preserves culture' },
  { value: 'community_role_model', label: 'Role model for youth' },
  { value: 'knowledge_sharing', label: 'Knowledge sharing' },
  { value: 'local_economy', label: 'Strengthens local economy' },
  { value: 'other', label: 'Other' }
];

export const FAMILY_RESPONSIBILITIES = [
  { value: 'children', label: 'Children (under 18)' },
  { value: 'eldercare', label: 'Elderly parents/grandparents care' },
  { value: 'extended_family', label: 'Extended family support' },
  { value: 'community_leadership', label: 'Community leadership roles' },
  { value: 'cultural_obligations', label: 'Cultural/religious obligations' },
  { value: 'family_business', label: 'Family business duties' },
  { value: 'caregiving', label: 'Other caregiving responsibilities' },
  { value: 'none', label: 'No additional family commitments' }
];

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non_binary', label: 'Non-binary' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' }
];

export const AGE_RANGES = [
  { value: '18-24', label: '18-24' },
  { value: '25-34', label: '25-34' },
  { value: '35-44', label: '35-44' },
  { value: '45-54', label: '45-54' },
  { value: '55-64', label: '55-64' },
  { value: '65+', label: '65+' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' }
];

// Helper functions to get display names from values
export const getCountryDisplayName = (value) => {
  const country = COUNTRIES.find(c => c.value === value);
  return country ? country.label : value;
};

export const getIndustryDisplayName = (value) => {
  const industry = INDUSTRIES.find(i => i.value === value);
  return industry ? industry.label : value;
};
