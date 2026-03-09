-- Email Marketing System Tables for Pacific Market
-- Create these tables in Supabase SQL editor

-- 1. Email Subscribers - Master email list
CREATE TABLE IF NOT EXISTS email_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    business_id UUID REFERENCES businesses(id),
    source VARCHAR(50) NOT NULL DEFAULT 'manual_import',
    status VARCHAR(20) NOT NULL DEFAULT 'subscribed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Email Campaigns - Store campaigns created by admin
CREATE TABLE IF NOT EXISTS email_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    html_content TEXT NOT NULL,
    audience VARCHAR(50) NOT NULL DEFAULT 'all',
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sent_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES profiles(id)
);

-- 3. Email Campaign Recipients - Track who received each email
CREATE TABLE IF NOT EXISTS email_campaign_recipients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES email_campaigns(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    opened BOOLEAN DEFAULT FALSE,
    clicked BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Email Events - Track engagement (optional but powerful)
CREATE TABLE IF NOT EXISTS email_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    campaign_id UUID REFERENCES email_campaigns(id) ON DELETE CASCADE,
    event_type VARCHAR(20) NOT NULL,
    event_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_email_subscribers_email ON email_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_status ON email_subscribers(status);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_source ON email_subscribers(source);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_status ON email_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_email_campaign_recipients_campaign_id ON email_campaign_recipients(campaign_id);
CREATE INDEX IF NOT EXISTS idx_email_campaign_recipients_email ON email_campaign_recipients(email);
CREATE INDEX IF NOT EXISTS idx_email_events_campaign_id ON email_events(campaign_id);
CREATE INDEX IF NOT EXISTS idx_email_events_email ON email_events(email);

-- Add RLS policies
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaign_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for email_subscribers
CREATE POLICY "Anyone can view email_subscribers" ON email_subscribers
    FOR SELECT USING (true);

CREATE POLICY "Admins can insert email_subscribers" ON email_subscribers
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admins can update email_subscribers" ON email_subscribers
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- RLS Policies for email_campaigns
CREATE POLICY "Admins full access to email_campaigns" ON email_campaigns
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- RLS Policies for email_campaign_recipients
CREATE POLICY "Admins full access to email_campaign_recipients" ON email_campaign_recipients
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- RLS Policies for email_events
CREATE POLICY "Admins full access to email_events" ON email_events
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_email_subscribers_updated_at BEFORE UPDATE
    ON email_subscribers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial subscribers from existing businesses
INSERT INTO email_subscribers (email, first_name, business_id, source, status)
SELECT DISTINCT 
    COALESCE(p.email, 'unknown') as email,
    COALESCE(p.display_name, 'Business Owner') as first_name,
    b.id as business_id,
    'business_signup' as source,
    'subscribed' as status
FROM businesses b
LEFT JOIN profiles p ON b.owner_user_id = p.id
WHERE p.email IS NOT NULL
AND p.email != 'unknown'
ON CONFLICT (email) DO UPDATE SET
    business_id = EXCLUDED.business_id,
    source = EXCLUDED.source,
    updated_at = NOW();

-- Create email templates (stored as campaign templates)
CREATE TABLE IF NOT EXISTS email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    html_content TEXT NOT NULL,
    variables JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES profiles(id)
);

