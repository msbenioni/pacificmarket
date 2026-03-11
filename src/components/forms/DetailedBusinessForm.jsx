import { useState, useEffect, useCallback } from "react";
import { IDENTITIES } from "@/constants/businessProfile";
import { COUNTRIES, INDUSTRIES, BUSINESS_STATUS, SUBSCRIPTION_TIER, BUSINESS_SOURCE, getTierDisplayName, TEAM_SIZE_BAND, BUSINESS_STAGE, IMPORT_EXPORT_STATUS, BUSINESS_OPERATING_STATUS, SALES_CHANNELS, REVENUE_BAND } from "@/constants/unifiedConstants";
import { ChevronRight, ChevronLeft, CheckCircle, AlertCircle, Upload } from "lucide-react";
import PremiumStepper from "@/components/shared/PremiumStepper";

const FORM_MODES = {
  BUSINESS_CREATE: 'business-create',
  BUSINESS_EDIT: 'business-edit', 
  ADMIN_CREATE: 'admin-create',
  ADMIN_EDIT: 'admin-edit'
};

export { FORM_MODES };

const STEPS = [
  { key: "identity", label: "Business Identity" },
  { key: "operations", label: "Business Operations" },
  { key: "media", label: "Media & Details" },
  { key: "contact", label: "Contact Info" },
  { key: "description", label: "Description" },
  { key: "review", label: "Review" },
];

