import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Building2,
  TrendingUp,
  AlertCircle,
  Rocket,
  Lightbulb,
} from "lucide-react";
import {
  BUSINESS_STAGE,
  BUSINESS_CHALLENGES,
  SUPPORT_NEEDS,
  GOALS_NEXT_12_MONTHS,
  COMMUNITY_IMPACT_AREAS,
  FUNDING_SOURCES,
  INVESTMENT_STAGES,
  REVENUE_STREAMS,
} from "@/constants/unifiedConstants";

const SECTIONS = [
  {
    key: "business",
    label: "Business Operations",
    icon: Building2,
    description: "Help us understand your business operations and structure",
  },
  {
    key: "financial",
    label: "Financial & Investment",
    icon: TrendingUp,
    description: "Help us understand your funding needs and financial situation",
  },
  {
    key: "challenges",
    label: "Challenges & Support",
    icon: AlertCircle,
    description: "Help us identify real barriers and support gaps for your business",
  },
  {
    key: "growth",
    label: "Growth & Future",
    icon: Rocket,
    description: "Help us understand your business growth plans and next-stage needs",
  },
  {
    key: "community",
    label: "Community & Impact",
    icon: Lightbulb,
    description: "Help us understand your business impact and collaboration potential",
  },
];

const SECTION_FIELDS = {
  business: [
    "business_stage",
    "team_size_band",
    "business_model",
    "family_involvement",
    "customer_region",
    "sales_channels",
    "import_export_status",
    "business_operating_status",
    "business_registered",
    "employs_anyone",
    "employs_family_community",
    "team_size",
    "revenue_band",
  ],
  financial: [
    "current_funding_source",
    "investment_stage",
    "revenue_streams",
    "financial_challenges",
    "funding_amount_needed",
    "funding_purpose",
  ],
  challenges: ["top_challenges", "support_needed_next"],
  growth: ["business_stage", "goals_next_12_months_array", "expansion_plans"],
  community: [
    "community_impact_areas",
    "collaboration_interest",
    "open_to_future_contact",
  ],
};

