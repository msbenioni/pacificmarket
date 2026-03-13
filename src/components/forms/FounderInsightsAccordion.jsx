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
  CheckCircle2,
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
    label: "Founder background",
    description: "Share who you are, what drives you, and the story behind your work.",
    icon: Users,
  },
  {
    key: "pacific",
    label: "Culture & community context",
    description:
      "Help us understand how identity, culture, and responsibilities shape your business journey.",
    icon: Globe,
  },
  {
    key: "financial",
    label: "Funding & revenue picture",
    description:
      "Give context around funding, revenue, and the financial realities behind growth.",
    icon: TrendingUp,
  },
  {
    key: "challenges",
    label: "Barriers & support needed",
    description:
      "Tell us where you need support so the right opportunities and resources can be surfaced.",
    icon: AlertCircle,
  },
  {
    key: "growth",
    label: "Growth priorities",
    description:
      "Show where the business is now and what you want to achieve over the next 12 months.",
    icon: Rocket,
  },
  {
    key: "community",
    label: "Collaboration & impact",
    description:
      "Share how you want to contribute, collaborate, and create value in the wider ecosystem.",
    icon: Lightbulb,
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
  growth: ["growth_stage", "goals_next_12_months_array", "goals_details"],
  community: [
    "community_impact_areas",
    "collaboration_interest",
    "mentorship_offering",
    "open_to_future_contact",
  ],
};

const inputCls =
  "w-full min-h-[50px] rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-[#0a1628] placeholder:text-slate-400 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition focus:border-[#0d4f4f] focus:outline-none focus:ring-4 focus:ring-[#0d4f4f]/10";

const textareaCls =
  "w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-[#0a1628] placeholder:text-slate-400 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition focus:border-[#0d4f4f] focus:outline-none focus:ring-4 focus:ring-[#0d4f4f]/10 resize-none";

const selectCls =
  "w-full min-h-[50px] rounded-2xl border border-slate-300 bg-white px-4 py-3 pr-11 text-sm text-[#0a1628] shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition focus:border-[#0d4f4f] focus:outline-none focus:ring-4 focus:ring-[#0d4f4f]/10 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzY0NzQ4QiIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K')] bg-no-repeat bg-[center_right_1rem] bg-[length:0.8rem]";

const labelCls = "mb-2 block text-sm font-semibold text-[#0a1628]";
const helperCls = "mt-1 text-xs text-slate-500";

