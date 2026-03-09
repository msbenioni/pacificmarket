import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createPageUrl } from "@/utils";
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, Building2 } from "lucide-react";
import { getSupabase } from "@/lib/supabase/client";
import { useAuth } from "@/lib/AuthContext";
import HeroRegistry from "@/components/shared/HeroRegistry";

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
  const [referralCode, setReferralCode] = useState("");
  
  // Get initial mode from URL parameter
  const getInitialMode = () => {
    const modeParam = searchParams.get('mode');
    return modeParam === 'signup' ? 'signup' : 'signin';
  };
  
  const [mode, setMode] = useState(getInitialMode());

  // Capture referral code from URL on component mount
  useEffect(() => {
    const refParam = searchParams.get('ref');
    if (refParam) {
      setReferralCode(refParam);
    }
  }, [searchParams]);

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

  // Helper function to ensure user has a profile record
  const ensureProfileExists = async (user) => {
    if (!user?.id) return;
    
    try {
      const supabase = getSupabase();
      
      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();
      
      // If no profile exists, create one
      if (!existingProfile) {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            display_name: user.user_metadata?.display_name || user.user_metadata?.full_name || user.email?.split('@')[0],
            role: 'owner', // Default role for business users
            status: 'active',
            gdpr_consent: user.user_metadata?.gdpr_consent || false,
            gdpr_consent_date: user.user_metadata?.gdpr_consent_date || null,
          });
        
        if (insertError) {
          console.error('Error creating profile:', insertError);
          // Don't throw error - login should still work
        }
      }
    } catch (error) {
      console.error('Error ensuring profile exists:', error);
      // Don't throw error - login should still work
    }
  };

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
      const supabase = getSupabase();
      let result;
      
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
              referral_code: referralCode // Store referral code for later use
            }
          }
        });
      }
      
      if (result.error) {
        // Handle specific auth errors
        if (result.error.message?.includes("User already registered")) {
          throw new Error("This email is already registered. <a href=\"/BusinessLogin\" class=\"text-[#0d4f4f] hover:underline font-medium\">Sign in here</a> instead.");
        }
        if (result.error.message?.includes("user_already_registered")) {
          throw new Error("This email is already registered. <a href=\"/BusinessLogin\" class=\"text-[#0d4f4f] hover:underline font-medium\">Sign in here</a> instead.");
        }
        if (result.error.message?.includes("duplicate")) {
          throw new Error("This email is already registered. <a href=\"/BusinessLogin\" class=\"text-[#0d4f4f] hover:underline font-medium\">Sign in here</a> instead.");
        }
        throw result.error;
      }

      if (mode === "signin") {
        // Refresh user context and redirect immediately
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        setUser(currentUser);
        
        // Ensure profile exists for signin
        if (currentUser) {
          await ensureProfileExists(currentUser);
        }
        
        setSuccess("Login successful! Redirecting...");
        router.push(createPageUrl("BusinessPortal"));
      } else {
        // Create profile record after successful signup
        if (result.data?.user) {
          await ensureProfileExists(result.data.user);
        }
        
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
      <HeroRegistry
        badge={mode === "signin" ? "Business Login" : "Create Account"}
        title={mode === "signin" ? "Welcome Back" : "Create Your Account"}
        subtitle=""
        description={mode === "signin" 
          ? "Access your business dashboard and manage your Pacific Market listings." 
          : "Join Pacific Market. After email confirmation, you'll be able to claim existing businesses or submit new listings."
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
