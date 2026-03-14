export default function BusinessDetailsSection({ form, handleInputChange, inputCls, selectCls, labelCls }) {
  return (
    <div className="space-y-4">
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
      </div>
    </div>
  );
}
