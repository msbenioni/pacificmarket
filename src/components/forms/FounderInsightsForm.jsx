import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, CheckCircle, AlertCircle, Users, TrendingUp, Globe, Target, Lightbulb, Rocket } from "lucide-react";
import { BUSINESS_STAGE, TEAM_SIZE_BAND, IMPORT_EXPORT_STATUS } from "@/constants/business";
import { COUNTRIES } from "@/constants/businessProfile";
import PremiumStepper from "@/components/shared/PremiumStepper";
import { getSupabase } from "@/lib/supabase/client";

const STEPS = [
  { key: "founder", label: "Your Journey", icon: Users },
  { key: "experience", label: "Entrepreneurial Experience", icon: TrendingUp },
  { key: "challenges", label: "Challenges & Support", icon: Globe },
  { key: "growth", label: "Growth & Future", icon: Rocket },
  { key: "impact", label: "Community Impact", icon: Lightbulb },
];

export default function FounderInsightsForm({ businessId, onSubmit, isLoading, initialData = null }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialData || {
    // Your Journey
    years_entrepreneurial: "",
    founder_motivation: "",
    entrepreneurial_background: "",
    
    // Entrepreneurial Experience
    businesses_founded: "",
    primary_industry: "",
    team_size_band: "",
    family_entrepreneurial_background: false,
    
    // Challenges & Support
    top_challenges: [],
    support_sources: [],
    mentorship_access: false,
    
    // Growth & Future
    business_stage: "",
    goals_next_12_months: "",
    hiring_intentions: false,
    
    // Community Impact
    community_impact_areas: [],
    collaboration_interest: false,
    mentorship_offering: false,
  });

  const [submitting, setSubmitting] = useState(false);

  const updateStep = (newStep) => {
    setStep(newStep);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const supabase = getSupabase();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      // Set snapshot year to current year
      const snapshotData = {
        ...form,
        user_id: user.id,
        business_id: businessId ?? null,
        snapshot_year: new Date().getFullYear(),
        submitted_date: new Date().toISOString(),
      };

      await onSubmit(snapshotData);
    } catch (error) {
      console.error("Failed to submit founder insights:", error);
      alert("Failed to submit insights. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const canGoNext = () => {
    switch (step) {
      case 1: // Your Journey
        return form.years_entrepreneurial && form.founder_motivation && form.entrepreneurial_background;
      case 2: // Experience
        return form.businesses_founded && form.primary_industry && form.team_size_band;
      case 3: // Challenges
        return form.top_challenges.length > 0 && form.support_sources.length > 0;
      case 4: // Growth
        return form.business_stage && form.goals_next_12_months;
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

      {/* Step 1: Your Journey */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-[#0d4f4f]/10 to-[#0a1628]/10 rounded-2xl p-6 mb-6">
            <h3 className="font-bold text-[#0a1628] text-lg mb-2">Your Journey</h3>
            <p className="text-gray-600 text-sm">Tell us about your entrepreneurial story and what drives you as a founder.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelCls}>How many years have you been an entrepreneur? *</label>
              <select value={form.years_entrepreneurial || ""} onChange={e => setForm({ ...form, years_entrepreneurial: e.target.value })} className={inputCls}>
                <option value="">Select years</option>
                <option value="0-1">Less than 1 year</option>
                <option value="1-3">1-3 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5-10">5-10 years</option>
                <option value="10+">More than 10 years</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>What motivates you as an entrepreneur? *</label>
            <textarea
              value={form.founder_motivation || ""}
              onChange={e => setForm({ ...form, founder_motivation: e.target.value })}
              rows={3}
              placeholder="Share what drives you - passion, impact, innovation, community, etc."
              className={`${inputCls} resize-none`}
            />
          </div>

          <div>
            <label className={labelCls}>Describe your entrepreneurial background *</label>
            <textarea
              value={form.entrepreneurial_background || ""}
              onChange={e => setForm({ ...form, entrepreneurial_background: e.target.value })}
              rows={3}
              placeholder="Tell us about your journey - education, previous experience, what led you to entrepreneurship."
              className={`${inputCls} resize-none`}
            />
          </div>
        </div>
      )}

      {/* Step 2: Entrepreneurial Experience */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-[#0d4f4f]/10 to-[#0a1628]/10 rounded-2xl p-6 mb-6">
            <h3 className="font-bold text-[#0a1628] text-lg mb-2">Entrepreneurial Experience</h3>
            <p className="text-gray-600 text-sm">Tell us about your experience as an entrepreneur and the businesses you've founded.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelCls}>How many businesses have you founded? *</label>
              <select value={form.businesses_founded || ""} onChange={e => setForm({ ...form, businesses_founded: e.target.value })} className={inputCls}>
                <option value="">Select number</option>
                <option value="1">This is my first business</option>
                <option value="2-3">2-3 businesses</option>
                <option value="4-5">4-5 businesses</option>
                <option value="6+">6 or more businesses</option>
              </select>
            </div>

            <div>
              <label className={labelCls}>Primary Industry *</label>
              <input
                type="text"
                value={form.primary_industry || ""}
                onChange={e => setForm({ ...form, primary_industry: e.target.value })}
                placeholder="e.g. Retail, Technology, Hospitality, Agriculture"
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Current Team Size *</label>
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
            <label className={labelCls}>Family Entrepreneurial Background</label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={form.family_entrepreneurial_background || false}
                  onChange={e => setForm({ ...form, family_entrepreneurial_background: e.target.checked })}
                  className="w-4 h-4 text-[#0d4f4f] border-gray-300 rounded focus:ring-[#0d4f4f]"
                />
                <span className="ml-2 text-sm text-gray-700">I come from a family of entrepreneurs</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Challenges & Support */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-[#0d4f4f]/10 to-[#0a1628]/10 rounded-2xl p-6 mb-6">
            <h3 className="font-bold text-[#0a1628] text-lg mb-2">Challenges & Support</h3>
            <p className="text-gray-600 text-sm">Tell us about the challenges you face and where you find support as an entrepreneur.</p>
          </div>

          <div>
            <label className={labelCls}>Top Challenges *</label>
            <div className="space-y-2">
              {['Access to capital', 'Finding customers', 'Regulations/compliance', 'Talent acquisition', 'Market competition', 'Technology adoption', 'Supply chain issues', 'Marketing', 'Work-life balance', 'Digital presence development', 'Financial management systems', 'Business process automation', 'Other'].map(challenge => (
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
            <label className={labelCls}>Support Sources *</label>
            <div className="space-y-2">
              {['Family & friends', 'Business networks', 'Government programs', 'Mentors/advisors', 'Online communities', 'Industry associations', 'Financial institutions', 'Incubators/accelerators', 'Educational institutions', 'Other'].map(source => (
                <label key={source} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={form.support_sources?.includes(source) || false}
                    onChange={e => {
                      if (e.target.checked) {
                        addArrayItem('support_sources', source);
                      } else {
                        const index = form.support_sources?.indexOf(source);
                        if (index > -1) removeArrayItem('support_sources', index);
                      }
                    }}
                    className="w-4 h-4 text-[#0d4f4f] border-gray-300 rounded focus:ring-[#0d4f4f]"
                  />
                  <span className="ml-2 text-sm text-gray-700">{source}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className={labelCls}>Mentorship Access</label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={form.mentorship_access || false}
                  onChange={e => setForm({ ...form, mentorship_access: e.target.checked })}
                  className="w-4 h-4 text-[#0d4f4f] border-gray-300 rounded focus:ring-[#0d4f4f]"
                />
                <span className="ml-2 text-sm text-gray-700">I have access to mentors or advisors</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Growth & Future */}
      {step === 4 && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-[#0d4f4f]/10 to-[#0a1628]/10 rounded-2xl p-6 mb-6">
            <h3 className="font-bold text-[#0a1628] text-lg mb-2">Growth & Future</h3>
            <p className="text-gray-600 text-sm">Tell us about your current stage and future goals as an entrepreneur.</p>
          </div>

          <div>
            <label className={labelCls}>Current Business Stage *</label>
            <select value={form.business_stage || ""} onChange={e => setForm({ ...form, business_stage: e.target.value })} className={inputCls}>
              <option value="">Select stage</option>
              <option value={BUSINESS_STAGE.IDEA}>Idea/Planning</option>
              <option value={BUSINESS_STAGE.STARTUP}>Startup (0-2 years)</option>
              <option value={BUSINESS_STAGE.GROWTH}>Growth (2-5 years)</option>
              <option value={BUSINESS_STAGE.MATURE}>Mature (5+ years)</option>
            </select>
          </div>

          <div>
            <label className={labelCls}>Goals for Next 12 Months *</label>
            <textarea
              value={form.goals_next_12_months || ""}
              onChange={e => setForm({ ...form, goals_next_12_months: e.target.value })}
              rows={3}
              placeholder="What are your main goals for the next year? (e.g., revenue targets, team expansion, new markets, product launches)"
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
                <span className="ml-2 text-sm text-gray-700">I plan to hire new team members in the next 12 months</span>
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
                <span className="ml-2 text-sm text-gray-700">I'm interested in collaborating with other Pacific entrepreneurs</span>
              </label>
            </div>
          </div>

          <div>
            <label className={labelCls}>Mentorship Offering</label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={form.mentorship_offering || false}
                  onChange={e => setForm({ ...form, mentorship_offering: e.target.checked })}
                  className="w-4 h-4 text-[#0d4f4f] border-gray-300 rounded focus:ring-[#0d4f4f]"
                />
                <span className="ml-2 text-sm text-gray-700">I'm willing to mentor other entrepreneurs</span>
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
