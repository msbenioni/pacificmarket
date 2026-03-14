import { FUNDING_SOURCES, INVESTMENT_STAGES } from "@/constants/unifiedConstants";

export default function FinancialOverviewSection({ 
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
            <label className={labelCls}>Current Funding Source</label>
            <select
              value={form.current_funding_source || ""}
              onChange={(e) => handleInputChange("current_funding_source", e.target.value)}
              className={selectCls}
            >
              <option value="">Select funding source</option>
              {FUNDING_SOURCES.map((source) => (
                <option key={source.value} value={source.value}>
                  {source.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Funding Amount Needed</label>
            <select
              value={form.funding_amount_needed || ""}
              onChange={(e) => handleInputChange("funding_amount_needed", e.target.value)}
              className={selectCls}
            >
              <option value="">Select amount</option>
              <option value="under-10k">Under $10,000</option>
              <option value="10k-50k">$10,000 - $50,000</option>
              <option value="50k-100k">$50,000 - $100,000</option>
              <option value="100k-250k">$100,000 - $250,000</option>
              <option value="250k-500k">$250,000 - $500,000</option>
              <option value="500k-1m">$500,000 - $1,000,000</option>
              <option value="1m+">Over $1,000,000</option>
            </select>
          </div>

          <div>
            <label className={labelCls}>Investment Stage</label>
            <select
              value={form.investment_stage || ""}
              onChange={(e) => handleInputChange("investment_stage", e.target.value)}
              className={selectCls}
            >
              <option value="">Select investment stage</option>
              {INVESTMENT_STAGES.map((stage) => (
                <option key={stage.value} value={stage.value}>
                  {stage.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Investment Exploration</label>
            <select
              value={form.investment_exploration || ""}
              onChange={(e) => handleInputChange("investment_exploration", e.target.value)}
              className={selectCls}
            >
              <option value="">Select exploration status</option>
              <option value="actively-seeking">Actively seeking</option>
              <option value="exploring-options">Exploring options</option>
              <option value="not-currently">Not currently seeking</option>
              <option value="not-interested">Not interested</option>
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <label className={labelCls}>Funding Purpose</label>
        <textarea
          value={form.funding_purpose || ""}
          onChange={(e) => handleInputChange("funding_purpose", e.target.value)}
          className={textareaCls}
          placeholder="Describe how you plan to use the funding..."
          rows={4}
        />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <label className={labelCls}>Financial Challenges</label>
        <textarea
          value={form.financial_challenges || ""}
          onChange={(e) => handleInputChange("financial_challenges", e.target.value)}
          className={textareaCls}
          placeholder="Describe any financial challenges or constraints you're facing..."
          rows={4}
        />
      </div>
    </div>
  );
}
