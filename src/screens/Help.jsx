import { HelpCircle, BookOpen, MessageCircle, Search } from "lucide-react";
import HeroRegistry from "../components/shared/HeroRegistry";
import CookieManager from "../components/shared/CookieManager";

export default function Help() {
  const helpCategories = [
    {
      icon: BookOpen,
      title: "Getting Started",
      articles: [
        "How to create an account",
        "Submitting a business listing",
        "Understanding verification tiers",
        "Navigating the registry"
      ]
    },
    {
      icon: Search,
      title: "Business Listings",
      articles: [
        "How to edit your business profile",
        "Verification process explained",
        "Upgrading your listing tier",
        "Managing multiple businesses"
      ]
    },
    {
      icon: MessageCircle,
      title: "Using the Registry",
      articles: [
        "Searching for businesses",
        "Using filters effectively",
        "Contacting listed businesses",
        "Understanding business profiles"
      ]
    },
    {
      icon: HelpCircle,
      title: "Account & Billing",
      articles: [
        "Managing your subscription",
        "Payment methods and billing",
        "Canceling your account",
        "Data export requests"
      ]
    }
  ];

  const faqs = [
    {
      question: "How long does verification take?",
      answer: "Standard verification typically takes 3-5 business days. Verified listings may take 5-7 business days depending on the complexity of the verification required."
    },
    {
      question: "Can I edit my business listing after submission?",
      answer: "Yes, you can edit your business listing at any time from your account dashboard. Changes to verified information may require additional review."
    },
    {
      question: "What information is required for verification?",
      answer: "Verification requires business registration documents, proof of Pacific ownership or cultural connection, and valid contact information. Specific requirements vary by business type and location."
    },
    {
      question: "How do I report incorrect information?",
      answer: "Use the 'Report Issue' button on any business profile or contact us directly. We review all reports within 2-3 business days."
    },
    {
      question: "Is my information secure?",
      answer: "Yes, we use industry-standard encryption and security measures. Personal information is only shared as necessary for verification purposes or as required by law."
    },
    {
      question: "Can I export data from the registry?",
      answer: "Basic users can export their own business data. Researchers and organizations can request bulk data access through our contact form."
    }
  ];

  return (
    <div className="bg-[#f8f9fc] min-h-screen">
      <HeroRegistry
        badge="Support"
        title="Help Center"
        subtitle=""
        description="Find answers to common questions and learn how to make the most of Pacific Market Registry."
      />

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Search Bar */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-[0_12px_40px_rgba(10,22,40,0.08)] p-8 mb-8">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-[#0a1628] mb-6 text-center">How can we help you?</h2>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for help articles, FAQs, or topics..."
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/30 focus:border-[#0d4f4f]"
                />
              </div>
            </div>
          </div>

          {/* Help Categories */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {helpCategories.map((category) => (
              <div key={category.title} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-[0_12px_40px_rgba(10,22,40,0.06)] hover:shadow-[0_18px_50px_rgba(10,22,40,0.10)] transition-shadow">
                <div className="w-11 h-11 rounded-xl bg-[#0a1628] flex items-center justify-center mb-4">
                  <category.icon className="w-5 h-5 text-[#00c4cc]" />
                </div>
                <h3 className="font-bold text-[#0a1628] mb-4">{category.title}</h3>
                <ul className="space-y-2">
                  {category.articles.map((article) => (
                    <li key={article}>
                      <a href="#" className="text-sm text-gray-600 hover:text-[#0d4f4f] transition-colors">
                        {article}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Quick Links */}
          <div className="bg-[#eef0f5] border border-gray-200 rounded-2xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-[#0a1628] mb-6">Quick Actions</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <a href="/ApplyListing" className="flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-lg bg-[#0d4f4f]/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-[#0d4f4f]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#0a1628]">Submit a Business</p>
                    <p className="text-sm text-gray-600">Add your business to the registry</p>
                  </div>
                </a>
                <a href="/Pricing" className="flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-lg bg-[#0d4f4f]/10 flex items-center justify-center">
                    <HelpCircle className="w-5 h-5 text-[#0d4f4f]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#0a1628]">Upgrade Listing</p>
                    <p className="text-sm text-gray-600">View pricing and features</p>
                  </div>
                </a>
                <a href="/Contact" className="flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-lg bg-[#0d4f4f]/10 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-[#0d4f4f]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#0a1628]">Contact Support</p>
                    <p className="text-sm text-gray-600">Get help from our team</p>
                  </div>
                </a>
              </div>
              <div>
                <CookieManager />
              </div>
            </div>
          </div>

          {/* FAQs */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-[0_12px_40px_rgba(10,22,40,0.08)] p-8">
            <h2 className="text-2xl font-bold text-[#0a1628] mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
                  <h3 className="font-semibold text-[#0a1628] mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Still Need Help */}
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold text-[#0a1628] mb-4">Still Need Help?</h2>
            <p className="text-gray-600 mb-6">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <a
              href="/Contact"
              className="inline-flex items-center gap-2 bg-[#0d4f4f] hover:bg-[#0a3d3d] text-white font-semibold px-8 py-4 rounded-xl transition-all"
            >
              Contact Support Team <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
