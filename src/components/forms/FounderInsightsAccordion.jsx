import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, ChevronRight, Users, TrendingUp, Globe, AlertCircle, Rocket, Lightbulb } from "lucide-react";
import { BUSINESS_STAGE, TEAM_SIZE_BAND, INDUSTRIES, FOUNDER_MOTIVATIONS, BUSINESS_CHALLENGES, SUPPORT_NEEDS, GOALS_NEXT_12_MONTHS, COMMUNITY_IMPACT_AREAS, COUNTRIES, FUNDING_SOURCES, FUNDING_AMOUNTS, FUNDING_PURPOSES, INVESTMENT_STAGES, INVESTMENT_EXPLORATION, ANGEL_INVESTOR_INTEREST, INVESTOR_CAPACITY, REVENUE_STREAMS } from "@/constants/unifiedConstants";
import { getSupabase } from "@/lib/supabase/client";

const SECTIONS = [
  { key: "founder", label: "Founder Background", icon: Users, description: "Help us understand the person behind the business" },
  { key: "pacific", label: "Pacific Context", icon: Globe, description: "Help us understand your Pacific identity and how it shapes your business" },
  { key: "financial", label: "Financial & Investment", icon: TrendingUp, description: "Help us understand your funding needs and financial situation" },
  { key: "challenges", label: "Challenges & Support", icon: AlertCircle, description: "Help us identify real barriers and support gaps for Pacific founders" },
  { key: "growth", label: "Growth & Future", icon: Rocket, description: "Help us understand your ambition, readiness, and next-stage needs" },
  { key: "community", label: "Community & Impact", icon: Lightbulb, description: "Help us understand your values, collaboration, and ecosystem potential" },
];

const SECTION_FIELDS = {
  founder: [
    "years_entrepreneurial",
    "businesses_founded",
    "founder_role",
    "founder_motivation_array",
    "founder_story",
  ],
  pacific: [
    "serves_pacific_communities",
    "culture_influences_business",
    "culture_influence_details",
    "family_community_responsibilities_affect_business",
    "responsibilities_impact_details",
    "pacific_identity",
  ],
  financial: [
    "current_funding_source",
    "investment_stage",
    "revenue_streams",
    "financial_challenges",
    "funding_amount_needed",
    "funding_purpose",
    "angel_investor_interest",
    "investor_capacity",
  ],
  challenges: [
    "top_challenges",
    "support_needed_next",
    "current_support_sources",
    "mentorship_access",
    "barriers_to_mentorship",
  ],
  growth: [
    "business_stage",
    "goals_next_12_months_array",
    "goals_details",
    "hiring_intentions",
    "expansion_plans",
    "collaboration_interest",
  ],
  community: [
    "community_impact_areas",
    "mentorship_offering",
    "open_to_future_contact",
  ],
};

