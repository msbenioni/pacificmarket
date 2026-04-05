-- Row Level Security (RLS) Policies - Simplified Version
-- Apply these after the base tables are created and auth is available

-- Enable RLS on all tables
ALTER TABLE discovered_businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduler_config ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Using simple checks that don't require auth schema during migration

-- Discovered businesses - anyone can read/write for now (will be secured later)
CREATE POLICY "Enable all on discovered_businesses" ON discovered_businesses FOR ALL USING (true);

-- Daily reports - anyone can read/write for now (will be secured later)
CREATE POLICY "Enable all on daily_reports" ON daily_reports FOR ALL USING (true);

-- Quality alerts - anyone can read/write for now (will be secured later)
CREATE POLICY "Enable all on quality_alerts" ON quality_alerts FOR ALL USING (true);

-- Email groups - anyone can read/write for now (will be secured later)
CREATE POLICY "Enable all on email_groups" ON email_groups FOR ALL USING (true);

-- Email campaigns - anyone can read/write for now (will be secured later)
CREATE POLICY "Enable all on email_campaigns" ON email_campaigns FOR ALL USING (true);

-- Error logs - anyone can read/write for now (will be secured later)
CREATE POLICY "Enable all on error_logs" ON error_logs FOR ALL USING (true);

-- Scheduler config - anyone can read/write for now (will be secured later)
CREATE POLICY "Enable all on scheduler_config" ON scheduler_config FOR ALL USING (true);

-- NOTE: These are placeholder policies that allow all access.
-- In production, you should replace these with proper security policies
-- after the auth system is fully configured.
