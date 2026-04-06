/**
 * BusinessStorySlide Component
 * Third slide: Cultural identity, founder story, or brand story
 */

import React from 'react';
import SlideFrame from '../components/SlideFrame';
import PdnBrandHeader from '../components/PdnBrandHeader';
import { Quote } from 'lucide-react';
import { getTheme } from '../config/branding';

export default function BusinessStorySlide({ 
  data, 
  format = 'square',
  theme = 'clean'
}) {
  const themeConfig = getTheme(theme);
  const isPortrait = format === 'portrait';
  
  // Determine which story to show
  const getStoryContent = () => {
    if (data.culturalIdentityStory) {
      return {
        title: 'Our Cultural Identity',
        content: data.culturalIdentityStory,
        type: 'cultural'
      };
    }
    
    if (data.founderStory) {
      return {
        title: 'Our Founder\'s Story',
        content: data.founderStory,
        type: 'founder'
      };
    }
    
    // Fallback to business highlights
    return {
      title: 'What Makes Us Special',
      content: `${data.businessName} is a ${data.industry || 'business'} based in ${data.location || 'the Pacific'}. We are committed to excellence and bringing authentic Pacific experiences to our community.`,
      type: 'generic'
    };
  };
  
  const storyContent = getStoryContent();
  
  // Truncate content if too long
  const maxContentLength = isPortrait ? 400 : 600;
  const displayContent = storyContent.content.length > maxContentLength
    ? storyContent.content.substring(0, maxContentLength - 3) + '...'
    : storyContent.content;
  
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
      
      {/* Story Content */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        height: '100%',
        padding: isPortrait ? '20px' : '40px'
      }}>
        {/* Quote Icon */}
        <Quote 
          size={isPortrait ? 48 : 64}
          color={themeConfig.accentColor}
          style={{ marginBottom: '24px', opacity: 0.6 }}
        />
        
        {/* Story Title */}
        <div
          style={{
            fontSize: isPortrait ? '32px' : '40px',
            fontWeight: 700,
            color: themeConfig.textColor,
            lineHeight: 1.2,
            marginBottom: '32px'
          }}
        >
          {storyContent.title}
        </div>
        
        {/* Story Content */}
        <div
          style={{
            fontSize: isPortrait ? '18px' : '20px',
            color: themeConfig.textColor,
            lineHeight: 1.7,
            fontWeight: 400,
            maxWidth: '800px',
            marginBottom: '32px'
          }}
        >
          {displayContent}
        </div>
        
        {/* Business Name Attribution */}
        <div
          style={{
            fontSize: '16px',
            color: themeConfig.accentColor,
            fontWeight: 600,
            fontStyle: 'italic'
          }}
        >
          — {data.businessName}
        </div>
        
        {/* Decorative Element */}
        <div
          style={{
            width: '80px',
            height: '3px',
            backgroundColor: themeConfig.accentColor,
            borderRadius: '2px',
            marginTop: '32px',
            opacity: 0.6
          }}
        />
      </div>
    </SlideFrame>
  );
}
