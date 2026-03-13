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
  ANGEL_INVESTOR_INTEREST,
  INVESTOR_CAPACITY,
} from "@/constants/unifiedConstants";

const SECTIONS = [
  {
    key: "business",
    label: "Business Overview",
    icon: Building2,
    description: "Basic information about your business operations and scale",
  },
  {
    key: "financial",
    label: "Financial Overview",
    icon: TrendingUp,
    description: "Funding sources, revenue, and investment needs",
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
    description: "How your business contributes to and engages with the wider community",
  },
];

const inputCls =
  "w-full min-h-[44px] border border-slate-300 rounded-xl px-4 py-3 text-sm text-[#0a1628] placeholder:text-slate-400 focus:outline-none focus:border-[#0d4f4f] focus:ring-2 focus:ring-[#0d4f4f]/10 bg-white shadow-sm";

const textareaCls =
  "w-full border border-slate-300 rounded-xl px-4 py-3 text-sm text-[#0a1628] placeholder:text-slate-400 focus:outline-none focus:border-[#0d4f4f] focus:ring-2 focus:ring-[#0d4f4f]/10 bg-white resize-none shadow-sm";

const selectCls =
  "w-full min-h-[44px] border border-slate-300 rounded-xl px-4 py-3 pr-10 text-sm text-[#0a1628] focus:outline-none focus:border-[#0d4f4f] focus:ring-2 focus:ring-[#0d4f4f]/10 bg-white appearance-none shadow-sm";

const labelCls = "block text-xs font-semibold uppercase tracking-wider text-slate-700";
const helperCls = "mt-1 text-xs text-slate-500";