export default function FounderInsightsAccordion({ businessId, onSubmit, isLoading, initialData = null, onStart }) {
  // Create a stable initial form state to avoid controlled/uncontrolled input issues
  const getInitialForm = () => {
    const defaults = {
      // Founder Background (unique to business insights)
      years_entrepreneurial: "",
      businesses_founded: "",
      founder_role: "",
      founder_motivation_array: [],
      founder_story: "",

      // Pacific Context (unique to business insights)
      serves_pacific_communities: "",
      culture_influences_business: false,
      culture_influence_details: "",
      family_community_responsibilities_affect_business: false,
      responsibilities_impact_details: "",
      pacific_identity: [],

      // Financial & Investment (unique insights - not duplicated from profile)
      current_funding_source: "",
      investment_stage: "",
      revenue_streams: [],
      financial_challenges: "",
      funding_amount_needed: "",
      funding_purpose: "",
      angel_investor_interest: "",
      investor_capacity: "",

      // Challenges & Support (unique insights - not duplicated from profile)
      top_challenges: [],
      support_needed_next: [],
      current_support_sources: [],
      mentorship_access: false,
      barriers_to_mentorship: "",

      // Growth & Future (unique insights - not duplicated from profile)
      business_stage: "",
      goals_next_12_months_array: [],
      goals_details: "",
      hiring_intentions: false,
      expansion_plans: false,
      collaboration_interest: false,

      // Community & Impact (unique to business insights)
      community_impact_areas: [],
      mentorship_offering: false,
      open_to_future_contact: false,

      // Optional arrays
      sales_channels: [],
      team_size_band: "",
    };
    
    if (initialData) {
      return { ...defaults, ...initialData };
    }
    return defaults;
  };

  const [form, setForm] = useState(() => getInitialForm());
  const [expandedSections, setExpandedSections] = useState(new Set(['founder']));
  const [submitting, setSubmitting] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  
  // Wrapper function to handle form updates and trigger onStart on first change
  const setFormState = (updater) => {
    setForm(prev => {
      const nextForm = typeof updater === "function" ? updater(prev) : updater;
      if (!hasStarted && onStart && !initialData) {
        setHasStarted(true);
        onStart();
      }
      return nextForm;
    });
  };

  // Update form when initialData changes (merge with current state)
  useEffect(() => {
    if (initialData) {
      setForm(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionKey)) {
        newSet.delete(sectionKey);
      } else {
        newSet.add(sectionKey);
      }
      return newSet;
    });
  };

  const buildSectionPayload = (user, sectionKey) => {
    const fields = SECTION_FIELDS[sectionKey] || [];
    const payload = {
      user_id: user.id,
      business_id: businessId ?? null,
      snapshot_year: new Date().getFullYear(),
    };

    for (const field of fields) {
      payload[field] = form[field];
    }

    return payload;
  };

  const handleSaveSection = async (sectionKey) => {
    setSubmitting(true);
    try {
      const supabase = getSupabase();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error("User not authenticated");

      const payload = buildSectionPayload(user, sectionKey);
      console.log("Saving section payload", sectionKey, payload);

      await onSubmit(payload);
    } catch (error) {
      console.error(`Failed to save ${sectionKey} section:`, error);
      alert("Failed to save section. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitAll = async () => {
    setSubmitting(true);
    try {
      const supabase = getSupabase();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error("User not authenticated");

      const payload = {
        user_id: user.id,
        business_id: businessId ?? null,
        snapshot_year: new Date().getFullYear(),

        years_entrepreneurial: form.years_entrepreneurial,
        businesses_founded: form.businesses_founded,
        founder_role: form.founder_role,
        founder_motivation_array: form.founder_motivation_array ?? [],
        founder_story: form.founder_story,

        serves_pacific_communities: form.serves_pacific_communities,
        culture_influences_business: form.culture_influences_business,
        culture_influence_details: form.culture_influence_details,
        family_community_responsibilities_affect_business: form.family_community_responsibilities_affect_business,
        responsibilities_impact_details: form.responsibilities_impact_details,

        current_funding_source: form.current_funding_source,
        investment_stage: form.investment_stage,
        revenue_streams: form.revenue_streams ?? [],
        financial_challenges: form.financial_challenges,
        funding_amount_needed: form.funding_amount_needed,
        funding_purpose: form.funding_purpose,
        angel_investor_interest: form.angel_investor_interest,
        investor_capacity: form.investor_capacity,

        top_challenges: form.top_challenges ?? [],
        support_needed_next: form.support_needed_next ?? [],
        current_support_sources: form.current_support_sources ?? [],
        mentorship_access: form.mentorship_access,
        barriers_to_mentorship: form.barriers_to_mentorship,

        business_stage: form.business_stage,
        goals_next_12_months_array: form.goals_next_12_months_array ?? [],
        goals_details: form.goals_details,
        hiring_intentions: form.hiring_intentions,
        expansion_plans: form.expansion_plans,
        collaboration_interest: form.collaboration_interest,

        community_impact_areas: form.community_impact_areas ?? [],
        mentorship_offering: form.mentorship_offering,
        open_to_future_contact: form.open_to_future_contact,
        pacific_identity: form.pacific_identity ?? [],
        sales_channels: form.sales_channels ?? [],
        team_size_band: form.team_size_band,
      };

      console.log("Submitting all founder insights", payload);
      await onSubmit(payload);
    } catch (error) {
      console.error("Failed to submit founder insights:", error);
      alert("Failed to submit insights. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleArrayItem = (field, item) => {
    setForm(prev => {
      const currentArray = prev[field] || [];
      if (currentArray.includes(item)) {
        return { ...prev, [field]: currentArray.filter(i => i !== item) };
      } else {
        const limit = field === 'top_challenges' ? 5 : (field === 'support_needed_next' || field === 'goals_next_12_months_array' || field === 'founder_motivation_array' ? 3 : undefined);
        if (limit && currentArray.length >= limit) {
          return prev; // Don't add if limit reached
        }
        return { ...prev, [field]: [...currentArray, item] };
      }
    });
  };

  // Helper functions
  const hasSectionErrors = (_sectionKey) => false;
  const getLabelClass = (_sectionKey, _fieldName, _isArray = false) => "block text-xs font-semibold uppercase tracking-wider mb-1.5";
  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0d4f4f] focus:ring-1 focus:ring-[#0d4f4f]/20 bg-white";
  const selectCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0d4f4f] focus:ring-1 focus:ring-[#0d4f4f]/20 bg-white pr-10 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzZiNzI4MCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K')] bg-no-repeat bg-[center_right_1rem] bg-[length:0.75rem]";
  const labelCls = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

  const renderSection = (section) => {
    const isExpanded = expandedSections.has(section.key);
    const hasErrors = hasSectionErrors(section.key);
    const sectionErrors = []; // Simplified since validation is disabled

    return (
      <div key={section.key} className={`border rounded-xl transition-all ${
        hasErrors ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
      }`}>
        <div className="w-full px-6 py-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => toggleSection(section.key)}
            className="flex-1 flex items-center gap-3 text-left transition-colors"
          >
            <section.icon className={`w-5 h-5 ${hasErrors ? 'text-red-600' : 'text-[#0d4f4f]'} mt-0.5`} />
            <div>
              <h4 className={`text-sm font-semibold ${hasErrors ? 'text-red-900' : 'text-[#0a1628]'}`}>
                {section.label}
                {hasErrors && <span className="ml-2 text-xs text-red-600">(Required)</span>}
              </h4>
              <p className={`text-sm ${hasErrors ? 'text-red-700' : 'text-gray-600'}`}>
                {section.description}
                {hasErrors && (
                  <span className="block mt-1 text-xs">
                    Missing: {sectionErrors.join(', ')}
                  </span>
                )}
              </p>
            </div>
          </button>

          <div className="flex items-center gap-2 ml-4">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSaveSection(section.key);
              }}
              disabled={submitting || isLoading}
              className="inline-flex items-center gap-1 rounded-lg bg-[#0d4f4f] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1a6b6b] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting || isLoading ? (
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Save
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => toggleSection(section.key)}
              className={`p-1 ${hasErrors ? 'text-red-600' : 'text-gray-400'}`}
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
        
        {isExpanded && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="text-center py-8">
              <p className="text-gray-500">Form content would go here</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {SECTIONS.map(renderSection)}
      
      {/* Submit Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSubmitAll}
          disabled={submitting || isLoading}
          className="inline-flex items-center gap-2 rounded-xl bg-[#0d4f4f] px-6 py-3 text-sm font-bold text-white hover:bg-[#1a6b6b] transition shadow-[0_12px_30px_rgba(13,79,79,0.35)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting || isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              Submit Founder Insights
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
