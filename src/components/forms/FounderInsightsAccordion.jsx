import { useState, useEffect, useCallback } from "react";
import { ChevronDown, ChevronUp, Users, TrendingUp, Globe, AlertCircle, Rocket, Lightbulb, CheckCircle } from "lucide-react";
import { BUSINESS_STAGE, TEAM_SIZE_BAND, INDUSTRIES, FOUNDER_MOTIVATIONS, BUSINESS_CHALLENGES, SUPPORT_NEEDS, GOALS_NEXT_12_MONTHS, COMMUNITY_IMPACT_AREAS, COUNTRIES, FUNDING_SOURCES, FUNDING_AMOUNTS, FUNDING_PURPOSES, INVESTMENT_STAGES, INVESTMENT_EXPLORATION, INVESTMENT_TIMELINE, ANGEL_INVESTOR_INTEREST, INVESTOR_CAPACITY, REVENUE_STREAMS } from "@/constants/unifiedConstants";
import { getSupabase } from "@/lib/supabase/client";

// Simple debounce function
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Auto-save configuration
const AUTO_SAVE_DELAY = 2000; // 2 seconds
const AUTO_SAVE_DEBOUNCE = 500; // 500ms debounce

const SECTIONS = [
  { key: "founder", label: "Founder Background", icon: Users, description: "Help us understand the person behind the business" },
  { key: "pacific", label: "Pacific Context", icon: Globe, description: "Help us understand your Pacific identity and how it shapes your business" },
  { key: "financial", label: "Financial & Investment", icon: TrendingUp, description: "Help us understand your funding needs and financial situation" },
  { key: "challenges", label: "Challenges & Support", icon: AlertCircle, description: "Help us identify real barriers and support gaps for Pacific founders" },
  { key: "growth", label: "Growth & Future", icon: Rocket, description: "Help us understand your ambition, readiness, and next-stage needs" },
  { key: "community", label: "Community & Impact", icon: Lightbulb, description: "Help us understand your values, collaboration, and ecosystem potential" },
];

