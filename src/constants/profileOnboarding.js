// Profile Onboarding Configuration
// Business Owner Profile Onboarding Flow

import { COUNTRIES, INDUSTRIES, LANGUAGES } from './unifiedConstants';

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
        type: 'multiselect',
        required: false,
        placeholder: 'Select languages spoken',
        description: 'Select all languages that you speak',
        options: LANGUAGES
      }
    ]
  },
];

export const PROFILE_SCHEMA = {
  // Location fields
  city: 'text',
  country: 'text',
  
  // Cultural identity fields
  primary_cultural: 'text[]',
  languages: 'text[]',
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
