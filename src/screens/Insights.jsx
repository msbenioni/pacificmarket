import { useState, useEffect } from "react";
import { Building2, Users, TrendingUp, Rocket, ChevronDown, ChevronUp, Globe, Target, Lightbulb, AlertCircle } from "lucide-react";
import HeroRegistry from "@/components/shared/HeroRegistry";
import HorizontalBar from "@/components/insights/HorizontalBar";
import { getPublicBusinesses } from "@/lib/supabase/queries/businesses";
import { getSupabase } from "@/lib/supabase/client";
import { getBusinessTier, getBusinessCountryDisplay, getBusinessIndustryDisplay } from "@/lib/business/helpers";
import { tally } from "@/lib/utils";
import { BUSINESS_STATUS, BUSINESS_STAGE, BUSINESS_CHALLENGES, FOUNDER_MOTIVATIONS, COUNTRIES } from "@/constants/unifiedConstants";

// Fetch insights data from actual business tables
const fetchInsightsData = async () => {
  try {
    const supabase = getSupabase();
    
    // First, let's check if the table exists and we have access
    console.log('Attempting to fetch from business_insights table...');
    
    // Fetch data from business_insights table with correct column names
    const { data: insightsData, error: insightsError } = await supabase
      .from('business_insights')
      .select(`
        id,
        business_id,
        user_id,
        business_stage,
        top_challenges,
        hiring_intentions,
        business_operating_status,
        business_age,
        business_registered,
        employs_anyone,
        employs_family_community,
        team_size_band,
        revenue_band,
        current_funding_source,
        funding_amount_needed,
        funding_purpose,
        investment_stage,
        investment_exploration,
        community_impact_areas,
        support_needed_next,
        current_support_sources,
        expansion_plans,
        industry,
        snapshot_year,
        submitted_date,
        created_at,
        updated_at
      `);

    if (insightsError) {
      console.error('Business insights query error:', {
        message: insightsError.message,
        details: insightsError.details,
        hint: insightsError.hint,
        code: insightsError.code
      });
      
      // Try to fetch from founder_insights as fallback
      console.log('Trying fallback to founder_insights table...');
      const { data: founderData, error: founderError } = await supabase
        .from('founder_insights')
        .select(`
          id,
          user_id,
          snapshot_year,
          submitted_date,
          created_at,
          updated_at,
          gender,
          age_range,
          years_entrepreneurial,
          businesses_founded,
          founder_role,
          founder_motivation_array,
          pacific_identity,
          based_in_country,
          based_in_city,
          serves_pacific_communities,
          culture_influences_business,
          family_community_responsibilities_impact,
          has_mentorship_access,
          offers_mentorship,
          barriers_to_mentorship,
          angel_investor_interest,
          investor_capacity,
          has_collaboration_interest,
          is_open_to_future_contact,
          goals_next_12_months_array
        `);

      if (founderError) {
        console.error('Founder insights query error:', {
          message: founderError.message,
          details: founderError.details,
          hint: founderError.hint,
          code: founderError.code
        });
        return [];
      }

      console.log('Successfully fetched from founder_insights:', founderData?.length || 0, 'records');
      return founderData || [];
    }

    console.log('Successfully fetched from business_insights:', insightsData?.length || 0, 'records');
    return insightsData || [];
  } catch (error) {
    console.error('Unexpected error in fetchInsightsData:', {
      message: error.message,
      stack: error.stack
    });
    return [];
  }
};

