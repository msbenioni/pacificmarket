-- Remove email templates functionality completely
-- This removes the table, policies, and any existing data

-- Drop RLS policies for templates first
DROP POLICY IF EXISTS "Admins full access to templates" ON email_templates;
DROP POLICY IF EXISTS "Admins can view all templates" ON email_templates;
DROP POLICY IF EXISTS "Admins can insert templates" ON email_templates;
DROP POLICY IF EXISTS "Admins can update templates" ON email_templates;
DROP POLICY IF EXISTS "Admins can delete templates" ON email_templates;

-- Drop the email_templates table (this will delete all template data)
DROP TABLE IF EXISTS email_templates;

-- Remove any references to templates in other tables if they exist
-- (Check for foreign key constraints that reference email_templates)
-- Note: Based on current schema, there are no FK constraints referencing email_templates
