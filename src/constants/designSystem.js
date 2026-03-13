// Shared Design System Constants for Portal Components
// Based on ProfileInsightsTab as the design template

export const DESIGN_TOKENS = {
  // Colors
  colors: {
    primary: '#0d4f4f',
    primaryHover: '#0a3d3d',
    secondary: '#c9a84c',
    secondaryHover: '#d8b865',
    slate: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0a1628',
    },
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  },

  // Border Radius
  radius: {
    sm: '0.5rem',    // 8px
    md: '0.75rem',   // 12px
    lg: '0.875rem',  // 14px
    xl: '1rem',      // 16px
    '2xl': '1.25rem', // 20px
    '3xl': '1.5rem',  // 24px
    '4xl': '2rem',    // 32px
    card: '1.625rem', // 26px - from ProfileInsightsTab
    premium: '1.75rem', // 28px - from ProfileInsightsTab header
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px rgba(15,23,42,0.04)',
    md: '0 4px 6px -1px rgba(15,23,42,0.1), 0 2px 4px -1px rgba(15,23,42,0.06)',
    lg: '0 10px 30px rgba(15,23,42,0.06)',
    xl: '0 18px 50px rgba(10,22,40,0.08)',
    card: '0 10px 30px rgba(15,23,42,0.06)',
    cardHover: '0 18px 45px rgba(10,22,40,0.12)',
    premium: '0 18px 50px rgba(10,22,40,0.08)',
  },

  // Typography
  typography: {
    stepLabel: 'text-[11px] font-semibold uppercase tracking-[0.18em]',
    sectionTitle: 'text-lg font-semibold',
    cardTitle: 'font-bold text-[#0a1628]',
    cardDescription: 'text-slate-600 text-sm',
    label: 'block text-xs font-semibold uppercase tracking-wider',
    helper: 'mt-1 text-xs text-slate-500',
    // Premium header styles from ProfileInsightsTab
    premiumBadge: 'text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0d4f4f]',
    premiumTitle: 'text-2xl font-bold tracking-tight text-[#0a1628] sm:text-3xl',
    premiumDescription: 'text-sm leading-6 text-slate-600 sm:text-[15px]',
  },

  // Spacing
  spacing: {
    xs: '0.5rem',    // 8px
    sm: '0.75rem',   // 12px
    md: '1rem',      // 16px
    lg: '1.25rem',   // 20px
    xl: '1.5rem',    // 24px
    '2xl': '2rem',   // 32px
    '3xl': '3rem',   // 48px
    sectionGap: '1.25rem sm:1.5rem', // space-y-5 sm:space-y-6
  },
};

