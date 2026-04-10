"use client";

import { useState, useEffect, useMemo } from "react";
import { LayoutGrid, List, SlidersHorizontal, X, Search } from "lucide-react";
import BusinessCard from "@/components/registry/BusinessCard";
import RegistryFilters from "@/components/registry/RegistryFilters";
import HeroStandard from "@/components/shared/HeroStandard";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "verified", label: "Verified First" },
  { value: "featured", label: "Featured First" },
  { value: "alpha", label: "A-Z" },
];

export default function PacificBusinessesClient({ initialBusinesses }) {
  const [businesses, setBusinesses] = useState(initialBusinesses);
  const [view, setView] = useState("grid");
  const [sort, setSort] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const defaultFilters = { search: "", country: "", industry: "", cultural_identity: "" };
  const [filters, setFilters] = useState(defaultFilters);
  const [draftFilters, setDraftFilters] = useState(defaultFilters);

  // Optimized filtering with memoization
  const filtered = useMemo(() => {
    let result = businesses.filter((b) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const businessMatch = b.business_name?.toLowerCase().includes(searchLower);
        const descriptionMatch = b.description?.toLowerCase().includes(searchLower);
        
        if (!businessMatch && !descriptionMatch) {
          return false;
        }
      }
      if (filters.country && b.country !== filters.country) return false;
      if (filters.industry && b.industry !== filters.industry) return false;
      return true;
    });

    // Optimized sorting
    if (sort === "verified") {
      result = [...result].sort((a, b) => (b.is_verified ? 1 : 0) - (a.is_verified ? 1 : 0));
    } else if (sort === "featured") {
      const tierOrder = { moana: 0, mana: 1, vaka: 2 };
      result = [...result].sort((a, b) => 
        (tierOrder[a.subscription_tier ?? 2] ?? 2) - (tierOrder[b.subscription_tier ?? 2] ?? 2)
      );
    } else if (sort === "alpha") {
      result = [...result].sort((a, b) => a.business_name?.localeCompare(b.business_name));
    }

    return result;
  }, [businesses, filters, sort]);

  // Responsive view handling
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    const handleViewChange = () => setView(mediaQuery.matches ? "list" : "grid");
    handleViewChange();
    mediaQuery.addEventListener("change", handleViewChange);
    return () => mediaQuery.removeEventListener("change", handleViewChange);
  }, []);

  const hasFilters = filters.country || filters.industry || filters.cultural_identity;
  const clearAllFilters = () => setFilters(defaultFilters);
  const clearDrafts = () => setDraftFilters(defaultFilters);
  const applyDrafts = () => {
    setFilters(draftFilters);
    setShowFilters(false);
  };

  // Optimized cultural data calculation (only for filtered results)
  const businessesWithCulturalData = useMemo(() => {
    return filtered.map(business => ({
      ...business,
      culturalData: {
        culturalIdentitiesRaw: business.cultural_identity ? [business.cultural_identity] : [],
        culturalIdentitiesDisplay: business.cultural_identity ? [business.cultural_identity] : [],
        languagesDisplay: business.languages ? business.languages.split(',').map(l => l.trim()).filter(Boolean) : []
      }
    }));
  }, [filtered]);

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      <HeroStandard
        badge="Discover"
        title="Discover Pacific Businesses"
        subtitle={`${businesses.length} business${businesses.length !== 1 ? "es" : ""} available to explore`}
        description="Browse verified Pacific Island businesses and discover unique products, services, and cultural experiences from across the Pacific Islands."
        actions={null}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Filters and Controls */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search businesses..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full sm:w-80 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d4f4f] focus:border-transparent"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d4f4f] focus:border-transparent"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setShowFilters(true)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                  hasFilters
                    ? "border-[#0d4f4f] bg-[#0d4f4f] text-white"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                }`}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {hasFilters && (
                  <span className="bg-[#00c9cc] text-white text-xs px-2 py-1 rounded-full">
                    {Object.values(filters).filter(Boolean).length}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {filtered.length} of {businesses.length} businesses
            </span>
            {hasFilters && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-[#0d4f4f] hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Results Grid */}
        {businessesWithCulturalData.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <LayoutGrid className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No businesses found</h3>
            <p className="text-gray-500">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
            {businessesWithCulturalData.map((business) => (
              <BusinessCard
                key={business.id}
                business={business}
                view={view}
              />
            ))}
          </div>
        )}
      </div>

      {/* Filters Modal */}
      {showFilters && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <RegistryFilters
              filters={draftFilters}
              setFilters={setDraftFilters}
              onApply={applyDrafts}
              onClear={clearDrafts}
              onCancel={() => setShowFilters(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
