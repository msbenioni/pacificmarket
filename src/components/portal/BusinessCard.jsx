"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Building2,
  Eye,
  ImagePlus,
  Upload,
  Users,
  Trash2,
  FileText,
  LayoutPanelTop,
  AlertTriangle,
  BarChart3,
} from "lucide-react";
import { createPageUrl } from "@/utils";
import { getBusinessOwnerName } from "@/utils/businessHelpers";
import InlineBusinessForm from "../forms/InlineBusinessForm";
import BusinessInsightsAccordion from "../forms/BusinessInsightsAccordion";

function InnerAccordionSection({
  title,
  subtitle,
  icon: Icon,
  value,
  isOpen,
  onToggle,
  children,
  danger = false,
}) {
  return (
    <div className="border-b border-slate-100 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-4 px-4 py-4 text-left transition hover:bg-slate-50 sm:px-5"
      >
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
              danger ? "bg-red-50 text-red-600" : "bg-[#0d4f4f]/10 text-[#0d4f4f]"
            }`}
          >
            <Icon className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <div className={`text-sm font-semibold ${danger ? "text-red-700" : "text-[#0a1628]"}`}>
              {title}
            </div>
            {subtitle && <div className="mt-0.5 text-sm text-slate-500">{subtitle}</div>}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {value && <div className="hidden text-xs text-slate-500 md:block">{value}</div>}
          <ChevronDown
            className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {isOpen && <div className="border-t border-slate-100 bg-white px-4 py-5 sm:px-5">{children}</div>}
    </div>
  );
}

export default function BusinessCard({
  business,
  user,
  profiles,
  isEditing = false,
  draftBusiness,
  savingEdit,
  insightsSubmitting,
  insightsStarted,
  tierInfo,
  onEdit,
  onCancel,
  onDraftChange,
  onSave,
  onDelete,
  onAddOwner,
  onLogoUpload,
  onBannerUpload,
  onInsightsSubmit,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [openSection, setOpenSection] = useState(null);

  const viewListingHref =
    createPageUrl("BusinessProfile") + `?handle=${business.business_handle || business.id}`;

  const bannerUrl = business.banner_url || business.cover_image_url || null;
  const ownerName = business.owner_user_id
    ? getBusinessOwnerName(business.owner_user_id, profiles)
    : null;

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
    ? "bg-emerald-500/20 text-emerald-200 border border-emerald-400/30"
    : "bg-white/20 text-white border border-white/30";

  const statusStyles =
    business.status === "active"
      ? "bg-white/20 text-white border border-white/30"
      : "bg-white/15 text-slate-200 border border-white/25";

  const toggleInnerSection = (key) => {
    setOpenSection((prev) => (prev === key ? null : key));
  };

  const handleOpenDetails = () => {
    toggleInnerSection("details");
    if (!isEditing) onEdit();
  };

  return (
    <div className="bg-white">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full bg-gradient-to-r from-[#0a1628] to-[#0d4f4f] px-4 py-4 text-left text-white transition hover:opacity-95 sm:px-5"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-white/10">
              {business.logo_url ? (
                <img
                  src={business.logo_url}
                  alt={`${business.name} logo`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full w-full place-items-center">
                  <Building2 className="h-5 w-5 text-white/80" />
                </div>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate text-base font-semibold sm:text-lg">{business.name}</h3>

                {business.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-white">
                    <CheckCircle className="h-3.5 w-3.5" />
                    Verified
                  </span>
                )}
              </div>

              <p className="mt-1 line-clamp-2 text-sm text-slate-200">{summaryText}</p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <div className="hidden lg:flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${tierStyles}`}>
                {tierLabel}
              </span>
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusStyles}`}>
                {business.status || "draft"}
              </span>
            </div>

            <div className="hidden text-right md:block">
              <div className="text-xs text-slate-300">Open to manage</div>
              <div className="text-xs font-medium text-white/90">One section at a time</div>
            </div>

            <div className="rounded-xl bg-white/10 p-2">
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </div>
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="bg-white">
          <InnerAccordionSection
            title="Overview"
            subtitle="Quick summary and public listing preview"
            icon={LayoutPanelTop}
            value={business.industry || ""}
            isOpen={openSection === "overview"}
            onToggle={() => toggleInnerSection("overview")}
          >
            <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="relative h-40 bg-gradient-to-br from-slate-100 via-slate-50 to-[#eef6f6]">
                  {bannerUrl ? (
                    <img
                      src={bannerUrl}
                      alt={`${business.name} banner`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm font-medium text-slate-400">
                      No banner image yet
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Listing Preview
                  </p>
                  <h4 className="mt-1 text-base font-semibold text-[#0a1628]">{business.name}</h4>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{summaryText}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      href={viewListingHref}
                      className="inline-flex items-center gap-2 rounded-xl border border-[#0d4f4f]/15 bg-[#f8fbfb] px-4 py-2.5 text-sm font-semibold text-[#0d4f4f] transition hover:border-[#0d4f4f]/30"
                    >
                      <Eye className="h-4 w-4" />
                      View Listing
                    </Link>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Primary Owner
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[#0a1628]">
                    {ownerName || "No owner assigned"}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Status
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[#0a1628]">
                    {business.status || "draft"}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Tier
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[#0a1628]">{tierLabel}</p>
                </div>
              </div>
            </div>
          </InnerAccordionSection>

          <InnerAccordionSection
            title="Listing details"
            subtitle="Edit business information, contact details, location, and descriptions"
            icon={FileText}
            value="Editable"
            isOpen={openSection === "details"}
            onToggle={handleOpenDetails}
          >
            {isEditing && draftBusiness ? (
              <InlineBusinessForm
                title={`Edit ${business.name}`}
                formData={draftBusiness}
                setFormData={onDraftChange}
                onSave={() => onSave(draftBusiness)}
                onCancel={onCancel}
                saving={savingEdit}
                mode="edit"
              />
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-600">
                  Open this section to edit your business details.
                </p>
              </div>
            )}
          </InnerAccordionSection>

          <InnerAccordionSection
            title="Owners"
            subtitle="Manage ownership and access"
            icon={Users}
            value={ownerName || "No owner assigned"}
            isOpen={openSection === "owners"}
            onToggle={() => toggleInnerSection("owners")}
          >
            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-[#0a1628]">
                  {ownerName || "No owner assigned"}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Add another owner or update who manages this listing.
                </p>
              </div>

              <button
                type="button"
                onClick={onAddOwner}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-[#0a1628] transition hover:border-[#0d4f4f]/20 hover:bg-slate-50"
              >
                <Users className="h-4 w-4 text-[#0d4f4f]" />
                Add Owner
              </button>
            </div>
          </InnerAccordionSection>

          <InnerAccordionSection
            title="Business insights"
            subtitle="Funding, barriers, growth plans, and impact"
            icon={BarChart3}
            value="Structured form"
            isOpen={openSection === "insights"}
            onToggle={() => toggleInnerSection("insights")}
          >
            <BusinessInsightsAccordion
              businessId={business.id}
              onSubmit={onInsightsSubmit}
              isLoading={insightsSubmitting}
              initialData={null}
              onStart={() => {}}
              embedded
            />
          </InnerAccordionSection>

          <InnerAccordionSection
            title="Danger zone"
            subtitle="Delete this business listing"
            icon={AlertTriangle}
            value=""
            danger
            isOpen={openSection === "danger"}
            onToggle={() => toggleInnerSection("danger")}
          >
            <div className="flex flex-col gap-4 rounded-2xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-red-700">Delete business</p>
                <p className="mt-1 text-sm text-red-600">
                  This action may remove the listing and related management access.
                </p>
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
          </InnerAccordionSection>
        </div>
      )}
    </div>
  );
}
