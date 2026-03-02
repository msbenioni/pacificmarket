import { useState, useEffect } from "react";
import { pacificMarket } from "@/lib/pacificMarketClient";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { CheckCircle, ChevronRight, ChevronLeft, AlertCircle } from "lucide-react";
import { COUNTRIES, CATEGORIES, IDENTITIES } from "@/components/formConstants";
import CulturalIdentitySelect from "@/components/shared/CulturalIdentitySelect";
import HeroRegistry from "@/components/shared/HeroRegistry";

const SIMPLE_STEPS = [
  { id: 1, label: "Business Info" },
  { id: 2, label: "Details" },
  { id: 3, label: "Review & Submit" },
];

export default function ApplyListing() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    name: "", handle: "", country: "", city: "", category: "",
    email: "", contact_email: "", phone: "", contact_phone: "", tagline: "", description: "", cultural_identity: "",
    website: "", instagram: "", facebook: "", tiktok: "", linkedin: ""
  });
  const [signupForm, setSignupForm] = useState({ password: "", confirmPassword: "" });
  const [showAccountPrompt, setShowAccountPrompt] = useState(false);
  const [handleError, setHandleError] = useState("");
  const [signupError, setSignupError] = useState("");

  useEffect(() => {
    pacificMarket.auth.me().then(u => {
      if (!u) return;
      setUser(u);
    }).catch(() => {});
  }, []);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const generateHandleFromName = async (name) => {
    if (!name) return;
    let baseHandle = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    let finalHandle = baseHandle;
    let counter = 1;

    // Check if handle exists in database
    while (true) {
      const existing = await pacificMarket.entities.Business.filter({ handle: finalHandle });
      if (existing.length === 0) break;
      finalHandle = `${baseHandle}-${counter}`;
      counter++;
    }

    set("handle", finalHandle);
    setHandleError("");
  };

  const handleNameChange = (value) => {
    set("name", value);
    if (value) generateHandleFromName(value);
  };

  const handleCreateAccount = async () => {
    setSignupError("");
    
    if (!signupForm.password || !signupForm.confirmPassword) {
      setSignupError("Please enter and confirm your password");
      return;
    }
    
    if (signupForm.password !== signupForm.confirmPassword) {
      setSignupError("Passwords do not match");
      return;
    }
    
    if (signupForm.password.length < 6) {
      setSignupError("Password must be at least 6 characters");
      return;
    }

    setSubmitting(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: signupForm.password,
      });

      if (error) {
        setSignupError(error.message || "Failed to create account");
        setSubmitting(false);
        return;
      }

      await pacificMarket.entities.Business.create({
        name: form.name,
        handle: form.handle,
        country: form.country,
        city: form.city,
        category: form.category,
        tagline: form.tagline,
        description: form.description,
        cultural_identity: form.cultural_identity,
        contact_email: form.contact_email,
        phone: form.phone,
        contact_phone: form.contact_phone,
        website: form.website,
        instagram: form.instagram,
        facebook: form.facebook,
        tiktok: form.tiktok,
        linkedin: form.linkedin,
        status: "pending",
        tier: "free",
        owner_user_id: data?.user?.id ?? null,
      });

      setUser(data?.user ?? null);
      setSubmitted(true);
    } catch (error) {
      setSignupError(error.message || "An error occurred");
    }
    setSubmitting(false);
  };

  const handleSubmit = async () => {
    if (!user) {
      setShowAccountPrompt(true);
      return;
    }
  };

  const [step, setStep] = useState(1);

  if (showAccountPrompt) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white border border-gray-100 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-[#0a1628] mb-1">Create Your Account</h2>
            <p className="text-gray-500 text-sm mb-6">Sign up to manage your business and access your dashboard.</p>
            
            {signupError && (
              <div className="flex items-center gap-2 bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">
                <AlertCircle className="w-4 h-4" /> {signupError}
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
                <input type="email" value={form.email} disabled className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 cursor-not-allowed" />
                <p className="text-xs text-gray-400 mt-1">From your business information</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Password *</label>
                <input type="password" value={signupForm.password} onChange={e => setSignupForm(f => ({ ...f, password: e.target.value }))} placeholder="At least 6 characters" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0d4f4f] focus:ring-1 focus:ring-[#0d4f4f]/20" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Confirm Password *</label>
                <input type="password" value={signupForm.confirmPassword} onChange={e => setSignupForm(f => ({ ...f, confirmPassword: e.target.value }))} placeholder="Confirm password" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0d4f4f] focus:ring-1 focus:ring-[#0d4f4f]/20" />
              </div>
            </div>

            <button onClick={handleCreateAccount} disabled={submitting} className="w-full logo-gradient hover:logo-gradient-hover disabled:opacity-40 text-white font-bold py-3 rounded-xl transition-all mb-3">
              {submitting ? "Creating Account..." : "Create Account & Submit"}
            </button>
            <button onClick={() => { setShowAccountPrompt(false); setStep(1); setSignupError(""); }} className="w-full border border-gray-200 text-gray-600 font-medium py-2.5 rounded-xl hover:bg-gray-50">
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-[#0d4f4f]/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-[#0d4f4f]" />
          </div>
          <h2 className="text-2xl font-bold text-[#0a1628] mb-3">Welcome to Pacific Market Registry</h2>
          <p className="text-gray-500 mb-2">Your account has been created and your business listing is submitted.</p>
          <p className="text-gray-400 text-sm mb-8">Visit your customer portal to view your pending business, update details, or upgrade your tier while awaiting approval.</p>
          <div className="bg-white border border-gray-100 rounded-2xl p-5 text-left text-sm space-y-2 text-gray-500 mb-6">
            <div className="flex justify-between"><span>Status</span><span className="font-semibold text-yellow-600">Pending Review</span></div>
            <div className="flex justify-between"><span>Business</span><span className="font-semibold text-[#0a1628]">{form.name}</span></div>
            <div className="flex justify-between"><span>Email</span><span className="font-semibold text-[#0a1628]">{form.email}</span></div>
          </div>
          <a href="/CustomerPortal" className="w-full logo-gradient hover:logo-gradient-hover text-white font-bold py-3 rounded-xl transition-all inline-block text-center">
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0d4f4f] focus:ring-1 focus:ring-[#0d4f4f]/20 bg-white";
  const labelCls = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      {/* Header */}
      <HeroRegistry
        badge="Registry Application"
        title="Submit a Business"
        subtitle=""
        description="Complete all sections to submit your application for registry review."
      />

      {/* Progress */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {SIMPLE_STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center gap-1 flex-shrink-0">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  step === s.id ? "bg-[#0a1628] text-white"
                  : step > s.id ? "bg-[#0d4f4f]/10 text-[#0d4f4f]"
                  : "text-gray-400"
                }`}>
                  {step > s.id ? <CheckCircle className="w-3 h-3" /> : <span>{s.id}</span>}
                  <span className="hidden sm:block">{s.label}</span>
                </div>
                {i < SIMPLE_STEPS.length - 1 && <ChevronRight className="w-3 h-3 text-gray-300 flex-shrink-0" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8">

          {/* Step 1: Basic Business Info */}
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="font-bold text-[#0a1628] text-lg mb-1">Business Information</h2>
                <p className="text-gray-400 text-sm mb-6">Essential details to get your listing live. You can add more later in your portal.</p>
                <div>
                   <label className={labelCls}>Business Name *</label>
                   <input value={form.name} onChange={e => handleNameChange(e.target.value)} placeholder="e.g. Tala Pacific Consulting" className={inputCls} />
                 </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Country *</label>
                    <select value={form.country} onChange={e => set("country", e.target.value)} className={inputCls}>
                      <option value="">Select country</option>
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>City</label>
                    <input value={form.city} onChange={e => set("city", e.target.value)} placeholder="e.g. Auckland" className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Industry Category *</label>
                  <select value={form.category} onChange={e => set("category", e.target.value)} className={inputCls}>
                    <option value="">Select category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                </div>
                )}

          {/* Step 2: Contact & Description */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="font-bold text-[#0a1628] text-lg mb-1">Contact & Description</h2>
              <p className="text-gray-400 text-sm mb-6">Help customers reach you and describe your business.</p>
              <div>
                <label className={labelCls}>Account Email (Login) *</label>
                <input value={form.email} onChange={e => set("email", e.target.value)} type="email" placeholder="your.email@example.com" className={inputCls} />
                <p className="text-xs text-gray-400 mt-1">Used to log in to your account</p>
              </div>
              <div>
                <label className={labelCls}>Business Email (Public) *</label>
                <input value={form.contact_email} onChange={e => set("contact_email", e.target.value)} type="email" placeholder="hello@business.com" className={inputCls} />
                <p className="text-xs text-gray-400 mt-1">Shown on your public profile for customer inquiries</p>
              </div>
              <div>
                <label className={labelCls}>Account Phone</label>
                <input value={form.phone} onChange={e => set("phone", e.target.value)} type="tel" placeholder="+64 9 000 0000" className={inputCls} />
                <p className="text-xs text-gray-400 mt-1">Used to log in to your account</p>
              </div>
              <div>
                <label className={labelCls}>Business Phone (Public)</label>
                <input value={form.contact_phone} onChange={e => set("contact_phone", e.target.value)} type="tel" placeholder="+64 9 000 0000" className={inputCls} />
                <p className="text-xs text-gray-400 mt-1">Shown on your public profile for customer inquiries</p>
              </div>
              <div>
                <label className={labelCls}>Tagline (max 160 chars) *</label>
                <input value={form.tagline} onChange={e => set("tagline", e.target.value)} maxLength={160} placeholder="One-line description of your business" className={inputCls} />
                <p className="text-xs text-gray-400 mt-1">{form.tagline.length}/160</p>
              </div>
              <div>
                <label className={labelCls}>Description</label>
                <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={5} placeholder="Describe your products or services, your story, and your connection to the Pacific community..." className={`${inputCls} resize-none`} />
              </div>
              <div>
                <CulturalIdentitySelect
                  value={form.cultural_identity}
                  onChange={(value) => setForm(f => ({ ...f, cultural_identity: value }))}
                  required={true}
                />
              </div>
              <div>
                <label className={labelCls}>Website</label>
                <input type="url" value={form.website} onChange={e => set("website", e.target.value)} placeholder="https://yourbusiness.com" className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Instagram</label>
                  <input value={form.instagram} onChange={e => set("instagram", e.target.value)} placeholder="@handle" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Facebook</label>
                  <input value={form.facebook} onChange={e => set("facebook", e.target.value)} placeholder="Page URL or name" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>TikTok</label>
                  <input value={form.tiktok} onChange={e => set("tiktok", e.target.value)} placeholder="@handle" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>LinkedIn</label>
                  <input value={form.linkedin} onChange={e => set("linkedin", e.target.value)} placeholder="Company page URL" className={inputCls} />
                </div>
              </div>
              </div>
              )}





          {/* Step 3: Review & Submit */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="font-bold text-[#0a1628] text-lg mb-1">Review Your Application</h2>
              <p className="text-gray-400 text-sm mb-4">Your listing will appear as Free tier. Upgrade in your portal to unlock more features.</p>

              <div className="bg-gray-50 rounded-2xl divide-y divide-gray-100 overflow-hidden">
                {[
                  ["Business Name", form.name],
                  ["Country", form.country],
                  ["Category", form.category],
                  ["Email", form.email],
                ].map(([label, value]) => value ? (
                  <div key={label} className="flex justify-between px-4 py-3 text-sm">
                    <span className="text-gray-400">{label}</span>
                    <span className="font-medium text-[#0a1628] text-right">{value}</span>
                  </div>
                ) : null)}
              </div>

              {!form.name || !form.country || !form.category || !form.email || !form.contact_email || !form.tagline || !form.handle || !form.cultural_identity ? (
                <div className="flex items-center gap-2 bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl">
                  <AlertCircle className="w-4 h-4" /> Please complete all required fields before submitting.
                </div>
              ) : null}

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-900"><strong>Next step:</strong> After listing, you'll need to sign in to access your customer portal and manage additional details like images, contact links, and cultural identity.</p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
            {step > 1
              ? <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#0a1628] font-medium">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
              : <div />
            }
            {step < 3
              ? <button onClick={() => setStep(s => s + 1)}
                  className="flex items-center gap-2 logo-gradient hover:logo-gradient-hover text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm">
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              : <button
                  onClick={handleSubmit}
                  disabled={submitting || !form.name || !form.country || !form.category || !form.email || !form.contact_email || !form.tagline || !form.handle || !form.cultural_identity}
                  className="flex items-center gap-2 bg-[#0d4f4f] hover:bg-[#1a6b6b] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-xl transition-all text-sm">
                  {submitting ? "Submitting..." : "Submit Application"}
                </button>
              }
          </div>
        </div>
      </div>
    </div>
  );
}