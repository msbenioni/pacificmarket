import { ArrowRight, Shield, Users, Eye } from "lucide-react";
import HeroRegistry from "../components/shared/HeroRegistry";

export default function Terms() {
  return (
    <div className="bg-[#f8f9fc] min-h-screen">
      <HeroRegistry
        badge="Legal"
        title="Terms & Conditions"
        subtitle=""
        description="The terms and conditions governing your use of Pacific Market Registry."
      />

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-[0_12px_40px_rgba(10,22,40,0.08)] p-8">
            <div className="prose prose-sm max-w-none">
              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">1. Acceptance of Terms</h2>
              <p className="text-gray-600 mb-6">
                By accessing and using Pacific Market Registry, you accept and agree to be bound by these Terms & Conditions. 
                If you do not agree to these terms, you should not use this service.
              </p>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">2. Service Description</h2>
              <p className="text-gray-600 mb-6">
                Pacific Market Registry is a structured database of Pacific-owned businesses. We provide:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>Business directory and search functionality</li>
                <li>Verification services for business listings</li>
                <li>Data insights and analytics</li>
                <li>Business tools and resources</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">3. User Responsibilities</h2>
              <p className="text-gray-600 mb-6">As a user of Pacific Market Registry, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>Provide accurate and truthful information</li>
                <li>Not misuse the service for illegal purposes</li>
                <li>Respect the intellectual property rights of others</li>
                <li>Not attempt to harm or disrupt our systems</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">4. Business Listings</h2>
              <p className="text-gray-600 mb-6">
                Business owners submitting listings warrant that they have the authority to represent the business 
                and that all information provided is accurate. We reserve the right to remove or edit listings 
                that violate these terms.
              </p>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">5. Verification Process</h2>
              <p className="text-gray-600 mb-6">
                Our verification process is designed to confirm business authenticity. However, we cannot guarantee 
                the absolute accuracy of all information and users should exercise due diligence.
              </p>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">6. Intellectual Property</h2>
              <p className="text-gray-600 mb-6">
                All content, design, and functionality of Pacific Market Registry is protected by intellectual 
                property laws. You may not copy, reproduce, or distribute our content without permission.
              </p>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">7. Limitation of Liability</h2>
              <p className="text-gray-600 mb-6">
                Pacific Market Registry is provided "as is" without warranties of any kind. We are not liable for 
                any damages arising from your use of our service, including but not limited to direct, indirect, 
                incidental, or consequential damages.
              </p>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">8. Privacy</h2>
              <p className="text-gray-600 mb-6">
                Your privacy is important to us. Please review our Privacy Policy to understand how we collect, 
                use, and protect your information.
              </p>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">9. Term and Termination</h2>
              <p className="text-gray-600 mb-6">
                These terms remain in effect as long as you use our service. We may terminate or suspend access 
                to our service at any time, with or without cause.
              </p>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">10. Changes to Terms</h2>
              <p className="text-gray-600 mb-6">
                We reserve the right to modify these terms at any time. Changes will be effective immediately 
                upon posting. Your continued use of the service constitutes acceptance of any changes.
              </p>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">11. Contact Information</h2>
              <p className="text-gray-600 mb-6">
                If you have questions about these Terms & Conditions, please contact us through our 
                <a href="/Contact" className="text-[#0d4f4f] hover:underline"> contact page</a>.
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
