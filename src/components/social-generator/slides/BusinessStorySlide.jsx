/**
 * BusinessStorySlide Component
 * Third slide: Editorial quote/story card
 */

import React from 'react';
import SlideFrame from '../components/SlideFrame';
import { Quote } from 'lucide-react';
import { getTheme } from '../config/branding';
import { createStoryExcerpt, generateStoryLabel } from '../utils/editorialHelpers';

export default function BusinessStorySlide({ 
  data, 
  format = 'square',
  theme = 'clean'
}) {
  const themeConfig = getTheme(theme);
  const isPortrait = format === 'portrait';
  
  // Generate editorial story content
  const storyLabel = generateStoryLabel(data.culturalIdentityStory, data.founderStory);
  const storyContent = createStoryExcerpt(data.culturalIdentityStory || data.founderStory);
  
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
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: isPortrait ? '48px' : '80px',
        boxSizing: 'border-box'
      }}>
        {/* Micro label */}
        <div
          style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '1.2px',
            textTransform: 'uppercase',
            color: themeConfig.accentColor,
            marginBottom: '32px',
            alignSelf: 'flex-start'
          }}
        >
          {storyLabel}
        </div>
        
        {/* Quote icon */}
        <Quote
          size={isPortrait ? 48 : 64}
          color={themeConfig.accentColor}
          opacity={0.2}
          style={{
            position: 'absolute',
            top: isPortrait ? '80px' : '100px',
            left: isPortrait ? '48px' : '80px'
          }}
        />
        
        {/* Story content */}
        <div
          style={{
            fontSize: isPortrait ? '24px' : '32px',
            fontWeight: 300,
            color: themeConfig.textColor,
            lineHeight: 1.4,
            textAlign: 'center',
            marginBottom: '40px',
            maxWidth: '800px',
            position: 'relative',
            zIndex: 1
          }}
        >
          {storyContent}
        </div>
        
        {/* Attribution */}
        <div
          style={{
            fontSize: isPortrait ? '16px' : '18px',
            fontWeight: 600,
            color: themeConfig.secondaryTextColor,
            textAlign: 'center',
            opacity: 0.8
          }}
        >
          — {data.businessName}
        </div>
        
        {/* Decorative element */}
        <div
          style={{
            position: 'absolute',
            bottom: isPortrait ? '48px' : '80px',
            right: isPortrait ? '48px' : '80px',
            width: '60px',
            height: '2px',
            backgroundColor: themeConfig.accentColor,
            opacity: 0.3
          }}
        />
      </div>
    </SlideFrame>
  );
}
