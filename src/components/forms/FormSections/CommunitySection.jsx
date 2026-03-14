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
        <div className="flex items-end justify-between gap-3">
          <div>
            <label className={labelCls}>Community Impact Areas</label>
            <p className={helperCls}>Select areas where your business makes an impact.</p>
          </div>
          <span className="text-xs font-medium text-slate-500">
            {form.community_impact_areas?.length || 0} selected
          </span>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {COMMUNITY_IMPACT_AREAS.map((area) => (
            <OptionCard
              key={area.value}
              checked={form.community_impact_areas?.includes(area.value) || false}
              onChange={() => toggleArrayItem("community_impact_areas", area.value)}
              label={area.label}
            />
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <label className={labelCls}>Collaboration Interest</label>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <OptionCard
            type="radio"
            checked={form.collaboration_interest === true}
            onChange={() => handleInputChange("collaboration_interest", true)}
            label="Yes, I am open to collaboration opportunities"
          />
          <OptionCard
            type="radio"
            checked={form.collaboration_interest === false}
            onChange={() => handleInputChange("collaboration_interest", false)}
            label="No, not at the moment"
          />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <OptionCard
            checked={form.mentorship_offering || false}
            onChange={() => handleInputChange("mentorship_offering", !form.mentorship_offering)}
            label="I would be open to mentoring other founders"
          />
          <OptionCard
            checked={form.open_to_future_contact || false}
            onChange={() => handleInputChange("open_to_future_contact", !form.open_to_future_contact)}
            label="I am open to future contact from Pacific Market"
          />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <label className={labelCls}>Founder Story</label>
        <textarea
          value={form.founder_story || ""}
          onChange={(e) => handleInputChange("founder_story", e.target.value)}
          className={textareaCls}
          placeholder="Share your journey and what inspired you to start this business..."
          rows={4}
        />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className={labelCls}>Based In Country</label>
            <input
              type="text"
              value={form.based_in_country || ""}
              onChange={(e) => handleInputChange("based_in_country", e.target.value)}
              className={inputCls}
              placeholder="Country where you're based"
            />
          </div>

          <div>
            <label className={labelCls}>Based In City</label>
            <input
              type="text"
              value={form.based_in_city || ""}
              onChange={(e) => handleInputChange("based_in_city", e.target.value)}
              className={inputCls}
              placeholder="City where you're based"
            />
          </div>

          <div>
            <label className={labelCls}>Age Range</label>
            <select
              value={form.age_range || ""}
              onChange={(e) => handleInputChange("age_range", e.target.value)}
              className={selectCls}
            >
              <option value="">Select age range</option>
              <option value="18-24">18-24</option>
              <option value="25-34">25-34</option>
              <option value="35-44">35-44</option>
              <option value="45-54">45-54</option>
              <option value="55+">55+</option>
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
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
