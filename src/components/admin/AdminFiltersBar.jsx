import { Filter, Plus, Search } from "lucide-react";

export default function AdminFiltersBar({
  searchQuery,
  setSearchQuery,
  showFilters,
  setShowFilters,
  activeFilterCount,
  filters,
  setFilters,
  onToggleCreate,
  COUNTRIES,
  INDUSTRIES,
  primaryButtonCls,
  secondaryButtonCls,
  mobileButtonCls,
  filterButtonCls,
}) {
  return (
    <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="w-full lg:max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search businesses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="min-h-[44px] w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm transition-colors focus:border-[#0d4f4f] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={
                showFilters
                  ? `${mobileButtonCls} bg-[#0d4f4f] text-white hover:bg-[#1a6b6b]`
                  : filterButtonCls
              }
            >
              <Filter className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[11px]">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <button onClick={onToggleCreate} className={primaryButtonCls}>
              <Plus className="h-4 w-4" />
              Create Listing
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
              <select
                value={filters.country}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, country: e.target.value }))
                }
                className="min-h-[44px] rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[#0d4f4f] focus:outline-none"
              >
                <option value="">All Countries</option>
                {COUNTRIES.map((country) => (
                  <option key={`country-${country.value}`} value={country.value}>
                    {country.label}
                  </option>
                ))}
              </select>

              <select
                value={filters.industry}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, industry: e.target.value }))
                }
                className="min-h-[44px] rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[#0d4f4f] focus:outline-none"
              >
                <option value="">All Industries</option>
                {INDUSTRIES.map((industry) => (
                  <option key={`industry-${industry.value}`} value={industry.value}>
                    {industry.label}
                  </option>
                ))}
              </select>

              <select
                value={filters.tier}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, tier: e.target.value }))
                }
                className="min-h-[44px] rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[#0d4f4f] focus:outline-none"
              >
                <option value="">All Tiers</option>
                <option value="vaka">Vaka</option>
                <option value="mana">Mana</option>
                <option value="moana">Moana</option>
              </select>

              <select
                value={filters.is_verified}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    is_verified: e.target.value,
                  }))
                }
                className="min-h-[44px] rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[#0d4f4f] focus:outline-none"
              >
                <option value="">All Verification</option>
                <option value="true">Verified</option>
                <option value="false">Not Verified</option>
              </select>
            </div>

            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                onClick={() =>
                  setFilters({
                    country: "",
                    industry: "",
                    tier: "",
                    is_verified: "",
                  })
                }
                className={secondaryButtonCls}
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
