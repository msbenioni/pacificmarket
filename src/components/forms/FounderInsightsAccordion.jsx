import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
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

export default function FounderInsightsAccordion({
  businessId,
  onSubmit,
  isLoading,
  initialData = null,
  onStart,
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
      console.error("Failed to submit founder insights:", error);
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

  return (
    <div className="rounded-2xl bg-white">
      <div className="p-4 sm:p-8">
        <div className="space-y-4">{SECTIONS.map((section, index) => renderSection(section, index))}</div>
      </div>

      <div className="flex justify-end border-t border-gray-200 px-4 py-5 sm:px-8">
        <button
          type="button"
          onClick={handleSubmitAll}
          disabled={submitting || isLoading}
          className="rounded-xl bg-[#0d4f4f] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0a3d3d] focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting || isLoading ? "Saving..." : "Save All Changes"}
        </button>
      </div>
    </div>
  );
}
