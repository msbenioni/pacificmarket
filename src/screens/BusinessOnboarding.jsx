import { useState, useEffect } from "react";
import Link from "next/link";
import { createPageUrl } from "@/utils";
import { Search, Building2, MapPin, Star, ArrowRight, ArrowLeft, CheckCircle, User, Mail, Lock, AlertCircle } from "lucide-react";
import { pacificMarket } from "@/lib/pacificMarketClient";
import { BUSINESS_STATUS } from "@/constants/business";
import { getSupabase } from "@/lib/supabase/client";
import HeroRegistry from "@/components/shared/HeroRegistry";

export default function BusinessOnboarding() {
  const [step, setStep] = useState(1);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [path, setPath] = useState(""); // "claim" or "new"

  const [authMode, setAuthMode] = useState("signup"); // "signup" | "signin"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Preselect from URL: /BusinessOnboarding?business=<id>&name=<name>
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const businessId = urlParams.get("business");
    const businessName = urlParams.get("name");

    if (businessId && businessName) {
      setSelectedBusiness({ id: businessId, name: businessName });
      setPath("claim");
      setStep(3);
    }
  }, []);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      // Use Supabase's text search with ilike for case-insensitive partial matching
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('businesses')
        .select('id,name,city,country,shop_handle,owner_user_id,subscription_tier')
        .eq('status', BUSINESS_STATUS.ACTIVE)
        .ilike('name', `%${query}%`)
        .limit(20);
      
      if (error) throw error;
      setSearchResults(data || []);
    } catch (err) {
      console.error("Search error:", err);
      setSearchResults([]);
    }
  };

  // Step 1 → Step 2 (select business)
  const handleSelectBusiness = (biz) => {
    setSelectedBusiness(biz);
    setStep(2);
  };

  // Step 2: choose claim vs new
  const chooseClaim = () => {
    setPath("claim");
    setStep(3);
  };

  const chooseNew = () => {
    setSelectedBusiness(null);
    setPath("new");
    setStep(3);
  };

  const runAuth = async () => {
    if (authMode === "signin") {
      const { data, error } = await pacificMarket.auth.signIn(email, password);
      if (error) {
        console.error("Sign-in error:", error);
        // Handle specific auth errors
        if (error.message?.includes("Invalid login credentials")) {
          throw new Error("Invalid email or password. Try again or <a href=\"/BusinessLogin\" class=\"text-[#0d4f4f] hover:underline font-medium\">reset your password</a>.");
        }
        if (error.message?.includes("Email not confirmed")) {
          throw new Error("Please confirm your email address before signing in. Check your inbox for the confirmation link.");
        }
        throw error;
      }
      
      // For sign-in, user should be confirmed already
      if (!data.user?.email_confirmed_at) {
        throw new Error("Please confirm your email address before signing in. Check your inbox for the confirmation link.");
      }
      
      return data;
    }
    
    // Sign up flow
    const { data, error } = await pacificMarket.auth.signUp(email, password);
    if (error) {
      console.error("Sign-up error:", error);
      // Handle specific signup errors
      if (error.message?.includes("already registered")) {
        throw new Error(`This email is already registered. <a href="${createPageUrl("BusinessLogin")}" class="text-[#0d4f4f] hover:underline font-medium">Sign in here</a> instead.`);
      }
      if (error.message?.includes("User already registered")) {
        throw new Error(`This email is already registered. <a href="${createPageUrl("BusinessLogin")}" class="text-[#0d4f4f] hover:underline font-medium">Sign in here</a> instead.`);
      }
      
      // Handle 500 errors specifically
      if (error.status === 500) {
        console.error("500 error details:", error);
        // Check if it's the profile creation trigger error
        if (error.message?.includes("Database error saving new user")) {
          // The user account was created but the profile creation failed
          // This is a database configuration issue, but the user can still sign in
          throw new Error("✅ Your account was created successfully! There was a minor setup issue with your profile. <a href=\"/BusinessLogin\" class=\"text-[#0d4f4f] hover:underline font-medium\">Click here to sign in</a> and continue with your business claim.");
        }
        throw new Error("Server error during sign up. This might be a database configuration issue. Please try again or contact support.");
      }
      
      throw error;
    }
    
    // Check if user needs email confirmation
    if (!data.user?.email_confirmed_at) {
      // User needs to confirm email before proceeding
      const loginUrl = createPageUrl("BusinessLogin");
      throw new Error(`Please check your email and click the confirmation link. Once confirmed, <a href="${loginUrl}" class="text-[#0d4f4f] hover:underline font-medium">sign in here</a> to complete your business claim.`);
    }
    
    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const authData = await runAuth();
      const userId = authData?.user?.id;

      if (!userId) throw new Error("Could not verify your account. Please try again.");

      if (path === "claim") {
        if (!selectedBusiness?.id) throw new Error("No business selected to claim.");

        // Re-check business to ensure it is not already claimed (source of truth: owner_user_id)
        const fresh = await pacificMarket.entities.Business.filter(
          { id: selectedBusiness.id },
          "id,owner_user_id,name"
        );
        const freshBiz = fresh?.[0];

        if (!freshBiz) throw new Error("Business not found.");
        if (freshBiz.owner_user_id) throw new Error("This business is already claimed.");

        // Prevent duplicate pending claim for this business
        const existing = await pacificMarket.entities.ClaimRequest.filter({
          business_id: selectedBusiness.id,
          status: "pending",
        });

        if (existing?.length) {
          throw new Error("A claim for this listing is already under review. Please check your email or contact support.");
        }

        await pacificMarket.entities.ClaimRequest.create({
          business_id: selectedBusiness.id,
          user_id: userId,
          status: "pending",
          notes: "Self-serve claim via onboarding wizard",
        });

        setSuccess(true);
      } else {
        // New business submission path
        window.location.href = `${createPageUrl("ApplyListing")}?email=${encodeURIComponent(email)}`;
        return;
      }
    } catch (err) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    if (success) return <SuccessStep path={path} business={selectedBusiness} />;

    switch (step) {
      case 1:
        return (
          <SearchStep
            onSearch={handleSearch}
            results={searchResults}
            onSelect={handleSelectBusiness}
            onNew={chooseNew}
          />
        );
      case 2:
        return (
          <PathSelectStep
            business={selectedBusiness}
            onClaim={chooseClaim}
            onNew={chooseNew}
          />
        );
      case 3:
        return (
          <AuthStep
            path={path}
            business={selectedBusiness}
            authMode={authMode}
            setAuthMode={setAuthMode}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#f8f9fc]">
      {/* Hero - using shared component */}
      <HeroRegistry
        badge="Business Onboarding"
        title="Claim or Add Your Pacific Business"
        subtitle=""
        description="Represent your people, your island, and your journey — and help grow the global map of Pacific enterprise."
      />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {renderStep()}
      </div>
    </div>
  );
}

