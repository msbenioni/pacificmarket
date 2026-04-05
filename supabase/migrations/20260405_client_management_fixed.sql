-- Client Management System Schema (Fixed)
-- For PDN Daily Scheduler and Client List Manager

-- Discovered Businesses Table
CREATE TABLE IF NOT EXISTS discovered_businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    website TEXT,
    category TEXT,
    region TEXT,
    city TEXT,
    description TEXT,
    confidence INTEGER DEFAULT 0,
    discovered TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    edited_by UUID, -- Will reference auth.users after RLS is enabled
    edited_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    tags TEXT[],
    social_media JSONB DEFAULT '{}',
    duplicate_rate DECIMAL(3,2) DEFAULT 0,
    source_url TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily Reports Table
CREATE TABLE IF NOT EXISTS daily_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL UNIQUE,
    schedule JSONB NOT NULL,
    summary JSONB NOT NULL,
    businesses JSONB NOT NULL,
    quality_metrics JSONB NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quality Alerts Table
CREATE TABLE IF NOT EXISTS quality_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL,
    message TEXT NOT NULL,
    severity TEXT DEFAULT 'warning' CHECK (severity IN ('info', 'warning', 'error')),
    date DATE NOT NULL,
    resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID, -- Will reference auth.users after RLS is enabled
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email Groups Table
CREATE TABLE IF NOT EXISTS email_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent', 'cancelled')),
    client_ids UUID[] NOT NULL,
    email_template JSONB,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_by UUID, -- Will reference auth.users after RLS is enabled
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email Campaigns Table
CREATE TABLE IF NOT EXISTS email_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES email_groups(id) ON DELETE CASCADE,
    client_id UUID REFERENCES discovered_businesses(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'bounced')),
    sent_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Error Logs Table
CREATE TABLE IF NOT EXISTS error_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message TEXT NOT NULL,
    stack_trace TEXT,
    context JSONB,
    severity TEXT DEFAULT 'error' CHECK (severity IN ('info', 'warning', 'error', 'critical')),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID -- Will reference auth.users after RLS is enabled
);

-- Scheduler Configuration Table
CREATE TABLE IF NOT EXISTS scheduler_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL,
    description TEXT,
    updated_by UUID, -- Will reference auth.users after RLS is enabled
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_discovered_businesses_status ON discovered_businesses(status);
CREATE INDEX IF NOT EXISTS idx_discovered_businesses_region ON discovered_businesses(region);
CREATE INDEX IF NOT EXISTS idx_discovered_businesses_discovered ON discovered_businesses(discovered);
CREATE INDEX IF NOT EXISTS idx_discovered_businesses_email ON discovered_businesses(email);
CREATE INDEX IF NOT EXISTS idx_daily_reports_date ON daily_reports(date);
CREATE INDEX IF NOT EXISTS idx_quality_alerts_date ON quality_alerts(date);
CREATE INDEX IF NOT EXISTS idx_quality_alerts_resolved ON quality_alerts(resolved);
CREATE INDEX IF NOT EXISTS idx_email_groups_status ON email_groups(status);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_status ON email_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_error_logs_timestamp ON error_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_error_logs_severity ON error_logs(severity);

-- Insert default scheduler configuration
INSERT INTO scheduler_config (key, value, description) VALUES
('schedule', '{"time": "07:00", "timezone": "Pacific/Auckland", "enableNotifications": true}', 'Main scheduler configuration'),
('targets', '{"dailyVolume": 33, "qualityThresholds": {"maxDuplicateRate": 0.1, "minConfidenceScore": 60, "minEmailCapture": 0.25}}', 'Daily targets and quality thresholds'),
('weeklyRotation', '[
  {"day": 1, "region": "USA", "cities": ["California", "Hawaii", "Washington"]},
  {"day": 2, "region": "Canada", "cities": ["BC", "Ontario", "Alberta"]},
  {"day": 3, "region": "Australia_NZ", "cities": ["Sydney", "Melbourne", "Auckland", "Wellington"]},
  {"day": 4, "region": "UK_Europe", "cities": ["London", "Manchester", "Birmingham", "Paris"]},
  {"day": 5, "region": "Social_Media", "cities": ["Instagram", "LinkedIn", "TikTok"]},
  {"day": 6, "region": "Multi_Region", "cities": ["USA", "ANZ", "Canada"]},
  {"day": 0, "region": "Global", "cities": ["All regions"]}
]', 'Weekly rotation schedule')
ON CONFLICT (key) DO NOTHING;

-- Functions for automated updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_discovered_businesses_updated_at BEFORE UPDATE ON discovered_businesses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_groups_updated_at BEFORE UPDATE ON email_groups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_scheduler_config_updated_at BEFORE UPDATE ON scheduler_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to get today's schedule
CREATE OR REPLACE FUNCTION get_today_schedule()
RETURNS JSONB AS $$
DECLARE
    today_schedule JSONB;
BEGIN
    SELECT value INTO today_schedule 
    FROM scheduler_config 
    WHERE key = 'weeklyRotation';
    
    IF today_schedule IS NULL THEN
        RETURN NULL;
    END IF;
    
    -- Get today's day of week (0 = Sunday, 1 = Monday, etc.)
    RETURN (today_schedule -> (EXTRACT(DOW FROM CURRENT_DATE AT TIME ZONE 'utc' AT TIME ZONE 'Pacific/Auckland')::text))::jsonb;
END;
$$ LANGUAGE plpgsql;

-- Function to check quality thresholds
CREATE OR REPLACE FUNCTION check_quality_thresholds(report_data JSONB)
RETURNS TABLE(alert_type TEXT, alert_message TEXT, alert_severity TEXT) AS $$
DECLARE
    thresholds JSONB;
    summary JSONB;
BEGIN
    -- Get quality thresholds
    SELECT value INTO thresholds 
    FROM scheduler_config 
    WHERE key = 'targets';
    
    -- Get report summary
    summary := report_data -> 'summary';
    
    -- Check volume threshold
    IF (summary ->> 'total_discovered')::integer < (thresholds -> 'qualityThresholds' ->> 'minVolume')::integer THEN
        RETURN QUERY SELECT 'LOW_VOLUME', 
                            'Only ' || (summary ->> 'total_discovered') || ' businesses discovered, below minimum of ' || (thresholds -> 'qualityThresholds' ->> 'minVolume'),
                            'error';
    END IF;
    
    -- Check confidence threshold
    IF (summary ->> 'avg_confidence')::decimal < (thresholds -> 'qualityThresholds' ->> 'minConfidenceScore')::decimal THEN
        RETURN QUERY SELECT 'LOW_CONFIDENCE',
                            'Average confidence score ' || (summary ->> 'avg_confidence') || ' below threshold ' || (thresholds -> 'qualityThresholds' ->> 'minConfidenceScore'),
                            'warning';
    END IF;
    
    -- Check email capture threshold
    IF (summary ->> 'email_capture_rate')::decimal < (thresholds -> 'qualityThresholds' ->> 'minEmailCapture')::decimal THEN
        RETURN QUERY SELECT 'LOW_EMAIL_CAPTURE',
                            'Email capture rate ' || (summary ->> 'email_capture_rate') || ' below threshold ' || (thresholds -> 'qualityThresholds' ->> 'minEmailCapture'),
                            'warning';
    END IF;
    
    RETURN;
END;
$$ LANGUAGE plpgsql;