// Component Styles - Based on ProfileInsightsTab template
export const COMPONENT_STYLES = {
  // Main container spacing (from ProfileInsightsTab)
  container: {
    main: 'space-y-5 sm:space-y-6',
  },

  // Premium Header Section (from ProfileInsightsTab)
  premiumHeader: {
    container: 'relative overflow-hidden rounded-[28px] border border-[#0d4f4f]/10 bg-gradient-to-br from-white via-[#f7fbfb] to-[#eef6f6] p-5 sm:p-7 shadow-[0_18px_50px_rgba(10,22,40,0.08)]',
    background: 'absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(13,79,79,0.07),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(201,168,76,0.10),transparent_24%)]',
    content: 'relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between',
    badge: 'inline-flex items-center gap-2 rounded-full border border-[#0d4f4f]/10 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0d4f4f] shadow-sm',
    title: 'mt-4 text-2xl font-bold tracking-tight text-[#0a1628] sm:text-3xl',
    description: 'mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-[15px]',
  },

  // Accordion Container (from ProfileInsightsTab)
  accordionContainer: 'rounded-[26px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)] overflow-hidden',

  // Accordion Section Headers (from ProfileInsightsTab)
  accordionHeader: {
    container: 'border-b border-gray-100 last:border-b-0 bg-gradient-to-r from-[#0a1628] to-[#0d4f4f] text-white',
    button: 'w-full flex items-center justify-between gap-4 px-4 sm:px-5 py-4 text-left hover:bg-white/10 transition',
    content: 'flex items-start gap-3 min-w-0',
    iconContainer: 'w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0',
    icon: 'w-4 h-4 text-white',
    textContainer: 'min-w-0',
    title: 'font-semibold text-white text-sm',
    subtitle: 'text-xs text-gray-300 mt-0.5',
    summary: 'hidden md:block text-xs text-gray-300 text-right',
    chevron: 'text-gray-300 text-sm',
  },

  // Accordion Content (from ProfileInsightsTab)
  accordionContent: 'px-4 sm:px-5 pb-4 sm:pb-5 bg-white pt-1',

  // Section Containers (for other pages to follow)
  section: {
    container: 'rounded-[26px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)] overflow-hidden',
    header: 'border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-4 py-4 sm:px-6',
    content: 'p-4 sm:p-5',
  },

  // Tool Cards (for BusinessToolsTab)
  toolCard: {
    container: 'rounded-[26px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)] p-4 sm:p-5 hover:shadow-[0_18px_45px_rgba(10,22,40,0.12)] hover:border-[#0d4f4f]/30 transition-all group',
    icon: 'w-8 h-8 text-[#0d4f4f] mb-4',
    title: 'font-bold text-[#0a1628] mb-2',
    description: 'text-slate-600 text-sm mb-4',
    action: 'text-sm font-semibold text-[#0d4f4f] group-hover:gap-2 flex items-center gap-1',
  },

  // Form Elements
  form: {
    fieldGroup: 'rounded-xl border border-slate-200 bg-white p-4 shadow-sm',
    input: 'w-full min-h-[44px] border border-slate-300 rounded-xl px-4 py-3 text-sm text-[#0a1628] placeholder:text-slate-400 focus:outline-none focus:border-[#0d4f4f] focus:ring-2 focus:ring-[#0d4f4f]/10 bg-white shadow-sm',
    select: 'w-full min-h-[44px] border border-slate-300 rounded-xl px-4 py-3 pr-10 text-sm text-[#0a1628] focus:outline-none focus:border-[#0d4f4f] focus:ring-2 focus:ring-[#0d4f4f]/10 bg-white appearance-none shadow-sm',
    textarea: 'w-full border border-slate-300 rounded-xl px-4 py-3 text-sm text-[#0a1628] placeholder:text-slate-400 focus:outline-none focus:border-[#0d4f4f] focus:ring-2 focus:ring-[#0d4f4f]/10 bg-white resize-none shadow-sm',
    checkbox: 'flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 transition-colors hover:bg-slate-100',
    label: 'block text-xs font-semibold uppercase tracking-wider text-slate-700',
  },

  // Buttons
  buttons: {
    primary: 'rounded-xl bg-[#0d4f4f] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0a3d3d] focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/20 disabled:cursor-not-allowed disabled:opacity-50',
    secondary: 'rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/20 disabled:cursor-not-allowed disabled:opacity-50',
    upgrade: 'rounded-xl bg-[#c9a84c] px-5 py-3 text-sm font-bold text-[#0a1628] hover:bg-[#d8b865] transition disabled:opacity-50 min-h-[44px]',
  },

  // Accordion (individual sections)
  accordion: {
    section: 'rounded-xl border border-slate-300 bg-white shadow-sm transition-all hover:shadow-md',
    header: 'w-full px-4 py-4 sm:px-6',
    content: 'px-4 sm:px-6 py-4 sm:py-5 bg-slate-50 border-t border-slate-200',
  },
};

// Layout Patterns - Based on ProfileInsightsTab
export const LAYOUT_PATTERNS = {
  // Main page layout
  page: {
    container: 'space-y-5 sm:space-y-6',
    header: 'relative overflow-hidden rounded-[28px] border border-[#0d4f4f]/10 bg-gradient-to-br from-white via-[#f7fbfb] to-[#eef6f6] p-5 sm:p-7 shadow-[0_18px_50px_rgba(10,22,40,0.08)]',
    sections: 'rounded-[26px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)] overflow-hidden',
  },

  // Section spacing
  spacing: {
    betweenSections: '1.25rem sm:1.5rem',
    headerToContent: 'mt-4',
    contentToButton: 'mt-2 max-w-2xl',
  },

  // Responsive patterns
  responsive: {
    mobilePadding: 'px-4 py-4',
    desktopPadding: 'sm:px-6 sm:py-5',
    mobileText: 'text-sm',
    desktopText: 'sm:text-[15px]',
  },
};

// Gradient Backgrounds - From ProfileInsightsTab
export const GRADIENTS = {
  premiumHeader: 'bg-gradient-to-br from-white via-[#f7fbfb] to-[#eef6f6]',
  accordionHeader: 'bg-gradient-to-r from-[#0a1628] to-[#0d4f4f]',
  sectionHeader: 'bg-gradient-to-r from-slate-50 to-white',
  insightsHeader: 'bg-gradient-to-r from-[#f8fbfb] via-white to-[#fcfaf4]',
  backgroundOverlay: 'bg-[radial-gradient(circle_at_top_right,rgba(13,79,79,0.07),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(201,168,76,0.10),transparent_24%)]',
};
