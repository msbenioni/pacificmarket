import { useState, useEffect } from "react";
import { getSupabase } from "@/lib/supabase/client";
import { Building2, Users, ShieldCheck, Globe, TrendingUp, Target, Lightbulb, Rocket, BarChart3, PieChart, Activity } from "lucide-react";
import { BUSINESS_STATUS, BUSINESS_TIER } from "@/constants/unifiedConstants";
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
  const byCountry = tally(businesses, "country");
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
  const byTeamSize = tally(insights, "team_size_band");
  const byBusinessStage = tally(insights, "business_stage");
  const byImportExport = tally(insights, "import_export_status");
  
  // Calculate years in business
  const yearsInBusiness = insights
    .map(i => {
      const currentYear = new Date().getFullYear();
      return i.year_started ? currentYear - i.year_started : null;
    })
    .filter(year => year !== null && year >= 0);
  
  const avgYearsInBusiness = yearsInBusiness.length > 0 
    ? (yearsInBusiness.reduce((sum, year) => sum + year, 0) / yearsInBusiness.length).toFixed(1)
    : 0;

  // Motivation analysis
  const motivationKeywords = insights.reduce((acc, insight) => {
    if (insight.founder_motivation) {
      const keywords = ['community', 'passion', 'opportunity', 'family', 'problem', 'impact', 'growth'];
      keywords.forEach(keyword => {
        if (insight.founder_motivation.toLowerCase().includes(keyword)) {
          acc[keyword] = (acc[keyword] || 0) + 1;
        }
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

  // Hiring intentions
  const hiringIntentionRate = insights.length > 0 
    ? Math.round((insights.filter(i => i.hiring_intentions).length / insights.length) * 100)
    : 0;

  // Family involvement
  const familyInvolvementRate = insights.length > 0
    ? Math.round((insights.filter(i => i.family_involvement).length / insights.length) * 100)
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
                <p className="text-3xl font-semibold mt-2 text-[#0a1628]">{insightsCount}</p>
                <p className="text-sm text-[#0a1628]/60 mt-2">
                  Journey data collected
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
                <h3 className={UI.sectionTitle}>Team Sizes</h3>
                <p className={UI.sectionDesc}>Employment across Pacific businesses</p>
                <div className="mt-4">
                  <HorizontalBar title="Team Sizes" data={byTeamSize} color="#00c4cc" />
                </div>
              </div>

              <div className={`${UI.card} ${UI.cardInner}`}>
                <h3 className={UI.sectionTitle}>Family Involvement</h3>
                <p className={UI.sectionDesc}>Family-owned enterprises</p>
                <div className="mt-4">
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-[#0a1628]">{familyInvolvementRate}%</p>
                      <p className="text-sm text-[#0a1628]/60 mt-1">Family-involved</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`${UI.card} ${UI.cardInner}`}>
                <h3 className={UI.sectionTitle}>Trade Activity</h3>
                <p className={UI.sectionDesc}>International trade engagement</p>
                <div className="mt-4">
                  <HorizontalBar title="Trade Activity" data={byImportExport} color="#c9a84c" />
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