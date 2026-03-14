import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, CheckCircle, AlertCircle, Users, TrendingUp, Globe, Target, Lightbulb, Rocket, ChevronDown, ChevronUp } from "lucide-react";
import { BUSINESS_STAGE, TEAM_SIZE_BAND, INDUSTRIES, FOUNDER_MOTIVATIONS, BUSINESS_CHALLENGES, SUPPORT_NEEDS, GOALS_NEXT_12_MONTHS, COMMUNITY_IMPACT_AREAS, FAMILY_RESPONSIBILITIES, GENDER_OPTIONS, AGE_RANGES, COUNTRIES } from "@/constants/unifiedConstants";

const STEPS = [
  { key: "founder", label: "Founder Background", icon: Users },
  { key: "business", label: "Business Reality", icon: TrendingUp },
  { key: "pacific", label: "Pacific Context", icon: Globe },
  { key: "challenges", label: "Challenges & Support", icon: AlertCircle },
  { key: "growth", label: "Growth & Future", icon: Rocket },
  { key: "community", label: "Community & Impact", icon: Lightbulb },
];

const DEFAULT_FORM_STATE = {
  // Founder Background
  gender: "",
  age_range: "",
  years_entrepreneurial: "",
  businesses_founded: "",
  founder_role: "",
  founder_motivation_array: [],
  founder_story: "",

  // Business Reality
  business_operating_status: "",
  business_age: "",
  industry: "",
  team_size_band: "",
  revenue_band: "",
  business_registered: false,
  employs_anyone: false,
  employs_family_community: false,
  sales_channels: [],

  // Pacific Context
  pacific_identity: [],
  based_in_country: "",
  based_in_city: "",
  serves_pacific_communities: "",
  culture_influences_business: false,
  culture_influence_details: "",
  family_community_responsibilities_affect_business: [],
  responsibilities_impact_details: "",

  // Challenges & Support
  top_challenges_array: [],
  support_needed_next_array: [],
  current_support_sources_array: [],
  mentorship_access: false,

  // Growth & Future
  growth_stage: "",
  goals_next_12_months_array: [],
  goals_details: "",
  hiring_intentions: false,
  expansion_plans: false,

  // Community & Impact
  community_impact_areas_array: [],
  collaboration_interest: false,
  mentorship_offering: false,
  open_to_future_contact: false,
};

const buildInitialFormState = (data = null) => {
  const initialState = {
    ...DEFAULT_FORM_STATE,
    // Merge with existing data if provided
    ...(data && {
      // Only merge fields that exist in DEFAULT_FORM_STATE
      ...Object.keys(DEFAULT_FORM_STATE).reduce((acc, key) => {
        if (data[key] !== undefined) {
          acc[key] = data[key];
        }
        return acc;
      }, {}),
    }),
    current_support_sources: data.current_support_sources ?? DEFAULT_FORM_STATE.current_support_sources,
    pacific_identity: data.pacific_identity ?? DEFAULT_FORM_STATE.pacific_identity,
    community_impact_areas_array: data.community_impact_areas_array ?? DEFAULT_FORM_STATE.community_impact_areas_array,
  };

  console.log("buildInitialFormState result:", initialState);
  return initialState;
};

