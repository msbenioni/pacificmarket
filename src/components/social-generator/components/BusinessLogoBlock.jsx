/**
 * BusinessLogoBlock Component
 * Displays business logo with fallback to initials
 */


// Inline branding config to avoid import caching issues
const BRANDING = {
  colors: {
    primary: '#0a1628',
    light: '#f8fafc'
  }
};

export default function BusinessLogoBlock({ 
  logoUrl,
  businessName,
  size = { width: 120, height: 120 },
  borderRadius = '12px',
  showBorder = true,
  className = ''
}) {
  const containerStyle = {
    width: size.width,
    height: size.height,
    borderRadius,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: showBorder ? `2px solid ${BRANDING.colors.light}` : 'none',
    backgroundColor: BRANDING.colors.light,
    position: 'relative'
  };
  
  const logoStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    padding: '8px'
  };
  
  const fallbackStyle = {
    fontSize: Math.min(size.width, size.height) * 0.3,
    fontWeight: 600,
    color: BRANDING.colors.primary,
    textAlign: 'center',
    lineHeight: 1
  };
  
  // Generate initials from business name
  const getInitials = (name) => {
    if (!name) return '?';
    
    const words = name.trim().split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };
  
  return (
    <div style={containerStyle} className={className}>
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={`${businessName} logo`}
          style={logoStyle}
        />
      ) : (
        <div style={fallbackStyle}>
          {getInitials(businessName)}
        </div>
      )}
    </div>
  );
}
