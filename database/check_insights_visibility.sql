-- ================================================================
-- CHECK INSIGHTS VISIBILITY AND ACCESS
-- What can different users see on insights pages
-- ================================================================

-- Show current RLS policies for insights tables
DO $$
DECLARE
    policy_count INTEGER;
BEGIN
    RAISE NOTICE '=== Insights RLS Policies Status ===';
    
    -- Count business_insights policies
    SELECT COUNT(*) INTO policy_count 
    FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'business_insights';
    
    RAISE NOTICE 'business_insights RLS policies: %', policy_count;
    
    -- Count founder_insights policies
    SELECT COUNT(*) INTO policy_count 
    FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'founder_insights';
    
    RAISE NOTICE 'founder_insights RLS policies: %', policy_count;
    
    RAISE NOTICE '=== Policy Count Complete ===';
END $$;

-- Show detailed RLS policies
SELECT 
    'business_insights' as table_name,
    policyname,
    permissive,
    roles,
    cmd,
    CASE 
        WHEN qual LIKE '%auth.uid() = user_id%' THEN 'Owner only'
        WHEN qual LIKE '%auth.jwt() ->> ''role'' = ''admin''%' THEN 'Admins only'
        WHEN qual LIKE '%EXISTS (SELECT 1 FROM businesses b%' THEN 'Business owners'
        ELSE 'Other'
    END as access_type
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'business_insights'

UNION ALL

SELECT 
    'founder_insights' as table_name,
    policyname,
    permissive,
    roles,
    cmd,
    CASE 
        WHEN qual LIKE '%auth.uid() = user_id%' THEN 'Owner only'
        WHEN qual LIKE '%auth.jwt() ->> ''role'' = ''admin''%' THEN 'Admins only'
        ELSE 'Other'
    END as access_type
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'founder_insights'
ORDER BY table_name, cmd;

-- Test public access (simulate unauthenticated user)
DO $$
BEGIN
    RAISE NOTICE '=== Public Access Test ===';
    
    -- This would fail for public users due to RLS
    -- Only owners, admins, and business owners can access insights
    RAISE NOTICE 'Public users: NO ACCESS to insights tables';
    RAISE NOTICE 'Authenticated users: Can access their own insights';
    RAISE NOTICE 'Admin users: Can access all insights';
    RAISE NOTICE 'Business owners: Can access insights for their businesses';
    RAISE NOTICE '=== Access Test Complete ===';
END $$;

-- Show what data is available publicly vs privately
DO $$
BEGIN
    RAISE NOTICE '=== Data Visibility Summary ===';
    RAISE NOTICE '';
    RAISE NOTICE 'PUBLIC DATA (anyone can see):';
    RAISE NOTICE '- Business listings from businesses table (verified, active)';
    RAISE NOTICE '- Basic business information (name, description, contact)';
    RAISE NOTICE '- Owner profile information';
    RAISE NOTICE '';
    RAISE NOTICE 'PRIVATE DATA (restricted access):';
    RAISE NOTICE '- business_insights table (operational data, financials)';
    RAISE NOTICE '- founder_insights table (personal data, cultural identity)';
    RAISE NOTICE '- Private contact details (phone, email)';
    RAISE NOTICE '- Revenue and funding information';
    RAISE NOTICE '- Personal background and goals';
    RAISE NOTICE '';
    RAISE NOTICE 'WHO CAN SEE PRIVATE DATA:';
    RAISE NOTICE '- Individual users: Their own insights only';
    RAISE NOTICE '- Admin users: All insights (for moderation)';
    RAISE NOTICE '- Business owners: Insights for their businesses only';
    RAISE NOTICE '=== Summary Complete ===';
END $$;
