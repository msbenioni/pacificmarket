/**
 * MetadataPills Component
 * Displays business metadata as styled pills/badges
 */

import { Briefcase, CheckCircle, Globe, MapPin, Star } from 'lucide-react';

export default function MetadataPills({
  highlights,
  maxPills = 4,
  size = 'medium', // 'small', 'medium', 'large'
  color = '#0a1628',
  className = ''
}) {
  const sizes = {
    small: {
      fontSize: 11,
      padding: '4px 8px',
      gap: 4,
      iconSize: 12
    },
    medium: {
      fontSize: 12,
      padding: '6px 12px',
      gap: 6,
      iconSize: 14
    },
    large: {
      fontSize: 14,
      padding: '8px 16px',
      gap: 8,
      iconSize: 16
    }
  };

  const currentSize = sizes[size] || sizes.medium;

  const getIcon = (iconName) => {
    const iconProps = {
      size: currentSize.iconSize,
      style: { flexShrink: 0 }
    };

    switch (iconName) {
      case 'map-pin':
        return <MapPin {...iconProps} />;
      case 'globe':
        return <Globe {...iconProps} />;
      case 'briefcase':
        return <Briefcase {...iconProps} />;
      case 'check-circle':
        return <CheckCircle {...iconProps} />;
      case 'star':
        return <Star {...iconProps} />;
      default:
        return null;
    }
  };

  const pillStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: currentSize.gap,
    padding: currentSize.padding,
    fontSize: currentSize.fontSize,
    fontWeight: 500,
    color: color,
    backgroundColor: `${color}10`,
    border: `1px solid ${color}30`,
    borderRadius: '20px',
    margin: '0 4px 4px 0'
  };

  if (!highlights || highlights.length === 0) {
    return null;
  }

  const displayHighlights = highlights.slice(0, maxPills);

  return (
    <div className={className} style={{ display: 'flex', flexWrap: 'wrap' }}>
      {displayHighlights.map((highlight, index) => (
        <div key={index} style={pillStyle}>
          {highlight.icon && getIcon(highlight.icon)}
          <span>{highlight.text}</span>
        </div>
      ))}
    </div>
  );
}