// Country standardization function
const standardizeCountry = (countryValue) => {
  if (!countryValue) return countryValue;
  
  // Create a mapping of common variations to standard values
  const countryMap = {
    // New Zealand variations
    'new zealand': 'new-zealand',
    'New Zealand': 'new-zealand',
    'NEW ZEALAND': 'new-zealand',
    'nz': 'new-zealand',
    'NZ': 'new-zealand',
    
    // United States variations
    'usa': 'usa',
    'USA': 'usa',
    'United States': 'usa',
    'united states': 'usa',
    'US': 'usa',
    'U.S.A.': 'usa',
    'U.S.': 'usa',
    
    // Europe variations
    'France': 'france',
    'FRANCE': 'france',
    'United Kingdom': 'united-kingdom',
    'UK': 'united-kingdom',
    'uk': 'united-kingdom',
    'Germany': 'germany',
    'Canada': 'canada',
    'Spain': 'spain',
    'Italy': 'italy',
    'Netherlands': 'netherlands',
    'Belgium': 'belgium',
    'Switzerland': 'switzerland',
    'Norway': 'norway',
    'Sweden': 'sweden',
    'Denmark': 'denmark',
    'Finland': 'finland',
    'Ireland': 'ireland',
    'Portugal': 'portugal',
    
    // Asia-Pacific variations
    'China': 'china',
    'Japan': 'japan',
    'South Korea': 'south-korea',
    'Singapore': 'singapore',
    'Hong Kong': 'hong-kong',
    'Taiwan': 'taiwan',
    'Indonesia': 'indonesia',
    'Malaysia': 'malaysia',
    'Thailand': 'thailand',
    'Philippines': 'philippines',
    'Vietnam': 'vietnam',
    'India': 'india',
    
    // Middle East variations
    'United Arab Emirates': 'united-arab-emirates',
    'UAE': 'united-arab-emirates',
    'Qatar': 'qatar',
    'Saudi Arabia': 'saudi-arabia',
    
    // Americas variations
    'Mexico': 'mexico',
    'Brazil': 'brazil',
    'Argentina': 'argentina',
    'Chile': 'chile',
    'Peru': 'peru',
    'Colombia': 'colombia',
    
    // Africa variations
    'South Africa': 'south-africa',
    'Kenya': 'kenya',
    'Nigeria': 'nigeria',
    'Egypt': 'egypt',
    
    // Pacific variations
    'French Polynesia': 'french-polynesia',
    'Papua New Guinea': 'papua-new-guinea',
    'Solomon Islands': 'solomon-islands',
    'Cook Islands': 'cook-islands',
    'American Samoa': 'american-samoa',
    'Western Samoa': 'samoa',
    'New Caledonia': 'new-caledonia',
    'Northern Mariana Islands': 'northern-mariana-islands',
    'Wallis and Futuna': 'wallis-futuna',
    
    // Fiji variations  
    'FIJI': 'fiji',
    'Fiji': 'fiji',
    
    // Australia variations
    'australia': 'australia',
    'Australia': 'australia',
    'AUS': 'australia',
    'AU': 'australia',
    
    // Samoa variations
    'samoa': 'samoa',
    'Samoa': 'samoa',
    'SAMOA': 'samoa',
    
    // Tonga variations
    'tonga': 'tonga',
    'Tonga': 'tonga',
    'TONGA': 'tonga',
    
    // Other common variations
    'DE': 'germany',
    'CA': 'canada',
    'ES': 'spain',
    'IT': 'italy',
    'NL': 'netherlands',
    'BE': 'belgium',
    'CH': 'switzerland',
    'NO': 'norway',
    'SE': 'sweden',
    'DK': 'denmark',
    'FI': 'finland',
    'IE': 'ireland',
    'PT': 'portugal',
    'CN': 'china',
    'JP': 'japan',
    'KR': 'south-korea',
    'SG': 'singapore',
    'TW': 'taiwan',
    'ID': 'indonesia',
    'MY': 'malaysia',
    'TH': 'thailand',
    'PH': 'philippines',
    'VN': 'vietnam',
    'IN': 'india',
    'AE': 'united-arab-emirates',
    'QA': 'qatar',
    'SA': 'saudi-arabia',
    'MX': 'mexico',
    'BR': 'brazil',
    'AR': 'argentina',
    'CL': 'chile',
    'PE': 'peru',
    'CO': 'colombia',
    'ZA': 'south-africa',
    'KE': 'kenya',
    'NG': 'nigeria',
    'EG': 'egypt',
  };
  
  // Check if the value already matches a standard country value
  const standardCountry = COUNTRIES.find(c => c.value === countryValue);
  if (standardCountry) return countryValue;
  
  // Try to find in mapping
  return countryMap[countryValue] || countryValue;
};

