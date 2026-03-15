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
