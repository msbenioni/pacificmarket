import { CheckCircle, Users, Target, Globe, TrendingUp, Award, Calendar, Edit } from "lucide-react";

const displayValue = (key, value) => {
  if (value === null || value === undefined || value === "") return "Not specified";
  if (Array.isArray(value)) {
    if (value.length === 0) return "None selected";
    return value.join(", ");
  }
  if (typeof value === 'boolean') return value ? "Yes" : "No";

  const maps = {
    // Business related (legacy)
    team_size_band: {
      solo: "Just me (solo)",
      small: "2–5 people", 
      medium: "6–10 people",
      large: "11–50 people",
      enterprise: "50+ people",
    },
    business_stage: {
      idea: "Idea/Planning",
      startup: "Startup (0-2 years)", 
      growth: "Growth (2-5 years)",
      mature: "Mature (5+ years)",
      pre_seed: "Pre-seed (idea stage)",
      seed: "Seed (early development)",
      early_stage: "Early stage (product launched)",
      growth_stage: "Growth stage (scaling)",
      established: "Established (mature business)",
      not_seeking: "Not seeking investment",
    },
    import_export_status: {
      none: "No import/export",
      import_only: "Import only",
      export_only: "Export only", 
      both: "Import and export",
    },
    business_model: {
      b2c: "Business to Consumer (B2C)",
      b2b: "Business to Business (B2B)",
      b2g: "Business to Government (B2G)",
      marketplace: "Marketplace",
      subscription: "Subscription",
      freemium: "Freemium",
      other: "Other",
    },
    customer_region: {
      local: "Local (within island/country)",
      regional: "Regional (multiple Pacific islands)",
      global: "Global (worldwide)",
    },
    
    // Founder insights specific
    current_funding_source: {
      'personal-savings': "Personal savings",
      'family-friends': "Family and friends",
      'bank-loan': "Bank loan",
      'government-grant': "Government grant",
      'angel-investor': "Angel investor",
      'venture-capital': "Venture capital",
      'crowdfunding': "Crowdfunding",
      'revenue-profit': "Revenue/profit reinvested",
      'no-funding': "No external funding",
      'other': "Other",
    },
    funding_amount_needed: {
      '0-5k': "Under $5,000",
      '5k-10k': "$5,000 - $10,000",
      '10k-25k': "$10,000 - $25,000",
      '25k-50k': "$25,000 - $50,000",
      '50k-100k': "$50,000 - $100,000",
      '100k-250k': "$100,000 - $250,000",
      '250k-500k': "$250,000 - $500,000",
      '500k-1m': "$500,000 - $1,000,000",
      '1m+': "$1,000,000+",
      'not-sure': "Not sure yet",
    },
    funding_purpose: {
      'product-development': "Product development/R&D",
      'marketing-sales': "Marketing and sales",
      'hiring-staff': "Hiring staff",
      'equipment-assets': "Equipment and assets",
      'operations-expansion': "Operations expansion",
      'working-capital': "Working capital",
      'debt-consolidation': "Debt consolidation",
      'international-expansion': "International expansion",
      'technology-upgrade': "Technology upgrade",
      'other': "Other",
    },
    angel_investor_interest: {
      'actively-investing': "Actively investing in Pacific businesses",
      'considering-future': "Considering investing in future (6+ months)",
      'exploring-options': "Exploring angel investing options",
      'interested-learning': "Interested in learning more first",
      'not-interested': "Not interested in investing",
      'already-investing': "Already investing in other businesses",
    },
    investor_capacity: {
      'under-5k': "Under $5,000 per investment",
      '5k-25k': "$5,000 - $25,000 per investment",
      '25k-100k': "$25,000 - $100,000 per investment",
      '100k-500k': "$100,000 - $500,000 per investment",
      '500k+': "$500,000+ per investment",
      'varies': "Varies by opportunity",
      'prefer-not-to-say': "Prefer not to say",
    },
    serves_pacific_communities: {
      'yes': "Yes, primarily serves Pacific communities",
      'no': "No, serves broader markets",
      'both': "Both Pacific and broader markets",
    },
  };

  return maps[key]?.[value] || value;
};

