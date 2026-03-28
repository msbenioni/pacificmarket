import { COUNTRIES, INDUSTRIES } from "@/constants/unifiedConstants";

export default function LocationSection({ form, handleInputChange, inputCls, selectCls, labelCls, fieldErrors = {} }) {
  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <label className={labelCls}>Country *</label>
          <select
            value={form.country || ""}
            onChange={(e) => handleInputChange("country", e.target.value)}
            className={`${selectCls} ${fieldErrors.country ? 'border-red-500 focus:border-red-500' : ''}`}
            required
          >
            <option value="">Select country</option>
            {COUNTRIES.map((country) => (
              <option key={country.value} value={country.value}>
                {country.label}
              </option>
            ))}
          </select>
          {fieldErrors.country && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.country}</p>
          )}
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
          className={`${inputCls} ${fieldErrors.city ? 'border-red-500 focus:border-red-500' : ''}`}
          placeholder="Enter your city"
          required
        />
        {fieldErrors.city && (
          <p className="mt-1 text-xs text-red-600">{fieldErrors.city}</p>
        )}
      </div>

      <div>
        <label className={labelCls}>Address</label>
        <input
          type="text"
          value={form.address || ""}
          onChange={(e) => handleInputChange("address", e.target.value)}
          className={inputCls}
          placeholder="123 Business Street"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div>
          <label className={labelCls}>Suburb</label>
          <input
            type="text"
            value={form.suburb || ""}
            onChange={(e) => handleInputChange("suburb", e.target.value)}
            className={inputCls}
            placeholder="Downtown"
          />
        </div>

        <div>
          <label className={labelCls}>State/Region</label>
          <input
            type="text"
            value={form.state_region || ""}
            onChange={(e) => handleInputChange("state_region", e.target.value)}
            className={inputCls}
            placeholder="California"
          />
        </div>

        <div>
          <label className={labelCls}>Postal Code</label>
          <input
            type="text"
            value={form.postal_code || ""}
            onChange={(e) => handleInputChange("postal_code", e.target.value)}
            className={inputCls}
            placeholder="12345"
          />
        </div>
      </div>
    </div>
  );
}
