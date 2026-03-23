import Link from "next/link";
import { createPageUrl } from "@/utils";
import { CheckCircle, ArrowUpRight, MapPin, Speech } from "lucide-react";
import { INDUSTRIES, COUNTRIES } from "@/constants/unifiedConstants";
import { getLogoUrl } from "@/utils/bannerUtils";
import { getBusinessCulturalData } from "@/utils/businessCulturalHelpers";
import FlagIcon from "../shared/FlagIcon";

function getIndustryLabel(value) {
  const match = INDUSTRIES.find((item) => item.value === value);
  return match?.label || value || "Industry";
}

function getCountryLabel(value) {
  const match = COUNTRIES.find((item) => item.value === value);
  return match?.label || value || "";
}

function formatDisplayList(items, options = {}) {
  const { max = 3, separator = ", ", finalSeparator = " & " } = options;
  if (!items || !items.length) return "";
  
  const unique = [...new Set(items)].filter(Boolean);
  if (unique.length === 0) return "";
  
  if (unique.length === 1) return unique[0];
  if (unique.length === 2) return unique.join(finalSeparator);
  if (unique.length <= max) {
    return unique.slice(0, -1).join(separator) + finalSeparator + unique[unique.length - 1];
  }
  
  return unique.slice(0, max - 1).join(separator) + finalSeparator + unique[max - 1] + ` +${unique.length - max} more`;
}

export default function BusinessCard({ business, view = "grid" }) {
  const href =
    createPageUrl("BusinessProfile") +
    `?handle=${business.business_handle || business.id}`;

  const industryLabel = getIndustryLabel(business.industry);
  const countryLabel = getCountryLabel(business.country);
  const metaLine = [business.city, countryLabel].filter(Boolean).join(", ");
  const description = business.tagline || business.description || "";

  const culturalData = getBusinessCulturalData(business);
  const readableLanguages = formatDisplayList(culturalData.languagesDisplay, { max: 2 });

  if (view === "list") {
    return (
      <Link
        href={href}
        className="group block overflow-hidden rounded-[24px] border border-slate-200 bg-white px-4 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#0d4f4f]/20 hover:shadow-[0_18px_40px_rgba(10,22,40,0.10)]"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-[#0a1628] to-[#0d4f4f] shadow-sm">
            <img
              src={getLogoUrl(business)}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start gap-2">
              <h3 className="text-[14px] font-semibold leading-5 text-[#0a1628] transition-colors group-hover:text-[#0d4f4f] break-words line-clamp-2">
                {business.business_name}
              </h3>

              {business.is_verified && (
                <CheckCircle className="mt-0.5 h-[14px] w-[14px] flex-shrink-0 text-[#00c4cc]" />
              )}
            </div>
          </div>
        </div>

        <div className="mt-3 space-y-1.5">
          {description && (
            <p className="text-[12px] leading-4 font-semibold text-[#0d4f4f] line-clamp-2">
              {description}
            </p>
          )}

          {metaLine && (
            <div className="flex items-center gap-1 text-[11px] text-slate-500">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{metaLine}</span>
            </div>
          )}

          {readableLanguages && (
            <div className="flex items-start gap-1 text-[11px] text-[#0d4f4f]">
              <Speech className="mt-0.5 h-3 w-3 flex-shrink-0" />
              <span className="leading-3">{readableLanguages}</span>
            </div>
          )}

          {culturalData.culturalIdentitiesRaw.length > 0 && (
            <div className="flex items-center gap-1.5 mt-0.5">
              {culturalData.culturalIdentitiesRaw.slice(0, 3).map((identity, index) => (
                <FlagIcon key={index} identity={identity} size={22} />
              ))}
              {culturalData.culturalIdentitiesRaw.length > 3 && (
                <span className="text-[9px] text-gray-500 ml-1">
                  +{culturalData.culturalIdentitiesRaw.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-medium text-slate-600">
            {industryLabel}
          </span>

          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0d4f4f]">
            View profile
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#0d4f4f]/20 hover:shadow-[0_22px_50px_rgba(10,22,40,0.10)]"
    >
      <div className="flex flex-1 flex-col px-4 pt-4 pb-3.5">
        <div className="flex items-start gap-3">
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-[#0a1628] to-[#0d4f4f] shadow-sm">
            <img
              src={getLogoUrl(business)}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start gap-2">
              <h3 className="text-[16px] font-semibold leading-5 text-[#0a1628] transition-colors group-hover:text-[#0d4f4f] break-words line-clamp-2">
                {business.business_name}
              </h3>

              {business.is_verified && (
                <CheckCircle className="mt-0.5 h-[16px] w-[16px] flex-shrink-0 text-[#00c4cc]" />
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {description && (
            <p className="text-[13px] leading-5 font-semibold text-[#0d4f4f] line-clamp-2">
              {description}
            </p>
          )}

          {metaLine && (
            <div className="flex items-center gap-1.5 text-[12px] text-slate-500">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">{metaLine}</span>
            </div>
          )}

          {readableLanguages && (
            <div className="flex items-start gap-1.5 text-[12px] text-[#0d4f4f]">
              <Speech className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
              <span className="leading-4">{readableLanguages}</span>
            </div>
          )}

          {culturalData.culturalIdentitiesRaw.length > 0 && (
            <div className="flex items-center gap-2 mt-1">
              {culturalData.culturalIdentitiesRaw.slice(0, 3).map((identity, index) => (
                <FlagIcon key={index} identity={identity} size={24} />
              ))}
              {culturalData.culturalIdentitiesRaw.length > 3 && (
                <span className="text-[10px] text-gray-500 ml-1">
                  +{culturalData.culturalIdentitiesRaw.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-600">
            {industryLabel}
          </span>

          <span className="inline-flex items-center gap-1 text-[12px] font-semibold tracking-[0.01em] text-[#0d4f4f]">
            View profile
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}