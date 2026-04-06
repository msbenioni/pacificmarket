import { Globe, MapPin, Quote } from "lucide-react";
import { getBusinessTagline, getMetadataChips, getSupportingText, truncateText } from "../utils/textUtils";

/**
 * Story Spotlight Template
 * Warm, human design for founder stories and cultural storytelling
 * More personal, community-led, with softer composition
 */
export default function StorySpotlightTemplate({
  data,
  format = 'square',
  accentColor = '#0a1628'
}) {
  const isPortrait = format === 'portrait';
  const height = isPortrait ? 1350 : 1080;

  // Process business data
  const businessName = truncateText(data.business_name || '', 50);
  const tagline = truncateText(getBusinessTagline(data), 70);
  const storyExcerpt = truncateText(getSupportingText(data, 'story'), 180);
  const chips = getMetadataChips(data, 3);

  return (
    <div
      style={{
        width: 1080,
        height,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        background: `linear-gradient(145deg, #fafafa 0%, #f0f0f0 100%)`,
        color: '#2d2d2d',
      }}
    >
      {/* Top branding */}
      <div style={{
        padding: '40px 60px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(0,0,0,0.1)',
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

        {/* Business Story badge */}
        <div style={{
          background: accentColor,
          padding: '10px 24px',
          borderRadius: 100,
          fontSize: 18,
          fontWeight: 600,
          color: '#ffffff',
          letterSpacing: '0.02em',
        }}>
          Business Story
        </div>
      </div>

      {/* Main content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '40px 80px',
        gap: 32,
      }}>

        {/* Header with logo and name */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 32,
        }}>
          {/* Business logo */}
          <div style={{
            width: 120,
            height: 120,
            borderRadius: 20,
            overflow: 'hidden',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            border: '1px solid rgba(0,0,0,0.05)',
            flexShrink: 0,
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
                fontSize: 48,
                fontWeight: 800,
                color: accentColor,
                textTransform: 'uppercase',
              }}>
                {businessName.charAt(0)}
              </div>
            )}
          </div>

          {/* Business info */}
          <div style={{ flex: 1 }}>
            <h1 style={{
              fontSize: 48,
              fontWeight: 800,
              margin: 0,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: '#2d2d2d',
            }}>
              {businessName}
            </h1>

            {tagline && (
              <p style={{
                fontSize: 24,
                margin: '8px 0 0',
                fontWeight: 500,
                lineHeight: 1.3,
                color: '#6c757d',
              }}>
                {tagline}
              </p>
            )}
          </div>
        </div>

        {/* Quote icon and story */}
        <div style={{
          position: 'relative',
          background: '#ffffff',
          borderRadius: 24,
          padding: '40px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.05)',
        }}>
          {/* Quote icon */}
          <div style={{
            position: 'absolute',
            top: -10,
            left: 30,
            width: 40,
            height: 40,
            background: accentColor,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Quote size={20} color="#ffffff" />
          </div>

          {/* Story text */}
          <p style={{
            fontSize: 22,
            lineHeight: 1.6,
            margin: 0,
            color: '#495057',
            fontStyle: 'italic',
          }}>
            {storyExcerpt}
          </p>
        </div>

        {/* Metadata chips */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
          marginTop: 16,
        }}>
          {chips.map((chip, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: '#ffffff',
                border: '1px solid rgba(0,0,0,0.1)',
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

        {/* Gentle CTA */}
        <div style={{
          marginTop: 'auto',
          paddingTop: 32,
          textAlign: 'center',
        }}>
          <p style={{
            fontSize: 18,
            fontWeight: 600,
            color: accentColor,
            letterSpacing: '0.05em',
            margin: 0,
          }}>
            Read their full story on Pacific Discovery Network
          </p>
        </div>
      </div>
    </div>
  );
}
