"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { BUSINESS_STATUS, INDUSTRIES, COUNTRIES, CULTURAL_IDENTITIES } from "@/constants/unifiedConstants";
import { getBusinessCulturalDataAuto } from "@/hooks/useBusinessCulturalData";

export default function RegistryFilters({ filters, onChange }) {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const loadBusinesses = async () => {
      try {
        // Import getSupabase dynamically
        const { getSupabase } = await import("@/lib/supabase/client");
        const supabase = getSupabase();
        const { data } = await supabase
          .from("businesses")
          .select("country, industry, cultural_identity")
          .eq("status", BUSINESS_STATUS.ACTIVE);

        setBusinesses(data || []);
      } catch (error) {
        console.error("Error loading businesses for filters:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBusinesses();
  }, [mounted]);

  const countryOptions = useMemo(() => {
    if (loading) return [];
    
    const uniqueCountryValues = [...new Set(
      businesses
        .map((b) => b.country)
        .filter(Boolean)
    )].sort();

    return uniqueCountryValues.map((value) => {
      const match = COUNTRIES.find((c) => c.value === value);
      return {
        value,
        label: match?.label || value,
      };
    });
  }, [businesses, loading]);

  const industryOptions = useMemo(() => {
    if (loading) return [];
    
    const uniqueIndustryValues = [...new Set(
      businesses
        .map((b) => b.industry)
        .filter(Boolean)
    )].sort();

    return uniqueIndustryValues.map((value) => {
      const match = INDUSTRIES.find((i) => i.value === value);
      return {
        value,
        label: match?.label || value,
      };
    });
  }, [businesses, loading]);

  const culturalIdentityOptions = useMemo(() => {
    if (loading) return [];
    
    // Get all cultural identities from businesses and count them individually
    const identityCounts = {};
    
    businesses.forEach((b) => {
      // Use shared helper to get parsed cultural identities
      const culturalData = getBusinessCulturalDataAuto(b);
      const identities = culturalData.culturalIdentitiesRaw;
      
      // Count each identity separately
      identities.forEach(identity => {
        if (identity) {
          const key = identity;
          if (!identityCounts[key]) {
            identityCounts[key] = {
              full: identity,
              count: 0
            };
          }
          identityCounts[key].count++;
        }
      });
    });
    
    // Convert to array and sort alphabetically
    return Object.values(identityCounts)
      .sort((a, b) => a.full.localeCompare(b.full))
      .map(item => ({
        value: item.full,
        label: `${item.full} (${item.count})`,
        count: item.count
      }));
  }, [businesses, loading]);

  const set = (key, val) => onChange({ ...filters, [key]: val });

  const clear = () =>
    onChange({
      search: "",
      country: "",
      industry: "",
      cultural_identity: "",
    });

  const hasFilters = filters.search || filters.country || filters.industry || filters.cultural_identity;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#0d4f4f]" />
          <span className="font-semibold text-sm text-[#0a1628]">Filter Registry</span>
        </div>

        {hasFilters && (
          <button
            onClick={clear}
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-red-600 bg-white border border-gray-200 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      {/* Show loading state to prevent hydration mismatch */}
      {loading ? (
        <div className="space-y-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2 w-20"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2 w-16"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2 w-24"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={filters.search || ""}
              onChange={(e) => set("search", e.target.value)}
              placeholder="Search businesses..."
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#0d4f4f] focus:ring-1 focus:ring-[#0d4f4f]/20"
            />
          </div>

          {/* Country */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Country
            </label>
            <select
              value={filters.country}
              onChange={(e) => set("country", e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#0d4f4f] bg-white"
            >
              <option value="">All Countries</option>
              {countryOptions.map((country) => (
                <option key={country.value} value={country.value}>
                  {country.label}
                </option>
              ))}
            </select>
          </div>

          {/* Industry */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Industry
            </label>
            <select
              value={filters.industry}
              onChange={(e) => set("industry", e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#0d4f4f] bg-white"
            >
              <option value="">All Industries</option>
              {industryOptions.map((industry) => (
                <option key={industry.value} value={industry.value}>
                  {industry.label}
                </option>
              ))}
            </select>
          </div>

          {/* Cultural Identity */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Cultural Identity
            </label>
            <select
              value={filters.cultural_identity || ""}
              onChange={(e) => set("cultural_identity", e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#0d4f4f] bg-white"
            >
              <option value="">All Cultural Identities</option>
              {culturalIdentityOptions.map((identity) => (
                <option key={identity.value} value={identity.value}>
                  {identity.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}