function OptionCard({ checked, onChange, label, type = "checkbox" }) {
  return (
    <label
      className={`flex min-h-[64px] w-full cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition ${
        checked
          ? "border-[#0d4f4f]/30 bg-[#0d4f4f]/6 shadow-[0_8px_20px_rgba(13,79,79,0.08)]"
          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      <input
        type={type}
        checked={checked}
        onChange={onChange}
        className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 text-[#0d4f4f] focus:ring-[#0d4f4f]"
      />
      <span className="text-sm leading-6 text-slate-700">{label}</span>
    </label>
  );
}

function SectionShell({
  section,
  expanded,
  onToggle,
  children,
  onSave,
  submitting,
  isLoading,
}) {
  const Icon = section.icon;

  return (
    <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
      <button
        type="button"
        onClick={onToggle}
        className="w-full bg-gradient-to-r from-white via-white to-slate-50 px-4 py-4 text-left sm:px-5"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <div className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#0d4f4f]/10 text-[#0d4f4f]">
              <Icon className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h4 className="text-base font-semibold text-[#0a1628] sm:text-[17px]">
                {section.label}
              </h4>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {section.description}
              </p>
            </div>
          </div>

          <div className="shrink-0 text-slate-400">
            {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </div>
        </div>
      </button>

      {expanded && (
        <>
          <div className="border-t border-slate-200 bg-[#f8fafc] px-4 py-4 sm:px-5 sm:py-5">
            {children}
          </div>

          <div className="border-t border-slate-200 bg-white px-4 py-4 sm:px-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onSave}
                disabled={submitting || isLoading}
                className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl bg-[#0d4f4f] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(13,79,79,0.25)] transition hover:bg-[#136060] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {submitting || isLoading ? (
                  <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Save this section
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

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

      growth_stage: "",
      goals_next_12_months_array: [],
      goals_details: "",

      community_impact_areas: [],
      collaboration_interest: null,
      mentorship_offering: false,
      open_to_future_contact: false,

      revenue_streams: [],
    };

    return initialData ? { ...defaults, ...initialData } : defaults;
  };

  const [form, setForm] = useState(() => getInitialForm());
  const [expandedSections, setExpandedSections] = useState(new Set());
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
      const mappedData = {
        ...initialData,
        ...(initialData.business_stage
          ? {
              growth_stage: initialData.business_stage,
              business_stage: undefined,
            }
          : {}),
      };
      setForm((prev) => ({ ...prev, ...mappedData }));
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
      snapshot_year: new Date().getFullYear(),
      submitted_date: new Date().toISOString(),
    };

    const founderFields = [
      "gender",
      "age_range",
      "years_entrepreneurial",
      "entrepreneurial_background",
      "businesses_founded",
      "family_entrepreneurial_background",
      "founder_role",
      "founder_story",
      "founder_motivation_array",
      "pacific_identity",
      "based_in_country",
      "based_in_city",
      "serves_pacific_communities",
      "culture_influences_business",
      "culture_influence_details",
      "family_community_responsibilities_affect_business",
      "responsibilities_impact_details",
      "mentorship_access",
      "mentorship_offering",
      "barriers_to_mentorship",
      "angel_investor_interest",
      "investor_capacity",
      "collaboration_interest",
      "open_to_future_contact",
      "goals_details",
      "goals_next_12_months_array",
    ];

    for (const field of fields) {
      if (founderFields.includes(field)) {
        payload[field] = form[field];
      }
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
        user_id: user.id,
        snapshot_year: new Date().getFullYear(),
        submitted_date: new Date().toISOString(),

        gender: form.gender,
        age_range: form.age_range,
        years_entrepreneurial: form.years_entrepreneurial,
        entrepreneurial_background: form.entrepreneurial_background,
        businesses_founded: form.businesses_founded,
        family_entrepreneurial_background: form.family_entrepreneurial_background,
        founder_role: form.founder_role,
        founder_story: form.founder_story,
        founder_motivation_array: form.founder_motivation_array ?? [],

        pacific_identity: form.pacific_identity ?? [],
        based_in_country: form.based_in_country,
        based_in_city: form.based_in_city,
        serves_pacific_communities: form.serves_pacific_communities,
        culture_influences_business: form.culture_influences_business,
        culture_influence_details: form.culture_influence_details,
        family_community_responsibilities_affect_business:
          form.family_community_responsibilities_affect_business,
        responsibilities_impact_details: form.responsibilities_impact_details,

        mentorship_access: form.mentorship_access,
        mentorship_offering: form.mentorship_offering,
        barriers_to_mentorship: form.barriers_to_mentorship,
        angel_investor_interest: form.angel_investor_interest,
        investor_capacity: form.investor_capacity,
        collaboration_interest: form.collaboration_interest,
        open_to_future_contact: form.open_to_future_contact,

        goals_details: form.goals_details,
        goals_next_12_months_array: form.goals_next_12_months_array ?? [],
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

      if (limit && currentArray.length >= limit) return prev;

      return { ...prev, [field]: [...currentArray, item] };
    });
  };

  const selectedCount = {
    founder_motivation_array: form.founder_motivation_array?.length || 0,
    top_challenges: form.top_challenges?.length || 0,
    support_needed_next: form.support_needed_next?.length || 0,
    goals_next_12_months_array: form.goals_next_12_months_array?.length || 0,
  };

  return (
    <div className="space-y-4">
      {SECTIONS.map((section) => {
        const isExpanded = expandedSections.has(section.key);

        return (
          <SectionShell
            key={section.key}
            section={section}
            expanded={isExpanded}
            onToggle={() => toggleSection(section.key)}
            onSave={() => handleSaveSection(section.key)}
            submitting={submitting}
            isLoading={isLoading}
          >
            {section.key === "founder" && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className={labelCls}>Gender</label>
                    <select
                      value={form.gender || ""}
                      onChange={(e) => setFormState((prev) => ({ ...prev, gender: e.target.value }))}
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
                    <label className={labelCls}>Age range</label>
                    <select
                      value={form.age_range || ""}
                      onChange={(e) =>
                        setFormState((prev) => ({ ...prev, age_range: e.target.value }))
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
                    <label className={labelCls}>Years in business or entrepreneurship</label>
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
                      <option value="1-3">1–3 years</option>
                      <option value="3-5">3–5 years</option>
                      <option value="5-10">5–10 years</option>
                      <option value="10+">10+ years</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelCls}>Is this your first business?</label>
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
                      <option value="first">Yes, this is my first business</option>
                      <option value="multiple">No, I have founded others before</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className={labelCls}>Your role in the business</label>
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
                      <option value="founder">Founder / Owner</option>
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
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <label className={labelCls}>What motivates you as a founder?</label>
                      <p className={helperCls}>Choose up to 3 options.</p>
                    </div>
                    <span className="text-xs font-medium text-slate-500">
                      {selectedCount.founder_motivation_array}/3 selected
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {FOUNDER_MOTIVATIONS.map((motivation) => (
                      <OptionCard
                        key={motivation.value}
                        checked={form.founder_motivation_array?.includes(motivation.value) || false}
                        onChange={() =>
                          toggleArrayItem("founder_motivation_array", motivation.value)
                        }
                        label={motivation.label}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Your founder story</label>
                  <p className={helperCls}>
                    Optional, but helpful. A short story adds depth to your profile.
                  </p>
                  <textarea
                    value={form.founder_story || ""}
                    onChange={(e) =>
                      setFormState((prev) => ({ ...prev, founder_story: e.target.value }))
                    }
                    placeholder="Share what led you to start, build, or grow this business..."
                    rows={5}
                    className={`${textareaCls} mt-3`}
                  />
                </div>
              </div>
            )}

            {section.key === "pacific" && (
              <div className="space-y-5">
                <div>
                  <label className={labelCls}>Which Pacific communities do you mainly serve?</label>
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
                  <label className={labelCls}>Does Pacific culture influence how you run your business?</label>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <OptionCard
                      type="radio"
                      checked={form.culture_influences_business === true}
                      onChange={() =>
                        setFormState((prev) => ({
                          ...prev,
                          culture_influences_business: true,
                        }))
                      }
                      label="Yes, Pacific culture shapes how I run the business"
                    />
                    <OptionCard
                      type="radio"
                      checked={form.culture_influences_business === false}
                      onChange={() =>
                        setFormState((prev) => ({
                          ...prev,
                          culture_influences_business: false,
                        }))
                      }
                      label="No, not in a major way"
                    />
                  </div>
                </div>

                {form.culture_influences_business && (
                  <div>
                    <label className={labelCls}>How does culture show up in your business?</label>
                    <textarea
                      value={form.culture_influence_details || ""}
                      onChange={(e) =>
                        setFormState((prev) => ({
                          ...prev,
                          culture_influence_details: e.target.value,
                        }))
                      }
                      placeholder="For example: values, service style, language, design, relationships, responsibility, or community expectations."
                      rows={4}
                      className={textareaCls}
                    />
                  </div>
                )}

                <div>
                  <div>
                    <label className={labelCls}>
                      What family or community responsibilities do you balance alongside business?
                    </label>
                    <p className={helperCls}>Select all that apply.</p>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {FAMILY_RESPONSIBILITIES.map((responsibility) => (
                      <OptionCard
                        key={responsibility.value}
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
                        label={responsibility.label}
                      />
                    ))}
                  </div>
                </div>

                {form.family_community_responsibilities_affect_business?.length > 0 && (
                  <div>
                    <label className={labelCls}>Anything else you want to share about these responsibilities?</label>
                    <textarea
                      value={form.responsibilities_impact_details || ""}
                      onChange={(e) =>
                        setFormState((prev) => ({
                          ...prev,
                          responsibilities_impact_details: e.target.value,
                        }))
                      }
                      placeholder="Share anything that helps explain the realities you are managing."
                      rows={4}
                      className={textareaCls}
                    />
                  </div>
                )}
              </div>
            )}

            {section.key === "financial" && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className={labelCls}>Current funding source</label>
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
                    <label className={labelCls}>Current investment stage</label>
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
                  <label className={labelCls}>How does this business make money?</label>
                  <p className={helperCls}>Select all revenue streams that apply.</p>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {REVENUE_STREAMS.map((stream) => (
                      <OptionCard
                        key={stream.value}
                        checked={form.revenue_streams?.includes(stream.value) || false}
                        onChange={() => toggleArrayItem("revenue_streams", stream.value)}
                        label={stream.label}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Biggest financial challenges right now</label>
                  <textarea
                    value={form.financial_challenges || ""}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        financial_challenges: e.target.value,
                      }))
                    }
                    placeholder="For example: cash flow, inconsistent revenue, funding access, pricing, staffing, or operational costs."
                    rows={4}
                    className={textareaCls}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className={labelCls}>Interested in investing in other businesses?</label>
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
                    <label className={labelCls}>Investment capacity</label>
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
              <div className="space-y-5">
                <div>
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <label className={labelCls}>Top challenges</label>
                      <p className={helperCls}>Choose up to 5.</p>
                    </div>
                    <span className="text-xs font-medium text-slate-500">
                      {selectedCount.top_challenges}/5 selected
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {BUSINESS_CHALLENGES.map((challenge) => (
                      <OptionCard
                        key={challenge.value}
                        checked={form.top_challenges?.includes(challenge.value) || false}
                        onChange={() => toggleArrayItem("top_challenges", challenge.value)}
                        label={challenge.label}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <label className={labelCls}>What support would help most over the next 12 months?</label>
                      <p className={helperCls}>Choose up to 3.</p>
                    </div>
                    <span className="text-xs font-medium text-slate-500">
                      {selectedCount.support_needed_next}/3 selected
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {SUPPORT_NEEDS.map((support) => (
                      <OptionCard
                        key={support.value}
                        checked={form.support_needed_next?.includes(support.value) || false}
                        onChange={() => toggleArrayItem("support_needed_next", support.value)}
                        label={support.label}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {section.key === "growth" && (
              <div className="space-y-5">
                <div>
                  <label className={labelCls}>Current business stage</label>
                  <select
                    value={form.growth_stage || ""}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        growth_stage: e.target.value,
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
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <label className={labelCls}>Top priorities for the next 12 months</label>
                      <p className={helperCls}>Choose up to 3.</p>
                    </div>
                    <span className="text-xs font-medium text-slate-500">
                      {selectedCount.goals_next_12_months_array}/3 selected
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {GOALS_NEXT_12_MONTHS.map((goal) => (
                      <OptionCard
                        key={goal.value}
                        checked={form.goals_next_12_months_array?.includes(goal.value) || false}
                        onChange={() =>
                          toggleArrayItem("goals_next_12_months_array", goal.value)
                        }
                        label={goal.label}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Additional growth goals or milestones</label>
                  <textarea
                    value={form.goals_details || ""}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        goals_details: e.target.value,
                      }))
                    }
                    placeholder="Add any specific targets, milestones, or priorities you are working toward."
                    rows={4}
                    className={textareaCls}
                  />
                </div>
              </div>
            )}

            {section.key === "community" && (
              <div className="space-y-5">
                <div>
                  <label className={labelCls}>Where do you want your business to create impact?</label>
                  <p className={helperCls}>Select all that apply.</p>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {COMMUNITY_IMPACT_AREAS.map((area) => (
                      <OptionCard
                        key={area.value}
                        checked={form.community_impact_areas?.includes(area.value) || false}
                        onChange={() => toggleArrayItem("community_impact_areas", area.value)}
                        label={area.label}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Interested in collaborations or partnerships?</label>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <OptionCard
                      type="radio"
                      checked={form.collaboration_interest === true}
                      onChange={() =>
                        setFormState((prev) => ({
                          ...prev,
                          collaboration_interest: true,
                        }))
                      }
                      label="Yes, I am open to collaboration opportunities"
                    />
                    <OptionCard
                      type="radio"
                      checked={form.collaboration_interest === false}
                      onChange={() =>
                        setFormState((prev) => ({
                          ...prev,
                          collaboration_interest: false,
                        }))
                      }
                      label="No, not at the moment"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <OptionCard
                    checked={form.mentorship_offering || false}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        mentorship_offering: !prev.mentorship_offering,
                      }))
                    }
                    label="I would be open to mentoring other founders"
                  />
                  <OptionCard
                    checked={form.open_to_future_contact || false}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        open_to_future_contact: !prev.open_to_future_contact,
                      }))
                    }
                    label="I am open to future contact from Pacific Market"
                  />
                </div>
              </div>
            )}
          </SectionShell>
        );
      })}

      <div className="pt-2">
        <div className="rounded-[24px] border border-[#0d4f4f]/10 bg-gradient-to-r from-[#0d4f4f] to-[#136060] p-4 shadow-[0_20px_40px_rgba(13,79,79,0.22)] sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                Final step
              </p>
              <h4 className="mt-1 text-lg font-semibold">
                Save your full founder insights
              </h4>
              <p className="mt-1 text-sm text-white/80">
                Once you are happy with your responses, submit everything together.
              </p>
            </div>

            <button
              onClick={handleSubmitAll}
              disabled={submitting || isLoading}
              className="inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-bold text-[#0d4f4f] shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {submitting || isLoading ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-[#0d4f4f]/30 border-t-[#0d4f4f] animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit founder insights
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}