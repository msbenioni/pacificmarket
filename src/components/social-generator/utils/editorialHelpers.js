/**
 * Editorial content transformation utilities
 * Shapes business data into clean, premium editorial copy
 */

// Generate strong editorial subhead from short description
export function generateSubhead(shortDescription, maxLength = 90) {
  if (!shortDescription) return '';
  
  // Clean up common filler phrases
  const cleaned = shortDescription
    .replace(/^(we are|we're|we is)\s+/gi, '')
    .replace(/\b(committed to|dedicated to|passionate about)\s+/gi, '')
    .replace(/\b(excellence|quality|service)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  if (cleaned.length <= maxLength) return cleaned;
  
  // Try to end at sentence boundary
  const sentences = cleaned.split('. ');
  if (sentences.length > 1) {
    const first = sentences[0].trim();
    if (first.length > 20 && first.length <= maxLength) return first;
  }
  
  // Fallback to word boundary
  const words = cleaned.split(' ');
  let result = '';
  for (const word of words) {
    if ((result + word).length > maxLength - 3) break;
    result += (result ? ' ' : '') + word;
  }
  
  return result + '...';
}

// Create curated story excerpt from longer content
export function createStoryExcerpt(story, maxLength = 200) {
  if (!story) return '';
  
  // Clean up the story
  const cleaned = story
    .replace(/\s+/g, ' ')
    .replace(/\b(we are|we're|we is|our business|our company)\s+/gi, '')
    .trim();
  
  if (cleaned.length <= maxLength) return cleaned;
  
  // Look for strong sentences
  const sentences = cleaned.match(/[^.!?]+[.!?]+/g) || [];
  
  // Try to find a compelling first sentence
  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    if (trimmed.length > 30 && trimmed.length <= maxLength) {
      return trimmed;
    }
  }
  
  // Combine first two sentences if they fit
  if (sentences.length >= 2) {
    const combined = sentences[0].trim() + ' ' + sentences[1].trim();
    if (combined.length <= maxLength) {
      return combined;
    }
  }
  
  // Fallback to smart truncation
  const words = cleaned.split(' ');
  let result = '';
  for (const word of words) {
    if ((result + word).length > maxLength - 3) break;
    result += (result ? ' ' : '') + word;
  }
  
  return result + '...';
}

// Generate editorial kicker for cover slide
export function generateCoverKicker(businessName = '') {
  // Use business name to create deterministic selection
  const kickers = [
    'WELCOME TO PACIFIC DISCOVERY NETWORK',
    'NEW LISTING',
    'NEW ON PACIFIC DISCOVERY NETWORK',
    'DISCOVER PACIFIC-OWNED BUSINESSES',
    'PACIFIC BUSINESS PEOPLE'
  ];
  
  // Create deterministic index based on business name hash
  const hash = businessName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = hash % kickers.length;
  
  return kickers[index];
}

// Generate section label for story slide
export function generateStoryLabel(hasCulturalStory, hasFounderStory) {
  if (hasCulturalStory) return 'ROOTED IN CULTURE';
  if (hasFounderStory) return 'FOUNDER STORY';
  return 'OUR STORY';
}

// Clean and truncate business name for headlines
export function formatBusinessName(name, maxLength = 42) {
  if (!name) return '';
  if (name.length <= maxLength) return name;
  
  // Try to break at word boundary
  const words = name.split(' ');
  let result = '';
  for (const word of words) {
    if ((result + word).length > maxLength - 3) break;
    result += (result ? ' ' : '') + word;
  }
  
  return result + '...';
}

// Format location elegantly
export function formatLocation(location) {
  if (!location) return '';
  
  // Clean up common location formats
  return location
    .replace(/,\s*[A-Z]{2,3}$/, '') // Remove country codes
    .replace(/\s+/g, ' ')
    .trim();
}

// Limit pills to most important ones
export function selectTopPills(category, location, industry) {
  const pills = [];
  
  if (category && category !== 'Other') {
    pills.push(category);
  }
  
  if (industry && industry !== 'Other' && industry !== category) {
    pills.push(industry);
  }
  
  if (location && formatLocation(location)) {
    const cleanLocation = formatLocation(location);
    if (!pills.includes(cleanLocation)) {
      pills.push(cleanLocation);
    }
  }
  
  return pills.slice(0, 3); // Max 3 pills
}
