import Layout from "@/components/layout/Layout";
import { getPublicBusinesses } from "@/lib/supabase/queries/businesses";
import PacificBusinessesClient from "./PacificBusinessesClient";

export const metadata = {
  title: "Pacific Businesses Directory",
  description: "Browse our comprehensive directory of Pacific Island businesses. Find restaurants, shops, services, and more from across the Pacific Islands. All businesses are verified and community-reviewed.",
  keywords: ["Pacific businesses directory", "Pacific Island businesses", "find Pacific businesses", "verified Pacific businesses", "Pacific marketplace"],
  openGraph: {
    title: "Pacific Businesses Directory - Pacific Discovery Network",
    description: "Browse verified Pacific Island businesses and discover unique products and services.",
    url: "https://www.pacificdiscoverynetwork.com/pacificbusinesses",
  }
};

export default async function PacificBusinessesPage() {
  // Server-side data fetching with caching
  const businesses = await getPublicBusinesses({ limit: 100 });
  
  // Pre-compute logo URLs on server to avoid client-side SVG generation
  const businessesWithLogos = (businesses.data || []).map(business => {
    // Use logo_url directly if it exists, otherwise generate on client
    const precomputedUrl = business.logo_url && business.logo_url.trim() !== "" 
      ? business.logo_url 
      : null;
    
    console.log("Server-side logo debug:", {
      businessName: business.business_name,
      logoUrl: business.logo_url,
      precomputedUrl: precomputedUrl,
      hasLogoUrl: !!business.logo_url
    });
    
    return {
      ...business,
      _precomputedLogoUrl: precomputedUrl
    };
  });

  return (
    <Layout currentPageName="PacificBusinesses">
      <PacificBusinessesClient initialBusinesses={businessesWithLogos} />
    </Layout>
  );
}

// Enable ISR for dynamic content
export const revalidate = 300; // Revalidate every 5 minutes
