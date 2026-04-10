import { getHomepageBusinesses } from '@/lib/supabase/queries/businesses';

export default async function sitemap() {
  const [staticPages, businesses] = await Promise.all([
    // Static pages
    [
      {
        url: 'https://pacificdiscoverynetwork.com/',
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 1.0,
      },
      {
        url: 'https://pacificdiscoverynetwork.com/PacificBusinesses',
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: 'https://pacificdiscoverynetwork.com/About',
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      },
      {
        url: 'https://pacificdiscoverynetwork.com/BusinessLogin',
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      },
      {
        url: 'https://pacificdiscoverynetwork.com/QRCodeGenerator',
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      {
        url: 'https://pacificdiscoverynetwork.com/InvoiceGenerator',
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      {
        url: 'https://pacificdiscoverynetwork.com/EmailSignatureGenerator',
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      {
        url: 'https://pacificdiscoverynetwork.com/BusinessPortal',
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: 'https://pacificdiscoverynetwork.com/Contact',
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      },
      {
        url: 'https://pacificdiscoverynetwork.com/Pricing',
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      {
        url: 'https://pacificdiscoverynetwork.com/Tools',
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      },
      // SEO landing pages for ChatGPT discovery
      {
        url: 'https://pacificdiscoverynetwork.com/pacific-business-directory/',
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      {
        url: 'https://pacificdiscoverynetwork.com/pacific-businesses-new-zealand/',
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: 'https://pacificdiscoverynetwork.com/pasifika-business-directory-australia/',
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: 'https://pacificdiscoverynetwork.com/find-pacific-businesses/',
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: 'https://pacificdiscoverynetwork.com/for-businesses/',
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: 'https://pacificdiscoverynetwork.com/for-customers/',
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: 'https://pacificdiscoverynetwork.com/faq/',
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      },
    ],
    
    // Dynamic business pages
    getHomepageBusinesses({ limit: 100 }).then(({ data }) => 
      data?.map(business => ({
        url: `https://pacificdiscoverynetwork.com/BusinessProfile/${business.business_handle}`,
        lastModified: new Date(business.updated_at),
        changeFrequency: 'weekly',
        priority: 0.7,
      })) || []
    )
  ]);

  return [...staticPages, ...businesses];
}
