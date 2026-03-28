"use client";

import { useEffect, useState } from "react";
import { Building2, ChevronDown } from "lucide-react";

/**
 * Referral dropdown component for business creation flow
 * Allows users to select a referring business from approved businesses
 */
export function ReferralDropdown({ value, onChange, disabled = false, excludeBusinessId = null }) {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadReferralBusinesses();
  }, []);

  const loadReferralBusinesses = async () => {
    setLoading(true);
    setError("");

    try {
      // Import dynamically to avoid SSR issues
      const { getReferralBusinesses } = await import("@/lib/supabase/queries/businesses");
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();

      const referralBusinesses = await getReferralBusinesses(supabase);
      
      // Filter out the current business if editing
      const filteredBusinesses = excludeBusinessId 
        ? referralBusinesses.filter(b => b.id !== excludeBusinessId)
        : referralBusinesses;

      setBusinesses(filteredBusinesses);
    } catch (err) {
      console.error("Error loading referral businesses:", err);
      if (err.message?.includes('column') || err.message?.includes('does not exist')) {
        setError("Referral system not yet available - please run database migration");
      } else {
        setError("Failed to load referral options");
      }
    } finally {
      setLoading(false);
    }
  };

  const selectedBusiness = businesses.find(b => b.id === value);

  return (
    <div className="space-y-2">
      <label htmlFor="referred_by_business_id" className="block text-sm font-medium text-gray-700">
        Who referred you?
      </label>
      
      <div className="relative">
        <select
          id="referred_by_business_id"
          value={value || ""}
          onChange={(e) => onChange(e.target.value ? e.target.value : null)}
          disabled={disabled || loading}
          className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0d4f4f] focus:border-transparent appearance-none bg-white"
        >
          <option value="">No referral</option>
          {businesses.map((business) => (
            <option key={business.id} value={business.id}>
              {business.business_name}
              {business.business_handle && ` (@${business.business_handle})`}
            </option>
          ))}
        </select>
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-[#0d4f4f]"></div>
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </div>

      <p className="text-xs text-gray-500">
        Optional — select the business that invited you to join Pacific Discovery Network.
      </p>

      {selectedBusiness && (
        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
          <Building2 className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            Referring business: {selectedBusiness.business_name}
            {selectedBusiness.business_handle && ` (@${selectedBusiness.business_handle})`}
          </span>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
