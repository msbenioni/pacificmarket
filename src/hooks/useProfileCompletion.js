"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function useProfileCompletion(user) {
  const router = useRouter();
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);
  const [profileIncomplete, setProfileIncomplete] = useState(false);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    if (!user) {
      setIsCheckingProfile(false);
      return;
    }

    const checkProfileCompletion = async () => {
      try {
        const { getSupabase } = await import("@/lib/supabase/client");
        const supabase = getSupabase();

        // Fetch user's profile data
        const { data: profile, error } = await supabase
          .from("profiles")
          .select(`
            id,
            display_name,
            city,
            country,
            cultural_identity,
            languages_spoken,
            status
          `)
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          // If profile doesn't exist, redirect to settings
          if (error.code === 'PGRST116') {
            setProfileIncomplete(true);
          }
          setIsCheckingProfile(false);
          return;
        }

        setProfileData(profile);

        // Check if profile is complete
        const isComplete = 
          profile.display_name?.trim() !== "" &&
          profile.city?.trim() !== "" &&
          profile.country?.trim() !== "" &&
          profile.cultural_identity?.length > 0 &&
          profile.languages_spoken?.length > 0;

        if (!isComplete) {
          setProfileIncomplete(true);
          // Redirect to profile settings if not on that page
          const currentPath = window.location.pathname;
          if (!currentPath.includes('/profilesettings')) {
            router.replace('/ProfileSettings');
          }
        }

        setIsCheckingProfile(false);
      } catch (error) {
        console.error("Error checking profile completion:", error);
        setIsCheckingProfile(false);
      }
    };

    checkProfileCompletion();
  }, [user, router]);

  const getProfileCompletionStatus = () => {
    if (!profileData) return null;
    
    const completion = {
      displayName: !!profileData.display_name?.trim(),
      city: !!profileData.city?.trim(),
      country: !!profileData.country?.trim(),
      culturalIdentity: profileData.cultural_identity?.length > 0,
      languagesSpoken: profileData.languages_spoken?.length > 0,
    };

    const completedCount = Object.values(completion).filter(Boolean).length;
    const totalCount = Object.keys(completion).length;
    const isComplete = completedCount === totalCount;

    return {
      ...completion,
      completedCount,
      totalCount,
      isComplete,
      completionPercentage: Math.round((completedCount / totalCount) * 100)
    };
  };

  return {
    isCheckingProfile,
    profileIncomplete,
    profileData,
    getProfileCompletionStatus,
    isProfileComplete: !profileIncomplete && !isCheckingProfile
  };
}
