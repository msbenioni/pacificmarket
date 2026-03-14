"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Edit3,
  Trash2,
  Users,
  Upload,
  ImagePlus,
  Building2,
  Sparkles,
  Eye,
} from "lucide-react";
import { createPageUrl } from "@/utils";
import { getBannerUrl } from '@/utils/bannerUtils';

export default function PortalBusinessCard({
  business,
  tierLabel,
  tierStyles = "bg-slate-100 text-slate-700",
  statusStyles = "bg-slate-100 text-slate-700",
  metaLine,
  ownerName,
  ownerEmail,
  onEdit,
  onDelete,
  onAddOwner,
  onLogoUpload,
  onBannerUpload,
  showUpgradePrompt,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const logoInputId = `logo-upload-${business.id}`;
  const bannerInputId = `banner-upload-${business.id}`;

  const viewListingHref =
    createPageUrl("BusinessProfile") + `?handle=${business.business_handle || business.id}`;

  const bannerUrl = getBannerUrl(business);

  const summaryText = useMemo(() => {
    if (metaLine) return metaLine;
    return business.tagline || "Business record available to manage";
  }, [metaLine, business.tagline]);

  return (
    <div className="bg-white">
      {/* Accordion Header */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full bg-gradient-to-r from-[#0a1628] to-[#0d4f4f] px-4 py-4 text-left text-white transition hover:bg-white/10 sm:px-5"
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
                <h3 className="truncate text-base font-semibold sm:text-lg">
                  {business.name}
                </h3>

                {business.is_verified && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-white">
                    <CheckCircle className="h-3.5 w-3.5" />
                    Verified
                  </span>
                )}
              </div>

              <p className="mt-1 line-clamp-2 text-sm text-slate-200">{summaryText}</p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {tierLabel && (
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${tierStyles}`}
                  >
                    {tierLabel}
                  </span>
                )}

                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusStyles}`}
                >
                  {business.status}
                </span>

                {business.industry && (
                  <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-slate-100">
                    {business.industry}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <div className="hidden text-right md:block">
              <div className="text-xs text-slate-300">Open to manage</div>
              <div className="text-xs font-medium text-white/90">
                Edit details, media, owners
              </div>
            </div>

            <div className="rounded-xl bg-white/10 p-2">
              <ChevronDown
                className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </div>
          </div>
        </div>
      </button>

      {/* Accordion Body */}
      {isOpen && (
        <div className="space-y-5 bg-white px-4 py-5 sm:px-5 sm:py-6">
          {/* Top quick overview */}
          <div className="grid gap-4 lg:grid-cols-[1.3fr_0.9fr]">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
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
                <h4 className="mt-1 text-base font-semibold text-[#0a1628]">
                  {business.name}
                </h4>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {summaryText}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href={viewListingHref}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#0d4f4f]/15 bg-[#f8fbfb] px-4 py-2.5 text-sm font-semibold text-[#0d4f4f] transition hover:border-[#0d4f4f]/30"
                  >
                    <Eye className="h-4 w-4" />
                    View Listing
                  </Link>

                  <button
                    type="button"
                    onClick={onEdit}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#0a1628] transition hover:border-[#0d4f4f]/20 hover:bg-slate-50"
                  >
                    <Edit3 className="h-4 w-4 text-[#0d4f4f]" />
                    Edit Listing
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Primary Owner
                </p>
                <p className="mt-2 text-sm font-semibold text-[#0a1628]">
                  {ownerName || "No owner assigned"}
                </p>
                {ownerEmail && (
                  <p className="mt-1 text-sm text-slate-600">{ownerEmail}</p>
                )}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Management
                </p>

                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={onAddOwner}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-[#0a1628] transition hover:border-[#0d4f4f]/20 hover:bg-slate-50"
                  >
                    <Users className="h-4 w-4 text-[#0d4f4f]" />
                    Add Owner
                  </button>

                  <button
                    type="button"
                    onClick={onDelete}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:border-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Media management */}
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-4 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Media
                </p>
                <h4 className="mt-1 text-base font-semibold text-[#0a1628]">
                  Keep your visual presence up to date
                </h4>
                <p className="mt-1 text-sm text-slate-600">
                  Update your logo and banner so your listing looks complete and more
                  premium across the platform.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-[#0d4f4f]/10 bg-white px-3 py-1 text-xs font-medium text-[#0d4f4f]">
                <Sparkles className="h-3.5 w-3.5" />
                Better presentation
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label
                htmlFor={logoInputId}
                className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 transition hover:border-[#0d4f4f]/20"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-[#0d4f4f]/10 p-2">
                    <Upload className="h-4 w-4 text-[#0d4f4f]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0a1628]">Update logo</p>
                    <p className="text-xs text-slate-500">
                      Square image recommended
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </label>

              <label
                htmlFor={bannerInputId}
                className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 transition hover:border-[#0d4f4f]/20"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-[#0d4f4f]/10 p-2">
                    <ImagePlus className="h-4 w-4 text-[#0d4f4f]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0a1628]">Update banner</p>
                    <p className="text-xs text-slate-500">
                      Wide image recommended
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </label>

              <input
                id={logoInputId}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => onLogoUpload?.(e, business.id)}
              />

              <input
                id={bannerInputId}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => onBannerUpload?.(e, business.id)}
              />
            </div>
          </div>

          {/* Upgrade */}
          {showUpgradePrompt && (
            <div className="flex flex-col gap-4 rounded-2xl border border-[#c9a84c]/20 bg-[#fffaf0] p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-[#0a1628]">
                  Upgrade this listing for richer tools
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Unlock stronger presentation, more premium visual presence, and additional
                  business tools.
                </p>
              </div>

              <Link
                href={createPageUrl("Pricing")}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#b58a1f] transition hover:text-[#8f6b11]"
              >
                View upgrade options
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
