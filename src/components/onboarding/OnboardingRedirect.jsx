"use client";

import { useEffect } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useOnboardingStatus } from '../../hooks/useOnboardingStatus';

/**
 * Onboarding Redirect Component
 * Handles automatic redirects for onboarding flow
 * Place this in your root page or auth callback page
 */
export function OnboardingRedirect({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { onboardingStatus, loading } = useOnboardingStatus();

  useEffect(() => {
    // Only redirect if not loading and user is logged in
    if (!loading && onboardingStatus) {
      // If user is on root page and onboarding is incomplete, redirect to businessportal
      if (pathname === '/' && !onboardingStatus.isComplete) {
        router.replace('/businessportal');
        return;
      }
      
      // If user is logged in but on login/signup pages, redirect to businessportal
      if (['/login', '/signup'].includes(pathname)) {
        router.replace('/businessportal');
        return;
      }
    }
  }, [loading, onboardingStatus, pathname, router]);

  // Render children normally
  return children;
}

/**
 * Email Confirmation Redirect Handler
 * Handles redirect after Supabase email confirmation
 */
export function EmailConfirmationRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Check if this is an email confirmation callback
    const access_token = searchParams.get('access_token');
    const refresh_token = searchParams.get('refresh_token');
    const type = searchParams.get('type');
    
    if (type === 'signup' && access_token) {
      // Email confirmed, redirect to businessportal for onboarding
      router.replace('/businessportal');
    }
  }, [searchParams, router]);

  return null;
}
