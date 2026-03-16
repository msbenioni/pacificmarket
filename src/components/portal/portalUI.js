export const portalUI = {
  wrap: "relative max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 -mt-4 sm:-mt-6 pb-6 sm:pb-8",
  shell:
    "rounded-[20px] sm:rounded-[30px] border border-gray-200 bg-white/85 backdrop-blur-xl shadow-[0_20px_60px_rgba(10,22,40,0.10)] p-3 sm:p-5 lg:p-8",

  tabsWrap:
    "flex gap-1 rounded-xl sm:rounded-2xl border border-gray-200 bg-white/90 p-1 sm:p-1.5 mb-3 sm:mb-6 shadow-[0_6px_20px_rgba(10,22,40,0.05)] overflow-x-auto scrollbar-hide whitespace-nowrap",
  tabBtn: (active) =>
    [
      "flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 lg:px-5 py-2 rounded-lg sm:rounded-xl text-xs font-medium sm:font-semibold transition-all flex-shrink-0 min-h-[40px] sm:min-h-[44px] whitespace-nowrap",
      active
        ? "bg-[#0a1628] text-white shadow-[0_8px_20px_rgba(10,22,40,0.25)]"
        : "text-slate-600 hover:text-[#0a1628] hover:bg-slate-50",
    ].join(" "),

  sectionKicker:
    "text-[10px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-[#00c4cc]",
  sectionTitle: "mt-1 text-lg sm:text-xl lg:text-2xl font-bold text-[#0a1628]",
  sectionDesc: "mt-1 max-w-2xl text-xs sm:text-sm text-slate-600",

  card:
    "bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 shadow-[0_8px_30px_rgba(10,22,40,0.06)]",
};
