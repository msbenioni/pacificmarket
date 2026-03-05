import { useState, useEffect } from 'react';
import { pacificMarket } from '../lib/pacificMarketClient';

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
  const [refreshKey, setRefreshKey] = useState(0);

  // Handle SSR/hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Don't run on server or before mount
    if (!isMounted) return;
    
    async function fetchOnboardingData() {
      try {
        setLoading(true);
        
        // Get authenticated user
        const userData = await pacificMarket.auth.me();
        if (!userData) {
          setLoading(false);
          return;
        }
        
        setUser(userData);

        // Fetch user profile using direct Supabase client
        const { getSupabase } = await import('../lib/supabase/client');
        const supabase = getSupabase();
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userData.id)
          .single();
        
        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }
        
        setProfile(profileData);

        // Fetch user's businesses
        const businessesData = await pacificMarket.entities.Business.filter({ owner_user_id: userData.id });
        setBusinesses(businessesData || []);

        // Fetch user's claim requests
        const claimsData = await pacificMarket.entities.ClaimRequest.filter({ user_id: userData.id });
        setClaims(claimsData || []);

      } catch (err) {
        console.error('Error fetching onboarding data:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchOnboardingData();
  }, [isMounted, refreshKey]);

  // Compute onboarding status
  const onboardingStatus = {
    // Step 1: Profile completeness
    needsProfile: !profile?.city || !profile?.country || !profile?.cultural_identity || !profile?.cultural_identity?.length,
    profileProgress: {
      city: !!profile?.city,
      country: !!profile?.country,
      cultural_identity: !!profile?.cultural_identity && profile?.cultural_identity?.length > 0,
      // Optional fields for progress tracking
      display_name: !!profile?.display_name,
      languages: !!profile?.languages && profile?.languages?.length > 0,
      years_operating: !!profile?.years_operating,
      business_role: !!profile?.business_role,
      market_region: !!profile?.market_region
    },
    
    // Step 2: Business ownership
    hasOwnedBusinesses: businesses.length > 0,
    hasClaims: claims.length > 0,
    hasAnyBusiness: businesses.length > 0 || claims.length > 0,
    
    // Step 3: Business profile completeness (optional)
    incompleteBusinessProfiles: businesses.filter(business => 
      !business.description || 
      !business.industry || 
      !business.year_founded ||
      !business.contact_website
    ),
    
    // Overall progress
    totalSteps: 3,
    completedSteps: 0,
    currentStep: 1,
    nextAction: null,
    isComplete: false
  };

  // Determine next action
  if (onboardingStatus.needsProfile) {
    onboardingStatus.nextAction = 'complete-profile';
    onboardingStatus.currentStep = 1;
  } else if (!onboardingStatus.hasAnyBusiness) {
    onboardingStatus.nextAction = 'claim-or-add';
    onboardingStatus.currentStep = 2;
  } else if (onboardingStatus.incompleteBusinessProfiles.length > 0) {
    onboardingStatus.nextAction = 'complete-business-profiles';
    onboardingStatus.currentStep = 3;
  } else {
    onboardingStatus.nextAction = 'dashboard-ready';
    onboardingStatus.currentStep = 3;
    onboardingStatus.isComplete = true;
  }

  // Calculate completed steps
  if (onboardingStatus.currentStep > 1) onboardingStatus.completedSteps = 1;
  if (onboardingStatus.currentStep > 2) onboardingStatus.completedSteps = 2;
  if (onboardingStatus.isComplete) onboardingStatus.completedSteps = 3;

  // Helper functions
  const getStepStatus = (stepNumber) => {
    if (stepNumber < onboardingStatus.currentStep) return 'completed';
    if (stepNumber === onboardingStatus.currentStep) return 'current';
    return 'locked';
  };

  const getStepTitle = (stepNumber) => {
    const titles = {
      1: 'Complete your profile',
      2: 'Claim or add your business',
      3: 'Finish business details'
    };
    return titles[stepNumber] || '';
  };

  const getStepDescription = (stepNumber) => {
    const descriptions = {
      1: 'Needed to claim a business',
      2: 'Get your business listed',
      3: 'Optional: Add photos & details'
    };
    return descriptions[stepNumber] || '';
  };

  // Return early if not mounted to prevent SSR issues
  if (!isMounted) {
    return {
      // Data
      user: null,
      profile: null,
      businesses: [],
      claims: [],
      loading: true,
      error: null,
      
      // Status
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
        isComplete: false
      },
      
      // Helpers
      getStepStatus: () => 'locked',
      getStepTitle: () => '',
      getStepDescription: () => '',
      
      // Actions
      refetch: () => setRefreshKey(k => k + 1)
    };
  }

  return {
    // Data
    user,
    profile,
    businesses,
    claims,
    loading,
    error,
    
    // Status
    onboardingStatus,
    
    // Helpers
    getStepStatus,
    getStepTitle,
    getStepDescription,
    
    // Actions
    refetch: () => setRefreshKey(k => k + 1)
  };
}