/* ---------- Step 1 ---------- */
function SearchStep({ onSearch, results, onSelect, onNew }) {
  const [query, setQuery] = useState("");

  const handleSearchChange = (value) => {
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="bg-white border border-gray-200/70 rounded-2xl shadow-[0_18px_50px_rgba(10,22,40,0.08)] p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-[#0d4f4f]/10 flex items-center justify-center mx-auto mb-4">
          <Search className="w-8 h-8 text-[#0d4f4f]" />
        </div>
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#0d4f4f]">Step 1</span>
          <div className="h-px w-8 bg-[#c9a84c]" />
        </div>
        <h2 className="text-2xl font-bold text-[#0a1628] mb-2">Find Your Business</h2>
        <p className="text-gray-600 max-w-lg mx-auto leading-relaxed">Search for your business to see if it's already in our registry</p>
      </div>

      <div className="max-w-xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Enter your business name..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/30 focus:border-[#0d4f4f]"
          />
        </div>
      </div>

      {query && (
        <div className="mt-6 space-y-3">
          {results.length > 0 ? (
            <>
              <p className="text-sm text-gray-500 text-center mb-4">Found {results.length} businesses</p>
              {results.map((business, index) => (
                <BusinessResultCard
                  key={business.id || `business-${index}`}
                  business={business}
                  onSelect={() => onSelect(business)}
                />
              ))}
            </>
          ) : (
            <div className="text-center py-8">
              <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">No businesses found matching "{query}"</p>
              <button
                onClick={onNew}
                className="inline-flex items-center gap-2 bg-[#0d4f4f] hover:bg-[#1a6b6b] text-white font-semibold px-6 py-3 rounded-xl transition-all"
              >
                <Building2 className="w-4 h-4" />
                Add my business to the registry
              </button>
            </div>
          )}
        </div>
      )}

      {!query && (
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-4">Don't see your business?</p>
          <button
            onClick={onNew}
            className="inline-flex items-center gap-2 text-[#0d4f4f] hover:text-[#1a6b6b] font-medium transition-colors"
          >
            Skip to add new business
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

function BusinessResultCard({ business, onSelect }) {
  const isClaimed = Boolean(business.owner_user_id);
  const tier = business.subscription_tier;

  return (
    <div className="bg-white border border-gray-200/70 rounded-2xl p-5 shadow-[0_12px_40px_rgba(10,22,40,0.07)] hover:shadow-[0_18px_50px_rgba(10,22,40,0.10)] transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-bold text-[#0a1628] text-sm mb-1">{business.name}</h3>
          <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
            <MapPin className="w-3 h-3" />
            {business.city ? `${business.city}, ` : ""}{business.country}
          </div>
          {tier === "featured_plus" && (
            <div className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-[#c9a84c]/20 text-[#c9a84c] font-medium">
              <Star className="w-3 h-3" />
              Featured+
            </div>
          )}
        </div>

        <button
          onClick={onSelect}
          disabled={isClaimed}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            isClaimed
              ? "bg-gray-100 text-gray-500 cursor-not-allowed"
              : "bg-[#0d4f4f] hover:bg-[#1a6b6b] text-white"
          }`}
        >
          {isClaimed ? "Already claimed" : "Select"}
        </button>
      </div>
    </div>
  );
}

/* ---------- Step 2 ---------- */
function PathSelectStep({ business, onClaim, onNew }) {
  return (
    <div className="bg-white border border-gray-200/70 rounded-2xl shadow-[0_18px_50px_rgba(10,22,40,0.08)] p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-[#0d4f4f]/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-[#0d4f4f]" />
        </div>
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#0d4f4f]">Step 2</span>
          <div className="h-px w-8 bg-[#c9a84c]" />
        </div>
        <h2 className="text-2xl font-bold text-[#0a1628] mb-2">Choose Your Path</h2>
        <p className="text-gray-600 max-w-lg mx-auto leading-relaxed">How would you like to proceed with {business?.name}?</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        <button
          onClick={onClaim}
          className="w-full text-left p-6 border-2 border-[#0d4f4f] rounded-xl hover:bg-[#0d4f4f]/5 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-[#0a1628] text-sm mb-1">Claim this listing</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Verify you own this business and take control of the existing listing</p>
            </div>
            <CheckCircle className="w-6 h-6 text-[#0d4f4f] group-hover:scale-110 transition-transform" />
          </div>
        </button>

        <button
          onClick={onNew}
          className="w-full text-left p-6 border border-gray-200 rounded-xl hover:border-[#0d4f4f]/50 hover:bg-gray-50 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-[#0a1628] text-sm mb-1">Add a different business</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Submit a new business that's not in our registry yet</p>
            </div>
            <Building2 className="w-6 h-6 text-gray-400 group-hover:scale-110 transition-transform" />
          </div>
        </button>
      </div>
    </div>
  );
}

/* ---------- Step 3 ---------- */
function AuthStep({
  path, business,
  authMode, setAuthMode,
  email, setEmail,
  password, setPassword,
  onSubmit, loading, error
}) {
  return (
    <div className="bg-white border border-gray-200/70 rounded-2xl shadow-[0_18px_50px_rgba(10,22,40,0.08)] p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-[#0d4f4f]/10 flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-[#0d4f4f]" />
        </div>
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#0d4f4f]">Step 3</span>
          <div className="h-px w-8 bg-[#c9a84c]" />
        </div>
        <h2 className="text-2xl font-bold text-[#0a1628] mb-2">
          {authMode === "signin" ? "Sign In" : "Create Your Account"}
        </h2>
        <p className="text-gray-600 max-w-lg mx-auto leading-relaxed">
          {path === "claim"
            ? `${authMode === "signin" ? "Sign in" : "Create an account"} to claim ${business?.name}` 
            : `${authMode === "signin" ? "Sign in" : "Create an account"} to submit your business` 
          }
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p 
            className="text-sm text-red-600" 
            dangerouslySetInnerHTML={{ __html: error }}
          />
        </div>
      )}

      <div className="max-w-md mx-auto mb-6 flex rounded-xl border border-gray-200 p-1">
        <button
          type="button"
          onClick={() => setAuthMode("signup")}
          className={`flex-1 py-2 text-sm font-semibold rounded-lg ${
            authMode === "signup" ? "bg-[#0d4f4f] text-white" : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          Create account
        </button>
        <button
          type="button"
          onClick={() => setAuthMode("signin")}
          className={`flex-1 py-2 text-sm font-semibold rounded-lg ${
            authMode === "signin" ? "bg-[#0d4f4f] text-white" : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          Sign in
        </button>
      </div>

      <form onSubmit={onSubmit} className="max-w-md mx-auto space-y-6">
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
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/30 focus:border-[#0d4f4f]"
              placeholder="Enter your password"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0d4f4f] hover:bg-[#1a6b6b] text-white font-semibold px-6 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? (authMode === "signin" ? "Signing in..." : "Creating account...")
            : (path === "claim" ? "Submit Claim Request" : "Continue to Submit Business")
          }
        </button>
      </form>

      <div className="text-center mt-6">
        <p className="text-xs text-gray-500">
          Tip: claiming is reviewed to protect Pacific businesses from impersonation.
        </p>
      </div>
    </div>
  );
}

/* ---------- Success ---------- */
function SuccessStep({ path, business }) {
  return (
    <div className="bg-white border border-gray-200/70 rounded-2xl shadow-[0_18px_50px_rgba(10,22,40,0.08)] p-8 text-center">
      <div className="w-20 h-20 rounded-2xl bg-[#0d4f4f]/10 flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-[#0d4f4f]" />
      </div>

      <div className="flex items-center justify-center gap-2 mb-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#c9a84c]">Complete</span>
        <div className="h-px w-8 bg-[#c9a84c]" />
      </div>

      <h2 className="text-2xl font-bold text-[#0a1628] mb-3">
        {path === "claim" ? "Ownership Request Received" : "Business Submitted for Review"}
      </h2>

      <p className="text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
        {path === "claim"
          ? `Your claim request for ${business?.name} has been submitted. We'll review it and email you the outcome.` 
          : "Your business has been submitted and is now under review. We'll notify you once it's approved."
        }
      </p>

      <div className="bg-[#0d4f4f]/5 rounded-xl p-4 mb-6 max-w-md mx-auto">
        <div className="flex items-center gap-2 text-sm text-[#0d4f4f] mb-2">
          <AlertCircle className="w-4 h-4" />
          <span className="font-semibold">What happens next?</span>
        </div>
        <ul className="text-sm text-gray-600 text-left space-y-1">
          <li>• Our team reviews your {path === "claim" ? "ownership claim" : "business submission"}</li>
          <li>• You'll receive an email with the decision</li>
          <li>• Once approved, you can manage your listing in your Business Portal</li>
        </ul>
      </div>

      <div className="space-y-3">
        <Link
          href={createPageUrl("BusinessPortal")}
          className="inline-flex items-center gap-2 bg-[#0d4f4f] hover:bg-[#1a6b6b] text-white font-semibold px-6 py-3 rounded-xl transition-all"
        >
          Go to Business Portal
          <ArrowRight className="w-4 h-4" />
        </Link>
        <div>
          <Link href={createPageUrl("Home")} className="text-sm text-gray-500 hover:text-[#0d4f4f] transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
