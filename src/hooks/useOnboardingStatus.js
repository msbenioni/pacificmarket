import { useState, useEffect, useCallback, useMemo } from 'react';
import { getUserBusinesses } from '../lib/supabase/queries/businesses';
import { getBusinessWebsite } from '../lib/business/helpers';

/**
 * Hook to compute onboarding status and next actions
 * Provides a single source of truth for user onboarding progress
 */
export function useOnboardingStatus() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fetchOnboardingData = useCallback(async () => {
    if (!isMounted) return;

    try {
      setLoading(true);
      setError(null);

      // Import getSupabase for auth and profiles only
      const { getSupabase } = await import('../lib/supabase/client');
      const supabase = getSupabase();
      const { data: { user: userData } } = await supabase.auth.getUser();

      if (!userData) {
        setUser(null);
        setProfile(null);
        setBusinesses([]);
        setClaims([]);
        return;
      }

      setUser(userData);

      // Get user's businesses using shared query
      const { data: businessesData, error: businessesError } = await getUserBusinesses(userData.id);

      if (businessesError) {
        console.error("Error fetching businesses:", businessesError);
        throw businessesError;
      }

      const [profileResult, claimsResult] = await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .eq('id', userData.id)
          .single(),
        supabase
          .from('claim_requests')
          .select('*')
          .eq('user_id', userData.id),
      ]);

      if (profileResult.error && profileResult.error.code !== 'PGRST116') {
        throw profileResult.error;
      }

      setProfile(profileResult.data || null);
      setBusinesses(businessesData || []);
      setClaims(claimsResult.data || []);
    } catch (err) {
      console.error('Error fetching onboarding data:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [isMounted]);

  useEffect(() => {
    fetchOnboardingData();
  }, [fetchOnboardingData]);

  const onboardingStatus = useMemo(() => {
    const hasRequiredProfile = !!profile?.country;
    const hasOwnedBusinesses = businesses.length > 0;
    const hasClaims = claims.length > 0;
    const hasAnyBusiness = hasOwnedBusinesses || hasClaims;

    const incompleteBusinessProfiles = businesses.filter((business) =>
      !business.description ||
      !business.industry ||
      !business.year_founded ||
      !getBusinessWebsite(business)
    );

    let currentStep = 1;
    let nextAction = 'complete-profile';
    let isComplete = false;

    if (!hasRequiredProfile) {
      currentStep = 1;
      nextAction = 'complete-profile';
    } else if (!hasAnyBusiness) {
      currentStep = 2;
      nextAction = 'claim-or-add';
    } else if (incompleteBusinessProfiles.length > 0) {
      currentStep = 3;
      nextAction = 'complete-business-profiles';
    } else {
      currentStep = 3;
      nextAction = 'dashboard-ready';
      isComplete = true;
    }

    let completedSteps = 0;
    if (currentStep > 1) completedSteps = 1;
    if (currentStep > 2) completedSteps = 2;
    if (isComplete) completedSteps = 3;

    return {
      needsProfile: !hasRequiredProfile,
      profileProgress: {
        country: !!profile?.country,
        city: !!profile?.city,
        primary_cultural: !!profile?.primary_cultural,
        display_name: !!profile?.display_name,
        languages: Array.isArray(profile?.languages) && profile.languages.length > 0,
        years_operating: !!profile?.years_operating,
        market_region: !!profile?.market_region,
      },
      hasOwnedBusinesses,
      hasClaims,
      hasAnyBusiness,
      incompleteBusinessProfiles,
      totalSteps: 3,
      completedSteps,
      currentStep,
      nextAction,
      isComplete,
    };
  }, [profile, businesses, claims]);

  const getStepStatus = (stepNumber) => {
    if (stepNumber < onboardingStatus.currentStep) return 'completed';
    if (stepNumber === onboardingStatus.currentStep) return 'current';
    return 'locked';
  };

  const getStepTitle = (stepNumber) => {
    const titles = {
      1: 'Complete your profile',
      2: 'Claim or add your business',
      3: 'Finish business details',
    };
    return titles[stepNumber] || '';
  };

  const getStepDescription = (stepNumber) => {
    const descriptions = {
      1: 'Needed to claim a business',
      2: 'Get your business listed',
      3: 'Optional: Add photos & details',
    };
    return descriptions[stepNumber] || '';
  };

  if (!isMounted) {
    return {
      user: null,
      profile: null,
      businesses: [],
      claims: [],
      loading: true,
      error: null,
      onboardingStatus: {
        needsProfile: true,
        hasOwnedBusinesses: false,
        hasClaims: false,
        hasAnyBusiness: false,
        incompleteBusinessProfiles: [],
        totalSteps: 3,
        completedSteps: 0,
        currentStep: 1,
        nextAction: 'complete-profile',
        isComplete: false,
      },
      getStepStatus: () => 'locked',
      getStepTitle: () => '',
      getStepDescription: () => '',
      refetch: fetchOnboardingData,
    };
  }

  return {
    user,
    profile,
    businesses,
    claims,
    loading,
    error,
    onboardingStatus,
    getStepStatus,
    getStepTitle,
    getStepDescription,
    refetch: fetchOnboardingData,
  };
}
