import { useState, useEffect } from "react";
import { getSupabase } from "@/lib/supabase/client";
import { Building2, Users, TrendingUp, Rocket } from "lucide-react";
import { BUSINESS_STATUS, BUSINESS_TIER, COUNTRIES } from "@/constants/unifiedConstants";
import HeroRegistry from "../components/shared/HeroRegistry";
import HorizontalBar from "../components/insights/HorizontalBar";

function tally(arr, key) {
  const map = {};
  arr.forEach(item => {
    const val = item[key];
    if (val) map[val] = (map[val] || 0) + 1;
  });
  return Object.entries(map)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

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

const UI = {
  page: "bg-[#eef0f5]",
  wrap: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8",
  card: "rounded-2xl border border-gray-200/70 bg-gradient-to-b from-white to-[#fbfcff] shadow-[0_18px_50px_rgba(10,22,40,0.08)]",
  cardInner: "p-6",
  sectionKicker: "text-xs font-bold tracking-[0.22em] uppercase text-[#0a1628]/50",
  sectionTitle: "text-lg font-semibold text-[#0a1628]",
  sectionDesc: "text-sm text-[#0a1628]/60 mt-1",
  chip: "px-3 py-1 rounded-full border border-gray-200 bg-white text-sm text-[#0a1628]/80",
  chipStrong: "text-[#0a1628] font-semibold",
};

export default function Insights() {
  const [businesses, setBusinesses] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadInsightsData = async () => {
      setLoading(true);
      try {
        const supabase = getSupabase();
        
        const [businessesResult, insightsData] = await Promise.all([
          supabase
            .from('businesses')
            .select('*')
            .eq('status', BUSINESS_STATUS.ACTIVE),
          fetchInsightsData()
        ]);
        
        setBusinesses(businessesResult.data || []);
        setInsights(insightsData || []);
        setLoading(false);
      } catch (error) {
        console.error('Error loading insights data:', error);
        setLoading(false);
      }
    };

    loadInsightsData();
  }, []);

  const fetchInsightsData = async () => {
    try {
      const { getSupabase } = await import('../lib/supabase/client');
      const supabase = getSupabase();
      
      const { data, error } = await supabase
        .from('latest_business_insights')
        .select('*');
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching insights:', error);
      return [];
    }
  };

  const total = businesses.length;
  const verified = businesses.filter(b => b.verified).length;
  const countries = new Set(businesses.map(b => b.country).filter(Boolean)).size;
  const insightsCount = insights.length;
  
  // Business metrics
  // Standardize countries for accurate analytics
  const standardizedBusinesses = businesses.map(business => ({
    ...business,
    country: standardizeCountry(business.country)
  }));
  
  const byCountry = tally(standardizedBusinesses, "country")
    .map(item => ({ 
      label: getCountryLabel(item.label), 
      value: item.value 
    }));
  const byIndustry = tally(businesses, "industry");
  const byTier = tally(businesses, "subscription_tier");
  const totalTierCount = byTier.reduce((sum, tier) => sum + tier.value, 0);
  const byTierPercentage = totalTierCount > 0
    ? byTier.map(tier => ({
        label: tier.label,
        value: Math.round((tier.value / totalTierCount) * 100),
      }))
    : [];
  
  // Founder insights metrics
  const byBusinessStage = tally(insights, "business_stage");
  
  // Calculate founder experience (years as entrepreneur)
  const yearsEntrepreneurial = insights
    .map(i => i.years_entrepreneurial)
    .filter(years => years && years !== "");
  
  const avgYearsInBusiness = yearsEntrepreneurial.length > 0 
    ? (yearsEntrepreneurial.reduce((sum, years) => sum + parseInt(years), 0) / yearsEntrepreneurial.length).toFixed(1)
    : "0.0";

  // Motivation analysis
  const motivationKeywords = insights.reduce((acc, insight) => {
    if (insight.founder_motivation_array && Array.isArray(insight.founder_motivation_array)) {
      insight.founder_motivation_array.forEach(motivation => {
        acc[motivation] = (acc[motivation] || 0) + 1;
      });
    }
    return acc;
  }, {});

  // Challenges analysis
  const allChallenges = insights.reduce((acc, insight) => {
    if (insight.top_challenges && Array.isArray(insight.top_challenges)) {
      insight.top_challenges.forEach(challenge => {
        acc[challenge] = (acc[challenge] || 0) + 1;
      });
    }
    return acc;
  }, {});

  const topChallenges = Object.entries(allChallenges)
    .map(([challenge, count]) => ({ label: challenge, value: count }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // Hiring intentions - using expansion_plans as proxy since hiring_intentions was removed
  const hiringIntentionRate = insights.length > 0 
    ? Math.round((insights.filter(i => i.expansion_plans).length / insights.length) * 100)
    : 0;

  // Family responsibilities - using family_community_responsibilities_affect_business as proxy
  const familyResponsibilityRate = insights.length > 0
    ? Math.round((insights.filter(i => i.family_community_responsibilities_affect_business).length / insights.length) * 100)
    : 0;

  // Collaboration interest
  const collaborationRate = insights.length > 0
    ? Math.round((insights.filter(i => i.collaboration_interest).length / insights.length) * 100)
    : 0;

  return (
    <div className={`min-h-screen ${UI.page}`}>
      <HeroRegistry
        badge="Pacific Market Insights"
        title="Founder Journey Analytics"
        subtitle="Real-time insights from Pacific entrepreneurs"
        description="Comprehensive analytics based on real founder insights and business data. Track trends, understand challenges, and identify opportunities across the Pacific business ecosystem."
        showStats={false}
      />

      <div className={UI.wrap}>
        <p className="text-xs text-[#0a1628]/55 -mt-4">
          <span className="font-semibold text-[#0a1628]">Data Source:</span> {total} active businesses • {insightsCount} founder insights • Real-time analytics • 
          <span className="italic">Powered by founder-submitted journey data and business registry information.</span>
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#0d4f4f] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-[#0a1628]/60 mt-2">Loading insights data...</p>
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className={`${UI.card} ${UI.cardInner}`}>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[#0a1628]/55">Pacific Enterprises</p>
                  <Building2 className="w-4 h-4 text-[#00c4cc]" />
                </div>
                <p className="text-3xl font-semibold mt-2 text-[#0a1628]">{total}</p>
                <p className="text-sm text-[#0a1628]/60 mt-2">
                  {verified} verified • {countries} countries
                </p>
              </div>

              <div className={`${UI.card} ${UI.cardInner}`}>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[#0a1628]/55">Founder Insights</p>
                  <Users className="w-4 h-4 text-[#0d4f4f]" />
                </div>
                <p className="text-3xl font-semibold mt-2 text-[#0a1628]">{total > 0 ? Math.round((insightsCount / total) * 100) : 0}%</p>
                <p className="text-sm text-[#0a1628]/60 mt-2">
                  Businesses with journey data
                </p>
              </div>

              <div className={`${UI.card} ${UI.cardInner}`}>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[#0a1628]/55">Avg Years in Business</p>
                  <TrendingUp className="w-4 h-4 text-[#c9a84c]" />
                </div>
                <p className="text-3xl font-semibold mt-2 text-[#0a1628]">{avgYearsInBusiness}</p>
                <p className="text-sm text-[#0a1628]/60 mt-2">
                  Years of operation
                </p>
              </div>

              <div className={`${UI.card} ${UI.cardInner}`}>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[#0a1628]/55">Hiring Intention</p>
                  <Rocket className="w-4 h-4 text-[#f59e0b]" />
                </div>
                <p className="text-3xl font-semibold mt-2 text-[#0a1628]">{hiringIntentionRate}%</p>
                <p className="text-sm text-[#0a1628]/60 mt-2">
                  Plan to hire in 12 months
                </p>
              </div>
            </div>

            {/* Entrepreneurship Origins */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={`${UI.card} ${UI.cardInner}`}>
                <h3 className={UI.sectionTitle}>Founder Motivations</h3>
                <p className={UI.sectionDesc}>What drives Pacific entrepreneurs to start businesses?</p>
                <div className="mt-4 space-y-2">
                  {Object.entries(motivationKeywords)
                    .map(([motivation, count]) => ({ label: motivation, value: count }))
                    .sort((a, b) => b.value - a.value)
                    .slice(0, 5)
                    .map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-[#0a1628] capitalize">{item.label}</span>
                        <span className="text-sm font-semibold text-[#0a1628]">{item.value}</span>
                      </div>
                    ))}
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

            {/* Business Operations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className={`${UI.card} ${UI.cardInner}`}>
                <h3 className={UI.sectionTitle}>Business Stages</h3>
                <p className={UI.sectionDesc}>Current maturity of Pacific enterprises</p>
                <div className="mt-4">
                  <HorizontalBar title="Business Stages" data={byBusinessStage} color="#00c4cc" />
                </div>
              </div>

              <div className={`${UI.card} ${UI.cardInner}`}>
                <h3 className={UI.sectionTitle}>Family Responsibilities</h3>
                <p className={UI.sectionDesc}>Family & community responsibilities affecting business</p>
                <div className="mt-4">
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-[#0a1628]">{familyResponsibilityRate}%</p>
                      <p className="text-sm text-[#0a1628]/60 mt-1">Family responsibilities affect business</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`${UI.card} ${UI.cardInner}`}>
                <h3 className={UI.sectionTitle}>Founder Experience</h3>
                <p className={UI.sectionDesc}>Years of entrepreneurial experience</p>
                <div className="mt-4">
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-[#0a1628]">{avgYearsInBusiness}</p>
                      <p className="text-sm text-[#0a1628]/60 mt-1">Average years in business</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Challenges & Support */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={`${UI.card} ${UI.cardInner}`}>
                <h3 className={UI.sectionTitle}>Top Challenges</h3>
                <p className={UI.sectionDesc}>Biggest hurdles facing Pacific entrepreneurs</p>
                <div className="mt-4">
                  <HorizontalBar title="Top Challenges" data={topChallenges} color="#ef4444" />
                </div>
              </div>

              <div className={`${UI.card} ${UI.cardInner}`}>
                <h3 className={UI.sectionTitle}>Collaboration Interest</h3>
                <p className={UI.sectionDesc}>Openness to business partnerships</p>
                <div className="mt-4">
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-[#0a1628]">{collaborationRate}%</p>
                      <p className="text-sm text-[#0a1628]/60 mt-1">Interested in collaborating</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Geographic & Industry Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

            {/* Subscription Tiers */}
            <div className={`${UI.card} ${UI.cardInner}`}>
              <h3 className={UI.sectionTitle}>Subscription Tiers</h3>
              <p className={UI.sectionDesc}>Business registry participation levels</p>
              <div className="mt-4">
                <HorizontalBar
                  title="Subscription Tiers"
                  data={byTierPercentage}
                  color="#c9a84c"
                  valueFormatter={(value) => `${value}%`}
                />
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