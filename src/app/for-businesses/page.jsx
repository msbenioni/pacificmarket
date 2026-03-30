import Layout from "@/components/layout/Layout";
import Link from "next/link";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Pacific Business Growth Platform",
  "description": "Pacific Discovery Network helps Pacific businesses get discovered and grow globally",
  "url": "https://www.pacificdiscoverynetwork.com/for-businesses",
  "provider": {
    "@type": "Organization",
    "name": "Pacific Discovery Network"
  }
};

export const metadata = {
  title: "Grow Your Pacific Business | Pacific Discovery Network",
  description: "Pacific Discovery Network helps Pacific businesses get discovered, grow visibility, and connect with new opportunities globally.",
  keywords: ["Pacific business growth", "Pacific business marketing", "Pacific entrepreneur support", "Pacific business visibility", "Pacific business directory"],
  openGraph: {
    title: "Grow Your Pacific Business | Pacific Discovery Network",
    description: "Join Pacific Discovery Network to get discovered, grow visibility, and connect with opportunities globally.",
    url: "https://www.pacificdiscoverynetwork.com/for-businesses",
  },
  twitter: {
    card: "summary_large_image",
    title: "Grow Your Pacific Business | Pacific Discovery Network",
    description: "Join Pacific Discovery Network to get discovered, grow visibility, and connect with opportunities globally.",
  },
};

export default function ForBusinesses() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Layout currentPageName="for-businesses">
        <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8 text-emerald-900">
              Grow Your Pacific Business
            </h1>
            
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Pacific Discovery Network helps Pacific businesses get discovered, grow visibility, and connect with new opportunities.
              </p>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-emerald-800">
                  What you get
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-emerald-50 rounded-lg p-6">
                    <h3 className="font-semibold text-emerald-900 mb-3">🌍 Global Exposure</h3>
                    <p className="text-gray-700">
                      Reach customers across New Zealand, Australia, Pacific Islands, and the global Pacific diaspora.
                    </p>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-6">
                    <h3 className="font-semibold text-emerald-900 mb-3">🔍 Discovery-Based Traffic</h3>
                    <p className="text-gray-700">
                      Get found by customers actively searching for Pacific-owned businesses like yours.
                    </p>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-6">
                    <h3 className="font-semibold text-emerald-900 mb-3">🛠️ Business Tools</h3>
                    <p className="text-gray-700">
                      Access free tools including invoice generator, QR codes, and email signature creator.
                    </p>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-6">
                    <h3 className="font-semibold text-emerald-900 mb-3">📈 Marketing Support</h3>
                    <p className="text-gray-700">
                      Built-in marketing features to help you promote your business and services.
                    </p>
                  </div>
                </div>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-emerald-800">
                  Why Pacific Businesses Choose PDN
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-emerald-100 rounded-full p-2 mt-1">
                      <span className="text-emerald-600">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Built for Pacific Entrepreneurs</h4>
                      <p className="text-gray-600">Our platform understands the unique needs and challenges of Pacific businesses.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-emerald-100 rounded-full p-2 mt-1">
                      <span className="text-emerald-600">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Community-Focused</h4>
                      <p className="text-gray-600">Join a network of Pacific entrepreneurs supporting each other's growth.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-emerald-100 rounded-full p-2 mt-1">
                      <span className="text-emerald-600">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Easy to Use</h4>
                      <p className="text-gray-600">Simple setup process with tools designed for busy business owners.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-emerald-100 rounded-full p-2 mt-1">
                      <span className="text-emerald-600">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Real Results</h4>
                      <p className="text-gray-600">Businesses on PDN report increased visibility and customer inquiries.</p>
                    </div>
                  </div>
                </div>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-emerald-800">
                  Success Stories
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-emerald-50 rounded-lg p-6">
                    <div className="flex items-center mb-3">
                      <div className="bg-emerald-200 rounded-full w-12 h-12 flex items-center justify-center mr-3">
                        <span className="text-emerald-800 font-bold">A</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">Anna's Pacific Catering</h4>
                        <p className="text-sm text-gray-600">Auckland, NZ</p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm italic">
                      "Since joining PDN, we've seen a 40% increase in catering inquiries from corporate clients looking to support Pacific businesses."
                    </p>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-6">
                    <div className="flex items-center mb-3">
                      <div className="bg-emerald-200 rounded-full w-12 h-12 flex items-center justify-center mr-3">
                        <span className="text-emerald-800 font-bold">M</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">Meli Construction</h4>
                        <p className="text-sm text-gray-600">Sydney, Australia</p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm italic">
                      "PDN helped us connect with other Pacific businesses and we've formed partnerships that have doubled our project pipeline."
                    </p>
                  </div>
                </div>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-emerald-800">
                  Getting Started is Simple
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-emerald-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Create Your Profile</h4>
                      <p className="text-gray-600">Sign up and add your business details in minutes</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="bg-emerald-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Customize Your Listing</h4>
                      <p className="text-gray-600">Add photos, services, and your unique story</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="bg-emerald-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Start Getting Discovered</h4>
                      <p className="text-gray-600">Customers can find and contact you immediately</p>
                    </div>
                  </div>
                </div>
              </section>
              
              <section className="bg-emerald-50 rounded-lg p-6 text-center">
                <h2 className="text-2xl font-semibold mb-4 text-emerald-900">
                  Ready to Grow Your Business?
                </h2>
                <p className="text-gray-700 mb-6">
                  Join thousands of Pacific entrepreneurs who are already getting discovered on Pacific Discovery Network.
                </p>
                <div className="space-x-4">
                  <Link 
                    href="/BusinessLogin?mode=signup"
                    className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
                  >
                    Join now
                  </Link>
                  <Link 
                    href="/Pricing"
                    className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    View pricing
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
