/**
 * BusinessOverviewSlide Component
 * Second slide: Editorial feature card with dominant image
 */

import BusinessLogoBlock from '../components/BusinessLogoBlock';
import SlideFrame from '../components/SlideFrame';
import { getTheme } from '../config/branding';
import { formatBusinessName, generateSubhead, selectTopPills } from '../utils/editorialHelpers';

export default function BusinessOverviewSlide({ 
  data, 
  format = 'square',
  theme = 'clean'
}) {
  const themeConfig = getTheme(theme);
  const isPortrait = format === 'portrait';
  
  // Generate editorial content
  const businessName = formatBusinessName(data.businessName);
  const subhead = generateSubhead(data.shortDescription);
  const topPills = selectTopPills(data.category, data.location, data.industry);
  
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
        overflow: 'hidden'
      }}>
        {/* Dominant background image */}
        {data.selectedImages?.[0] ? (
          <img
            src={data.selectedImages[0]}
            alt={data.businessName}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        ) : data.logoUrl ? (
          // Fallback to business logo if no uploaded images
          <img
            src={data.logoUrl}
            alt={data.businessName}
            onError={(e) => {
              console.log('Business logo failed to load, using default:', data.logoUrl);
              // Fallback to default PDN logo
              e.target.src = '/pm_logo.png';
            }}
            onLoad={() => {
              console.log('Business logo loaded successfully:', data.logoUrl);
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.8
            }}
          />
        ) : (
          // Use default PDN logo as final fallback
          <img
            src="/pm_logo.png"
            alt="Pacific Discovery Network"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.6
            }}
          />
        )}
        
        {/* Dark overlay for text readability */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%)'
          }}
        />
        
        {/* Content overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: isPortrait ? '48px' : '60px',
            boxSizing: 'border-box'
          }}
        >
          {/* Micro label */}
          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '1.2px',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '16px'
            }}
          >
            Business Profile
          </div>
          
          {/* Main content */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px' }}>
            {/* Logo */}
            <BusinessLogoBlock
              logoUrl={data.logoUrl}
              businessName={data.businessName}
              size={{ width: 64, height: 64 }}
              borderRadius="12px"
              showBorder={true}
            />
            
            {/* Text content */}
            <div style={{ flex: 1 }}>
              {/* Business name */}
              <div
                style={{
                  fontSize: isPortrait ? '32px' : '36px',
                  fontWeight: 700,
                  color: '#ffffff',
                  lineHeight: 1.1,
                  marginBottom: '8px'
                }}
              >
                {businessName}
              </div>
              
              {/* Subhead */}
              {subhead && (
                <div
                  style={{
                    fontSize: isPortrait ? '16px' : '18px',
                    fontWeight: 400,
                    color: 'rgba(255, 255, 255, 0.9)',
                    lineHeight: 1.3,
                    marginBottom: '16px'
                  }}
                >
                  {subhead}
                </div>
              )}
              
              {/* Pills */}
              {topPills.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {topPills.map((pill, index) => (
                    <div
                      key={index}
                      style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        padding: '4px 12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        color: '#ffffff',
                        borderRadius: '16px',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      {pill}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
}
