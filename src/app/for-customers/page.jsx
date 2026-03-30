import Layout from "@/components/layout/Layout";
import Link from "next/link";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Discover Pacific Businesses",
  "description": "Find and support Pacific-owned businesses globally",
  "url": "https://www.pacificdiscoverynetwork.com/for-customers",
  "mainEntity": {
    "@type": "ItemList",
    "name": "Pacific Business Directory",
    "description": "Directory of Pacific-owned businesses for customers"
  }
};

export const metadata = {
  title: "Discover Pacific Businesses | Pacific Discovery Network",
  description: "Explore and support Pacific-owned businesses across multiple industries and countries. Find authentic products and services from Pacific entrepreneurs.",
  keywords: ["Pacific businesses", "support Pacific businesses", "Pacific entrepreneurs", "Pasifika businesses", "Pacific business directory"],
  openGraph: {
    title: "Discover Pacific Businesses | Pacific Discovery Network",
    description: "Find and support authentic Pacific-owned businesses across New Zealand, Australia, and the Pacific Islands.",
    url: "https://www.pacificdiscoverynetwork.com/for-customers",
  },
  twitter: {
    card: "summary_large_image",
    title: "Discover Pacific Businesses | Pacific Discovery Network",
    description: "Find and support authentic Pacific-owned businesses across New Zealand, Australia, and the Pacific Islands.",
  },
};

