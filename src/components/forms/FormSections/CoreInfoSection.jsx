import { generateBusinessHandle } from "@/utils/businessHandleGenerator";

export default function CoreInfoSection({ 
  form, 
  handleInputChange, 
  inputCls, 
  textareaCls, 
  labelCls, 
  selectCls,
  showAdminFields = false,
  fieldErrors = {}
}) {
  const handleNameChange = (value) => {
    handleInputChange("business_name", value);
    
    // Auto-populate business handle if it's empty or was starter-generated
    if (!form.business_handle || form.business_handle === generateBusinessHandle(form.business_name || '')) {
      const newHandle = generateBusinessHandle(value);
      handleInputChange("business_handle", newHandle);
    }
  };
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* First Row: Business Name, Handle, Role */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 sm:text-xs after:content-['*'] after:text-red-500 after:ml-1">Business Name</label>
          <input
            type="text"
            value={form.business_name || ""}
            onChange={(e) => handleNameChange(e.target.value)}
            className={`${inputCls} ${fieldErrors.business_name ? 'border-red-500 focus:border-red-500' : ''}`}
            placeholder="Enter your business name"
            required
          />
          {fieldErrors.business_name && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.business_name}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 sm:text-xs after:content-['*'] after:text-red-500 after:ml-1">Business Handle</label>
          <input
            type="text"
            value={form.business_handle || ""}
            onChange={(e) => handleInputChange("business_handle", e.target.value)}
            className={`${inputCls} ${fieldErrors.business_handle ? 'border-red-500 focus:border-red-500' : ''}`}
            placeholder="unique-business-handle"
          />
          {fieldErrors.business_handle && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.business_handle}</p>
          )}
        </div>

        <div>
          <label className={labelCls}>Your Role</label>
          <select
            value={form.role || ""}
            onChange={(e) => handleInputChange("role", e.target.value)}
            className={selectCls}
          >
            <option value="">Select your role</option>
            <option value="owner">Business Owner</option>
            <option value="manager">Manager</option>
            <option value="employee">Employee</option>
            <option value="partner">Partner</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Second Row: Tagline (full width) */}
      <div>
        <label className={labelCls}>Tagline</label>
        <input
          type="text"
          value={form.tagline || ""}
          onChange={(e) => handleInputChange("tagline", e.target.value)}
          className={inputCls}
          placeholder="A short, memorable description of your business"
        />
      </div>

      {/* Third Row: Description (full width) */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 sm:text-xs after:content-['*'] after:text-red-500 after:ml-1">Business Description</label>
        <textarea
          value={form.description || ""}
          onChange={(e) => handleInputChange("description", e.target.value)}
          className={`${textareaCls} ${fieldErrors.description ? 'border-red-500 focus:border-red-500' : ''}`}
          placeholder="Describe what your business does, your products/services, and what makes you unique..."
          rows={8}
          required
        />
        {fieldErrors.description && (
          <p className="mt-1 text-xs text-red-600">{fieldErrors.description}</p>
        )}
      </div>
    </div>
  );
}
