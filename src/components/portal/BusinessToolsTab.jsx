import Link from "next/link";
import { Star, ChevronRight, FileText, QrCode, Mail } from "lucide-react";
import { BUTTON_STYLES, CARD_STYLES } from "@/constants/portalUI";
import { COMPONENT_STYLES } from "@/constants/designSystem";
import { BUSINESS_TOOLS_CONFIG } from "@/constants/businessCardConfig";
import { SUBSCRIPTION_TIER } from "@/constants/unifiedConstants";
import { createPageUrl } from "@/utils";

const ICON_MAP = {
  FileText,
  QrCode,
  Mail,
};

export default function BusinessToolsTab({ businesses }) {
  const hasMoanaAccess = businesses.some((b) => b.subscription_tier === SUBSCRIPTION_TIER.MOANA);

  const renderToolCard = (tool) => {
    const Icon = ICON_MAP[tool.icon];
    
    return (
      <Link
        key={tool.id}
        href={createPageUrl(tool.href)}
        className={`${CARD_STYLES.portal} hover:shadow-[0_18px_45px_rgba(10,22,40,0.12)] hover:border-[#0d4f4f]/30 transition-all group`}
      >
        <Icon className="w-8 h-8 text-[#0d4f4f] mb-4" />
        <h3 className="font-bold text-[#0a1628] mb-2">{tool.title}</h3>
        <p className="text-slate-600 text-sm mb-4">{tool.description}</p>
        <span className="text-sm font-semibold text-[#0d4f4f] group-hover:gap-2 flex items-center gap-1">
          Open Tool <ChevronRight className="w-4 h-4" />
        </span>
      </Link>
    );
  };

  if (hasMoanaAccess) {
    return (
      <section className={COMPONENT_STYLES.section.container}>
        <div className={COMPONENT_STYLES.section.header}>
          <h2 className="font-bold text-[#0a1628] mb-2">Business Tools</h2>
          <p className="text-slate-600 text-sm">Available to Moana subscribers.</p>
        </div>
        <div className={COMPONENT_STYLES.section.content}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BUSINESS_TOOLS_CONFIG.map(renderToolCard)}
          </div>
        </div>
      </section>
    );
  }

  return (
      <section className={COMPONENT_STYLES.section.container}>
        <div className={COMPONENT_STYLES.section.header}>
          <h2 className="font-bold text-[#0a1628] mb-2">Business Tools</h2>
          <p className="text-slate-600 text-sm">Available to Moana subscribers.</p>
        </div>
        <div className={COMPONENT_STYLES.section.content}>
          <div className="bg-gradient-to-br from-[#c9a84c]/10 to-[#c9a84c]/5 border border-[#c9a84c]/30 rounded-2xl p-8 text-center">
            <Star className="w-10 h-10 text-[#c9a84c] mx-auto mb-4" />
            <h3 className="font-bold text-[#0a1628] mb-2">Featured+ Required</h3>
            <p className="text-slate-600 text-sm mb-5">
              Upgrade at least one business to Featured+ to unlock the Invoice and QR Code generators.
            </p>
            <Link
              href={createPageUrl("Pricing")}
              className={BUTTON_STYLES.upgrade}
            >
              View Plans <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    );
}
