import { COMMUNITY_IMPACT_AREAS } from "@/constants/unifiedConstants";

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

export default function CommunitySection({ 
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
        <label className={labelCls}>Community & Collaboration</label>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <OptionCard
            checked={form.collaboration_interest || false}
            onChange={() => handleInputChange("collaboration_interest", !form.collaboration_interest)}
            label="I am open to collaboration opportunities"
          />
          <OptionCard
            checked={form.mentorship_offering || false}
            onChange={() => handleInputChange("mentorship_offering", !form.mentorship_offering)}
            label="I would be open to mentoring other founders"
          />
          <OptionCard
            checked={form.open_to_future_contact || false}
            onChange={() => handleInputChange("open_to_future_contact", !form.open_to_future_contact)}
            label="I am open to being contacted from Pacific Market regarding future opportunities"
          />
          <OptionCard
            checked={form.business_acquisition_interest || false}
            onChange={() => handleInputChange("business_acquisition_interest", !form.business_acquisition_interest)}
            label="I am interested in acquiring or investing in existing businesses"
          />
        </div>
      </div>
    </div>
  );
}
