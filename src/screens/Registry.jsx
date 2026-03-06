import { useState, useEffect, useMemo } from "react";
import { getSupabase } from "@/lib/supabase/client";
import { BUSINESS_STATUS } from "@/constants/business";
import { LayoutGrid, List, SlidersHorizontal, X } from "lucide-react";
import BusinessCard from "../components/registry/BusinessCard";
import RegistryFilters from "../components/registry/RegistryFilters";
import HeroRegistry from "../components/shared/HeroRegistry";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "verified", label: "Verified First" },
  { value: "featured", label: "Featured First" },
  { value: "alpha", label: "A–Z" },
];

export default function Registry() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("grid");
  const [sort, setSort] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ search: "", country: "", industry: "", verified: false, identity: "" });

  useEffect(() => {
    const loadBusinesses = async () => {
      try {
        const supabase = getSupabase();
        const { data } = await supabase
          .from('businesses')
          .select('*')
          .eq('status', BUSINESS_STATUS.ACTIVE)
          .order('created_date', { ascending: false })
          .limit(100);
        
        setBusinesses(data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error loading businesses:", error);
        setLoading(false);
      }
    };

    loadBusinesses();
  }, []);

  const filtered = useMemo(() => {
    let result = businesses.filter(b => {
      if (filters.search && !b.name?.toLowerCase().includes(filters.search.toLowerCase()) &&
        !b.description?.toLowerCase().includes(filters.search.toLowerCase()) &&
        !b.cultural_identity?.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.country && b.country !== filters.country) return false;
      if (filters.industry && b.industry !== filters.industry) return false;
      if (filters.verified && !b.verified) return false;
      if (filters.identity && !b.cultural_identity?.toLowerCase().includes(filters.identity.toLowerCase())) return false;
      return true;
    });

    if (sort === "verified") result = [...result].sort((a, b) => (b.verified ? 1 : 0) - (a.verified ? 1 : 0));
    else if (sort === "featured") result = [...result].sort((a, b) => {
      const tierOrder = { featured_plus: 0, verified: 1, free: 2 };
      return (tierOrder[a.tier] ?? 2) - (tierOrder[b.subscription_tier] ?? 2);
    });
    else if (sort === "alpha") result = [...result].sort((a, b) => a.name?.localeCompare(b.name));

    return result;
  }, [businesses, filters, sort]);

  const hasFilters = filters.country || filters.industry || filters.verified || filters.identity;

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      {/* Hero — scrolls away with the page */}
      <HeroRegistry
        badge="Pacific Market"
        title="Business Registry"
        subtitle={loading ? "Loading..." : `${businesses.length} business${businesses.length !== 1 ? "es" : ""} registered`}
        description=""
      />

      {/* Sticky toolbar */}
      <div className="sticky top-16 z-30 bg-[#f8f9fc]">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {/* Spacer to align with filter panel */}
            <div className="hidden lg:block w-64 flex-shrink-0" />

            {/* Toolbar */}
            <div className="flex-1 min-w-0 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 font-medium">
                    {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                    {hasFilters && " (filtered)"}
                  </span>
                  {hasFilters && (
                    <button onClick={() => setFilters({ search: "", country: "", industry: "", verified: false, identity: "" })}
                      className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 bg-red-50 px-2 py-1 rounded-lg">
                      <X className="w-3 h-3" /> Clear filters
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setShowFilters(true)}
                    className="lg:hidden flex items-center gap-2 border border-gray-200 bg-white text-sm px-3 py-2 rounded-xl">
                    <SlidersHorizontal className="w-4 h-4" /> Filters
                  </button>
                  <select value={sort} onChange={e => setSort(e.target.value)}
                    className="text-sm border border-gray-200 bg-white rounded-xl px-3 py-2 focus:outline-none focus:border-[#0d4f4f]">
                    {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <div className="flex border border-gray-200 rounded-xl overflow-hidden bg-white">
                    <button onClick={() => setView("grid")}
                      className={`p-2 ${view === "grid" ? "bg-[#0a1628] text-white" : "text-gray-400 hover:text-gray-600"}`}>
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button onClick={() => setView("list")}
                      className={`p-2 ${view === "list" ? "bg-[#0a1628] text-white" : "text-gray-400 hover:text-gray-600"}`}>
                      <List className="w-4 h-4" />
                    </button>
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
          {/* Desktop Filters */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-36">
              <RegistryFilters filters={filters} onChange={setFilters} />
            </div>
          </div>

          {/* Cards */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className={`grid gap-4 ${view === "grid" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4" : "grid-cols-1"}`}>
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden">
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
              <div className="text-center py-20">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <SlidersHorizontal className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No records found</h3>
                <p className="text-gray-400 text-sm">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5" : "space-y-3"}>
                {filtered.map(b => <BusinessCard key={b.id} business={b} view={view} />)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Overlay */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-[#f8f9fc] overflow-y-auto p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-[#0a1628]">Filters</span>
              <button onClick={() => setShowFilters(false)}><X className="w-5 h-5" /></button>
            </div>
            <RegistryFilters filters={filters} onChange={f => { setFilters(f); setShowFilters(false); }} />
          </div>
        </div>
      )}
    </div>
  );
}