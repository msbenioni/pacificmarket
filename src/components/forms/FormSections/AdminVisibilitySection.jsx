"use client";

import { labelCls, selectCls, helperCls } from "../shared/FormComponents";
import { VISIBILITY_TIER } from "@/constants/visibilityConstants";
import { SUBSCRIPTION_TIER } from "@/constants/unifiedConstants";

export default function AdminVisibilitySection({
  form,
  handleInputChange,
  showAdminFields = false,
}) {
  if (!showAdminFields) {
    return null;
  }

  const handleVisibilityTierChange = (e) => {
    const { value } = e.target;
    // When admin manually changes visibility, set mode to manual
    handleInputChange("visibility_tier", value);
    handleInputChange("visibility_mode", "manual");
  };

  const isManualMode = form.visibility_mode === 'manual';
  const currentTier = form.subscription_tier;

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-2">
          <label className={labelCls}>Subscription Tier</label>
        </div>
        <select
          id="subscription_tier"
          name="subscription_tier"
          value={form.subscription_tier || SUBSCRIPTION_TIER.VAKA}
          onChange={(e) => handleInputChange("subscription_tier", e.target.value)}
          className={selectCls}
        >
          <option value={SUBSCRIPTION_TIER.VAKA}>Vaka (Free)</option>
          <option value={SUBSCRIPTION_TIER.MANA}>Mana (Premium)</option>
          <option value={SUBSCRIPTION_TIER.MOANA}>Moana (Premium Plus)</option>
        </select>
        <p className={helperCls}>
          Set the subscription tier for this business. Moana tier includes automatic homepage visibility.
        </p>
      </div>

      <div>
        <div className="mb-2">
          <label className={labelCls}>Homepage Visibility</label>
        </div>
        <select
          id="visibility_tier"
          name="visibility_tier"
          value={form.visibility_tier || "none"}
          onChange={handleVisibilityTierChange}
          className={selectCls}
        >
          <option value={VISIBILITY_TIER.NONE}>Not Featured</option>
          <option value={VISIBILITY_TIER.SPOTLIGHT}>Spotlight Featured</option>
          <option value={VISIBILITY_TIER.HOMEPAGE}>Homepage Featured</option>
        </select>
        <p className={helperCls}>
          Control where this business appears in public listings. Homepage features are displayed prominently on the main page.
        </p>
      </div>

      <div>
        <div className="mb-2">
          <label className={labelCls}>Visibility Mode</label>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className={`h-2 w-2 rounded-full ${isManualMode ? 'bg-orange-500' : 'bg-green-500'}`}></div>
            <span className="text-sm font-medium text-slate-700">
              {isManualMode ? 'Manual Control' : 'Automatic (Tier-Based)'}
            </span>
          </div>
          <p className="text-xs text-slate-600">
            {isManualMode 
              ? 'Admin has manually set visibility. Automatic tier-based rules will not apply.'
              : currentTier === 'moana' 
                ? 'Moana tier grants automatic homepage visibility. Admin can override by changing settings above.'
                : 'Visibility follows tier rules. Upgrade to Moana for automatic homepage placement.'
            }
          </p>
        </div>
      </div>
    </div>
  );
}
