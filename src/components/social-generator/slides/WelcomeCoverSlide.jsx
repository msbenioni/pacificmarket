/**
 * WelcomeCoverSlide Component
 * First slide: 2×2 image grid with centered decorative logo overlay
 * Features curved inner corners and a quatrefoil badge frame
 */

import SlideFrame from '../components/SlideFrame';
import { getTheme } from '../config/branding';
import { generateCoverKicker } from '../utils/editorialHelpers';

export default function WelcomeCoverSlide({ 
  data, 
  format = 'square',
  theme = 'clean'
}) {
  const themeConfig = getTheme(theme);
  const isPortrait = format === 'portrait';
  const slideHeight = isPortrait ? 1350 : 1080;
  const slideWidth = 1080;
  
  // Grid gap/border color
  const borderColor = data.accentColor || themeConfig.accentColor || '#e67e22';
  const borderWidth = 10;
  
  // Diamond logo sizing — side length of the diamond (before rotation)
  const diamondSize = isPortrait ? 260 : 220;
  
  // Ensure we have up to 4 images
  const images = (data.selectedImages || []).slice(0, 4);
  
  // Each quadrant dimensions
  const quadW = (slideWidth - borderWidth) / 2;
  const quadH = (slideHeight - borderWidth) / 2;
  
  // Radius for the curved inner corners (toward center)
  const innerRadius = isPortrait ? 100 : 80;
  
  // Map slot index → which corner gets the large border-radius
  const cornerRadii = [
    // Slot 0: Top-left image → curve bottom-right corner
    `0 0 ${innerRadius}px 0`,
    // Slot 1: Top-right image → curve bottom-left corner
    `0 0 0 ${innerRadius}px`,
    // Slot 2: Bottom-left image → curve top-right corner
    `0 ${innerRadius}px 0 0`,
    // Slot 3: Bottom-right image → curve top-left corner
    `${innerRadius}px 0 0 0`
  ];
  
  // Render a quadrant (image or placeholder)
  const renderQuadrant = (index) => {
    const image = images[index];
    const radius = cornerRadii[index];
    
    const containerStyle = {
      width: quadW,
      height: quadH,
      overflow: 'hidden',
      position: 'relative',
      borderRadius: radius
    };
    
    if (image) {
      return (
        <div key={image.id || `img-${index}`} style={containerStyle}>
          <img
            src={image.url}
            alt={image.alt || `Image ${index + 1}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block'
            }}
          />
        </div>
      );
    }
    
    return (
      <div
        key={`placeholder-${index}`}
        style={{
          ...containerStyle,
          backgroundColor: '#e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#94a3b8',
          fontSize: '48px',
          fontWeight: 700,
          fontFamily: 'system-ui, sans-serif'
        }}
      >
        {index + 1}
      </div>
    );
  };
  
  // Generate initials fallback
  const getInitials = (name) => {
    if (!name) return '?';
    const words = name.trim().split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };
  
  // The diamond's diagonal (tip-to-tip) after 45° rotation = diamondSize * √2
  const diamondDiag = Math.round(diamondSize * Math.SQRT2);
  
  return (
    <SlideFrame 
      format={format} 
      background={borderColor}
      padding={0}
    >
      {/* Editorial kicker */}
      <div
        style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          zIndex: 20,
        }}
      >
        <div
          style={{
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.9)',
            textShadow: '0 1px 3px rgba(0,0,0,0.3)'
          }}
        >
          {generateCoverKicker(data.businessName)}
        </div>
      </div>

      {/* 2×2 Image Grid with colored border/gap */}
      <div
        style={{
          width: slideWidth,
          height: slideHeight,
          display: 'grid',
          gridTemplateColumns: `${quadW}px ${quadW}px`,
          gridTemplateRows: `${quadH}px ${quadH}px`,
          gap: `${borderWidth}px`,
          backgroundColor: borderColor,
          position: 'relative'
        }}
      >
        {/* Render 4 quadrants with curved inner corners */}
        {[0, 1, 2, 3].map((index) => renderQuadrant(index))}
        
        {/* Centered diamond logo */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: diamondDiag,
            height: diamondDiag,
            zIndex: 10
          }}
        >
          {/* Outer diamond — accent color border matching grid borderWidth */}
          <div
            style={{
              position: 'absolute',
              top: -borderWidth,
              left: -borderWidth,
              width: diamondDiag + borderWidth * 2,
              height: diamondDiag + borderWidth * 2,
              transform: 'rotate(45deg)',
              transformOrigin: 'center',
              backgroundColor: borderColor,
              borderRadius: '12px',
              boxShadow: '0 6px 24px rgba(0,0,0,0.3)'
            }}
          />
          
          {/* White diamond fill */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: diamondDiag,
              height: diamondDiag,
              transform: 'rotate(45deg)',
              transformOrigin: 'center',
              backgroundColor: 'white',
              borderRadius: '8px'
            }}
          />
          
          {/* Inner accent diamond ring */}
          <div
            style={{
              position: 'absolute',
              top: 6,
              left: 6,
              width: diamondDiag - 12,
              height: diamondDiag - 12,
              transform: 'rotate(45deg)',
              transformOrigin: 'center',
              border: `2px solid ${borderColor}`,
              borderRadius: '6px',
              backgroundColor: 'transparent',
              zIndex: 2,
              pointerEvents: 'none'
            }}
          />
          
          {/* Logo container — diamond-clipped, fills most of the frame */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              backgroundColor: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
            }}
          >
            {data.logoUrl ? (
              <img
                src={data.logoUrl}
                alt={`${data.businessName} logo`}
                style={{
                  width: '65%',
                  height: '65%',
                  objectFit: 'contain'
                }}
              />
            ) : (
              <div
                style={{
                  fontSize: diamondSize * 0.22,
                  fontWeight: 800,
                  color: themeConfig.accentColor || '#0a1628',
                  textAlign: 'center',
                  lineHeight: 1,
                  fontFamily: 'system-ui, sans-serif'
                }}
              >
                {getInitials(data.businessName)}
              </div>
            )}
          </div>
        </div>
      </div>
    </SlideFrame>
  );
}
