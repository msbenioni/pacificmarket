import { useState } from "react";
import Link from "next/link";
import { createPageUrl } from "@/utils";
import { CheckCircle, Star, MapPin, Tag, ArrowUpRight } from "lucide-react";
import FlagIcon from "@/components/shared/FlagIcon";

function CulturalBadge({ identity }) {
  const [hovered, setHovered] = useState(false);
  if (!identity) return null;

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <FlagIcon identity={identity} size={18} />
      {hovered && (
        <div className="absolute bottom-full mb-1 right-0 bg-[#0a1628] text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap z-20 shadow-lg">
          {identity}
        </div>
      )}
    </div>
  );
}

export default function BusinessCard({ business, view = "grid" }) {
  const tierBadge = {
    featured_plus: { label: "Featured+", cls: "featured-badge" },
    verified: { label: "Verified", cls: "verified-badge" },
    free: null,
  }[business.subscription_tier || "free"];

  const languages = business.languages_spoken?.length > 0
    ? business.languages_spoken.join(", ")
    : null;

  if (view === "list") {
    return (
      <Link
        href={createPageUrl("BusinessProfile") + `?handle=${business.business_handle || business.id}`}
        className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl px-5 py-4 shadow-md hover:shadow-xl hover:border-[#0d4f4f]/30 transition-all group"
      >
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#0a1628] to-[#0d4f4f] flex items-center justify-center flex-shrink-0 overflow-hidden">
          {business.logo_url ? <img src={business.logo_url} alt="" className="w-full h-full object-cover" /> :
            <img src="/pm_logo.png" alt="Pacific Market" className="w-full h-full object-cover" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-semibold text-[#0a1628] text-sm truncate">{business.name}</span>
            {business.verified && <CheckCircle className="w-4 h-4 text-[#00c4cc] flex-shrink-0" />}
            {tierBadge && <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tierBadge.cls}`}>{tierBadge.label}</span>}
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{business.city ? `${business.city}, ` : ""}{business.country}</span>
            <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{business.industry}</span>
            {languages && <span className="text-gray-300">· {languages}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <CulturalBadge identity={business.cultural_identity} />
          <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-[#0d4f4f] transition-colors" />
        </div>
      </Link>
    );
  }

  return (
    <Link href={createPageUrl("BusinessProfile") + `?handle=${business.business_handle || business.id}`}
      className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:border-[#0d4f4f]/30 transition-all group flex flex-col">
      {/* Banner */}
      <div className="h-32 bg-gradient-to-br from-[#0d4f4f] to-[#1a6b6b] relative overflow-hidden">
        {business.banner_url && <img src={business.banner_url} alt="" className="w-full h-full object-cover" style={{ objectPosition: "center top" }} />}
        {tierBadge && (
          <span className={`absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full font-medium ${tierBadge.cls}`}>
            {tierBadge.label === "Featured+" ? <><Star className="w-3 h-3 inline mr-1" />Featured</> : tierBadge.label}
          </span>
        )}
      </div>

      <div className="px-5 pb-5 flex-1 flex flex-col">
        {/* Logo row */}
        <div className="flex items-start -mt-6 mb-3">
          <div className="w-14 h-14 rounded-xl border-2 border-white shadow-md bg-white overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#0a1628] to-[#0d4f4f] relative z-10">
            {business.logo_url
              ? <img src={business.logo_url} alt="" className="w-full h-full object-cover" />
              : <img src="/pm_logo.png" alt="Pacific Market" className="w-full h-full object-cover" />}
          </div>
        </div>

        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-[#0a1628] text-sm leading-tight group-hover:text-[#0d4f4f] transition-colors">{business.name}</h3>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            {business.cultural_identity && <CulturalBadge identity={business.cultural_identity} />}
            {business.verified && <CheckCircle className="w-4 h-4 text-[#00c4cc]" />}
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-400 mb-0.5">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span>{business.city ? `${business.city}, ` : ""}{business.country}</span>
        </div>

        {languages && (
          <div className="text-xs text-gray-400 mb-2 flex items-center gap-1">
            <img src="/language_spoken.png" alt="Languages spoken" className="w-[36px] h-[36px]" /> {languages}
          </div>
        )}

        <p className="text-xs text-gray-500 leading-relaxed flex-1 line-clamp-3 mb-3 mt-1">
          {business.tagline || business.short_description || "Pacific-owned business listed in the Pacific Market Registry."}
          {business.description && business.description !== business.tagline && business.description !== business.short_description && (
            <>
              <br />
              <span className="text-gray-400">{business.description}</span>
            </>
          )}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md">{business.industry}</span>
        </div>
      </div>
    </Link>
  );
}