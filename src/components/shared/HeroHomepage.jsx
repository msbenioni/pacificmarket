import { ChevronRight, CheckCircle } from "lucide-react";
import { createPageUrl } from "@/utils";
import BusinessSearch from "@/components/BusinessSearch";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HeroHomepage({
  badge = "Trusted Pacific Business Discovery Platform",
  title = "Discover Pacific Business, Opportunity, and Connection.",
  mobileTitle = "Discover Pacific Business, Opportunity, and Connection.",
  subtitle = "",
  description = "Pacific Discovery Network helps people discover, connect with, and support Pacific-owned businesses across New Zealand, Australia, the Pacific, and beyond — through a trusted, premium platform built for visibility, credibility, and growth.",
  mobileDescription = "Discover and connect with Pacific-owned businesses across Aotearoa, the Pacific, Australia, and beyond through a trusted platform built for visibility and growth.",
  primaryCtaText = "Join Pacific Discovery Network",
  primaryCtaHref = createPageUrl("BusinessLogin") + "?mode=signup",
  secondaryCtaText = "Explore Businesses",
  secondaryCtaHref = createPageUrl("Registry"),
}) {
  const router = useRouter();
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  const handleBusinessSelect = (business) => {
    setSelectedBusiness(business);
    router.push(
      createPageUrl("BusinessProfile") +
        `?handle=${business.business_handle || business.id}`
    );
  };

  const handleSearchChange = (searchTerm) => {
    console.log("Search term changed:", searchTerm);
  };

  return (
    <section className="relative overflow-hidden min-h-[640px] sm:min-h-[720px]">
      <div className="absolute inset-0">
        <img
          src="/hero.png"
          alt="Pacific Ocean horizon"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/18 via-black/0 to-black/0" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-14 sm:pb-16">
        <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 items-start lg:items-center">
          {/* Left: Title panel */}
          <div className="lg:w-5/12">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-2 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-[#00c9cc]"></span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#00c9cc]">
                {badge}
              </span>
            </div>

            <div className="mt-5 bg-[#0a1628]/62 backdrop-blur-md border border-white/10 rounded-2xl p-5 sm:p-7 shadow-xl">
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight sm:leading-[1.02]">
                <span className="sm:hidden">{mobileTitle}</span>
                <span className="hidden sm:inline">{title}</span>
              </h1>

              {subtitle && (
                <h2 className="mt-3 text-xl sm:text-2xl font-semibold text-white/90">
                  {subtitle}
                </h2>
              )}

              <div className="mt-4 h-[3px] w-44 rounded-full bg-gradient-to-r from-[#00c4cc] via-[#c9a84c] to-transparent" />

              <p className="mt-4 text-sm sm:text-lg text-white/90 leading-6 sm:leading-relaxed">
                <span className="sm:hidden">{mobileDescription}</span>
                <span className="hidden sm:inline">{description}</span>
              </p>

              {/* CTAs */}
              <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row gap-4">
                <a
                  href={primaryCtaHref}
                  className="inline-flex items-center justify-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-[#0a1628] font-bold px-6 py-3 rounded-xl transition-all text-sm w-full sm:w-auto min-h-[44px]"
                >
                  {primaryCtaText}
                  <ChevronRight className="w-4 h-4" />
                </a>
                <a
                  href={secondaryCtaHref}
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm w-full sm:w-auto min-h-[44px] border border-white/20"
                >
                  {secondaryCtaText}
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Right: Search panel */}
          <div className="lg:w-7/12">
            <div className="bg-white/95 backdrop-blur-md border border-white/40 rounded-2xl p-5 sm:p-7 shadow-xl">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                Discover Pacific Businesses
              </h2>

              <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                <CheckCircle className="w-4 h-4 text-[#00c4cc]" />
                <span>Trusted profiles. Stronger visibility. Meaningful discovery.</span>
              </div>

              <BusinessSearch
                onSelect={handleBusinessSelect}
                onError={(error) => console.error("Search error:", error)}
                onSearchChange={handleSearchChange}
                placeholder="Search by business name, service, country, culture, or industry…"
                showSelectedPreview={false}
                initialSearchTerm=""
              />

              <div className="mt-3 text-center">
                <a
                  href={createPageUrl("Registry")}
                  className="inline-flex items-center gap-1 text-sm text-[#00c4cc] hover:text-[#00aab0] transition-colors"
                >
                  Explore the full network <ChevronRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}