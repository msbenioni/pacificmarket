-- Production RLS Policies
-- Apply these after the system is running and auth is properly configured

-- Drop the placeholder policies
DROP POLICY IF EXISTS "Enable all on discovered_businesses" ON discovered_businesses;
DROP POLICY IF EXISTS "Enable all on daily_reports" ON daily_reports;
DROP POLICY IF EXISTS "Enable all on quality_alerts" ON quality_alerts;
DROP POLICY IF EXISTS "Enable all on email_groups" ON email_groups;
DROP POLICY IF EXISTS "Enable all on email_campaigns" ON email_campaigns;
DROP POLICY IF EXISTS "Enable all on error_logs" ON error_logs;
DROP POLICY IF EXISTS "Enable all on scheduler_config" ON scheduler_config;

-- Apply proper RLS Policies

-- Discovered businesses - anyone can read, only authenticated can write
CREATE POLICY "Anyone can view discovered businesses" ON discovered_businesses FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert discovered businesses" ON discovered_businesses FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update discovered businesses" ON discovered_businesses FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete discovered businesses" ON discovered_businesses FOR DELETE USING (auth.role() = 'authenticated');

-- Daily reports - anyone can read, only service role can write
CREATE POLICY "Anyone can view daily reports" ON daily_reports FOR SELECT USING (true);
CREATE POLICY "Service role can insert daily reports" ON daily_reports FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service role can update daily reports" ON daily_reports FOR UPDATE USING (auth.role() = 'service_role');

-- Quality alerts - anyone can read, only service role can write
CREATE POLICY "Anyone can view quality alerts" ON quality_alerts FOR SELECT USING (true);
CREATE POLICY "Service role can manage quality alerts" ON quality_alerts FOR ALL USING (auth.role() = 'service_role');

-- Email groups - authenticated users only
CREATE POLICY "Authenticated users can manage email groups" ON email_groups FOR ALL USING (auth.role() = 'authenticated');

-- Email campaigns - authenticated users only
CREATE POLICY "Authenticated users can manage email campaigns" ON email_campaigns FOR ALL USING (auth.role() = 'authenticated');

-- Error logs - service role only
CREATE POLICY "Service role can manage error logs" ON error_logs FOR ALL USING (auth.role() = 'service_role');

-- Scheduler config - anyone can read, only admin can write
CREATE POLICY "Anyone can view scheduler config" ON scheduler_config FOR SELECT USING (true);
CREATE POLICY "Admin users can manage scheduler config" ON scheduler_config FOR ALL USING (
    auth.role() = 'authenticated' AND 
    EXISTS (SELECT 1 FROM auth.users WHERE auth.users.id = auth.uid AND auth.users.raw_user_meta_data->>'role' = 'admin')
);

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Production RLS policies applied successfully';
END
$$;
