import About from "@/screens/About";
import { organizationSchema } from "@/utils/structuredData";

export const metadata = {
  title: "About Pacific Discovery Network",
  description: "Learn about Pacific Discovery Network's mission to strengthen visibility and discoverability of Pacific-owned businesses. Built by Pacific founders for Pacific enterprise.",
  keywords: ["Pacific Discovery Network", "Pacific businesses", "Pacific entrepreneurs", "Island business directory", "Pacific enterprise", "Aotearoa businesses"],
  openGraph: {
    title: "About Pacific Discovery Network",
    description: "Built to make Pacific business easier to discover. Learn our story and mission.",
    url: "https://pacificdiscoverynetwork.com/about",
  }
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <About />
    </>
  );
}
