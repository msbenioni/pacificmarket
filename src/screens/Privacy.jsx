import { Shield, Eye, Lock, Database } from "lucide-react";
import HeroStandard from "../components/shared/HeroStandard";

export default function Privacy() {
  return (
    <div className="bg-[#f8f9fc] min-h-screen">
      <HeroStandard
        badge="Legal"
        title="Privacy Policy"
        subtitle=""
        description="How we collect, use, and protect your information on Pacific Discovery Network."
      />

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-[0_12px_40px_rgba(10,22,40,0.08)] p-8">
            <div className="prose prose-sm max-w-none">
              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">1. Information We Collect</h2>
              
              <h3 className="text-lg font-semibold text-[#0a1628] mb-4">Business Information</h3>
              <p className="text-gray-600 mb-6">
                When you submit a business listing, we collect:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>Business name, description, and contact details</li>
                <li>Location and industry information</li>
                <li>Cultural identity and language information</li>
                <li>Website and social media links</li>
                <li>Verification documents (when applicable)</li>
              </ul>

              <h3 className="text-lg font-semibold text-[#0a1628] mb-4">Personal Information</h3>
              <p className="text-gray-600 mb-6">
                When you create an account or contact us, we collect:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>Name and email address</li>
                <li>Phone number (when provided)</li>
                <li>Account preferences and settings</li>
                <li>Communication history</li>
              </ul>

              <h3 className="text-lg font-semibold text-[#0a1628] mb-4">Technical Information</h3>
              <p className="text-gray-600 mb-6">
                We automatically collect certain technical information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>IP address and browser type</li>
                <li>Device information and operating system</li>
                <li>Pages visited and time spent on our site</li>
                <li>Referral source and location data</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">2. How We Use Your Information</h2>
              <p className="text-gray-600 mb-6">We use your information to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>Provide and maintain our Pacific Discovery Network service</li>
                <li>Process business listings and verification requests</li>
                <li>Communicate with you about your account</li>
                <li>Improve our services and user experience</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">3. Lawful Basis for Processing</h2>
              <p className="text-gray-600 mb-6">
                Under GDPR, we only process personal data when we have a lawful basis. Our lawful bases include:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li><strong>Consent:</strong> When you explicitly agree to our processing of your data</li>
                <li><strong>Contract:</strong> When processing is necessary for our service agreement</li>
                <li><strong>Legal Obligation:</strong> When required by law or regulatory requirements</li>
                <li><strong>Legitimate Interests:</strong> When processing is necessary for our legitimate business interests</li>
                <li><strong>Public Interest:</strong> For maintaining Pacific Discovery Network and supporting Pacific communities</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">4. Information Sharing</h2>
              <p className="text-gray-600 mb-6">
                We do not sell your personal information. We may share information in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li><strong>Public Listings:</strong> Business information is publicly displayed in Pacific Discovery Network</li>
                <li><strong>Service Providers:</strong> With trusted third parties who help us operate our service</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">5. Your Rights Under GDPR</h2>
              <p className="text-gray-600 mb-6">Under GDPR, you have the following rights:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li><strong>Right to be Informed:</strong> Clear information about how we use your data</li>
                <li><strong>Right of Access:</strong> Request a copy of your personal data</li>
                <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete data</li>
                <li><strong>Right to Erasure:</strong> Request deletion of your personal data ('Right to be forgotten')</li>
                <li><strong>Right to Restrict Processing:</strong> Limit how we process your data</li>
                <li><strong>Right to Data Portability:</strong> Receive data in a structured, machine-readable format</li>
                <li><strong>Right to Object:</strong> Object to certain types of data processing</li>
                <li><strong>Rights Related to Automated Decision Making:</strong> Protection from automated profiling</li>
              </ul>
              <p className="text-gray-600 mb-6">
                To exercise these rights, please contact us using the details provided at the end of this policy. 
                We will respond to your request within one month of receipt.
              </p>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">6. Data Security</h2>
              <p className="text-gray-600 mb-6">
                We implement appropriate security measures to protect your information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>Secure servers and encryption protocols</li>
                <li>Regular security audits and updates</li>
                <li>Limited employee access to personal data</li>
                <li>Secure data transmission protocols</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">5. Your Rights</h2>
              <p className="text-gray-600 mb-6">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>Access and update your personal information</li>
                <li>Request deletion of your account and data</li>
                <li>Opt out of marketing communications</li>
                <li>Request a copy of your data</li>
                <li>Object to certain data processing activities</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">7. Cookies and Tracking</h2>
              <p className="text-gray-600 mb-6">
                We use cookies and similar technologies. Under GDPR, we require your consent for non-essential cookies:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li><strong>Essential Cookies:</strong> Required for basic functionality (no consent needed)</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how our site is used (consent required)</li>
                <li><strong>Marketing Cookies:</strong> Used for personalized advertising (consent required)</li>
                <li><strong>Functional Cookies:</strong> Remember your preferences (consent required)</li>
              </ul>
              <p className="text-gray-600 mb-6">
                You can manage cookie preferences through our cookie consent banner or browser settings.
              </p>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">8. Data Retention</h2>
              <p className="text-gray-600 mb-6">
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li><strong>Account Data:</strong> Retained while your account is active</li>
                <li><strong>Business Listings:</strong> Retained until you request deletion</li>
                <li><strong>Analytics Data:</strong> Anonymized after 26 months</li>
                <li><strong>Support Communications:</strong> Retained for 3 years</li>
                <li><strong>Legal Requirements:</strong> Retained as required by law</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">9. International Data Transfers</h2>
              <p className="text-gray-600 mb-6">
                Your information may be transferred to and processed in countries other than your own. Under GDPR, 
                we ensure appropriate safeguards are in place for such transfers:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>Data Processing Agreements with adequate protection clauses</li>
                <li>Use of EU Standard Contractual Clauses where applicable</li>
                <li>Compliance with GDPR adequacy decisions</li>
                <li>Regular review of international transfer mechanisms</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">10. Children's Privacy</h2>
              <p className="text-gray-600 mb-6">
                Our service is not intended for children under 16. We do not knowingly collect personal information 
                from children under this age.
              </p>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">11. Changes to This Policy</h2>
              <p className="text-gray-600 mb-6">
                We may update this privacy policy from time to time. Under GDPR, we will notify you of any significant changes 
                by posting the new policy on our website and updating the "Last updated" date. For substantial changes, 
                we may also notify you by email or other direct communication.
              </p>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">12. Data Protection Officer</h2>
              <p className="text-gray-600 mb-6">
                Under GDPR, we have appointed a Data Protection Officer (DPO) to oversee our data protection practices. 
                You can contact our DPO directly for data protection concerns:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>Email: support@pacificdiscoverynetwork.com</li>
                <li>Response time: Within 30 days for GDPR requests</li>
                <li>Responsibilities: Overseeing compliance, handling requests, advising on data protection</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">13. Right to Lodge a Complaint</h2>
              <p className="text-gray-600 mb-6">
                If you believe we have violated your data protection rights under GDPR, you have the right to 
                lodge a complaint with a supervisory authority. In the EU, you can contact your local data protection 
                authority or the Irish Data Protection Commission (our EU representative).
              </p>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">14. Contact Us</h2>
              <p className="text-gray-600 mb-6">
                If you have questions about this privacy policy or want to exercise your rights, please 
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
