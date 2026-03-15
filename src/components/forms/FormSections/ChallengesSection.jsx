import { BUSINESS_CHALLENGES, SUPPORT_NEEDS } from "@/constants/unifiedConstants";

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

export default function ChallengesSection({ 
  form, 
  handleInputChange, 
  toggleArrayItem, 
  inputCls, 
  labelCls,
  textareaCls,
  helperCls
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <label className={labelCls}>Top Challenges</label>
        <p className={helperCls}>Select up to 5 challenges.</p>
        
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {BUSINESS_CHALLENGES.map((challenge) => (
            <OptionCard
              key={challenge.value}
              checked={form.top_challenges_array?.includes(challenge.value) || false}
              onChange={() => toggleArrayItem("top_challenges_array", challenge.value)}
              label={challenge.label}
            />
          ))}
        </div>

        <div className="mt-4">
          <label className={labelCls}>Additional Challenge Details</label>
          <textarea
            value={form.top_challenges_array || ""}
            onChange={(e) => handleInputChange("top_challenges_array", e.target.value)}
            className={textareaCls}
            placeholder="Describe your biggest business challenges..."
            rows={4}
          />
        </div>
      </div>
    </div>
  );
}
