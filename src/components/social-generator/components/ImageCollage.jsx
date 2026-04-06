/**
 * ImageCollage Component
 * Creates a collage layout from multiple business images
 */

import { PDN_BRANDING } from '../config/branding';

export default function ImageCollage({ 
  images,
  layout = 'grid', // 'grid', 'mosaic', 'hero'
  size = { width: 1080, height: 540 },
  borderRadius = '12px',
  gap = 8,
  className = ''
}) {
  if (!images || images.length === 0) {
    return (
      <div 
        style={{
          width: size.width,
          height: size.height,
          borderRadius,
          backgroundColor: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `2px dashed ${PDN_BRANDING.colors.text.muted}`
        }}
        className={className}
      >
        <span style={{ color: PDN_BRANDING.colors.text.muted, fontSize: 14 }}>
          No images available
        </span>
      </div>
    );
  }
  
  const renderGridLayout = () => {
    const gridImages = images.slice(0, 4);
    const itemSize = {
      width: (size.width - gap * 3) / 2,
      height: (size.height - gap * 3) / 2
    };
    
    return (
      <div
        style={{
          width: size.width,
          height: size.height,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gap: gap,
          borderRadius,
          overflow: 'hidden'
        }}
      >
        {gridImages.map((image, index) => (
          <div
            key={index}
            style={{
              width: itemSize.width,
              height: itemSize.height,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <img
              src={image.url}
              alt={image.alt || `Business image ${index + 1}`}
              onError={(_e) => {
                console.error('Image failed to load:', image.url);
                _e.target.style.display = 'none';
              }}
              onLoad={(_e) => {
                console.log('Image loaded successfully:', image.url);
              }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
        ))}
      </div>
    );
  };
  
  const renderMosaicLayout = () => {
    const mosaicImages = images.slice(0, 3);
    
    return (
      <div
        style={{
          width: size.width,
          height: size.height,
          display: 'flex',
          gap: gap,
          borderRadius,
          overflow: 'hidden'
        }}
      >
        {/* Hero image takes 2/3 width */}
        <div
          style={{
            flex: 2,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <img
            src={mosaicImages[0]?.url}
            alt={mosaicImages[0]?.alt || 'Main business image'}
            onError={(_e) => {
              console.error('Mosaic hero image failed to load:', mosaicImages[0]?.url);
              _e.target.style.display = 'none';
            }}
            onLoad={(_e) => {
              console.log('Mosaic hero image loaded:', mosaicImages[0]?.url);
            }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
        
        {/* Side images take 1/3 width */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: gap
          }}
        >
          {mosaicImages.slice(1).map((image, index) => (
            <div
              key={index}
              style={{
                flex: 1,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <img
                src={image.url}
                alt={image.alt || `Business image ${index + 2}`}
                onError={(_e) => {
                  console.error('Mosaic side image failed to load:', image.url);
                  _e.target.style.display = 'none';
                }}
                onLoad={(_e) => {
                  console.log('Mosaic side image loaded:', image.url);
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  const renderHeroLayout = () => {
    const heroImage = images[0];
    
    return (
      <div
        style={{
          width: size.width,
          height: size.height,
          borderRadius,
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <img
          src={heroImage.url}
          alt={heroImage.alt || 'Business hero image'}
          onError={(_e) => {
            console.error('Hero image failed to load:', heroImage.url);
            _e.target.style.display = 'none';
          }}
          onLoad={(_e) => {
            console.log('Hero image loaded:', heroImage.url);
          }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        
        {/* Optional overlay gradient for text readability */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '50%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)'
          }}
        />
      </div>
    );
  };
  
  switch (layout) {
    case 'mosaic':
      return renderMosaicLayout();
    case 'hero':
      return renderHeroLayout();
    default:
      return renderGridLayout();
  }
}
