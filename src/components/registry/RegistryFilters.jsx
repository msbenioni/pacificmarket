import { Search, SlidersHorizontal, X } from "lucide-react";
import { useState, useEffect } from "react";
import { pacificMarket } from "@/lib/pacificMarketClient";
import { BUSINESS_STATUS } from "@/constants/business";
import { CATEGORIES } from "@/constants/businessProfile";
import { IDENTITIES } from "@/constants/profileOnboarding";

export default function RegistryFilters({ filters, onChange }) {
  const [countries, setCountries] = useState([]);
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    pacificMarket.entities.Business.filter({ status: BUSINESS_STATUS.ACTIVE }).then(data => {
      setBusinesses(data);
    });
  }, []);

  useEffect(() => {
    const uniqueCountries = [...new Set(businesses.map(b => b.country))].sort();
    setCountries(uniqueCountries);
  }, [businesses]);

  const set = (key, val) => onChange({ ...filters, [key]: val });
  const clear = () => onChange({ search: "", country: "", category: "", verified: false, identity: "" });
  const hasFilters = filters.country || filters.category || filters.verified || filters.identity;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#0d4f4f]" />
          <span className="font-semibold text-sm text-[#0a1628]">Filter Registry</span>
        </div>
        {hasFilters && (
          <button onClick={clear} className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors">
            <X className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={filters.search}
          onChange={e => set("search", e.target.value)}
          placeholder="Search businesses..."
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#0d4f4f] focus:ring-1 focus:ring-[#0d4f4f]/20"
        />
      </div>

      <div className="space-y-4">
        {/* Country */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Country</label>
          <select value={filters.country} onChange={e => set("country", e.target.value)}
            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#0d4f4f] bg-white">
            <option value="">All Countries</option>
            {countries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Industry</label>
          <select value={filters.category} onChange={e => set("category", e.target.value)}
            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#0d4f4f] bg-white">
            <option value="">All Industries</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Pacific Identity */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Pacific Identity</label>
          <select value={filters.identity} onChange={e => set("identity", e.target.value)}
            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#0d4f4f] bg-white">
            <option value="">All Identities</option>
            {IDENTITIES.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>

      </div>
    </div>
  );
}