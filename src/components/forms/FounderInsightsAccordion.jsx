import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Users,
  TrendingUp,
  Globe,
  AlertCircle,
  Rocket,
  Lightbulb,
} from "lucide-react";
import {
  BUSINESS_STAGE,
  FOUNDER_MOTIVATIONS,
  BUSINESS_CHALLENGES,
  SUPPORT_NEEDS,
  GOALS_NEXT_12_MONTHS,
  COMMUNITY_IMPACT_AREAS,
  FAMILY_RESPONSIBILITIES,
  GENDER_OPTIONS,
  AGE_RANGES,
  FUNDING_SOURCES,
  INVESTMENT_STAGES,
  REVENUE_STREAMS,
  ANGEL_INVESTOR_INTEREST,
  INVESTOR_CAPACITY,
} from "@/constants/unifiedConstants";

const SECTIONS = [
  {
    key: "founder",
    label: "Founder Background",
    icon: Users,
    description: "Help us understand the person behind the business",
  },
  {
    key: "pacific",
    label: "Pacific Context",
    icon: Globe,
    description: "Help us understand your Pacific identity and how it shapes your business",
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
    description: "Help us identify real barriers and support gaps for Pacific founders",
  },
  {
    key: "growth",
    label: "Growth & Future",
    icon: Rocket,
    description: "Help us understand your ambition, readiness, and next-stage needs",
  },
  {
    key: "community",
    label: "Community & Impact",
    icon: Lightbulb,
    description: "Help us understand your values, collaboration, and ecosystem potential",
  },
];

