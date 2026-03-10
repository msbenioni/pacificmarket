import { CheckCircle, Users, Target, Globe, TrendingUp, Award, Calendar, Edit } from "lucide-react";
import { TEAM_SIZE_BAND, BUSINESS_STAGE, IMPORT_EXPORT_STATUS } from "@/constants/unifiedConstants";

const displayValue = (key, value) => {
  if (value === null || value === undefined || value === "") return "Not specified";
  if (Array.isArray(value)) {
    if (value.length === 0) return "None selected";
    return value.join(", ");
  }
  if (typeof value === "boolean") return value ? "Yes" : "No";

  // Use unified constants for consistent labels
  const getLabelFromArray = (array, value) => {
    const item = array.find(item => item.value === value);
    return item ? item.label : value;
  };

  const getLabelFromObject = (obj, value) => {
    const key = Object.keys(obj).find(k => obj[k] === value);
    return key ? getLabelFromArray(BUSINESS_STAGE, key) || value : value;
  };

  const maps = {
    team_size_band: (value) => getLabelFromArray(TEAM_SIZE_BAND, value),
    growth_stage: (value) => getLabelFromArray(BUSINESS_STAGE, value),
    import_export_status: (value) => {
      const key = Object.keys(IMPORT_EXPORT_STATUS).find(k => IMPORT_EXPORT_STATUS[k] === value);
      return key ? key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : value;
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
    current_funding_source: {
      "personal-savings": "Personal savings",
      "family-friends": "Family and friends",
      "bank-loan": "Bank loan",
      "government-grant": "Government grant",
      "angel-investor": "Angel investor",
      "venture-capital": "Venture capital",
      crowdfunding: "Crowdfunding",
      "revenue-profit": "Revenue/profit reinvested",
      "no-funding": "No external funding",
      other: "Other",
    },
    funding_amount_needed: {
      "0-5k": "Under $5,000",
      "5k-10k": "$5,000 - $10,000",
      "10k-25k": "$10,000 - $25,000",
      "25k-50k": "$25,000 - $50,000",
      "50k-100k": "$50,000 - $100,000",
      "100k-250k": "$100,000 - $250,000",
      "250k-500k": "$250,000 - $500,000",
      "500k-1m": "$500,000 - $1,000,000",
      "1m+": "$1,000,000+",
      "not-sure": "Not sure yet",
    },
    funding_purpose: {
      "product-development": "Product development/R&D",
      "marketing-sales": "Marketing and sales",
      "hiring-staff": "Hiring staff",
      "equipment-assets": "Equipment and assets",
      "operations-expansion": "Operations expansion",
      "working-capital": "Working capital",
      "debt-consolidation": "Debt consolidation",
      "international-expansion": "International expansion",
      "technology-upgrade": "Technology upgrade",
      other: "Other",
    },
    angel_investor_interest: {
      "actively-investing": "Actively investing in Pacific businesses",
      "considering-future": "Considering investing in future (6+ months)",
      "exploring-options": "Exploring angel investing options",
      "interested-learning": "Interested in learning more first",
      "not-interested": "Not interested in investing",
      "already-investing": "Already investing in other businesses",
    },
    investor_capacity: {
      "under-5k": "Under $5,000 per investment",
      "5k-25k": "$5,000 - $25,000 per investment",
      "25k-100k": "$25,000 - $100,000 per investment",
      "100k-500k": "$100,000 - $500,000 per investment",
      "500k+": "$500,000+ per investment",
      varies: "Varies by opportunity",
      "prefer-not-to-say": "Prefer not to say",
    },
    serves_pacific_communities: {
      yes: "Yes, primarily serves Pacific communities",
      no: "No, serves broader markets",
      both: "Both Pacific and broader markets",
    },
  };

  // Use the mapping functions
  if (typeof maps[key] === 'function') {
    return maps[key](value);
  }
  
  return maps[key]?.[value] || value;
};

function FieldRow({ label, fieldKey, value }) {
  if (value === undefined || value === null || value === "") return null;

  const renderedValue = Array.isArray(value)
    ? value.length > 0
      ? value.join(", ")
      : "None selected"
    : displayValue(fieldKey, value);

  return (
    <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/60 p-3 sm:border-0 sm:bg-transparent sm:p-0">
      <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-gray-300" />
      <div className="min-w-0 flex-1">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500 sm:text-xs">
          {label}
        </p>
        <p className="break-words text-sm leading-relaxed text-gray-700">
          {renderedValue}
        </p>
      </div>
    </div>
  );
}

export default function FounderInsightsSummary({ snapshot, business, onEdit }) {
  if (!snapshot) {
    return (
      <div className="py-10 text-center sm:py-12">
        <Users className="mx-auto mb-4 h-12 w-12 text-gray-300" />
        <h3 className="mb-2 text-lg font-semibold text-gray-600">No Insights Submitted</h3>
        <p className="text-sm text-gray-500">
          No founder insights have been submitted yet.
        </p>
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
        { label: "Founder Motivations", key: "founder_motivation_array", value: snapshot.founder_motivation_array },
        { label: "Founder Story", key: "founder_story", value: snapshot.founder_story },
        { label: "Gender", key: "gender", value: snapshot.gender },
        { label: "Age Range", key: "age_range", value: snapshot.age_range },
        { label: "Years Entrepreneurial", key: "years_entrepreneurial", value: snapshot.years_entrepreneurial },
      ],
    },
    {
      title: "Pacific Context",
      icon: Globe,
      color: "text-green-600",
      fields: [
        { label: "Serves Pacific Communities", key: "serves_pacific_communities", value: snapshot.serves_pacific_communities },
        { label: "Culture Influences Business", key: "culture_influences_business", value: snapshot.culture_influences_business },
        ...(snapshot.culture_influences_business
          ? [
              {
                label: "Cultural Influence Details",
                key: "culture_influence_details",
                value: snapshot.culture_influence_details,
              },
            ]
          : []),
        {
          label: "Family / Community Responsibilities",
          key: "family_community_responsibilities_affect_business",
          value: snapshot.family_community_responsibilities_affect_business,
        },
        {
          label: "Responsibilities Impact Details",
          key: "responsibilities_impact_details",
          value: snapshot.responsibilities_impact_details,
        },
      ],
    },
    {
      title: "Financial & Investment",
      icon: TrendingUp,
      color: "text-purple-600",
      fields: [
        { label: "Current Funding Source", key: "current_funding_source", value: snapshot.current_funding_source },
        { label: "Investment Stage", key: "investment_stage", value: snapshot.investment_stage },
        { label: "Revenue Streams", key: "revenue_streams", value: snapshot.revenue_streams },
        { label: "Funding Amount Needed", key: "funding_amount_needed", value: snapshot.funding_amount_needed },
        { label: "Funding Purpose", key: "funding_purpose", value: snapshot.funding_purpose },
        ...(snapshot.angel_investor_interest
          ? [
              {
                label: "Angel Investor Interest",
                key: "angel_investor_interest",
                value: snapshot.angel_investor_interest,
              },
            ]
          : []),
        {
          label: "Investor Capacity",
          key: "investor_capacity",
          value: snapshot.investor_capacity,
        },
      ],
    },
    {
      title: "Challenges & Support",
      icon: Target,
      color: "text-orange-600",
      fields: [
        { label: "Top Challenges", key: "top_challenges", value: snapshot.top_challenges },
        { label: "Support Needed", key: "support_needed_next", value: snapshot.support_needed_next },
        { label: "Financial Challenges", key: "financial_challenges", value: snapshot.financial_challenges },
      ],
    },
    {
      title: "Growth & Future",
      icon: Award,
      color: "text-pink-600",
      fields: [
        { label: "Business Stage", key: "growth_stage", value: snapshot.growth_stage },
        { label: "Goals (12 months)", key: "goals_next_12_months_array", value: snapshot.goals_next_12_months_array },
        { label: "Goals Details", key: "goals_details", value: snapshot.goals_details },
        { label: "Hiring Intentions", key: "hiring_intentions", value: snapshot.hiring_intentions },
        { label: "Expansion Plans", key: "expansion_plans", value: snapshot.expansion_plans },
      ],
    },
    {
      title: "Community & Impact",
      icon: Users,
      color: "text-indigo-600",
      fields: [
        { label: "Community Impact Areas", key: "community_impact_areas", value: snapshot.community_impact_areas },
        { label: "Collaboration Interest", key: "collaboration_interest", value: snapshot.collaboration_interest },
        { label: "Mentorship Offering", key: "mentorship_offering", value: snapshot.mentorship_offering },
        { label: "Open to Future Contact", key: "open_to_future_contact", value: snapshot.open_to_future_contact },
      ],
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h3 className="mb-2 text-lg font-bold text-[#0a1628] sm:text-xl">
              Founder Insights
            </h3>

            {business?.name && (
              <p className="mb-3 text-sm font-medium text-[#0d4f4f]">
                {business.name}
              </p>
            )}

            <div className="flex flex-col gap-2 text-sm text-gray-600 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                Submitted{" "}
                {snapshot.submitted_date
                  ? new Date(snapshot.submitted_date).toLocaleDateString()
                  : "Unknown date"}
              </span>

              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Founder Journey Verified
              </span>
            </div>
          </div>

          {onEdit && (
            <button
              onClick={onEdit}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Edit className="h-4 w-4" />
              Edit Insights
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6">
        {sections.map((section) => {
          const visibleFields = section.fields.filter(
            (field) => field.value !== undefined && field.value !== null && field.value !== ""
          );

          if (visibleFields.length === 0) return null;

          return (
            <div
              key={section.title}
              className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gray-50">
                  <section.icon className={`h-5 w-5 ${section.color}`} />
                </div>
                <h4 className="text-base font-semibold text-[#0a1628] sm:text-lg">
                  {section.title}
                </h4>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {visibleFields.map((field) => (
                  <FieldRow
                    key={field.label}
                    label={field.label}
                    fieldKey={field.key}
                    value={field.value}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}