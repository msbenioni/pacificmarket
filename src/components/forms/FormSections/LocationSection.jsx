import { COUNTRIES, INDUSTRIES } from "@/constants/unifiedConstants";

export default function LocationSection({ form, handleInputChange, inputCls, selectCls, labelCls }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className={labelCls}>Country *</label>
          <select
            value={form.country || ""}
            onChange={(e) => handleInputChange("country", e.target.value)}
            className={selectCls}
            required
          >
            <option value="">Select country</option>
            {COUNTRIES.map((country) => (
              <option key={country.value} value={country.value}>
                {country.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelCls}>Industry *</label>
          <select
            value={form.industry || ""}
            onChange={(e) => handleInputChange("industry", e.target.value)}
            className={selectCls}
            required
          >
            <option value="">Select industry</option>
            {INDUSTRIES.map((industry) => (
              <option key={industry.value} value={industry.value}>
                {industry.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelCls}>City *</label>
        <input
          type="text"
          value={form.city || ""}
          onChange={(e) => handleInputChange("city", e.target.value)}
          className={inputCls}
          placeholder="Enter your city"
          required
        />
      </div>
    </div>
  );
}
