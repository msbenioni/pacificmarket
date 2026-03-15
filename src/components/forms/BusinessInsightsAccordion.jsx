"use client";

import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Building2,
  AlertCircle,
  Rocket,
  Lightbulb,
} from "lucide-react";
import {
  BUSINESS_STAGE,
  BUSINESS_CHALLENGES,
  GOALS_NEXT_12_MONTHS,
} from "@/constants/unifiedConstants";

const inputCls =
  "w-full min-h-[44px] border border-slate-300 rounded-xl px-4 py-3 text-sm text-[#0a1628] placeholder:text-slate-400 focus:outline-none focus:border-[#0d4f4f] focus:ring-2 focus:ring-[#0d4f4f]/10 bg-white shadow-sm";

const textareaCls =
  "w-full border border-slate-300 rounded-xl px-4 py-3 text-sm text-[#0a1628] placeholder:text-slate-400 focus:outline-none focus:border-[#0d4f4f] focus:ring-2 focus:ring-[#0d4f4f]/10 bg-white resize-none shadow-sm";

const selectCls =
  "w-full min-h-[44px] border border-slate-300 rounded-xl px-4 py-3 pr-10 text-sm text-[#0a1628] focus:outline-none focus:border-[#0d4f4f] focus:ring-2 focus:ring-[#0d4f4f]/10 bg-white appearance-none shadow-sm";

const labelCls =
  "block text-xs font-semibold uppercase tracking-wider text-slate-700";

const helperCls = "mt-1 text-xs text-slate-500";

const SECTIONS = [
  {
    key: "overview",
    label: "Business Overview",
    icon: Building2,
    description: "Basic information about your business operations and scale",
  },
  {
    key: "challenges",
    label: "Challenges & Support",
    icon: AlertCircle,
    description: "Help us identify real barriers and support gaps",
  },
  {
    key: "community",
    label: "Community & Impact",
    icon: Lightbulb,
    description: "How your business contributes to the wider community",
  },
];

