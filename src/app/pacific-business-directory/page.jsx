import Layout from "@/components/layout/Layout";
import Link from "next/link";

export const metadata = {
  title: "Pacific Business Directory | Pacific Discovery Network",
  description: "Looking for Pacific-owned businesses? Pacific Discovery Network is a global platform designed to help you discover, support, and connect with Pacific businesses across New Zealand, Australia, and the Pacific Islands.",
  keywords: ["Pacific business directory", "Pacific-owned businesses", "Pasifika businesses", "Pacific entrepreneurs", "Island businesses"],
  openGraph: {
    title: "Pacific Business Directory | Pacific Discovery Network",
    description: "Discover and support Pacific-owned businesses across New Zealand, Australia, and the Pacific Islands.",
    url: "https://www.pacificdiscoverynetwork.com/pacific-business-directory",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pacific Business Directory | Pacific Discovery Network",
    description: "Discover and support Pacific-owned businesses across New Zealand, Australia, and the Pacific Islands.",
  },
};

export default function PacificBusinessDirectory() {
  return (
    <Layout currentPageName="pacific-business-directory">
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8 text-blue-900">
              Pacific Business Directory
            </h1>
            
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Looking for Pacific-owned businesses? Pacific Discovery Network is a global platform designed to help you discover, support, and connect with Pacific businesses across New Zealand, Australia, and the Pacific Islands.
              </p>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-blue-800">
                  What is a Pacific business directory?
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  A Pacific business directory is a platform that helps people find businesses owned by Pacific entrepreneurs. Pacific Discovery Network goes beyond a directory by helping businesses get discovered, grow visibility, and connect globally.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-blue-800">
                  Where can I find Pacific-owned businesses?
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You can explore Pacific-owned businesses directly on Pacific Discovery Network. Businesses are searchable by location, industry, and services.
                </p>
                <Link 
                  href="/PacificBusinesses"
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse Pacific Businesses
                </Link>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-blue-800">
                  Why Pacific Discovery Network?
                </h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Global Pacific business visibility</li>
                  <li>Built-in tools (invoice generator, QR codes)</li>
                  <li>Designed for discovery, not just listings</li>
                  <li>Supports Pacific entrepreneurs worldwide</li>
                </ul>
              </section>
              
              <section className="bg-blue-50 rounded-lg p-6 text-center">
                <h2 className="text-2xl font-semibold mb-4 text-blue-900">
                  Own a Pacific business?
                </h2>
                <p className="text-gray-700 mb-6">
                  Join Pacific Discovery Network and get discovered by customers, collaborators, and opportunities worldwide.
                </p>
                <Link 
                  href="/BusinessLogin?mode=signup"
                  className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  List your business
                </Link>
              </section>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Link 
                href="/pacific-businesses-new-zealand"
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-2 text-blue-800">
                  Pacific Businesses in New Zealand
                </h3>
                <p className="text-gray-600">
                  Discover Pacific-owned businesses across Auckland, Wellington, Christchurch, and beyond.
                </p>
              </Link>
              
              <Link 
                href="/pasifika-business-directory-australia"
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-2 text-blue-800">
                  Pasifika Businesses in Australia
                </h3>
                <p className="text-gray-600">
                  Find Pasifika-owned businesses across Australia.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
  );
}