// Get country label from standardized value
const getCountryLabel = (countryValue) => {
  const country = COUNTRIES.find(c => c.value === countryValue);
  return country ? country.label : countryValue;
};

// Helper functions to convert database values to user-friendly labels
const getBusinessStageLabel = (stageValue) => {
  const stage = Object.entries(BUSINESS_STAGE).find(([key, value]) => value === stageValue);
  return stage ? stage[0].replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : stageValue;
};

const getChallengeLabel = (challengeValue) => {
  const challenge = BUSINESS_CHALLENGES.find(c => c.value === challengeValue);
  return challenge ? challenge.label : challengeValue;
};

const getMotivationLabel = (motivationValue) => {
  const motivation = FOUNDER_MOTIVATIONS.find(m => m.value === motivationValue);
  return motivation ? motivation.label : motivationValue;
};

const UI = {
  page: "bg-[#eef0f5]",
  wrap: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6 sm:space-y-8",
  card: "rounded-2xl border border-gray-200/70 bg-gradient-to-b from-white to-[#fbfcff] shadow-[0_18px_50px_rgba(10,22,40,0.08)]",
  cardInner: "p-5 sm:p-6",
  sectionKicker: "text-xs font-bold tracking-[0.22em] uppercase text-[#0a1628]/50",
  sectionTitle: "text-lg font-semibold text-[#0a1628]",
  sectionDesc: "text-sm text-[#0a1628]/60 mt-1",
  chip: "px-3 py-1 rounded-full border border-gray-200 bg-white text-sm text-[#0a1628]/80",
  chipStrong: "text-[#0a1628] font-semibold",
  mobileSection: "rounded-2xl border border-gray-200/70 bg-white shadow-sm",
  mobileSectionInner: "p-5",
  mobileSubCard: "rounded-xl border border-gray-200/70 bg-white p-4",
};

export default function Insights() {
  const [businesses, setBusinesses] = useState([]);
  const [insights, setInsights] = useState([]); // Change back to array for actual insights data
  const [loading, setLoading] = useState(false);
  const [openSections, setOpenSections] = useState({
    demographics: true,
    founder: false,
    support: false,
    landscape: false,
    tiers: false,
  });

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    const loadInsightsData = async () => {
      setLoading(true);
      try {
        const [businessesResult, insightsData] = await Promise.all([
          getPublicBusinesses({ limit: 500 }),
          fetchInsightsData()
        ]);
        
        // Handle the actual data structure from business tables
        const businessesData = businessesResult?.data || [];
        const insightsArray = Array.isArray(insightsData) ? insightsData : [];
        
        setBusinesses(businessesData);
        setInsights(insightsArray); // Set as array of insights records
        setLoading(false);
      } catch (error) {
        console.error('Error loading insights data:', error);
        setLoading(false);
      }
    };
    
    loadInsightsData();
  }, []); // Empty dependency array to run only once
  
  const total = businesses.length;
  const insightsCount = insights.length; // Update to use length of insights array
  // Business metrics
  // Standardize countries for accurate analytics using helper functions
  const standardizedBusinesses = businesses.map(business => ({
    ...business,
    country: standardizeCountry(business.country),
    tier: getBusinessTier(business) // Use helper for consistency
  }));
  
  const byCountry = tally(standardizedBusinesses, "country")
    .map(item => ({ 
      label: getCountryLabel(item.label), 
      value: item.value 
    }));
  const byIndustry = tally(businesses, "industry");
  const byTier = tally(standardizedBusinesses, "tier"); // Use standardized tier data
  const totalTierCount = byTier.reduce((sum, tier) => sum + tier.value, 0);
  const byTierPercentage = totalTierCount > 0
    ? byTier.map(tier => ({
        label: tier.label,
        value: Math.round((tier.value / totalTierCount) * 100)
      }))
    : [];

// Process actual insights data from business_insights and founder_insights tables
// Check if data comes from founder_insights (has has_collaboration_interest) or business_insights
const isFounderInsights = insights.length > 0 && insights[0].has_collaboration_interest !== undefined;

