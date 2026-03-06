export const BUSINESS_STATUS = {
  ACTIVE: 'active',
  PENDING: 'pending',
  REJECTED: 'rejected',
};

export const BUSINESS_TIER = {
  // New Pacific-inspired tier system
  VAKA: 'vaka',
  MANA: 'mana', 
  MOANA: 'moana',
  
  // Legacy mapping for backward compatibility
  BASIC: 'basic',        // Maps to VAKA
  VERIFIED: 'verified',  // Maps to MANA
  FEATURED_PLUS: 'featured_plus', // Maps to MOANA
};

// Helper function to map legacy tiers to new system
export const mapLegacyTier = (legacyTier) => {
  const mapping = {
    'basic': 'vaka',
    'verified': 'mana', 
    'featured_plus': 'moana',
    'free': 'vaka'
  };
  return mapping[legacyTier] || legacyTier;
};

// Helper function to get display name for tier
export const getTierDisplayName = (tier) => {
  const displayNames = {
    'vaka': 'Vaka',
    'mana': 'Mana',
    'moana': 'Moana',
    'basic': 'Vaka', // Legacy display
    'verified': 'Mana', // Legacy display
    'featured_plus': 'Moana', // Legacy display
    'free': 'Vaka' // Legacy display
  };
  return displayNames[tier] || tier;
};

export const BUSINESS_SOURCE = {
  USER: 'user',
  ADMIN: 'admin',
  IMPORT: 'import',
  CLAIM: 'claim',
};

export const TEAM_SIZE_BAND = {
  SOLO: 'solo',
  SMALL: '2-5',
  MEDIUM: '6-10',
  LARGE: '11-50',
  ENTERPRISE: '51+',
};

export const BUSINESS_STAGE = {
  IDEA: 'idea',
  STARTUP: 'startup',
  GROWTH: 'growth',
  MATURE: 'mature',
};

export const IMPORT_EXPORT_STATUS = {
  NONE: 'none',
  IMPORT_ONLY: 'import_only',
  EXPORT_ONLY: 'export_only',
  BOTH: 'both',
};
