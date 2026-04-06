/**
 * SlideFrame Component
 * Consistent frame and layout for all welcome story slides
 */

import React from 'react';

export default function SlideFrame({ 
  children, 
  format = 'square',
  background = '#ffffff',
  padding = 40,
  className = '',
  style = {}
}) {
  const isPortrait = format === 'portrait';
  const height = isPortrait ? 1350 : 1080;
  
  const frameStyle = {
    width: 1080,
    height,
    background,
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    ...style
  };
  
  const contentStyle = {
    flex: 1,
    padding,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  };
  
  return (
    <div style={frameStyle} className={className}>
      <div style={contentStyle}>
        {children}
      </div>
    </div>
  );
}
