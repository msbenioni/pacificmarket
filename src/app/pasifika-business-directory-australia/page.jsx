import Layout from "@/components/layout/Layout";
import Link from "next/link";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Pasifika Business Directory Australia",
  "description": "Directory of Pasifika-owned businesses in Australia",
  "url": "https://www.pacificdiscoverynetwork.com/pasifika-business-directory-australia",
  "mainEntity": {
    "@type": "Place",
    "name": "Australia",
    "description": "Pasifika businesses across Australia"
  }
};

export const metadata = {
  title: "Pasifika Business Directory Australia | Pacific Discovery Network",
  description: "Find Pasifika-owned businesses across Australia. Pacific Discovery Network connects you with businesses from Pacific communities operating in Australia.",
  keywords: ["Pasifika businesses Australia", "Pacific businesses Australia", "Pacific entrepreneurs Australia", "Sydney Pacific businesses", "Melbourne Pacific businesses"],
  openGraph: {
    title: "Pasifika Business Directory Australia | Pacific Discovery Network",
    description: "Find Pasifika-owned businesses across Australia and connect with Pacific entrepreneurs.",
    url: "https://www.pacificdiscoverynetwork.com/pasifika-business-directory-australia",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pasifika Business Directory Australia | Pacific Discovery Network",
    description: "Find Pasifika-owned businesses across Australia and connect with Pacific entrepreneurs.",
  },
};

export default function PasifikaBusinessDirectoryAustralia() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Layout currentPageName="pasifika-business-directory-australia">
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8 text-orange-900">
              Pasifika Business Directory Australia
            </h1>
            
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Find Pasifika-owned businesses across Australia. Pacific Discovery Network connects you with businesses from Pacific communities operating in Australia.
              </p>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-orange-800">
                  Where can I find Pasifika businesses in Australia?
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Pacific Discovery Network provides a growing directory of Pasifika businesses across Australia. Our platform connects you with authentic Pacific-owned enterprises from various communities including Samoan, Fijian, Tongan, Cook Islander, Niuean, and Tuvaluan businesses.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-orange-800">
                  Major Pasifika Business Hubs in Australia
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-orange-50 rounded-lg p-4">
                    <h3 className="font-semibold text-orange-900 mb-2">Sydney</h3>
                    <p className="text-gray-600 text-sm">
                      Largest Pasifika business community with strong presence in construction, hospitality, and professional services.
                    </p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <h3 className="font-semibold text-orange-900 mb-2">Melbourne</h3>
                    <p className="text-gray-600 text-sm">
                      Growing Pasifika entrepreneur community in retail, creative industries, and healthcare.
                    </p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <h3 className="font-semibold text-orange-900 mb-2">Brisbane</h3>
                    <p className="text-gray-600 text-sm">
                      Strong Pacific Islander business presence in logistics, manufacturing, and food services.
                    </p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <h3 className="font-semibold text-orange-900 mb-2">Perth</h3>
                    <p className="text-gray-600 text-sm">
                      Emerging Pasifika business community in mining services, construction, and retail.
                    </p>
                  </div>
                </div>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-orange-800">
                  Pacific Communities in Australian Business
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center bg-orange-50 rounded-lg p-4">
                    <div className="text-2xl mb-2">🇼🇸</div>
                    <p className="text-sm font-semibold text-gray-700">Samoan</p>
                    <p className="text-xs text-gray-600">Largest Pacific business community</p>
                  </div>
                  <div className="text-center bg-orange-50 rounded-lg p-4">
                    <div className="text-2xl mb-2">🇫🇯</div>
                    <p className="text-sm font-semibold text-gray-700">Fijian</p>
                    <p className="text-xs text-gray-600">Strong in hospitality and retail</p>
                  </div>
                  <div className="text-center bg-orange-50 rounded-lg p-4">
                    <div className="text-2xl mb-2">🇹🇴</div>
                    <p className="text-sm font-semibold text-gray-700">Tongan</p>
                    <p className="text-xs text-gray-600">Growing in professional services</p>
                  </div>
                  <div className="text-center bg-orange-50 rounded-lg p-4">
                    <div className="text-2xl mb-2">🇨🇰</div>
                    <p className="text-sm font-semibold text-gray-700">Cook Islander</p>
                    <p className="text-xs text-gray-600">Creative and cultural enterprises</p>
                  </div>
                  <div className="text-center bg-orange-50 rounded-lg p-4">
                    <div className="text-2xl mb-2">🇳🇺</div>
                    <p className="text-sm font-semibold text-gray-700">Niuean</p>
                    <p className="text-xs text-gray-600">Community-focused businesses</p>
                  </div>
                  <div className="text-center bg-orange-50 rounded-lg p-4">
                    <div className="text-2xl mb-2">🇹🇻</div>
                    <p className="text-sm font-semibold text-gray-700">Tuvaluan</p>
                    <p className="text-xs text-gray-600">Emerging entrepreneurs</p>
                  </div>
                </div>
              </section>
              
              <section className="bg-orange-50 rounded-lg p-6 text-center">
                <h2 className="text-2xl font-semibold mb-4 text-orange-900">
                  Own a Pasifika business in Australia?
                </h2>
                <p className="text-gray-700 mb-6">
                  Connect with customers and grow your business on Australia's leading Pacific business directory.
                </p>
                <div className="space-x-4">
                  <Link 
                    href="/BusinessLogin?mode=signup"
                    className="inline-block bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold"
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
              <h3 className="text-xl font-semibold mb-4 text-orange-800">
                Popular Pasifika Business Categories in Australia
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="bg-orange-100 rounded-lg p-4 mb-2">
                    <span className="text-2xl">🏗️</span>
                  </div>
                  <p className="text-sm text-gray-600">Construction</p>
                </div>
                <div className="text-center">
                  <div className="bg-orange-100 rounded-lg p-4 mb-2">
                    <span className="text-2xl">🍽️</span>
                  </div>
                  <p className="text-sm text-gray-600">Food & Hospitality</p>
                </div>
                <div className="text-center">
                  <div className="bg-orange-100 rounded-lg p-4 mb-2">
                    <span className="text-2xl">🚚</span>
                  </div>
                  <p className="text-sm text-gray-600">Logistics</p>
                </div>
                <div className="text-center">
                  <div className="bg-orange-100 rounded-lg p-4 mb-2">
                    <span className="text-2xl">💼</span>
                  </div>
                  <p className="text-sm text-gray-600">Professional Services</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