export default function BusinessInsightsAccordion({
  businessId,
  onSubmit,
  isLoading,
  initialData = null,
  onStart,
}) {
  const getInitialForm = () => {
    const defaults = {
      // Business operations
      business_stage: "",
      team_size_band: "",
      business_model: "",
      family_involvement: "",
      customer_region: "",
      sales_channels: [],
      import_export_status: "",
      import_countries: [],
      export_countries: [],
      business_operating_status: "",
      business_age: "",
      business_registered: false,
      employs_anyone: false,
      employs_family_community: false,
      team_size: "",
      revenue_band: "",

      // Financial
      current_funding_source: "",
      investment_stage: "",
      revenue_streams: [],
      financial_challenges: "",
      funding_amount_needed: "",
      funding_purpose: "",

      // Challenges
      top_challenges: [],
      support_needed_next: [],

      // Growth
      goals_next_12_months_array: [],
      expansion_plans: false,

      // Community
      community_impact_areas: [],
      collaboration_interest: false,
      open_to_future_contact: false,
    };

    return initialData ? { ...defaults, ...initialData } : defaults;
  };

  const [form, setForm] = useState(() => getInitialForm());
  const [expandedSections, setExpandedSections] = useState(new Set(["business"]));
  const [submitting, setSubmitting] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const setFormState = (updater) => {
    setForm((prev) => {
      const nextForm = typeof updater === "function" ? updater(prev) : updater;

      if (!hasStarted && onStart && !initialData) {
        setHasStarted(true);
        onStart();
      }

      return nextForm;
    });
  };

  useEffect(() => {
    if (initialData) {
      setForm((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const toggleSection = (sectionKey) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionKey)) next.delete(sectionKey);
      else next.add(sectionKey);
      return next;
    });
  };

  const buildSectionPayload = (user, sectionKey) => {
    const fields = SECTION_FIELDS[sectionKey] || [];
    const payload = {
      business_id: businessId,
      user_id: user.id,
      snapshot_year: new Date().getFullYear(),
      submitted_date: new Date().toISOString(),
    };

    for (const field of fields) {
      payload[field] = form[field];
    }

    return payload;
  };

  const handleSaveSection = async (sectionKey) => {
    setSubmitting(true);
    try {
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();
      
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("User not authenticated");

      const payload = buildSectionPayload(user, sectionKey);
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
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();
      
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("User not authenticated");

      const payload = {
        business_id: businessId,
        user_id: user.id,
        snapshot_year: new Date().getFullYear(),
        submitted_date: new Date().toISOString(),
        
        // Business operations
        business_stage: form.business_stage,
        team_size_band: form.team_size_band,
        business_model: form.business_model,
        family_involvement: form.family_involvement,
        customer_region: form.customer_region,
        sales_channels: form.sales_channels ? JSON.stringify(form.sales_channels) : null,
        import_export_status: form.import_export_status,
        import_countries: form.import_countries ? JSON.stringify(form.import_countries) : null,
        export_countries: form.export_countries ? JSON.stringify(form.export_countries) : null,
        business_operating_status: form.business_operating_status,
        business_age: form.business_age,
        business_registered: form.business_registered,
        employs_anyone: form.employs_anyone,
        employs_family_community: form.employs_family_community,
        team_size: form.team_size,
        revenue_band: form.revenue_band,

        // Financial
        current_funding_source: form.current_funding_source,
        investment_stage: form.investment_stage,
        revenue_streams: form.revenue_streams ?? [],
        financial_challenges: form.financial_challenges,
        funding_amount_needed: form.funding_amount_needed,
        funding_purpose: form.funding_purpose,

        // Challenges
        top_challenges: form.top_challenges ? JSON.stringify(form.top_challenges) : null,
        support_needed_next: form.support_needed_next ?? [],

        // Growth
        goals_next_12_months_array: form.goals_next_12_months_array ?? [],
        expansion_plans: form.expansion_plans,

        // Community
        community_impact_areas: form.community_impact_areas ? JSON.stringify(form.community_impact_areas) : null,
        collaboration_interest: form.collaboration_interest,
        open_to_future_contact: form.open_to_future_contact,
      };

      await onSubmit(payload);
    } catch (error) {
      console.error("Failed to submit business insights:", error);
      alert("Failed to submit insights. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleArrayItem = (field, item) => {
    setFormState((prev) => {
      const currentArray = prev[field] || [];

      if (currentArray.includes(item)) {
        return { ...prev, [field]: currentArray.filter((i) => i !== item) };
      }

      const limit =
        field === "top_challenges"
          ? 5
          : field === "support_needed_next" ||
              field === "goals_next_12_months_array"
            ? 3
            : undefined;

      if (limit && currentArray.length >= limit) {
        return prev;
      }

      return { ...prev, [field]: [...currentArray, item] };
    });
  };

  const hasSectionErrors = (_sectionKey) => false;

  const getLabelClass = (_sectionKey, _fieldName, _isArray = false) =>
    "block text-xs font-semibold uppercase tracking-wider mb-1.5";

  const inputCls =
    "w-full min-h-[44px] border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#0a1628] placeholder:text-gray-400 focus:outline-none focus:border-[#0d4f4f] focus:ring-2 focus:ring-[#0d4f4f]/10 bg-white";

  const selectCls =
    "w-full min-h-[44px] border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm text-[#0a1628] focus:outline-none focus:border-[#0d4f4f] focus:ring-2 focus:ring-[#0d4f4f]/10 bg-white appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzZiNzI4MCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K')] bg-no-repeat bg-[center_right_1rem] bg-[length:0.75rem]";

  const renderSection = (section) => {
    const isExpanded = expandedSections.has(section.key);
    const hasErrors = hasSectionErrors(section.key);

    return (
      <div
        key={section.key}
        className={`border rounded-xl transition-all ${
          hasErrors ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"
        }`}
      >
        <div className="w-full px-4 sm:px-6 py-4">
          <button
            type="button"
            onClick={() => toggleSection(section.key)}
            className="w-full flex items-start justify-between gap-3 text-left transition-colors"
          >
            <div className="flex items-start gap-3 min-w-0">
              <section.icon
                className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                  hasErrors ? "text-red-600" : "text-[#0d4f4f]"
                }`}
              />

              <div className="min-w-0">
                <h4
                  className={`text-sm font-semibold break-words ${
                    hasErrors ? "text-red-900" : "text-[#0a1628]"
                  }`}
                >
                  {section.label}
                </h4>

                <p
                  className={`mt-1 text-sm leading-5 ${
                    hasErrors ? "text-red-700" : "text-gray-600"
                  }`}
                >
                  {section.description}
                </p>
              </div>
            </div>

            <div
              className={`mt-0.5 flex-shrink-0 ${
                hasErrors ? "text-red-600" : "text-gray-400"
              }`}
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </div>
          </button>
        </div>

        {isExpanded && (
          <div className="px-4 sm:px-6 py-4 sm:py-5 bg-gray-50 border-t border-gray-200">
            {section.key === "business" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={getLabelClass("business", "business_stage")}>
                      Business Stage
                    </label>
                    <select
                      value={form.business_stage || ""}
                      onChange={(e) =>
                        setFormState((prev) => ({
                          ...prev,
                          business_stage: e.target.value,
                        }))
                      }
                      className={selectCls}
                    >
                      <option value="">Select stage</option>
                      {Object.entries(BUSINESS_STAGE).map(([key, value]) => (
                        <option key={value} value={value}>
                          {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={getLabelClass("business", "team_size_band")}>
                      Team Size
                    </label>
                    <select
                      value={form.team_size_band || ""}
                      onChange={(e) =>
                        setFormState((prev) => ({
                          ...prev,
                          team_size_band: e.target.value,
                        }))
                      }
                      className={selectCls}
                    >
                      <option value="">Select team size</option>
                      <option value="1">Just me</option>
                      <option value="2-5">2-5 people</option>
                      <option value="6-10">6-10 people</option>
                      <option value="11-20">11-20 people</option>
                      <option value="21-50">21-50 people</option>
                      <option value="51+">51+ people</option>
                    </select>
                  </div>

                  <div>
                    <label className={getLabelClass("business", "revenue_band")}>
                      Annual Revenue
                    </label>
                    <select
                      value={form.revenue_band || ""}
                      onChange={(e) =>
                        setFormState((prev) => ({
                          ...prev,
                          revenue_band: e.target.value,
                        }))
                      }
                      className={selectCls}
                    >
                      <option value="">Select revenue range</option>
                      <option value="0-50k">Under $50,000</option>
                      <option value="50k-100k">$50,000 - $100,000</option>
                      <option value="100k-250k">$100,000 - $250,000</option>
                      <option value="250k-500k">$250,000 - $500,000</option>
                      <option value="500k-1m">$500,000 - $1,000,000</option>
                      <option value="1m+">Over $1,000,000</option>
                    </select>
                  </div>

                  <div>
                    <label className={getLabelClass("business", "business_operating_status")}>
                      Operating Status
                    </label>
                    <select
                      value={form.business_operating_status || ""}
                      onChange={(e) =>
                        setFormState((prev) => ({
                          ...prev,
                          business_operating_status: e.target.value,
                        }))
                      }
                      className={selectCls}
                    >
                      <option value="">Select status</option>
                      <option value="operating">Operating</option>
                      <option value="paused">Paused</option>
                      <option value="planning">Planning</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {section.key === "financial" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={getLabelClass("financial", "current_funding_source")}>
                      Current Funding Source
                    </label>
                    <select
                      value={form.current_funding_source || ""}
                      onChange={(e) =>
                        setFormState((prev) => ({
                          ...prev,
                          current_funding_source: e.target.value,
                        }))
                      }
                      className={selectCls}
                    >
                      <option value="">Select funding source</option>
                      {FUNDING_SOURCES.map((source) => (
                        <option key={source.value} value={source.value}>
                          {source.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={getLabelClass("financial", "funding_amount_needed")}>
                      Funding Amount Needed
                    </label>
                    <select
                      value={form.funding_amount_needed || ""}
                      onChange={(e) =>
                        setFormState((prev) => ({
                          ...prev,
                          funding_amount_needed: e.target.value,
                        }))
                      }
                      className={selectCls}
                    >
                      <option value="">Select amount</option>
                      <option value="0-5k">Under $5,000</option>
                      <option value="5k-10k">$5,000 - $10,000</option>
                      <option value="10k-25k">$10,000 - $25,000</option>
                      <option value="25k-50k">$25,000 - $50,000</option>
                      <option value="50k-100k">$50,000 - $100,000</option>
                      <option value="100k+">Over $100,000</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-5 pt-4 border-t border-gray-200 flex flex-col sm:flex-row sm:justify-end gap-3 px-4 sm:px-6 pb-4 sm:pb-5">
              <button
                type="button"
                onClick={() => handleSaveSection(section.key)}
                disabled={submitting || isLoading}
                className="inline-flex min-h-[44px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#0d4f4f] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1a6b6b] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting || isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Save section"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[#0a1628]">
            Business Insights
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Complete one section at a time. You can save progress as you go.
          </p>
        </div>

        <div className="space-y-4">
          {SECTIONS.map(renderSection)}
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row sm:justify-end">
        <button
          onClick={handleSubmitAll}
          disabled={submitting || isLoading}
          className="inline-flex min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#0d4f4f] px-6 py-3 text-sm font-bold text-white hover:bg-[#1a6b6b] transition shadow-[0_12px_30px_rgba(13,79,79,0.35)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting || isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              Submit Business Insights
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