function OptionCard({ checked, onChange, label, type = "checkbox" }) {
  return (
    <label
      className={`flex min-h-[64px] w-full cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition ${
        checked
          ? "border-[#0d4f4f]/30 bg-[#0d4f4f]/6 shadow-sm"
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
}) {
  const Icon = section.icon;

  return (
    <div className="rounded-xl border border-slate-300 bg-white shadow-sm transition-all hover:shadow-md">
      <div className="w-full px-4 py-4 sm:px-6">
        <button
          type="button"
          onClick={onToggle}
          className="flex w-full items-start justify-between gap-3 text-left transition-colors"
        >
          <div className="flex items-start gap-3">
            <Icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#0d4f4f]" />
            <div>
              <h4 className="break-words text-sm font-semibold text-[#0a1628]">
                {section.label}
              </h4>
              <p className="mt-1 text-sm leading-5 text-slate-600">
                {section.description}
              </p>
            </div>
          </div>

          <div className="mt-0.5 flex-shrink-0 text-slate-400">
            {expanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </div>
        </button>
      </div>

      {expanded && (
        <div className="px-4 sm:px-6 py-4 sm:py-5 bg-slate-50 border-t border-slate-200">
          {children}
        </div>
      )}
    </div>
  );
}

export default function BusinessInsightsAccordion({
  businessId,
  onSubmit,
  isLoading,
  initialData = null,
  onStart,
  embedded = false,
}) {
  const [form, setForm] = useState({
    business_stage: "",
    team_size_band: "",
    business_model: "",
    family_involvement: "",
    customer_region: "",
    sales_channels: [],
    revenue_band: "",
    business_operating_status: "",
    current_funding_source: "",
    funding_amount_needed: "",
    investment_stage: "",
    financial_challenges: "",
    top_challenges: [],
    support_needed_next: [],
    growth_stage: "",
    goals_next_12_months_array: [],
    goals_details: "",
    community_impact_areas: [],
    collaboration_interest: null,
    mentorship_offering: false,
    open_to_future_contact: false,
    business_description: "",
  });
  const [expandedSections, setExpandedSections] = useState(new Set());
  const [submitting, setSubmitting] = useState(false);

  const getInitialForm = () => ({
    business_stage: "",
    team_size_band: "",
    business_model: "",
    family_involvement: "",
    customer_region: "",
    sales_channels: [],
    revenue_band: "",
    business_operating_status: "",
    current_funding_source: "",
    funding_amount_needed: "",
    investment_stage: "",
    financial_challenges: "",
    top_challenges: [],
    support_needed_next: [],
    growth_stage: "",
    goals_next_12_months_array: [],
    goals_details: "",
    community_impact_areas: [],
    collaboration_interest: null,
    mentorship_offering: false,
    open_to_future_contact: false,
  });

  const toggleSection = (sectionKey) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionKey)) next.delete(sectionKey);
      else next.add(sectionKey);
      return next;
    });
  };

  const handleSubmitAll = async () => {
    setSubmitting(true);
    try {
      await onSubmit(form);
    } catch (error) {
      console.error("Failed to submit business insights:", error);
      alert("Failed to submit insights. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleArrayItem = (field, item) => {
    setForm((prev) => {
      const currentArray = prev[field] || [];
      const limit = field === "top_challenges" ? 5 : field === "support_needed_next" || field === "goals_next_12_months_array" ? 3 : undefined;

      if (limit && currentArray.length >= limit) return prev;

      if (currentArray.includes(item)) {
        return { ...prev, [field]: currentArray.filter((i) => i !== item) };
      }

      return { ...prev, [field]: [...currentArray, item] };
    });
  };

  const renderSection = (section, index) => {
    const isExpanded = expandedSections.has(section.key);

    return (
      <SectionShell
        key={section.key}
        section={section}
        expanded={isExpanded}
        onToggle={() => toggleSection(section.key)}
      >
        {section.key === "business" && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className={labelCls}>Business Stage</label>
                <select
                  value={form.business_stage || ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, business_stage: e.target.value }))}
                  className={selectCls}
                >
                  <option value="">Select stage</option>
                  {BUSINESS_STAGE.map((stage) => (
                    <option key={stage.value} value={stage.value}>
                      {stage.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelCls}>Team Size</label>
                <select
                  value={form.team_size_band || ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, team_size_band: e.target.value }))}
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
                <label className={labelCls}>Annual Revenue</label>
                <select
                  value={form.revenue_band || ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, revenue_band: e.target.value }))}
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
                <label className={labelCls}>Operating Status</label>
                <select
                  value={form.business_operating_status || ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, business_operating_status: e.target.value }))}
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

            <div>
              <label className={labelCls}>Business Description</label>
              <textarea
                value={form.business_description || ""}
                onChange={(e) => setForm((prev) => ({ ...prev, business_description: e.target.value }))}
                placeholder="Describe your business, what you do, and who you serve..."
                rows={4}
                className={textareaCls}
              />
            </div>
          </div>
        )}

        {section.key === "financial" && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className={labelCls}>Current Funding Source</label>
                <select
                  value={form.current_funding_source || ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, current_funding_source: e.target.value }))}
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
                <label className={labelCls}>Funding Amount Needed</label>
                <select
                  value={form.funding_amount_needed || ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, funding_amount_needed: e.target.value }))}
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

            <div>
              <label className={labelCls}>Investment Stage</label>
              <select
                value={form.investment_stage || ""}
                onChange={(e) => setForm((prev) => ({ ...prev, investment_stage: e.target.value }))}
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

            <div>
              <label className={labelCls}>Financial Challenges</label>
              <textarea
                value={form.financial_challenges || ""}
                onChange={(e) => setForm((prev) => ({ ...prev, financial_challenges: e.target.value }))}
                placeholder="Describe any financial challenges or constraints you're facing..."
                rows={4}
                className={textareaCls}
              />
            </div>
          </div>
        )}

        {section.key === "challenges" && (
          <div className="space-y-5">
            <div>
              <div className="flex items-end justify-between gap-3">
                <div>
                  <label className={labelCls}>Top Challenges</label>
                  <p className={helperCls}>Choose up to 5.</p>
                </div>
                <span className="text-xs font-medium text-slate-500">
                  {form.top_challenges?.length || 0}/5 selected
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
                  <label className={labelCls}>Support Needed</label>
                  <p className={helperCls}>Choose up to 3.</p>
                </div>
                <span className="text-xs font-medium text-slate-500">
                  {form.support_needed_next?.length || 0}/3 selected
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
              <label className={labelCls}>Current Business Stage</label>
              <select
                value={form.growth_stage || ""}
                onChange={(e) => setForm((prev) => ({ ...prev, growth_stage: e.target.value }))}
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
                  <label className={labelCls}>Growth Priorities</label>
                  <p className={helperCls}>Choose up to 3.</p>
                </div>
                <span className="text-xs font-medium text-slate-500">
                  {form.goals_next_12_months_array?.length || 0}/3 selected
                </span>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {GOALS_NEXT_12_MONTHS.map((goal) => (
                  <OptionCard
                    key={goal.value}
                    checked={form.goals_next_12_months_array?.includes(goal.value) || false}
                    onChange={() => toggleArrayItem("goals_next_12_months_array", goal.value)}
                    label={goal.label}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className={labelCls}>Additional Growth Goals</label>
              <textarea
                value={form.goals_details || ""}
                onChange={(e) => setForm((prev) => ({ ...prev, goals_details: e.target.value }))}
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
              <label className={labelCls}>Community Impact Areas</label>
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
              <label className={labelCls}>Collaboration Interest</label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <OptionCard
                  type="radio"
                  checked={form.collaboration_interest === true}
                  onChange={() => setForm((prev) => ({ ...prev, collaboration_interest: true }))}
                  label="Yes, I am open to collaboration opportunities"
                />
                <OptionCard
                  type="radio"
                  checked={form.collaboration_interest === false}
                  onChange={() => setForm((prev) => ({ ...prev, collaboration_interest: false }))}
                  label="No, not at the moment"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <OptionCard
                checked={form.mentorship_offering || false}
                onChange={(e) => setForm((prev) => ({ ...prev, mentorship_offering: !prev.mentorship_offering }))}
                label="I would be open to mentoring other founders"
              />
              <OptionCard
                checked={form.open_to_future_contact || false}
                onChange={(e) => setForm((prev) => ({ ...prev, open_to_future_contact: !prev.open_to_future_contact }))}
                label="I am open to future contact from Pacific Market"
              />
            </div>
          </div>
        )}
      </SectionShell>
    );
  };

  const content = (
    <>
      {!embedded && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[#0a1628]">
            Business Insights
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Complete one section at a time. You can save progress as you go.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {SECTIONS.map((section, index) => renderSection(section, index))}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row sm:justify-end">
        <button
          onClick={handleSubmitAll}
          disabled={submitting || isLoading}
          className="inline-flex min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#0d4f4f] px-6 py-3 text-sm font-bold text-white hover:bg-[#1a6b6b] transition shadow-[0_12px_30px_rgba(13,79,79,0.35)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting || isLoading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Submitting...
            </>
          ) : (
            <>
              Submit Business Insights
              <ChevronRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </>
  );

  if (embedded) {
    return <div className="space-y-4">{content}</div>;
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      {content}
    </div>
  );
}
