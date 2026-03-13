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
  const [form, setForm] = useState({});
  const [expandedSections, setExpandedSections] = useState(new Set());
  const [submitting, setSubmitting] = useState(false);

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

  const renderSection = (section, index) => {
    const isExpanded = expandedSections.has(section.key);

    return (
      <SectionShell
        key={section.key}
        section={section}
        expanded={isExpanded}
        onToggle={() => toggleSection(section.key)}
      >
        <div className="text-sm text-slate-600">
          {section.label} content will be implemented here
        </div>
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
    </>
  );

  if (embedded) {
    return <div className="space-y-4">{content}</div>;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      {content}
    </div>
  );
}
