// Shared Design System Constants for Portal Components

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
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px rgba(15,23,42,0.04)',
    md: '0 4px 6px -1px rgba(15,23,42,0.1), 0 2px 4px -1px rgba(15,23,42,0.06)',
    lg: '0 10px 30px rgba(15,23,42,0.06)',
    xl: '0 18px 50px rgba(10,22,40,0.08)',
    card: '0 10px 30px rgba(15,23,42,0.06)',
    cardHover: '0 18px 45px rgba(10,22,40,0.12)',
  },

  // Typography
  typography: {
    stepLabel: 'text-[11px] font-semibold uppercase tracking-[0.18em]',
    sectionTitle: 'text-lg font-semibold',
    cardTitle: 'font-bold text-[#0a1628]',
    cardDescription: 'text-slate-600 text-sm',
    label: 'block text-xs font-semibold uppercase tracking-wider',
    helper: 'mt-1 text-xs text-slate-500',
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
  },
};

// Component Styles
export const COMPONENT_STYLES = {
  // Section Containers
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

  // Accordion
  accordion: {
    section: 'rounded-xl border border-slate-300 bg-white shadow-sm transition-all hover:shadow-md',
    header: 'w-full px-4 py-4 sm:px-6',
    content: 'px-4 sm:px-6 py-4 sm:py-5 bg-slate-50 border-t border-slate-200',
  },
};

// Gradient Backgrounds
export const GRADIENTS = {
  sectionHeader: 'bg-gradient-to-r from-slate-50 to-white',
  insightsHeader: 'bg-gradient-to-r from-[#f8fbfb] via-white to-[#fcfaf4]',
  premium: 'bg-gradient-to-br from-white via-[#f7fbfb] to-[#eef6f6]',
};
