import Layout from "@/components/layout/Layout";
import Link from "next/link";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Pacific Businesses in New Zealand",
  "description": "Directory of Pacific-owned businesses in New Zealand",
  "url": "https://www.pacificdiscoverynetwork.com/pacific-businesses-new-zealand",
  "mainEntity": {
    "@type": "Place",
    "name": "New Zealand",
    "description": "Pacific businesses across New Zealand"
  }
};

export const metadata = {
  title: "Pacific Businesses in New Zealand | Pacific Discovery Network",
  description: "Discover Pacific-owned businesses across Auckland, Wellington, Christchurch, and beyond. Pacific Discovery Network helps you find and support Pasifika entrepreneurs in New Zealand.",
  keywords: ["Pacific businesses New Zealand", "Pasifika businesses NZ", "Pacific entrepreneurs NZ", "Auckland Pacific businesses", "Wellington Pacific businesses"],
  openGraph: {
    title: "Pacific Businesses in New Zealand | Pacific Discovery Network",
    description: "Discover Pacific-owned businesses across New Zealand and support Pasifika entrepreneurs.",
    url: "https://www.pacificdiscoverynetwork.com/pacific-businesses-new-zealand",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pacific Businesses in New Zealand | Pacific Discovery Network",
    description: "Discover Pacific-owned businesses across New Zealand and support Pasifika entrepreneurs.",
  },
};

export default function PacificBusinessesNewZealand() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Layout currentPageName="pacific-businesses-new-zealand">
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8 text-green-900">
              Pacific Businesses in New Zealand
            </h1>
            
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Discover Pacific-owned businesses across Auckland, Wellington, Christchurch, and beyond. Pacific Discovery Network helps you find and support Pasifika entrepreneurs in New Zealand.
              </p>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-green-800">
                  Are there Pacific businesses in New Zealand?
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Yes. New Zealand has a strong and growing Pacific business community across industries like food, services, creative, and trade.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-green-800">
                  How do I support Pacific businesses in NZ?
                </h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Buy directly from Pacific-owned brands</li>
                  <li>Share their services</li>
                  <li>Hire local Pacific businesses</li>
                  <li>Discover them on PDN</li>
                </ul>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-green-800">
                  Major Pacific Business Hubs in NZ
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 mb-2">Auckland</h3>
                    <p className="text-gray-600 text-sm">
                      Home to the largest Pacific business community with diverse industries from hospitality to professional services.
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 mb-2">Wellington</h3>
                    <p className="text-gray-600 text-sm">
                      Strong Pacific presence in government, creative industries, and tech sectors.
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 mb-2">Christchurch</h3>
                    <p className="text-gray-600 text-sm">
                      Growing Pacific business community in construction, retail, and services.
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 mb-2">Hamilton</h3>
                    <p className="text-gray-600 text-sm">
                      Emerging Pacific entrepreneurs in agriculture, manufacturing, and logistics.
                    </p>
                  </div>
                </div>
              </section>
              
              <section className="bg-green-50 rounded-lg p-6 text-center">
                <h2 className="text-2xl font-semibold mb-4 text-green-900">
                  Own a Pacific business in New Zealand?
                </h2>
                <p className="text-gray-700 mb-6">
                  Join thousands of Pacific entrepreneurs getting discovered on Pacific Discovery Network.
                </p>
                <div className="space-x-4">
                  <Link 
                    href="/BusinessLogin?mode=signup"
                    className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    List your business
                  </Link>
                  <Link 
                    href="/PacificBusinesses"
                    className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Browse businesses
                  </Link>
                </div>
              </section>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-green-800">
                Popular Pacific Business Categories in NZ
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="bg-green-100 rounded-lg p-4 mb-2">
                    <span className="text-2xl">🍽️</span>
                  </div>
                  <p className="text-sm text-gray-600">Food & Hospitality</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 rounded-lg p-4 mb-2">
                    <span className="text-2xl">👔</span>
                  </div>
                  <p className="text-sm text-gray-600">Professional Services</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 rounded-lg p-4 mb-2">
                    <span className="text-2xl">🎨</span>
                  </div>
                  <p className="text-sm text-gray-600">Creative & Arts</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 rounded-lg p-4 mb-2">
                    <span className="text-2xl">🏗️</span>
                  </div>
                  <p className="text-sm text-gray-600">Construction</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
