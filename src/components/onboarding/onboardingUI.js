/**
 * Shared Onboarding UI System
 * Premium mobile-first design system for Pacific Discovery Network onboarding
 */

export const onboardingUI = {
  // Card styles
  card: "rounded-2xl border border-gray-100 bg-white p-4 sm:p-6 shadow-[0_12px_40px_rgba(10,22,40,0.04)]",
  premiumCard: "rounded-3xl border border-[#0d4f4f]/10 bg-gradient-to-br from-white via-[#f8fbfb] to-[#eef7f7] p-5 sm:p-6 shadow-[0_18px_50px_rgba(10,22,40,0.06)]",
  successCard: "rounded-3xl border border-emerald-200 bg-gradient-to-br from-white via-emerald-50/60 to-emerald-100/40 p-5 sm:p-6 shadow-[0_18px_50px_rgba(10,22,40,0.06)]",

  // Input styles
  input: "w-full min-h-[44px] rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-[#0a1628] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/10 focus:border-[#0d4f4f] disabled:opacity-50",
  textarea: "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-[#0a1628] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/10 focus:border-[#0d4f4f] resize-none disabled:opacity-50",
  select: "w-full min-h-[44px] rounded-xl border border-gray-300 bg-white px-4 py-3 pr-10 text-sm text-[#0a1628] focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/10 focus:border-[#0d4f4f] disabled:opacity-50 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzZiNzI4MCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K')] bg-no-repeat bg-[center_right_1rem] bg-[length:0.75rem]",

  // Typography
  label: "block text-xs font-semibold uppercase tracking-wider text-gray-500",
  sectionKicker: "text-xs font-semibold uppercase tracking-[0.18em]",
  mainTitle: "text-lg sm:text-xl font-bold text-[#0a1628]",
  body: "text-sm text-slate-600 leading-6",
  helpText: "text-xs text-gray-500",

  // Checkbox and multiselect
  checkboxRow: "flex items-start gap-3 rounded-xl border border-gray-200 bg-white px-3 py-3 hover:bg-gray-50 cursor-pointer",
  checkbox: "mt-0.5 rounded border-gray-300 text-[#0d4f4f] focus:ring-[#0d4f4f]",
  checkboxText: "text-sm leading-5 text-gray-700",

  // Buttons
  primaryButton: "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#0d4f4f] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1a6b6b] transition disabled:opacity-50",
  secondaryButton: "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-gray-50 transition disabled:opacity-50",
  fullWidthPrimaryButton: "inline-flex min-h-[44px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#0d4f4f] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1a6b6b] transition disabled:opacity-50",
  fullWidthSecondaryButton: "inline-flex min-h-[44px] w-full sm:w-auto items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-gray-50 transition disabled:opacity-50",

  // Progress
  progressBar: "h-2 rounded-full bg-slate-200 overflow-hidden",
  progressBarFill: "h-full rounded-full bg-[#0d4f4f] transition-all duration-300",
  progressLabel: "text-xs font-semibold uppercase tracking-wider text-[#0d4f4f]",
  progressValue: "text-xs text-slate-500",

  // Status indicators
  statusCompleted: "border-emerald-200 bg-emerald-50/70",
  statusCurrent: "border-[#0d4f4f]/20 bg-white",
  statusPending: "border-gray-200 bg-white/70",

  statusIconCompleted: "bg-emerald-100 text-emerald-700",
  statusIconCurrent: "bg-[#0d4f4f]/10 text-[#0d4f4f] border border-[#0d4f4f]/20",
  statusIconPending: "bg-gray-100 text-gray-400",

  statusTextCompleted: "text-slate-500",
  statusTextCurrent: "text-[#0a1628]",
  statusTextPending: "text-gray-400",

  statusDescCompleted: "text-slate-400",
  statusDescCurrent: "text-slate-600",
  statusDescPending: "text-gray-400",

  // Footer layout
  mobileFooter: "flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 w-full",
  buttonGroup: "flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto",
};

// Color constants for easy reference
export const colors = {
  primaryDark: "#0a1628",
  primaryTeal: "#0d4f4f",
  accentTeal: "#00c4cc",
  premiumGold: "#c9a84c",
  baseBackground: "#f8f9fc",
  cardBackground: "#ffffff",
};

// Spacing constants
export const spacing = {
  sectionGap: "space-y-5",
  fieldGap: "space-y-2",
  cardPadding: "p-4 sm:p-6",
};
