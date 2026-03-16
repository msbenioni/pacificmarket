import { useState, useEffect } from "react";
import { getUserBusinesses } from "@/lib/supabase/queries/businesses";
import { formatUserData } from "@/utils/dataTransformers";

export function useBusinessPortalData() {
  const [user, setUser] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [claims, setClaims] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [insightSnapshots, setInsightSnapshots] = useState([]);
  const [loading, setLoading] = useState(true);

  const refetchPortalData = async (u = user) => {
    if (!u?.id) return;

    try {
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();

      const { data: businessesData, error: businessesError } = await getUserBusinesses(u.id);

      if (businessesError) {
        console.error("Error fetching businesses:", businessesError);
        throw businessesError;
      }

      const [claimsResult, profilesResult] = await Promise.all([
        supabase
          .from("claim_requests")
          .select(`
            id, business_id, user_id, status, contact_email, contact_phone,
            verification_documents, rejection_reason, reviewed_by, reviewed_at,
            business_name, user_email, role, proof_url, created_at
          `)
          .eq("user_id", u.id),
        supabase
          .from("profiles")
          .select(`
            id, email, display_name, role, country, city, primary_cultural,
            languages, gdpr_consent, gdpr_consent_date, status, invited_by,
            invited_date, pending_business_id, pending_business_name
          `),
      ]);

      setBusinesses(businessesData || []);
      setClaims(claimsResult.data || []);
      setProfiles(profilesResult.data || []);

      // No more insights snapshots since we consolidated to businesses table
      setInsightSnapshots([]);
    } catch (e) {
      console.error("Refetch portal data error:", e);
    }
  };

  const loadPortalData = async () => {
    try {
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();

      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !authUser) {
        setLoading(false);
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select(`
          id, email, display_name, role, country, city, primary_cultural,
          languages, gdpr_consent, gdpr_consent_date, status, invited_by,
          invited_date, pending_business_id, pending_business_name
        `)
        .eq("id", authUser.id)
        .single();

      const enhancedUser = formatUserData(authUser, profileData);
      setUser(enhancedUser);
      await refetchPortalData(enhancedUser);
    } catch (error) {
      console.error("Error loading portal data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortalData();
  }, []);

  return {
    user,
    businesses,
    claims,
    profiles,
    insightSnapshots,
    loading,
    refetchPortalData,
  };
}