const SECTION_FIELDS = {
  overview: [
    "business_stage",
    "team_size_band",
    "revenue_band",
    "business_operating_status",
  ],
  challenges: ["top_challenges_array"],
  community: [
    "collaboration_interest",
    "mentorship_offering",
    "open_to_future_contact",
  ],
};

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
    revenue_band: "",
    business_operating_status: "",
    business_age: "",
    is_business_registered: false,
    employs_anyone: false,
    employs_family_community: false,
    top_challenges_array: "",
    collaboration_interest: false,
    mentorship_offering: false,
    open_to_future_contact: false,
    // Fields moved from InlineBusinessForm
    year_started: null,
    business_structure: "",
  });

  const [expandedSections, setExpandedSections] = useState(new Set(["overview"]));
  const [submitting, setSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errors, setErrors] = useState({ submit: undefined });
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const triggerStart = () => {
    if (!hasStarted && onStart && !initialData) {
      setHasStarted(true);
      onStart();
    }
  };

  const toggleSection = (sectionKey) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionKey)) next.delete(sectionKey);
      else next.add(sectionKey);
      return next;
    });
  };

  const handleInputChange = (field, value) => {
    triggerStart();
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field, item) => {
    triggerStart();

    setForm((prev) => {
      const currentArray = prev[field] || [];
      const limit =
        field === "top_challenges_array"
          ? 5
          : undefined;

      if (currentArray.includes(item)) {
        return { ...prev, [field]: currentArray.filter((i) => i !== item) };
      }

      if (limit && currentArray.length >= limit) {
        return prev;
      }

      return { ...prev, [field]: [...currentArray, item] };
    });
  };

  const buildSectionPayload = (sectionKey) => {
    const fields = SECTION_FIELDS[sectionKey] || [];
    const payload = {
      business_id: businessId,
    };

    fields.forEach((field) => {
      payload[field] = form[field];
    });

    return payload;
  };

  const handleSaveSection = async (sectionKey) => {
    setSubmitting(true);
    setErrors({ submit: undefined });

    try {
      await onSubmit(buildSectionPayload(sectionKey));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (error) {
      console.error(`Failed to save ${sectionKey}:`, error);
      setErrors((prev) => ({
        ...prev,
        submit: "Failed to save section. Please try again.",
      }));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveAll = async () => {
    setSubmitting(true);
    setErrors({ submit: undefined });

    try {
      await onSubmit({
        business_id: businessId,
        ...form,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (error) {
      console.error("Failed to save business insights:", error);
      setErrors((prev) => ({
        ...prev,
        submit: "Failed to save business insights. Please try again.",
      }));
    } finally {
      setSubmitting(false);
    }
  };

  const renderSectionContent = (sectionKey) => {
    if (sectionKey === "overview") {
      return (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className={labelCls}>Business Stage</label>
                <select
                  value={form.business_stage || ""}
                  onChange={(e) => handleInputChange("business_stage", e.target.value)}
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
                <label className={labelCls}>Year Started</label>
                <input
                  type="number"
                  value={form.year_started ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    handleInputChange("year_started", value === "" ? null : Number(value));
                  }}
                  className={inputCls}
                  min="1900"
                  max={new Date().getFullYear()}
                  placeholder="2020"
                />
              </div>

              <div>
                <label className={labelCls}>Business Structure</label>
                <select
                  value={form.business_structure || ""}
                  onChange={(e) => handleInputChange("business_structure", e.target.value)}
                  className={selectCls}
                >
                  <option value="">Select Structure</option>
                  <option value="sole-proprietorship">Sole Proprietorship</option>
                  <option value="partnership">Partnership</option>
                  <option value="llc">LLC</option>
                  <option value="corporation">Corporation</option>
                  <option value="non-profit">Non-Profit</option>
                  <option value="cooperative">Cooperative</option>
                </select>
              </div>

              <div>
                <label className={labelCls}>Team Size</label>
                <select
                  value={form.team_size_band || ""}
                  onChange={(e) => handleInputChange("team_size_band", e.target.value)}
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
                  onChange={(e) => handleInputChange("revenue_band", e.target.value)}
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
            </div>
          </div>
        </div>
      );
    }

    if (sectionKey === "challenges") {
      return (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-end justify-between gap-3">
              <div>
                <label className={labelCls}>Top Challenges</label>
                <p className={helperCls}>Choose up to 5.</p>
              </div>
              <span className="text-xs font-medium text-slate-500">
                {form.top_challenges_array?.length || 0}/5 selected
              </span>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {BUSINESS_CHALLENGES.map((challenge) => (
                <OptionCard
                  key={challenge.value}
                  checked={form.top_challenges_array?.includes(challenge.value) || false}
                  onChange={() => toggleArrayItem("top_challenges_array", challenge.value)}
                  label={challenge.label}
                />
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (sectionKey === "community") {
      return (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <label className={labelCls}>Collaboration Interest</label>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <OptionCard
                type="radio"
                checked={form.collaboration_interest === true}
                onChange={() =>
                  handleInputChange("collaboration_interest", true)
                }
                label="Yes, I am open to collaboration opportunities"
              />
              <OptionCard
                type="radio"
                checked={form.collaboration_interest === false}
                onChange={() =>
                  handleInputChange("collaboration_interest", false)
                }
                label="No, not at the moment"
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <OptionCard
                checked={form.mentorship_offering || false}
                onChange={() =>
                  handleInputChange(
                    "mentorship_offering",
                    !form.mentorship_offering
                  )
                }
                label="I would be open to mentoring other founders"
              />
              <OptionCard
                checked={form.open_to_future_contact || false}
                onChange={() =>
                  handleInputChange(
                    "open_to_future_contact",
                    !form.open_to_future_contact
                  )
                }
                label="I am open to future contact from Pacific Market"
              />
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderSection = (section) => {
    const isExpanded = expandedSections.has(section.key);

    return (
      <div
        key={section.key}
        className="rounded-xl border border-slate-300 bg-white shadow-sm transition-all hover:shadow-md"
      >
        <div className="w-full px-4 py-4 sm:px-6">
          <button
            type="button"
            onClick={() => toggleSection(section.key)}
            className="flex w-full items-start justify-between gap-3 text-left transition-colors"
          >
            <div className="flex items-start gap-3">
              <section.icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#0d4f4f]" />
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
              {isExpanded ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </div>
          </button>
        </div>

        {isExpanded && (
          <>
            <div className="border-t border-slate-200 bg-slate-50 px-4 py-4 sm:px-6 sm:py-5">
              {renderSectionContent(section.key)}
            </div>

            <div className="flex justify-end border-t border-gray-200 bg-gray-50 px-4 py-4 sm:px-6">
              <button
                type="button"
                onClick={() => handleSaveSection(section.key)}
                disabled={submitting || isLoading}
                className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting || isLoading ? "Saving..." : "Save Section"}
              </button>
            </div>
          </>
        )}
      </div>
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
            Complete each section to provide comprehensive business information.
          </p>
        </div>
      )}

      {saveSuccess && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="text-sm text-green-800">
            Business insights saved successfully.
          </p>
        </div>
      )}

      {errors.submit && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">{errors.submit}</p>
        </div>
      )}

      <div className="space-y-4">{SECTIONS.map(renderSection)}</div>

      <div className="mt-6 flex justify-end border-t border-gray-200 px-0 pt-5">
        <button
          type="button"
          onClick={handleSaveAll}
          disabled={submitting || isLoading}
          className="rounded-xl bg-[#0d4f4f] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0a3d3d] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting || isLoading ? "Saving..." : "Save All Changes"}
        </button>
      </div>
    </>
  );

  if (embedded) {
    return <div className="rounded-2xl bg-white">{content}</div>;
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      {content}
    </div>
  );
}