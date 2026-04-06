import { Globe, Mail, MapPin } from "lucide-react";

/**
 * Logo-First Spotlight Template
 * Prominent logo at top, business details below
 * Designed for 1080x1080 (square) or 1080x1350 (portrait) social posts
 */
export default function LogoFirstTemplate({ data, format = 'square', accentColor = '#0a1628', showBadge = true }) {
  const isPortrait = format === 'portrait';
  const height = isPortrait ? 1350 : 1080;

  return (
    <div
      style={{
        width: 1080,
        height,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        background: `linear-gradient(135deg, ${accentColor} 0%, ${lighten(accentColor, 30)} 100%)`,
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top accent bar */}
      <div style={{
        height: 8,
        background: 'linear-gradient(90deg, #f59e0b, #ef4444, #8b5cf6, #3b82f6)',
      }} />

      {/* Main content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 80px',
        gap: isPortrait ? 48 : 36,
      }}>

        {/* Logo */}
        <div style={{
          width: isPortrait ? 240 : 200,
          height: isPortrait ? 240 : 200,
          borderRadius: 32,
          overflow: 'hidden',
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          flexShrink: 0,
        }}>
          {data.logo_url ? (
            <img
              src={data.logo_url}
              alt={data.business_name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              crossOrigin="anonymous"
            />
          ) : (
            <div style={{
              fontSize: 72,
              fontWeight: 800,
              color: accentColor,
              textTransform: 'uppercase',
            }}>
              {(data.business_name || 'B').charAt(0)}
            </div>
          )}
        </div>

        {/* Business name */}
        <div style={{ textAlign: 'center', maxWidth: 800 }}>
          <h1 style={{
            fontSize: data.business_name?.length > 25 ? 48 : 56,
            fontWeight: 800,
            margin: 0,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}>
            {data.business_name || 'Business Name'}
          </h1>

          {/* Tagline */}
          {data.tagline && (
            <p style={{
              fontSize: 26,
              margin: '16px 0 0',
              opacity: 0.85,
              fontWeight: 500,
              lineHeight: 1.3,
            }}>
              {data.tagline}
            </p>
          )}
        </div>

        {/* Divider */}
        <div style={{
          width: 80,
          height: 4,
          borderRadius: 2,
          background: 'rgba(255,255,255,0.4)',
        }} />

        {/* Description */}
        {data.description && (
          <p style={{
            fontSize: 22,
            textAlign: 'center',
            maxWidth: 700,
            lineHeight: 1.5,
            opacity: 0.9,
            margin: 0,
          }}>
            {data.description.length > 160
              ? data.description.slice(0, 160) + '...'
              : data.description}
          </p>
        )}

        {/* Info row */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 24,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          {data.location && (
            <InfoChip icon="pin" text={data.location} />
          )}
          {data.industry && (
            <InfoChip icon="globe" text={data.industry} />
          )}
          {data.business_website && (
            <InfoChip icon="globe" text={data.business_website.replace(/^https?:\/\//, '').replace(/\/$/, '')} />
          )}
          {data.business_email && (
            <InfoChip icon="mail" text={data.business_email} />
          )}
        </div>

        {/* Social handles */}
        {data.socialHandle && (
          <p style={{
            fontSize: 22,
            opacity: 0.7,
            margin: 0,
            fontWeight: 500,
          }}>
            {data.socialHandle}
          </p>
        )}
      </div>

      {/* Footer with PDN badge */}
      {showBadge && (
        <div style={{
          padding: '20px 80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(0,0,0,0.15)',
        }}>
          <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: '0.05em', opacity: 0.8 }}>
            PACIFIC DISCOVERY NETWORK
          </span>
          <span style={{ fontSize: 16, opacity: 0.6 }}>
            pacificdiscoverynetwork.com
          </span>
        </div>
      )}
    </div>
  );
}

function InfoChip({ icon, text }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      background: 'rgba(255,255,255,0.15)',
      borderRadius: 100,
      padding: '8px 20px',
      fontSize: 18,
      fontWeight: 500,
    }}>
      {icon === 'pin' && <MapPin size={18} />}
      {icon === 'globe' && <Globe size={18} />}
      {icon === 'mail' && <Mail size={18} />}
      <span>{text}</span>
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
