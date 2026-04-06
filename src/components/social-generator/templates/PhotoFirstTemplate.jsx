import { Globe, Mail, MapPin } from "lucide-react";

/**
 * Photo-First Spotlight Template
 * Large banner/photo at top, business info overlay at bottom
 * Designed for 1080x1080 (square) or 1080x1350 (portrait) social posts
 */
export default function PhotoFirstTemplate({ data, format = 'square', accentColor = '#0a1628', showBadge = true }) {
  const isPortrait = format === 'portrait';
  const height = isPortrait ? 1350 : 1080;
  const photoHeight = isPortrait ? 650 : 500;

  return (
    <div
      style={{
        width: 1080,
        height,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        background: accentColor,
        color: '#ffffff',
      }}
    >
      {/* Photo / Banner area */}
      <div style={{
        width: '100%',
        height: photoHeight,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {data.banner_url ? (
          <img
            src={data.banner_url}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            crossOrigin="anonymous"
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            background: `linear-gradient(135deg, ${accentColor} 0%, ${lighten(accentColor, 20)} 50%, ${lighten(accentColor, 40)} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {/* Decorative pattern when no banner */}
            <div style={{
              width: 300,
              height: 300,
              borderRadius: '50%',
              border: '4px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <div style={{
                width: 200,
                height: 200,
                borderRadius: '50%',
                border: '4px solid rgba(255,255,255,0.08)',
              }} />
            </div>
          </div>
        )}

        {/* Gradient overlay */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 200,
          background: `linear-gradient(to top, ${accentColor} 0%, transparent 100%)`,
        }} />

        {/* Logo floating on photo */}
        <div style={{
          position: 'absolute',
          bottom: -50,
          left: 80,
          width: 120,
          height: 120,
          borderRadius: 24,
          overflow: 'hidden',
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
          border: `4px solid ${accentColor}`,
          zIndex: 10,
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
              fontSize: 48,
              fontWeight: 800,
              color: accentColor,
              textTransform: 'uppercase',
            }}>
              {(data.business_name || 'B').charAt(0)}
            </div>
          )}
        </div>
      </div>

      {/* Content area */}
      <div style={{
        padding: '70px 80px 40px',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        flex: 1,
      }}>
        {/* Name + tagline */}
        <div>
          <h1 style={{
            fontSize: data.business_name?.length > 25 ? 42 : 50,
            fontWeight: 800,
            margin: 0,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}>
            {data.business_name || 'Business Name'}
          </h1>
          {data.tagline && (
            <p style={{
              fontSize: 24,
              margin: '12px 0 0',
              opacity: 0.8,
              fontWeight: 500,
              lineHeight: 1.3,
            }}>
              {data.tagline}
            </p>
          )}
        </div>

        {/* Description */}
        {data.description && (
          <p style={{
            fontSize: 20,
            lineHeight: 1.5,
            opacity: 0.85,
            margin: 0,
            maxWidth: 800,
          }}>
            {data.description.length > 140
              ? data.description.slice(0, 140) + '...'
              : data.description}
          </p>
        )}

        {/* Info chips */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
          marginTop: 'auto',
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
        </div>
      </div>

      {/* Footer */}
      {showBadge && (
        <div style={{
          padding: '20px 80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(0,0,0,0.2)',
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
      background: 'rgba(255,255,255,0.12)',
      borderRadius: 100,
      padding: '8px 20px',
      fontSize: 17,
      fontWeight: 500,
    }}>
      {icon === 'pin' && <MapPin size={17} />}
      {icon === 'globe' && <Globe size={17} />}
      {icon === 'mail' && <Mail size={17} />}
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
