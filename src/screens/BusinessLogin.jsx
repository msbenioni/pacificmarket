import { useState } from "react";
import Link from "next/link";
import { createPageUrl } from "@/utils";
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, Building2 } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { pacificMarket } from "@/lib/pacificMarketClient";

export default function BusinessLogin() {
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
      const { data, error: signInError } = await pacificMarket.auth.signIn(email, password);
      
      if (signInError) {
        throw signInError;
      }

      setSuccess("Login successful! Redirecting...");
      
      // Redirect to business portal after successful login
      setTimeout(() => {
        window.location.href = createPageUrl("BusinessPortal");
      }, 1500);

    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href={createPageUrl("Home")} className="flex items-center gap-3 group">
            <img src="/pm_logo.png" alt="Pacific Market Registry" className="h-12 w-12" />
            <div className="flex flex-col items-center leading-none text-center">
              <span className="text-lg font-bold tracking-[0.35em] text-[#0a1628]" style={{ fontFamily: "'Cinzel', serif" }}>
                PACIFIC
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="h-px w-6 bg-[#c9a84c]" />
                <span className="text-[#c9a84c] text-[0.65rem] font-bold tracking-[0.45em]" style={{ fontFamily: "'Cinzel', serif" }}>
                  MARKET
                </span>
                <span className="h-px w-6 bg-[#c9a84c]" />
              </div>
            </div>
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-[0_12px_40px_rgba(10,22,40,0.08)] p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#0d4f4f]/10 mx-auto mb-4">
              <User className="w-6 h-6 text-[#0d4f4f]" />
            </div>
            <h2 className="text-2xl font-bold text-[#0a1628] mb-2">Business Login</h2>
            <p className="text-gray-600 text-sm">Access your business dashboard and manage your listings</p>
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
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
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

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#0a1628] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
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
              className="w-full flex items-center justify-center gap-2 bg-[#0d4f4f] hover:bg-[#1a6b6b] text-white font-semibold px-6 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign In"}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 space-y-4">
            <div className="text-center">
              <Link href={createPageUrl("ApplyListing")} className="text-sm text-[#0d4f4f] hover:underline">
                Don't have an account? Apply for a listing
              </Link>
            </div>
            
            <div className="flex items-center justify-center gap-4 text-sm">
              <Link href={createPageUrl("AdminLogin")} className="text-gray-500 hover:text-[#0d4f4f] transition-colors">
                Admin Login
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
  );
}
