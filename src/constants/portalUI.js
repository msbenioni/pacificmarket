export const BUTTON_STYLES = {
  primary: "px-6 py-3 text-sm font-semibold text-white bg-[#0d4f4f] rounded-xl hover:bg-[#0a3d3d] focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/20 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]",
  secondary: "px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/20 disabled:opacity-50 disabled:cursor-not-allowed",
  danger: "px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed",
  icon: "inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition",
  iconPrimary: "inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium bg-[#0d4f4f] text-white hover:bg-[#1a6b6b] transition",
  iconSecondary: "inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 transition cursor-pointer",
  upgrade: "inline-flex items-center justify-center gap-2 rounded-xl bg-[#c9a84c] px-5 py-3 text-sm font-bold text-[#0a1628] hover:bg-[#d8b865] transition disabled:opacity-50 min-h-[44px] w-full sm:w-auto",
  disabled: "inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#0d4f4f] hover:border-[#0d4f4f] transition w-full sm:w-auto min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed",
};

export const INPUT_STYLES = {
  default:
    "w-full min-h-[50px] rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-[#0a1628] placeholder:text-slate-400 shadow-[0_1px_2px_rgba(15,23,42,0.04)] focus:outline-none focus:border-[#0d4f4f] focus:ring-4 focus:ring-[#0d4f4f]/10",
  select:
    "w-full min-h-[50px] rounded-2xl border border-slate-300 bg-white px-4 py-3 pr-10 text-sm text-[#0a1628] shadow-[0_1px_2px_rgba(15,23,42,0.04)] focus:outline-none focus:border-[#0d4f4f] focus:ring-4 focus:ring-[#0d4f4f]/10 appearance-none",
  textarea:
    "w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-[#0a1628] placeholder:text-slate-400 shadow-[0_1px_2px_rgba(15,23,42,0.04)] focus:outline-none focus:border-[#0d4f4f] focus:ring-4 focus:ring-[#0d4f4f]/10 resize-none",
  modal:
    "w-full min-h-[48px] rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-[#0a1628] focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500",
};

export const CARD_STYLES = {
  business: "rounded-[26px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)]",
  businessHeader: "p-6",
  businessContent: "border-t border-slate-200 bg-slate-50 p-6",
  upgrade: "rounded-[28px] border border-[#00c4cc]/20 bg-gradient-to-r from-[#00c4cc]/10 via-white to-[#c9a84c]/10 p-6 shadow-[0_18px_50px_rgba(10,22,40,0.08)]",
  empty: "rounded-[26px] border border-dashed border-slate-300 bg-white/90 p-6 sm:p-12 text-center",
  portal: "rounded-[26px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)] p-4 sm:p-5",
};

export const TIER_STYLES = {
  getTierStyles: (tier) => {
    switch (tier) {
      case "MOANA":
        return "bg-[#c9a84c]/14 text-[#0a1628] border border-[#c9a84c]/20";
      case "MANA":
        return "bg-[#00c4cc]/12 text-[#0d4f4f] border border-[#00c4cc]/20";
      default:
        return "bg-gray-100/80 text-gray-600 border border-gray-200";
    }
  },
  verified: "rounded-full px-2 py-1 text-xs font-medium bg-emerald-100/80 text-emerald-700 border border-emerald-200",
  status: "rounded-full border px-2 py-1 text-xs font-medium",
};
