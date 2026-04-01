import { BUSINESS_STAGE, AGE_RANGES, GENDER_OPTIONS } from "@/constants/unifiedConstants";
import { ReferralDropdown } from "../ReferralDropdown";

export default function BusinessOverviewSection({ 
  form, 
  handleInputChange, 
  inputCls, 
  selectCls, 
  labelCls,
  textareaCls,
  mode = "create",
  businessId = null,
  submitting = false,
  fieldErrors = {}
}) {
  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm">
        <label className={labelCls}>Founder Story</label>
        <textarea
          value={form.founder_story || ""}
          onChange={(e) => handleInputChange("founder_story", e.target.value)}
          className={textareaCls}
          placeholder="Share your journey and what inspired you to start this business..."
          rows={8}
        />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div>
            <label className={labelCls}>Year Started</label>
            <input
              type="number"
              value={form.year_started ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                handleInputChange("year_started", value === "" ? null : Number(value));
              }}
              className={inputCls}
              min="1900"
              max={new Date().getFullYear()}
              placeholder="2020"
            />
          </div>

          <div>
            <label className={labelCls}>Business Stage</label>
            <select
              value={form.business_stage || ""}
              onChange={(e) => handleInputChange("business_stage", e.target.value)}
              className={selectCls}
            >
              <option value="">Select stage</option>
              {BUSINESS_STAGE.map((stage) => (
                <option key={stage.value} value={stage.value}>
                  {stage.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Team Size</label>
            <select
              value={form.team_size_band || ""}
              onChange={(e) => handleInputChange("team_size_band", e.target.value)}
              className={selectCls}
            >
              <option value="">Select team size</option>
              <option value="1">Just me</option>
              <option value="2-5">2-5 people</option>
              <option value="6-10">6-10 people</option>
              <option value="11-25">11-25 people</option>
              <option value="26-50">26-50 people</option>
              <option value="51-100">51-100 people</option>
              <option value="100+">100+ people</option>
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div>
            <label className={labelCls}>Age Range</label>
            <select
              value={form.age_range || ""}
              onChange={(e) => handleInputChange("age_range", e.target.value)}
              className={selectCls}
            >
              <option value="">Select age range</option>
              {AGE_RANGES.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Gender</label>
            <select
              value={form.gender || ""}
              onChange={(e) => handleInputChange("gender", e.target.value)}
              className={selectCls}
            >
              <option value="">Select gender</option>
              {GENDER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Referral Section - Only show during creation */}
      {mode === 'create' && (
        <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm">
          <ReferralDropdown
            value={form.referred_by_business_id}
            onChange={(value) => handleInputChange("referred_by_business_id", value)}
            disabled={submitting}
            excludeBusinessId={businessId}
            fieldErrors={fieldErrors}
          />
        </div>
      )}
    </div>
  );
}
