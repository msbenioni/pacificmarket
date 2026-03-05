export const portalUI = {
  wrap: "relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 pb-16",
  shell:
    "rounded-[30px] border border-gray-200 bg-white/85 backdrop-blur-xl shadow-[0_28px_80px_rgba(10,22,40,0.10)] p-6 sm:p-8",

  tabsWrap:
    "flex gap-1.5 rounded-2xl border border-gray-200 bg-white/90 p-1.5 mb-8 shadow-[0_8px_25px_rgba(10,22,40,0.05)] overflow-x-auto",
  tabBtn: (active) =>
    [
      "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex-shrink-0",
      active
        ? "bg-[#0a1628] text-white shadow-[0_10px_26px_rgba(10,22,40,0.25)]"
        : "text-slate-600 hover:text-[#0a1628] hover:bg-slate-50",
    ].join(" "),

  sectionKicker:
    "text-xs font-semibold uppercase tracking-[0.22em] text-[#00c4cc]",
  sectionTitle: "mt-1 text-2xl font-bold text-[#0a1628]",
  sectionDesc: "mt-1 max-w-2xl text-sm text-slate-600",

  card:
    "bg-white border border-gray-200 rounded-2xl p-5 shadow-[0_12px_40px_rgba(10,22,40,0.06)]",
};
