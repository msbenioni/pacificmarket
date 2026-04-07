/**
 * Pacific Discovery Network Branding Configuration
 * Centralized branding assets and styles for welcome story generator
 */

export const PACIFIC_DISCOVERY_NETWORK_BRANDING = {
  // Logo assets
  logos: {
    primary: '/pm_logo.png', // Main PDN logo
    full: '/pacific_logo_banner.png', // Full banner logo (if available)
    icon: '/pdn-icon.png', // Icon version (if available)
  },
  
  // Brand colors
  colors: {
    primary: '#0a1628',      // Navy blue
    secondary: '#1e3a5f',    // Ocean blue
    accent: '#006994',       // Pacific blue
    light: '#f8fafc',        // Light background
    text: {
      primary: '#0a1628',
      secondary: '#64748b',
      light: '#ffffff',
      muted: '#94a3b8'
    }
  },
  
  // Typography
  typography: {
    fontFamily: {
      primary: 'Inter, system-ui, -apple-system, sans-serif',
      heading: 'Inter, system-ui, -apple-system, sans-serif',
      body: 'Inter, system-ui, -apple-system, sans-serif'
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  },
  
  // Spacing and sizing
  spacing: {
    xs: '8px',
    sm: '16px',
    md: '24px',
    lg: '32px',
    xl: '48px',
    xxl: '64px'
  },
  
  // Border radius
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '50%'
  },
  
  // Shadow effects
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
  }
};

/**
 * Welcome story themes
 */
export const WELCOME_THEMES = {
  clean: {
    name: 'Clean',
    description: 'Minimal and professional',
    background: '#ffffff',
    accentColor: PACIFIC_DISCOVERY_NETWORK_BRANDING.colors.primary,
    textColor: PACIFIC_DISCOVERY_NETWORK_BRANDING.colors.text.primary,
    secondaryTextColor: PACIFIC_DISCOVERY_NETWORK_BRANDING.colors.text.secondary
  },
  
  ocean: {
    name: 'Ocean',
    description: 'Pacific-inspired blues',
    background: '#f0f9ff',
    accentColor: PACIFIC_DISCOVERY_NETWORK_BRANDING.colors.accent,
    textColor: PACIFIC_DISCOVERY_NETWORK_BRANDING.colors.primary,
    secondaryTextColor: PACIFIC_DISCOVERY_NETWORK_BRANDING.colors.text.secondary
  },
  
  warm: {
    name: 'Warm',
    description: 'Earthy and welcoming',
    background: '#fef7f0',
    accentColor: '#8b2500',
    textColor: '#0a1628',
    secondaryTextColor: '#64748b'
  },
  
  forest: {
    name: 'Forest',
    description: 'Natural and grounded',
    background: '#f0fdf4',
    accentColor: '#1a4d2e',
    textColor: '#0a1628',
    secondaryTextColor: '#64748b'
  }
};

/**
 * Get theme configuration by name
 */
export function getTheme(themeName = 'clean') {
  return WELCOME_THEMES[themeName] || WELCOME_THEMES.clean;
}

/**
 * Default export configuration
 */
export const DEFAULT_CONFIG = {
  theme: 'clean',
  format: 'square',
  accentColor: PACIFIC_DISCOVERY_NETWORK_BRANDING.colors.primary,
  showPdnBranding: true,
  logoSize: { width: 180, height: 80 },
  cornerRadius: PACIFIC_DISCOVERY_NETWORK_BRANDING.borderRadius.lg
};

// Backward compatibility alias for dev server caching
export const PDN_BRANDING = PACIFIC_DISCOVERY_NETWORK_BRANDING;

