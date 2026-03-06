import { Cookie, Settings, Eye, Shield } from "lucide-react";
import HeroRegistry from "../components/shared/HeroRegistry";

export default function Cookies() {
  return (
    <div className="bg-[#f8f9fc] min-h-screen">
      <HeroRegistry
        badge="Legal"
        title="Cookie Policy"
        subtitle=""
        description="How we use cookies and similar technologies on Pacific Market."
      />

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-[0_12px_40px_rgba(10,22,40,0.08)] p-8">
            <div className="prose prose-sm max-w-none">
              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">What Are Cookies?</h2>
              <p className="text-gray-600 mb-6">
                Cookies are small text files that are stored on your device when you visit a website. They help us 
                provide, protect, and improve our services by remembering your preferences and activities.
              </p>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">GDPR Compliance</h2>
              <p className="text-gray-600 mb-6">
                Under GDPR, we require your explicit consent for non-essential cookies. Our cookie compliance includes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li><strong>Explicit Consent:</strong> Cookie consent banner for non-essential cookies</li>
                <li><strong>Granular Choices:</strong> Separate consent for different cookie categories</li>
                <li><strong>Easy Withdrawal:</strong> Manage cookie preferences at any time</li>
                <li><strong>Clear Information:</strong> Detailed descriptions of cookie purposes</li>
                <li><strong>Compliance Records:</strong> Documentation of consent when required</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">How We Use Cookies</h2>
              
              <h3 className="text-lg font-semibold text-[#0a1628] mb-4">Essential Cookies</h3>
              <p className="text-gray-600 mb-6">
                These cookies are necessary for our website to function properly. They enable basic functions like 
                page navigation, access to secure areas, and authentication.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>User authentication and session management</li>
                <li>Security tokens and fraud prevention</li>
                <li>Load balancing and server optimization</li>
                <li>Compliance with legal requirements</li>
              </ul>

              <h3 className="text-lg font-semibold text-[#0a1628] mb-4">Performance Cookies</h3>
              <p className="text-gray-600 mb-6">
                These cookies help us understand how our website is performing and how visitors interact with it.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>Website analytics and usage statistics</li>
                <li>Page load times and performance monitoring</li>
                <li>Error tracking and debugging</li>
                <li>User journey analysis</li>
              </ul>

              <h3 className="text-lg font-semibold text-[#0a1628] mb-4">Functional Cookies</h3>
              <p className="text-gray-600 mb-6">
                These cookies enhance your experience by remembering your preferences and choices.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>Language and region preferences</li>
                <li>Search history and filters</li>
                <li>Display settings and layout preferences</li>
                <li>Remembering your login status</li>
              </ul>

              <h3 className="text-lg font-semibold text-[#0a1628] mb-4">Marketing Cookies</h3>
              <p className="text-gray-600 mb-6">
                These cookies are used to deliver relevant advertising and track marketing effectiveness.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>Personalized content and recommendations</li>
                <li>Social media integration</li>
                <li>Ad campaign tracking and optimization</li>
                <li>Cross-site behavioral advertising</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">Third-Party Cookies</h2>
              <p className="text-gray-600 mb-6">
                We work with trusted third-party services that may place cookies on your device:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li><strong>Analytics Providers:</strong> Google Analytics, similar tools for website insights</li>
                <li><strong>Payment Processors:</strong> Stripe, PayPal for transaction processing</li>
                <li><strong>Social Media:</strong> Facebook, LinkedIn for social sharing and authentication</li>
                <li><strong>Content Delivery:</strong> Cloudflare, AWS for performance and security</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">Managing Your Cookie Preferences</h2>
              <p className="text-gray-600 mb-6">
                Under GDPR, you have full control over your cookie preferences:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li><strong>Cookie Consent Banner:</strong> Manage preferences when you first visit</li>
                <li><strong>Cookie Settings:</strong> Update preferences anytime in your browser settings</li>
                <li><strong>Browser Controls:</strong> Block or delete cookies through browser preferences</li>
                <li><strong>Opt-Out Tools:</strong> Use industry-standard tools for advertising cookies</li>
                <li><strong>Withdraw Consent:</strong> Remove consent at any time, affecting future data collection</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">Cookie Duration and GDPR</h2>
              <p className="text-gray-600 mb-6">
                Different cookies have different lifespans:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
                <li><strong>Persistent Cookies:</strong> Remain on your device for a set period (typically 30 days to 1 year)</li>
                <li><strong>Authentication Cookies:</strong> Usually last 24-48 hours for security</li>
                <li><strong>Analytics Cookies:</strong> Typically last 2 years for trend analysis</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">Your Rights Under GDPR</h2>
              <p className="text-gray-600 mb-6">
                Regarding cookies and tracking, you have the following rights:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li><strong>Right to Information:</strong> Clear details about all cookies we use</li>
                <li><strong>Right to Consent:</strong> Choose which cookies to accept or reject</li>
                <li><strong>Right to Withdraw:</strong> Change cookie preferences at any time</li>
                <li><strong>Right to Object:</strong> Refuse certain types of tracking cookies</li>
                <li><strong>Right to Erasure:</strong> Request deletion of cookie-related data</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">Impact of Disabling Cookies</h2>
              <p className="text-gray-600 mb-6">
                If you choose to disable cookies, some features of our website may not work properly:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>You may need to log in more frequently</li>
                <li>Personalized features may not be available</li>
                <li>Some interactive elements may not function</li>
                <li>We may not be able to remember your preferences</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">Your Rights and Choices</h2>
              <p className="text-gray-600 mb-6">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>Accept or reject non-essential cookies</li>
                <li>Withdraw consent at any time</li>
                <li>View what cookies are active on your device</li>
                <li>Request information about our cookie practices</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">Updates to This Policy</h2>
              <p className="text-gray-600 mb-6">
                We may update this cookie policy to reflect changes in our practices or applicable law. 
                We will notify you of any significant changes by posting the updated policy on our website.
              </p>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">Contact Us</h2>
              <p className="text-gray-600 mb-6">
                If you have questions about our use of cookies, please 
                <a href="/Contact" className="text-[#0d4f4f] hover:underline"> contact us</a>.
              </p>

              <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500">
                  <strong>Last updated:</strong> March 2026
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
