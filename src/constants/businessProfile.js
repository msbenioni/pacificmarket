// Business Profile Setup Configuration
// Enterprise-focused profile for Pacific Market

import { COUNTRIES, INDUSTRIES } from './unifiedConstants';

export const BUSINESS_PROFILE_STEPS = [
  {
    id: 'business-identity',
    title: 'Step 1 — Business Identity',
    subtitle: 'Business Identity',
    purpose: 'Define the enterprise and how it appears in the registry',
    fields: [
      {
        id: 'name',
        label: 'Business name',
        type: 'text',
        required: true,
        placeholder: 'Enter your business name',
        description: 'The official name of your business',
        maxLength: 200
      },
      {
        id: 'description',
        label: 'Business description',
        type: 'textarea',
        required: true,
        placeholder: 'Describe what your business does...',
        description: 'A clear description of your products, services, or mission',
        maxLength: 1000,
        rows: 15
      },
      {
        id: 'industry',
        label: 'Industry',
        type: 'select',
        required: true,
        placeholder: 'Select your industry',
        description: 'Primary industry for your business',
        options: INDUSTRIES
      },
      {
        id: 'year_founded',
        label: 'Year founded',
        type: 'number',
        required: true,
        placeholder: '2020',
        description: 'When was your business established?',
        min: 1900,
        max: new Date().getFullYear()
      },
      {
        id: 'website',
        label: 'Website',
        type: 'url',
        required: false,
        placeholder: 'https://yourbusiness.com',
        description: 'Your business website URL',
        helper: 'Include https://'
      },
      {
        id: 'instagram',
        label: 'Instagram / Social',
        type: 'url',
        required: false,
        placeholder: 'https://instagram.com/yourbusiness',
        description: 'Social media profile URL',
        helper: 'Instagram, Facebook, LinkedIn, etc.'
      }
    ]
  },
  {
    id: 'location-operations',
    title: 'Step 2 — Location & Operations',
    subtitle: 'Location & Operations',
    purpose: 'Map where Pacific enterprise operates globally',
    fields: [
      {
        id: 'country',
        label: 'Country',
        type: 'select',
        required: true,
        placeholder: 'Select your country',
        description: 'Primary country of business operations',
        options: COUNTRIES
      },
      {
        id: 'city',
        label: 'City',
        type: 'text',
        required: true,
        placeholder: 'Enter your city',
        description: 'Primary city of business operations',
        maxLength: 100
      },
      {
        id: 'operates_online',
        label: 'Operates online?',
        type: 'radio',
        required: false,
        description: 'Does your business operate online?',
        options: [
          { value: true, label: 'Yes' },
          { value: false, label: 'No' }
        ]
      },
      {
        id: 'markets_served',
        label: 'Markets served',
        type: 'multiselect',
        required: false,
        placeholder: 'Select markets you serve',
        description: 'Geographic markets where you operate',
        options: [
          { value: 'pacific-islands', label: 'Pacific Islands' },
          { value: 'australia', label: 'Australia' },
          { value: 'new-zealand', label: 'New Zealand' },
          { value: 'north-america', label: 'North America' },
          { value: 'europe', label: 'Europe' },
          { value: 'asia', label: 'Asia' },
          { value: 'global-online', label: 'Global / Online' }
        ]
      },
      {
        id: 'exporting',
        label: 'Exporting?',
        type: 'radio',
        required: false,
        description: 'Does your business export goods or services?',
        options: [
          { value: true, label: 'Yes' },
          { value: false, label: 'No' }
        ]
      },
      {
        id: 'import_countries',
        label: 'Import countries',
        type: 'text',
        required: false,
        placeholder: 'China, Australia, Fiji',
        description: 'Countries you import from (comma separated)',
        helper: 'Example: China, Australia, Fiji',
        maxLength: 500
      }
    ]
  },
  {
    id: 'cultural-connection',
    title: 'Step 3 — Cultural Connection',
    subtitle: 'Cultural Connection',
    purpose: 'Highlight Pacific ownership and identity',
    fields: [
      {
        id: 'cultural_identity',
        label: 'Which Pacific identities does this business represent?',
        type: 'multiselect',
        required: false,
        placeholder: 'Select cultural identities',
        description: 'Pacific cultural identities represented by your business',
        options: COUNTRIES
      },
      {
        id: 'community',
        label: 'Community / village',
        type: 'text',
        required: false,
        placeholder: 'Enter community or village name',
        description: 'Optional: Specific community or village affiliation',
        maxLength: 100,
        helper: 'For cultural context and community representation'
      },
      {
        id: 'languages',
        label: 'Languages used in the business',
        type: 'text',
        required: false,
        placeholder: 'English, Cook Island, French',
        description: 'Languages used in your business operations',
        helper: 'Enter languages separated by commas',
        maxLength: 500
      }
    ]
  },
  {
    id: 'economic-scale',
    title: 'Step 4 — Economic Profile',
    subtitle: 'Economic Profile',
    purpose: 'Measure the economic impact of Pacific businesses',
    fields: [
      {
        id: 'growth_stage',
        label: 'Business stage',
        type: 'select',
        required: false,
        placeholder: 'Select business stage',
        description: 'Current stage of business development',
        options: [
          { value: 'startup', label: 'Startup' },
          { value: 'growth', label: 'Growth' },
          { value: 'established', label: 'Established' }
        ]
      },
      {
        id: 'employee_count',
        label: 'Employee count',
        type: 'select',
        required: false,
        placeholder: 'Select employee count',
        description: 'Number of employees in the business',
        options: [
          { value: '1', label: '1' },
          { value: '2-5', label: '2-5' },
          { value: '6-10', label: '6-10' },
          { value: '11-25', label: '11-25' },
          { value: '26-50', label: '26-50' },
          { value: '50+', label: '50+' }
        ]
      },
      {
        id: 'revenue_band',
        label: 'Annual revenue band',
        type: 'select',
        required: false,
        placeholder: 'Select revenue range',
        description: 'Annual business revenue (private data)',
        options: [
          { value: 'pre-revenue', label: 'Pre-revenue' },
          { value: 'under-50k', label: 'Under $50k' },
          { value: '50k-250k', label: '$50k-$250k' },
          { value: '250k-1m', label: '$250k-$1M' },
          { value: '1m-5m', label: '$1M-$5M' },
          { value: '5m+', label: '$5M+' }
        ]
      }
    ]
  },
  {
    id: 'private-analytics',
    title: 'Step 5 — Advanced Analytics (Private)',
    subtitle: 'Advanced Analytics',
    purpose: 'Detailed insights for economic research (private data)',
    fields: [
      {
        id: 'business_structure',
        label: 'Business structure',
        type: 'select',
        required: false,
        placeholder: 'Select business structure',
        description: 'Legal structure of your business (private data)',
        options: [
          { value: 'sole-proprietorship', label: 'Sole Proprietorship' },
          { value: 'partnership', label: 'Partnership' },
          { value: 'limited-liability-company', label: 'Limited Liability Company (LLC)' },
          { value: 'corporation', label: 'Corporation' },
          { value: 'cooperative', label: 'Cooperative' },
          { value: 'non-profit', label: 'Non-Profit' },
          { value: 'other', label: 'Other' }
        ]
      },
      {
        id: 'annual_revenue_exact',
        label: 'Annual revenue (exact)',
        type: 'number',
        required: false,
        placeholder: '100000',
        description: 'Exact annual revenue in USD (private data)',
        helper: 'This data is used for economic research only and will not be displayed publicly',
        min: 0,
        max: 100000000
      },
      {
        id: 'full_time_employees',
        label: 'Full-time employees (exact)',
        type: 'number',
        required: false,
        placeholder: '5',
        description: 'Exact number of full-time employees (private data)',
        min: 0,
        max: 1000
      },
      {
        id: 'part_time_employees',
        label: 'Part-time employees (exact)',
        type: 'number',
        required: false,
        placeholder: '3',
        description: 'Exact number of part-time employees (private data)',
        min: 0,
        max: 1000
      },
      {
        id: 'primary_market',
        label: 'Primary market focus',
        type: 'text',
        required: false,
        placeholder: 'Local Pacific communities',
        description: 'Your main target market (private data)',
        maxLength: 200
      },
      {
        id: 'funding_source',
        label: 'Primary funding source',
        type: 'select',
        required: false,
        placeholder: 'Select funding source',
        description: 'How is your business primarily funded? (private data)',
        options: [
          { value: 'self-funded', label: 'Self-Funded' },
          { value: 'family-friends', label: 'Family & Friends' },
          { value: 'bank-loans', label: 'Bank Loans' },
          { value: 'government-grants', label: 'Government Grants' },
          { value: 'angel-investors', label: 'Angel Investors' },
          { value: 'venture-capital', label: 'Venture Capital' },
          { value: 'crowdfunding', label: 'Crowdfunding' },
          { value: 'revenue-funded', label: 'Revenue-Funded' },
          { value: 'other', label: 'Other' }
        ]
      },
      {
        id: 'business_challenges',
        label: 'Key business challenges',
        type: 'multiselect',
        required: false,
        placeholder: 'Select challenges',
        description: 'Main challenges facing your business (private data)',
        options: [
          { value: 'access-to-capital', label: 'Access to Capital' },
          { value: 'market-access', label: 'Market Access' },
          { value: 'regulatory-compliance', label: 'Regulatory Compliance' },
          { value: 'talent-acquisition', label: 'Talent Acquisition' },
          { value: 'digital-transformation', label: 'Digital Transformation' },
          { value: 'supply-chain', label: 'Supply Chain Issues' },
          { value: 'competition', label: 'Competition' },
          { value: 'cash-flow', label: 'Cash Flow Management' },
          { value: 'marketing-reach', label: 'Marketing Reach' },
          { value: 'infrastructure', label: 'Infrastructure' },
          { value: 'other', label: 'Other' }
        ]
      },
      {
        id: 'future_plans',
        label: 'Growth/expansion plans',
        type: 'textarea',
        required: false,
        placeholder: 'Describe your plans for the next 1-3 years...',
        description: 'Your business growth plans (private data)',
        maxLength: 1000,
        rows: 3
      }
    ]
  }
];