const collaborationRate = insights.length > 0
  ? Math.round((insights.filter(i => i.collaboration_interest).length / insights.length) * 100)
  : 0;

const mentorshipOfferingRate = insights.length > 0
  ? Math.round((insights.filter(i => i.mentorship_offering).length / insights.length) * 100)
  : 0;

const investmentInterestRate = insights.length > 0
  ? Math.round((insights.filter(i => i.investment_stage).length / insights.length) * 100)
  : 0;

// Business stage analysis from actual insights data
const byBusinessStage = BUSINESS_STAGE
  .map(stage => ({
    label: stage.label, 
    value: insights.filter(i => i.business_stage_id === stage.value).length
  }));

// Challenges analysis from actual insights data
const allChallenges = insights.reduce((acc, insight) => {
  if (insight.top_challenges && Array.isArray(insight.top_challenges)) {
    insight.top_challenges.forEach(challenge => {
      acc[challenge] = (acc[challenge] || 0) + 1;
    });
  }
  return acc;
}, {});

const topChallenges = Object.entries(allChallenges)
  .map(([challenge, count]) => ({ 
    label: getChallengeLabel(challenge), 
    value: count 
  }))
  .sort((a, b) => b.value - a.value)
  .slice(0, 5);

// Check if we have founder insights data (from founder_insights table)
const hasFounderData = insights.some(i => i.gender || i.age_range || i.years_entrepreneurial);

// Founder demographics (from founder_insights data)
const genderData = hasFounderData
  ? insights.reduce((acc, insight) => {
      if (insight.gender) {
        acc[insight.gender] = (acc[insight.gender] || 0) + 1;
      }
      return acc;
    }, {})
  : {};

const ageData = hasFounderData
  ? insights.reduce((acc, insight) => {
      if (insight.age_range) {
        acc[insight.age_range] = (acc[insight.age_range] || 0) + 1;
      }
      return acc;
    }, {})
  : {};

// Calculate founder experience (years as entrepreneur) - only from founder_insights
const yearsEntrepreneurial = insights
  .filter(i => i.years_entrepreneurial)
  .map(i => i.years_entrepreneurial)
  .filter(years => years && years !== "");

const avgYearsInBusiness = yearsEntrepreneurial.length > 0 
  ? Math.round(yearsEntrepreneurial.reduce((sum, years) => sum + parseInt(years), 0) / yearsEntrepreneurial.length)
  : 0;

// Motivation analysis - only from founder_insights
const motivationKeywords = insights.reduce((acc, insight) => {
  if (insight.founder_motivation_array && Array.isArray(insight.founder_motivation_array)) {
    insight.founder_motivation_array.forEach(motivation => {
      acc[motivation] = (acc[motivation] || 0) + 1;
    });
  }
  return acc;
}, {});

