import { COMMUNITY_IMPACT_AREAS } from "@/constants/unifiedConstants";
import { OptionCard } from "../shared/FormComponents";

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
    <div className="space-y-3 sm:space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm">
        <label className={labelCls}>Community & Collaboration</label>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
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
            label="I'm open to future contact from Pacific Market"
          />
          <OptionCard
            checked={form.business_acquisition_interest || false}
            onChange={() => handleInputChange("business_acquisition_interest", !form.business_acquisition_interest)}
            label="Interested in business acquisition opportunities"
          />
        </div>
      </div>
    </div>
  );
}
