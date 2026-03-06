import { CheckCircle, Users, Target, Globe, TrendingUp, Award, Calendar } from "lucide-react";

const displayValue = (key, value) => {
  if (value === null || value === undefined || value === "") return "";

  const maps = {
    team_size_band: {
      solo: "Just me (solo)",
      small: "2–5 people", 
      medium: "6–10 people",
      large: "11–50 people",
      enterprise: "50+ people",
    },
    business_stage: {
      idea: "Idea",
      startup: "Startup", 
      growth: "Growth",
      mature: "Mature",
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
    }
  };

  return maps[key]?.[value] || value;
};

export default function FounderInsightsSummary({ snapshot, business }) {
  if (!snapshot) {
    return (
      <div className="text-center py-8">
        <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No Insights Submitted</h3>
        <p className="text-gray-500">This business hasn't submitted founder insights yet.</p>
      </div>
    );
  }

  const sections = [
    {
      title: "Founder Journey",
      icon: Users,
      color: "text-blue-600",
      fields: [
        { label: "Year Started", key: "year_started", value: snapshot.year_started },
        { label: "Founder Motivation", key: "founder_motivation", value: snapshot.founder_motivation },
        { label: "Problem Solved", key: "problem_solved", value: snapshot.problem_solved }
      ]
    },
    {
      title: "Business Operations", 
      icon: Target,
      color: "text-green-600",
      fields: [
        { label: "Team Size", key: "team_size_band", value: snapshot.team_size_band },
        { label: "Business Model", key: "business_model", value: snapshot.business_model },
        { label: "Family Involvement", key: "family_involvement", value: snapshot.family_involvement ? "Yes" : "No" }
      ]
    },
    {
      title: "Markets & Trade",
      icon: Globe, 
      color: "text-purple-600",
      fields: [
        { label: "Customer Region", key: "customer_region", value: snapshot.customer_region },
        { label: "Sales Channels", key: "sales_channels", value: snapshot.sales_channels },
        { label: "Import/Export", key: "import_export_status", value: snapshot.import_export_status },
        ...(snapshot.import_export_status === "both" || snapshot.import_export_status === "import_only" ? [
          { label: "Import Countries", key: "import_countries", value: snapshot.import_countries }
        ] : []),
        ...(snapshot.import_export_status === "both" || snapshot.import_export_status === "export_only" ? [
          { label: "Export Countries", key: "export_countries", value: snapshot.export_countries }
        ] : [])
      ]
    },
    {
      title: "Growth & Future",
      icon: TrendingUp,
      color: "text-orange-600", 
      fields: [
        { label: "Business Stage", key: "business_stage", value: snapshot.business_stage },
        { label: "Top Challenges", key: "top_challenges", value: snapshot.top_challenges },
        { label: "Support Needed", key: "support_needed", value: snapshot.support_needed },
        { label: "Goals (12 months)", key: "goals_next_12_months", value: snapshot.goals_next_12_months },
        { label: "Hiring Intentions", key: "hiring_intentions", value: snapshot.hiring_intentions ? "Yes" : "No" }
      ]
    },
    {
      title: "Community Impact",
      icon: Award,
      color: "text-pink-600",
      fields: [
        { label: "Impact Areas", key: "community_impact_areas", value: snapshot.community_impact_areas },
        { label: "Collaboration Interest", key: "collaboration_interest", value: snapshot.collaboration_interest ? "Yes" : "No" }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-[#0a1628] mb-2">{business.name}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Submitted {new Date(snapshot.submitted_date).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Verified via Insights
              </span>
            </div>
          </div>
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
                      <p className="text-sm text-gray-700">
                        {Array.isArray(field.value)
                          ? field.value.join(", ")
                          : displayValue(field.key, field.value)}
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