// Family responsibilities data
const familyResponsibilityData = insights.reduce((acc, insight) => {
  if (insight.family_community_responsibilities_impact && Array.isArray(insight.family_community_responsibilities_impact)) {
    insight.family_community_responsibilities_impact.forEach(responsibility => {
      acc[responsibility] = (acc[responsibility] || 0) + 1;
    });
  }
  return acc;
}, {});

  return (
    <div className={`min-h-screen ${UI.page}`}>
      <HeroRegistry
        badge="Pacific Market Insights"
        title="Founder Journey Analytics"
        subtitle="Real-time insights from Pacific entrepreneurs"
        description={(
          <>
            <span className="sm:hidden">Founder insights that highlight the most important Pacific business signals.</span>
            <span className="hidden sm:inline">Comprehensive analytics based on real founder insights and business data. Track trends, understand challenges, and identify opportunities across the Pacific business ecosystem.</span>
          </>
        )}
        showStats={false}
      />

      <div className={UI.wrap}>
        <p className="text-xs text-[#0a1628]/55 -mt-3 sm:-mt-4">
          <span className="font-semibold text-[#0a1628]">Data Source:</span>
          <span className="block sm:inline"> {total} active businesses • {insightsCount} founder insights • Real-time analytics •</span>
          <span className="block sm:inline italic"> Powered by founder-submitted journey data and business registry information.</span>
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#0d4f4f] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-[#0a1628]/60 mt-2">Loading insights data...</p>
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className={`${UI.card} ${UI.cardInner}`}>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[#0a1628]/55">Investment Interest</p>
                  <TrendingUp className="w-4 h-4 text-[#10b981]" />
                </div>
                <p className="text-2xl sm:text-3xl font-semibold mt-2 text-[#0a1628]">{investmentInterestRate}%</p>
                <p className="text-sm text-[#0a1628]/60 mt-2">
                  Looking to invest in businesses
                </p>
              </div>

              <div className={`${UI.card} ${UI.cardInner}`}>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[#0a1628]/55">Collaboration Interest</p>
                  <Rocket className="w-4 h-4 text-[#f59e0b]" />
                </div>
                <p className="text-2xl sm:text-3xl font-semibold mt-2 text-[#0a1628]">{collaborationRate}%</p>
                <p className="text-sm text-[#0a1628]/60 mt-2">
                  Interested in collaborating
                </p>
              </div>

              <div className={`${UI.card} ${UI.cardInner}`}>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[#0a1628]/55">Mentorship Offering</p>
                  <Lightbulb className="w-4 h-4 text-[#8b5cf6]" />
                </div>
                <p className="text-2xl sm:text-3xl font-semibold mt-2 text-[#0a1628]">{mentorshipOfferingRate}%</p>
                <p className="text-sm text-[#0a1628]/60 mt-2">
                  Open to mentoring others
                </p>
              </div>
            </div>

            {/* Demographics (mobile) */}
            <div className="lg:hidden space-y-4">
              <button
                type="button"
                onClick={() => toggleSection("demographics")}
                className={`${UI.card} ${UI.cardInner} w-full flex items-center justify-between`}
              >
                <div>
                  <p className={UI.sectionTitle}>Demographics</p>
                  <p className={UI.sectionDesc}>Gender and age breakdown</p>
                </div>
                {openSections.demographics ? (
                  <ChevronUp className="w-4 h-4 text-[#0a1628]/60" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#0a1628]/60" />
                )}
              </button>
              {openSections.demographics && (
                <div className="space-y-4">
                  <div className={`${UI.card} ${UI.cardInner}`}>
                    <h3 className={UI.sectionTitle}>Gender Distribution</h3>
                    <p className={UI.sectionDesc}>Gender breakdown of Pacific entrepreneurs</p>
                    <div className="mt-4 space-y-2">
                      {Object.entries(genderData)
                        .map(([gender, count]) => ({
                          label: gender.charAt(0).toUpperCase() + gender.slice(1).replace('_', ' '),
                          value: count
                        }))
                        .sort((a, b) => b.value - a.value)
                        .map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm text-[#0a1628]">{item.label}</span>
                            <span className="text-sm font-semibold text-[#0a1628]">{item.value}</span>
                          </div>
                        ))}
                      {Object.keys(genderData).length === 0 && (
                        <p className="text-sm text-[#0a1628]/60 text-center py-4">No gender data available</p>
                      )}
                    </div>
                  </div>

                  <div className={`${UI.card} ${UI.cardInner}`}>
                    <h3 className={UI.sectionTitle}>Age Distribution</h3>
                    <p className={UI.sectionDesc}>Age ranges of Pacific entrepreneurs</p>
                    <div className="mt-4 space-y-2">
                      {Object.entries(ageData)
                        .map(([age, count]) => ({
                          label: age,
                          value: count
                        }))
                        .sort((a, b) => b.value - a.value)
                        .map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm text-[#0a1628]">{item.label}</span>
                            <span className="text-sm font-semibold text-[#0a1628]">{item.value}</span>
                          </div>
                        ))}
                      {Object.keys(ageData).length === 0 && (
                        <p className="text-sm text-[#0a1628]/60 text-center py-4">No age data available</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Demographics (desktop) */}
            <div className="hidden lg:grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={`${UI.card} ${UI.cardInner}`}>
                <h3 className={UI.sectionTitle}>Gender Distribution</h3>
                <p className={UI.sectionDesc}>Gender breakdown of Pacific entrepreneurs</p>
                <div className="mt-4 space-y-2">
                  {Object.entries(genderData)
                    .map(([gender, count]) => ({ 
                      label: gender.charAt(0).toUpperCase() + gender.slice(1).replace('_', ' '), 
                      value: count 
                    }))
                    .sort((a, b) => b.value - a.value)
                    .map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-[#0a1628]">{item.label}</span>
                        <span className="text-sm font-semibold text-[#0a1628]">{item.value}</span>
                      </div>
                    ))}
                  {Object.keys(genderData).length === 0 && (
                    <p className="text-sm text-[#0a1628]/60 text-center py-4">No gender data available</p>
                  )}
                </div>
              </div>

              <div className={`${UI.card} ${UI.cardInner}`}>
                <h3 className={UI.sectionTitle}>Age Distribution</h3>
                <p className={UI.sectionDesc}>Age ranges of Pacific entrepreneurs</p>
                <div className="mt-4 space-y-2">
                  {Object.entries(ageData)
                    .map(([age, count]) => ({ 
                      label: age, 
                      value: count 
                    }))
                    .sort((a, b) => b.value - a.value)
                    .map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-[#0a1628]">{item.label}</span>
                        <span className="text-sm font-semibold text-[#0a1628]">{item.value}</span>
                      </div>
                    ))}
                  {Object.keys(ageData).length === 0 && (
                    <p className="text-sm text-[#0a1628]/60 text-center py-4">No age data available</p>
                  )}
                </div>
              </div>
            </div>

            {/* Founder & Business (mobile) */}
            <div className="lg:hidden space-y-4">
              <button
                type="button"
                onClick={() => toggleSection("founder")}
                className={`${UI.card} ${UI.cardInner} w-full flex items-center justify-between`}
              >
                <div>
                  <p className={UI.sectionTitle}>Founder & Business</p>
                  <p className={UI.sectionDesc}>Motivations and business stages</p>
                </div>
                {openSections.founder ? (
                  <ChevronUp className="w-4 h-4 text-[#0a1628]/60" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#0a1628]/60" />
                )}
              </button>
              {openSections.founder && (
                <div className="space-y-4">
                  <div className={`${UI.card} ${UI.cardInner}`}>
                    <h3 className={UI.sectionTitle}>Founder Motivations</h3>
                    <p className={UI.sectionDesc}>What drives Pacific entrepreneurs to start businesses?</p>
                    <div className="mt-4">
                      <HorizontalBar 
                        title="Founder Motivations" 
                        data={Object.entries(motivationKeywords)
                          .map(([motivation, count]) => ({ 
                            label: getMotivationLabel(motivation), 
                            value: count 
                          }))
                          .sort((a, b) => b.value - a.value)
                          .slice(0, 5)} 
                        color="#8b5cf6" 
                        maxHeight="220px"
                        valueFormatter={() => ""} // Hide actual counts
                      />
                    </div>
                  </div>

                  <div className={`${UI.card} ${UI.cardInner}`}>
                    <h3 className={UI.sectionTitle}>Business Stages</h3>
                    <p className={UI.sectionDesc}>Current maturity of Pacific enterprises</p>
                    <div className="mt-4">
                      <HorizontalBar title="Business Stages" data={byBusinessStage} color="#0d4f4f" maxHeight="220px" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Founder & Business (desktop) */}
            <div className="hidden lg:grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={`${UI.card} ${UI.cardInner}`}>
                <h3 className={UI.sectionTitle}>Founder Motivations</h3>
                <p className={UI.sectionDesc}>What drives Pacific entrepreneurs to start businesses?</p>
                <div className="mt-4">
                  <HorizontalBar 
                    title="Founder Motivations" 
                    data={Object.entries(motivationKeywords)
                      .map(([motivation, count]) => ({ 
                        label: getMotivationLabel(motivation), 
                        value: count 
                      }))
                      .sort((a, b) => b.value - a.value)
                      .slice(0, 5)} 
                    color="#8b5cf6" 
                    valueFormatter={() => ""} // Hide actual counts
                  />
                </div>
              </div>

              <div className={`${UI.card} ${UI.cardInner}`}>
                <h3 className={UI.sectionTitle}>Business Stages</h3>
                <p className={UI.sectionDesc}>Current maturity of Pacific enterprises</p>
                <div className="mt-4">
                  <HorizontalBar title="Business Stages" data={byBusinessStage} color="#0d4f4f" />
                </div>
              </div>
            </div>

            {/* Challenges & Support (mobile) */}
            <div className="lg:hidden space-y-4">
              <button
                type="button"
                onClick={() => toggleSection("support")}
                className={`${UI.card} ${UI.cardInner} w-full flex items-center justify-between`}
              >
                <div>
                  <p className={UI.sectionTitle}>Challenges & Support</p>
                  <p className={UI.sectionDesc}>Top hurdles and family responsibilities</p>
                </div>
                {openSections.support ? (
                  <ChevronUp className="w-4 h-4 text-[#0a1628]/60" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#0a1628]/60" />
                )}
              </button>
              {openSections.support && (
                <div className="space-y-4">
                  <div className={`${UI.card} ${UI.cardInner}`}>
                    <h3 className={UI.sectionTitle}>Top Challenges</h3>
                    <p className={UI.sectionDesc}>Biggest hurdles facing Pacific entrepreneurs</p>
                    <div className="mt-4">
                      <HorizontalBar 
                        title="Top Challenges" 
                        data={topChallenges} 
                        color="#ef4444" 
                        maxHeight="220px"
                        valueFormatter={() => ""} // Hide actual counts
                      />
                    </div>
                  </div>

                  <div className={`${UI.card} ${UI.cardInner}`}>
                    <h3 className={UI.sectionTitle}>Family Responsibilities</h3>
                    <p className={UI.sectionDesc}>Family & community commitments alongside business</p>
                    <div className="mt-4">
                      <HorizontalBar 
                        title="Family Responsibilities" 
                        data={Object.entries(familyResponsibilityData)
                          .map(([responsibility, count]) => ({ 
                            label: responsibility.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), 
                            value: count 
                          }))
                          .sort((a, b) => b.value - a.value)
                          .slice(0, 5)} 
                        color="#10b981" 
                        maxHeight="220px"
                        valueFormatter={() => ""} // Hide actual counts
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Challenges & Support (desktop) */}
            <div className="hidden lg:grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={`${UI.card} ${UI.cardInner}`}>
                <h3 className={UI.sectionTitle}>Top Challenges</h3>
                <p className={UI.sectionDesc}>Biggest hurdles facing Pacific entrepreneurs</p>
                <div className="mt-4">
                  <HorizontalBar title="Top Challenges" data={topChallenges} color="#ef4444" valueFormatter={() => ""} />
                </div>
              </div>

              <div className={`${UI.card} ${UI.cardInner}`}>
                <h3 className={UI.sectionTitle}>Family Responsibilities</h3>
                <p className={UI.sectionDesc}>Family & community commitments alongside business</p>
                <div className="mt-4">
                  <HorizontalBar 
                    title="Family Responsibilities" 
                    data={Object.entries(familyResponsibilityData)
                      .map(([responsibility, count]) => ({ 
                        label: responsibility.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), 
                        value: count 
                      }))
                      .sort((a, b) => b.value - a.value)
                      .slice(0, 5)} 
                    color="#10b981" 
                    valueFormatter={() => ""} // Hide actual counts
                  />
                </div>
              </div>
            </div>

            {/* Geography & Industry (mobile) */}
            <div className="lg:hidden space-y-4">
              <button
                type="button"
                onClick={() => toggleSection("landscape")}
                className={`${UI.card} ${UI.cardInner} w-full flex items-center justify-between`}
              >
                <div>
                  <p className={UI.sectionTitle}>Geography & Industry</p>
                  <p className={UI.sectionDesc}>Distribution across regions and sectors</p>
                </div>
                {openSections.landscape ? (
                  <ChevronUp className="w-4 h-4 text-[#0a1628]/60" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#0a1628]/60" />
                )}
              </button>
              {openSections.landscape && (
                <div className="space-y-4">
                  <div className={`${UI.card} ${UI.cardInner}`}>
                    <h3 className={UI.sectionTitle}>Geographic Distribution</h3>
                    <p className={UI.sectionDesc}>Pacific businesses by country</p>
                    <div className="mt-4">
                      <HorizontalBar title="Geographic Distribution" data={byCountry.slice(0, 6)} color="#0d4f4f" maxHeight="220px" />
                    </div>
                  </div>

                  <div className={`${UI.card} ${UI.cardInner}`}>
                    <h3 className={UI.sectionTitle}>Industry Breakdown</h3>
                    <p className={UI.sectionDesc}>Business sectors across the Pacific</p>
                    <div className="mt-4">
                      <HorizontalBar title="Industry Breakdown" data={byIndustry.slice(0, 6)} color="#00c4cc" maxHeight="220px" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Geography & Industry (desktop) */}
            <div className="hidden lg:grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={`${UI.card} ${UI.cardInner}`}>
                <h3 className={UI.sectionTitle}>Geographic Distribution</h3>
                <p className={UI.sectionDesc}>Pacific businesses by country</p>
                <div className="mt-4">
                  <HorizontalBar title="Geographic Distribution" data={byCountry.slice(0, 10)} color="#0d4f4f" />
                </div>
              </div>

              <div className={`${UI.card} ${UI.cardInner}`}>
                <h3 className={UI.sectionTitle}>Industry Breakdown</h3>
                <p className={UI.sectionDesc}>Business sectors across the Pacific</p>
                <div className="mt-4">
                  <HorizontalBar title="Industry Breakdown" data={byIndustry.slice(0, 10)} color="#00c4cc" />
                </div>
              </div>
            </div>

            {/* Subscription Tiers (mobile) */}
            <div className="lg:hidden space-y-4">
              <button
                type="button"
                onClick={() => toggleSection("tiers")}
                className={`${UI.card} ${UI.cardInner} w-full flex items-center justify-between`}
              >
                <div>
                  <p className={UI.sectionTitle}>Subscription Tiers</p>
                  <p className={UI.sectionDesc}>Network participation levels</p>
                </div>
                {openSections.tiers ? (
                  <ChevronUp className="w-4 h-4 text-[#0a1628]/60" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#0a1628]/60" />
                )}
              </button>
              {openSections.tiers && (
                <div className={`${UI.card} ${UI.cardInner} overflow-hidden`}>
                  <h3 className={UI.sectionTitle}>Subscription Tiers</h3>
                  <p className={UI.sectionDesc}>Business network participation levels</p>
                  <div className="mt-4 overflow-x-auto">
                    <HorizontalBar
                      title="Subscription Tiers"
                      data={byTierPercentage}
                      color="#c9a84c"
                      valueFormatter={(value) => `${value}%`}
                      maxHeight="220px"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Subscription Tiers (desktop) */}
            <div className="hidden lg:block">
              <div className={`${UI.card} ${UI.cardInner} overflow-hidden`}>
                <h3 className={UI.sectionTitle}>Subscription Tiers</h3>
                <p className={UI.sectionDesc}>Business network participation levels</p>
                <div className="mt-4 overflow-x-auto">
                  <HorizontalBar
                    title="Subscription Tiers"
                    data={byTierPercentage}
                    color="#c9a84c"
                    valueFormatter={(value) => `${value}%`}
                  />
                </div>
              </div>
            </div>

          </>
        )}

        <div className={`${UI.card} p-6`}>
          <p className="text-sm text-[#0a1628]/70">
            <span className="font-semibold text-[#0a1628]">About this data:</span> These insights reflect <span className="font-semibold text-[#0a1628]">approved & active</span> listings in the Pacific Market — the first structured global dataset of Pacific-owned enterprise. Figures update in real time as new businesses are approved and founders share their journey data. For research access, bulk data exports, policy enquiries, or methodology questions, contact the registry team.
          </p>
        </div>
      </div>
    </div>
  );
}