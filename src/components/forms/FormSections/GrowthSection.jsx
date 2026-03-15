import { GOALS_NEXT_12_MONTHS } from "@/constants/unifiedConstants";

function OptionCard({ checked, onChange, label, type = "checkbox" }) {
  return (
    <label
      className={`flex min-h-[64px] w-full cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition ${
        checked
          ? "border-[#0d4f4f]/30 bg-[#0d4f4f]/6 shadow-sm"
          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      <input
        type={type}
        checked={checked}
        onChange={onChange}
        className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 text-[#0d4f4f] focus:ring-[#0d4f4f]"
      />
      <span className="text-sm leading-6 text-slate-700">{label}</span>
    </label>
  );
}

export default function GrowthSection({ 
  form, 
  handleInputChange, 
  toggleArrayItem, 
  inputCls, 
  labelCls,
  textareaCls,
  selectCls,
  helperCls
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <label className={labelCls}>Growth Stage</label>
        <select
          value={form.growth_stage || ""}
          onChange={(e) => handleInputChange("growth_stage", e.target.value)}
          className={selectCls}
        >
          <option value="">Select growth stage</option>
          <option value="idea">Idea/Concept</option>
          <option value="startup">Startup/Early</option>
          <option value="growth">Growth/Scaling</option>
          <option value="mature">Mature/Established</option>
          <option value="expanding">Expanding/Global</option>
        </select>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-end justify-between gap-3">
          <div>
            <label className={labelCls}>Growth Priorities</label>
            <p className={helperCls}>Choose up to 3.</p>
          </div>
          <span className="text-xs font-medium text-slate-500">
            {form.goals_next_12_months_array?.length || 0}/3 selected
          </span>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {GOALS_NEXT_12_MONTHS.map((goal) => (
            <OptionCard
              key={goal.value}
              checked={form.goals_next_12_months_array?.includes(goal.value) || false}
              onChange={() => toggleArrayItem("goals_next_12_months_array", goal.value)}
              label={goal.label}
            />
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <label className={labelCls}>Additional Growth Goals</label>
        <textarea
          value={form.goals_details || ""}
          onChange={(e) => handleInputChange("goals_details", e.target.value)}
          className={textareaCls}
          placeholder="Add any specific targets, milestones, or priorities you are working toward."
          rows={4}
        />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className={labelCls}>Import/Export Status</label>
            <select
              value={form.import_export_status || ""}
              onChange={(e) => handleInputChange("import_export_status", e.target.value)}
              className={selectCls}
            >
              <option value="">Select status</option>
              <option value="domestic-only">Domestic only</option>
              <option value="importing-only">Importing only</option>
              <option value="exporting-only">Exporting only</option>
              <option value="both-import-export">Both importing and exporting</option>
              <option value="planning-international">Planning international trade</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
