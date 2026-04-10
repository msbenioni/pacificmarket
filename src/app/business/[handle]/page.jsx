import { notFound } from 'next/navigation';
import { getBusinessByHandle } from '@/lib/supabase/queries/businesses';
import BusinessProfileClient from './BusinessProfileClient';

export default async function BusinessProfilePage({ params }) {
  const { handle } = params;

  if (!handle) {
    notFound();
  }

  try {
    // Server-side data fetching
    const business = await getBusinessByHandle(handle);

    if (!business) {
      notFound();
    }

    return <BusinessProfileClient business={business} />;
  } catch (error) {
    console.error('Error loading business profile:', error);
    notFound();
  }
}

// Generate static params for known businesses (optional)
export async function generateStaticParams() {
  try {
    // You can pre-generate some popular business pages
    // This is optional but helps with performance
    return [
      { handle: 'tivaevae-collectables' },
      // Add other popular businesses here
    ];
  } catch (error) {
    return [];
  }
}

// Enable ISR for dynamic content
export const revalidate = 3600; // Revalidate every hour
