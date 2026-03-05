// Profile Onboarding Configuration
// Business Owner Profile Onboarding Flow

export const ONBOARDING_STEPS = [
  {
    id: 'identity-location',
    title: 'Step 1 — Your Location',
    subtitle: 'Identity & Location',
    purpose: 'Map the Pacific diaspora economy',
    fields: [
      {
        id: 'full_name',
        label: 'Full name',
        type: 'text',
        required: true,
        disabled: true,
        placeholder: 'Auto populated from signup',
        description: 'Pulled from your account information'
      },
      {
        id: 'city',
        label: 'City of residence',
        type: 'text',
        required: true,
        placeholder: 'Enter your city',
        description: 'Your current city of residence'
      },
      {
        id: 'country',
        label: 'Country of residence',
        type: 'select',
        required: true,
        placeholder: 'Select your country',
        description: 'Your current country of residence',
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
      }
    ]
  },
  {
    id: 'cultural-identity',
    title: 'Step 2 — Cultural Identity',
    subtitle: 'Cultural Identity',
    purpose: 'Representation of Pacific communities',
    fields: [
      {
        id: 'primary_cultural',
        label: 'Primary cultural identity',
        type: 'select',
        required: true,
        placeholder: 'Select your primary cultural identity',
        description: 'Your main cultural affiliation',
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
        id: 'cultural_tags',
        label: 'Other cultural identities',
        type: 'multiselect',
        required: false,
        placeholder: 'Select additional cultural identities',
        description: 'Select all that apply to you',
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
        id: 'languages',
        label: 'Languages spoken',
        type: 'text',
        required: false,
        placeholder: 'English, Samoan, French',
        description: 'Enter languages separated by commas',
        helper: 'Example: English, Samoan, French'
      }
    ]
  },
  {
    id: 'business-experience',
    title: 'Step 3 — Business Experience',
    subtitle: 'Business Experience',
    purpose: 'Economic participation insights',
    fields: [
      {
        id: 'years_operating',
        label: 'Years operating in business',
        type: 'number',
        required: false,
        placeholder: '5',
        description: 'How many years have you been in business?',
        min: 0,
        max: 50
      }
    ]
  },
  {
    id: 'trade-relationships',
    title: 'Step 4 — Trade Relationships',
    subtitle: 'Trade Relationships',
    purpose: 'Understand Pacific trade networks',
    fields: [
      // Trade relationships moved to business profile as they relate to the business, not the individual
    ]
  }
];

export const BUSINESS_ROLE_OPTIONS = [
  { value: 'founder', label: 'Founder' },
  { value: 'owner', label: 'Owner' },
  { value: 'co-owner', label: 'Co-owner' },
  { value: 'partner', label: 'Partner' },
  { value: 'director', label: 'Director' },
  { value: 'manager', label: 'Manager' },
  { value: 'supporting-team-member', label: 'Supporting team member' }
];

export const PROFILE_SCHEMA = {
  // Location fields
  city: 'text',
  country: 'text',
  
  // Cultural identity fields
  primary_cultural: 'text',
  cultural_tags: 'text[]',
  languages: 'text[]',
  
  // Business experience fields (individual only)
  years_operating: 'integer',
  
  // Business role field
  business_role: 'text',
  
  // Market region (derived from country)
  market_region: 'text'
};

export const COUNTRY_REGION_MAPPING = {
  'american-samoa': 'polynesia',
  'australia': 'australia-new-zealand',
  'cook-islands': 'polynesia',
  'fiji': 'melanesia',
  'french-polynesia': 'polynesia',
  'guam': 'micronesia',
  'kiribati': 'micronesia',
  'marshall-islands': 'micronesia',
  'micronesia': 'micronesia',
  'nauru': 'micronesia',
  'new-caledonia': 'melanesia',
  'new-zealand': 'australia-new-zealand',
  'niue': 'polynesia',
  'northern-mariana-islands': 'micronesia',
  'palau': 'micronesia',
  'papua-new-guinea': 'melanesia',
  'samoa': 'polynesia',
  'solomon-islands': 'melanesia',
  'tokelau': 'polynesia',
  'tonga': 'polynesia',
  'tuvalu': 'polynesia',
  'usa': 'north-america',
  'vanuatu': 'melanesia',
  'wallis-futuna': 'polynesia',
  'other': 'other'
};

export const ONBOARDING_VALIDATION_RULES = {
  // Step 1 validation
  city: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  country: {
    required: true
  },
  
  // Step 2 validation
  primary_cultural: {
    required: true
  },
  languages: {
    maxLength: 500,
    transform: (value) => {
      // Convert comma-separated string to array
      if (!value) return [];
      return value.split(',').map(lang => lang.trim()).filter(lang => lang.length > 0);
    }
  },
  
  // Step 3 validation (individual business experience only)
  years_operating: {
    min: 0,
    max: 50,
    type: 'number'
  }
};

export const ONBOARDING_COMPLETION_TIME = '45–60 seconds';

export const ONBOARDING_DESCRIPTION = {
  title: 'Complete Your Business Profile',
  subtitle: 'Help us understand the Pacific business landscape',
  description: 'This 4-step process helps us map the Pacific diaspora economy and provide better insights for the business community.',
  estimatedTime: ONBOARDING_COMPLETION_TIME
};
