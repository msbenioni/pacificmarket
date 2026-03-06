import { ChevronRight } from "lucide-react";
import { createPageUrl } from "@/utils";
import { Search, CheckCircle } from "lucide-react";
import BusinessSearch from "@/components/BusinessSearch";
import { useState } from "react";

export default function HeroHomepage() {
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  const handleBusinessSelect = (business) => {
    setSelectedBusiness(business);
    // Redirect to business profile page
    window.location.href = createPageUrl("BusinessProfile") + `?handle=${business.business_handle || business.id}`;
  };

  const handleSearchChange = (searchTerm) => {
    // Optional: Handle search term changes if needed
    console.log('Search term changed:', searchTerm);
  };
  return (
    <section className="relative overflow-hidden min-h-[720px]">
      <div className="absolute inset-0">
        <img
          src="/hero.png"
          alt="Pacific Ocean horizon"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/18 via-black/0 to-black/0" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <div className="grid lg:grid-cols-12 gap-10 items-start lg:items-center">
          {/* Left: Title panel */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 bg-white/90 border border-white/40 rounded-full px-3 py-1.5 shadow-sm backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#00c4cc]" />
              <span className="text-xs font-semibold tracking-wider uppercase text-[#0d4f4f]">
                The First Global Registry of Pacific-Owned Enterprise
              </span>
            </div>

            <div className="mt-5 bg-[#0a1628]/62 backdrop-blur-md border border-white/10 rounded-2xl p-7 shadow-xl">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-[1.02]">
                The Economic Map of{" "}
                <span className="text-[#00c4cc]">Pacific-Owned</span>{" "}
                <span className="text-[#c9a84c]">Enterprise</span>
              </h1>

              <div className="mt-4 h-[3px] w-44 rounded-full bg-gradient-to-r from-[#00c4cc] via-[#c9a84c] to-transparent" />

              <p className="mt-4 text-base sm:text-lg text-white/90">
                A structured, verified registry of Pacific-owned businesses — built for communities, researchers, policymakers, and partners who need trusted data on Pacific enterprise globally.
              </p>
            </div>
          </div>

          {/* Right: Search Card */}
          <div className="lg:col-span-7">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-7 relative overflow-hidden">
              {/* watermark motif behind card (super subtle) */}
              <div className="absolute -right-10 -top-10 w-72 h-72 rounded-full bg-[#00c4cc]/10 blur-2xl" />
              <div className="absolute -left-10 -bottom-10 w-72 h-72 rounded-full bg-[#c9a84c]/10 blur-2xl" />

              <div className="relative">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Registry Search
                  </h2>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <CheckCircle className="w-4 h-4 text-[#00c4cc]" />
                    <span>Verified. Structured. Trusted.</span>
                  </div>
                </div>

                {/* BusinessSearch component */}
                <BusinessSearch
                  onSelect={handleBusinessSelect}
                  onError={(error) => console.error('Search error:', error)}
                  onSearchChange={handleSearchChange}
                  placeholder="Search by business name, keyword, country, or industry…"
                  showSelectedPreview={false}
                  initialSearchTerm=""
                />

                {/* Browse all businesses link */}
                <div className="mt-3 text-center">
                  <a
                    href={createPageUrl("Registry")}
                    className="inline-flex items-center gap-1 text-sm text-[#00c4cc] hover:text-[#00aab0] transition-colors"
                  >
                    Browse all businesses <ChevronRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
