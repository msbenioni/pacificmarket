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
              <h3 className="text-[15px] font-semibold leading-5 text-[#0a1628] transition-colors group-hover:text-[#0d4f4f] break-words">
                {business.business_name}
              </h3>

              {business.is_verified && (
                <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#00c4cc]" />
              )}
            </div>

            {culturalData.culturalIdentitiesRaw.length > 0 && (
              <div className="mt-2">
                {culturalData.culturalIdentitiesRaw.length === 1 ? (
                  <FlagIcon identity={culturalData.culturalIdentitiesRaw[0]} size={24} />
                ) : (
                  <div className="flex items-center gap-1">
                    {culturalData.culturalIdentitiesRaw.slice(0, 2).map((identity, index) => (
                      <FlagIcon key={index} identity={identity} size={20} />
                    ))}
                    {culturalData.culturalIdentitiesRaw.length > 2 && (
                      <span className="text-xs text-gray-500 ml-1">
                        +{culturalData.culturalIdentitiesRaw.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4">
          {description && (
            <p className="text-sm leading-6 text-slate-500 line-clamp-2">
              {description}
            </p>
          )}

          {metaLine && (
            <div className="mt-3 flex items-center gap-1.5 text-sm text-slate-500">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{metaLine}</span>
            </div>
          )}

          {readableLanguages && (
            <div className="mt-2 flex items-start gap-1.5 text-sm text-[#0d4f4f]">
              <Speech className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span className="leading-5">{readableLanguages}</span>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
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
      <div className="flex flex-1 flex-col px-5 pt-5 pb-4">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-[#0a1628] to-[#0d4f4f] shadow-sm">
            <img
              src={getLogoUrl(business)}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start gap-2">
              <h3 className="text-[17px] font-semibold leading-6 text-[#0a1628] transition-colors group-hover:text-[#0d4f4f] break-words">
                {business.business_name}
              </h3>

              {business.is_verified && (
                <CheckCircle className="mt-1 h-[18px] w-[18px] flex-shrink-0 text-[#00c4cc]" />
              )}
            </div>

            {culturalData.culturalIdentitiesRaw.length > 0 && (
              <div className="mt-2">
                {culturalData.culturalIdentitiesRaw.length === 1 ? (
                  <FlagIcon identity={culturalData.culturalIdentitiesRaw[0]} size={24} />
                ) : (
                  <div className="flex items-center gap-1">
                    {culturalData.culturalIdentitiesRaw.slice(0, 2).map((identity, index) => (
                      <FlagIcon key={index} identity={identity} size={20} />
                    ))}
                    {culturalData.culturalIdentitiesRaw.length > 2 && (
                      <span className="text-xs text-gray-500 ml-1">
                        +{culturalData.culturalIdentitiesRaw.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {description && (
            <p className="text-[15px] leading-7 text-slate-500 line-clamp-2">
              {description}
            </p>
          )}

          {metaLine && (
            <div className="flex items-center gap-2 text-[15px] text-slate-500">
              <MapPin className="h-4.5 w-4.5 flex-shrink-0" />
              <span className="truncate">{metaLine}</span>
            </div>
          )}

          {readableLanguages && (
            <div className="flex items-start gap-2 text-[15px] text-[#0d4f4f]">
              <Speech className="mt-1 h-4.5 w-4.5 flex-shrink-0" />
              <span className="leading-6">{readableLanguages}</span>
            </div>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
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