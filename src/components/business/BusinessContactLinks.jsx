import React from 'react';
import { 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  ExternalLink,
  Linkedin,
  Facebook,
  Instagram,
  Music
} from 'lucide-react';
import { getBusinessWebsite } from '@/lib/business/helpers';

/**
 * BusinessContactLinks - Standardized business contact information display
 * 
 * Features:
 * - Email, phone, website links
 * - Social media links
 * - Address display
 * - Click-to-action functionality
 * - Responsive layout
 * - Customizable link types
 */
export function BusinessContactLinks({ 
  business, 
  layout = 'vertical', // 'vertical', 'horizontal', 'grid'
  size = 'md', // 'sm', 'md', 'lg'
  variant = 'all', // 'all', 'contact', 'social', 'address'
  showLabels = true,
  className = '',
  onLinkClick 
}) {
  if (!business) return null;

  const sizes = {
    sm: 'text-sm gap-2',
    md: 'text-base gap-3', 
    lg: 'text-lg gap-4'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-4.5 h-4.5',
    lg: 'w-5 h-5'
  };

  const website = getBusinessWebsite(business);
  const layoutClasses = {
    vertical: 'flex flex-col',
    horizontal: 'flex flex-wrap items-center',
    grid: 'grid grid-cols-1 sm:grid-cols-2 gap-3'
  };

  const links = [];

  // Contact Links
  if (variant === 'all' || variant === 'contact') {
    if (business.contact_email) {
      links.push({
        id: 'email',
        icon: Mail,
        label: 'Email',
        value: business.contact_email,
        href: `mailto:${business.contact_email}`,
        color: 'text-blue-600 hover:text-blue-700',
        bgColor: 'bg-blue-50 hover:bg-blue-100'
      });
    }

    if (business.contact_phone) {
      links.push({
        id: 'phone',
        icon: Phone,
        label: 'Phone',
        value: business.contact_phone,
        href: `tel:${business.contact_phone}`,
        color: 'text-green-600 hover:text-green-700',
        bgColor: 'bg-green-50 hover:bg-green-100'
      });
    }

    if (website) {
      links.push({
        id: 'website',
        icon: Globe,
        label: 'Website',
        value: website.replace(/^https?:\/\//, ''),
        href: website.startsWith('http') ? website : `https://${website}`,
        color: 'text-purple-600 hover:text-purple-700',
        bgColor: 'bg-purple-50 hover:bg-purple-100'
      });
    }
  }

  // Social Media Links
  if (variant === 'all' || variant === 'social') {
    if (business.linkedin_url) {
      links.push({
        id: 'linkedin',
        icon: Linkedin,
        label: 'LinkedIn',
        value: 'LinkedIn',
        href: business.linkedin_url,
        color: 'text-blue-700 hover:text-blue-800',
        bgColor: 'bg-blue-100 hover:bg-blue-200'
      });
    }

    if (business.facebook_url) {
      links.push({
        id: 'facebook',
        icon: Facebook,
        label: 'Facebook',
        value: 'Facebook',
        href: business.facebook_url,
        color: 'text-blue-600 hover:text-blue-700',
        bgColor: 'bg-blue-50 hover:bg-blue-100'
      });
    }

    if (business.instagram_url) {
      links.push({
        id: 'instagram',
        icon: Instagram,
        label: 'Instagram',
        value: 'Instagram',
        href: business.instagram_url,
        color: 'text-pink-600 hover:text-pink-700',
        bgColor: 'bg-pink-50 hover:bg-pink-100'
      });
    }

    if (business.tiktok_url) {
      links.push({
        id: 'tiktok',
        icon: Music,
        label: 'TikTok',
        value: 'TikTok',
        href: business.tiktok_url,
        color: 'text-black hover:text-gray-800',
        bgColor: 'bg-gray-100 hover:bg-gray-200'
      });
    }
  }

  // Address
  if (variant === 'all' || variant === 'address') {
    const addressParts = [
      business.address,
      business.suburb,
      business.city,
      business.state_region,
      business.postal_code,
      business.country
    ].filter(Boolean);

    if (addressParts.length > 0) {
      const address = addressParts.join(', ');
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
      
      links.push({
        id: 'address',
        icon: MapPin,
        label: 'Address',
        value: address,
        href: mapsUrl,
        color: 'text-red-600 hover:text-red-700',
        bgColor: 'bg-red-50 hover:bg-red-100'
      });
    }
  }

  if (links.length === 0) return null;

  const handleLinkClick = (link, event) => {
    if (onLinkClick) {
      onLinkClick(link, event);
    }
  };

  return (
    <div className={`${layoutClasses[layout]} ${sizes[size]} ${className}`}>
      {links.map((link) => {
        const Icon = link.icon;
        
        return (
          <a
            key={link.id}
            href={link.href}
            target={link.id === 'address' || link.id === 'website' ? '_blank' : undefined}
            rel={link.id === 'address' || link.id === 'website' ? 'noopener noreferrer' : undefined}
            onClick={(e) => handleLinkClick(link, e)}
            className={`inline-flex items-center px-3 py-2 rounded-lg border transition-all duration-200 ${link.bgColor} ${link.color} border-transparent hover:shadow-sm hover:scale-105`}
            title={`${link.label}: ${link.value}`}
          >
            <Icon className={`${iconSizes[size]} flex-shrink-0`} />
            {showLabels && (
              <span className="ml-2 font-medium truncate max-w-[200px]">
                {link.value}
              </span>
            )}
            {!showLabels && (link.id === 'website' || link.id === 'address') && (
              <ExternalLink className={`${iconSizes[size]} ml-1 flex-shrink-0`} />
            )}
          </a>
        );
      })}
    </div>
  );
}

/**
 * Compact contact links for limited space
 */
export function CompactContactLinks({ 
  business, 
  maxLinks = 3, 
  className = '',
  onLinkClick 
}) {
  if (!business) return null;

  const website = getBusinessWebsite(business);
  const primaryLinks = [];

  // Add most important links first
  if (business.contact_email) {
    primaryLinks.push({
      id: 'email',
      icon: Mail,
      href: `mailto:${business.contact_email}`,
      title: 'Email'
    });
  }

  if (website) {
    primaryLinks.push({
      id: 'website',
      icon: Globe,
      href: website.startsWith('http') ? website : `https://${website}`,
      title: 'Website'
    });
  }

  if (business.contact_phone) {
    primaryLinks.push({
      id: 'phone',
      icon: Phone,
      href: `tel:${business.contact_phone}`,
      title: 'Phone'
    });
  }

  const displayLinks = primaryLinks.slice(0, maxLinks);

  if (displayLinks.length === 0) return null;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {displayLinks.map((link) => {
        const Icon = link.icon;
        
        return (
          <a
            key={link.id}
            href={link.href}
            onClick={(e) => onLinkClick?.(link, e)}
            className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-all duration-200 hover:scale-110"
            title={link.title}
          >
            <Icon className="w-4 h-4" />
          </a>
        );
      })}
      
      {primaryLinks.length > maxLinks && (
        <div className="px-2 py-1 text-xs text-gray-500 bg-gray-50 rounded-lg">
          +{primaryLinks.length - maxLinks}
        </div>
      )}
    </div>
  );
}