export default function FounderInsightsForm({ businessId, onSubmit, isLoading, initialData = null }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(() => buildInitialFormState(initialData));

  useEffect(() => {
    console.log("InitialData changed:", initialData);
    console.log("Form state before reset:", form);
    setForm(buildInitialFormState(initialData));
    console.log("Form state after reset:", buildInitialFormState(initialData));
  }, [initialData]);

  const [submitting, setSubmitting] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState(null);

  useEffect(() => {
    if (!autoSaveStatus) return;
    const timer = setTimeout(() => setAutoSaveStatus(null), 2000);
    return () => clearTimeout(timer);
  }, [autoSaveStatus]);

  const updateStep = (newStep) => {
    setStep(newStep);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setAutoSaveStatus("saving");
    try {
      // Import getSupabase dynamically
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      // Map array fields to database column names
      const snapshotData = {
        ...form,
        user_id: user.id,
        business_id: businessId ?? null,
        snapshot_year: new Date().getFullYear(),
        submitted_date: new Date().toISOString(),
      };

      console.log("=== SUBMISSION DEBUG ===");
      console.log("Complete form state:", form);
      console.log("Submitting data:", snapshotData); 
      console.log("Gender:", snapshotData.gender); 
      console.log("Age Range:", snapshotData.age_range); 
      console.log("========================");

      await onSubmit(snapshotData);
      setAutoSaveStatus("saved");
    } catch (error) {
      console.error("Failed to submit founder insights:", error);
      setAutoSaveStatus("error");
      alert("Failed to submit insights. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const canGoNext = () => true;

  const addArrayItem = (field, item) => {
    setForm(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), item]
    }));
  };

  const removeArrayItem = (field, index) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const inputCls =
    "w-full min-h-[44px] border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#0a1628] placeholder:text-gray-400 focus:outline-none focus:border-[#0d4f4f] focus:ring-2 focus:ring-[#0d4f4f]/10 bg-white";
  const labelCls = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";
  const sectionCardCls = "rounded-2xl border border-gray-100 bg-white p-4 sm:p-6";

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Stepper */}
      <div className="mb-8">
        {/* Mobile stepper */}
        <div className="sm:hidden space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#0d4f4f]">
              Step {step} of {STEPS.length}
            </span>
            <span className="text-xs text-gray-500">
              {Math.round((step / STEPS.length) * 100)}%
            </span>
          </div>

          <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#0d4f4f] transition-all duration-300"
              style={{ width: `${(step / STEPS.length) * 100}%` }}
            />
          </div>

          <div className="flex items-center gap-2">
            {(() => {
              const CurrentIcon = STEPS[step - 1]?.icon;
              return CurrentIcon ? (
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0d4f4f]/10">
                  <CurrentIcon className="w-4 h-4 text-[#0d4f4f]" />
                </div>
              ) : null;
            })()}
            <div>
              <p className="text-sm font-semibold text-[#0a1628]">
                {STEPS[step - 1]?.label}
              </p>
            </div>
          </div>
        </div>

        {/* Desktop stepper */}
        <div className="hidden sm:flex items-center justify-between">
          {STEPS.map((stepInfo, index) => (
            <div key={stepInfo.key} className="flex items-center min-w-0">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${
                  index + 1 < step
                    ? "bg-[#0d4f4f] text-white"
                    : index + 1 === step
                    ? "bg-[#0d4f4f] text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {index + 1}
              </div>

              <span
                className={`ml-2 text-sm whitespace-nowrap ${
                  index + 1 <= step
                    ? "text-[#0d4f4f] font-medium"
                    : "text-gray-400"
                }`}
              >
                {stepInfo.label}
              </span>

              {index < STEPS.length - 1 && (
                <div
                  className={`w-8 lg:w-12 h-0.5 mx-2 lg:mx-3 ${
                    index + 1 < step ? "bg-[#0d4f4f]" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Founder Background */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-[#0d4f4f]/10 to-[#0a1628]/10 rounded-2xl p-5 sm:p-6 mb-6">
            <h3 className="font-bold text-[#0a1628] text-lg mb-2">Founder Background</h3>
            <p className="text-gray-600 text-sm">Help us understand the person behind the business.</p>
          </div>

          <div className={sectionCardCls}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelCls}>Gender</label>
              <select value={form.gender || ""} onChange={e => {
                console.log("=== GENDER CHANGE DEBUG ===");
                console.log("Event target value:", e.target.value);
                console.log("Current form.gender:", form.gender);
                console.log("Setting new gender to:", e.target.value);
                setForm({ ...form, gender: e.target.value });
                console.log("Gender change handler completed");
                console.log("==========================");
              }} className={inputCls}>
                <option value="">Select gender</option>
                {GENDER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelCls}>Age Range</label>
              <select value={form.age_range || ""} onChange={e => {
                console.log("=== AGE CHANGE DEBUG ===");
                console.log("Event target value:", e.target.value);
                console.log("Current form.age_range:", form.age_range);
                console.log("Setting new age_range to:", e.target.value);
                setForm({ ...form, age_range: e.target.value });
                console.log("Age change handler completed");
                console.log("========================");
              }} className={inputCls}>
                <option value="">Select age range</option>
                {AGE_RANGES.map((range) => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelCls}>How many years have you been an entrepreneur?</label>
              <select value={form.years_entrepreneurial || ""} onChange={e => setForm({ ...form, years_entrepreneurial: e.target.value })} className={inputCls}>
                <option value="">Select years</option>
                <option value="0-1">Less than 1 year</option>
                <option value="1-3">1-3 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5-10">5-10 years</option>
                <option value="10+">More than 10 years</option>
              </select>
            </div>

            <div>
              <label className={labelCls}>Is this your first business?</label>
              <select value={form.businesses_founded || ""} onChange={e => setForm({ ...form, businesses_founded: e.target.value })} className={inputCls}>
                <option value="">Select option</option>
                <option value="first">Yes, this is my first business</option>
                <option value="multiple">No, I've founded other businesses before</option>
              </select>
            </div>

            <div>
              <label className={labelCls}>What best describes your current business role?</label>
              <select value={form.founder_role || ""} onChange={e => setForm({ ...form, founder_role: e.target.value })} className={inputCls}>
                <option value="">Select role</option>
                <option value="founder">Founder/Owner</option>
                <option value="cofounder">Co-founder</option>
                <option value="partner">Partner</option>
                <option value="director">Director</option>
                <option value="manager">Manager</option>
                <option value="multiple">Multiple roles</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>What motivates you most as a founder? (Select up to 3)</label>
            <div className="space-y-2">
              {FOUNDER_MOTIVATIONS.map(motivation => (
                <label key={motivation.value} className="flex items-start gap-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.founder_motivation_array?.includes(motivation.value)}
                    onChange={e => {
                      if (e.target.checked) {
                        setForm(prev => ({ 
                          ...prev, 
                          founder_motivation_array: [...(prev.founder_motivation_array || []), motivation.value].slice(0, 3)
                        }));
                      } else {
                        setForm(prev => ({ 
                          ...prev, 
                          founder_motivation_array: prev.founder_motivation_array?.filter(m => m !== motivation.value) || []
                        }));
                      }
                    }}
                    className="rounded border-gray-300 text-[#0d4f4f] focus:ring-[#0d4f4f] mt-0.5"
                  />
                  <span className="text-sm leading-5">{motivation.label}</span>
                </label>
              ))}
            </div>
            {form.founder_motivation_array?.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">Selected: {form.founder_motivation_array.length}/3</p>
            )}
          </div>

          <div>
            <label className={labelCls}>Tell us a little about your founder journey</label>
            <textarea
              value={form.founder_story || ""}
              onChange={e => setForm({ ...form, founder_story: e.target.value })}
              rows={3}
              placeholder="Share your story, what led you to entrepreneurship, or any context you'd like to provide..."
              className={`${inputCls} resize-none`}
            />
          </div>
          </div>
        </div>
      )}

      {/* Step 2: Business Reality */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-[#0d4f4f]/10 to-[#0a1628]/10 rounded-2xl p-5 sm:p-6 mb-6">
            <h3 className="font-bold text-[#0a1628] text-lg mb-2">Business Reality</h3>
            <p className="text-gray-600 text-sm">Help us understand the actual operating shape of your business.</p>
          </div>

          <div className={sectionCardCls}>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelCls}>Is this business full-time, part-time, or seasonal?</label>
              <select value={form.business_operating_status || ""} onChange={e => setForm({ ...form, business_operating_status: e.target.value })} className={inputCls}>
                <option value="">Select status</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="seasonal">Seasonal</option>
                <option value="side-business">Side business</option>
              </select>
            </div>

            <div>
              <label className={labelCls}>How long has this business been operating?</label>
              <select value={form.business_age || ""} onChange={e => setForm({ ...form, business_age: e.target.value })} className={inputCls}>
                <option value="">Select age</option>
                <option value="0-6months">Less than 6 months</option>
                <option value="6months-1year">6 months - 1 year</option>
                <option value="1-2years">1-2 years</option>
                <option value="2-5years">2-5 years</option>
                <option value="5-10years">5-10 years</option>
                <option value="10+years">More than 10 years</option>
              </select>
            </div>

            <div>
              <label className={labelCls}>Primary Industry *</label>
              <select value={form.industry || ""} onChange={e => setForm({ ...form, industry: e.target.value })} className={inputCls}>
                <option value="">Select industry</option>
                <option value="retail">Retail</option>
                <option value="hospitality">Hospitality/Food & Beverage</option>
                <option value="technology">Technology</option>
                <option value="agriculture">Agriculture/Fishing</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="services">Professional Services</option>
                <option value="creative">Creative/Arts</option>
                <option value="education">Education/Training</option>
                <option value="healthcare">Healthcare/Wellness</option>
                <option value="construction">Construction/Trades</option>
                <option value="transport">Transport/Logistics</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className={labelCls}>Current Team Size *</label>
              <select value={form.team_size_band || ""} onChange={e => setForm({ ...form, team_size_band: e.target.value })} className={inputCls}>
                <option value="">Select team size</option>
                <option value={TEAM_SIZE_BAND[0].value}>{TEAM_SIZE_BAND[0].label}</option>
                <option value={TEAM_SIZE_BAND[1].value}>{TEAM_SIZE_BAND[1].label}</option>
                <option value={TEAM_SIZE_BAND[2].value}>{TEAM_SIZE_BAND[2].label}</option>
                <option value={TEAM_SIZE_BAND[3].value}>{TEAM_SIZE_BAND[3].label}</option>
                <option value={TEAM_SIZE_BAND[4].value}>{TEAM_SIZE_BAND[4].label}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className={labelCls}>Is the business formally registered? *</label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mt-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="business_registered"
                    checked={form.business_registered === true}
                    onChange={() => setForm({ ...form, business_registered: true })}
                    className="w-4 h-4 text-[#0d4f4f] border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="business_registered"
                    checked={form.business_registered === false}
                    onChange={() => setForm({ ...form, business_registered: false })}
                    className="w-4 h-4 text-[#0d4f4f] border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">No</span>
                </label>
              </div>
            </div>

            <div>
              <label className={labelCls}>Do you currently employ anyone? *</label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mt-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="employs_anyone"
                    checked={form.employs_anyone === true}
                    onChange={() => setForm({ ...form, employs_anyone: true })}
                    className="w-4 h-4 text-[#0d4f4f] border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="employs_anyone"
                    checked={form.employs_anyone === false}
                    onChange={() => setForm({ ...form, employs_anyone: false })}
                    className="w-4 h-4 text-[#0d4f4f] border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">No</span>
                </label>
              </div>
            </div>

            <div>
              <label className={labelCls}>Do you employ family/community members? *</label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mt-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="employs_family_community"
                    checked={form.employs_family_community === true}
                    onChange={() => setForm({ ...form, employs_family_community: true })}
                    className="w-4 h-4 text-[#0d4f4f] border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="employs_family_community"
                    checked={form.employs_family_community === false}
                    onChange={() => setForm({ ...form, employs_family_community: false })}
                    className="w-4 h-4 text-[#0d4f4f] border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">No</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className={labelCls}>How do you mainly sell? (Select all that apply)</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
              {['In-person', 'Online', 'Wholesale', 'Services', 'Mixed channels'].map(channel => (
                <label key={channel} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.sales_channels?.includes(channel)}
                    onChange={e => {
                      if (e.target.checked) {
                        setForm(prev => ({ 
                          ...prev, 
                          sales_channels: [...(prev.sales_channels || []), channel]
                        }));
                      } else {
                        setForm(prev => ({ 
                          ...prev, 
                          sales_channels: prev.sales_channels?.filter(c => c !== channel) || []
                        }));
                      }
                    }}
                    className="rounded border-gray-300 text-[#0d4f4f]"
                  />
                  <span className="text-sm">{channel}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className={labelCls}>Current revenue stage (Optional)</label>
            <select value={form.revenue_band || ""} onChange={e => setForm({ ...form, revenue_band: e.target.value })} className={inputCls}>
              <option value="">Select revenue range (optional)</option>
              <option value="pre-revenue">Pre-revenue</option>
              <option value="under-10k">Under $10,000</option>
              <option value="10k-25k">$10,000 - $25,000</option>
              <option value="25k-50k">$25,000 - $50,000</option>
              <option value="50k-100k">$50,000 - $100,000</option>
              <option value="100k-250k">$100,000 - $250,000</option>
              <option value="250k-500k">$250,000 - $500,000</option>
              <option value="500k-1m">$500,000 - $1M</option>
              <option value="1m-5m">$1M - $5M</option>
              <option value="5m+">$5M+</option>
            </select>
          </div>

          </div>
        </div>
      )}

      {/* Step 3: Pacific Context */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-[#0d4f4f]/10 to-[#0a1628]/10 rounded-2xl p-5 sm:p-6 mb-6">
            <h3 className="font-bold text-[#0a1628] text-lg mb-2">Pacific Context</h3>
            <p className="text-gray-600 text-sm">Help us understand your Pacific identity and how it shapes your business.</p>
          </div>

          <div className={sectionCardCls}>
          {/* Short fields first */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelCls}>Where are you currently based? (Country) *</label>
              <select value={form.based_in_country || ""} onChange={e => setForm({ ...form, based_in_country: e.target.value })} className={inputCls}>
                <option value="">Select country</option>
                {COUNTRIES.map(country => (
                  <option key={`country-${country.value}`} value={country.value}>{country.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelCls}>City or region (Optional)</label>
              <input
                type="text"
                value={form.based_in_city || ""}
                onChange={e => setForm({ ...form, based_in_city: e.target.value })}
                placeholder="e.g. Auckland, Suva, Honolulu"
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Does your business mainly serve Pacific communities, mixed communities, or a broader audience? *</label>
            <select value={form.serves_pacific_communities || ""} onChange={e => setForm({ ...form, serves_pacific_communities: e.target.value })} className={inputCls}>
              <option value="">Select audience</option>
              <option value="mainly-pacific">Mainly Pacific communities</option>
              <option value="mixed-communities">Mixed communities</option>
              <option value="mainstream-general">Mainstream/general market</option>
              <option value="export-international">Export/international market</option>
              <option value="not-sure-yet">Not sure yet</option>
            </select>
          </div>

          <div className="space-y-4">
            <div>
              <label className={labelCls}>Does culture influence your products, services, or brand? *</label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mt-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="culture_influences_business"
                    checked={form.culture_influences_business === true}
                    onChange={() => setForm({ ...form, culture_influences_business: true })}
                    className="w-4 h-4 text-[#0d4f4f] border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="culture_influences_business"
                    checked={form.culture_influences_business === false}
                    onChange={() => setForm({ ...form, culture_influences_business: false })}
                    className="w-4 h-4 text-[#0d4f4f] border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">No</span>
                </label>
              </div>
            </div>
          </div>

          {/* Long checkbox groups after */}
          <div>
            <label className={labelCls}>Which Pacific communities do you identify with? (Select all that apply) *</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
              {COUNTRIES.map(country => (
                <label key={country.value} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.pacific_identity?.includes(country.value)}
                    onChange={e => {
                      if (e.target.checked) {
                        setForm(prev => ({ 
                          ...prev, 
                          pacific_identity: [...(prev.pacific_identity || []), country.value]
                        }));
                      } else {
                        setForm(prev => ({ 
                          ...prev, 
                          pacific_identity: prev.pacific_identity?.filter(c => c !== country.value) || []
                        }));
                      }
                    }}
                    className="rounded border-gray-300 text-[#0d4f4f] focus:ring-[#0d4f4f]"
                  />
                  <span className="text-sm">{country.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className={labelCls}>What family commitments do you have alongside your business responsibilities? (Select all that apply)</label>
              <div className="space-y-2 mt-3">
                {FAMILY_RESPONSIBILITIES.map((responsibility) => (
                  <label key={responsibility.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={form.family_community_responsibilities_affect_business.includes(responsibility.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setForm({ 
                            ...form, 
                            family_community_responsibilities_affect_business: [...form.family_community_responsibilities_affect_business, responsibility.value]
                          });
                        } else {
                          setForm({ 
                            ...form, 
                            family_community_responsibilities_affect_business: form.family_community_responsibilities_affect_business.filter(r => r !== responsibility.value)
                          });
                        }
                      }}
                      className="w-4 h-4 text-[#0d4f4f] border-gray-300 rounded focus:ring-[#0d4f4f]"
                    />
                    <span className="ml-2 text-sm text-gray-700">{responsibility.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {form.family_community_responsibilities_affect_business.length > 0 && (
              <div>
                <label className={labelCls}>Tell us how these responsibilities impact your business (Optional)</label>
                <textarea
                  value={form.responsibilities_impact_details || ""}
                  onChange={e => setForm({ ...form, responsibilities_impact_details: e.target.value })}
                  rows={2}
                  placeholder="Share how family, community, or cultural obligations influence your business decisions or operations..."
                  className={`${inputCls} resize-none`}
                />
              </div>
            )}
          </div>

          {/* Optional textareas last */}
          {form.culture_influences_business && (
            <div>
              <label className={labelCls}>Tell us more about how culture influences your business (Optional)</label>
              <textarea
                value={form.culture_influence_details || ""}
                onChange={e => setForm({ ...form, culture_influence_details: e.target.value })}
                rows={2}
                placeholder="Share how culture, tradition, or Pacific identity shapes your products, services, or brand..."
                className={`${inputCls} resize-none`}
              />
            </div>
          )}
          </div>
        </div>
      )}
      {step === 4 && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-[#0d4f4f]/10 to-[#0a1628]/10 rounded-2xl p-5 sm:p-6 mb-6">
            <h3 className="font-bold text-[#0a1628] text-lg mb-2">Challenges & Support</h3>
            <p className="text-gray-600 text-sm">Help us identify real barriers and support gaps for Pacific founders.</p>
          </div>

          <div className={sectionCardCls}>

          <div>
            <label className={labelCls}>What are your biggest challenges right now? (Select up to 5) *</label>
            <div className="space-y-2">
              {BUSINESS_CHALLENGES.map(challenge => (
                <label key={challenge.value} className="flex items-start gap-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.top_challenges_array?.includes(challenge.value)}
                    onChange={e => {
                      if (e.target.checked) {
                        setForm(prev => ({ 
                          ...prev, 
                          top_challenges_array: [...(prev.top_challenges_array || []), challenge.value].slice(0, 5)
                        }));
                      } else {
                        setForm(prev => ({ 
                          ...prev, 
                          top_challenges_array: prev.top_challenges_array?.filter(c => c !== challenge.value) || []
                        }));
                      }
                    }}
                    className="rounded border-gray-300 text-[#0d4f4f] mt-0.5"
                  />
                  <span className="text-sm leading-5">{challenge.label}</span>
                </label>
              ))}
            </div>
            {form.top_challenges_array?.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">Selected: {form.top_challenges_array.length}/5</p>
            )}
          </div>

          <div>
            <label className={labelCls}>What support would help your business most in the next 12 months? (Select up to 3) *</label>
            <div className="space-y-2">
              {SUPPORT_NEEDS.map(support => (
                <label key={support.value} className="flex items-start gap-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.support_needed_next_array?.includes(support.value)}
                    onChange={e => {
                      if (e.target.checked) {
                        setForm(prev => ({ 
                          ...prev, 
                          support_needed_next_array: [...(prev.support_needed_next_array || []), support.value].slice(0, 3)
                        }));
                      } else {
                        setForm(prev => ({ 
                          ...prev, 
                          support_needed_next_array: prev.support_needed_next_array?.filter(s => s !== support.value) || []
                        }));
                      }
                    }}
                    className="rounded border-gray-300 text-[#0d4f4f] mt-0.5"
                  />
                  <span className="text-sm leading-5">{support.label}</span>
                </label>
              ))}
            </div>
            {form.support_needed_next_array?.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">Selected: {form.support_needed_next_array.length}/3</p>
            )}
          </div>

          <div>
            <label className={labelCls}>Where do you currently get support from? (Optional)</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
              {['Family & friends', 'Business networks', 'Government programs', 'Mentors/advisors', 'Online communities', 'Industry associations', 'Financial institutions', 'Incubators/accelerators', 'Educational institutions', 'Church/faith community', 'Cultural organizations', 'Other'].map(source => (
                <label key={source} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.current_support_sources_array?.includes(source)}
                    onChange={e => {
                      if (e.target.checked) {
                        setForm(prev => ({ 
                          ...prev, 
                          current_support_sources_array: [...(prev.current_support_sources_array || []), source]
                        }));
                      } else {
                        setForm(prev => ({ 
                          ...prev, 
                          current_support_sources_array: prev.current_support_sources_array?.filter(s => s !== source) || []
                        }));
                      }
                    }}
                    className="rounded border-gray-300 text-[#0d4f4f]"
                  />
                  <span className="text-sm">{source}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className={labelCls}>Do you have access to a mentor or advisor? (Optional)</label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mt-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="mentorship_access"
                  checked={form.mentorship_access === true}
                  onChange={() => setForm({ ...form, mentorship_access: true })}
                  className="w-4 h-4 text-[#0d4f4f] border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Yes</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="mentorship_access"
                  checked={form.mentorship_access === false}
                  onChange={() => setForm({ ...form, mentorship_access: false })}
                  className="w-4 h-4 text-[#0d4f4f] border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">No</span>
              </label>
            </div>
          </div>
          </div>
        </div>
      )}

      {/* Step 5: Growth & Future */}
      {step === 5 && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-[#0d4f4f]/10 to-[#0a1628]/10 rounded-2xl p-5 sm:p-6 mb-6">
            <h3 className="font-bold text-[#0a1628] text-lg mb-2">Growth & Future</h3>
            <p className="text-gray-600 text-sm">Help us understand your ambition, readiness, and next-stage needs.</p>
          </div>

          <div className={sectionCardCls}>

          <div>
            <label className={labelCls}>What stage best describes your business today? *</label>
            <select value={form.growth_stage || ""} onChange={e => setForm({ ...form, growth_stage: e.target.value })} className={inputCls}>
              <option value="">Select stage</option>
              <option value={BUSINESS_STAGE[0].value}>{BUSINESS_STAGE[0].label}</option>
              <option value={BUSINESS_STAGE[1].value}>{BUSINESS_STAGE[1].label}</option>
              <option value={BUSINESS_STAGE[2].value}>{BUSINESS_STAGE[2].label}</option>
              <option value={BUSINESS_STAGE[3].value}>{BUSINESS_STAGE[3].label}</option>
            </select>
          </div>

          <div>
            <label className={labelCls}>What are your top goals for the next 12 months? (Select up to 3) *</label>
            <div className="space-y-2">
              {GOALS_NEXT_12_MONTHS.map(goal => (
                <label key={goal.value} className="flex items-start gap-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.goals_next_12_months_array?.includes(goal.value)}
                    onChange={e => {
                      if (e.target.checked) {
                        setForm(prev => ({ 
                          ...prev, 
                          goals_next_12_months_array: [...(prev.goals_next_12_months_array || []), goal.value].slice(0, 3)
                        }));
                      } else {
                        setForm(prev => ({ 
                          ...prev, 
                          goals_next_12_months_array: prev.goals_next_12_months_array?.filter(g => g !== goal.value) || []
                        }));
                      }
                    }}
                    className="rounded border-gray-300 text-[#0d4f4f] mt-0.5"
                  />
                  <span className="text-sm leading-5">{goal.label}</span>
                </label>
              ))}
            </div>
            {form.goals_next_12_months_array?.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">Selected: {form.goals_next_12_months_array.length}/3</p>
            )}
          </div>

          <div>
            <label className={labelCls}>Tell us more about your main goal this year (Optional)</label>
            <textarea
              value={form.goals_details || ""}
              onChange={e => setForm({ ...form, goals_details: e.target.value })}
              rows={2}
              placeholder="Share more details about your most important goal for the next 12 months..."
              className={`${inputCls} resize-none`}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelCls}>Do you plan to hire in the next 12 months? *</label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mt-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hiring_intentions"
                    checked={form.hiring_intentions === true}
                    onChange={() => setForm({ ...form, hiring_intentions: true })}
                    className="w-4 h-4 text-[#0d4f4f] border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hiring_intentions"
                    checked={form.hiring_intentions === false}
                    onChange={() => setForm({ ...form, hiring_intentions: false })}
                    className="w-4 h-4 text-[#0d4f4f] border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">No</span>
                </label>
              </div>
            </div>

            <div>
              <label className={labelCls}>Are you planning to expand into new markets? *</label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mt-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="expansion_plans"
                    checked={form.expansion_plans === true}
                    onChange={() => setForm({ ...form, expansion_plans: true })}
                    className="w-4 h-4 text-[#0d4f4f] border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="expansion_plans"
                    checked={form.expansion_plans === false}
                    onChange={() => setForm({ ...form, expansion_plans: false })}
                    className="w-4 h-4 text-[#0d4f4f] border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">No</span>
                </label>
              </div>
            </div>
          </div>
          </div>
        </div>
      )}

      {/* Step 6: Community & Impact */}
      {step === 6 && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-[#0d4f4f]/10 to-[#0a1628]/10 rounded-2xl p-5 sm:p-6 mb-6">
            <h3 className="font-bold text-[#0a1628] text-lg mb-2">Community & Impact</h3>
            <p className="text-gray-600 text-sm">Help us understand your values, collaboration, and ecosystem potential.</p>
          </div>

          <div className={sectionCardCls}>

          <div>
            <label className={labelCls}>In what ways does your business create impact? (Select all that apply)</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
              {COMMUNITY_IMPACT_AREAS.map(impact => (
                <label key={impact.value} className="flex items-start gap-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.community_impact_areas_array?.includes(impact.value)}
                    onChange={e => {
                      if (e.target.checked) {
                        setForm(prev => ({ 
                          ...prev, 
                          community_impact_areas_array: [...(prev.community_impact_areas_array || []), impact.value]
                        }));
                      } else {
                        setForm(prev => ({ 
                          ...prev, 
                          community_impact_areas_array: prev.community_impact_areas_array?.filter(i => i !== impact.value) || []
                        }));
                      }
                    }}
                    className="rounded border-gray-300 text-[#0d4f4f] mt-0.5"
                  />
                  <span className="text-sm leading-5">{impact.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className={labelCls}>Are you interested in partnerships or collaborations? (Optional)</label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mt-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="collaboration_interest"
                  checked={form.collaboration_interest === true}
                  onChange={() => setForm({ ...form, collaboration_interest: true })}
                  className="w-4 h-4 text-[#0d4f4f] border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Yes</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="collaboration_interest"
                  checked={form.collaboration_interest === false}
                  onChange={() => setForm({ ...form, collaboration_interest: false })}
                  className="w-4 h-4 text-[#0d4f4f] border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">No</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelCls}>Would you be open to mentoring others in future? (Optional)</label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mt-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="mentorship_offering"
                    checked={form.mentorship_offering === true}
                    onChange={() => setForm({ ...form, mentorship_offering: true })}
                    className="w-4 h-4 text-[#0d4f4f] border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="mentorship_offering"
                    checked={form.mentorship_offering === false}
                    onChange={() => setForm({ ...form, mentorship_offering: false })}
                    className="w-4 h-4 text-[#0d4f4f] border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">No</span>
                </label>
              </div>
            </div>

            <div>
              <label className={labelCls}>Would you like to be contacted about future Pacific Market opportunities? (Optional)</label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mt-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="open_to_future_contact"
                    checked={form.open_to_future_contact === true}
                    onChange={() => setForm({ ...form, open_to_future_contact: true })}
                    className="w-4 h-4 text-[#0d4f4f] border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="open_to_future_contact"
                    checked={form.open_to_future_contact === false}
                    onChange={() => setForm({ ...form, open_to_future_contact: false })}
                    className="w-4 h-4 text-[#0d4f4f] border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">No</span>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-blue-900">Thank you for sharing your founder journey!</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Your insights help us build a stronger picture of Pacific entrepreneurship and identify how we can better support founders like you.
                </p>
              </div>
            </div>
          </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-3 pt-6 border-t border-gray-200">
        <button
          onClick={() => updateStep(step - 1)}
          disabled={step === 1}
          className="inline-flex min-h-[44px] w-full sm:w-auto items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        {step < STEPS.length ? (
          <button
            onClick={() => updateStep(step + 1)}
            disabled={!canGoNext()}
            className="inline-flex min-h-[44px] w-full sm:w-auto items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#0d4f4f] rounded-xl hover:bg-[#0a5555] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting || !canGoNext()}
            className="inline-flex min-h-[44px] w-full sm:w-auto items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white bg-[#0d4f4f] rounded-xl hover:bg-[#0a5555] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit Insights'}
            <CheckCircle className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
