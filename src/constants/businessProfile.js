// Business Profile Setup Configuration
// Enterprise-focused profile for Pacific Market registry

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
        rows: 4
      },
      {
        id: 'industry',
        label: 'Industry',
        type: 'select',
        required: true,
        placeholder: 'Select your industry',
        description: 'Primary industry category for your business',
        options: [
          { value: 'arts-culture', label: 'Arts & Culture' },
          { value: 'consulting-professional', label: 'Consulting & Professional Services' },
          { value: 'food-beverage', label: 'Food & Beverage' },
          { value: 'health-wellness', label: 'Health & Wellness' },
          { value: 'digital-media-tech', label: 'Digital Media & Technology' },
          { value: 'construction-trades', label: 'Construction & Trades' },
          { value: 'retail-ecommerce', label: 'Retail & E-commerce' },
          { value: 'tourism-hospitality', label: 'Tourism & Hospitality' },
          { value: 'education-training', label: 'Education & Training' },
          { value: 'finance-investment', label: 'Finance & Investment' },
          { value: 'agriculture-fisheries', label: 'Agriculture & Fisheries' },
          { value: 'manufacturing', label: 'Manufacturing' },
          { value: 'other', label: 'Other' }
        ]
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
        options: [
          { value: 'american-samoa', label: 'American Samoa' },
          { value: 'australia', label: 'Australia' },
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
          { value: 'niue', label: 'Niue' },
          { value: 'northern-mariana-islands', label: 'Northern Mariana Islands' },
          { value: 'palau', label: 'Palau' },
          { value: 'papua-new-guinea', label: 'Papua New Guinea' },
          { value: 'samoa', label: 'Samoa' },
          { value: 'solomon-islands', label: 'Solomon Islands' },
          { value: 'tokelau', label: 'Tokelau' },
          { value: 'tonga', label: 'Tonga' },
          { value: 'tuvalu', label: 'Tuvalu' },
          { value: 'usa', label: 'United States' },
          { value: 'vanuatu', label: 'Vanuatu' },
          { value: 'wallis-futuna', label: 'Wallis and Futuna' },
          { value: 'other', label: 'Other' }
        ]
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
        options: [
          { value: 'samoan', label: 'Sāmoa' },
          { value: 'maori', label: 'Māori (Aotearoa)' },
          { value: 'cook-islands-maori', label: 'Māori (Cook Islands)' },
          { value: 'tongan', label: 'Tonga' },
          { value: 'fijian', label: 'Fiji' },
          { value: 'niuean', label: 'Niue' },
          { value: 'tokelauan', label: 'Tokelau' },
          { value: 'tuvaluan', label: 'Tuvalu' },
          { value: 'kiribati', label: 'Kiribati' },
          { value: 'marshallese', label: 'Marshall Islands' },
          { value: 'palauan', label: 'Palau' },
          { value: 'chamorro', label: 'Chamorro (Guam/Marianas)' },
          { value: 'chuukese', label: 'Chuukese' },
          { value: 'pohnpeian', label: 'Pohnpeian' },
          { value: 'kosraean', label: 'Kosraean' },
          { value: 'yapese', label: 'Yapese' },
          { value: 'papua-new-guinea', label: 'Papua New Guinea' },
          { value: 'solomon-islands', label: 'Solomon Islands' },
          { value: 'vanuatu', label: 'Vanuatu' },
          { value: 'new-caledonian', label: 'New Caledonia' },
          { value: 'french-polynesian', label: 'French Polynesia' },
          { value: 'wallisian', label: 'Wallis and Futuna' },
          { value: 'nauruan', label: 'Nauru' },
          { value: 'other-pacific', label: 'Other Pacific Islander' },
          { value: 'non-pacific', label: 'Non-Pacific Islander' }
        ]
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
        placeholder: 'English, Samoan, French',
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
        id: 'business_stage',
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
  business_stage: 'text',
  employee_count: 'text',
  revenue_band: 'text',
  exporting: 'boolean',
  import_countries: 'text[]'
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
  business_stage: {
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
  'business_stage',
  'exporting'
];

export const BUSINESS_PROFILE_PRIVATE_FIELDS = [
  'employee_count',
  'revenue_band',
  'import_countries'
];

export const BUSINESS_PROFILE_COMPLETION_TIME = '2 minutes';

export const BUSINESS_PROFILE_DESCRIPTION = {
  title: 'Business Profile Setup',
  subtitle: 'Tell us about your enterprise',
  description: 'This 4-step process helps us showcase your business in the Pacific Market registry and provide valuable economic insights.',
  estimatedTime: BUSINESS_PROFILE_COMPLETION_TIME,
  totalFields: '12–15'
};

export const DASHBOARD_DATA_MAPPING = {
  'Pacific enterprise by country': 'business.country',
  'Industry distribution': 'business.industry',
  'Cultural representation': 'business.cultural_identity',
  'Languages used': 'business.languages',
  'Economic scale': 'employee_count / revenue_band',
  'Export activity': 'business.exporting',
  'Market reach': 'business.markets_served',
  'Business maturity': 'business.business_stage / business.year_founded'
};
