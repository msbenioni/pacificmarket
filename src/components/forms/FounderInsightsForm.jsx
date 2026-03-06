import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, CheckCircle, AlertCircle, Users, TrendingUp, Globe, Target, Lightbulb, Rocket } from "lucide-react";
import { BUSINESS_STAGE, TEAM_SIZE_BAND, IMPORT_EXPORT_STATUS } from "@/constants/business";
import { COUNTRIES } from "@/constants/businessProfile";
import PremiumStepper from "@/components/shared/PremiumStepper";

const STEPS = [
  { key: "founder", label: "Founder Journey", icon: Users },
  { key: "operations", label: "Business Operations", icon: TrendingUp },
  { key: "markets", label: "Markets & Trade", icon: Globe },
  { key: "growth", label: "Growth & Future", icon: Rocket },
  { key: "impact", label: "Community Impact", icon: Lightbulb },
];

export default function FounderInsightsForm({ businessId, onSubmit, isLoading, initialData = null }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialData || {
    // Founder journey
    year_started: "",
    founder_motivation: "",
    problem_solved: "",
    
    // Business operations
    team_size_band: "",
    business_model: "",
    family_involvement: false,
    
    // Markets
    customer_region: "",
    sales_channels: [],
    import_export_status: IMPORT_EXPORT_STATUS.NONE,
    import_countries: [],
    export_countries: [],
    
    // Growth stage
    business_stage: "",
    
    // Challenges
    top_challenges: [],
    support_needed: [],
    
    // Future outlook
    goals_next_12_months: "",
    hiring_intentions: false,
    
    // Community impact
    community_impact_areas: [],
    collaboration_interest: false,
  });

  const [submitting, setSubmitting] = useState(false);

  const updateStep = (newStep) => {
    setStep(newStep);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Set snapshot year to current year
      const snapshotData = {
        ...form,
        business_id: businessId,
        snapshot_year: new Date().getFullYear(),
        submitted_date: new Date().toISOString(),
      };

      await onSubmit(snapshotData);
    } catch (error) {
      console.error('Failed to submit founder insights:', error);
      alert('Failed to submit insights. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const canGoNext = () => {
    switch (step) {
      case 1: // Founder journey
        return form.year_started && form.founder_motivation && form.problem_solved;
      case 2: // Operations
        return form.team_size_band && form.business_model;
      case 3: // Markets
        return form.customer_region && form.sales_channels.length > 0;
      case 4: // Growth
        return form.business_stage;
      case 5: // Impact
        return true;
      default:
        return true;
    }
  };

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

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0d4f4f] focus:ring-1 focus:ring-[#0d4f4f]/20 bg-white";
  const labelCls = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Stepper */}
      <PremiumStepper
        steps={STEPS}
        currentStep={step - 1}
        completedUntil={step - 2}
        onStepClick={(i) => {
          if (i < step - 1) setStep(i + 1);
        }}
      />

      {/* Step 1: Founder Journey */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-[#0d4f4f]/10 to-[#0a1628]/10 rounded-2xl p-6 mb-6">
            <h3 className="font-bold text-[#0a1628] text-lg mb-2">Founder Journey</h3>
            <p className="text-gray-600 text-sm">Tell us about your entrepreneurial story and what drives your business.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelCls}>Year Started *</label>
              <input
                type="number"
                value={form.year_started || ""}
                onChange={e => setForm({ ...form, year_started: e.target.value })}
                placeholder="e.g. 2020"
                min="1900"
                max={new Date().getFullYear() + 1}
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>What motivated you to start this business? *</label>
            <textarea
              value={form.founder_motivation || ""}
              onChange={e => setForm({ ...form, founder_motivation: e.target.value })}
              rows={3}
              placeholder="Share your story - what inspired you to become an entrepreneur?"
              className={`${inputCls} resize-none`}
            />
          </div>

          <div>
            <label className={labelCls}>What problem does your business solve? *</label>
            <textarea
              value={form.problem_solved || ""}
              onChange={e => setForm({ ...form, problem_solved: e.target.value })}
              rows={3}
              placeholder="Describe the main challenge your business addresses for customers or the community."
              className={`${inputCls} resize-none`}
            />
          </div>
        </div>
      )}

      {/* Step 2: Business Operations */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-[#0d4f4f]/10 to-[#0a1628]/10 rounded-2xl p-6 mb-6">
            <h3 className="font-bold text-[#0a1628] text-lg mb-2">Business Operations</h3>
            <p className="text-gray-600 text-sm">Help us understand how your business operates day-to-day.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelCls}>Team Size *</label>
              <select value={form.team_size_band || ""} onChange={e => setForm({ ...form, team_size_band: e.target.value })} className={inputCls}>
                <option value="">Select team size</option>
                <option value={TEAM_SIZE_BAND.SOLO}>Just me (solo)</option>
                <option value={TEAM_SIZE_BAND.SMALL}>2-5 people</option>
                <option value={TEAM_SIZE_BAND.MEDIUM}>6-10 people</option>
                <option value={TEAM_SIZE_BAND.LARGE}>11-50 people</option>
                <option value={TEAM_SIZE_BAND.ENTERPRISE}>50+ people</option>
              </select>
            </div>

            <div>
              <label className={labelCls}>Business Model *</label>
              <input
                type="text"
                value={form.business_model || ""}
                onChange={e => setForm({ ...form, business_model: e.target.value })}
                placeholder="e.g. B2B services, e-commerce, consulting, manufacturing"
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Family Involvement</label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={form.family_involvement || false}
                  onChange={e => setForm({ ...form, family_involvement: e.target.checked })}
                  className="w-4 h-4 text-[#0d4f4f] border-gray-300 rounded focus:ring-[#0d4f4f]"
                />
                <span className="ml-2 text-sm text-gray-700">Family members are involved in the business</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Markets & Trade */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-[#0d4f4f]/10 to-[#0a1628]/10 rounded-2xl p-6 mb-6">
            <h3 className="font-bold text-[#0a1628] text-lg mb-2">Markets & Trade</h3>
            <p className="text-gray-600 text-sm">Tell us about your customer base and international trade activities.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelCls}>Primary Customer Region *</label>
              <select value={form.customer_region || ""} onChange={e => setForm({ ...form, customer_region: e.target.value })} className={inputCls}>
                <option value="">Select region</option>
                <option value="Local">Local community</option>
                <option value="National">National</option>
                <option value="Regional">Regional (Pacific islands)</option>
                <option value="International">International</option>
              </select>
            </div>

            <div>
              <label className={labelCls}>Import/Export Status *</label>
              <select value={form.import_export_status || ""} onChange={e => setForm({ ...form, import_export_status: e.target.value })} className={inputCls}>
                <option value={IMPORT_EXPORT_STATUS.NONE}>No import/export</option>
                <option value={IMPORT_EXPORT_STATUS.IMPORT_ONLY}>Import only</option>
                <option value={IMPORT_EXPORT_STATUS.EXPORT_ONLY}>Export only</option>
                <option value={IMPORT_EXPORT_STATUS.BOTH}>Both import and export</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>Sales Channels *</label>
            <div className="space-y-2">
              {['Online store', 'Physical store', 'Social media', 'Direct sales', 'Marketplace', 'Wholesale', 'Other'].map(channel => (
                <label key={channel} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={form.sales_channels?.includes(channel) || false}
                    onChange={e => {
                      if (e.target.checked) {
                        addArrayItem('sales_channels', channel);
                      } else {
                        const index = form.sales_channels?.indexOf(channel);
                        if (index > -1) removeArrayItem('sales_channels', index);
                      }
                    }}
                    className="w-4 h-4 text-[#0d4f4f] border-gray-300 rounded focus:ring-[#0d4f4f]"
                  />
                  <span className="ml-2 text-sm text-gray-700">{channel}</span>
                </label>
              ))}
            </div>
          </div>

          {(form.import_export_status === IMPORT_EXPORT_STATUS.IMPORT_ONLY || form.import_export_status === IMPORT_EXPORT_STATUS.BOTH) && (
            <div>
              <label className={labelCls}>Import Countries</label>
              <div className="space-y-2">
                {COUNTRIES.slice(0, 10).map(country => (
                  <label key={country} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={form.import_countries?.includes(country) || false}
                      onChange={e => {
                        if (e.target.checked) {
                          addArrayItem('import_countries', country);
                        } else {
                          const index = form.import_countries?.indexOf(country);
                          if (index > -1) removeArrayItem('import_countries', index);
                        }
                      }}
                      className="w-4 h-4 text-[#0d4f4f] border-gray-300 rounded focus:ring-[#0d4f4f]"
                    />
                    <span className="ml-2 text-sm text-gray-700">{country}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {(form.import_export_status === IMPORT_EXPORT_STATUS.EXPORT_ONLY || form.import_export_status === IMPORT_EXPORT_STATUS.BOTH) && (
            <div>
              <label className={labelCls}>Export Countries</label>
              <div className="space-y-2">
                {COUNTRIES.slice(0, 10).map(country => (
                  <label key={country} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={form.export_countries?.includes(country) || false}
                      onChange={e => {
                        if (e.target.checked) {
                          addArrayItem('export_countries', country);
                        } else {
                          const index = form.export_countries?.indexOf(country);
                          if (index > -1) removeArrayItem('export_countries', index);
                        }
                      }}
                      className="w-4 h-4 text-[#0d4f4f] border-gray-300 rounded focus:ring-[#0d4f4f]"
                    />
                    <span className="ml-2 text-sm text-gray-700">{country}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 4: Growth & Future */}
      {step === 4 && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-[#0d4f4f]/10 to-[#0a1628]/10 rounded-2xl p-6 mb-6">
            <h3 className="font-bold text-[#0a1628] text-lg mb-2">Growth & Future</h3>
            <p className="text-gray-600 text-sm">Share your challenges and future aspirations.</p>
          </div>

          <div>
            <label className={labelCls}>Business Stage *</label>
            <select value={form.business_stage || ""} onChange={e => setForm({ ...form, business_stage: e.target.value })} className={inputCls}>
              <option value="">Select stage</option>
              <option value={BUSINESS_STAGE.IDEA}>Idea</option>
              <option value={BUSINESS_STAGE.STARTUP}>Startup</option>
              <option value={BUSINESS_STAGE.GROWTH}>Growth</option>
              <option value={BUSINESS_STAGE.MATURE}>Mature</option>
            </select>
          </div>

          <div>
            <label className={labelCls}>Top Challenges</label>
            <div className="space-y-2">
              {[
                'Access to capital/funding',
                'Finding skilled talent',
                'Market competition',
                'Regulatory compliance',
                'Technology adoption',
                'Supply chain issues',
                'Customer acquisition',
                'Scaling operations',
                'Other'
              ].map(challenge => (
                <label key={challenge} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={form.top_challenges?.includes(challenge) || false}
                    onChange={e => {
                      if (e.target.checked) {
                        addArrayItem('top_challenges', challenge);
                      } else {
                        const index = form.top_challenges?.indexOf(challenge);
                        if (index > -1) removeArrayItem('top_challenges', index);
                      }
                    }}
                    className="w-4 h-4 text-[#0d4f4f] border-gray-300 rounded focus:ring-[#0d4f4f]"
                  />
                  <span className="ml-2 text-sm text-gray-700">{challenge}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className={labelCls}>Support Needed</label>
            <div className="space-y-2">
              {[
                'Business mentoring',
                'Financial advice',
                'Marketing support',
                'Technology assistance',
                'Legal guidance',
                'Networking opportunities',
                'Training programs',
                'Market research',
                'Export/import assistance',
                'Other'
              ].map(support => (
                <label key={support} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={form.support_needed?.includes(support) || false}
                    onChange={e => {
                      if (e.target.checked) {
                        addArrayItem('support_needed', support);
                      } else {
                        const index = form.support_needed?.indexOf(support);
                        if (index > -1) removeArrayItem('support_needed', index);
                      }
                    }}
                    className="w-4 h-4 text-[#0d4f4f] border-gray-300 rounded focus:ring-[#0d4f4f]"
                  />
                  <span className="ml-2 text-sm text-gray-700">{support}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className={labelCls}>Goals for Next 12 Months</label>
            <textarea
              value={form.goals_next_12_months || ""}
              onChange={e => setForm({ ...form, goals_next_12_months: e.target.value })}
              rows={3}
              placeholder="What are your main business objectives for the coming year?"
              className={`${inputCls} resize-none`}
            />
          </div>

          <div>
            <label className={labelCls}>Hiring Intentions</label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={form.hiring_intentions || false}
                  onChange={e => setForm({ ...form, hiring_intentions: e.target.checked })}
                  className="w-4 h-4 text-[#0d4f4f] border-gray-300 rounded focus:ring-[#0d4f4f]"
                />
                <span className="ml-2 text-sm text-gray-700">Planning to hire staff in the next 12 months</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Step 5: Community Impact */}
      {step === 5 && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-[#0d4f4f]/10 to-[#0a1628]/10 rounded-2xl p-6 mb-6">
            <h3 className="font-bold text-[#0a1628] text-lg mb-2">Community Impact</h3>
            <p className="text-gray-600 text-sm">Tell us about your role in the Pacific business community.</p>
          </div>

          <div>
            <label className={labelCls}>Community Impact Areas</label>
            <div className="space-y-2">
              {[
                'Youth employment',
                'Cultural preservation',
                'Environmental sustainability',
                'Economic development',
                'Education & training',
                'Health & wellbeing',
                'Innovation & technology',
                'Social responsibility',
                'Other'
              ].map(area => (
                <label key={area} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={form.community_impact_areas?.includes(area) || false}
                    onChange={e => {
                      if (e.target.checked) {
                        addArrayItem('community_impact_areas', area);
                      } else {
                        const index = form.community_impact_areas?.indexOf(area);
                        if (index > -1) removeArrayItem('community_impact_areas', index);
                      }
                    }}
                    className="w-4 h-4 text-[#0d4f4f] border-gray-300 rounded focus:ring-[#0d4f4f]"
                  />
                  <span className="ml-2 text-sm text-gray-700">{area}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className={labelCls}>Collaboration Interest</label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={form.collaboration_interest || false}
                  onChange={e => setForm({ ...form, collaboration_interest: e.target.checked })}
                  className="w-4 h-4 text-[#0d4f4f] border-gray-300 rounded focus:ring-[#0d4f4f]"
                />
                <span className="ml-2 text-sm text-gray-700">Interested in collaborating with other Pacific businesses</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <button
          onClick={() => updateStep(step - 1)}
          disabled={step === 1}
          className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        {step < STEPS.length ? (
          <button
            onClick={() => updateStep(step + 1)}
            disabled={!canGoNext()}
            className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#0d4f4f] rounded-xl hover:bg-[#0a5555] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting || !canGoNext()}
            className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-[#0d4f4f] rounded-xl hover:bg-[#0a5555] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit Insights'}
            <CheckCircle className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
