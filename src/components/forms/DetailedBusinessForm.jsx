import { useState } from "react";
import { COUNTRIES, CATEGORIES, IDENTITIES } from "../formConstants";
import { ChevronRight, ChevronLeft, CheckCircle, AlertCircle, Upload } from "lucide-react";
import { pacificMarket } from "@/lib/pacificMarketClient";

const STEPS = [
  { id: 1, label: "Business Identity" },
  { id: 2, label: "Media & Details" },
  { id: 3, label: "Contact Info" },
  { id: 4, label: "Description" },
  { id: 5, label: "Review" },
];

export default function DetailedBusinessForm({ onSubmit, isLoading, showTierSelection = false, excludeFields = [], initialData = null }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialData || {
    name: "", handle: "", country: "", city: "", category: "",
    logo_url: "", banner_url: "",
    email: "", contact_email: "", phone: "", website: "", instagram: "", facebook: "", tiktok: "", linkedin: "",
    tagline: "", description: "",
    cultural_identity: "", languages_spoken: [], proof_links: [],
    tier: "free", claimed: false,
  });
  const [lang, setLang] = useState("");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0d4f4f] focus:ring-1 focus:ring-[#0d4f4f]/20 bg-white";
  const labelCls = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (type === "logo") setUploadingLogo(true);
    else setUploadingBanner(true);

    const { file_url } = await pacificMarket.integrations.Core.UploadFile({ file });
    set(type === "logo" ? "logo_url" : "banner_url", file_url);

    if (type === "logo") setUploadingLogo(false);
    else setUploadingBanner(false);
  };

  const handleGenerateHandle = () => {
    if (form.name) set("handle", form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
  };

  const handleSubmit = () => {
    if (!form.name || !form.country || !form.category) {
      alert("Please fill in required fields");
      return;
    }
    onSubmit(form);
  };

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center gap-1 flex-shrink-0">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              step === s.id ? "bg-[#0a1628] text-white"
              : step > s.id ? "bg-[#0d4f4f]/10 text-[#0d4f4f]"
              : "text-gray-400"
            }`}>
              {step > s.id ? <CheckCircle className="w-3 h-3" /> : <span>{s.id}</span>}
              <span className="hidden sm:block">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && <ChevronRight className="w-3 h-3 text-gray-300 flex-shrink-0" />}
          </div>
        ))}
      </div>

      {/* Step 1: Business Identity */}
      {step === 1 && (
        <div className="space-y-5">
          <h3 className="font-bold text-[#0a1628] text-lg">Business Identity</h3>
          {!excludeFields.includes("name") && (
            <div>
              <label className={labelCls}>Business Name *</label>
              <input value={form.name} onChange={e => set("name", e.target.value)} onBlur={handleGenerateHandle} placeholder="e.g. Tala Pacific Consulting" className={inputCls} />
            </div>
          )}
          {!excludeFields.includes("handle") && (
            <div>
              <label className={labelCls}>Registry Handle *</label>
              <div className="flex gap-2">
                <input value={form.handle} onChange={e => set("handle", e.target.value)} placeholder="tala-pacific-consulting" className={inputCls} />
                <button onClick={handleGenerateHandle} className="text-xs bg-[#0a1628] text-white px-3 py-2 rounded-xl hover:bg-[#122040] flex-shrink-0">Auto</button>
              </div>
              <p className="text-xs text-gray-400 mt-1">Unique URL identifier. Lowercase letters, numbers and hyphens only.</p>
            </div>
          )}
          {!excludeFields.includes("country") && !excludeFields.includes("city") && (
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
          )}
          {!excludeFields.includes("category") && (
            <div>
              <label className={labelCls}>Industry Category *</label>
              <select value={form.category} onChange={e => set("category", e.target.value)} className={inputCls}>
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Media & Details */}
      {step === 2 && !excludeFields.includes("media") && (
        <div className="space-y-5">
          <h3 className="font-bold text-[#0a1628] text-lg">Media & Details</h3>
          <div>
            <label className={labelCls}>Logo</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center justify-center w-20 h-20 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#0d4f4f] transition-colors">
                {form.logo_url ? (
                  <img src={form.logo_url} alt="Logo" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <Upload className="w-5 h-5 text-gray-400" />
                )}
                <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, "logo")} disabled={uploadingLogo} />
              </label>
              <div className="text-xs text-gray-400">
                <p className="font-semibold text-gray-600 mb-1">Recommended: 400x400px</p>
                <p>Max 2MB. Square format.</p>
              </div>
            </div>
          </div>
          <div>
            <label className={labelCls}>Banner</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#0d4f4f] transition-colors">
                {form.banner_url ? (
                  <img src={form.banner_url} alt="Banner" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <Upload className="w-5 h-5 text-gray-400" />
                )}
                <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, "banner")} disabled={uploadingBanner} />
              </label>
            </div>
            <p className="text-xs text-gray-400 mt-1">Recommended: 1200x400px, max 3MB. Landscape format.</p>
          </div>
          {showTierSelection && (
            <div>
              <label className={labelCls}>Tier</label>
              <select value={form.tier} onChange={e => set("tier", e.target.value)} className={inputCls}>
                <option value="free">Free</option>
                <option value="verified">Verified</option>
                <option value="featured_plus">Featured+</option>
              </select>
            </div>
          )}
          {!excludeFields.includes("claimed") && (
            <div>
              <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl hover:bg-gray-50">
                <input type="checkbox" checked={form.claimed} onChange={e => set("claimed", e.target.checked)} className="mt-0.5 rounded" />
                <span className="text-sm text-gray-600">Mark as claimed (business owner has created account)</span>
              </label>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Contact */}
      {step === 3 && !excludeFields.includes("contact") && (
        <div className="space-y-5">
          <h3 className="font-bold text-[#0a1628] text-lg">Contact Information</h3>
          {!excludeFields.includes("email") && (
            <>
              <div>
                <label className={labelCls}>Account Email (Login)</label>
                <input value={form.email} onChange={e => set("email", e.target.value)} type="email" placeholder="your.email@example.com" className={inputCls} />
                <p className="text-xs text-gray-400 mt-1">Used to log in to your account</p>
              </div>
              <div>
                <label className={labelCls}>Business Email (Public)</label>
                <input value={form.contact_email} onChange={e => set("contact_email", e.target.value)} type="email" placeholder="hello@business.com" className={inputCls} />
                <p className="text-xs text-gray-400 mt-1">Shown on your public profile for customer inquiries</p>
              </div>
            </>
          )}
          {!excludeFields.includes("phone") && (
            <>
              <div>
                <label className={labelCls}>Account Phone</label>
                <input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+64 9 000 0000" className={inputCls} />
                <p className="text-xs text-gray-400 mt-1">Used to log in to your account</p>
              </div>
              <div>
                <label className={labelCls}>Business Phone (Public)</label>
                <input value={form.contact_phone} onChange={e => set("contact_phone", e.target.value)} placeholder="+64 9 000 0000" className={inputCls} />
                <p className="text-xs text-gray-400 mt-1">Shown on your public profile for customer inquiries</p>
              </div>
            </>
          )}
          {!excludeFields.includes("website") && (
            <div>
              <label className={labelCls}>Website</label>
              <input value={form.website} onChange={e => set("website", e.target.value)} placeholder="https://yourbusiness.com" className={inputCls} />
            </div>
          )}
          {!excludeFields.includes("instagram") && !excludeFields.includes("facebook") && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Instagram</label>
                <input value={form.instagram} onChange={e => set("instagram", e.target.value)} placeholder="@handle" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Facebook</label>
                <input value={form.facebook} onChange={e => set("facebook", e.target.value)} placeholder="Page URL or name" className={inputCls} />
              </div>
            </div>
          )}
          {!excludeFields.includes("tiktok") && !excludeFields.includes("linkedin") && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>TikTok</label>
                <input value={form.tiktok} onChange={e => set("tiktok", e.target.value)} placeholder="@handle" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>LinkedIn</label>
                <input value={form.linkedin} onChange={e => set("linkedin", e.target.value)} placeholder="Company page URL" className={inputCls} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 4: Description */}
      {step === 4 && !excludeFields.includes("description") && (
        <div className="space-y-5">
          <h3 className="font-bold text-[#0a1628] text-lg">Business Description</h3>
          {!excludeFields.includes("tagline") && (
            <div>
              <label className={labelCls}>Tagline (max 160 chars)</label>
              <input value={form.tagline} onChange={e => set("tagline", e.target.value)} maxLength={160} placeholder="One-line description of your business" className={inputCls} />
              <p className="text-xs text-gray-400 mt-1">{form.tagline.length}/160</p>
            </div>
          )}
          {!excludeFields.includes("full_description") && (
            <div>
              <label className={labelCls}>Description</label>
              <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={5} placeholder="Describe your products or services, your story, and your connection to the Pacific community..." className={`${inputCls} resize-none`} />
            </div>
          )}
          {!excludeFields.includes("cultural_identity") && (
            <div>
              <label className={labelCls}>Cultural Identity</label>
              <select value={form.cultural_identity} onChange={e => set("cultural_identity", e.target.value)} className={inputCls}>
                <option value="">Select Pacific identity</option>
                {IDENTITIES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
          )}
          {!excludeFields.includes("languages") && (
            <div>
              <label className={labelCls}>Languages Spoken</label>
              <div className="flex gap-2 mb-2">
                <input value={lang} onChange={e => setLang(e.target.value)} placeholder="e.g. Samoan, English" className={inputCls} />
                <button onClick={() => { if (lang.trim()) { set("languages_spoken", [...form.languages_spoken, lang.trim()]); setLang(""); } }} className="text-xs bg-[#0a1628] text-white px-4 py-2 rounded-xl hover:bg-[#122040] flex-shrink-0">Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.languages_spoken.map(l => (
                  <span key={l} className="flex items-center gap-1 bg-[#0a1628]/5 text-[#0a1628] text-xs px-3 py-1 rounded-full">
                    {l}
                    <button onClick={() => set("languages_spoken", form.languages_spoken.filter(x => x !== l))} className="text-gray-400 hover:text-red-500">×</button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 5: Review */}
      {step === 5 && (
        <div className="space-y-6">
          <h3 className="font-bold text-[#0a1628] text-lg">Review & Confirm</h3>
          {!form.name || !form.country || !form.category ? (
            <div className="flex items-center gap-2 bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl">
              <AlertCircle className="w-4 h-4" /> Please complete required fields before submitting.
            </div>
          ) : null}
          <div className="bg-gray-50 rounded-2xl divide-y divide-gray-100">
            {[["Business Name", form.name], ["Country", form.country], ["Category", form.category], ["Tier", form.tier], ["Email", form.email]].map(([l, v]) => v ? (
              <div key={l} className="flex justify-between px-4 py-3 text-sm">
                <span className="text-gray-400">{l}</span>
                <span className="font-medium text-[#0a1628]">{v}</span>
              </div>
            ) : null)}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t border-gray-100">
        {step > 1 ? (
          <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#0a1628] font-medium">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
        ) : <div />}
        {step < 5 ? (
          <button onClick={() => setStep(s => s + 1)} className="flex items-center gap-2 bg-[#0a1628] hover:bg-[#122040] text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all">
            Continue <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={isLoading || !form.name || !form.country || !form.category} className="flex items-center gap-2 bg-[#0d4f4f] hover:bg-[#1a6b6b] disabled:opacity-40 text-white font-bold px-8 py-3 rounded-xl text-sm transition-all">
            {isLoading ? "Creating..." : "Create Listing"}
          </button>
        )}
      </div>
    </div>
  );
}