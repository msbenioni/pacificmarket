/**
 * Text processing utilities for social asset templates
 */

export function truncateText(text, maxLength) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export function getBusinessTagline(business) {
  return business.tagline ||
    business.description?.split('.')[0] ||
    business.industry ||
    'Pacific Business';
}

export function getSupportingText(business, template) {
  if (template === 'story') {
    // For story template, use longer description or founder story
    return business.founder_story ||
      business.description ||
      `A ${business.industry || 'business'} from ${business.city || 'the Pacific'}`;
  }

  // For editorial and promo, use shorter description
  return business.description?.split('.')[0] ||
    `Based in ${business.city || 'the Pacific'}`;
}

export function getSocialHandle(business) {
  if (business.social_links) {
    if (business.social_links.instagram) {
      const handle = business.social_links.instagram.split('/').filter(Boolean).pop();
      return handle ? `@${handle}` : '';
    }
    if (business.social_links.facebook) {
      const handle = business.social_links.facebook.split('/').filter(Boolean).pop();
      return handle ? `fb.com/${handle}` : '';
    }
  }
  return '';
}

export function getLocationString(business) {
  const parts = [business.city, business.country].filter(Boolean);
  return parts.join(', ');
}

export function getMetadataChips(business, maxChips) {
  const chips = [];

  if (business.industry && chips.length < maxChips) {
    chips.push({ type: 'industry', text: business.industry });
  }

  const location = getLocationString(business);
  if (location && chips.length < maxChips) {
    chips.push({ type: 'location', text: location });
  }

  if (business.business_website && chips.length < maxChips) {
    const cleanUrl = business.business_website.replace(/^https?:\/\//, '').replace(/\/$/, '');
    chips.push({ type: 'website', text: cleanUrl });
  }

  return chips;
}
