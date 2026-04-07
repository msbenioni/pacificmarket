/**
 * BusinessCtaSlide Component
 * Fourth slide: Editorial CTA with branded close
 */

import { ArrowRight, ExternalLink } from 'lucide-react';
import SlideFrame from '../components/SlideFrame';
import { getTheme } from '../config/branding';

export default function BusinessCtaSlide({ 
  data, 
  format = 'square',
  theme = 'clean'
}) {
  const themeConfig = getTheme(theme);
  const isPortrait = format === 'portrait';
  
  // Generate clean URL display
  const getCleanUrl = (url) => {
    if (!url) return null;
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return url.replace(/^https?:\/\//, '').split('/')[0];
    }
  };
  
  const cleanUrl = getCleanUrl(data.website);
  
  return (
    <SlideFrame 
      format={format} 
      background={themeConfig.background}
      padding={0}
    >
      <div style={{ 
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: isPortrait ? '48px' : '80px',
        boxSizing: 'border-box'
      }}>
        {/* Background accent */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: isPortrait ? '280px' : '360px',
            height: isPortrait ? '280px' : '360px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${themeConfig.accentColor}11 0%, transparent 70%)`
          }}
        />
        
        {/* Micro label */}
        <div
          style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '1.2px',
            textTransform: 'uppercase',
            color: themeConfig.accentColor,
            marginBottom: '24px'
          }}
        >
          Discover More
        </div>
        
        {/* Main heading */}
        <div
          style={{
            fontSize: isPortrait ? '32px' : '40px',
            fontWeight: 700,
            color: themeConfig.textColor,
            lineHeight: 1.2,
            textAlign: 'center',
            marginBottom: '16px',
            maxWidth: '600px'
          }}
        >
          Discover {data.businessName} on Pacific Discovery Network
        </div>
        
        {/* Support line */}
        <div
          style={{
            fontSize: isPortrait ? '16px' : '18px',
            fontWeight: 400,
            color: themeConfig.secondaryTextColor,
            lineHeight: 1.4,
            textAlign: 'center',
            marginBottom: '40px',
            maxWidth: '500px'
          }}
        >
          Explore their full profile, story, and updates
        </div>
        
        {/* CTA Button */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 32px',
            backgroundColor: themeConfig.accentColor,
            color: '#ffffff',
            borderRadius: '32px',
            fontSize: isPortrait ? '16px' : '18px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            marginBottom: '32px'
          }}
        >
          View Profile
          <ArrowRight size={20} />
        </div>
        
        {/* Clean URL display */}
        {cleanUrl && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              color: themeConfig.secondaryTextColor,
              opacity: 0.7
            }}
          >
            <ExternalLink size={16} />
            {cleanUrl}
          </div>
        )}
        
        {/* PDN Branding */}
        <div
          style={{
            position: 'absolute',
            bottom: isPortrait ? '24px' : '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.5px',
            color: themeConfig.secondaryTextColor,
            opacity: 0.5
          }}
        >
          PACIFIC DISCOVERY NETWORK
        </div>
      </div>
    </SlideFrame>
  );
}
