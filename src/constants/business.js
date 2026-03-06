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
