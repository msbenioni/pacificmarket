'use client';

import { useState, useEffect, Suspense } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter, useSearchParams } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function CustomerPortalContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showManualSignup, setShowManualSignup] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [invitedProfile, setInvitedProfile] = useState(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [business, setBusiness] = useState(null);
  const searchParams = useSearchParams();
  const businessId = searchParams.get('business');

  useEffect(() => {
    if (!businessId) {
      setLoading(false);
      return;
    }

    checkInvitation();
  }, [businessId]);

  const checkInvitation = async () => {
    try {
      setErrorMessage("");
      // Get profile with pending business invitation
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('pending_business_id', businessId)
        .single();

      if (profileError || !profile) {
        console.error('Invitation not found:', profileError);
        setLoading(false);
        return;
      }

      // Get business details
      const { data: business, error: businessError } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', businessId)
        .single();

      if (businessError || !business) {
        console.error('Business not found:', businessError);
        setLoading(false);
        return;
      }

      setBusiness(business);
      setInvitedProfile({
        private_email: profile.private_email,
        display_name: profile.display_name,
        profileId: profile.id
      });

      // Check if user already has an auth account
      const { data: authUserData } = await supabase.auth.getUser();
      const currentUser = authUserData?.user ?? null;
      setAuthUser(currentUser);
      
      // Normalize emails for comparison
      const invitedEmail = profile.private_email?.trim().toLowerCase();
      const currentEmail = currentUser?.email?.trim().toLowerCase();
      
      if (currentUser && currentEmail === invitedEmail) {
        // User is already logged in, just set loading false to show accept button
        setLoading(false);
        return;
      }
      
      if (!invitedEmail || !invitedEmail.includes('@')) {
        // No valid email, show signup form
        setLoading(false);
        return;
      }
      
      // Valid email but user not signed in - show options, don't auto-send magic link
      setLoading(false);
    } catch (error) {
      console.error('Error checking invitation:', error);
      setLoading(false);
    }
  };

  const signInExistingUser = async (profile) => {
    try {
      setErrorMessage("");
      setSubmitting(true);
      // Always use production URL for email redirects
      const appUrl = process.env.NEXT_PUBLIC_APP_PROD_URL;

      // Generate magic link for existing user
      const { error } = await supabase.auth.signInWithOtp({
        email: profile.private_email,
        options: {
          emailRedirectTo: `${appUrl}/customer-portal?business=${businessId}`
        }
      });

      if (error) throw error;

      setMagicLinkSent(true);
    } catch (error) {
      console.error('Error signing in existing user:', error);
      setErrorMessage("We couldn't send the sign-in link. Please try again.");
      setSubmitting(false);
    }
  };

  const handleSignUp = async (email, password, fullName) => {
    try {
      setErrorMessage("");
      setSubmitting(true);

      // Create new user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (authError) throw authError;
      if (!authData?.user?.id) {
        throw new Error('Authentication failed - no user data returned');
      }

      // Update existing profile instead of creating new one
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          private_email: email,
          display_name: fullName,
          role: 'owner',
          status: 'active',
        })
        .eq('id', invitedProfile.profileId);

      if (profileError) throw profileError;

      // Update business owner status with stricter guard
      if (!authData?.user?.id) {
        throw new Error('Authentication failed - no user data returned');
      }
      
      await acceptInvitation({
        userId: authData.user.id,
        profileId: invitedProfile.profileId
      });

      // Redirect to business portal
      router.push('/business-portal');
    } catch (error) {
      console.error('Error signing up:', error);
      setErrorMessage("We couldn't create your account. Please try again.");
      setSubmitting(false);
    }
  };

  const acceptInvitation = async ({ userId, profileId }) => {
  // Update business to assign to new owner
  const { error: businessError } = await supabase
    .from('businesses')
    .update({
      owner_user_id: userId,
      claimed_at: new Date().toISOString(),
      claimed_by: userId,
      is_claimed: true,
      is_verified: true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', businessId);

  if (businessError) throw businessError;

  // Clear pending invitation from profile
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      pending_business_id: null,
      pending_business_name: null,
      invited_by: null,
      invited_date: null,
      status: 'active'
    })
    .eq('id', profileId);

  if (profileError) throw profileError;
};

  const handleAcceptInvitation = async () => {
    if (invitedProfile && authUser) {
      try {
        setErrorMessage("");
        setSubmitting(true);
        await acceptInvitation({ userId: authUser.id, profileId: invitedProfile.profileId });
        router.push('/business-portal');
      } catch (error) {
        console.error('Error accepting invitation:', error);
        setErrorMessage("We couldn't accept your invitation. Please try again.");
        setSubmitting(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0d4f4f] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invitation...</p>
        </div>
      </div>
    );
  }

  if (!business || !invitedProfile) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center">
        <div className="text-center bg-white border border-gray-100 rounded-2xl p-12 max-w-md">
          <h2 className="text-xl font-bold text-[#0a1628] mb-2">Invitation Not Found</h2>
          <p className="text-gray-500">This business invitation link is invalid or has expired.</p>
        </div>
      </div>
    );
  }

  if (magicLinkSent) {
    // Magic link has been sent, show check email message
    return (
      <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center">
        <div className="text-center bg-white border border-gray-100 rounded-2xl p-12 max-w-md">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-200 bg-white/90">
            <div className="w-7 h-7 bg-[#0d4f4f] rounded-full"></div>
          </div>
          <h2 className="text-xl font-bold text-[#0a1628] mb-2">Check Your Email</h2>
          <p className="text-gray-600 mb-6">
            We've sent a magic link to <strong>{invitedProfile.private_email}</strong>.
          </p>
          <p className="text-gray-500 text-sm">
            Click the link in the email to continue accepting the invitation for <strong>{business.business_name}</strong>.
          </p>
        </div>
      </div>
    );
  }

  // Show signup form for new users, accept button for authenticated users, or send magic link button
  const invitedEmail = invitedProfile?.private_email?.trim().toLowerCase() || "";
  const currentEmail = authUser?.email?.trim().toLowerCase() || "";
  const isSignedIn = currentEmail === invitedEmail;
  const hasValidEmail = invitedEmail.includes("@");
  
  return (
    <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center">
      <div className="text-center bg-white border border-gray-100 rounded-2xl p-12 max-w-md">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-200 bg-white/90">
          <div className="w-7 h-7 bg-[#0d4f4f] rounded-full"></div>
        </div>
        <h2 className="text-xl font-bold text-[#0a1628] mb-2">Business Invitation</h2>
        <p className="text-gray-600 mb-6">
          You've been invited to manage <strong>{business.business_name}</strong> on Pacific Discovery Network.
        </p>
        
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{errorMessage}</p>
          </div>
        )}
        
        {isSignedIn ? (
          <button
            onClick={handleAcceptInvitation}
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0d4f4f] px-6 py-3 text-sm font-bold text-white hover:bg-[#1a6b6b] transition disabled:opacity-50"
          >
            {submitting ? 'Accepting...' : 'Accept Invitation'}
          </button>
        ) : hasValidEmail && !showManualSignup ? (
          <div className="space-y-4">
            <button
              onClick={() => signInExistingUser(invitedProfile)}
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0d4f4f] px-6 py-3 text-sm font-bold text-white hover:bg-[#1a6b6b] transition disabled:opacity-50"
            >
              {submitting ? 'Sending...' : 'Send Sign-in Link'}
            </button>
            
            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowManualSignup(true)}
                className="text-xs text-[#0d4f4f] hover:underline"
              >
                Use a different email instead
              </button>
            </div>
            
            <p className="text-xs text-gray-500">
              We'll send a magic link to <strong>{invitedProfile.private_email}</strong>
            </p>
          </div>
        ) : hasValidEmail && showManualSignup ? (
          <SignUpForm 
            onSignUp={handleSignUp}
            defaultEmail=""
            defaultName=""
            submitting={submitting}
          />
        ) : (
          <SignUpForm 
            onSignUp={handleSignUp}
            defaultEmail={invitedProfile.private_email}
            defaultName={invitedProfile.display_name}
            submitting={submitting}
          />
        )}
      </div>
    </div>
  );
}

// Simple signup form component
function SignUpForm({ onSignUp, defaultEmail, defaultName, submitting }) {
  const [email, setEmail] = useState(defaultEmail || '');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState(defaultName || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !fullName) return;
    
    await onSignUp(email, password, fullName);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0d4f4f] focus:border-[#0d4f4f]"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0d4f4f] focus:border-[#0d4f4f]"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0d4f4f] focus:border-[#0d4f4f]"
          required
          minLength={6}
        />
      </div>
      
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-xl bg-[#0d4f4f] px-4 py-3 text-sm font-bold text-white hover:bg-[#1a6b6b] transition disabled:opacity-50"
      >
        {submitting ? 'Creating Account...' : 'Create Account & Accept Invitation'}
      </button>
    </form>
  );
}

export default function CustomerPortal() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#0d4f4f] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CustomerPortalContent />
    </Suspense>
  );
}
