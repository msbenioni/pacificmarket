import Link from "next/link";
import { createPageUrl } from "@/utils";
import { CheckCircle, ArrowUpRight } from "lucide-react";

export default function BusinessCard({ business, view = "grid" }) {
  if (view === "list") {
    return (
      <Link
        href={createPageUrl("BusinessProfile") + `?handle=${business.business_handle || business.id}`}
        className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl px-5 py-4 shadow-md hover:shadow-xl hover:border-[#0d4f4f]/30 transition-all group"
      >
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#0a1628] to-[#0d4f4f] flex items-center justify-center flex-shrink-0 overflow-hidden">
          {business.logo_url ? (
            <img src={business.logo_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <img src="/pm_logo.png" alt="Pacific Market" className="w-full h-full object-cover" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-[#0a1628] text-[13px] leading-snug whitespace-normal break-words">
              {business.name}
            </span>
            {business.verified && <CheckCircle className="w-4 h-4 text-[#00c4cc] flex-shrink-0" />}
          </div>
          <p className="text-xs text-gray-500 leading-5">
            {business.industry || "Industry"}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs font-semibold text-[#0d4f4f]">View profile</span>
          <ArrowUpRight className="w-4 h-4 text-[#0d4f4f]" />
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={createPageUrl("BusinessProfile") + `?handle=${business.business_handle || business.id}`}
      className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:border-[#0d4f4f]/30 transition-all group flex flex-col"
    >
      <div className="px-5 pt-5 pb-4 flex-1 flex flex-col">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-14 h-14 rounded-xl border-2 border-white shadow-md bg-white overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#0a1628] to-[#0d4f4f] flex-shrink-0">
            {business.logo_url ? (
              <img src={business.logo_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <img src="/pm_logo.png" alt="Pacific Market" className="w-full h-full object-cover" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-[#0a1628] text-[13px] leading-snug whitespace-normal break-words group-hover:text-[#0d4f4f] transition-colors">
                {business.name}
              </h3>
              {business.verified && <CheckCircle className="w-4 h-4 text-[#00c4cc] flex-shrink-0" />}
            </div>
            <p className="mt-1 text-xs text-gray-500 leading-5">
              {business.industry || "Industry"}
            </p>
          </div>
        </div>

        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs font-semibold text-[#0d4f4f]">View profile</span>
          <ArrowUpRight className="w-4 h-4 text-[#0d4f4f]" />
        </div>
      </div>
    </Link>
  );
}