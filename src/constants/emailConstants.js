// Centralized constants for email marketing system
// Prevents typos and ensures consistency across the application

// Campaign Statuses
export const CAMPAIGN_STATUS = {
  DRAFT: 'draft',
  QUEUED: 'queued',
  SENDING: 'sending',
  SENT: 'sent',
  SENT_WITH_ERRORS: 'sent_with_errors',
  FAILED: 'failed'
};

// Campaign Audiences
export const CAMPAIGN_AUDIENCE = {
  ALL: 'all',
  BUSINESS_OWNERS: 'business_owners',
  MANA_PLAN: 'mana_plan',
  MOANA_PLAN: 'moana_plan',
  REFERRAL_PARTICIPANTS: 'referral_participants'
};

// Subscriber Statuses
export const SUBSCRIBER_STATUS = {
  SUBSCRIBED: 'subscribed',
  UNSUBSCRIBED: 'unsubscribed',
  BOUNCED: 'bounced'
};

// Subscriber Sources
export const SUBSCRIBER_SOURCE = {
  MANUAL_IMPORT: 'manual_import',
  BUSINESS_SIGNUP: 'business_signup',
  REFERRAL: 'referral'
};

// Recipient Statuses
export const RECIPIENT_STATUS = {
  PENDING: 'pending',
  SENT: 'sent',
  FAILED: 'failed',
  BOUNCED: 'bounced'
};

// Email Event Types
export const EMAIL_EVENT_TYPE = {
  OPEN: 'open',
  CLICK: 'click',
  UNSUBSCRIBE: 'unsubscribe',
  BOUNCE: 'bounce'
};

// Queue Statuses
export const QUEUE_STATUS = {
  QUEUED: 'queued',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

// Queue Priorities (numeric for proper sorting)
export const QUEUE_PRIORITY = {
  HIGH: 3,
  NORMAL: 2,
  LOW: 1
};

// Template Variable Regex (supports spaces inside braces)
export const TEMPLATE_VARIABLE_REGEX = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;

// Helper function for extracting variables from HTML content
export const extractTemplateVariables = (htmlContent) => {
  const matches = [...htmlContent.matchAll(TEMPLATE_VARIABLE_REGEX)];
  return [...new Set(matches.map(m => m[1].trim()))];
};

// Email Validation Regex
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Token Length for Unsubscribe Links
export const UNSUBSCRIBE_TOKEN_LENGTH = 32;

// Token Expiration Days
export const UNSUBSCRIBE_TOKEN_EXPIRY_DAYS = 30;

// Batch Sizes for Email Sending
export const EMAIL_BATCH_SIZE = 50;
export const BACKGROUND_BATCH_SIZE = 25;

// Rate Limiting Delays (in milliseconds)
export const EMAIL_SEND_DELAY = 100;
export const BATCH_DELAY = 1000;
export const BACKGROUND_BATCH_DELAY = 2000;

// Max Retry Attempts
export const MAX_RETRY_ATTEMPTS = 3;

// Content Validation
export const MAX_CAMPAIGN_NAME_LENGTH = 255;
export const MAX_SUBJECT_LENGTH = 255;
export const MAX_HTML_CONTENT_LENGTH = 1000000; // 1MB

// Helper functions for status display
export const getStatusBadgeConfig = (status) => {
  const configs = {
    [CAMPAIGN_STATUS.DRAFT]: { color: 'yellow', icon: 'Clock', label: 'Draft' },
    [CAMPAIGN_STATUS.QUEUED]: { color: 'blue', icon: 'AlertCircle', label: 'Queued' },
    [CAMPAIGN_STATUS.SENDING]: { color: 'blue', icon: 'Send', label: 'Sending' },
    [CAMPAIGN_STATUS.SENT]: { color: 'green', icon: 'CheckCircle', label: 'Sent' },
    [CAMPAIGN_STATUS.SENT_WITH_ERRORS]: { color: 'orange', icon: 'AlertCircle', label: 'Sent with Errors' },
    [CAMPAIGN_STATUS.FAILED]: { color: 'red', icon: 'AlertCircle', label: 'Failed' },
    [SUBSCRIBER_STATUS.SUBSCRIBED]: { color: 'green', icon: 'CheckCircle', label: 'Subscribed' },
    [SUBSCRIBER_STATUS.UNSUBSCRIBED]: { color: 'red', icon: 'AlertCircle', label: 'Unsubscribed' },
    [SUBSCRIBER_STATUS.BOUNCED]: { color: 'orange', icon: 'AlertCircle', label: 'Bounced' }
  };
  
  return configs[status] || { color: 'gray', icon: 'AlertCircle', label: status };
};

// Audience display labels
export const AUDIENCE_LABELS = {
  [CAMPAIGN_AUDIENCE.ALL]: 'All Subscribers',
  [CAMPAIGN_AUDIENCE.BUSINESS_OWNERS]: 'Business Owners',
  [CAMPAIGN_AUDIENCE.MANA_PLAN]: 'Mana Plan',
  [CAMPAIGN_AUDIENCE.MOANA_PLAN]: 'Moana Plan',
  [CAMPAIGN_AUDIENCE.REFERRAL_PARTICIPANTS]: 'Referral Participants'
};

// Source display labels
export const SOURCE_LABELS = {
  [SUBSCRIBER_SOURCE.MANUAL_IMPORT]: 'Manual Import',
  [SUBSCRIBER_SOURCE.BUSINESS_SIGNUP]: 'Business Signup',
  [SUBSCRIBER_SOURCE.REFERRAL]: 'Referral'
};
