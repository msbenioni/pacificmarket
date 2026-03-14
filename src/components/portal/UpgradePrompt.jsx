import { Zap, ChevronRight } from "lucide-react";
import { BUTTON_STYLES, CARD_STYLES } from "@/constants/portalUI";
import { UPGRADE_CARD_CONFIG } from "@/constants/businessCardConfig";
import { SUBSCRIPTION_TIER } from "@/constants/unifiedConstants";
import { TIER_BENEFITS } from "@/constants/tierBenefits";

export default function UpgradePrompt({ 
  onUpgradeClick, 
  checkoutLoading, 
  user 
}) {
  return (
    <div className={CARD_STYLES.upgrade}>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border border-[#c9a84c]/20 bg-[#c9a84c]/12">
            <Zap className="w-6 h-6 text-[#f2d98b]" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9a84c]">
              Growth Opportunity
            </p>
            <h3 className="mt-1 text-lg font-bold text-[#0a1628]">
              {UPGRADE_CARD_CONFIG.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {UPGRADE_CARD_CONFIG.description}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={() => onUpgradeClick(SUBSCRIPTION_TIER.MANA)}
        disabled={checkoutLoading}
        className={BUTTON_STYLES.upgrade}
      >
        {checkoutLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-[#0a1628]/30 border-t-[#0a1628] rounded-full animate-spin" />
            Processing...
          </>
        ) : (
          <>
            {user ? "Upgrade Now" : "Sign Up to Upgrade"}
            <ChevronRight className="w-4 h-4" />
          </>
        )}
      </button>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {UPGRADE_CARD_CONFIG.tiers.map((tier) => (
          <div key={tier.name} className={CARD_STYLES.portal}>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#00c4cc]">
              {tier.name}
            </p>
            <p className="mt-1 text-sm font-semibold text-[#0a1628]">
              ${TIER_BENEFITS[
                tier.name === "Mana" ? SUBSCRIPTION_TIER.MANA : SUBSCRIPTION_TIER.MOANA
              ].price.split("/")[0].slice(1)}/mo
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
              {tier.features.map((feature, index) => (
                <li key={index}>• {feature}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
