import { useState, useEffect, useCallback } from "react";
import { COUNTRIES, CATEGORIES } from "@/constants/businessProfile";
import { ChevronRight, ChevronLeft, CheckCircle, AlertCircle, Upload } from "lucide-react";
import { pacificMarket } from "@/lib/pacificMarketClient";
import PremiumStepper from "@/components/shared/PremiumStepper";

const STEPS = [
  { key: "identity", label: "Business Identity" },
  { key: "media", label: "Media & Details" },
  { key: "contact", label: "Contact Info" },
  { key: "description", label: "Description" },
  { key: "review", label: "Review" },
];

export default function DetailedBusinessForm({ onSubmit, isLoading, excludeFields = [], initialData = null, onStepChange }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialData || {
    name: "", business_handle: "", country: "", city: "", industry: "",
    logo_url: "", banner_url: "",
    email: "", contact_email: "", phone: "", website: "", 
    social_links: [], // Array for all social media links
    tagline: "", description: "",
    tier: "free", claimed: true, // Auto-claim when user adds their own business
  });
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  // Notify parent of step changes
  const updateStep = (newStep) => {
    setStep(newStep);
    if (onStepChange) {
      onStepChange({
        currentStep: newStep,
        canGoNext: () => {
          if (newStep === 1) return form.name && form.country && form.industry;
          if (newStep === 5) return form.name && form.country && form.industry;
          return true;
        },
        nextStep: () => setStep(s => s + 1),
        prevStep: () => setStep(s => s - 1),
        submit: () => handleSubmit()
      });
    }
  };

  // Notify parent when step changes
  useEffect(() => {
    if (onStepChange) {
      onStepChange({
        currentStep: step,
        canGoNext: () => {
          if (step === 1) return form.name && form.country && form.industry;
          if (step === 5) return form.name && form.country && form.industry;
          return true;
        },
        nextStep: () => setStep(s => s + 1),
        prevStep: () => setStep(s => s - 1),
        submit: () => handleSubmit()
      });
    }
  }, [step]); // Only depend on step, not onStepChange or form

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  
  // Helper functions for social_links management
  const addSocialLink = (platform, url) => {
    if (!url.trim()) return;
    const existingLinks = form.social_links || [];
    const filteredLinks = existingLinks.filter(link => link.platform !== platform);
    setForm(f => ({ 
      ...f, 
      social_links: [...filteredLinks, { platform, url: url.trim() }] 
    }));
  };

  const removeSocialLink = (platform) => {
    const filteredLinks = form.social_links.filter(link => link.platform !== platform);
    setForm(f => ({ ...f, social_links: filteredLinks }));
  };

  const getSocialUrl = (platform) => {
    const link = form.social_links?.find(link => link.platform === platform);
    return link?.url || "";
  };
  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0d4f4f] focus:ring-1 focus:ring-[#0d4f4f]/20 bg-white";
  const labelCls = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (type === "logo") setUploadingLogo(true);
    else setUploadingBanner(true);

    try {
      const { file_url } = await pacificMarket.integrations.Core.UploadFile({ file, type });
      set(type === "logo" ? "logo_url" : "banner_url", file_url);
    } catch (error) {
      console.error('Upload failed:', error);
      alert(`Upload failed: ${error.message || 'Unable to upload image. Please try again.'}`);
    } finally {
      if (type === "logo") setUploadingLogo(false);
      else setUploadingBanner(false);
    }
  };

  const handleGenerateHandle = () => {
    if (form.name) set("business_handle", form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
  };

  const handleSubmit = () => {
    if (!form.name || !form.country || !form.industry) {
      alert("Please fill in required fields");
      return;
    }
    onSubmit(form);
  };

  return (
    <div className="space-y-6">
      {/* Premium Progress Stepper */}
      <PremiumStepper
        steps={STEPS}
        currentStep={step - 1}          // Convert 1-based to 0-based
        completedUntil={step - 2}        // Previous steps are completed
        onStepClick={(i) => {
          // Allow jumping to completed steps only
          if (i < step - 1) setStep(i + 1);
        }}
      />

      {/* Step 1: Business Identity */}
      {step === 1 && (
        <div className="space-y-5">
          <h3 className="font-bold text-[#0a1628] text-lg">Business Identity</h3>
          {!excludeFields.includes("name") && (
            <div>
              <label className={labelCls}>Business Name *</label>
              <input value={form.name || ""} onChange={e => set("name", e.target.value)} onBlur={handleGenerateHandle} placeholder="e.g. Your Business Name" className={inputCls} />
            </div>
          )}
          {!excludeFields.includes("handle") && (
            <div>
              <label className={labelCls}>Registry Handle *</label>
              <div className="flex gap-2">
                <input value={form.business_handle || ""} onChange={e => set("business_handle", e.target.value)} placeholder="tala-pacific-consulting" className={inputCls} />
                <button onClick={handleGenerateHandle} className="text-xs bg-[#0a1628] text-white px-3 py-2 rounded-xl hover:bg-[#122040] flex-shrink-0">Auto</button>
              </div>
              <p className="text-xs text-gray-400 mt-1">Unique URL identifier. Lowercase letters, numbers and hyphens only.</p>
            </div>
          )}
          {!excludeFields.includes("country") && !excludeFields.includes("city") && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Country *</label>
                <select value={form.country || ""} onChange={e => set("country", e.target.value)} className={inputCls}>
                  <option value="">Select country</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>City</label>
                <input value={form.city || ""} onChange={e => set("city", e.target.value)} placeholder="e.g. Auckland" className={inputCls} />
              </div>
            </div>
          )}
          {!excludeFields.includes("industry") && (
            <div>
              <label className={labelCls}>Industry Category *</label>
              <select value={form.industry || ""} onChange={e => set("industry", e.target.value)} className={inputCls}>
                <option value="">Select industry</option>
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
                  <img src={form.logo_url} alt="Logo" className="w-full h-full object-contain rounded-lg" />
                ) : (
                  <img src="/pm_logo.png" alt="Pacific Market" className="w-full h-full object-contain rounded-lg" />
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
                  <img src={form.banner_url} alt="Banner" className="w-full h-full object-contain rounded-lg" />
                ) : (
                  <img src="/pm_logo_banner.png" alt="Pacific Market Banner" className="w-full h-full object-contain rounded-lg" />
                )}
                <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, "banner")} disabled={uploadingBanner} />
              </label>
            </div>
            <p className="text-xs text-gray-400 mt-1">Recommended: 1200x400px, max 3MB. Landscape format.</p>
            <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-800">
                <strong>Premium Feature:</strong> Upgrade to Verified or Featured+ tier to display your custom logo & banner publicly.
              </p>
            </div>
          </div>
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
            <div>
              <label className={labelCls}>Business Email (Public)</label>
              <input value={form.contact_email || ""} onChange={e => set("contact_email", e.target.value)} type="email" placeholder="hello@business.com" className={inputCls} />
              <p className="text-xs text-gray-400 mt-1">Shown on your public profile for customer inquiries</p>
            </div>
          )}
          {!excludeFields.includes("phone") && (
            <div>
              <label className={labelCls}>Business Phone (Public)</label>
              <input value={form.contact_phone || ""} onChange={e => set("contact_phone", e.target.value)} placeholder="+64 9 000 0000" className={inputCls} />
              <p className="text-xs text-gray-400 mt-1">Shown on your public profile for customer inquiries</p>
            </div>
          )}
          {!excludeFields.includes("website") && (
            <div>
              <label className={labelCls}>Website</label>
              <input value={form.website || ""} onChange={e => set("website", e.target.value)} placeholder="https://yourbusiness.com" className={inputCls} />
            </div>
          )}
          {!excludeFields.includes("instagram") && !excludeFields.includes("facebook") && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Instagram</label>
                <input 
                  value={getSocialUrl("instagram")} 
                  onChange={e => addSocialLink("instagram", e.target.value)} 
                  placeholder="@handle" 
                  className={inputCls} 
                />
              </div>
              <div>
                <label className={labelCls}>Facebook</label>
                <input 
                  value={getSocialUrl("facebook")} 
                  onChange={e => addSocialLink("facebook", e.target.value)} 
                  placeholder="Page URL or name" 
                  className={inputCls} 
                />
              </div>
            </div>
          )}
          {!excludeFields.includes("tiktok") && !excludeFields.includes("linkedin") && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>TikTok</label>
                <input 
                  value={getSocialUrl("tiktok")} 
                  onChange={e => addSocialLink("tiktok", e.target.value)} 
                  placeholder="@handle" 
                  className={inputCls} 
                />
              </div>
              <div>
                <label className={labelCls}>LinkedIn</label>
                <input 
                  value={getSocialUrl("linkedin")} 
                  onChange={e => addSocialLink("linkedin", e.target.value)} 
                  placeholder="Company page URL" 
                  className={inputCls} 
                />
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
              <input value={form.tagline || ""} onChange={e => set("tagline", e.target.value)} maxLength={160} placeholder="One-line description of your business" className={inputCls} />
              <p className="text-xs text-gray-400 mt-1">{(form.tagline || "").length}/160</p>
            </div>
          )}
          {!excludeFields.includes("full_description") && (
            <div>
              <label className={labelCls}>Description</label>
              <textarea value={form.description || ""} onChange={e => set("description", e.target.value)} rows={5} placeholder="Describe your products or services, your story, and your connection to the Pacific community..." className={`${inputCls} resize-none`} />
            </div>
          )}
        </div>
      )}

      {/* Step 5: Review */}
      {step === 5 && (
        <div className="space-y-6">
          <h3 className="font-bold text-[#0a1628] text-lg">Review & Confirm</h3>
          {!form.name || !form.country || !form.industry ? (
            <div className="flex items-center gap-2 bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl">
              <AlertCircle className="w-4 h-4" /> Please complete required fields before submitting.
            </div>
          ) : null}
          <div className="bg-gray-50 rounded-2xl divide-y divide-gray-100">
            {/* Business Identity */}
            <div className="px-4 py-3 bg-gray-100">
              <h4 className="text-sm font-semibold text-[#0a1628] mb-2">Business Identity</h4>
              <div className="space-y-2">
                {form.name && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Business Name</span>
                    <span className="font-medium text-[#0a1628]">{form.name}</span>
                  </div>
                )}
                {form.business_handle && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Registry Handle</span>
                    <span className="font-medium text-[#0a1628]">{form.business_handle}</span>
                  </div>
                )}
                {form.country && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Country</span>
                    <span className="font-medium text-[#0a1628]">{form.country}</span>
                  </div>
                )}
                {form.city && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">City</span>
                    <span className="font-medium text-[#0a1628]">{form.city}</span>
                  </div>
                )}
                {form.industry && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Industry</span>
                    <span className="font-medium text-[#0a1628]">{form.industry}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Media */}
            {(form.logo_url || form.banner_url) && (
              <div className="px-4 py-3">
                <h4 className="text-sm font-semibold text-[#0a1628] mb-2">Media</h4>
                <div className="space-y-2">
                  {form.logo_url && (
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-gray-400">Logo</span>
                      <img src={form.logo_url} alt="Logo" className="w-8 h-8 object-contain rounded" />
                      <span className="text-green-600 text-xs">✓ Uploaded</span>
                    </div>
                  )}
                  {form.banner_url && (
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-gray-400">Banner</span>
                      <img src={form.banner_url} alt="Banner" className="w-12 h-4 object-contain rounded" />
                      <span className="text-green-600 text-xs">✓ Uploaded</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Contact Information */}
            {(form.contact_email || form.contact_phone || form.website || form.social_links?.length > 0) && (
              <div className="px-4 py-3">
                <h4 className="text-sm font-semibold text-[#0a1628] mb-2">Contact Information</h4>
                <div className="space-y-2">
                  {form.contact_email && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Business Email</span>
                      <span className="font-medium text-[#0a1628]">{form.contact_email}</span>
                    </div>
                  )}
                  {form.contact_phone && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Business Phone</span>
                      <span className="font-medium text-[#0a1628]">{form.contact_phone}</span>
                    </div>
                  )}
                  {form.website && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Website</span>
                      <span className="font-medium text-[#0a1628] truncate max-w-[200px]">{form.website}</span>
                    </div>
                  )}
                  {form.social_links?.map((link) => (
                    <div key={link.platform} className="flex justify-between text-sm">
                      <span className="text-gray-400 capitalize">{link.platform}</span>
                      <span className="font-medium text-[#0a1628] truncate max-w-[200px]">{link.url}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {(form.tagline || form.description) && (
              <div className="px-4 py-3">
                <h4 className="text-sm font-semibold text-[#0a1628] mb-2">Business Description</h4>
                <div className="space-y-2">
                  {form.tagline && (
                    <div className="text-sm">
                      <span className="text-gray-400 block mb-1">Tagline</span>
                      <span className="font-medium text-[#0a1628]">{form.tagline}</span>
                    </div>
                  )}
                  {form.description && (
                    <div className="text-sm">
                      <span className="text-gray-400 block mb-1">Description</span>
                      <span className="font-medium text-[#0a1628] line-clamp-3">{form.description}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}