export const BUSINESS_PROFILE_SCHEMA = {
  // Business Identity
  name: 'text',
  description: 'text',
  industry: 'text',
  year_founded: 'integer',
  website: 'text',
  instagram: 'text',
  
  // Location & Operations
  city: 'text',
  country: 'text',
  operates_online: 'boolean',
  markets_served: 'text[]',
  
  // Cultural Connection
  cultural_identity: 'text[]',
  community: 'text',
  languages: 'text[]',
  
  // Economic Scale
  growth_stage: 'text',
  employee_count: 'text',
  revenue_band: 'text',
  exporting: 'boolean',
  import_countries: 'text[]',
  
  // Private Fields (non-public, for analytics only)
  business_structure: 'text',           // Sole proprietorship, partnership, company, etc.
  annual_revenue_exact: 'integer',       // Exact revenue (private)
  full_time_employees: 'integer',        // Exact full-time count (private)
  part_time_employees: 'integer',        // Exact part-time count (private)
  primary_market: 'text',                // Main market focus (private)
  funding_source: 'text',                // Self-funded, loans, investors (private)
  business_challenges: 'text[]',         // Key challenges (private)
  future_plans: 'text',                  // Growth/expansion plans (private)
  tech_stack: 'text[]',                  // Technologies used (private)
  customer_segments: 'text[]',           // Primary customer types (private)
  competitive_advantage: 'text',          // What makes them unique (private)
};