const SECTION_FIELDS = {
  founder: [
    "gender",
    "age_range",
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
  challenges: ["top_challenges", "support_needed_next"],
  growth: ["business_stage", "goals_next_12_months_array", "goals_details"],
  community: [
    "community_impact_areas",
    "collaboration_interest",
    "mentorship_offering",
    "open_to_future_contact",
  ],
};

export default function FounderInsightsAccordion({
  businessId,
  onSubmit,
  isLoading,
  initialData = null,
  onStart,
}) {
  const getInitialForm = () => {
    const defaults = {
      gender: "",
      age_range: "",
      years_entrepreneurial: "",
      businesses_founded: "",
      founder_role: "",
      founder_motivation_array: [],
      founder_story: "",

      serves_pacific_communities: "",
      culture_influences_business: false,
      culture_influence_details: "",
      family_community_responsibilities_affect_business: [],
      responsibilities_impact_details: "",

      current_funding_source: "",
      investment_stage: "",
      financial_challenges: "",
      funding_amount_needed: "",
      funding_purpose: "",
      angel_investor_interest: "",
      investor_capacity: "",

      top_challenges: [],
      support_needed_next: [],

      business_stage: "",
      goals_next_12_months_array: [],
      goals_details: "",

      community_impact_areas: [],
      collaboration_interest: false,
      mentorship_offering: false,
      open_to_future_contact: false,

      revenue_streams: [],
    };

    return initialData ? { ...defaults, ...initialData } : defaults;
  };

  const [form, setForm] = useState(() => getInitialForm());
  const [expandedSections, setExpandedSections] = useState(new Set(["founder"]));
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
      user_id: user.id,
      business_id: businessId ?? null,
      snapshot_year: new Date().getFullYear(),
      submitted_date: new Date().toISOString(),
      submission_type: "section",
      completion_status: "in_progress",
    };

    for (const field of fields) {
      payload[field] = form[field];
    }

    return payload;
  };

  const handleSaveSection = async (sectionKey) => {
    setSubmitting(true);
    try {
      // Import getSupabase for auth only
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
      // Import getSupabase for auth only
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();
      
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("User not authenticated");

      const payload = {
        user_id: user.id,
        business_id: businessId ?? null,
        snapshot_year: new Date().getFullYear(),
        submitted_date: new Date().toISOString(),
        submission_type: "full",
        completion_status: "completed",

        gender: form.gender,
        age_range: form.age_range,
        years_entrepreneurial: form.years_entrepreneurial,
        businesses_founded: form.businesses_founded,
        founder_role: form.founder_role,
        founder_motivation_array: form.founder_motivation_array ?? [],
        founder_story: form.founder_story,

        serves_pacific_communities: form.serves_pacific_communities,
        culture_influences_business: form.culture_influences_business,
        culture_influence_details: form.culture_influence_details,
        family_community_responsibilities_affect_business:
          form.family_community_responsibilities_affect_business,
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

        business_stage: form.business_stage,
        goals_next_12_months_array: form.goals_next_12_months_array ?? [],
        goals_details: form.goals_details,

        community_impact_areas: form.community_impact_areas ?? [],
        collaboration_interest: form.collaboration_interest,
        mentorship_offering: form.mentorship_offering,
        open_to_future_contact: form.open_to_future_contact,
      };

      await onSubmit(payload);
    } catch (error) {
      console.error("Failed to submit founder insights:", error);
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
              field === "goals_next_12_months_array" ||
              field === "founder_motivation_array"
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
    const sectionErrors = [];

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
                  {hasErrors && (
                    <span className="ml-2 text-xs text-red-600">(Required)</span>
                  )}
                </h4>

                <p
                  className={`mt-1 text-sm leading-5 ${
                    hasErrors ? "text-red-700" : "text-gray-600"
                  }`}
                >
                  {section.description}
                  {hasErrors && sectionErrors.length > 0 && (
                    <span className="block mt-1 text-xs">
                      Missing: {sectionErrors.join(", ")}
                    </span>
                  )}
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
          <>
            <div className="px-4 sm:px-6 py-4 sm:py-5 bg-gray-50 border-t border-gray-200">
              {section.key === "founder" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={getLabelClass("founder", "gender")}>Gender</label>
                      <select
                        value={form.gender || ""}
                        onChange={(e) =>
                          setFormState((prev) => ({ ...prev, gender: e.target.value }))
                        }
                        className={selectCls}
                      >
                        <option value="">Select gender</option>
                        {GENDER_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={getLabelClass("founder", "age_range")}>
                        Age Range
                      </label>
                      <select
                        value={form.age_range || ""}
                        onChange={(e) =>
                          setFormState((prev) => ({
                            ...prev,
                            age_range: e.target.value,
                          }))
                        }
                        className={selectCls}
                      >
                        <option value="">Select age range</option>
                        {AGE_RANGES.map((range) => (
                          <option key={range.value} value={range.value}>
                            {range.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={getLabelClass("founder", "years_entrepreneurial")}>
                        Years as entrepreneur
                      </label>
                      <select
                        value={form.years_entrepreneurial || ""}
                        onChange={(e) =>
                          setFormState((prev) => ({
                            ...prev,
                            years_entrepreneurial: e.target.value,
                          }))
                        }
                        className={selectCls}
                      >
                        <option value="">Select years</option>
                        <option value="0-1">Less than 1 year</option>
                        <option value="1-3">1-3 years</option>
                        <option value="3-5">3-5 years</option>
                        <option value="5-10">5-10 years</option>
                        <option value="10+">10+ years</option>
                      </select>
                    </div>

                    <div>
                      <label className={getLabelClass("founder", "businesses_founded")}>
                        First business?
                      </label>
                      <select
                        value={form.businesses_founded || ""}
                        onChange={(e) =>
                          setFormState((prev) => ({
                            ...prev,
                            businesses_founded: e.target.value,
                          }))
                        }
                        className={selectCls}
                      >
                        <option value="">Select option</option>
                        <option value="first">Yes, first business</option>
                        <option value="multiple">No, founded others before</option>
                      </select>
                    </div>

                    <div>
                      <label className={getLabelClass("founder", "founder_role")}>
                        Your role
                      </label>
                      <select
                        value={form.founder_role || ""}
                        onChange={(e) =>
                          setFormState((prev) => ({
                            ...prev,
                            founder_role: e.target.value,
                          }))
                        }
                        className={selectCls}
                      >
                        <option value="">Select role</option>
                        <option value="founder">Founder/Owner</option>
                        <option value="cofounder">Co-founder</option>
                        <option value="partner">Partner</option>
                        <option value="director">Director</option>
                        <option value="manager">Manager</option>
                        <option value="employee">Employee</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={getLabelClass("founder", "founder_motivation_array")}>
                      What motivates you as a founder? (Select up to 3)
                    </label>
                    <div className="space-y-2">
                      {FOUNDER_MOTIVATIONS.map((motivation) => (
                        <label
                          key={motivation.value}
                          className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-xl border border-transparent"
                        >
                          <input
                            type="checkbox"
                            checked={
                              form.founder_motivation_array?.includes(motivation.value) ||
                              false
                            }
                            onChange={() =>
                              toggleArrayItem("founder_motivation_array", motivation.value)
                            }
                            className="w-4 h-4 text-[#0d4f4f] border-gray-300 rounded focus:ring-[#0d4f4f] mt-0.5"
                          />
                          <span className="text-sm leading-5 text-gray-700">
                            {motivation.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={getLabelClass("founder", "founder_story")}>
                      Your founder story (optional)
                    </label>
                    <textarea
                      value={form.founder_story || ""}
                      onChange={(e) =>
                        setFormState((prev) => ({
                          ...prev,
                          founder_story: e.target.value,
                        }))
                      }
                      placeholder="Briefly share your journey as a founder..."
                      rows={4}
                      className={inputCls}
                    />
                  </div>
                </div>
              )}

              {section.key === "pacific" && (
                <div className="space-y-4">
                  <div>
                    <label
                      className={getLabelClass("pacific", "serves_pacific_communities")}
                    >
                      Which Pacific communities do you primarily serve?
                    </label>
                    <select
                      value={form.serves_pacific_communities || ""}
                      onChange={(e) =>
                        setFormState((prev) => ({
                          ...prev,
                          serves_pacific_communities: e.target.value,
                        }))
                      }
                      className={selectCls}
                    >
                      <option value="">Select communities</option>
                      <option value="fiji">Fiji</option>
                      <option value="samoa">Samoa</option>
                      <option value="tonga">Tonga</option>
                      <option value="cook-islands">Cook Islands</option>
                      <option value="vanuatu">Vanuatu</option>
                      <option value="solomon-islands">Solomon Islands</option>
                      <option value="kiribati">Kiribati</option>
                      <option value="tuvalu">Tuvalu</option>
                      <option value="nauru">Nauru</option>
                      <option value="pacific-diaspora">Pacific diaspora</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.culture_influences_business || false}
                        onChange={(e) =>
                          setFormState((prev) => ({
                            ...prev,
                            culture_influences_business: e.target.checked,
                          }))
                        }
                        className="w-4 h-4 text-[#0d4f4f] border-gray-300 rounded focus:ring-[#0d4f4f]"
                      />
                      <span className="text-sm text-gray-700">
                        Pacific culture influences how I run my business
                      </span>
                    </label>
                  </div>

                  {form.culture_influences_business && (
                    <div>
                      <label
                        className={getLabelClass("pacific", "culture_influence_details")}
                      >
                        How does Pacific culture influence your business?
                      </label>
                      <textarea
                        value={form.culture_influence_details || ""}
                        onChange={(e) =>
                          setFormState((prev) => ({
                            ...prev,
                            culture_influence_details: e.target.value,
                          }))
                        }
                        placeholder="Describe how Pacific cultural values, practices, or traditions shape your business approach..."
                        rows={3}
                        className={inputCls}
                      />
                    </div>
                  )}

                  <div>
                    <label
                      className={getLabelClass(
                        "pacific",
                        "family_community_responsibilities_affect_business"
                      )}
                    >
                      What family commitments do you have alongside your business
                      responsibilities?
                    </label>
                    <div className="space-y-2">
                      {FAMILY_RESPONSIBILITIES.map((responsibility) => (
                        <label
                          key={responsibility.value}
                          className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-xl border border-transparent"
                        >
                          <input
                            type="checkbox"
                            checked={
                              form.family_community_responsibilities_affect_business?.includes(
                                responsibility.value
                              ) || false
                            }
                            onChange={() =>
                              toggleArrayItem(
                                "family_community_responsibilities_affect_business",
                                responsibility.value
                              )
                            }
                            className="w-4 h-4 text-[#0d4f4f] border-gray-300 rounded focus:ring-[#0d4f4f] mt-0.5"
                          />
                          <span className="text-sm leading-5 text-gray-700">
                            {responsibility.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {form.family_community_responsibilities_affect_business &&
                    form.family_community_responsibilities_affect_business.length > 0 && (
                      <div>
                        <label
                          className={getLabelClass(
                            "pacific",
                            "responsibilities_impact_details"
                          )}
                        >
                          Tell us more about these responsibilities (Optional)
                        </label>
                        <textarea
                          value={form.responsibilities_impact_details || ""}
                          onChange={(e) =>
                            setFormState((prev) => ({
                              ...prev,
                              responsibilities_impact_details: e.target.value,
                            }))
                          }
                          placeholder="Share how family, community, or cultural obligations influence your business decisions or operations..."
                          rows={3}
                          className={inputCls}
                        />
                      </div>
                    )}
                </div>
              )}

              {section.key === "financial" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        className={getLabelClass("financial", "current_funding_source")}
                      >
                        Current funding source
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
                      <label className={getLabelClass("financial", "investment_stage")}>
                        Current investment stage
                      </label>
                      <select
                        value={form.investment_stage || ""}
                        onChange={(e) =>
                          setFormState((prev) => ({
                            ...prev,
                            investment_stage: e.target.value,
                          }))
                        }
                        className={selectCls}
                      >
                        <option value="">Select stage</option>
                        {INVESTMENT_STAGES.map((stage) => (
                          <option key={stage.value} value={stage.value}>
                            {stage.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={getLabelClass("financial", "revenue_streams")}>
                      Revenue streams (select all that apply)
                    </label>
                    <div className="space-y-2">
                      {REVENUE_STREAMS.map((stream) => (
                        <label
                          key={stream.value}
                          className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-xl border border-transparent"
                        >
                          <input
                            type="checkbox"
                            checked={form.revenue_streams?.includes(stream.value) || false}
                            onChange={() =>
                              toggleArrayItem("revenue_streams", stream.value)
                            }
                            className="w-4 h-4 text-[#0d4f4f] border-gray-300 rounded focus:ring-[#0d4f4f] mt-0.5"
                          />
                          <span className="text-sm leading-5 text-gray-700">
                            {stream.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={getLabelClass("financial", "financial_challenges")}>
                      Biggest financial challenges
                    </label>
                    <textarea
                      value={form.financial_challenges || ""}
                      onChange={(e) =>
                        setFormState((prev) => ({
                          ...prev,
                          financial_challenges: e.target.value,
                        }))
                      }
                      placeholder="What are your main financial challenges right now?"
                      rows={3}
                      className={inputCls}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={getLabelClass("financial", "angel_investor_interest")}>
                        Looking to invest in businesses?
                      </label>
                      <select
                        value={form.angel_investor_interest || ""}
                        onChange={(e) =>
                          setFormState((prev) => ({
                            ...prev,
                            angel_investor_interest: e.target.value,
                          }))
                        }
                        className={selectCls}
                      >
                        <option value="">Select option</option>
                        {ANGEL_INVESTOR_INTEREST.map((interest) => (
                          <option key={interest.value} value={interest.value}>
                            {interest.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={getLabelClass("financial", "investor_capacity")}>
                        Investment capacity
                      </label>
                      <select
                        value={form.investor_capacity || ""}
                        onChange={(e) =>
                          setFormState((prev) => ({
                            ...prev,
                            investor_capacity: e.target.value,
                          }))
                        }
                        className={selectCls}
                      >
                        <option value="">Select capacity</option>
                        {INVESTOR_CAPACITY.map((capacity) => (
                          <option key={capacity.value} value={capacity.value}>
                            {capacity.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {section.key === "challenges" && (
                <div className="space-y-4">
                  <div>
                    <label className={getLabelClass("challenges", "top_challenges")}>
                      Top 5 challenges (select up to 5)
                    </label>
                    <div className="space-y-2">
                      {BUSINESS_CHALLENGES.map((challenge) => (
                        <label
                          key={challenge.value}
                          className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-xl border border-transparent"
                        >
                          <input
                            type="checkbox"
                            checked={form.top_challenges?.includes(challenge.value) || false}
                            onChange={() =>
                              toggleArrayItem("top_challenges", challenge.value)
                            }
                            className="w-4 h-4 text-[#0d4f4f] border-gray-300 rounded focus:ring-[#0d4f4f] mt-0.5"
                          />
                          <span className="text-sm leading-5 text-gray-700">
                            {challenge.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={getLabelClass("challenges", "support_needed_next")}>
                      Support needed for next 12 months (select up to 3)
                    </label>
                    <div className="space-y-2">
                      {SUPPORT_NEEDS.map((support) => (
                        <label
                          key={support.value}
                          className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-xl border border-transparent"
                        >
                          <input
                            type="checkbox"
                            checked={
                              form.support_needed_next?.includes(support.value) || false
                            }
                            onChange={() =>
                              toggleArrayItem("support_needed_next", support.value)
                            }
                            className="w-4 h-4 text-[#0d4f4f] border-gray-300 rounded focus:ring-[#0d4f4f] mt-0.5"
                          />
                          <span className="text-sm leading-5 text-gray-700">
                            {support.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {section.key === "growth" && (
                <div className="space-y-4">
                  <div>
                    <label className={getLabelClass("growth", "business_stage")}>
                      Current business stage
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
                      <option value={BUSINESS_STAGE[0].value}>Idea / Planning</option>
                      <option value={BUSINESS_STAGE[1].value}>Startup</option>
                      <option value={BUSINESS_STAGE[2].value}>Growth</option>
                      <option value={BUSINESS_STAGE[3].value}>Mature</option>
                    </select>
                  </div>

                  <div>
                    <label
                      className={getLabelClass("growth", "goals_next_12_months_array")}
                    >
                      Goals for next 12 months (select up to 3)
                    </label>
                    <div className="space-y-2">
                      {GOALS_NEXT_12_MONTHS.map((goal) => (
                        <label
                          key={goal.value}
                          className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-xl border border-transparent"
                        >
                          <input
                            type="checkbox"
                            checked={
                              form.goals_next_12_months_array?.includes(goal.value) ||
                              false
                            }
                            onChange={() =>
                              toggleArrayItem("goals_next_12_months_array", goal.value)
                            }
                            className="w-4 h-4 text-[#0d4f4f] border-gray-300 rounded focus:ring-[#0d4f4f] mt-0.5"
                          />
                          <span className="text-sm leading-5 text-gray-700">
                            {goal.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={getLabelClass("growth", "goals_details")}>
                      Additional goals details
                    </label>
                    <textarea
                      value={form.goals_details || ""}
                      onChange={(e) =>
                        setFormState((prev) => ({
                          ...prev,
                          goals_details: e.target.value,
                        }))
                      }
                      placeholder="Any specific goals or milestones you're working towards?"
                      rows={3}
                      className={inputCls}
                    />
                  </div>
                </div>
              )}

              {section.key === "community" && (
                <div className="space-y-4">
                  <div>
                    <label className={getLabelClass("community", "community_impact_areas")}>
                      Community impact areas (select all that apply)
                    </label>
                    <div className="space-y-2">
                      {COMMUNITY_IMPACT_AREAS.map((area) => (
                        <label
                          key={area.value}
                          className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-xl border border-transparent"
                        >
                          <input
                            type="checkbox"
                            checked={
                              form.community_impact_areas?.includes(area.value) || false
                            }
                            onChange={() =>
                              toggleArrayItem("community_impact_areas", area.value)
                            }
                            className="w-4 h-4 text-[#0d4f4f] border-gray-300 rounded focus:ring-[#0d4f4f] mt-0.5"
                          />
                          <span className="text-sm leading-5 text-gray-700">
                            {area.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={getLabelClass("community", "collaboration_interest")}>
                      Interested in partnerships or collaborations?
                    </label>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mt-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="collaboration_interest"
                          checked={form.collaboration_interest === true}
                          onChange={() =>
                            setFormState((prev) => ({
                              ...prev,
                              collaboration_interest: true,
                            }))
                          }
                          className="w-4 h-4 text-[#0d4f4f] border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">Yes</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="collaboration_interest"
                          checked={form.collaboration_interest === false}
                          onChange={() =>
                            setFormState((prev) => ({
                              ...prev,
                              collaboration_interest: false,
                            }))
                          }
                          className="w-4 h-4 text-[#0d4f4f] border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">No</span>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.mentorship_offering || false}
                          onChange={(e) =>
                            setFormState((prev) => ({
                              ...prev,
                              mentorship_offering: e.target.checked,
                            }))
                          }
                          className="w-4 h-4 text-[#0d4f4f] border-gray-300 rounded focus:ring-[#0d4f4f]"
                        />
                        <span className="text-sm text-gray-700">
                          Willing to mentor other founders
                        </span>
                      </label>
                    </div>

                    <div>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.open_to_future_contact || false}
                          onChange={(e) =>
                            setFormState((prev) => ({
                              ...prev,
                              open_to_future_contact: e.target.checked,
                            }))
                          }
                          className="w-4 h-4 text-[#0d4f4f] border-gray-300 rounded focus:ring-[#0d4f4f]"
                        />
                        <span className="text-sm text-gray-700">
                          Open to future contact from Pacific Market
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

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
          </>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 sm:px-5 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#0d4f4f]">
              Founder Insights
            </p>
            <p className="text-sm text-gray-600">
              Complete one section at a time. You can save progress as you go.
            </p>
          </div>
          <div className="text-xs text-gray-500">
            {expandedSections.size} section{expandedSections.size !== 1 ? "s" : ""} open
          </div>
        </div>
      </div>

      {SECTIONS.map(renderSection)}

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
              Submit Founder Insights
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}