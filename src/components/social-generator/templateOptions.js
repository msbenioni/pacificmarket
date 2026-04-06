/**
 * Template options for PDN Social Asset Generator
 * Defines the 3 distinct social-ready template variants
 */

export const TEMPLATE_OPTIONS = [
  {
    id: 'editorial',
    name: 'Editorial',
    description: 'Premium, minimal design for LinkedIn and polished Instagram posts',
    platforms: ['LinkedIn', 'Instagram'],
    useCase: 'Business features, professional introductions'
  },
  {
    id: 'promo',
    name: 'Promo Card',
    description: 'Bold, scroll-stopping design for Facebook and Instagram discovery',
    platforms: ['Instagram', 'Facebook'],
    useCase: 'New business announcements, discovery posts'
  },
  {
    id: 'story',
    name: 'Story Feature',
    description: 'Warm, human design for founder stories and cultural storytelling',
    platforms: ['Instagram', 'Facebook'],
    useCase: 'Founder stories, community highlights, cultural features'
  }
];

// Text length constraints for each template
export const TEXT_LIMITS = {
  editorial: {
    businessName: 50,
    tagline: 70,
    supportingLine: 90,
    maxChips: 2
  },
  promo: {
    businessName: 50,
    tagline: 70,
    supportingLine: 90,
    maxChips: 2
  },
  story: {
    businessName: 50,
    tagline: 70,
    storyExcerpt: 180,
    maxChips: 3
  }
};