export const BUSINESS_PROFILE_VALIDATION_RULES = {
  // Business Identity validation
  name: {
    required: true,
    minLength: 2,
    maxLength: 200
  },
  description: {
    required: true,
    minLength: 10,
    maxLength: 1000
  },
  industry: {
    required: true
  },
  year_founded: {
    required: true,
    min: 1900,
    max: new Date().getFullYear(),
    type: 'number'
  },
  website: {
    type: 'url',
    maxLength: 255
  },
  instagram: {
    type: 'url',
    maxLength: 255
  },
  
  // Location & Operations validation
  city: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  country: {
    required: true
  },
  operates_online: {
    type: 'boolean'
  },
  
  // Cultural Connection validation
  community: {
    maxLength: 100
  },
  languages: {
    maxLength: 500,
    transform: (value) => {
      if (!value) return [];
      return value.split(',').map(lang => lang.trim()).filter(lang => lang.length > 0);
    }
  },
  
  // Economic Scale validation
  growth_stage: {
    allowedValues: ['startup', 'growth', 'established']
  },
  employee_count: {
    allowedValues: ['1', '2-5', '6-10', '11-25', '26-50', '50+']
  },
  revenue_band: {
    allowedValues: ['pre-revenue', 'under-50k', '50k-250k', '250k-1m', '1m-5m', '5m+']
  },
  exporting: {
    type: 'boolean'
  },
  import_countries: {
    maxLength: 500,
    transform: (value) => {
      if (!value) return [];
      return value.split(',').map(country => country.trim()).filter(country => country.length > 0);
    }
  }
};

export const BUSINESS_PROFILE_PUBLIC_FIELDS = [
  'name',
  'description', 
  'industry',
  'year_founded',
  'website',
  'instagram',
  'city',
  'country',
  'operates_online',
  'markets_served',
  'cultural_identity',
  'community',
  'languages',
  'growth_stage',
  'exporting'
];

export const BUSINESS_PROFILE_PRIVATE_FIELDS = [
  'employee_count',
  'revenue_band',
  'import_countries',
  // Additional private fields for analytics only
  'business_structure',
  'annual_revenue_exact',
  'full_time_employees',
  'part_time_employees',
  'primary_market',
  'growth_stage',
  'funding_source',
  'business_challenges',
  'future_plans',
  'tech_stack',
  'customer_segments',
  'competitive_advantage'
];

export const BUSINESS_PROFILE_COMPLETION_TIME = '3–4 minutes';

export const BUSINESS_PROFILE_DESCRIPTION = {
  title: 'Business Profile Setup',
  subtitle: 'Tell us about your enterprise',
  description: 'This 5-step process helps us showcase your business in the Pacific Market and provide valuable economic insights. The final step captures private data for research purposes only.',
  estimatedTime: BUSINESS_PROFILE_COMPLETION_TIME,
  totalFields: '15–20'
};

export const DASHBOARD_DATA_MAPPING = {
  'Pacific enterprise by country': 'business.country',
  'Industry distribution': 'business.industry',
  'Cultural representation': 'business.cultural_identity',
  'Languages used': 'business.languages',
  'Economic scale': 'employee_count / revenue_band',
  'Export activity': 'business.exporting',
  'Market reach': 'business.markets_served',
  'Business maturity': 'business.growth_stage / business.year_founded'
};

// Export commonly used constants for backward compatibility
export const IDENTITIES = BUSINESS_PROFILE_STEPS[2].fields.find(f => f.id === 'cultural_identity').options.map(o => o.label);

// Import tier benefits from dedicated constants file
export { TIER_BENEFITS } from './tierBenefits';
