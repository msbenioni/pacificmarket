"use client";

import { useState, useEffect, useMemo } from "react";
import { AlertCircle, Search, CheckCircle, MapPin, Briefcase } from "lucide-react";
import { BUSINESS_STATUS, COUNTRIES, INDUSTRIES } from "@/constants/unifiedConstants";

function getCountryLabel(value) {
  const match = COUNTRIES.find((item) => item.value === value);
  return match?.label || value || "";
}

function getIndustryLabel(value) {
  const match = INDUSTRIES.find((item) => item.value === value);
  return match?.label || value || "Industry";
}

export default function BusinessSearch({
  onSelect,
  onError,
  placeholder = "Search business name...",
  showSelectedPreview = true,
  initialSearchTerm = "",
  onSearchChange,
}) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [results, setResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [error, setError] = useState("");
  const [allBusinesses, setAllBusinesses] = useState([]);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        // Import getSupabase dynamically
        const { getSupabase } = await import("@/lib/supabase/client");
        const supabase = getSupabase();
        const { data, error } = await supabase
          .from("businesses")
          .select("id, name, city, country, industry, business_handle, status")
          .eq("status", BUSINESS_STATUS.ACTIVE)
          .order("name", { ascending: true });

        if (error) throw error;

        if (alive) {
          setAllBusinesses(data || []);
        }
      } catch (e) {
        console.error("BusinessSearch list error:", e);
        if (alive) {
          setError("Unable to load businesses");
          onError?.("Unable to load businesses");
        }
      }
    })();

    return () => {
      alive = false;
    };
  }, [onError]);

  useEffect(() => {
    setSearchTerm(initialSearchTerm || "");
  }, [initialSearchTerm]);

  const handleSearch = (value) => {
    setError("");

    if (!value.trim()) {
      setResults([]);
      setError("");
      return;
    }

    const normalized = value.toLowerCase().trim();

    const matches = allBusinesses.filter((business) =>
      (business?.business_name || "").toLowerCase().includes(normalized)
    );

    setResults(matches);

    if (matches.length === 0) {
      setError("Business not found");
      onError?.("Business not found");
    }
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    onSearchChange?.(value);
    handleSearch(value);
  };

  const handleSelectResult = (result) => {
    setSelectedResult(result);
    setSearchTerm(result.name);
    setResults([]);
    setError("");
    onSelect?.(result);
  };

  const selectedMeta = selectedResult
    ? [
        selectedResult.city,
        getCountryLabel(selectedResult.country),
        getIndustryLabel(selectedResult.industry),
      ]
        .filter(Boolean)
        .join(" · ")
    : "";

  return (
    <div className="space-y-4">
      {/* Search input */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Business Name
        </label>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={placeholder}
            className="w-full min-h-[44px] rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-3 text-sm text-[#0a1628] placeholder:text-gray-400 focus:outline-none focus:border-[#0d4f4f] focus:ring-2 focus:ring-[#0d4f4f]/10"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">{error}</p>
            <p className="text-xs text-red-600 mt-1">
              Try another spelling or search a shorter version of the business name.
            </p>
          </div>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white max-h-72 overflow-y-auto shadow-sm">
          {results.map((result) => {
            const meta = [
              result.city,
              getCountryLabel(result.country),
              getIndustryLabel(result.industry),
            ]
              .filter(Boolean)
              .join(" · ");

            return (
              <button
                key={result.id}
                type="button"
                onClick={() => handleSelectResult(result)}
                className="w-full px-4 py-3 text-left transition-colors hover:bg-slate-50 border-b border-gray-100 last:border-b-0"
              >
                <p className="font-semibold text-[#0a1628] text-sm break-words">
                  {result.name}
                </p>

                {meta && (
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    {result.city || result.country ? (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {[result.city, getCountryLabel(result.country)]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    ) : null}

                    {result.industry ? (
                      <span className="inline-flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5" />
                        {getIndustryLabel(result.industry)}
                      </span>
                    ) : null}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Selected preview */}
      {selectedResult && showSelectedPreview && (
        <div className="rounded-2xl border border-[#0d4f4f]/20 bg-[#0d4f4f]/5 p-4">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-[#0d4f4f] mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="font-semibold text-[#0a1628] text-sm break-words">
                {selectedResult.name}
              </p>

              {selectedMeta && (
                <p className="text-xs text-gray-600 mt-1">{selectedMeta}</p>
              )}

              <p className="text-xs text-gray-500 mt-2 leading-5">
                You’ve selected this business. The next step is submitting your ownership request for review.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}