"use client";

import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Building2,
  AlertCircle,
  Lightbulb,
} from "lucide-react";
import {
  BUSINESS_STAGE,
  BUSINESS_CHALLENGES,
} from "@/constants/unifiedConstants";
import { OptionCard, inputCls, textareaCls, selectCls, labelCls, helperCls } from "./shared/FormComponents";

const SECTIONS = [
  {
    key: "challenges",
    label: "Challenges & Support",
    icon: AlertCircle,
    description: "Help us identify real barriers and support gaps",
  },
];

const SECTION_FIELDS = {
  challenges: [],
};

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
              <div className="text-center text-gray-500 text-sm py-8">
                Challenges section content coming soon...
              </div>
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