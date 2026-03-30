import Layout from "@/components/layout/Layout";
import Link from "next/link";

export const metadata = {
  title: "How to Find Pacific Businesses | Pacific Discovery Network",
  description: "Finding Pacific businesses can be difficult without a central platform. Pacific Discovery Network solves this by providing one place to discover Pacific-owned businesses globally.",
  keywords: ["find Pacific businesses", "Pacific business search", "Pasifika business directory", "Pacific entrepreneurs", "Pacific business finder"],
  openGraph: {
    title: "How to Find Pacific Businesses | Pacific Discovery Network",
    description: "The best way to find Pacific-owned businesses globally with our comprehensive directory.",
    url: "https://www.pacificdiscoverynetwork.com/find-pacific-businesses",
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Find Pacific Businesses | Pacific Discovery Network",
    description: "The best way to find Pacific-owned businesses globally with our comprehensive directory.",
  },
};

export default function FindPacificBusinesses() {
  return (
    <Layout currentPageName="find-pacific-businesses">
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8 text-purple-900">
              How to Find Pacific Businesses
            </h1>
            
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Finding Pacific businesses can be difficult without a central platform. Pacific Discovery Network solves this by providing one place to discover Pacific-owned businesses globally.
              </p>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-purple-800">
                  Best way to find Pacific businesses
                </h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-3">
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">Use a dedicated platform like PDN:</span>
                    <span>Pacific Discovery Network is specifically designed for Pacific businesses, making it easier to find what you're looking for.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">Search by location and industry:</span>
                    <span>Filter by country (New Zealand, Australia, Pacific Islands) and business category.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">Follow Pacific entrepreneurs online:</span>
                    <span>Many Pacific businesses have active social media presence and community networks.</span>
                  </li>
                </ol>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-purple-800">
                  Why is it hard to find Pacific businesses?
                </h2>
                <div className="bg-purple-50 rounded-lg p-6">
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span>Businesses are spread across multiple platforms and directories</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span>No centralized database specifically for Pacific-owned enterprises</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span>Many small businesses have limited online presence</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span>Language and cultural barriers in business listings</span>
                    </li>
                  </ul>
                </div>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-purple-800">
                  How Pacific Discovery Network Helps
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-purple-50 rounded-lg p-6">
                    <h3 className="font-semibold text-purple-900 mb-3">🔍 Advanced Search</h3>
                    <p className="text-gray-700 text-sm">
                      Search by location, industry, services, and cultural identity to find exactly what you need.
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-6">
                    <h3 className="font-semibold text-purple-900 mb-3">✅ Verified Listings</h3>
                    <p className="text-gray-700 text-sm">
                      All businesses are verified as Pacific-owned, ensuring authenticity and trust.
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-6">
                    <h3 className="font-semibold text-purple-900 mb-3">🌍 Global Coverage</h3>
                    <p className="text-gray-700 text-sm">
                      From New Zealand to Australia and the Pacific Islands - all in one place.
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-6">
                    <h3 className="font-semibold text-purple-900 mb-3">🤝 Direct Connection</h3>
                    <p className="text-gray-700 text-sm">
                      Contact businesses directly without intermediaries or complicated processes.
                    </p>
                  </div>
                </div>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-purple-800">
                  Search Tips for Finding Pacific Businesses
                </h2>
                <div className="space-y-4">
                  <div className="border-l-4 border-purple-600 pl-4">
                    <h4 className="font-semibold text-gray-800">Be Specific in Your Search</h4>
                    <p className="text-gray-600">Use specific terms like "Samoan restaurant Auckland" or "Fijian construction Sydney"</p>
                  </div>
                  <div className="border-l-4 border-purple-600 pl-4">
                    <h4 className="font-semibold text-gray-800">Check Multiple Categories</h4>
                    <p className="text-gray-600">Many Pacific businesses operate in multiple sectors - explore different categories</p>
                  </div>
                  <div className="border-l-4 border-purple-600 pl-4">
                    <h4 className="font-semibold text-gray-800">Use Location Filters</h4>
                    <p className="text-gray-600">Start broad with country, then narrow down to specific cities or regions</p>
                  </div>
                  <div className="border-l-4 border-purple-600 pl-4">
                    <h4 className="font-semibold text-gray-800">Look for Community Connections</h4>
                    <p className="text-gray-600">Many Pacific businesses are connected through community networks and churches</p>
                  </div>
                </div>
              </section>
              
              <section className="bg-purple-50 rounded-lg p-6 text-center">
                <h2 className="text-2xl font-semibold mb-4 text-purple-900">
                  Ready to Discover Pacific Businesses?
                </h2>
                <p className="text-gray-700 mb-6">
                  Start your search on Pacific Discovery Network and connect with authentic Pacific-owned businesses today.
                </p>
                <div className="space-x-4">
                  <Link 
                    href="/PacificBusinesses"
                    className="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                  >
                    Search businesses
                  </Link>
                  <Link 
                    href="/PacificBusinesses"
                    className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Browse directory
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </div>
      </Layout>
  );
}
