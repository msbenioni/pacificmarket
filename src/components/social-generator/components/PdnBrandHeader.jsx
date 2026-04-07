/**
 * PdnBrandHeader Component
 * Consistent PDN branding header for slides
 */


export default function PdnBrandHeader({ 
  variant = 'subtle', // 'subtle', 'prominent', 'minimal'
  textColor = '#64748b',
  logoSize = { width: 120, height: 53 }
}) {
  const headerStyles = {
    subtle: {
      container: {
        position: 'absolute',
        top: 24,
        right: 24,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        opacity: 0.8
      },
      text: {
        fontSize: 12,
        fontWeight: 500,
        color: textColor
      },
      logo: {
        width: logoSize.width * 0.8,
        height: logoSize.height * 0.8,
        objectFit: 'contain'
      }
    },
    
    prominent: {
      container: {
        position: 'absolute',
        top: 32,
        left: 40,
        right: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      },
      text: {
        fontSize: 14,
        fontWeight: 600,
        color: BRANDING.colors.primary
      },
      logo: {
        width: logoSize.width,
        height: logoSize.height,
        objectFit: 'contain'
      }
    },
    
    minimal: {
      container: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        opacity: 0.6
      },
      text: {
        display: 'none'
      },
      logo: {
        width: logoSize.width * 0.6,
        height: logoSize.height * 0.6,
        objectFit: 'contain'
      }
    }
  };
  
  const style = headerStyles[variant] || headerStyles.subtle;
  
  return (
    <div style={style.container}>
      {variant !== 'minimal' && (
        <span style={style.text}>
          {variant === 'prominent' ? 'Pacific Discovery Network' : 'Pacific Discovery Network'}
        </span>
      )}
      <img
        src={BRANDING.logos.primary}
        alt="Pacific Discovery Network"
        style={style.logo}
      />
    </div>
  );
}
