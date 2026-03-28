import { generateBusinessHandle } from "@/utils/businessHandleGenerator";
import { SUBSCRIPTION_TIER } from "@/constants/unifiedConstants";

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
    <div className="space-y-3 sm:space-y-4">
      <div>
        <label className={labelCls}>Business Name *</label>
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
        <label className={labelCls}>Business Handle</label>
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
        <label className={labelCls}>Tagline</label>
        <input
          type="text"
          value={form.tagline || ""}
          onChange={(e) => handleInputChange("tagline", e.target.value)}
          className={inputCls}
          placeholder="A short, memorable description of your business"
        />
      </div>

      <div>
        <label className={labelCls}>Business Description *</label>
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

      {/* Admin-only subscription tier field */}
      {showAdminFields && (
        <div>
          <label className={labelCls}>Subscription Tier (Admin Only)</label>
          <select
            value={form.subscription_tier || SUBSCRIPTION_TIER.VAKA}
            onChange={(e) => handleInputChange("subscription_tier", e.target.value)}
            className={selectCls}
          >
            <option value={SUBSCRIPTION_TIER.VAKA}>Vaka (Starter)</option>
            <option value={SUBSCRIPTION_TIER.MANA}>Mana (Professional)</option>
            <option value={SUBSCRIPTION_TIER.MOANA}>Moana (Premium)</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Change the business subscription tier. This affects branding features and visibility.
          </p>
        </div>
      )}
    </div>
  );
}