export default function DetailedBusinessForm({ 
  onSubmit, 
  isLoading, 
  excludeFields = [], 
  initialData = null, 
  onStepChange,
  mode = FORM_MODES.BUSINESS_CREATE 
}) {
  const [step, setStep] = useState(1);
  // Helper functions to transform social_links between database and form formats
  const transformSocialLinksFromDB = (socialLinks) => {
    if (!socialLinks || typeof socialLinks !== 'object') return [];
    
    // Convert from { platform: url, platform2: url2 } to [{ platform, url }, { platform, url }]
    return Object.entries(socialLinks)
      .filter(([_, url]) => url && url.trim() !== '') // Only include non-empty URLs
      .map(([platform, url]) => ({ platform, url: url.trim() }));
  };

  const transformSocialLinksToDB = (socialLinks) => {
    if (!Array.isArray(socialLinks)) return {};
    
    // Convert from [{ platform, url }, { platform, url }] to { platform: url, platform2: url2 }
    return socialLinks.reduce((acc, link) => {
      if (link.platform && link.url && link.url.trim() !== '') {
        acc[link.platform] = link.url.trim();
      }
      return acc;
    }, {});
  };

  // Helper function to find industry value by label from constants
  const findIndustryValue = (industryLabel) => {
    if (!industryLabel) return industryLabel;
    
    // First check if it's already a valid value (matches any industry value)
    const isAlreadyValue = INDUSTRIES.some(ind => ind.value === industryLabel);
    if (isAlreadyValue) return industryLabel;
    
    // Otherwise, try to find by label
    const industry = INDUSTRIES.find(ind => ind.label === industryLabel);
    return industry ? industry.value : industryLabel;
  };

  // Helper function to find country value by label from constants
  const findCountryValue = (countryLabel) => {
    if (!countryLabel) return countryLabel;
    
    // First check if it's already a valid value (matches any country value)
    const isAlreadyValue = COUNTRIES.some(c => c.value === countryLabel);
    if (isAlreadyValue) return countryLabel;
    
    // Otherwise, try to find by label
    const country = COUNTRIES.find(c => c.label === countryLabel);
    return country ? country.value : countryLabel;
  };

  const [form, setForm] = useState(initialData ? {
    ...initialData,
    // Map database field names to form field names
    tagline: initialData.short_description || initialData.tagline || "",
    website: initialData.contact_website || initialData.website || "",
    // Transform social_links from database format to form format
    social_links: transformSocialLinksFromDB(initialData.social_links),
    // Use constants to find correct values
    industry: findIndustryValue(initialData.industry),
    // Ensure country and city are properly set
    country: findCountryValue(initialData.country) || "",
    city: initialData.city || "",
    // Map other important fields
    year_started: initialData.year_started || "",
    description: initialData.description || "",
    contact_email: initialData.contact_email || "",
    contact_phone: initialData.contact_phone || "",
    // Handle business_stage -> growth_stage mapping
    growth_stage: initialData.growth_stage || initialData.business_stage || "",
    // Remove the old business_stage field if it exists
    ...(initialData.business_stage ? { business_stage: undefined } : {}),
    // Handle annual_revenue_exact -> revenue_band mapping
    ...(initialData.annual_revenue_exact ? { 
      revenue_band: "", // Clear the old field, user can select new one
      annual_revenue_exact: undefined 
    } : {}),
  } : {
    // Identity fields
    name: "", 
    business_handle: "", 
    industry: "", 
    country: "", 
    city: "", 
    year_started: "",
    
    // Business Operations fields
    business_operating_status: "",
    business_age: "",
    team_size_band: "",
    business_registered: false,
    employs_anyone: false,
    employs_family_community: false,
    sales_channels: [],
    revenue_band: "",
    
    // Media fields
    logo_url: "", 
    banner_url: "",
    
    // Contact fields
    contact_email: "", 
    contact_phone: "", 
    website: "", 
    social_links: [],
    
    // Description fields
    description: "", 
    short_description: "",
    
    // Additional fields
    business_structure: "",
    primary_market: "",
    growth_stage: "",
    funding_source: "",
    competitive_advantage: "",
    future_plans: "",
    customer_segments: "",
    business_challenges: "",
    tech_stack: "",
    full_time_employees: null,
    part_time_employees: null,
    cultural_identity: "",
    languages_spoken: [],
    tagline: "",
  });

  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  // Helper functions for mode-based field visibility
  const isAdminMode = () => {
    return mode === FORM_MODES.ADMIN_CREATE || mode === FORM_MODES.ADMIN_EDIT;
  };

  const isEditMode = () => {
    return mode === FORM_MODES.BUSINESS_EDIT || mode === FORM_MODES.ADMIN_EDIT;
  };

  const shouldShowField = (fieldName) => {
    // Admin-only fields
    const adminFields = ['status', 'subscription_tier', 'verified', 'owner_user_id'];
    if (adminFields.includes(fieldName) && !isAdminMode()) {
      return false;
    }
    
    // Fields to exclude
    if (excludeFields.includes(fieldName)) {
      return false;
    }
    
    return true;
  };

  // Set default values based on mode
  useEffect(() => {
    if (!initialData) {
      setForm(prev => ({
        ...prev,
        // User-created businesses are auto-claimed and start as vaka
        claimed: mode === FORM_MODES.BUSINESS_CREATE ? true : prev.claimed,
        subscription_tier: mode === FORM_MODES.BUSINESS_CREATE ? SUBSCRIPTION_TIER.VAKA : prev.subscription_tier,
        source: mode === FORM_MODES.ADMIN_CREATE ? BUSINESS_SOURCE.ADMIN : BUSINESS_SOURCE.USER,
        // Admin-created businesses start as pending
        status: mode === FORM_MODES.ADMIN_CREATE ? BUSINESS_STATUS.PENDING : prev.status
      }));
    }
  }, [mode, initialData]);

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
          if (step === 6) return form.name && form.country && form.industry;
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
    const existingLinks = Array.isArray(form.social_links) ? form.social_links : [];
    const filteredLinks = existingLinks.filter(link => link.platform !== platform);
    setForm(f => ({ 
      ...f, 
      social_links: [...filteredLinks, { platform, url: url.trim() }] 
    }));
  };

  const removeSocialLink = (platform) => {
    const socialLinks = Array.isArray(form.social_links) ? form.social_links : [];
    const filteredLinks = socialLinks.filter(link => link.platform !== platform);
    setForm(f => ({ ...f, social_links: filteredLinks }));
  };

  const getSocialUrl = (platform) => {
    const socialLinks = Array.isArray(form.social_links) ? form.social_links : [];
    const link = socialLinks.find(link => link.platform === platform);
    return link?.url || "";
  };
  const inputCls =
  "w-full min-h-[44px] border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#0a1628] placeholder:text-gray-400 focus:outline-none focus:border-[#0d4f4f] focus:ring-2 focus:ring-[#0d4f4f]/10 bg-white";
  const labelCls = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (type === "logo") setUploadingLogo(true);
    else setUploadingBanner(true);

    try {
      // Upload file to Supabase storage
      const bucket = "admin-listings";
      const folder = type === "logo" ? "logos" : "banners";
      const filePath = `${folder}/${Date.now()}-${file.name}`;
      
      // Import getSupabase dynamically
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);
      
      const file_url = data.publicUrl;
      
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
    
    // Map form field names back to database field names
    const submissionData = {
      ...form,
      short_description: form.tagline, // Map tagline -> short_description
      contact_website: form.website, // Map website -> contact_website
      // Transform social_links from form format back to database format
      social_links: transformSocialLinksToDB(form.social_links),
    };
    
    // Remove the form-specific fields that don't exist in database
    delete submissionData.tagline;
    delete submissionData.website;
    
    // Ensure no business_stage field gets submitted (use growth_stage instead)
    delete submissionData.business_stage;
    
    // Ensure no annual_revenue_exact field gets submitted (use revenue_band instead)
    delete submissionData.annual_revenue_exact;
    
    onSubmit(submissionData);
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
        <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-4 sm:p-5">
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
                <button type="button" onClick={handleGenerateHandle} className="text-xs bg-[#0a1628] text-white px-3 py-2 rounded-xl hover:bg-[#122040] flex-shrink-0">Auto</button>
              </div>
              <p className="text-xs text-gray-400 mt-1">Unique URL identifier. Lowercase letters, numbers and hyphens only.</p>
            </div>
          )}
          {!excludeFields.includes("country") && !excludeFields.includes("city") && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Country *</label>
                <select value={form.country || ""} onChange={e => set("country", e.target.value)} className={inputCls}>
                  <option value="">Select country</option>
                  {COUNTRIES.map(c => <option key={`country-${c.value}`} value={c.value}>{c.label}</option>)}
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
              <label className={labelCls}>Industry *</label>
              <select value={form.industry || ""} onChange={e => set("industry", e.target.value)} className={inputCls}>
                <option value="">Select industry</option>
                {INDUSTRIES.map(c => <option key={`industry-${c.value}`} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          )}
          
          {/* Admin-only fields */}
          {isAdminMode() && shouldShowField("year_started") && (
            <div>
              <label className={labelCls}>Year Started</label>
              <input 
                value={form.year_started || ""} 
                onChange={e => set("year_started", e.target.value)} 
                type="number" 
                placeholder="e.g. 2020" 
                min="1900" 
                max={new Date().getFullYear() + 1}
                className={inputCls} 
              />
            </div>
          )}
        </div>
      )}

      {/* Step 2: Business Operations */}
      {step === 2 && (
        <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-4 sm:p-5">
          <h3 className="font-bold text-[#0a1628] text-lg">
            Business Operations
          </h3>
          
          <p className="text-sm text-gray-600">
            These details help strengthen the Pacific business ecosystem and improve discovery.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>
              <label className={labelCls}>Operating Status</label>
              <select
                value={form.business_operating_status || ""}
                onChange={e => set("business_operating_status", e.target.value)}
                className={inputCls}
              >
                <option value="">Select status</option>
                {BUSINESS_OPERATING_STATUS.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelCls}>Business Stage</label>
              <select
                value={form.growth_stage || ""}
                onChange={e => set("growth_stage", e.target.value)}
                className={inputCls}
              >
                <option value="">Select stage</option>
                {BUSINESS_STAGE.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelCls}>Team Size</label>
              <select
                value={form.team_size_band || ""}
                onChange={e => set("team_size_band", e.target.value)}
                className={inputCls}
              >
                <option value="">Select team size</option>
                {TEAM_SIZE_BAND.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelCls}>Revenue Range</label>
              <select
                value={form.revenue_band || ""}
                onChange={e => set("revenue_band", e.target.value)}
                className={inputCls}
              >
                <option value="">Select revenue band</option>
                {REVENUE_BAND.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

          </div>

          <div>
            <label className={labelCls}>Sales Channels</label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SALES_CHANNELS.map(channel => {
                const checked = (form.sales_channels || []).includes(channel.value);

                return (
                  <label
                    key={channel.value}
                    className="flex items-center gap-2 text-sm border border-gray-200 rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        const current = form.sales_channels || [];
                        if (checked) {
                          set("sales_channels", current.filter(c => c !== channel.value));
                        } else {
                          set("sales_channels", [...current, channel.value]);
                        }
                      }}
                    />
                    {channel.label}
                  </label>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* Step 3: Media & Details */}
      {step === 3 && !excludeFields.includes("media") && (
        <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-4 sm:p-5">
          <h3 className="font-bold text-[#0a1628] text-lg">Media & Details</h3>
          <div>
            <label className={labelCls}>Logo</label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <label className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#0d4f4f] transition-colors">
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
              <label className="flex items-center justify-center w-full h-24 sm:h-28 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#0d4f4f] transition-colors">
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
                <strong>Premium Feature:</strong> Upgrade to Mana or Moana tier to display your custom logo & banner publicly.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Contact */}
      {step === 4 && !excludeFields.includes("contact") && (
        <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-4 sm:p-5">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

      {/* Step 5: Description */}
      {step === 5 && !excludeFields.includes("description") && (
        <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-4 sm:p-5">
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
          
          {/* Admin-only fields */}
          {isAdminMode() && (
            <div className="border-t border-gray-200 pt-5 mt-5">
              <h4 className="font-semibold text-[#0a1628] text-sm mb-4">Admin Settings</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {shouldShowField("status") && (
                  <div>
                    <label className={labelCls}>Status</label>
                    <select value={form.status || ""} onChange={e => set("status", e.target.value)} className={inputCls}>
                      <option value={BUSINESS_STATUS.PENDING}>Pending</option>
                      <option value={BUSINESS_STATUS.ACTIVE}>Active</option>
                      <option value={BUSINESS_STATUS.REJECTED}>Rejected</option>
                    </select>
                  </div>
                )}
                {shouldShowField("subscription_tier") && (
                  <div>
                    <label className={labelCls}>Subscription Tier</label>
                    <select value={form.subscription_tier || ""} onChange={e => set("subscription_tier", e.target.value)} className={inputCls}>
                      <option value={SUBSCRIPTION_TIER.VAKA}>Vaka</option>
                      <option value={SUBSCRIPTION_TIER.MANA}>Mana</option>
                      <option value={SUBSCRIPTION_TIER.MOANA}>Moana</option>
                    </select>
                  </div>
                )}
                {shouldShowField("verified") && (
                  <div>
                    <label className={labelCls}>Verified</label>
                    <select value={form.verified ? "true" : "false"} onChange={e => set("verified", e.target.value === "true")} className={inputCls}>
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 6: Review */}
      {step === 6 && (
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
                    <div className="flex flex-col gap-1 text-sm">
                      <span className="text-gray-400">Business Name</span>
                      <span className="font-medium text-[#0a1628] break-words">{form.name}</span>
                    </div>
                  )}
                  {form.business_handle && (
                    <div className="flex flex-col gap-1 text-sm">
                      <span className="text-gray-400">Business Handle</span>
                      <span className="font-medium text-[#0a1628] break-words">{form.business_handle}</span>
                    </div>
                  )}
                  {form.country && (
                    <div className="flex flex-col gap-1 text-sm">
                      <span className="text-gray-400">Country</span>
                      <span className="font-medium text-[#0a1628] break-words">{form.country}</span>
                    </div>
                  )}
                  {form.city && (
                    <div className="flex flex-col gap-1 text-sm">
                      <span className="text-gray-400">City</span>
                      <span className="font-medium text-[#0a1628] break-words">{form.city}</span>
                    </div>
                  )}
                  {form.industry && (
                    <div className="flex flex-col gap-1 text-sm">
                      <span className="text-gray-400">Industry</span>
                      <span className="font-medium text-[#0a1628] break-words">{form.industry}</span>
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
            {(form.contact_email || form.contact_phone || form.website || (Array.isArray(form.social_links) && form.social_links.length > 0)) && (
              <div className="px-4 py-3">
                <h4 className="text-sm font-semibold text-[#0a1628] mb-2">Contact Information</h4>
                <div className="space-y-2">
                  {form.contact_email && (
                    <div className="flex flex-col gap-1 text-sm">
                      <span className="text-gray-400">Business Email</span>
                      <span className="font-medium text-[#0a1628] break-words">{form.contact_email}</span>
                    </div>
                  )}
                  {form.contact_phone && (
                    <div className="flex flex-col gap-1 text-sm">
                      <span className="text-gray-400">Business Phone</span>
                      <span className="font-medium text-[#0a1628] break-words">{form.contact_phone}</span>
                    </div>
                  )}
                  {form.website && (
                    <div className="flex flex-col gap-1 text-sm">
                      <span className="text-gray-400">Website</span>
                      <span className="font-medium text-[#0a1628] break-words">{form.website}</span>
                    </div>
                  )}
                  {Array.isArray(form.social_links) && form.social_links.map((link) => (
                    <div key={link.platform} className="flex flex-col gap-1 text-sm">
                      <span className="text-gray-400 capitalize">{link.platform}</span>
                      <span className="font-medium text-[#0a1628] break-words">{link.url}</span>
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

            {/* Admin-only fields */}
            {isAdminMode() && (
              <div className="px-4 py-3 bg-amber-50 border border-amber-200">
                <h4 className="text-sm font-semibold text-amber-900 mb-2">Admin Settings</h4>
                <div className="space-y-2">
                  <div className="flex flex-col gap-1 text-sm">
                    <span className="text-amber-700">Status</span>
                    <span className="font-medium text-amber-900 capitalize break-words">{form.status}</span>
                  </div>
                  <div className="flex flex-col gap-1 text-sm">
                    <span className="text-amber-700">Tier</span>
                    <span className="font-medium text-amber-900 break-words">{getTierDisplayName(form.subscription_tier)}</span>
                  </div>
                  {form.owner_user_id && (
                    <div className="flex flex-col gap-1 text-sm">
                      <span className="text-amber-700">Owner ID</span>
                      <span className="font-medium text-amber-900 break-words">{form.owner_user_id}</span>
                    </div>
                  )}
                  <div className="flex flex-col gap-1 text-sm">
                    <span className="text-amber-700">Source</span>
                    <span className="font-medium text-amber-900 capitalize break-words">{form.source}</span>
                  </div>
                  {form.created_date && (
                    <div className="flex flex-col gap-1 text-sm">
                      <span className="text-amber-700">Created</span>
                      <span className="font-medium text-amber-900 break-words">{new Date(form.created_date).toLocaleDateString()}</span>
                    </div>
                  )}
                  {form.updated_at && (
                    <div className="flex flex-col gap-1 text-sm">
                      <span className="text-amber-700">Last Updated</span>
                      <span className="font-medium text-amber-900 break-words">{new Date(form.updated_at).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Navigation Buttons */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={() => step > 1 && setStep(step - 1)}
          disabled={step === 1}
          className={`inline-flex min-h-[44px] w-full sm:w-auto items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-colors ${
            step === 1 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>
        
        {step < 6 ? (
          <button
            type="button"
            onClick={() => {
              // Validate required fields for current step
              if (step === 1 && (!form.name || !form.country || !form.industry)) {
                alert("Please fill in required fields (Name, Country, Industry)");
                return;
              }
              setStep(step + 1);
            }}
            className="inline-flex min-h-[44px] w-full sm:w-auto items-center justify-center gap-2 bg-[#0d4f4f] hover:bg-[#1a6b6b] text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="inline-flex min-h-[44px] w-full sm:w-auto items-center justify-center gap-2 bg-[#0d4f4f] hover:bg-[#1a6b6b] text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                {mode === FORM_MODES.ADMIN_EDIT ? 'Update Business' : 'Save Business'}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}