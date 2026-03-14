import { BUSINESS_STAGE } from "@/constants/unifiedConstants";

export default function BusinessOverviewSection({ 
  form, 
  handleInputChange, 
  inputCls, 
  selectCls, 
  labelCls,
  textareaCls 
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
            <label className={labelCls}>Business Structure</label>
            <select
              value={form.business_structure || ""}
              onChange={(e) => handleInputChange("business_structure", e.target.value)}
              className={selectCls}
            >
              <option value="">Select Structure</option>
              <option value="sole-proprietorship">Sole Proprietorship</option>
              <option value="partnership">Partnership</option>
              <option value="llc">LLC</option>
              <option value="corporation">Corporation</option>
              <option value="non-profit">Non-Profit</option>
              <option value="cooperative">Cooperative</option>
            </select>
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
              <option value="11-20">11-20 people</option>
              <option value="21-50">21-50 people</option>
              <option value="51+">51+ people</option>
            </select>
          </div>

          <div>
            <label className={labelCls}>Revenue Band</label>
            <select
              value={form.revenue_band || ""}
              onChange={(e) => handleInputChange("revenue_band", e.target.value)}
              className={selectCls}
            >
              <option value="">Select revenue range</option>
              <option value="0-50k">Under $50,000</option>
              <option value="50k-100k">$50,000 - $100,000</option>
              <option value="100k-250k">$100,000 - $250,000</option>
              <option value="250k-500k">$250,000 - $500,000</option>
              <option value="500k-1m">$500,000 - $1,000,000</option>
              <option value="1m+">Over $1,000,000</option>
            </select>
          </div>

          <div>
            <label className={labelCls}>Operating Status</label>
            <select
              value={form.business_operating_status || ""}
              onChange={(e) => handleInputChange("business_operating_status", e.target.value)}
              className={selectCls}
            >
              <option value="">Select status</option>
              <option value="operating">Operating</option>
              <option value="paused">Paused</option>
              <option value="planning">Planning</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className={labelCls}>Business Age</label>
            <select
              value={form.business_age || ""}
              onChange={(e) => handleInputChange("business_age", e.target.value)}
              className={selectCls}
            >
              <option value="">Select age</option>
              <option value="0-1">Less than 1 year</option>
              <option value="1-2">1-2 years</option>
              <option value="3-5">3-5 years</option>
              <option value="6-10">6-10 years</option>
              <option value="11+">More than 10 years</option>
            </select>
          </div>

          <div>
            <label className={labelCls}>Business Registered</label>
            <select
              value={form.is_business_registered ? "true" : "false"}
              onChange={(e) => handleInputChange("is_business_registered", e.target.value === "true")}
              className={selectCls}
            >
              <option value="">Select registration status</option>
              <option value="true">Registered</option>
              <option value="false">Not registered</option>
            </select>
          </div>

          <div>
            <label className={labelCls}>Employs Anyone</label>
            <select
              value={form.employs_anyone ? "true" : "false"}
              onChange={(e) => handleInputChange("employs_anyone", e.target.value === "true")}
              className={selectCls}
            >
              <option value="">Select employment status</option>
              <option value="true">Yes, has employees</option>
              <option value="false">No employees</option>
            </select>
          </div>

          <div>
            <label className={labelCls}>Employs Family/Community</label>
            <select
              value={form.employs_family_community ? "true" : "false"}
              onChange={(e) => handleInputChange("employs_family_community", e.target.value === "true")}
              className={selectCls}
            >
              <option value="">Select community employment</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
