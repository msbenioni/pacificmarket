/**
 * BusinessOverviewSlide Component
 * Second slide: Business overview with key information
 */

import React from 'react';
import SlideFrame from '../components/SlideFrame';
import PdnBrandHeader from '../components/PdnBrandHeader';
import BusinessLogoBlock from '../components/BusinessLogoBlock';
import MetadataPills from '../components/MetadataPills';
import ImageCollage from '../components/ImageCollage';
import { getTheme } from '../config/branding';

export default function BusinessOverviewSlide({ 
  data, 
  format = 'square',
  theme = 'clean'
}) {
  const themeConfig = getTheme(theme);
  const isPortrait = format === 'portrait';
  
  const imageHeight = isPortrait ? 540 : 400;
  const logoSize = { width: 80, height: 80 };
  
  return (
    <SlideFrame 
      format={format} 
      background={themeConfig.background}
      padding={40}
    >
      {/* PDN Branding */}
      <PdnBrandHeader 
        variant="subtle" 
        textColor={themeConfig.secondaryTextColor}
      />
      
      {/* Header Section */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '24px',
        marginBottom: '32px'
      }}>
        <BusinessLogoBlock
          logoUrl={data.logoUrl}
          businessName={data.businessName}
          size={logoSize}
          borderRadius="12px"
          showBorder={true}
        />
        
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: isPortrait ? '36px' : '42px',
              fontWeight: 700,
              color: themeConfig.textColor,
              lineHeight: 1.2,
              marginBottom: '8px'
            }}
          >
            {data.businessName}
          </div>
          
          {data.industry && (
            <div
              style={{
                fontSize: '18px',
                color: themeConfig.accentColor,
                fontWeight: 500,
                marginBottom: '4px'
              }}
            >
              {data.industry}
            </div>
          )}
          
          {data.location && (
            <div
              style={{
                fontSize: '16px',
                color: themeConfig.secondaryTextColor,
                fontWeight: 400
              }}
            >
              {data.location}
            </div>
          )}
        </div>
      </div>
      
      {/* Image Section */}
      {data.selectedImages && data.selectedImages.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <ImageCollage
            images={data.selectedImages}
            layout="hero"
            size={{ width: 1000, height: imageHeight }}
            borderRadius="12px"
            gap={0}
          />
        </div>
      )}
      
      {/* Description Section */}
      <div style={{ marginBottom: '32px' }}>
        <div
          style={{
            fontSize: '18px',
            color: themeConfig.textColor,
            lineHeight: 1.6,
            fontWeight: 400
          }}
        >
          {data.shortDescription}
        </div>
      </div>
      
      {/* Highlights Section */}
      {data.highlights && data.highlights.length > 0 && (
        <div>
          <div
            style={{
              fontSize: '14px',
              color: themeConfig.secondaryTextColor,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '12px'
            }}
          >
            Highlights
          </div>
          
          <MetadataPills
            highlights={data.highlights}
            maxPills={4}
            size="medium"
            color={themeConfig.accentColor}
          />
        </div>
      )}
    </SlideFrame>
  );
}
