"use client";

import { useState, useEffect } from "react";
import { pacificMarket } from "@/lib/pacificMarketClient";
import { AlertCircle } from "lucide-react";

export default function BusinessSearch({
  onSelect,                 // now means: "picked business"
  onError,
  placeholder = "Search business name...",
  showSelectedPreview = true,
  initialSearchTerm = "",
  onSearchChange
}) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [results, setResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [error, setError] = useState("");
  const [allBusinesses, setAllBusinesses] = useState([]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    onSearchChange?.(value);
    handleSearch(value);
  };

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const res = await pacificMarket.entities.Business.list();

        // ✅ supports both array OR { data } shape
        const list = Array.isArray(res) ? res : (res?.data ?? []);
        if (alive) setAllBusinesses(list);
      } catch (e) {
        console.error("BusinessSearch list error:", e);
        if (alive) {
          setError("Unable to load businesses");
          onError?.("Unable to load businesses");
        }
      }
    })();

    return () => { alive = false; };
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

    const matches = allBusinesses.filter((b) =>
      (b?.name || "").toLowerCase().includes(value.toLowerCase())
    );

    setResults(matches);

    if (matches.length === 0) {
      setError("Business not found");
      onError?.("Business not found");
    }
  };

  const handleSelectResult = (result) => {
    setSelectedResult(result);
    setSearchTerm(result.name);  // ✅ keep name visible (feels better)
    setResults([]);
    setError("");
    onSelect?.(result);          // ✅ notify parent that a business is picked
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
          Business Name
        </label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0d4f4f] focus:ring-1 focus:ring-[#0d4f4f]/20"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white max-h-64 overflow-y-auto">
          {results.map((result) => (
            <button
              key={result.id}
              onClick={() => handleSelectResult(result)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
              type="button"
            >
              <p className="font-semibold text-[#0a1628] text-sm">{result.name}</p>
              <p className="text-gray-600 text-xs mt-0.5">
                {result.city ? `${result.city}, ` : ""}{result.country} · {result.category}
              </p>
            </button>
          ))}
        </div>
      )}

      {selectedResult && showSelectedPreview && (
        <div className="bg-[#0d4f4f]/5 border border-[#0d4f4f]/20 rounded-xl p-4">
          <p className="font-semibold text-[#0a1628] text-sm">{selectedResult.name}</p>
          <p className="text-gray-600 text-xs mt-1">
            {selectedResult.city ? `${selectedResult.city}, ` : ""}{selectedResult.country} · {selectedResult.category}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            You'll submit a claim request for admin review.
          </p>
        </div>
      )}
    </div>
  );
}