export default function FounderInsightsSummary({ snapshot, business, onEdit }) {
  if (!snapshot) {
    return (
      <div className="text-center py-8">
        <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No Insights Submitted</h3>
        <p className="text-gray-500">No founder insights have been submitted yet.</p>
      </div>
    );
  }

  const sections = [
    {
      title: "Founder Background",
      icon: Users,
      color: "text-blue-600",
      fields: [
        { label: "Businesses Founded", key: "businesses_founded", value: snapshot.businesses_founded },
        { label: "Founder Role", key: "founder_role", value: snapshot.founder_role },
        { label: "Founder Motivations", key: "founder_motivation", value: snapshot.founder_motivation }
      ]
    },
    {
      title: "Pacific Context", 
      icon: Globe,
      color: "text-green-600",
      fields: [
        { label: "Serves Pacific Communities", key: "serves_pacific_communities", value: snapshot.serves_pacific_communities },
        { label: "Culture Influences Business", key: "culture_influences_business", value: snapshot.culture_influences_business ? "Yes" : "No" },
        ...(snapshot.culture_influences_business ? [
          { label: "Cultural Influence Details", key: "culture_influence_details", value: snapshot.culture_influence_details }
        ] : [])
      ]
    },
    {
      title: "Financial & Investment",
      icon: TrendingUp, 
      color: "text-purple-600",
      fields: [
        { label: "Current Funding Source", key: "current_funding_source", value: snapshot.current_funding_source },
        { label: "Investment Stage", key: "investment_stage", value: snapshot.investment_stage },
        { label: "Revenue Streams", key: "revenue_streams", value: snapshot.revenue_streams },
        ...(snapshot.angel_investor_interest ? [
          { label: "Angel Investor Interest", key: "angel_investor_interest", value: snapshot.angel_investor_interest }
        ] : [])
      ]
    },
    {
      title: "Challenges & Support",
      icon: Target,
      color: "text-orange-600", 
      fields: [
        { label: "Top Challenges", key: "top_challenges", value: snapshot.top_challenges },
        { label: "Support Needed", key: "support_needed_next", value: snapshot.support_needed_next },
        { label: "Financial Challenges", key: "financial_challenges", value: snapshot.financial_challenges }
      ]
    },
    {
      title: "Growth & Future",
      icon: Award,
      color: "text-pink-600",
      fields: [
        { label: "Business Stage", key: "business_stage", value: snapshot.business_stage },
        { label: "Goals (12 months)", key: "goals_next_12_months", value: snapshot.goals_next_12_months },
        { label: "Hiring Intentions", key: "hiring_intentions", value: snapshot.hiring_intentions ? "Yes" : "No" },
        { label: "Expansion Plans", key: "expansion_plans", value: snapshot.expansion_plans ? "Yes" : "No" }
      ]
    },
    {
      title: "Community & Impact",
      icon: Users,
      color: "text-indigo-600",
      fields: [
        { label: "Community Impact Areas", key: "community_impact_areas", value: snapshot.community_impact_areas },
        { label: "Collaboration Interest", key: "collaboration_interest", value: snapshot.collaboration_interest ? "Yes" : "No" },
        { label: "Mentorship Offering", key: "mentorship_offering", value: snapshot.mentorship_offering ? "Yes" : "No" }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-[#0a1628] mb-2">Founder Insights</h3>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Submitted {snapshot.submitted_date ? new Date(snapshot.submitted_date).toLocaleDateString() : 'Unknown date'}
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Founder Journey Verified
              </span>
            </div>
          </div>
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
            >
              <Edit className="w-4 h-4" />
              Edit Insights
            </button>
          )}
        </div>
      </div>

      {/* Sections */}
      <div className="grid gap-6">
        {sections.map((section) => (
          <div key={section.title} className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <section.icon className={`w-5 h-5 ${section.color}`} />
              <h4 className="font-semibold text-[#0a1628] text-lg">{section.title}</h4>
            </div>
            
            <div className="space-y-3">
              {section.fields.map((field) => (
                field.value !== undefined && field.value !== null && field.value !== "" && (
                  <div key={field.label} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gray-300 rounded-full mt-2 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                        {field.label}
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {Array.isArray(field.value)
                          ? field.value.length > 0 
                            ? field.value.join(", ")
                            : "None selected"
                          : displayValue(field.key, field.value)
                        }
                      </p>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
