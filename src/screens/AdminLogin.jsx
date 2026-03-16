import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield, AlertCircle, AlertTriangle } from "lucide-react";
import { createPageUrl } from "@/utils";
import HeroStandard from "@/components/shared/HeroStandard";
import PortalShell from "@/components/portal/PortalShell";
import { useAuth } from "@/lib/AuthContext";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { navigateToLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // Sign in with Supabase
      // Import getSupabase dynamically
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (signInError) {
        throw signInError;
      }

      // Verify admin role by checking profiles table
      const user = data?.user;
      if (!user) {
        throw new Error("Access denied. Admin privileges required.");
      }
      
      // Check if user has admin role in profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (profileError || !profileData || profileData.role !== 'admin') {
        throw new Error("Access denied. Admin privileges required.");
      }

      setSuccess("Admin login successful! Redirecting...");
      
      // Redirect to admin dashboard after successful login
      setTimeout(() => {
        router.push(createPageUrl("AdminDashboard"));
      }, 1500);

    } catch (err) {
      setError(err.message || "Invalid admin credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PortalShell>
      <div className="min-h-screen bg-[#f8f9fc] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-[0_12px_40px_rgba(10,22,40,0.08)] p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-red-50 border border-red-200 mx-auto mb-4">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#0a1628] mb-2">Admin Login</h2>
            <p className="text-gray-600 text-sm">Access the administrative dashboard</p>
          </div>

          {/* Security Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">Authorized Access Only</p>
                <p className="text-xs text-amber-700 mt-1">
                  This area is restricted to authorized administrators. Unauthorized access attempts will be logged.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
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

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#0a1628] mb-2">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500"
                  placeholder="Enter admin email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#0a1628] mb-2">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500"
                  placeholder="Enter admin password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Authenticating..." : "Access Admin Dashboard"}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 space-y-4">
            <div className="text-center">
              <Link href={createPageUrl("BusinessLogin")} className="text-sm text-red-600 hover:underline">
                Business Login
              </Link>
            </div>
            
            <div className="flex items-center justify-center gap-4 text-sm">
              <Link href={createPageUrl("Home")} className="text-gray-500 hover:text-[#0d4f4f] transition-colors">
                Back to Home
              </Link>
              <span className="text-gray-300">•</span>
              <Link href={createPageUrl("Help")} className="text-gray-500 hover:text-[#0d4f4f] transition-colors">
                Need Help?
              </Link>
                </div>
              </div>
            </div>
          </div>
</div>
    </PortalShell>
  );
}