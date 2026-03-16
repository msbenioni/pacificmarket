"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, Building2, Gift } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import Layout from "@/components/layout/Layout";

export default function ReferralRegister() {
  const router = useRouter();
  const params = useParams();
  const { user, setUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [gdprConsent, setGdprConsent] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [referrerBusiness, setReferrerBusiness] = useState(null);

  const businessHandle = params['business-handle'];

  useEffect(() => {
    // Handle both string and array cases for business-handle parameter
    const handle = Array.isArray(businessHandle) ? businessHandle[0] : businessHandle;
    
    if (handle && typeof handle === 'string') {
      setReferralCode(handle);
      // Load referrer business info for display
      loadReferrerBusiness(handle);
    } else {
      // Show error if no valid business handle
      setError("Invalid referral link. Please check the URL and try again.");
    }
  }, [businessHandle]);

  const loadReferrerBusiness = async (handle) => {
    try {
      // Import getSupabase dynamically
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('businesses')
        .select('name, business_handle, city, country')
        .eq('business_handle', handle)
        .eq('status', 'active')
        .single();
      
      if (error) {
        setError(`Business not found: ${handle}. Please check the referral link.`);
        return;
      }
      
      if (data) {
        setReferrerBusiness(data);
      } else {
        setError(`Business not found: ${handle}. Please check the referral link.`);
      }
    } catch (error) {
      console.error('Error loading referrer business:', error);
      setError('Error loading referral information. Please try again later.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    if (!gdprConsent) {
      setError("Please consent to the processing of your personal data under GDPR.");
      setIsLoading(false);
      return;
    }

    try {
      // Import getSupabase dynamically
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();
      
      const result = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            display_name: name,
            gdpr_consent: gdprConsent,
            gdpr_consent_date: new Date().toISOString(),
            referral_code: referralCode
          }
        }
      });
      
      if (result.error) {
        if (result.error.message?.includes("User already registered")) {
          throw new Error("This email is already registered. <a href=\"/BusinessLogin\" class=\"text-[#0d4f4f] hover:underline font-medium\">Sign in here</a> instead.");
        }
        throw result.error;
      }

      setSuccess("✅ Account created! Please check your email for a confirmation link. After confirming, sign in to access your Business Portal where you can claim existing businesses or submit new listings.");
      
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout currentPageName="register">
      <div className="bg-[#f8f9fc] min-h-screen">
        {/* Hero with referral context */}
        <HeroStandard
          badge="Referral Invitation"
          title="Join Pacific Discovery Network"
          subtitle={referrerBusiness ? `You've been invited by ${referrerBusiness.name}` : "Create Your Account"}
          description={
            referrerBusiness 
              ? `${referrerBusiness.name} has invited you to join Pacific Discovery Network. After signing up, you'll be able to claim existing businesses or submit new listings.`
              : "Join Pacific Discovery Network. After email confirmation, you'll be able to claim existing businesses or submit new listings."
          }
        />

        {/* Referral Info Box */}
        {referrerBusiness && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
            <div className="bg-gradient-to-r from-[#c9a84c]/10 to-[#c9a84c]/5 border border-[#c9a84c]/30 rounded-2xl p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#c9a84c]/20 rounded-full">
                  <Gift className="w-6 h-6 text-[#c9a84c]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0a1628]">You've been invited!</h3>
                  <p className="text-sm text-gray-600">
                    {referrerBusiness.name} from {referrerBusiness.city}, {referrerBusiness.country} referred you to join Pacific Discovery Network.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Registration Form */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="max-w-md mx-auto">
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-sm text-red-600" dangerouslySetInnerHTML={{ __html: error }} />
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <p className="text-sm text-green-600">{success}</p>
                  </div>
                )}

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

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#0d4f4f] hover:bg-[#1a6b6b] text-white font-semibold px-6 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  Already have an account?{" "}
                  <Link href="/BusinessLogin" className="text-[#0d4f4f] hover:underline font-medium">
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
