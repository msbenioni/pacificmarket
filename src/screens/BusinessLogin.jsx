"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createPageUrl } from "@/utils";
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, Building2 } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import HeroStandard from "../components/shared/HeroStandard";

export default function BusinessLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, setUser } = useAuth(); // Fixed: get setUser from useAuth hook
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [gdprConsent, setGdprConsent] = useState(false);
  
  // Get initial mode from URL parameter
  const getInitialMode = () => {
    const modeParam = searchParams.get('mode');
    return modeParam === 'signup' ? 'signup' : 'signin';
  };
  
  // Check if this is a business claim flow
  const businessId = searchParams.get('business');
  const businessName = searchParams.get('name');
  const isClaimFlow = !!businessId;
  
  const [mode, setMode] = useState(getInitialMode());

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    setError("");
    setSuccess("");
    setGdprConsent(false); // Reset consent when switching modes
    setPassword("");
    setName(""); // Clear name field when switching modes
    
    // Update URL to reflect the mode change
    if (newMode === 'signin') {
      router.replace(createPageUrl("BusinessLogin"));
    } else {
      router.replace(`${createPageUrl("BusinessLogin")}?mode=signup`);
    }
  };

  // Re-read mode when URL changes
  useEffect(() => {
    const modeParam = searchParams.get('mode');
    const newMode = modeParam === 'signup' ? 'signup' : 'signin';
    setMode(newMode);
    
    // Also listen for popstate events (browser back/forward)
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const urlMode = urlParams.get('mode');
      setMode(urlMode === 'signup' ? 'signup' : 'signin');
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [searchParams]);

  const { navigateToLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    // GDPR consent validation for signup
    if (mode === "signup" && !gdprConsent) {
      setError("Please consent to the processing of your personal data under GDPR.");
      setIsLoading(false);
      return;
    }

    try {
      // Import getSupabase dynamically
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();
      let result;
      
      // Always use production URL for email redirects
      const appUrl = process.env.NEXT_PUBLIC_APP_PROD_URL || "https://pacificdiscoverynetwork.com";
      const signupRedirectUrl = process.env.NEXT_PUBLIC_SIGNUP_REDIRECT_URL || `${appUrl}/ProfileSettings`;
      
      if (mode === "signin") {
        // Sign in with Supabase
        result = await supabase.auth.signInWithPassword({
          email,
          password,
        });
      } else {
        // Sign up with Supabase
        result = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              display_name: name,
              gdpr_consent: gdprConsent,
              gdpr_consent_date: new Date().toISOString(),
            },
            emailRedirectTo: signupRedirectUrl
          }
        });
      }
      
      if (result.error) {
        // Handle specific auth errors
        if (result.error.message?.includes("User already registered")) {
          throw new Error("This email is already registered. Please sign in instead.");
        }
        if (result.error.message?.includes("user_already_registered")) {
          throw new Error("This email is already registered. Please sign in instead.");
        }
        if (result.error.message?.includes("duplicate")) {
          throw new Error("This email is already registered. Please sign in instead.");
        }
        throw result.error;
      }

      if (mode === "signin") {
        // Refresh user context and redirect immediately
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        setUser(currentUser);
        
        setSuccess("Login successful! Redirecting...");
        
        // Handle claim flow by redirecting to business portal with claim parameters
        if (isClaimFlow) {
          router.push(`${createPageUrl("BusinessPortal")}?claim=true&business=${businessId}&name=${encodeURIComponent(businessName || '')}`);
        } else {
          // Redirect to BusinessPortal (which will check profile completion and redirect to ProfileSettings if needed)
          router.push(createPageUrl("BusinessPortal"));
        }
      } else {
        // Check if this was a duplicate email (Supabase doesn't error but doesn't send email)
        if (result.data?.user && !result.data?.user?.identities?.length) {
          // User exists but no identities means duplicate email
          throw new Error("This email is already registered. Please sign in instead.");
        }
        
        // After successful signup, just show success message
        setSuccess("✅ Account created! Please check your email for a confirmation link. After confirming, sign in to access your Business Portal where you can claim existing businesses or submit new listings.");
        // Switch to signin mode after successful signup
        setMode("signin");
        setPassword("");
        setName(""); // Clear name field
        return; // Don't redirect yet - wait for email confirmation
      }

    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#f8f9fc] min-h-screen">
      {/* Hero - using shared component */}
      <HeroStandard
        badge={mode === "signin" ? "Business Login" : "Create Account"}
        title={mode === "signin" ? "Welcome Back" : "Create Your Account"}
        subtitle=""
        description={mode === "signin" 
          ? "Access your business dashboard and manage your Pacific Discovery Network listings." 
          : "Join Pacific Discovery Network. After email confirmation, you'll be able to claim existing businesses or submit new listings."
        }
      />

      {/* Login Form */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-sm text-green-600">{success}</p>
              </div>
            )}

            {/* Name field - only show for signup */}
            {mode === "signup" && (
              <div>
                <label className="block text-sm font-medium text-[#0a1628] mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/30 focus:border-[#0d4f4f]"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#0a1628] mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/30 focus:border-[#0d4f4f]"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0a1628] mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/30 focus:border-[#0d4f4f]"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* GDPR Consent - only show for signup */}
            {mode === "signup" && (
              <div className="bg-gray-50 p-4 rounded-xl">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={gdprConsent}
                    onChange={(e) => setGdprConsent(e.target.checked)}
                    className="mt-1 rounded border-gray-300 text-[#0d4f4f] focus:ring-[#0d4f4f]"
                    required
                  />
                  <span className="text-sm text-gray-600">
                    I consent to the processing of my personal data for the purpose of creating and managing my account. 
                    I understand that my data will be processed in accordance with the 
                    <a href="/Privacy" className="text-[#0d4f4f] hover:underline ml-1">Privacy Policy</a> and that I have 
                    the right to withdraw this consent at any time.
                  </span>
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0d4f4f] hover:bg-[#1a6b6b] text-white font-semibold px-6 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading 
                ? (mode === "signin" ? "Signing in..." : "Creating account...") 
                : (mode === "signin" ? "Sign In" : "Create Account")
              }
            </button>
          </form>

          {/* Mode Toggle */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              {mode === "signin" ? "Don't have an account?" : "Already have an account?"}
              {" "}
              <button
                type="button"
                onClick={() => handleModeSwitch(mode === "signin" ? "signup" : "signin")}
                className="text-[#0d4f4f] hover:underline font-medium"
              >
                {mode === "signin" ? "Create Account" : "Sign In"}
              </button>
            </p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