-- Enable RLS for templates
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access to email_templates" ON email_templates
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Insert initial templates
INSERT INTO email_templates (name, subject, html_content, variables) VALUES
(
    'Pacific Market Relaunch',
    '🌺 Pacific Market is Relaunching - Exciting Updates Inside!',
    '
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fc;">
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #0d4f4f; font-size: 32px; margin-bottom: 10px;">🌺 Pacific Market</h1>
            <p style="color: #666; font-size: 16px;">Connecting Pacific Businesses Worldwide</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <h2 style="color: #0a1628; font-size: 24px; margin-bottom: 20px;">Big Changes Are Here! 🎉</h2>
            
            <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
                Hi {{first_name}}, we are excited to announce the relaunch of Pacific Market with powerful new features designed to help Pacific businesses thrive!
            </p>
            
            <h3 style="color: #0d4f4f; font-size: 20px; margin-bottom: 15px;">What''s New:</h3>
            <ul style="color: #333; line-height: 1.8; margin-bottom: 25px;">
                <li>✨ Enhanced business profiles with logos and banners</li>
                <li>🎯 New referral program with monthly website draws</li>
                <li>🛠️ Business tools for Moana subscribers</li>
                <li>📊 Better visibility for Pacific businesses</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://www.pacificmarket.co.nz" style="background: #0d4f4f; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                    Explore Pacific Market
                </a>
            </div>
            
            <p style="color: #666; font-size: 14px; text-align: center; margin-top: 30px;">
                Together, we''re building a stronger Pacific business community.
            </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px;">
                Pacific Market | Connecting Pacific Businesses Worldwide<br>
                <a href="https://www.pacificmarket.co.nz/unsubscribe?email={{email}}" style="color: #999;">Unsubscribe</a>
            </p>
        </div>
    </div>',
    '{"first_name": "Business Owner", "email": "user@example.com"}'
),
(
    'Referral Program Launch',
    '🎉 Refer Businesses & Win a Free Website!',
    '
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fc;">
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #c9a84c; font-size: 32px; margin-bottom: 10px;">🎉 Referral Program</h1>
            <p style="color: #666; font-size: 16px;">Share Pacific Market, Win Big!</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #c9a84c 0%, #f2d98b 100%); padding: 30px; border-radius: 12px; color: #0a1628;">
            <h2 style="color: #0a1628; font-size: 24px; margin-bottom: 20px; text-align: center;">
                Monthly Website Draw! 🏆
            </h2>
            
            <p style="font-size: 18px; line-height: 1.6; margin-bottom: 25px; text-align: center;">
                Every approved referral = 1 entry to win a FREE website build (just $50/month hosting!)
            </p>
            
            <div style="background: rgba(255,255,255,0.9); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #0d4f4f; margin-bottom: 15px;">Your Referral Link:</h3>
                <div style="background: #0a1628; color: #00c4cc; padding: 15px; border-radius: 6px; font-family: monospace; word-break: break-all; text-align: center;">
                    {{referral_link}}
                </div>
            </div>
            
            <div style="text-align: center;">
                <a href="{{referral_link}}" style="background: #0a1628; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                    Test Your Referral Link
                </a>
            </div>
        </div>
        
        <div style="background: white; padding: 25px; border-radius: 12px; margin-top: 20px;">
            <h3 style="color: #0d4f4f; font-size: 18px; margin-bottom: 15px;">How It Works:</h3>
            <ol style="color: #333; line-height: 1.8;">
                <li>Share your referral link with Pacific businesses</li>
                <li>They sign up and create a business listing</li>
                <li>Each approved referral = 1 draw entry</li>
                <li>Monthly winner gets free website build!</li>
            </ol>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px;">
                Pacific Market | Together We Grow<br>
                <a href="https://www.pacificmarket.co.nz/unsubscribe?email={{email}}" style="color: #999;">Unsubscribe</a>
            </p>
        </div>
    </div>',
    '{"first_name": "Business Owner", "email": "user@example.com", "referral_link": "https://www.pacificmarket.co.nz/register/business-handle"}'
),
(
    'Moana Upgrade Offer',
    '🚀 Unlock Powerful Business Tools - Upgrade to Moana',
    '
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fc;">
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #00c4cc; font-size: 32px; margin-bottom: 10px;">🚀 Moana Plan</h1>
            <p style="color: #666; font-size: 16px;">Premium Tools for Pacific Businesses</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <h2 style="color: #0a1628; font-size: 24px; margin-bottom: 20px;">Take Your Business to the Next Level 🌊</h2>
            
            <p style="color: #333; line-height: 1.6; margin-bottom: 25px;">
                Hi {{first_name}}, ready to unlock premium features that will help your Pacific business stand out and grow?
            </p>
            
            <div style="background: #00c4cc/10; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
                <h3 style="color: #0d4f4f; font-size: 20px; margin-bottom: 20px;">🎯 Moana Plan Benefits:</h3>
                <ul style="color: #333; line-height: 1.8;">
                    <li>✨ Featured placement in Pacific Market registry</li>
                    <li>🛠️ Invoice Generator with your branding</li>
                    <li>📱 QR Code Generator for your business</li>
                    <li>📧 Professional Email Signature creator</li>
                    <li>🏆 Enhanced profile with logos & banners</li>
                    <li>📊 Priority visibility in search results</li>
                </ul>
            </div>
            
            <div style="text-align: center; background: linear-gradient(135deg, #00c4cc 0%, #0d4f4f 100%); padding: 30px; border-radius: 12px; color: white; margin-bottom: 25px;">
                <h3 style="font-size: 28px; margin-bottom: 10px;">Just $29/month</h3>
                <p style="font-size: 16px; margin-bottom: 20px;">Everything you need to grow your Pacific business</p>
                <a href="https://www.pacificmarket.co.nz/BusinessPortal" style="background: white; color: #0d4f4f; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                    Upgrade to Moana
                </a>
            </div>
            
            <div style="background: #f8f9fc; padding: 20px; border-radius: 8px;">
                <p style="color: #666; font-size: 14px; text-align: center;">
                    Join hundreds of Pacific businesses already using Moana tools to grow their presence.
                </p>
            </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px;">
                Pacific Market | Empowering Pacific Businesses<br>
                <a href="https://www.pacificmarket.co.nz/unsubscribe?email={{email}}" style="color: #999;">Unsubscribe</a>
            </p>
        </div>
    </div>',
    '{"first_name": "Business Owner", "email": "user@example.com"}'
);

COMMENT ON TABLE email_subscribers IS 'Master email list for marketing campaigns';
COMMENT ON TABLE email_campaigns IS 'Email campaigns created by admin';
COMMENT ON TABLE email_campaign_recipients IS 'Track who received each email campaign';
COMMENT ON TABLE email_events IS 'Track email engagement events';
COMMENT ON TABLE email_templates IS 'Pre-built email templates with variables';
