import { Database, Shield, Lock, Users } from "lucide-react";
import HeroRegistry from "../components/shared/HeroRegistry";

export default function Data() {
  return (
    <div className="bg-[#f8f9fc] min-h-screen">
      <HeroRegistry
        badge="Legal"
        title="Data Protection"
        subtitle=""
        description="How we protect and manage data in Pacific Market."
      />

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-[0_12px_40px_rgba(10,22,40,0.08)] p-8">
            <div className="prose prose-sm max-w-none">
              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">Our Commitment to Data Protection</h2>
              <p className="text-gray-600 mb-6">
                Pacific Market is committed to protecting the privacy and security of all data we collect, 
                process, and store. We adhere to strict data protection principles and comply with applicable 
                privacy laws and regulations.
              </p>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">Data Protection Principles</h2>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="font-semibold text-[#0a1628] mb-3">Lawfulness, Fairness & Transparency</h3>
                  <p className="text-sm text-gray-600">
                    We process data lawfully, fairly, and in a transparent manner. Users are informed about 
                    what data we collect and why.
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="font-semibold text-[#0a1628] mb-3">Purpose Limitation</h3>
                  <p className="text-sm text-gray-600">
                    We only collect data for specified, explicit, and legitimate purposes. Data is not 
                    processed in ways incompatible with these purposes.
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="font-semibold text-[#0a1628] mb-3">Data Minimisation</h3>
                  <p className="text-sm text-gray-600">
                    We only collect and process data that is necessary for our stated purposes. 
                    No excessive or irrelevant data is retained.
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="font-semibold text-[#0a1628] mb-3">Accuracy</h3>
                  <p className="text-sm text-gray-600">
                    We take reasonable steps to ensure data is accurate and kept up-to-date. 
                    Users can correct inaccurate information.
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="font-semibold text-[#0a1628] mb-3">Storage Limitation</h3>
                  <p className="text-sm text-gray-600">
                    Data is retained only as long as necessary for the purposes it was collected. 
                    Secure deletion procedures are followed.
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="font-semibold text-[#0a1628] mb-3">Security & Integrity</h3>
                  <p className="text-sm text-gray-600">
                    We implement appropriate technical and organisational measures to protect data 
                    against unauthorized access, alteration, or destruction.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">Data Categories We Process</h2>
              
              <h3 className="text-lg font-semibold text-[#0a1628] mb-4">Business Registry Data</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>Business name, description, and contact information</li>
                <li>Location, industry, and operational details</li>
                <li>Cultural identity and language information</li>
                <li>Verification status and supporting documents</li>
                <li>Website and social media profiles</li>
              </ul>

              <h3 className="text-lg font-semibold text-[#0a1628] mb-4">User Account Data</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>Personal identification information (name, email)</li>
                <li>Account credentials and authentication data</li>
                <li>Communication preferences and history</li>
                <li>Usage patterns and interaction data</li>
                <li>Support requests and feedback</li>
              </ul>

              <h3 className="text-lg font-semibold text-[#0a1628] mb-4">Technical Data</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>IP addresses and device information</li>
                <li>Browser type and version</li>
                <li>Access times and duration</li>
                <li>Pages visited and referral sources</li>
                <li>Cookies and tracking identifiers</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">Security Measures</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#0d4f4f]/10 flex items-center justify-center flex-shrink-0">
                    <Lock className="w-5 h-5 text-[#0d4f4f]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0a1628] mb-2">Encryption</h3>
                    <p className="text-sm text-gray-600">
                      All data is encrypted in transit using TLS 1.2+ and at rest using industry-standard 
                      encryption algorithms.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#0d4f4f]/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-[#0d4f4f]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0a1628] mb-2">Access Control</h3>
                    <p className="text-sm text-gray-600">
                      Strict access controls with role-based permissions. Multi-factor authentication 
                      required for administrative access.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#0d4f4f]/10 flex items-center justify-center flex-shrink-0">
                    <Database className="w-5 h-5 text-[#0d4f4f]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0a1628] mb-2">Regular Audits</h3>
                    <p className="text-sm text-gray-600">
                      Regular security audits, penetration testing, and vulnerability assessments 
                      to identify and address potential risks.
                    </p>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">Data Subject Rights</h2>
              <p className="text-gray-600 mb-6">You have the following rights regarding your personal data:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li><strong>Right to Access:</strong> Request a copy of your personal data</li>
                <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete data</li>
                <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
                <li><strong>Right to Portability:</strong> Receive data in a structured, machine-readable format</li>
                <li><strong>Right to Restrict Processing:</strong> Limit how we process your data</li>
                <li><strong>Right to Object:</strong> Object to certain types of data processing</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">Data Breach Response</h2>
              <p className="text-gray-600 mb-6">
                In the event of a data breach, we will:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>Assess the scope and impact of the breach within 72 hours</li>
                <li>Notify affected individuals and relevant authorities as required</li>
                <li>Take immediate steps to contain and remediate the breach</li>
                <li>Implement measures to prevent future occurrences</li>
                <li>Document the breach and our response for regulatory compliance</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">International Data Transfers</h2>
              <p className="text-gray-600 mb-6">
                We may transfer data internationally but ensure appropriate safeguards are in place:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>Data Processing Agreements with adequate protection clauses</li>
                <li>Use of EU Standard Contractual Clauses where applicable</li>
                <li>Compliance with relevant data protection frameworks</li>
                <li>Regular review of international transfer mechanisms</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">Contact for Data Protection Issues</h2>
              <p className="text-gray-600 mb-6">
                For data protection inquiries, to exercise your rights, or report a concern, please 
                <a href="/Contact" className="text-[#0d4f4f] hover:underline"> contact our Data Protection Officer</a>.
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
