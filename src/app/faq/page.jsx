import Layout from "@/components/layout/Layout";
import Link from "next/link";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is there a Pacific business directory?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Pacific Discovery Network is a global platform for discovering Pacific-owned businesses across New Zealand, Australia, and the Pacific Islands."
      }
    },
    {
      "@type": "Question",
      "name": "How do I find Pacific-owned businesses?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can search directly on Pacific Discovery Network by location and industry. The platform allows you to filter by country, business category, and specific services."
      }
    },
    {
      "@type": "Question",
      "name": "Can I list my business?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. You can join Pacific Discovery Network and list your business to increase visibility. Simply register and create your business profile in minutes."
      }
    },
    {
      "@type": "Question",
      "name": "Is PDN only for New Zealand?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. PDN is designed for Pacific businesses globally, including New Zealand, Australia, Pacific Islands, and the worldwide Pacific diaspora."
      }
    }
  ]
};

export const metadata = {
  title: "Pacific Business FAQ | Pacific Discovery Network",
  description: "Frequently asked questions about Pacific businesses, business directories, and how to discover or list Pacific-owned businesses globally.",
  keywords: ["Pacific business FAQ", "Pacific business directory questions", "Pasifika business inquiries", "Pacific entrepreneur FAQ"],
  openGraph: {
    title: "Pacific Business FAQ | Pacific Discovery Network",
    description: "Get answers to common questions about Pacific businesses and business directories.",
    url: "https://www.pacificdiscoverynetwork.com/faq",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pacific Business FAQ | Pacific Discovery Network",
    description: "Get answers to common questions about Pacific businesses and business directories.",
  },
};

export default function FAQ() {
  const faqs = [
    {
      question: "Is there a Pacific business directory?",
      answer: "Yes. Pacific Discovery Network is a global platform for discovering Pacific-owned businesses across New Zealand, Australia, and the Pacific Islands."
    },
    {
      question: "How do I find Pacific-owned businesses?",
      answer: "You can search directly on Pacific Discovery Network by location and industry. The platform allows you to filter by country, business category, and specific services."
    },
    {
      question: "Can I list my business?",
      answer: "Yes. You can join Pacific Discovery Network and list your business to increase visibility. Simply register and create your business profile in minutes."
    },
    {
      question: "Is PDN only for New Zealand?",
      answer: "No. PDN is designed for Pacific businesses globally, including New Zealand, Australia, Pacific Islands, and the worldwide Pacific diaspora."
    },
    {
      question: "What types of businesses are on PDN?",
      answer: "PDN features diverse Pacific-owned businesses including restaurants, construction companies, professional services, creative artists, retail shops, technology firms, healthcare providers, and many more."
    },
    {
      question: "How do I support Pacific businesses?",
      answer: "You can support Pacific businesses by purchasing their products and services, hiring them for projects, sharing their business with your network, leaving positive reviews, and choosing Pacific-owned businesses for your needs."
    },
    {
      question: "Are businesses on PDN verified?",
      answer: "Yes. All businesses on Pacific Discovery Network are verified as Pacific-owned to ensure authenticity and trust for customers looking to support genuine Pacific entrepreneurs."
    },
    {
      question: "Is it free to list my business?",
      answer: "Pacific Discovery Network offers various membership tiers including free options. Premium tiers provide additional features like enhanced visibility, advanced tools, and marketing support."
    },
    {
      question: "How do I contact businesses on PDN?",
      answer: "Each business listing includes direct contact information including phone, email, website, and social media links. You can reach out to businesses directly through their preferred contact methods."
    },
    {
      question: "What countries does PDN cover?",
      answer: "PDN covers Pacific businesses globally with strong presence in New Zealand, Australia, Fiji, Samoa, Tonga, Cook Islands, Niue, Tuvalu, and serves the Pacific diaspora worldwide."
    },
    {
      question: "How is PDN different from other directories?",
      answer: "PDN is specifically designed for Pacific businesses, understands Pacific cultural contexts, provides targeted tools for Pacific entrepreneurs, and focuses on building community connections rather than just listings."
    },
    {
      question: "Can customers leave reviews?",
      answer: "Yes. Customers can leave reviews and ratings for businesses they've worked with, helping others make informed decisions and supporting business reputation building."
    }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Layout currentPageName="faq">
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8 text-indigo-900">
              Pacific Business FAQ
            </h1>
            
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Get answers to common questions about Pacific businesses, business directories, and how Pacific Discovery Network helps connect customers with authentic Pacific-owned enterprises.
              </p>
              
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <h2 className="text-xl font-semibold mb-3 text-indigo-800">
                      {faq.question}
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-indigo-800">
                  For Business Owners
                </h3>
                <p className="text-gray-700 mb-4">
                  Ready to grow your Pacific business and reach more customers?
                </p>
                <Link 
                  href="/for-businesses"
                  className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Learn more
                </Link>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-indigo-800">
                  For Customers
                </h3>
                <p className="text-gray-700 mb-4">
                  Want to discover and support amazing Pacific businesses?
                </p>
                <Link 
                  href="/for-customers"
                  className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Browse businesses
                </Link>
              </div>
            </div>
            
            <div className="bg-indigo-50 rounded-lg p-6 text-center">
              <h2 className="text-2xl font-semibold mb-4 text-indigo-900">
                Still have questions?
              </h2>
              <p className="text-gray-700 mb-6">
                Contact our team and we'll be happy to help you with any inquiries about Pacific Discovery Network.
              </p>
              <Link 
                href="/Contact"
                className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
              >
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