export default function FounderInsightsForm({ businessId, onSubmit, isLoading, initialData = null }) {
  const [expandedSections, setExpandedSections] = useState(new Set(['founder']));
  const [form, setForm] = useState(initialData || {
    // Founder Background (unique to business insights)
    businesses_founded: "",
    founder_role: "",
    founder_motivation_array: [],
    founder_story: "",
    
    // Pacific Context (unique insights - not duplicated from profile)
    serves_pacific_communities: "",
    culture_influences_business: false,
    culture_influence_details: "",
    family_community_responsibilities_affect_business: false,
    responsibilities_impact_details: "",
    
    // Financial & Investment (unique to business insights)
    current_funding_source: "",
    funding_amount_needed: "",
    funding_purpose: "",
    investment_stage: "",
    angel_investor_interest: "",
    investor_capacity: "",
    revenue_streams: [],
    financial_challenges: "",
    
    // Challenges & Support (unique to business insights)
    top_challenges: [],
    support_needed_next: [],
    
    // Growth & Future (unique to business insights)
    business_stage: "",
    goals_next_12_months_array: [],
    goals_details: "",
    hiring_intentions: false,
    expansion_plans: false,
    
    // Community & Impact (unique to business insights)
    community_impact_areas: [],
    collaboration_interest: false,
    mentorship_offering: false,
    open_to_future_contact: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);
  const [autoSaveTimer, setAutoSaveTimer] = useState(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionKey)) {
        newSet.delete(sectionKey);
      } else {
        newSet.add(sectionKey);
      }
      return newSet;
    });
  };

  const handleSubmit = async () => {
    setSubmitAttempted(true);
    setSubmitting(true);
    
    try {
      const supabase = getSupabase();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      // Check if form is valid before submitting
      if (!canSubmit()) {
        setSubmitting(false);
        return;
      }

      // Map array fields to database column names
      const snapshotData = {
        ...form,
        user_id: user.id,
        business_id: businessId ?? null,
        snapshot_year: new Date().getFullYear(),
        submitted_date: new Date().toISOString(),
        // Map array fields to correct database columns
        founder_motivation: form.founder_motivation_array,
        goals_next_12_months: form.goals_next_12_months_array,
        // Remove the temporary array fields
        founder_motivation_array: undefined,
        goals_next_12_months_array: undefined,
      };

      await onSubmit(snapshotData);
      setLastSaved(new Date().toISOString());
      setAutoSaveStatus('saved');
      setSubmitAttempted(false); // Reset on successful submission
    } catch (error) {
      console.error("Failed to submit founder insights:", error);
      alert("Failed to submit insights. Please try again.");
      setAutoSaveStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  // Auto-save functionality
  const autoSave = async () => {
    try {
      const supabase = getSupabase();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || !form || Object.keys(form).length === 0) return;
      
      setAutoSaveStatus('saving');
      
      const snapshotData = {
        ...form,
        user_id: user.id,
        business_id: businessId ?? null,
        snapshot_year: new Date().getFullYear(),
        submitted_date: new Date().toISOString(),
        is_autosave: true,
        // Map array fields to correct database columns
        founder_motivation: form.founder_motivation_array,
        goals_next_12_months: form.goals_next_12_months_array,
        // Remove the temporary array fields
        founder_motivation_array: undefined,
        goals_next_12_months_array: undefined,
      };

      // Save to local storage for auto-saved drafts
      const draftKey = `founder_insights_draft_${user.id}_${businessId || 'new'}`;
      localStorage.setItem(draftKey, JSON.stringify({
        data: snapshotData,
        timestamp: new Date().toISOString()
      }));
      
      setLastSaved(new Date().toISOString());
      setAutoSaveStatus('saved');
    } catch (error) {
      console.error("Auto-save failed:", error);
      setAutoSaveStatus('error');
    }
  };

  // Debounced auto-save
  const debouncedAutoSave = useCallback(
    debounce(() => {
      autoSave();
    }, AUTO_SAVE_DEBOUNCE),
    []
  );

  // Clear auto-save timer
  const clearAutoSaveTimer = () => {
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
      setAutoSaveTimer(null);
    }
  };

  // Start auto-save timer
  const startAutoSaveTimer = () => {
    clearAutoSaveTimer();
    const timer = setTimeout(() => {
      debouncedAutoSave();
      setAutoSaveTimer(null);
    }, AUTO_SAVE_DELAY);
    setAutoSaveTimer(timer);
  };

  // Auto-save effect
  useEffect(() => {
    if (form && Object.keys(form).length > 0) {
      startAutoSaveTimer();
    }
    return () => clearAutoSaveTimer();
  }, [form, debouncedAutoSave]);

  // Show auto-save status
  useEffect(() => {
    if (autoSaveStatus) {
      const timer = setTimeout(() => setAutoSaveStatus(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [autoSaveStatus]);

  const toggleArrayItem = (field, item) => {
    setForm(prev => {
      const currentArray = prev[field] || [];
      if (currentArray.includes(item)) {
        return { ...prev, [field]: currentArray.filter(i => i !== item) };
      } else {
        const limit = field === 'top_challenges' ? 5 : (field === 'support_needed_next' || field === 'goals_next_12_months_array' || field === 'founder_motivation_array' ? 3 : undefined);
        if (limit && currentArray.length >= limit) {
          return prev; // Don't add if limit reached
        }
        return { ...prev, [field]: [...currentArray, item] };
      }
    });
  };

  const canSubmit = () => {
    // Check required fields for each section (excluding duplicated profile fields and business reality)
    const requiredFields = {
      founder: form.businesses_founded && form.founder_role && form.founder_motivation_array?.length > 0,
      pacific: form.serves_pacific_communities,
      financial: form.current_funding_source, // Only current funding source is required
      challenges: form.top_challenges?.length > 0 && form.support_needed_next?.length > 0,
      growth: form.business_stage && form.goals_next_12_months_array?.length > 0,
      community: true, // All optional in final step
    };
    
    // Check if all required sections are complete
    return Object.values(requiredFields).every(Boolean);
  };

  const getSectionErrors = (sectionKey) => {
    const errors = [];
    
    switch (sectionKey) {
      case 'founder':
        if (!form.businesses_founded) errors.push('Number of businesses founded');
        if (!form.founder_role) errors.push('Founder role');
        if (!form.founder_motivation_array || form.founder_motivation_array.length === 0) errors.push('Founder motivations');
        break;
      case 'pacific':
        if (!form.serves_pacific_communities) errors.push('Main audience');
        break;
      case 'financial':
        if (!form.current_funding_source) errors.push('Current funding source');
        break;
      case 'challenges':
        if (!form.top_challenges || form.top_challenges.length === 0) errors.push('Top challenges');
        if (!form.support_needed_next || form.support_needed_next.length === 0) errors.push('Support needed');
        break;
      case 'growth':
        if (!form.business_stage) errors.push('Business stage');
        if (!form.goals_next_12_months_array || form.goals_next_12_months_array.length === 0) errors.push('12-month goals');
        break;
      case 'community':
        // All optional in community section
        break;
      default:
        break;
    }
    
    return errors;
  };

  const hasSectionErrors = (sectionKey) => {
    return submitAttempted && getSectionErrors(sectionKey).length > 0;
  };

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0d4f4f] focus:ring-1 focus:ring-[#0d4f4f]/20 bg-white";
  const selectCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0d4f4f] focus:ring-1 focus:ring-[#0d4f4f]/20 bg-white pr-10 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzZiNzI4MCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K')] bg-no-repeat bg-[center_right_1rem] bg-[length:0.75rem]";
  const labelCls = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

  const renderSection = (section) => {
    const isExpanded = expandedSections.has(section.key);
    const sectionErrors = getSectionErrors(section.key);
    const hasErrors = hasSectionErrors(section.key);
    
    return (
      <div key={section.key} className={`border rounded-xl overflow-hidden transition-all duration-200 ${
        hasErrors ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
      }`}>
        <button
          onClick={() => toggleSection(section.key)}
          className={`w-full px-6 py-4 flex items-center justify-between text-left transition-colors ${
            isExpanded 
              ? 'bg-red-100 hover:bg-red-200' 
              : 'bg-white hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <section.icon className={`w-5 h-5 ${hasErrors ? 'text-red-600' : 'text-[#0d4f4f]'} mt-0.5`} />
            <div>
              <h4 className={`text-sm font-semibold ${hasErrors ? 'text-red-900' : 'text-[#0a1628]'}`}>
                {section.label}
                {hasErrors && <span className="ml-2 text-xs text-red-600">(Required)</span>}
              </h4>
              <p className={`text-sm ${hasErrors ? 'text-red-700' : 'text-gray-600'}`}>
                {section.description}
                {hasErrors && (
                  <span className="block mt-1 text-xs">
                    Missing: {sectionErrors.join(', ')}
                  </span>
                )}
              </p>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className={`w-5 h-5 ${hasErrors ? 'text-red-600' : 'text-gray-400'} mr-2`} />
          ) : (
            <ChevronDown className={`w-5 h-5 ${hasErrors ? 'text-red-600' : 'text-gray-400'} mr-2`} />
          )}
        </button>
        
        {isExpanded && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            {section.key === 'founder' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={labelCls}>Years as entrepreneur *</label>
                    <select value={form.years_entrepreneurial || ""} onChange={e => setForm({ ...form, years_entrepreneurial: e.target.value })} className={selectCls}>
                      <option value="">Select years</option>
                      <option value="0-1">Less than 1 year</option>
                      <option value="1-3">1-3 years</option>
                      <option value="3-5">3-5 years</option>
                      <option value="5-10">5-10 years</option>
                      <option value="10+">More than 10 years</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>First business? *</label>
                    <select value={form.businesses_founded || ""} onChange={e => setForm({ ...form, businesses_founded: e.target.value })} className={selectCls}>
                      <option value="">Select option</option>
                      <option value="first">Yes, first business</option>
                      <option value="multiple">No, founded others before</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Your role *</label>
                    <select value={form.founder_role || ""} onChange={e => setForm({ ...form, founder_role: e.target.value })} className={selectCls}>
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
                  <label className={labelCls}>What motivates you most? (Select up to 3) *</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {FOUNDER_MOTIVATIONS.map(motivation => (
                      <label key={motivation.value} className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-100 cursor-pointer text-sm">
                        <input
                          type="checkbox"
                          checked={form.founder_motivation_array?.includes(motivation.value)}
                          onChange={() => toggleArrayItem('founder_motivation_array', motivation.value)}
                          className="rounded border-gray-300 text-[#0d4f4f]"
                        />
                        <span>{motivation.label}</span>
                      </label>
                    ))}
                  </div>
                  {form.founder_motivation_array?.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">Selected: {form.founder_motivation_array.length}/3</p>
                  )}
                </div>

                <div>
                  <label className={labelCls}>Your founder journey (Optional)</label>
                  <textarea
                    value={form.founder_story || ""}
                    onChange={e => setForm({ ...form, founder_story: e.target.value })}
                    rows={2}
                    placeholder="Share your story, what led you to entrepreneurship..."
                    className={`${inputCls} resize-none`}
                  />
                </div>
              </div>
            )}

            {section.key === 'pacific' && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Your country, city, and cultural identity information has been collected during profile setup. 
                    This section focuses on how your Pacific identity influences your business operations.
                  </p>
                </div>

                <div>
                  <label className={labelCls}>Main audience *</label>
                  <select value={form.serves_pacific_communities || ""} onChange={e => setForm({ ...form, serves_pacific_communities: e.target.value })} className={selectCls}>
                    <option value="">Select audience</option>
                    <option value="mainly-pacific">Mainly Pacific communities</option>
                    <option value="mixed-communities">Mixed communities</option>
                    <option value="mainstream-general">Mainstream/general market</option>
                    <option value="export-international">Export/international market</option>
                    <option value="not-sure-yet">Not sure yet</option>
                  </select>
                </div>

                <div>
                  <label className={labelCls}>Culture influences business? *</label>
                  <div className="flex items-center space-x-4 mt-3">
                    <label className="flex items-center">
                      <input type="radio" name="culture" checked={form.culture_influences_business === true} onChange={() => setForm({ ...form, culture_influences_business: true })} className="w-4 h-4 text-[#0d4f4f]" />
                      <span className="ml-2 text-sm">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="culture" checked={form.culture_influences_business === false} onChange={() => setForm({ ...form, culture_influences_business: false })} className="w-4 h-4 text-[#0d4f4f]" />
                      <span className="ml-2 text-sm">No</span>
                    </label>
                  </div>
                  {form.culture_influences_business && (
                    <textarea
                      value={form.culture_influence_details || ""}
                      onChange={e => setForm({ ...form, culture_influence_details: e.target.value })}
                      rows={2}
                      placeholder="How does culture influence your business..."
                      className={`${inputCls} resize-none mt-2`}
                    />
                  )}
                </div>
              </div>
            )}

            {section.key === 'financial' && (
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Revenue streams (Select all that apply)</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {REVENUE_STREAMS.map(stream => (
                      <label key={stream.value} className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-100 cursor-pointer text-sm">
                        <input
                          type="checkbox"
                          checked={form.revenue_streams?.includes(stream.value)}
                          onChange={() => toggleArrayItem('revenue_streams', stream.value)}
                          className="rounded border-gray-300 text-[#0d4f4f]"
                        />
                        <span>{stream.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Current funding source *</label>
                    <select value={form.current_funding_source || ""} onChange={e => setForm({ ...form, current_funding_source: e.target.value })} className={selectCls}>
                      <option value="">Select funding source</option>
                      {FUNDING_SOURCES.map(source => (
                        <option key={source.value} value={source.value}>{source.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Investment stage</label>
                    <select value={form.investment_stage || ""} onChange={e => setForm({ ...form, investment_stage: e.target.value })} className={selectCls}>
                      <option value="">Select investment stage</option>
                      {INVESTMENT_STAGES.map(stage => (
                        <option key={stage.value} value={stage.value}>{stage.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Revenue streams (Select all that apply)</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {REVENUE_STREAMS.map(stream => (
                      <label key={stream.value} className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-100 cursor-pointer text-sm">
                        <input
                          type="checkbox"
                          checked={form.revenue_streams?.includes(stream.value)}
                          onChange={() => toggleArrayItem('revenue_streams', stream.value)}
                          className="rounded border-gray-300 text-[#0d4f4f]"
                        />
                        <span>{stream.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Biggest financial challenges</label>
                  <textarea
                    value={form.financial_challenges || ""}
                    onChange={e => setForm({ ...form, financial_challenges: e.target.value })}
                    rows={3}
                    placeholder="What are your main financial challenges or barriers to growth?"
                    className={`${inputCls} resize-none`}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Funding amount needed (if seeking investment)</label>
                    <select value={form.funding_amount_needed || ""} onChange={e => setForm({ ...form, funding_amount_needed: e.target.value })} className={selectCls}>
                      <option value="">Select amount</option>
                      {FUNDING_AMOUNTS.map(amount => (
                        <option key={amount.value} value={amount.value}>{amount.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Primary use of funds</label>
                    <select value={form.funding_purpose || ""} onChange={e => setForm({ ...form, funding_purpose: e.target.value })} className={selectCls}>
                      <option value="">Select purpose</option>
                      {FUNDING_PURPOSES.map(purpose => (
                        <option key={purpose.value} value={purpose.value}>{purpose.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-green-900">Are you also an investor?</h4>
                      <p className="text-sm text-green-700 mt-1">
                        Many successful Pacific founders also invest in other businesses. Are you interested in angel investing or seed investing in Pacific startups?
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Angel investor interest</label>
                    <select value={form.angel_investor_interest || ""} onChange={e => setForm({ ...form, angel_investor_interest: e.target.value })} className={selectCls}>
                      <option value="">Select your interest level</option>
                      {ANGEL_INVESTOR_INTEREST.map(interest => (
                        <option key={interest.value} value={interest.value}>{interest.label}</option>
                      ))}
                    </select>
                  </div>
                  {form.angel_investor_interest && form.angel_investor_interest !== 'not-interested' && form.angel_investor_interest !== 'interested-learning' && (
                    <div>
                      <label className={labelCls}>Investment capacity per deal</label>
                      <select value={form.investor_capacity || ""} onChange={e => setForm({ ...form, investor_capacity: e.target.value })} className={selectCls}>
                        <option value="">Select investment range</option>
                        {INVESTOR_CAPACITY.map(capacity => (
                          <option key={capacity.value} value={capacity.value}>{capacity.label}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            )}

            {section.key === 'challenges' && (
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Biggest challenges (Select up to 5) *</label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {BUSINESS_CHALLENGES.map(challenge => (
                      <label key={challenge.value} className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-100 cursor-pointer text-sm">
                        <input
                          type="checkbox"
                          checked={form.top_challenges?.includes(challenge.value)}
                          onChange={() => toggleArrayItem('top_challenges', challenge.value)}
                          className="rounded border-gray-300 text-[#0d4f4f]"
                        />
                        <span>{challenge.label}</span>
                      </label>
                    ))}
                  </div>
                  {form.top_challenges?.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">Selected: {form.top_challenges.length}/5</p>
                  )}
                </div>

                <div>
                  <label className={labelCls}>Support needed (Select up to 3) *</label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {SUPPORT_NEEDS.map(support => (
                      <label key={support.value} className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-100 cursor-pointer text-sm">
                        <input
                          type="checkbox"
                          checked={form.support_needed_next?.includes(support.value)}
                          onChange={() => toggleArrayItem('support_needed_next', support.value)}
                          className="rounded border-gray-300 text-[#0d4f4f]"
                        />
                        <span>{support.label}</span>
                      </label>
                    ))}
                  </div>
                  {form.support_needed_next?.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">Selected: {form.support_needed_next.length}/3</p>
                  )}
                </div>
              </div>
            )}

            {section.key === 'growth' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Business stage *</label>
                    <select value={form.business_stage || ""} onChange={e => setForm({ ...form, business_stage: e.target.value })} className={selectCls}>
                      <option value="">Select stage</option>
                      <option value={BUSINESS_STAGE.IDEA}>Idea/Planning</option>
                      <option value={BUSINESS_STAGE.STARTUP}>Startup (0-2 years)</option>
                      <option value={BUSINESS_STAGE.GROWTH}>Growth (2-5 years)</option>
                      <option value={BUSINESS_STAGE.MATURE}>Mature (5+ years)</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Plan to hire? *</label>
                    <div className="flex items-center space-x-4 mt-3">
                      <label className="flex items-center">
                        <input type="radio" name="hiring" checked={form.hiring_intentions === true} onChange={() => setForm({ ...form, hiring_intentions: true })} className="w-4 h-4 text-[#0d4f4f]" />
                        <span className="ml-2 text-sm">Yes</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="hiring" checked={form.hiring_intentions === false} onChange={() => setForm({ ...form, hiring_intentions: false })} className="w-4 h-4 text-[#0d4f4f]" />
                        <span className="ml-2 text-sm">No</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Goals for next 12 months (Select up to 3) *</label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {GOALS_NEXT_12_MONTHS.map(goal => (
                      <label key={goal.value} className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-100 cursor-pointer text-sm">
                        <input
                          type="checkbox"
                          checked={form.goals_next_12_months_array?.includes(goal.value)}
                          onChange={() => toggleArrayItem('goals_next_12_months_array', goal.value)}
                          className="rounded border-gray-300 text-[#0d4f4f]"
                        />
                        <span>{goal.label}</span>
                      </label>
                    ))}
                  </div>
                  {form.goals_next_12_months_array?.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">Selected: {form.goals_next_12_months_array.length}/3</p>
                  )}
                </div>

                <div>
                  <label className={labelCls}>Main goal details (Optional)</label>
                  <textarea
                    value={form.goals_details || ""}
                    onChange={e => setForm({ ...form, goals_details: e.target.value })}
                    rows={2}
                    placeholder="Tell us more about your main goal this year..."
                    className={`${inputCls} resize-none`}
                  />
                </div>
              </div>
            )}

            {section.key === 'community' && (
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Business impact areas (Select all that apply)</label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {COMMUNITY_IMPACT_AREAS.map(area => (
                      <label key={area.value} className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-100 cursor-pointer text-sm">
                        <input
                          type="checkbox"
                          checked={form.community_impact_areas?.includes(area.value)}
                          onChange={() => toggleArrayItem('community_impact_areas', area.value)}
                          className="rounded border-gray-300 text-[#0d4f4f]"
                        />
                        <span>{area.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Open to mentoring others?</label>
                    <div className="flex items-center space-x-4 mt-3">
                      <label className="flex items-center">
                        <input type="radio" name="mentor_offering" checked={form.mentorship_offering === true} onChange={() => setForm({ ...form, mentorship_offering: true })} className="w-4 h-4 text-[#0d4f4f]" />
                        <span className="ml-2 text-sm">Yes</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="mentor_offering" checked={form.mentorship_offering === false} onChange={() => setForm({ ...form, mentorship_offering: false })} className="w-4 h-4 text-[#0d4f4f]" />
                        <span className="ml-2 text-sm">No</span>
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
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {SECTIONS.map(renderSection)}
      
      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Complete all required sections marked with *
        </div>
        <button
          onClick={handleSubmit}
          disabled={submitting || isLoading || !canSubmit()}
          className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-[#0d4f4f] rounded-xl hover:bg-[#0a5555] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting || isLoading ? 'Submitting...' : 'Submit Insights'}
          <CheckCircle className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
