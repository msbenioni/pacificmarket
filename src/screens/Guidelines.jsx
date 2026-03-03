import { Users, Shield, Heart, Flag } from "lucide-react";
import HeroRegistry from "../components/shared/HeroRegistry";

export default function Guidelines() {
  return (
    <div className="bg-[#f8f9fc] min-h-screen">
      <HeroRegistry
        badge="Support"
        title="Community Guidelines"
        subtitle=""
        description="Our standards for maintaining a respectful and valuable Pacific Market Registry community."
      />

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-[0_12px_40px_rgba(10,22,40,0.08)] p-8">
            <div className="prose prose-sm max-w-none">
              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">Upholding Integrity, Respect & Cultural Pride</h2>
              <p className="text-gray-600 mb-6">
                Pacific Market Registry is built on respect, integrity, and cultural responsibility.
                These guidelines ensure our registry remains a trusted resource for communities, researchers, partners, and Pacific-owned businesses globally.
              </p>
              <p className="text-gray-600 mb-6">
                Our goal is simple: To represent Pacific enterprise accurately, respectfully, and responsibly.
              </p>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">Our Community Commitment</h2>
              <p className="text-gray-600 mb-6">
                Pacific Market exists to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>Preserve cultural identity with care</li>
                <li>Maintain high data integrity standards</li>
                <li>Support Pacific businesses of all sizes</li>
                <li>Ensure visibility without compromising authenticity</li>
              </ul>
              <p className="text-gray-600 mb-6">
                We are building a living registry — not just a listing platform — and every record contributes to a long-term cultural and economic map of Pacific-owned enterprise.
              </p>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">Core Principles</h2>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[#0d4f4f]/10 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-[#0d4f4f]" />
                    </div>
                    <h3 className="font-semibold text-[#0a1628]">Cultural Respect & Sensitivity</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Honor Pacific cultures, traditions, and diversity. Use respectful language and avoid misrepresentation, stereotypes, or cultural appropriation.
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[#0d4f4f]/10 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-[#0d4f4f]" />
                    </div>
                    <h3 className="font-semibold text-[#0a1628]">Integrity & Accuracy</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Provide truthful, clear, and up-to-date information about your business, services, and identity.
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[#0d4f4f]/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-[#0d4f4f]" />
                    </div>
                    <h3 className="font-semibold text-[#0a1628]">Pacific-led Stewardship</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Pacific Market is built in Aotearoa and guided by Pacific values. Community context matters.
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[#0d4f4f]/10 flex items-center justify-center">
                      <Flag className="w-5 h-5 text-[#0d4f4f]" />
                    </div>
                    <h3 className="font-semibold text-[#0a1628]">Lawful & Ethical Operation</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Businesses listed must operate lawfully within their local context — including market permits, council rules, licenses, or other applicable requirements.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">Business Listing Guidelines</h2>
              
              <h3 className="text-lg font-semibold text-[#0a1628] mb-4">Who Can Apply</h3>
              <p className="text-gray-600 mb-4">
                Pacific Market welcomes businesses of all sizes, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>Market stallholders</li>
                <li>Home-based businesses</li>
                <li>Sole traders</li>
                <li>Early-stage enterprises</li>
                <li>Established registered companies</li>
              </ul>
              <p className="text-gray-600 mb-6 font-medium">
                If you generate goods or services for sale and have meaningful Pacific ownership or cultural connection, you are eligible to apply.
              </p>
              <p className="text-gray-600 mb-6">
                We intentionally include businesses that may not yet have a strong digital presence. The registry reflects real Pacific enterprise — not only those already visible online.
              </p>

              <h3 className="text-lg font-semibold text-[#0a1628] mb-4">Eligibility Requirements</h3>
              <p className="text-gray-600 mb-4">
                To be listed, businesses must:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>Be Pacific-owned or have a significant Pacific cultural connection</li>
                <li>Operate lawfully within their local context</li>
                <li>Provide accurate business details and contact information</li>
                <li>Represent their cultural identity truthfully</li>
                <li>Respect community and cultural standards</li>
              </ul>

              <h3 className="text-lg font-semibold text-[#0a1628] mb-4">Content Standards</h3>
              <p className="text-gray-600 mb-6">
                All listings must:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>Accurately describe products or services</li>
                <li>Use professional and appropriate images</li>
                <li>Present cultural identity respectfully and authentically</li>
                <li>Avoid misleading claims about credentials, awards, or affiliations</li>
                <li>Avoid offensive, discriminatory, or inappropriate material</li>
              </ul>

              <h3 className="text-lg font-semibold text-[#0a1628] mb-4">Prohibited Content</h3>
              <p className="text-gray-600 mb-6">
                Pacific Market does not permit listings involving:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>Illegal activities or services</li>
                <li>Hate speech, discrimination, or harassment</li>
                <li>Fraudulent or deceptive business practices</li>
                <li>Misrepresentation of cultural identity or heritage</li>
                <li>Content that violates intellectual property rights</li>
                <li>Adult content or inappropriate material</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">User Conduct Guidelines</h2>
              <p className="text-gray-600 mb-6">
                Pacific Market connects communities. We expect respectful behaviour.
              </p>
              
              <h3 className="text-lg font-semibold text-[#0a1628] mb-4">When Contacting Businesses</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>Communicate professionally and respectfully</li>
                <li>Clearly state your purpose or intentions</li>
                <li>Respect business hours and preferred contact methods</li>
                <li>Do not send spam or unsolicited marketing</li>
                <li>Honor cultural protocols and etiquette</li>
              </ul>

              <h3 className="text-lg font-semibold text-[#0a1628] mb-4">Community Interaction</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>Constructive feedback is welcome</li>
                <li>Celebrate and share positive experiences</li>
                <li>Support and uplift Pacific entrepreneurs</li>
                <li>Report inappropriate behaviour when necessary</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">Verification & Registry Status</h2>
              <p className="text-gray-600 mb-6">
                Every listing is reviewed before being published.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li><strong>Active Listing:</strong> Approved and visible in the registry</li>
                <li><strong>Verified Listing:</strong> Additional checks completed to strengthen authenticity and trust</li>
              </ul>
              <p className="text-gray-600 mb-6">
                Verification strengthens confidence but does not imply government endorsement or legal certification.
              </p>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">Enforcement & Consequences</h2>
              
              <h3 className="text-lg font-semibold text-[#0a1628] mb-4">Review Process</h3>
              <p className="text-gray-600 mb-6">
                Reported concerns are reviewed within 3-5 business days. We consider cultural context and fairness in all moderation decisions.
              </p>

              <h3 className="text-lg font-semibold text-[#0a1628] mb-4">Possible Actions</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>Warning and request for correction</li>
                <li>Temporary suspension of listing</li>
                <li>Removal from registry</li>
                <li>Reporting to relevant authorities (if required by law)</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">Reporting Concerns</h2>
              <p className="text-gray-600 mb-6">
                We rely on community accountability. You may report:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>Inaccurate business information</li>
                <li>Fraudulent or misleading activity</li>
                <li>Cultural misrepresentation</li>
                <li>Harassment or inappropriate behaviour</li>
              </ul>
              <p className="text-gray-600 mb-6">
                Reports can be submitted via the "Report" feature on listings or by contacting the registry team directly. Where possible, include:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>A clear description of the issue</li>
                <li>Screenshots or supporting evidence</li>
                <li>Your relationship to the situation (if relevant)</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">Cultural Considerations</h2>
              <p className="text-gray-600 mb-6">
                Pacific cultures are diverse and dynamic. We encourage:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>Respect for regional differences</li>
                <li>Proper use of cultural symbols and language</li>
                <li>Seeking guidance when unsure about representation</li>
                <li>Celebrating diversity within Pacific communities</li>
              </ul>
              <p className="text-gray-600 mb-6">
                Cultural identity is core data within the registry — it must be handled with care.
              </p>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">Updates & Governance</h2>
              <p className="text-gray-600 mb-6">
                These guidelines may evolve as the registry grows. Significant updates will be communicated to registered users.
              </p>
              <p className="text-gray-600 mb-6">
                Pacific Market is a living record. As Pacific enterprise evolves, so will our standards.
              </p>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">Questions About the Guidelines?</h2>
              <p className="text-gray-600 mb-6">
                If you need clarification on eligibility, verification, or content standards, please 
                <a href="/Contact" className="text-[#0d4f4f] hover:underline"> contact our community team</a>.
              </p>

              <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500">
                  <strong>Last updated:</strong> March 2026
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  <strong>Next review:</strong> September 2026
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
