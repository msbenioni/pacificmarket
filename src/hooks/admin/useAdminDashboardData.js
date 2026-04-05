import { getAdminBusinesses } from "@/lib/supabase/queries/businesses";
import { useCallback, useEffect, useState } from "react";

/**
 * Hook for loading and managing admin dashboard data
 * Handles businesses and claims data loading
 */
export function useAdminDashboardData(user) {
  const [businesses, setBusinesses] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = sessionStorage.getItem('admin-businesses');
        return cached ? JSON.parse(cached) : [];
      } catch { return []; }
    }
    return [];
  });
  const [claims, setClaims] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = sessionStorage.getItem('admin-claims');
        return cached ? JSON.parse(cached) : [];
      } catch { return []; }
    }
    return [];
  });
  const [dashboardLoading, setDashboardLoading] = useState(() => {
    if (typeof window !== 'undefined') {
      return !sessionStorage.getItem('admin-businesses');
    }
    return true;
  });

  /**
   * Load admin dashboard data from the database
   */
  const loadAdminData = useCallback(async () => {
    if (!user) {
      console.log("📋 loadAdminData called without user, skipping");
      return;
    }

    console.log("📋 Loading admin dashboard data...");
    setDashboardLoading(true);

    try {
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();

      const [businessesRes, claimsRes] = await Promise.all([
        getAdminBusinesses({
          limit: 500,
          status: ["active", "pending", "rejected"],
        }),
        supabase
          .from("claim_requests")
          .select(`
            id, business_id, user_id, status, business_email, business_phone,
            role, created_at, claim_type, message,
            reviewed_by, reviewed_at
          `)
          .order("created_at", { ascending: false }),
      ]);

      if (businessesRes.error) {
        console.error("❌ Businesses query failed:", businessesRes.error);
        throw new Error(`Businesses query failed: ${businessesRes.error.message}`);
      }
      if (claimsRes.error) {
        console.error("❌ Claims query failed:", claimsRes.error);
        throw new Error(`Claims query failed: ${claimsRes.error.message}`);
      }

      console.log("✅ Data loaded successfully:", {
        businessesCount: businessesRes.data?.length || 0,
        claimsCount: claimsRes.data?.length || 0
      });

      const bizData = businessesRes.data || [];
      const claimsData = claimsRes.data || [];
      setBusinesses(bizData);
      setClaims(claimsData);
      if (typeof window !== 'undefined') {
        try {
          sessionStorage.setItem('admin-businesses', JSON.stringify(bizData));
          sessionStorage.setItem('admin-claims', JSON.stringify(claimsData));
        } catch { /* sessionStorage full — ignore */ }
      }
    } catch (error) {
      console.error("❌ Error loading admin data:", error);
      throw error; // Re-throw to let calling components handle the error
    } finally {
      setDashboardLoading(false);
    }
  }, [user]);

  // Auto-load data when user is available
  useEffect(() => {
    if (user) {
      loadAdminData();
    } else {
      setDashboardLoading(false);
    }
  }, [user, loadAdminData]);

  return {
    businesses,
    setBusinesses,
    claims,
    setClaims,
    dashboardLoading,
    loadAdminData,
  };
}
