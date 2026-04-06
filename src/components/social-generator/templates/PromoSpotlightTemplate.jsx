import { ArrowRight, Globe, MapPin } from "lucide-react";
import { getBusinessTagline, getMetadataChips, getSupportingText, truncateText } from "../utils/textUtils";

/**
 * Promo Spotlight Template
 * Bold, scroll-stopping design for Facebook and Instagram discovery
 * More ad-like, energetic, with strong CTA
 */
export default function PromoSpotlightTemplate({
  data,
  format = 'square',
  accentColor = '#0a1628'
}) {
  const isPortrait = format === 'portrait';
  const height = isPortrait ? 1350 : 1080;

  // Process business data
  const businessName = truncateText(data.business_name || '', 50);
  const tagline = truncateText(getBusinessTagline(data), 70);
  const supportingText = truncateText(getSupportingText(data, 'promo'), 90);
  const chips = getMetadataChips(data, 2);

  return (
    <div
      style={{
        width: 1080,
        height,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        background: `linear-gradient(135deg, ${accentColor} 0%, ${lighten(accentColor, 40)} 100%)`,
        color: '#ffffff',
      }}
    >
      {/* Top branding */}
      <div style={{
        padding: '40px 60px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* PDN Logo */}
        <div style={{
          width: 120,
          height: 50,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <img
            src="/pm_logo.png"
            alt="Pacific Discovery Network"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            crossOrigin="anonymous"
          />
        </div>

        {/* Now on PDN badge */}
        <div style={{
          background: 'rgba(255,255,255,0.2)',
          backdropFilter: 'blur(10px)',
          padding: '10px 24px',
          borderRadius: 100,
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}>
          Now on PDN
        </div>
      </div>

      {/* Main content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 80px 60px',
        gap: 24,
      }}>

        {/* Business logo or placeholder */}
        <div style={{
          width: isPortrait ? 180 : 160,
          height: isPortrait ? 180 : 160,
          borderRadius: 32,
          overflow: 'hidden',
          background: 'rgba(255,255,255,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        }}>
          {data.logo_url ? (
            <img
              src={data.logo_url}
              alt={businessName}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              crossOrigin="anonymous"
            />
          ) : (
            <div style={{
              fontSize: 64,
              fontWeight: 900,
              color: 'rgba(255,255,255,0.9)',
              textTransform: 'uppercase',
            }}>
              {businessName.charAt(0)}
            </div>
          )}
        </div>

        {/* Business name - larger and bolder */}
        <h1 style={{
          fontSize: businessName.length > 20 ? 52 : 64,
          fontWeight: 900,
          margin: 0,
          textAlign: 'center',
          lineHeight: 1,
          letterSpacing: '-0.04em',
          textTransform: 'uppercase',
        }}>
          {businessName}
        </h1>

        {/* Tagline - punchy */}
        {tagline && (
          <p style={{
            fontSize: 32,
            margin: 0,
            textAlign: 'center',
            fontWeight: 700,
            lineHeight: 1.2,
            color: 'rgba(255,255,255,0.9)',
            maxWidth: 700,
          }}>
            {tagline}
          </p>
        )}

        {/* Supporting text - short */}
        {supportingText && (
          <p style={{
            fontSize: 22,
            margin: 0,
            textAlign: 'center',
            fontWeight: 500,
            lineHeight: 1.4,
            color: 'rgba(255,255,255,0.8)',
            maxWidth: 600,
          }}>
            {supportingText}
          </p>
        )}

        {/* Metadata chips */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
          justifyContent: 'center',
          marginTop: 16,
        }}>
          {chips.map((chip, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: 100,
                padding: '10px 20px',
                fontSize: 18,
                fontWeight: 600,
                color: 'rgba(255,255,255,0.9)',
              }}
            >
              {chip.type === 'location' && <MapPin size={18} />}
              {chip.type === 'industry' && <Globe size={18} />}
              <span>{chip.text}</span>
            </div>
          ))}
        </div>

        {/* Strong CTA */}
        <div style={{
          marginTop: 32,
          background: 'rgba(255,255,255,0.2)',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(255,255,255,0.3)',
          padding: '16px 40px',
          borderRadius: 100,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <span style={{
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}>
            Discover on PDN
          </span>
          <ArrowRight size={24} style={{ strokeWidth: 3 }} />
        </div>
      </div>
    </div>
  );
}

/** Lighten a hex colour by a percentage */
function lighten(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, (num >> 16) + Math.round(255 * percent / 100));
  const g = Math.min(255, ((num >> 8) & 0x00FF) + Math.round(255 * percent / 100));
  const b = Math.min(255, (num & 0x0000FF) + Math.round(255 * percent / 100));
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}