export default function ForCustomers() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Layout currentPageName="for-customers">
        <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8 text-teal-900">
              Discover Pacific Businesses
            </h1>
            
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Explore and support Pacific-owned businesses across multiple industries and countries. Find authentic products and services from Pacific entrepreneurs.
              </p>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-teal-800">
                  Why use PDN?
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-teal-50 rounded-lg p-6">
                    <h3 className="font-semibold text-teal-900 mb-3">🔍 Find Businesses Easily</h3>
                    <p className="text-gray-700">
                      Search by location, industry, or services to find exactly what you need from Pacific-owned businesses.
                    </p>
                  </div>
                  <div className="bg-teal-50 rounded-lg p-6">
                    <h3 className="font-semibold text-teal-900 mb-3">🤝 Support Pacific Communities</h3>
                    <p className="text-gray-700">
                      Your purchases directly support Pacific families and strengthen community economic development.
                    </p>
                  </div>
                  <div className="bg-teal-50 rounded-lg p-6">
                    <h3 className="font-semibold text-teal-900 mb-3">🌺 Discover New Brands</h3>
                    <p className="text-gray-700">
                      Find unique products and services that reflect Pacific culture, creativity, and innovation.
                    </p>
                  </div>
                  <div className="bg-teal-50 rounded-lg p-6">
                    <h3 className="font-semibold text-teal-900 mb-3">✅ Verified Authentic</h3>
                    <p className="text-gray-700">
                      All businesses are verified as Pacific-owned, ensuring your support goes to genuine Pacific entrepreneurs.
                    </p>
                  </div>
                </div>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-teal-800">
                  Popular Categories
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center bg-teal-50 rounded-lg p-4 hover:bg-teal-100 transition-colors cursor-pointer">
                    <div className="text-3xl mb-2">🍽️</div>
                    <h4 className="font-semibold text-gray-800">Food & Dining</h4>
                    <p className="text-sm text-gray-600">Restaurants, catering, food products</p>
                  </div>
                  <div className="text-center bg-teal-50 rounded-lg p-4 hover:bg-teal-100 transition-colors cursor-pointer">
                    <div className="text-3xl mb-2">🎨</div>
                    <h4 className="font-semibold text-gray-800">Arts & Crafts</h4>
                    <p className="text-sm text-gray-600">Artists, crafts, cultural products</p>
                  </div>
                  <div className="text-center bg-teal-50 rounded-lg p-4 hover:bg-teal-100 transition-colors cursor-pointer">
                    <div className="text-3xl mb-2">💼</div>
                    <h4 className="font-semibold text-gray-800">Professional Services</h4>
                    <p className="text-sm text-gray-600">Consulting, legal, accounting</p>
                  </div>
                  <div className="text-center bg-teal-50 rounded-lg p-4 hover:bg-teal-100 transition-colors cursor-pointer">
                    <div className="text-3xl mb-2">🏗️</div>
                    <h4 className="font-semibold text-gray-800">Construction</h4>
                    <p className="text-sm text-gray-600">Building, trades, maintenance</p>
                  </div>
                  <div className="text-center bg-teal-50 rounded-lg p-4 hover:bg-teal-100 transition-colors cursor-pointer">
                    <div className="text-3xl mb-2">💅</div>
                    <h4 className="font-semibold text-gray-800">Beauty & Wellness</h4>
                    <p className="text-sm text-gray-600">Salons, spas, health services</p>
                  </div>
                  <div className="text-center bg-teal-50 rounded-lg p-4 hover:bg-teal-100 transition-colors cursor-pointer">
                    <div className="text-3xl mb-2">👕</div>
                    <h4 className="font-semibold text-gray-800">Fashion & Retail</h4>
                    <p className="text-sm text-gray-600">Clothing, accessories, shops</p>
                  </div>
                  <div className="text-center bg-teal-50 rounded-lg p-4 hover:bg-teal-100 transition-colors cursor-pointer">
                    <div className="text-3xl mb-2">🚚</div>
                    <h4 className="font-semibold text-gray-800">Transport & Logistics</h4>
                    <p className="text-sm text-gray-600">Moving, delivery, transport</p>
                  </div>
                  <div className="text-center bg-teal-50 rounded-lg p-4 hover:bg-teal-100 transition-colors cursor-pointer">
                    <div className="text-3xl mb-2">📱</div>
                    <h4 className="font-semibold text-gray-800">Technology</h4>
                    <p className="text-sm text-gray-600">IT services, digital solutions</p>
                  </div>
                </div>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-teal-800">
                  How to Support Pacific Businesses
                </h2>
                <div className="space-y-4">
                  <div className="bg-teal-50 rounded-lg p-4">
                    <h4 className="font-semibold text-teal-900 mb-2">🛒 Shop Direct</h4>
                    <p className="text-gray-700">Purchase directly from Pacific-owned businesses rather than through intermediaries.</p>
                  </div>
                  <div className="bg-teal-50 rounded-lg p-4">
                    <h4 className="font-semibold text-teal-900 mb-2">📣 Share Their Stories</h4>
                    <p className="text-gray-700">Tell friends and family about great Pacific businesses you've discovered.</p>
                  </div>
                  <div className="bg-teal-50 rounded-lg p-4">
                    <h4 className="font-semibold text-teal-900 mb-2">⭐ Leave Reviews</h4>
                    <p className="text-gray-700">Share positive experiences to help others discover these businesses.</p>
                  </div>
                  <div className="bg-teal-50 rounded-lg p-4">
                    <h4 className="font-semibold text-teal-900 mb-2">🤝 Hire Pacific Services</h4>
                    <p className="text-gray-700">Choose Pacific-owned businesses for your personal and professional needs.</p>
                  </div>
                </div>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-teal-800">
                  Browse by Location
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <Link 
                    href="/pacific-businesses-new-zealand"
                    className="bg-teal-50 rounded-lg p-6 hover:bg-teal-100 transition-colors text-center group"
                  >
                    <div className="text-4xl mb-3">🇳🇿</div>
                    <h3 className="font-semibold text-gray-800 group-hover:text-teal-700">New Zealand</h3>
                    <p className="text-sm text-gray-600">Pacific businesses across NZ</p>
                  </Link>
                  <Link 
                    href="/pasifika-business-directory-australia"
                    className="bg-teal-50 rounded-lg p-6 hover:bg-teal-100 transition-colors text-center group"
                  >
                    <div className="text-4xl mb-3">🇦🇺</div>
                    <h3 className="font-semibold text-gray-800 group-hover:text-teal-700">Australia</h3>
                    <p className="text-sm text-gray-600">Pasifika businesses in Australia</p>
                  </Link>
                  <div className="bg-teal-50 rounded-lg p-6 hover:bg-teal-100 transition-colors text-center group cursor-pointer">
                    <div className="text-4xl mb-3">🏝️</div>
                    <h3 className="font-semibold text-gray-800 group-hover:text-teal-700">Pacific Islands</h3>
                    <p className="text-sm text-gray-600">Businesses across the islands</p>
                  </div>
                </div>
              </section>
              
              <section className="bg-teal-50 rounded-lg p-6 text-center">
                <h2 className="text-2xl font-semibold mb-4 text-teal-900">
                  Ready to Discover Amazing Pacific Businesses?
                </h2>
                <p className="text-gray-700 mb-6">
                  Start exploring our directory and connect with authentic Pacific-owned businesses today.
                </p>
                <div className="space-x-4">
                  <Link 
                    href="/PacificBusinesses"
                    className="inline-block bg-teal-600 text-white px-8 py-3 rounded-lg hover:bg-teal-700 transition-colors font-semibold"
                  >
                    Browse businesses
                  </Link>
                  <Link 
                    href="/pacific-business-directory"
                    className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    View directory
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
