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

  return (
    <Layout currentPageName="PacificBusinesses">
      <PacificBusinessesClient initialBusinesses={businesses.data || []} />
    </Layout>
  );
}

// Enable ISR for dynamic content
export const revalidate = 300; // Revalidate every 5 minutes
