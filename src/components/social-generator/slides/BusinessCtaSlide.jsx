/**
 * BusinessCtaSlide Component
 * Fourth slide: Call-to-action to visit PDN profile
 */

import { ExternalLink } from 'lucide-react';
import BusinessLogoBlock from '../components/BusinessLogoBlock';
import PdnBrandHeader from '../components/PdnBrandHeader';
import SlideFrame from '../components/SlideFrame';
import { getTheme } from '../config/branding';

export default function BusinessCtaSlide({
  data,
  format = 'square',
  theme = 'clean'
}) {
  const themeConfig = getTheme(theme);
  const isPortrait = format === 'portrait';

  const logoSize = { width: 120, height: 120 };

  return (
    <SlideFrame
      format={format}
      background={themeConfig.background}
      padding={40}
    >
      {/* PDN Branding */}
      <PdnBrandHeader
        variant="prominent"
        textColor={themeConfig.textColor}
      />

      {/* CTA Content */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        height: '100%',
        padding: isPortrait ? '20px' : '40px'
      }}>
        {/* Business Logo */}
        <BusinessLogoBlock
          logoUrl={data.logoUrl}
          businessName={data.businessName}
          size={logoSize}
          borderRadius="16px"
          showBorder={true}
          style={{ marginBottom: '32px' }}
        />

        {/* Thank You Message */}
        <div
          style={{
            fontSize: isPortrait ? '36px' : '48px',
            fontWeight: 700,
            color: themeConfig.textColor,
            lineHeight: 1.2,
            marginBottom: '24px'
          }}
        >
          Thank You
        </div>

        {/* Business Name */}
        <div
          style={{
            fontSize: isPortrait ? '24px' : '32px',
            color: themeConfig.accentColor,
            fontWeight: 600,
            marginBottom: '32px'
          }}
        >
          {data.businessName}
        </div>

        {/* Main CTA Message */}
        <div
          style={{
            fontSize: isPortrait ? '20px' : '24px',
            color: themeConfig.textColor,
            lineHeight: 1.5,
            fontWeight: 500,
            marginBottom: '40px',
            maxWidth: '700px'
          }}
        >
          {data.ctaText}
        </div>

        {/* CTA Button */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 32px',
            backgroundColor: themeConfig.accentColor,
            color: 'white',
            borderRadius: '12px',
            fontSize: isPortrait ? '18px' : '20px',
            fontWeight: 600,
            textDecoration: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            cursor: 'pointer',
            transition: 'transform 0.2s ease'
          }}
        >
          <span>Visit Full Profile</span>
          <ExternalLink size={20} style={{ flexShrink: 0 }} />
        </div>

        {/* URL Display */}
        <div
          style={{
            fontSize: '14px',
            color: themeConfig.secondaryTextColor,
            fontWeight: 400,
            marginTop: '16px',
            opacity: 0.8
          }}
        >
          pacificdiscovery.network/businesses/{data.businessId}
        </div>

        {/* Decorative Elements */}
        <div style={{
          position: 'absolute',
          bottom: '40px',
          left: '40px',
          right: '40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Left decorative line */}
          <div
            style={{
              width: '120px',
              height: '2px',
              backgroundColor: themeConfig.accentColor,
              opacity: 0.3
            }}
          />

          {/* PDN tagline */}
          <div
            style={{
              fontSize: '12px',
              color: themeConfig.secondaryTextColor,
              fontWeight: 500,
              letterSpacing: '0.5px'
            }}
          >
            DISCOVER AUTHENTIC PACIFIC BUSINESS
          </div>

          {/* Right decorative line */}
          <div
            style={{
              width: '120px',
              height: '2px',
              backgroundColor: themeConfig.accentColor,
              opacity: 0.3
            }}
          />
        </div>
      </div>
    </SlideFrame>
  );
}
