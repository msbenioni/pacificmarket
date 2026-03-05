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
      category: "Getting Started",
      questions: [
        {
          q: "What is Pacific Market Registry?",
          a: "Pacific Market Registry is the first global structured registry of Pacific-owned businesses. We provide a searchable database that helps people discover, connect with, and support Pacific enterprises worldwide."
        },
        {
          q: "How do I create an account?",
          a: "Click 'Sign Up' in the top navigation, enter your email and create a password. You'll receive a confirmation email to verify your account. Once verified, you can submit business listings or access premium features."
        },
        {
          q: "Is Pacific Market Registry free to use?",
          a: "Basic browsing and searching is free for everyone. Business listings start with a free tier, with paid options for verified status and enhanced features. Researchers and organizations may require data access fees for bulk exports."
        },
        {
          q: "Who can list a business?",
          a: "Business owners, authorized representatives, or registry administrators can submit listings. All businesses must be Pacific-owned or have significant Pacific cultural connection to be included."
        }
      ]
    },
    {
      category: "Business Listings",
      questions: [
        {
          q: "What information do I need to submit a business?",
          a: "You'll need: business name, contact information, location, industry category, cultural identity information, and basic business details. Verification requires additional documentation like business registration papers."
        },
        {
          q: "How long does the review process take?",
          a: "Standard listings are typically reviewed within 2-3 business days. Verified listings may take 5-7 business days due to additional verification requirements."
        },
        {
          q: "Can I edit my listing after submission?",
          a: "Yes, you can edit your listing at any time from your account dashboard. Changes to verified information may require additional review to maintain verification status."
        },
        {
          q: "What's the difference between Active and Verified status?",
          a: "Active means the listing has been reviewed and approved. Verified means additional checks have been completed to confirm business authenticity, ownership, and cultural connection."
        },
        {
          q: "How do I upgrade my listing tier?",
          a: "Go to your account dashboard, select your business listing, and choose 'Upgrade'. Follow the payment process and your listing will be upgraded immediately."
        }
      ]
    },
    {
      category: "Verification Process",
      questions: [
        {
          q: "What does verification involve?",
          a: "Verification includes checking business registration documents, confirming Pacific ownership or cultural connection, validating contact information, and reviewing business legitimacy."
        },
        {
          q: "What documents do I need for verification?",
          a: "Typically: business registration certificate, proof of Pacific ownership or cultural identity, valid business license, and contact information. Specific requirements vary by business type and location."
        },
        {
          q: "Why was my verification request denied?",
          a: "Common reasons include: insufficient documentation, unclear Pacific connection, incomplete business information, or compliance issues. You'll receive specific feedback and can reapply after addressing the issues."
        },
        {
          q: "Is verification permanent?",
          a: "Verification status is reviewed annually. You may need to provide updated documentation to maintain verified status. Significant changes to your business may trigger a review."
        },
        {
          q: "Can I appeal a verification decision?",
          a: "Yes, you can appeal verification decisions by providing additional documentation or clarification. Contact our support team with your appeal request and supporting evidence."
        }
      ]
    },
    {
      category: "Using the Registry",
      questions: [
        {
          q: "How do I search for businesses?",
          a: "Use the search bar on the Registry page to search by business name, or use filters to search by location, industry, cultural identity, or verification status."
        },
        {
          q: "Can I contact businesses through the registry?",
          a: "Yes, verified businesses show their contact information. For basic listings, you may need to use the contact form to reveal contact details."
        },
        {
          q: "How accurate is the information?",
          a: "We strive for accuracy through our review and verification processes. However, information can change over time. Report any inaccuracies you find, and we'll investigate promptly."
        },
        {
          q: "Can I export data from the registry?",
          a: "Individual users can export their own business data. Researchers and organizations can request bulk data access through our contact form. Fees may apply for large datasets."
        },
        {
          q: "How often is the registry updated?",
          a: "New listings are added daily as they're approved. Existing businesses can update their information at any time. We conduct periodic reviews to ensure data quality."
        }
      ]
    },
    {
      category: "Account & Billing",
      questions: [
        {
          q: "How do I reset my password?",
          a: "Click 'Forgot Password' on the sign-in page, enter your email, and follow the instructions sent to your email. Password reset links expire after 24 hours."
        },
        {
          q: "Can I have multiple businesses under one account?",
          a: "Yes, you can manage multiple business listings from a single account. Each business can have its own tier and verification status."
        },
        {
          q: "What payment methods do you accept?",
          a: "We accept credit/debit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for annual subscriptions."
        },
        {
          q: "How do I cancel my subscription?",
          a: "Go to Account Settings > Billing > Manage Subscription. You can cancel at any time, and access will continue until the end of your billing period."
        },
        {
          q: "Do you offer refunds?",
          a: "We offer pro-rated refunds for annual subscriptions if canceled within 30 days. Monthly subscriptions are non-refundable but can be canceled to prevent future charges."
        }
      ]
    },
    {
      category: "Pricing & Plans",
      questions: [
        {
          q: "What does 'Verified' actually mean?",
          a: "Our governance team reviews your business identity, ownership, and cultural connection. A verified badge signals to the community and partners that your record has been independently confirmed."
        },
        {
          q: "Can I upgrade or downgrade my plan?",
          a: "Yes. You can upgrade at any time from your customer portal. Downgrades take effect at the end of your billing period."
        },
        {
          q: "Is there a fee to submit a free listing?",
          a: "No. Submitting a basic listing is completely free. Your application goes through admin review before being published."
        },
        {
          q: "What are the business tools?",
          a: "Featured+ includes a professional Invoice Generator and a QR Code Generator linked to your registry profile — designed for day-to-day Pacific business operations."
        }
      ]
    },
    {
      category: "Technical Support",
      questions: [
        {
          q: "Why isn't my search working?",
          a: "Check your spelling, try different keywords, or use fewer filters. If issues persist, clear your browser cache or try a different browser."
        },
        {
          q: "The website isn't loading properly. What should I do?",
          a: "Try refreshing the page, clearing your browser cache, or checking your internet connection. If problems continue, contact our technical support team."
        },
        {
          q: "Is the website mobile-friendly?",
          a: "Yes, our website is fully responsive and works on all devices. For the best experience, use updated browsers on your mobile device."
        },
        {
          q: "How do I report a technical issue?",
          a: "Use our contact form and select 'Technical Support' as the inquiry type. Include details about your device, browser, and the specific issue you're experiencing."
        }
      ]
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
            <div className="space-y-12">
              {faqs.map((category) => (
                <div key={category.category}>
                  <h3 className="text-xl font-bold text-[#0a1628] mb-6">{category.category}</h3>
                  <div className="space-y-4">
                    {category.questions.map((faq, index) => (
                      <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                        <h4 className="font-semibold text-[#0a1628] mb-3">{faq.q}</h4>
                        <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                      </div>
                    ))}
                  </div>
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
