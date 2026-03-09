// TypeScript types for email marketing system

export interface Campaign {
  id: string;
  name: string;
  subject: string;
  html_content: string;
  audience: 'all' | 'business_owners' | 'mana_plan' | 'moana_plan' | 'referral_participants';
  status: 'draft' | 'queued' | 'sending' | 'sent' | 'sent_with_errors' | 'failed';
  sent_at?: string;
  created_at: string;
  created_by: string;
  recipients?: number;
  opens?: number;
  clicks?: number;
  open_rate?: number;
}

export interface CampaignRecipient {
  id: string;
  campaign_id: string;
  subscriber_id?: string;
  email: string;
  status: 'pending' | 'sent' | 'failed' | 'bounced';
  sent_at?: string;
  opened_at?: string;
  clicked_at?: string;
  created_at: string;
}

export interface EmailEvent {
  id: string;
  campaign_id?: string;
  recipient_id?: string;
  event_type: 'open' | 'click' | 'unsubscribe' | 'bounce';
  event_data?: Record<string, any>;
  created_at: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html_content: string;
  variables: string[];
  created_at: string;
  updated_at?: string;
  created_by: string;
}

export interface EmailSubscriber {
  id: string;
  email: string;
  first_name?: string;
  business_name?: string;
  business_count?: number;
  entities?: EmailSubscriberEntity[];
  source: 'manual_import' | 'business_signup' | 'referral';
  status: 'subscribed' | 'unsubscribed' | 'bounced';
  created_at: string;
  updated_at?: string;
}

export interface EmailSubscriberEntity {
  id: string;
  subscriber_id: string;
  entity_type: 'business' | 'creator_listing' | 'charity' | 'community';
  entity_id: string;
  entity_name?: string;
  relationship_type: 'owner' | 'manager' | 'member' | 'contact';
  created_at: string;
  updated_at?: string;
}

export interface EmailStats {
  totalSubscribers: number;
  totalCampaigns: number;
  totalSent: number;
  avgOpenRate: number;
}

export interface CampaignQueueItem {
  id: string;
  campaign_id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  priority: 'high' | 'normal' | 'low';
  created_at: string;
  scheduled_at?: string;
  started_at?: string;
  completed_at?: string;
  sent_count?: number;
  failed_count?: number;
  error_message?: string;
  retry_count?: number;
  max_retries?: number;
}

export interface UnsubscribeToken {
  id: string;
  token: string;
  email: string;
  expires_at: string;
  created_at: string;
  used_at?: string;
}
