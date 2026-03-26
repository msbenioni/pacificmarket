import { pagesConfig } from "@/pages.config";
import Layout from "@/components/layout/Layout";

export const metadata = {
  title: "Home - Discover Pacific Owned Businesses",
  description: "Welcome to Pacific Discovery Network. Explore our curated directory of authentic Pacific Island businesses, from local artisans to modern enterprises. Support Pacific communities by connecting with verified businesses.",
  keywords: ["Pacific businesses", "Pacific Islands", "local businesses", "Pacific entrepreneurs", "Island economy"],
  openGraph: {
    title: "Pacific Discovery Network - Home",
    description: "Discover authentic Pacific Island businesses and support local communities.",
    url: "https://pacificdiscoverynetwork.com/",
  }
};

export default function HomePage() {
  const { Pages, mainPage } = pagesConfig;
  const mainPageKey = mainPage ?? Object.keys(Pages)[0];
  const MainPage = Pages[mainPageKey];

  return (
    <Layout currentPageName={mainPageKey}>
      <MainPage />
    </Layout>
  );
}
