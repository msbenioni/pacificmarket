import Link from "next/link";
import { createPageUrl } from "@/utils";
import { CheckCircle, ArrowUpRight, MapPin } from "lucide-react";
import { INDUSTRIES, COUNTRIES } from "@/constants/unifiedConstants";
import { getLogoUrl } from '@/utils/bannerUtils';

function getIndustryLabel(value) {
  const match = INDUSTRIES.find((item) => item.value === value);
  return match?.label || value || "Industry";
}

function getCountryLabel(value) {
  const match = COUNTRIES.find((item) => item.value === value);
  return match?.label || value || "";
}

export default function BusinessCard({ business, view = "grid" }) {
  const href =
    createPageUrl("BusinessProfile") +
    `?handle=${business.business_handle || business.id}`;

  const industryLabel = getIndustryLabel(business.industry);
  const countryLabel = getCountryLabel(business.country);

  const metaLine = [business.city, countryLabel].filter(Boolean).join(", ");

  const description =
    business.tagline ||
    business.description ||
    "";

  if (view === "list") {
    return (
      <Link
        href={href}
        className="group block rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm transition-all hover:border-[#0d4f4f]/25 hover:shadow-[0_14px_36px_rgba(10,22,40,0.08)]"
      >
        <div className="flex items-start gap-3">
          {/* Logo */}
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-[#0a1628] to-[#0d4f4f]">
            <img
              src={getLogoUrl(business)}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <div className="flex items-start gap-2">
              <h3 className="text-sm font-semibold leading-5 text-[#0a1628] transition-colors group-hover:text-[#0d4f4f] break-words">
                {business.name}
              </h3>

              {business.is_verified && (
                <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#00c4cc]" />
              )}
            </div>

            <p className="mt-1 text-sm text-slate-600">{industryLabel}</p>

            {description && (
              <p className="mt-1 text-xs text-gray-500 leading-relaxed line-clamp-2">
                {description}
              </p>
            )}

            {metaLine && (
              <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate">{metaLine}</span>
              </div>
            )}

            <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
              <span className="text-xs font-semibold text-[#0d4f4f]">
                View profile
              </span>

              <ArrowUpRight className="h-4 w-4 text-[#0d4f4f]" />
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:border-[#0d4f4f]/25 hover:shadow-[0_16px_40px_rgba(10,22,40,0.08)]"
    >
      <div className="flex flex-1 flex-col px-5 pt-5 pb-4">
        <div className="mb-4 flex items-start gap-3">
          {/* Logo */}
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-[#0a1628] to-[#0d4f4f]">
            <img
              src={getLogoUrl(business)}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>

          {/* Text */}
          <div className="min-w-0 flex-1">
            <div className="flex items-start gap-2">
              <h3 className="text-sm font-semibold leading-5 text-[#0a1628] transition-colors group-hover:text-[#0d4f4f] break-words">
                {business.name}
              </h3>

              {business.is_verified && (
                <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#00c4cc]" />
              )}
            </div>

            <p className="mt-1 text-sm text-slate-600">{industryLabel}</p>

            {description && (
              <p className="mt-2 text-xs text-gray-500 leading-relaxed line-clamp-2">
                {description}
              </p>
            )}

            {metaLine && (
              <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate">{metaLine}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3">
          <span className="text-xs font-semibold text-[#0d4f4f]">
            View profile
          </span>

          <ArrowUpRight className="h-4 w-4 text-[#0d4f4f]" />
        </div>
      </div>
    </Link>
  );
}