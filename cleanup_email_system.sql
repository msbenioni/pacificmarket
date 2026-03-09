-- Clean up existing email system policies and tables
-- Run this before create_email_system_tables.sql

-- Drop policies first
DROP POLICY IF EXISTS "Anyone can view email_subscribers" ON email_subscribers;
DROP POLICY IF EXISTS "Admins can insert email_subscribers" ON email_subscribers;
DROP POLICY IF EXISTS "Admins can update email_subscribers" ON email_subscribers;
DROP POLICY IF EXISTS "Admins full access to email_campaigns" ON email_campaigns;
DROP POLICY IF EXISTS "Admins full access to email_campaign_recipients" ON email_campaign_recipients;
DROP POLICY IF EXISTS "Admins full access to email_events" ON email_events;
DROP POLICY IF EXISTS "Admins full access to email_templates" ON email_templates;

-- Then drop tables
DROP TABLE IF EXISTS email_campaigns CASCADE;
DROP TABLE IF EXISTS email_campaign_recipients CASCADE;
DROP TABLE IF EXISTS email_subscribers CASCADE;
DROP TABLE IF EXISTS email_events CASCADE;
DROP TABLE IF EXISTS email_templates CASCADE;
