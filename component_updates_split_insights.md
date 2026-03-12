// =====================================================
// COMPONENT UPDATE PLAN: Split Insights Tables
// =====================================================

// STEP 1: Update FounderInsightsAccordion.jsx
// =====================================================

// OLD: buildSectionPayload function (lines 196-212)
const buildSectionPayload = (user, sectionKey) => {
  const fields = SECTION_FIELDS[sectionKey] || [];
  const payload = {
    user_id: user.id,
    business_id: businessId ?? null,  // REMOVE THIS
    snapshot_year: new Date().getFullYear(),
    submitted_date: new Date().toISOString(),
    submission_type: "section",      // REMOVE THIS
    completion_status: "in_progress", // REMOVE THIS
  };

  for (const field of fields) {
    payload[field] = form[field];
  }

  return payload;
};

// NEW: Updated buildSectionPayload function
const buildSectionPayload = (user, sectionKey) => {
  const fields = SECTION_FIELDS[sectionKey] || [];
  const payload = {
    user_id: user.id,
    snapshot_year: new Date().getFullYear(),
    submitted_date: new Date().toISOString(),
  };

  for (const field of fields) {
    payload[field] = form[field];
  }

  return payload;
};

// OLD: handleSubmitAll function (lines 237-302)
const payload = {
  user_id: user.id,
  business_id: businessId ?? null,  // REMOVE THIS
  snapshot_year: new Date().getFullYear(),
  submitted_date: new Date().toISOString(),
  submission_type: "full",          // REMOVE THIS
  completion_status: "completed",   // REMOVE THIS
  // ... rest of fields
};

// NEW: Updated handleSubmitAll function
const payload = {
  user_id: user.id,
  snapshot_year: new Date().getFullYear(),
  submitted_date: new Date().toISOString(),
  // ... rest of fields (only founder-specific ones)
};

// STEP 2: Update Business Forms (DetailedBusinessForm, ClaimDetailsForm, InlineBusinessForm)
// =====================================================

// OLD: Business form payload
const businessPayload = {
  user_id: user.id,                    // REMOVE THIS
  business_id: businessId,
  snapshot_year: new Date().getFullYear(),
  submitted_date: new Date().toISOString(),
  submission_type: "business",         // REMOVE THIS
  completion_status: "completed",      // REMOVE THIS
  // ... business-specific fields
};

// NEW: Updated business form payload
const businessPayload = {
  business_id: businessId,
  snapshot_year: new Date().getFullYear(),
  submitted_date: new Date().toISOString(),
  // ... business-specific fields
};

// STEP 3: Update Insights.jsx (fetchInsightsData function)
// =====================================================

// OLD: Single query
const fetchInsightsData = async () => {
  const { getSupabase } = await import('../lib/supabase/client');
  const supabase = getSupabase();
  
  const { data, error } = await supabase
    .from('business_insights_snapshots')
    .select('*')
    .order('submitted_date', { ascending: false })
    .limit(100);
  
  if (error) throw error;
  return data;
};

// NEW: Separate queries for founder and business insights
const fetchInsightsData = async () => {
  const { getSupabase } = await import('../lib/supabase/client');
  const supabase = getSupabase();
  
  // Fetch founder insights
  const { data: founderData, error: founderError } = await supabase
    .from('founder_insights')
    .select('*')
    .order('submitted_date', { ascending: false })
    .limit(100);
  
  // Fetch business insights
  const { data: businessData, error: businessError } = await supabase
    .from('business_insights')
    .select('*')
    .order('submitted_date', { ascending: false })
    .limit(100);
  
  if (founderError) throw founderError;
  if (businessError) throw businessError;
  
  // Combine for backward compatibility (or process separately)
  return {
    founderInsights: founderData || [],
    businessInsights: businessData || [],
    allInsights: [...(founderData || []), ...(businessData || [])]
  };
};

// STEP 4: Update Insights.jsx analytics processing
// =====================================================

// OLD: Single insights processing
const insights = insightsData || [];

// NEW: Separate processing for better analytics
const { founderInsights = [], businessInsights = [], allInsights = [] } = insightsData;

// Founder-specific analytics
const founderByGender = founderInsights.reduce((acc, insight) => {
  if (insight.gender) {
    acc[insight.gender] = (acc[insight.gender] || 0) + 1;
  }
  return acc;
}, {});

const founderByAge = founderInsights.reduce((acc, insight) => {
  if (insight.age_range) {
    acc[insight.age_range] = (acc[insight.age_range] || 0) + 1;
  }
  return acc;
}, {});

// Business-specific analytics
const businessByStage = businessInsights.reduce((acc, insight) => {
  if (insight.business_stage) {
    acc[insight.business_stage] = (acc[insight.business_stage] || 0) + 1;
  }
  return acc;
}, {});

const businessByFunding = businessInsights.reduce((acc, insight) => {
  if (insight.current_funding_source) {
    acc[insight.current_funding_source] = (acc[insight.current_funding_source] || 0) + 1;
  }
  return acc;
}, {});

// STEP 5: Update API endpoints (if any)
// =====================================================

// OLD: Single endpoint
// POST /api/insights - handles both founder and business insights

// NEW: Separate endpoints
// POST /api/founder-insights - handles founder insights only
// POST /api/business-insights - handles business insights only

// STEP 6: Update database queries in other parts of the app
// =====================================================

// Search for all references to 'business_insights_snapshots' and update:
// - Admin dashboards
// - User profiles
// - Business profiles
// - Analytics queries
// - Export functions

// STEP 7: Testing checklist
// =====================================================

// [ ] FounderInsightsAccordion saves to founder_insights table
// [ ] Business forms save to business_insights table
// [ ] Insights page shows both founder and business data
// [ ] Analytics work correctly with separated data
// [ ] RLS policies work properly
// [ ] No data loss during migration
// [ ] Performance is acceptable
// [ ] Error handling works for both tables

// STEP 8: Rollback plan (if needed)
// =====================================================

// If migration fails, rollback:
// 1. DROP TABLE founder_insights;
// 2. DROP TABLE business_insights;
// 3. RENAME business_insights_snapshots_backup TO business_insights_snapshots;
// 4. Revert component changes
