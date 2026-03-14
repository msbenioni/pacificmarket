"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CheckCircle,
  ChevronDown,
  Building2,
  Eye,
  Trash2,
  AlertTriangle,
  BarChart3,
  Settings2,
} from "lucide-react";
import { createPageUrl } from "@/utils";
import InlineBusinessForm from "../forms/InlineBusinessForm";
import BusinessInsightsAccordion from "../forms/BusinessInsightsAccordion";

function MainStepSection({
  title,
  step,
  summary,
  icon: Icon,
  isOpen,
  onToggle,
  children,
  isFirst = false,
}) {
  return (
    <div className={`${!isFirst ? "border-t border-slate-100" : ""}`}>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 bg-gradient-to-r from-[#0a1628] to-[#0d4f4f] px-4 py-4 text-left text-white transition hover:opacity-95 sm:px-5"
      >
        <div className="flex min-w-0 items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10">
            <Icon className="h-4 w-4 text-white" />
          </div>

          <div className="min-w-0">
            <div className="text-sm font-semibold text-white">{title}</div>
            <div className="mt-0.5 text-xs text-slate-300">{step}</div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <div className="hidden text-xs text-slate-300 md:block">{summary}</div>
          <ChevronDown
            className={`h-4 w-4 text-slate-300 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {isOpen && <div className="bg-white px-4 py-5 sm:px-5">{children}</div>}
    </div>
  );
}

function DangerSection({ onDelete }) {
  return (
    <div className="border-t border-slate-100 bg-white px-4 py-5 sm:px-5">
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-white p-2 text-red-600">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-red-700">Danger zone</p>
              <p className="mt-1 text-sm text-red-600">
                Delete this business listing and remove related management access.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onDelete}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete Business
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BusinessCard({
  business,
  draftBusiness,
  savingEdit,
  insightsSubmitting,
  tierInfo,
  onCancel,
  onDraftChange,
  onSave,
  onDelete,
  onInsightsSubmit,
}) {
  const [isBusinessOpen, setIsBusinessOpen] = useState(false);
  const [openMainStep, setOpenMainStep] = useState(null);

  const viewListingHref =
    createPageUrl("BusinessProfile") + `?handle=${business.business_handle || business.id}`;

  const summaryText = useMemo(() => {
    return (
      business.short_description ||
      business.tagline ||
      `${business.city || ""}${business.city && business.country ? ", " : ""}${business.country || ""}${business.industry ? ` · ${business.industry}` : ""}` ||
      "Business record available to manage"
    );
  }, [business]);

  const tierLabel =
    tierInfo?.[business.subscription_tier]?.label || business.subscription_tier || "Standard";

  const tierStyles = business.verified
    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
    : "bg-slate-100 text-slate-700 border border-slate-200";

  const statusStyles =
    business.status === "active"
      ? "bg-[#0d4f4f]/8 text-[#0d4f4f] border border-[#0d4f4f]/15"
      : "bg-slate-100 text-slate-600 border border-slate-200";

  const toggleMainStep = (key) => {
    setOpenMainStep((prev) => (prev === key ? null : key));
  };

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.08)]">
      <div className="h-1.5 bg-gradient-to-r from-[#0a1628] via-[#0d4f4f] to-[#00c4cc]/70" />

      <button
        type="button"
        onClick={() => setIsBusinessOpen((prev) => !prev)}
        className="relative w-full overflow-hidden text-left transition hover:bg-slate-50"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(13,79,79,0.06),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(201,168,76,0.08),transparent_24%)]" />
        <div className="relative bg-gradient-to-br from-white via-[#f8fbfb] to-[#f3f8f8] px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {business.logo_url ? (
                  <img
                    src={business.logo_url}
                    alt={`${business.name} logo`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-slate-50">
                    <Building2 className="h-5 w-5 text-slate-400" />
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate text-xl font-semibold text-[#0a1628]">
                    {business.name}
                  </h3>

                  {business.verified && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                      <CheckCircle className="h-3.5 w-3.5" />
                      Verified
                    </span>
                  )}
                </div>

                <p className="mt-2 max-w-2xl text-sm text-slate-600">{summaryText}</p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${tierStyles}`}
                  >
                    {tierLabel}
                  </span>

                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusStyles}`}
                  >
                    {business.status || "draft"}
                  </span>

                  {business.industry && (
                    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                      {business.industry}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 xl:justify-end">
              <Link
                href={viewListingHref}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#0a1628] shadow-sm transition hover:bg-slate-50"
              >
                <Eye className="h-4 w-4 text-[#0d4f4f]" />
                View Listing
              </Link>

              <div className="hidden text-right md:block">
                <div className="text-xs text-slate-500">Open to manage</div>
                <div className="text-xs font-medium text-slate-700">Step-based sections</div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 shadow-sm">
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isBusinessOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </button>

      {isBusinessOpen && (
        <div className="border-t border-slate-200 bg-white">
          <MainStepSection
            title="Listing, access & contact"
            step="Step 1"
            summary="Business details, ownership, contact, media"
            icon={Settings2}
            isOpen={openMainStep === "listing"}
            onToggle={() => toggleMainStep("listing")}
            isFirst
          >
            <InlineBusinessForm
              title={`Edit ${business.name}`}
              formData={draftBusiness || business}
              setFormData={onDraftChange}
              onSave={() => onSave(draftBusiness || business)}
              onCancel={onCancel}
              saving={savingEdit}
              mode="edit"
            />
          </MainStepSection>

          <MainStepSection
            title="Business insights"
            step="Step 2"
            summary="Funding, barriers, growth, impact"
            icon={BarChart3}
            isOpen={openMainStep === "insights"}
            onToggle={() => toggleMainStep("insights")}
          >
            <BusinessInsightsAccordion
              businessId={business.id}
              onSubmit={onInsightsSubmit}
              isLoading={insightsSubmitting}
              initialData={null}
              onStart={() => {}}
              embedded
            />
          </MainStepSection>

          <DangerSection onDelete={onDelete} />
        </div>
      )}
    </div>
  );
}