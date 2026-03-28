import { useState, useCallback, useEffect } from "react";
import { getAdminBusinesses } from "@/lib/supabase/queries/businesses";

/**
 * Hook for loading and managing admin dashboard data
 * Handles businesses and claims data loading
 */
export function useAdminDashboardData(user) {
  const [businesses, setBusinesses] = useState([]);
  const [claims, setClaims] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);

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

      setBusinesses(businessesRes.data || []);
      setClaims(claimsRes.data || []);
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
