import { pagesConfig } from "@/pages.config";
import Layout from "@/components/layout/Layout";

export const metadata = {
  title: "Pacific Businesses Directory",
  description: "Browse our comprehensive directory of Pacific Island businesses. Find restaurants, shops, services, and more from across the Pacific Islands. All businesses are verified and community-reviewed.",
  keywords: ["Pacific businesses directory", "Pacific Island businesses", "find Pacific businesses", "verified Pacific businesses", "Pacific marketplace"],
  openGraph: {
    title: "Pacific Businesses Directory - Pacific Discovery Network",
    description: "Browse verified Pacific Island businesses and discover unique products and services.",
    url: "https://pacificdiscoverynetwork.com/pacificbusinesses",
  }
};

export default function PacificBusinessesPage() {
  const { Pages } = pagesConfig;
  const PacificBusinessesPage = Pages["PacificBusinesses"];

  return (
    <Layout currentPageName="PacificBusinesses">
      <PacificBusinessesPage />
    </Layout>
  );
}
