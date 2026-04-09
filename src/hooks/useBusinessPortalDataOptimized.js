"use client";

import { useState, useEffect, useCallback } from "react";
import { getUserBusinesses } from "@/lib/supabase/queries/businesses";
import { formatUserData } from "@/utils/dataTransformers";

// Cache for 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;
const cache = new Map();

export function useBusinessPortalDataOptimized() {
  const [user, setUser] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [claims, setClaims] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [insightSnapshots, setInsightSnapshots] = useState([]);
  const [loading, setLoading] = useState(true);

  const refetchPortalData = useCallback(async (u = user) => {
    if (!u?.id) return;

    // Check cache first
    const cacheKey = `portal-data-${u.id}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setBusinesses(cached.businesses);
      setClaims(cached.claims);
      setProfiles(cached.profiles);
      setInsightSnapshots(cached.insightSnapshots);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();

      // Batch all queries for better performance
      const [businessesResult, claimsResult, profilesResult] = await Promise.all([
        getUserBusinesses(u.id),
        supabase
          .from("claim_requests")
          .select(`
            id, business_id, user_id, status, business_email, business_phone,
            role, created_at, claim_type, message,
            businesses:business_id (business_name)
          `)
          .eq("user_id", u.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("profiles")
          .select(`
            id, private_email, display_name, role, country, city, cultural_identity,
            languages_spoken, gdpr_consent, gdpr_consent_date, status, invited_by,
            invited_date, pending_business_id, pending_business_name
          `)
      ]);

      if (businessesResult.error) {
        console.error("Error fetching businesses:", businessesResult.error);
        throw businessesResult.error;
      }

      const data = {
        businesses: businessesResult.data || [],
        claims: claimsResult.data || [],
        profiles: profilesResult.data || [],
        insightSnapshots: []
      };

      // Cache the results
      cache.set(cacheKey, {
        ...data,
        timestamp: Date.now()
      });

      setBusinesses(data.businesses);
      setClaims(data.claims);
      setProfiles(data.profiles);
      setInsightSnapshots(data.insightSnapshots);

    } catch (error) {
      console.error("Error fetching portal data:", error);
      // Set empty state on error
      setBusinesses([]);
      setClaims([]);
      setProfiles([]);
      setInsightSnapshots([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const initializeData = async () => {
      try {
        const { getSupabase } = await import("@/lib/supabase/client");
        const supabase = getSupabase();

        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (authUser) {
          const userData = formatUserData(authUser);
          setUser(userData);
          await refetchPortalData(userData);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error initializing portal data:", error);
        setLoading(false);
      }
    };

    initializeData();
  }, [refetchPortalData]);

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
