import { getHomepageBusinesses } from '@/lib/supabase/queries/businesses';

export default async function sitemap() {
  const [staticPages, businesses] = await Promise.all([
    // Static pages
    [
      {
        url: 'https://pacificdiscoverynetwork.com',
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 1.0,
      },
      {
        url: 'https://pacificdiscoverynetwork.com/pacificbusinesses',
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: 'https://pacificdiscoverynetwork.com/about',
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      },
      {
        url: 'https://pacificdiscoverynetwork.com/auth',
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      },
      {
        url: 'https://pacificdiscoverynetwork.com/signature-generator',
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      {
        url: 'https://pacificdiscoverynetwork.com/customer-portal',
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      },
    ],
    
    // Dynamic business pages
    getHomepageBusinesses({ limit: 100 }).then(({ data }) => 
      data?.map(business => ({
        url: `https://pacificdiscoverynetwork.com/business/${business.business_handle}`,
        lastModified: new Date(business.updated_at),
        changeFrequency: 'weekly',
        priority: 0.7,
      })) || []
    )
  ]);

  return [...staticPages, ...businesses];
}
