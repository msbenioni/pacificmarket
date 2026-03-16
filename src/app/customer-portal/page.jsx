'use client';

import { useState, useEffect, Suspense } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter, useSearchParams } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function CustomerPortalContent() {
  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState(null);
  const [owner, setOwner] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();
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
      setOwner({
        email: profile.email,
        name: profile.full_name,
        profileId: profile.id
      });

      // Check if user already has an auth account
      const { data: authUser } = await supabase.auth.getUser();
      
      if (authUser.user && authUser.user.email === profile.email) {
        // User is already logged in, accept invitation
        await acceptInvitation(authUser.user.id);
        router.push('/business-portal');
      } else if (profile.id && !profile.email.includes('@')) {
        // Profile exists but no auth account, show signup form
        setUser(null);
        setLoading(false);
      } else {
        // Profile exists with email, try to sign them in
        await signInExistingUser(profile);
      }
    } catch (error) {
      console.error('Error checking invitation:', error);
      setLoading(false);
    }
  };

  const signInExistingUser = async (profile) => {
    try {
      // Always use production URL for email redirects
      const appUrl = process.env.NEXT_PUBLIC_APP_PROD_URL;

      // Generate magic link for existing user
      const { error } = await supabase.auth.signInWithOtp({
        email: profile.email,
        options: {
          emailRedirectTo: `${appUrl}/customer-portal?business=${businessId}&accept=true`
        }
      });

      if (error) throw error;

      setUser(profile);
      setLoading(false);
    } catch (error) {
      console.error('Error signing in existing user:', error);
      setLoading(false);
    }
  };

  const handleSignUp = async (email, password, fullName) => {
    try {
      setLoading(true);

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

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email,
          full_name: fullName,
        });

      if (profileError) throw profileError;

      // Update business owner status
      await acceptInvitation(authData.user.id);

      // Redirect to business portal
      router.push('/business-portal');
    } catch (error) {
      console.error('Error signing up:', error);
      setLoading(false);
    }
  };

  const acceptInvitation = async (userId) => {
    try {
      // Update business to assign to new owner
      const { error } = await supabase
        .from('businesses')
        .update({
          owner_user_id: userId,
        })
        .eq('id', businessId);

      if (error) throw error;

      // Clear pending invitation from profile
      await supabase
        .from('profiles')
        .update({
          pending_business_id: null,
          pending_business_name: null,
          invited_by: null,
          invited_date: null,
          status: 'active'
        })
        .eq('id', owner.profileId || userId);
    } catch (error) {
      console.error('Error accepting invitation:', error);
    }
  };

  const handleAcceptInvitation = async () => {
    if (user) {
      await acceptInvitation(user.id);
      router.push('/business-portal');
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

  if (!business || !owner) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center">
        <div className="text-center bg-white border border-gray-100 rounded-2xl p-12 max-w-md">
          <h2 className="text-xl font-bold text-[#0a1628] mb-2">Invitation Not Found</h2>
          <p className="text-gray-500">This business invitation link is invalid or has expired.</p>
        </div>
      </div>
    );
  }

  if (user) {
    // User is signed in, show accept invitation
    return (
      <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center">
        <div className="text-center bg-white border border-gray-100 rounded-2xl p-12 max-w-md">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-200 bg-white/90">
            <div className="w-7 h-7 bg-[#0d4f4f] rounded-full"></div>
          </div>
          <h2 className="text-xl font-bold text-[#0a1628] mb-2">Business Invitation</h2>
          <p className="text-gray-600 mb-6">
            You've been invited to manage <strong>{business.name}</strong> on Pacific Discovery Network.
          </p>
          <button
            onClick={handleAcceptInvitation}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0d4f4f] px-6 py-3 text-sm font-bold text-white hover:bg-[#1a6b6b] transition"
          >
            Accept Invitation
          </button>
        </div>
      </div>
    );
  }

  // Show signup form for new users
  return (
    <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center bg-white border border-gray-100 rounded-2xl p-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-200 bg-white/90">
            <div className="w-7 h-7 bg-[#0d4f4f] rounded-full"></div>
          </div>
          <h2 className="text-xl font-bold text-[#0a1628] mb-2">Join Pacific Discovery Network</h2>
          <p className="text-gray-600 mb-6">
            Create an account to manage <strong>{business.name}</strong>
          </p>
          
          <SignUpForm 
            onSignUp={handleSignUp}
            defaultEmail={owner.email}
            defaultName={owner.name}
          />
        </div>
      </div>
    </div>
  );
}

// Simple signup form component
function SignUpForm({ onSignUp, defaultEmail, defaultName }) {
  const [email, setEmail] = useState(defaultEmail || '');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState(defaultName || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !fullName) return;
    
    setLoading(true);
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
        disabled={loading}
        className="w-full rounded-xl bg-[#0d4f4f] px-4 py-3 text-sm font-bold text-white hover:bg-[#1a6b6b] transition disabled:opacity-50"
      >
        {loading ? 'Creating Account...' : 'Create Account & Accept Invitation'}
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
