import Link from "next/link";
import {
  CheckCircle,
  Edit,
  Trash2,
  Users,
  Upload,
  ChevronRight,
  MoreHorizontal,
  ChevronDown,
} from "lucide-react";
import { createPageUrl } from "@/utils";
import { Sheet, SheetTrigger, SheetContent, SheetClose } from "@/components/ui/sheet";

export default function PortalBusinessCard({
  business,
  tierLabel,
  tierStyles,
  statusStyles,
  metaLine,
  ownerName,
  ownerEmail,
  onEdit,
  onDelete,
  onAddOwner,
  onLogoUpload,
  primaryActionCls,
  showUpgradePrompt,
}) {
  const logoInputId = `logo-upload-${business.id}`;
  const viewListingHref =
    createPageUrl("BusinessProfile") + `?handle=${business.business_handle || business.id}`;

  return (
    <div className="relative bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 sm:pr-20 shadow-[0_12px_40px_rgba(10,22,40,0.06)] transition hover:border-[#00c4cc]/20 hover:shadow-[0_18px_45px_rgba(0,0,0,0.1)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative group h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0 overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-[#0a1628] to-[#0d4f4f]">
            {business.logo_url ? (
              <img src={business.logo_url} alt="" className="h-full w-full object-cover" />
            ) : (
              <img src="/pm_logo.png" alt="Pacific Market" className="h-full w-full object-cover" />
            )}
            <label
              htmlFor={logoInputId}
              className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-2xl bg-black/45 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
            >
              <Upload className="w-4 h-4 text-white" />
              <span className="sr-only">Update logo</span>
            </label>
            <input
              id={logoInputId}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={onLogoUpload}
            />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-base sm:text-lg font-bold text-[#0a1628]">
                {business.name}
              </h3>
              {business.verified && (
                <CheckCircle className="w-4 h-4 text-[#00c4cc] flex-shrink-0" />
              )}
            </div>
          </div>
        </div>

        <div className="sm:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                className="h-10 w-10 rounded-xl border border-gray-200 bg-white text-slate-500 hover:text-[#0d4f4f] hover:border-[#0d4f4f] transition grid place-items-center"
                aria-label="Business actions"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className="rounded-t-3xl border-t border-gray-100 bg-white px-5 pb-6 pt-4 [&>button]:hidden"
            >
              <div className="mx-auto h-1.5 w-10 rounded-full bg-slate-200" />
              <div className="mt-4">
                <p className="text-sm font-semibold text-[#0a1628]">{business.name}</p>
                <p className="text-xs text-slate-500">Manage this listing</p>
              </div>
              <div className="mt-4 space-y-2">
                <SheetClose asChild>
                  <button
                    type="button"
                    onClick={onEdit}
                    className="w-full flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-[#0a1628] hover:border-[#0d4f4f] transition"
                  >
                    <Edit className="w-4 h-4 text-[#0d4f4f]" />
                    Edit listing
                  </button>
                </SheetClose>
                <SheetClose asChild>
                  <button
                    type="button"
                    onClick={onAddOwner}
                    className="w-full flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-[#0a1628] hover:border-[#0d4f4f] transition"
                  >
                    <Users className="w-4 h-4 text-[#0d4f4f]" />
                    Add owner
                  </button>
                </SheetClose>
                <SheetClose asChild>
                  <label
                    htmlFor={logoInputId}
                    className="w-full flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-[#0a1628] hover:border-[#0d4f4f] transition cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-[#0d4f4f]" />
                    Update logo
                  </label>
                </SheetClose>
                <SheetClose asChild>
                  <button
                    type="button"
                    onClick={onDelete}
                    className="w-full flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 hover:border-red-300 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete business
                  </button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {tierLabel && (
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${tierStyles}`}>
            {tierLabel}
          </span>
        )}
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusStyles}`}>
          {business.status}
        </span>
      </div>

      {metaLine && (
        <p className="mt-2 text-sm text-slate-600">
          {metaLine}
        </p>
      )}

      <div className="mt-4 hidden sm:block">
        <Link
          href={viewListingHref}
          className="inline-flex items-center gap-1 text-sm font-semibold text-[#0d4f4f] hover:text-[#1a6b6b] transition"
        >
          View Listing <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:hidden">
        <Link href={viewListingHref} className={primaryActionCls}>
          View Listing
        </Link>
        {showUpgradePrompt && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-[#c9a84c]/20 bg-[#c9a84c]/10 px-3 py-2">
            <p className="text-xs font-semibold text-[#0a1628]">Upgrade for richer tools.</p>
            <Link
              href={createPageUrl("Pricing")}
              className="text-xs font-semibold text-[#c9a84c] hover:text-[#b8973b] transition"
            >
              Upgrade
            </Link>
          </div>
        )}
      </div>

      {ownerName && (
        <>
          <details className="mt-4 rounded-xl border border-gray-200 bg-slate-50/70 p-3 sm:hidden">
            <summary className="flex items-center justify-between gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 cursor-pointer [&::-webkit-details-marker]:hidden">
              Owner details
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </summary>
            <div className="mt-3">
              <p className="text-sm font-semibold text-[#0a1628]">{ownerName}</p>
              {ownerEmail && <p className="text-sm text-slate-600">{ownerEmail}</p>}
            </div>
          </details>
          <div className="mt-4 hidden sm:block rounded-2xl border border-gray-200 bg-white/90 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Primary Owner
            </p>
            <p className="truncate text-sm font-semibold text-[#0a1628]">{ownerName}</p>
            {ownerEmail && <p className="truncate text-sm text-slate-600">{ownerEmail}</p>}
          </div>
        </>
      )}

      {showUpgradePrompt && (
        <div className="mt-5 hidden sm:flex border-t border-gray-200 pt-4 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#0a1628]">
              Ready to upgrade this listing?
            </p>
            <p className="text-sm text-slate-600">
              Unlock logo, richer presentation, verification, and premium tools.
            </p>
          </div>
          <Link
            href={createPageUrl("Pricing")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#c9a84c] hover:text-[#f0d27b] transition"
          >
            View upgrade options
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      <div className="hidden sm:flex absolute top-5 right-5 items-center gap-2">
        <button
          onClick={onEdit}
          className="p-2 rounded-lg text-gray-400 hover:text-[#0d4f4f] hover:bg-gray-50 transition"
          title="Edit business"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={onDelete}
          className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
          title="Remove business"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        <button
          onClick={onAddOwner}
          className="p-2 rounded-lg text-gray-400 hover:text-[#0d4f4f] hover:bg-gray-50 transition"
          title="Add owner"
        >
          <Users className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
