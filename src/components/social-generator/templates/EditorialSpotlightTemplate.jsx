import { Globe, MapPin } from "lucide-react";
import { getBusinessTagline, getMetadataChips, getSupportingText, truncateText } from "../utils/textUtils";

/**
 * Editorial Spotlight Template
 * Premium, minimal design for LinkedIn and polished Instagram posts
 * Clean, spacious, high-end editorial feel
 */
export default function EditorialSpotlightTemplate({
  data,
  format = 'square',
  accentColor = '#0a1628'
}) {
  const isPortrait = format === 'portrait';
  const height = isPortrait ? 1350 : 1080;

  // Process business data
  const businessName = truncateText(data.business_name || '', 50);
  const tagline = truncateText(getBusinessTagline(data), 70);
  const supportingText = truncateText(getSupportingText(data, 'editorial'), 90);
  const chips = getMetadataChips(data, 2);

  return (
    <div
      style={{
        width: 1080,
        height,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        background: '#ffffff',
        color: '#1a1a1a',
      }}
    >
      {/* Top branding bar */}
      <div style={{
        height: 80,
        background: accentColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 60px',
      }}>
        {/* PDN Logo */}
        <div style={{
          width: 140,
          height: 60,
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

        {/* Featured Business pill */}
        <div style={{
          background: 'rgba(255,255,255,0.15)',
          border: '1px solid rgba(255,255,255,0.2)',
          padding: '8px 24px',
          borderRadius: 100,
          fontSize: 18,
          fontWeight: 600,
          color: '#ffffff',
          letterSpacing: '0.02em',
        }}>
          Featured Business
        </div>
      </div>

      {/* Main content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 80px',
        gap: 32,
      }}>

        {/* Business logo or placeholder */}
        <div style={{
          width: isPortrait ? 200 : 180,
          height: isPortrait ? 200 : 180,
          borderRadius: 24,
          overflow: 'hidden',
          background: '#f8f9fa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #e9ecef',
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
              fontSize: 72,
              fontWeight: 800,
              color: accentColor,
              textTransform: 'uppercase',
            }}>
              {businessName.charAt(0)}
            </div>
          )}
        </div>

        {/* Business name */}
        <h1 style={{
          fontSize: businessName.length > 25 ? 48 : 56,
          fontWeight: 800,
          margin: 0,
          textAlign: 'center',
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          color: '#1a1a1a',
        }}>
          {businessName}
        </h1>

        {/* Tagline */}
        {tagline && (
          <p style={{
            fontSize: 28,
            margin: 0,
            textAlign: 'center',
            fontWeight: 500,
            lineHeight: 1.3,
            color: '#495057',
            maxWidth: 700,
          }}>
            {tagline}
          </p>
        )}

        {/* Supporting text */}
        {supportingText && (
          <p style={{
            fontSize: 20,
            margin: 0,
            textAlign: 'center',
            lineHeight: 1.5,
            color: '#6c757d',
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
                background: '#f8f9fa',
                border: '1px solid #e9ecef',
                borderRadius: 100,
                padding: '8px 20px',
                fontSize: 16,
                fontWeight: 500,
                color: '#495057',
              }}
            >
              {chip.type === 'location' && <MapPin size={16} />}
              {chip.type === 'industry' && <Globe size={16} />}
              <span>{chip.text}</span>
            </div>
          ))}
        </div>

        {/* Soft CTA */}
        <div style={{
          marginTop: 32,
          textAlign: 'center',
        }}>
          <p style={{
            fontSize: 16,
            fontWeight: 600,
            color: accentColor,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            margin: 0,
          }}>
            Discover on Pacific Discovery Network
          </p>
        </div>
      </div>
    </div>
  );
}