/**
 * Social links only
 */
export function SocialLinks({ 
  business, 
  size = 'md', 
  className = '',
  onLinkClick 
}) {
  if (!business) return null;

  const socialLinks = [];

  if (business.linkedin_url) {
    socialLinks.push({
      id: 'linkedin',
      icon: Linkedin,
      href: business.linkedin_url,
      color: 'text-blue-700 bg-blue-100 hover:bg-blue-200'
    });
  }

  if (business.facebook_url) {
    socialLinks.push({
      id: 'facebook',
      icon: Facebook,
      href: business.facebook_url,
      color: 'text-blue-600 bg-blue-50 hover:bg-blue-100'
    });
  }

  if (business.instagram_url) {
    socialLinks.push({
      id: 'instagram',
      icon: Instagram,
      href: business.instagram_url,
      color: 'text-pink-600 bg-pink-50 hover:bg-pink-100'
    });
  }

  if (business.tiktok_url) {
    socialLinks.push({
      id: 'tiktok',
      icon: Music,
      href: business.tiktok_url,
      color: 'text-black bg-gray-100 hover:bg-gray-200'
    });
  }

  if (socialLinks.length === 0) return null;

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-4.5 h-4.5',
    lg: 'w-5 h-5'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {socialLinks.map((link) => {
        const Icon = link.icon;
        
        return (
          <a
            key={link.id}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => onLinkClick?.(link, e)}
            className={`p-2 rounded-lg transition-all duration-200 ${link.color} hover:scale-110 hover:shadow-sm`}
            title={`${link.id.charAt(0).toUpperCase() + link.id.slice(1)}`}
          >
            <Icon className={`${iconSizes[size]}`} />
          </a>
        );
      })}
    </div>
  );
}

export default BusinessContactLinks;
