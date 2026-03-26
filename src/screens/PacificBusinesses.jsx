"use client";

import { useState, useEffect, useMemo } from "react";
import { getPublicBusinesses } from "@/lib/supabase/queries/businesses";
import { LayoutGrid, List, SlidersHorizontal, X, Search } from "lucide-react";
import BusinessCard from "../components/registry/BusinessCard";
import RegistryFilters from "../components/registry/RegistryFilters";
import HeroStandard from "../components/shared/HeroStandard";
import { getBusinessCulturalData } from "@/utils/businessCulturalHelpers";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "verified", label: "Verified First" },
  { value: "featured", label: "Featured First" },
  { value: "alpha", label: "A–Z" },
];

export default function PacificBusinesses() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("grid");
  const [sort, setSort] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const defaultFilters = { search: "", country: "", industry: "", cultural_identity: "" };
  const [filters, setFilters] = useState(defaultFilters);
  const [draftFilters, setDraftFilters] = useState(defaultFilters);

  useEffect(() => {
    const loadBusinesses = async () => {
      try {
        const { data } = await getPublicBusinesses({ limit: 100 });

        setBusinesses(data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error loading businesses:", error);
        setLoading(false);
      }
    };

    loadBusinesses();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    const handleViewChange = () => setView(mediaQuery.matches ? "list" : "grid");
    handleViewChange();
    mediaQuery.addEventListener("change", handleViewChange);
    return () => mediaQuery.removeEventListener("change", handleViewChange);
  }, []);

  const filtered = useMemo(() => {
    let result = businesses.filter((b) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const businessMatch = b.business_name?.toLowerCase().includes(searchLower);
        const descriptionMatch = b.description?.toLowerCase().includes(searchLower);
        
        // Safe cultural identity search using resolved helper data
        const culturalData = getBusinessCulturalData(b);
        const culturalMatches = culturalData.culturalIdentitiesDisplay.some(identity => 
          identity.toLowerCase().includes(searchLower)
        ) || culturalData.languagesDisplay.some(lang => 
          lang.toLowerCase().includes(searchLower)
        );
        
        if (!businessMatch && !descriptionMatch && !culturalMatches) {
          return false;
        }
      }
      if (filters.country && b.country !== filters.country) return false;
      if (filters.industry && b.industry !== filters.industry) return false;
      if (filters.cultural_identity) {
        const culturalData = getBusinessCulturalData(b);
        const hasCulturalIdentity = culturalData.culturalIdentitiesDisplay.some(identity => 
          identity.toLowerCase() === filters.cultural_identity.toLowerCase()
        );
        if (!hasCulturalIdentity) return false;
      }
      return true;
    });

    if (filters.search) {
      const tierOrder = { moana: 0, mana: 1, vaka: 2 };
      result = [...result].sort((a, b) => {
        return (
          (tierOrder[a.subscription_tier ?? 2] ?? 2) -
          (tierOrder[b.subscription_tier ?? 2] ?? 2)
        );
      });
    }

    if (sort === "verified") {
      result = [...result].sort(
        (a, b) => (b.is_verified ? 1 : 0) - (a.is_verified ? 1 : 0)
      );
    } else if (sort === "featured") {
      result = [...result].sort((a, b) => {
        const tierOrder = { moana: 0, mana: 1, vaka: 2 };
        return (
          (tierOrder[a.subscription_tier ?? 2] ?? 2) -
          (tierOrder[b.subscription_tier ?? 2] ?? 2)
        );
      });
    } else if (sort === "alpha") {
      result = [...result].sort((a, b) => a.business_name?.localeCompare(b.business_name));
    }

    return result;
  }, [businesses, filters, sort]);

  const hasFilters = filters.country || filters.industry || filters.cultural_identity;
  const clearAllFilters = () => setFilters(defaultFilters);
  const clearDrafts = () => setDraftFilters(defaultFilters);
  const applyDrafts = () => {
    setFilters(draftFilters);
    setShowFilters(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      <HeroStandard
        badge="Discover"
        title="Discover Pacific Businesses"
        subtitle={
          loading
            ? "Loading..."
            : `${businesses.length} business${businesses.length !== 1 ? "es" : ""} available to explore`
        }
        description="Explore Pacific-owned businesses across industries, locations, and communities through a more trusted discovery experience."
        compact
      />

      {/* Sticky toolbar */}
      <div className="sticky top-16 z-30 bg-[#f8f9fc]/95 backdrop-blur supports-[backdrop-filter]:bg-[#f8f9fc]/85">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <div className="hidden lg:block w-64 flex-shrink-0" />

            <div className="flex-1 min-w-0 py-3 sm:py-4 border-b border-gray-200">
              <div className="flex flex-col gap-3">
                <div className="relative lg:hidden">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    value={filters.search}
                    onChange={(e) =>
                      setFilters({ ...filters, search: e.target.value })
                    }
                    placeholder="Search businesses, services, keywords, or countries"
                    className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-2xl focus:outline-none focus:border-[#0d4f4f] focus:ring-2 focus:ring-[#0d4f4f]/10 min-h-[44px] bg-white shadow-sm"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => {
                        setDraftFilters(filters);
                        setShowFilters(true);
                      }}
                      className="lg:hidden flex items-center justify-center gap-2 border border-gray-200 bg-white text-sm px-3 py-3 rounded-2xl min-h-[44px] shadow-sm"
                    >
                      <SlidersHorizontal className="w-4 h-4" /> Filters
                    </button>

                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                      className="text-sm border border-gray-200 bg-white rounded-2xl px-3 py-3 focus:outline-none focus:border-[#0d4f4f] min-h-[44px] shadow-sm"
                    >
                      {SORT_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 font-medium">
                      {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                      {hasFilters && " (filtered)"}
                    </span>

                    {hasFilters && (
                      <button
                        onClick={clearAllFilters}
                        className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-red-600 bg-white border border-gray-200 px-2.5 py-1.5 rounded-lg"
                      >
                        <X className="w-3 h-3" /> Clear filters
                      </button>
                    )}

                    <div className="hidden lg:flex border border-gray-200 rounded-xl overflow-hidden bg-white ml-auto">
                      <button
                        onClick={() => setView("grid")}
                        className={`p-2 ${
                          view === "grid"
                            ? "bg-[#0a1628] text-white"
                            : "text-gray-400 hover:text-gray-600"
                        }`}
                      >
                        <LayoutGrid className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setView("list")}
                        className={`p-2 ${
                          view === "list"
                            ? "bg-[#0a1628] text-white"
                            : "text-gray-400 hover:text-gray-600"
                        }`}
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-8">
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-36">
              <RegistryFilters filters={filters} onChange={setFilters} />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            {loading ? (
              <div
                className={`grid gap-4 ${
                  view === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
                    : "grid-cols-1"
                }`}
              >
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
                    >
                      <div className="h-24 shimmer" />
                      <div className="p-5 space-y-3">
                        <div className="h-4 w-3/4 shimmer rounded" />
                        <div className="h-3 w-1/2 shimmer rounded" />
                        <div className="h-8 shimmer rounded" />
                      </div>
                    </div>
                  ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 sm:py-20 px-4">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <SlidersHorizontal className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  No businesses found
                </h3>
                <p className="text-gray-400 text-sm">
                  Try adjusting your search or filters to discover more businesses
                </p>
              </div>
            ) : (
              <div
                className={
                  view === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4"
                    : "space-y-3"
                }
              >
                {filtered.map((b) => (
                  <BusinessCard key={b.id} business={b} view={view} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Overlay */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowFilters(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] bg-[#f8f9fc] rounded-t-3xl overflow-y-auto px-5 pt-5 pb-28 shadow-[0_-20px_60px_rgba(10,22,40,0.18)]">
            <div className="mx-auto h-1.5 w-12 rounded-full bg-gray-200 mb-4" />
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-[#0a1628]">Filters</span>
              <button onClick={() => setShowFilters(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <RegistryFilters filters={draftFilters} onChange={setDraftFilters} />
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-[#f8f9fc]/95 backdrop-blur border-t border-gray-200 p-4 flex gap-3">
            <button
              onClick={clearDrafts}
              className="flex-1 min-h-[44px] rounded-xl border border-gray-300 bg-white text-sm font-semibold text-gray-600"
            >
              Clear
            </button>
            <button
              onClick={applyDrafts}
              className="flex-1 min-h-[44px] rounded-xl bg-[#0a1628] text-white text-sm font-semibold"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}