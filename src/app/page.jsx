import { pagesConfig } from "@/pages.config";
import Layout from "@/components/layout/Layout";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Pacific Discovery Network",
  "url": "https://www.pacificdiscoverynetwork.com",
  "description": "Global discovery network for Pacific businesses",
  "sameAs": [
    "https://www.pacificdiscoverynetwork.com"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service"
  },
  "mainEntity": {
    "@type": "ItemList",
    "name": "Pacific Business Directory",
    "description": "Directory of Pacific-owned businesses globally"
  }
};

export const metadata = {
  title: "Home - Discover Pacific Owned Businesses",
  description: "Welcome to Pacific Discovery Network. Explore our curated directory of authentic Pacific Island businesses, from local artisans to modern enterprises. Support Pacific communities by connecting with verified businesses.",
  keywords: ["Pacific businesses", "Pacific Islands", "local businesses", "Pacific entrepreneurs", "Island economy"],
  openGraph: {
    title: "Pacific Discovery Network - Home",
    description: "Discover authentic Pacific Island businesses and support local communities.",
    url: "https://www.pacificdiscoverynetwork.com/",
  }
};

export default function HomePage() {
  const { Pages, mainPage } = pagesConfig;
  const mainPageKey = mainPage ?? Object.keys(Pages)[0];
  const MainPage = Pages[mainPageKey];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Layout currentPageName={mainPageKey}>
        <MainPage />
      </Layout>
    </>
  );
}
