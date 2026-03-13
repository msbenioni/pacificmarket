// Profile Onboarding Configuration
// Business Owner Profile Onboarding Flow

import { COUNTRIES, INDUSTRIES } from './unifiedConstants';

export const ONBOARDING_STEPS = [
  {
    id: 'identity-location',
    title: 'Step 1 — Your Location',
    subtitle: 'Identity & Location',
    purpose: 'Map the Pacific diaspora economy',
    fields: [
      {
        id: 'display_name',
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
        options: COUNTRIES
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
        label: 'Cultural Identity',
        type: 'multiselect',
        required: true,
        placeholder: 'Select your cultural identities',
        description: 'Select all cultural identities that apply to you',
        options: COUNTRIES
      }
    ]
  },
  {
    id: 'languages',
    title: 'Step 3 — Languages',
    subtitle: 'Languages Spoken',
    purpose: 'Language capabilities and communication',
    fields: [
      {
        id: 'languages',
        label: 'Languages spoken',
        type: 'text',
        required: false,
        placeholder: 'English, Cook Island, French',
        description: 'Enter languages separated by commas',
        helper: 'Example: English, Cook Island, French'
      }
    ]
  },
  {
    id: 'business-experience',
    title: 'Step 4 — Business Experience',
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
        min: 0
      }
    ]
  },
  {
    id: 'private-analytics',
    title: 'Step 5 — Personal Insights (Private)',
    subtitle: 'Personal Insights',
    purpose: 'Additional context for economic research (private data)',
    fields: [
      {
        id: 'education_level',
        label: 'Highest education level',
        type: 'select',
        required: false,
        placeholder: 'Select education level',
        description: 'Your highest completed education (private data)',
        options: [
          { value: 'high-school', label: 'High School' },
          { value: 'some-college', label: 'Some College' },
          { value: 'associate-degree', label: 'Associate Degree' },
          { value: 'bachelors-degree', label: 'Bachelor\'s Degree' },
          { value: 'masters-degree', label: 'Master\'s Degree' },
          { value: 'phd', label: 'PhD or Doctorate' },
          { value: 'professional-degree', label: 'Professional Degree (MD, JD, etc.)' },
          { value: 'trade-certification', label: 'Trade Certification' },
          { value: 'other', label: 'Other' }
        ]
      },
      {
        id: 'professional_background',
        label: 'Previous professional experience',
        type: 'multiselect',
        required: false,
        placeholder: 'Select industries/roles',
        description: 'Previous industries or roles you\'ve worked in (private data)',
        options: [
          { value: 'agriculture', label: 'Agriculture' },
          { value: 'arts-culture', label: 'Arts & Culture' },
          { value: 'education', label: 'Education' },
          { value: 'finance', label: 'Finance & Banking' },
          { value: 'government', label: 'Government/Public Service' },
          { value: 'healthcare', label: 'Healthcare' },
          { value: 'hospitality', label: 'Hospitality & Tourism' },
          { value: 'it-technology', label: 'IT & Technology' },
          { value: 'manufacturing', label: 'Manufacturing' },
          { value: 'media-communications', label: 'Media & Communications' },
          { value: 'non-profit', label: 'Non-Profit' },
          { value: 'retail', label: 'Retail' },
          { value: 'trade-construction', label: 'Trade & Construction' },
          { value: 'transport-logistics', label: 'Transport & Logistics' },
          { value: 'other', label: 'Other' }
        ]
      },
      {
        id: 'mentorship_availability',
        label: 'Available to mentor others?',
        type: 'checkbox',
        required: false,
        description: 'Are you open to mentoring other Pacific entrepreneurs? (private data)',
        text: 'Yes, I am available to mentor others'
      },
      {
        id: 'investment_interest',
        label: 'Investment interests',
        type: 'select',
        required: false,
        placeholder: 'Select investment interest',
        description: 'Interest in investing in Pacific businesses (private data)',
        options: [
          { value: 'not-interested', label: 'Not Interested' },
          { value: 'exploring', label: 'Exploring Options' },
          { value: 'angel-investor', label: 'Angel Investor' },
          { value: 'venture-capital', label: 'Venture Capital' },
          { value: 'community-funding', label: 'Community Funding' },
          { value: 'impact-investing', label: 'Impact Investing' }
        ]
      },
      {
        id: 'skills_expertise',
        label: 'Professional skills & expertise',
        type: 'multiselect',
        required: false,
        placeholder: 'Select your skills',
        description: 'Your key professional skills (private data)',
        options: [
          { value: 'business-strategy', label: 'Business Strategy' },
          { value: 'financial-management', label: 'Financial Management' },
          { value: 'marketing-sales', label: 'Marketing & Sales' },
          { value: 'digital-marketing', label: 'Digital Marketing' },
          { value: 'project-management', label: 'Project Management' },
          { value: 'leadership', label: 'Leadership' },
          { value: 'data-analysis', label: 'Data Analysis' },
          { value: 'web-development', label: 'Web Development' },
          { value: 'graphic-design', label: 'Graphic Design' },
          { value: 'content-creation', label: 'Content Creation' },
          { value: 'public-speaking', label: 'Public Speaking' },
          { value: 'languages', label: 'Multiple Languages' },
          { value: 'networking', label: 'Networking' },
          { value: 'negotiation', label: 'Negotiation' },
          { value: 'other', label: 'Other' }
        ]
      },
      {
        id: 'business_goals',
        label: 'Business goals (1-5 years)',
        type: 'textarea',
        required: false,
        placeholder: 'Describe your business goals for the next 1-5 years...',
        description: 'Your short to medium-term business goals (private data)',
        maxLength: 1000,
        rows: 3
      }
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
  primary_cultural: 'text[]',
  languages: 'text[]',
  
  // Business experience fields (individual only)
  years_operating: 'integer',
  
  // Business role field
  business_role: 'text',
  
  // Market region (derived from country)
  market_region: 'text',
  
  // Private Fields (non-public, for analytics only)
  education_level: 'text',                // Highest education achieved
  professional_background: 'text[]',      // Previous industries/roles
  business_networks: 'text[]',            // Professional networks
  mentorship_availability: 'boolean',     // Available to mentor others
  investment_interest: 'text',            // Interest in investing
  community_involvement: 'text[]',        // Community organizations
  skills_expertise: 'text[]',             // Professional skills
  business_goals: 'text',                  // 1-5 year business goals
  challenges_faced: 'text[]',              // Business challenges
  success_factors: 'text[]',              // Key success factors
  preferred_collaboration: 'text[]',       // Collaboration preferences
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
    required: true,
    minItems: 1
  },
  languages: {
    maxLength: 500,
    transform: (value) => {
      // Convert comma-separated string to array
      if (!value) return [];
      return value.split(',').map(lang => lang.trim()).filter(lang => lang.length > 0);
    }
  },
  
  // Step 4 validation (individual business experience only)
  years_operating: {
    min: 0,
    type: 'number'
  }
};

export const ONBOARDING_COMPLETION_TIME = '60–90 seconds';

export const ONBOARDING_DESCRIPTION = {
  title: 'Complete Your Business Profile',
  subtitle: 'Help us understand the Pacific business landscape',
  description: 'This 5-step process helps us map the Pacific diaspora economy and provide better insights for the business community. The final step captures private insights for research purposes only.',
  estimatedTime: ONBOARDING_COMPLETION_TIME
};

export const IDENTITIES = ONBOARDING_STEPS[1].fields.find(f => f.id === 'primary_cultural').options.map(o => o.label);
