import { Users, Shield, Heart, Flag } from "lucide-react";
import HeroStandard from "../components/shared/HeroStandard";

export default function Guidelines() {
  return (
    <div className="bg-[#f8f9fc] min-h-screen">
      <HeroStandard
        badge="Support"
        title="Community Guidelines"
        subtitle=""
        description="Our standards for keeping Pacific Discovery Network respectful, trustworthy, and valuable for businesses, communities, and partners."
      />

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-[0_12px_40px_rgba(10,22,40,0.08)] p-8">
            <div className="prose prose-sm max-w-none">
              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">
                Built on Respect, Trust, and Cultural Care
              </h2>
              <p className="text-gray-600 mb-6">
                Pacific Discovery Network is built to help people discover,
                connect with, and support Pacific-owned businesses in a way that
                is respectful, accurate, and culturally grounded.
              </p>
              <p className="text-gray-600 mb-6">
                These guidelines help protect the quality of the platform,
                strengthen trust across the network, and ensure Pacific business
                visibility is approached with integrity.
              </p>
              <p className="text-gray-600 mb-6">
                Our goal is simple: to create a discovery experience that
                reflects Pacific enterprise with care, pride, and credibility.
              </p>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">
                Our Community Commitment
              </h2>
              <p className="text-gray-600 mb-6">
                Pacific Discovery Network exists to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>Support Pacific business visibility with integrity</li>
                <li>Respect cultural identity and context</li>
                <li>Strengthen trust between businesses and communities</li>
                <li>Make discovery more meaningful, not just more searchable</li>
              </ul>
              <p className="text-gray-600 mb-6">
                We are building more than a listing platform. We are building a
                trusted discovery network that helps Pacific enterprise become
                easier to find, understand, and support across regions and
                communities.
              </p>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">
                Core Principles
              </h2>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[#0d4f4f]/10 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-[#0d4f4f]" />
                    </div>
                    <h3 className="font-semibold text-[#0a1628]">
                      Cultural Respect
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Honor Pacific cultures, stories, identities, and diversity.
                    Avoid stereotypes, cultural misuse, or representation that
                    lacks care and respect.
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[#0d4f4f]/10 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-[#0d4f4f]" />
                    </div>
                    <h3 className="font-semibold text-[#0a1628]">
                      Accuracy and Trust
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Business information should be truthful, current, and
                    presented clearly so people can discover and engage with
                    confidence.
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[#0d4f4f]/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-[#0d4f4f]" />
                    </div>
                    <h3 className="font-semibold text-[#0a1628]">
                      Pacific-led Stewardship
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Pacific Discovery Network is Pacific-led and shaped with
                    community context in mind. Representation matters, and so
                    does how that representation is handled.
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[#0d4f4f]/10 flex items-center justify-center">
                      <Flag className="w-5 h-5 text-[#0d4f4f]" />
                    </div>
                    <h3 className="font-semibold text-[#0a1628]">
                      Ethical Business Presence
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Businesses featured on the platform should operate lawfully,
                    ethically, and in a way that reflects well on the wider
                    Pacific business community.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">
                Business Profile Guidelines
              </h2>

              <h3 className="text-lg font-semibold text-[#0a1628] mb-4">
                Who Can Join
              </h3>
              <p className="text-gray-600 mb-4">
                Pacific Discovery Network welcomes businesses of many sizes and
                stages, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>Market stallholders</li>
                <li>Home-based businesses</li>
                <li>Sole traders</li>
                <li>Early-stage ventures</li>
                <li>Established companies</li>
              </ul>
              <p className="text-gray-600 mb-6 font-medium">
                If you offer goods or services and have meaningful Pacific
                ownership, leadership, heritage, or cultural connection, you may
                be eligible to join.
              </p>
              <p className="text-gray-600 mb-6">
                We intentionally make space for businesses that may still be
                growing their online presence. Visibility should not be reserved
                only for businesses that already have polished digital reach.
              </p>

              <h3 className="text-lg font-semibold text-[#0a1628] mb-4">
                Eligibility Requirements
              </h3>
              <p className="text-gray-600 mb-4">
                To be included on the platform, businesses must:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>
                  Be Pacific-owned or have a significant Pacific cultural
                  connection
                </li>
                <li>Operate lawfully within their local context</li>
                <li>Provide accurate business and contact information</li>
                <li>Represent their identity honestly</li>
                <li>Respect platform, community, and cultural standards</li>
              </ul>

              <h3 className="text-lg font-semibold text-[#0a1628] mb-4">
                Content Standards
              </h3>
              <p className="text-gray-600 mb-6">
                Business profiles should:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>Clearly describe products or services</li>
                <li>Use appropriate, professional, or brand-aligned images</li>
                <li>Represent Pacific identity respectfully and truthfully</li>
                <li>
                  Avoid misleading claims about qualifications, awards, or
                  affiliations
                </li>
                <li>
                  Avoid offensive, discriminatory, or inappropriate material
                </li>
              </ul>

              <h3 className="text-lg font-semibold text-[#0a1628] mb-4">
                Prohibited Content
              </h3>
              <p className="text-gray-600 mb-6">
                Pacific Discovery Network does not allow profiles or content
                involving:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>Illegal activities or unlawful services</li>
                <li>Hate speech, harassment, or discrimination</li>
                <li>Fraudulent or deceptive business practices</li>
                <li>Misrepresentation of cultural identity or heritage</li>
                <li>Content that infringes intellectual property rights</li>
                <li>Adult or otherwise inappropriate material</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">
                Behaviour Across the Platform
              </h2>
              <p className="text-gray-600 mb-6">
                Pacific Discovery Network is designed to encourage connection,
                trust, and mutual respect.
              </p>

              <h3 className="text-lg font-semibold text-[#0a1628] mb-4">
                When Reaching Out to Businesses
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>Communicate professionally and respectfully</li>
                <li>Be clear about your purpose or enquiry</li>
                <li>Respect preferred contact methods and business hours</li>
                <li>Do not send spam or repeated unsolicited marketing</li>
                <li>Be mindful of cultural etiquette and context</li>
              </ul>

              <h3 className="text-lg font-semibold text-[#0a1628] mb-4">
                Community Interaction
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>Offer constructive and respectful feedback</li>
                <li>Celebrate and share positive business experiences</li>
                <li>Support and uplift Pacific entrepreneurs</li>
                <li>Report inappropriate behaviour when needed</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">
                Profile Review and Verification
              </h2>
              <p className="text-gray-600 mb-6">
                Business profiles may be reviewed before or after they are made
                visible on the platform.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>
                  <strong>Active Profile:</strong> Approved and visible on the
                  platform
                </li>
                <li>
                  <strong>Verified Profile:</strong> Additional checks completed
                  to strengthen confidence and trust
                </li>
              </ul>
              <p className="text-gray-600 mb-6">
                Verification supports stronger trust, but it does not mean legal,
                financial, or government endorsement.
              </p>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">
                Enforcement and Action
              </h2>

              <h3 className="text-lg font-semibold text-[#0a1628] mb-4">
                Review Process
              </h3>
              <p className="text-gray-600 mb-6">
                Reported concerns are reviewed as fairly as possible, with
                cultural context and platform integrity taken into account.
              </p>

              <h3 className="text-lg font-semibold text-[#0a1628] mb-4">
                Possible Actions
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>Warning and request for correction</li>
                <li>Temporary restriction or suspension</li>
                <li>Removal of profile or content</li>
                <li>Escalation where required by law</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">
                Reporting Concerns
              </h2>
              <p className="text-gray-600 mb-6">
                We rely on community accountability to help maintain trust across
                the platform. You may report:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>Inaccurate business information</li>
                <li>Fraudulent or misleading activity</li>
                <li>Cultural misrepresentation</li>
                <li>Harassment or inappropriate behaviour</li>
              </ul>
              <p className="text-gray-600 mb-6">
                Reports can be submitted via the reporting tools on a business
                profile or by contacting our team directly. Where possible,
                include:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>A clear description of the issue</li>
                <li>Screenshots or supporting evidence</li>
                <li>Your relationship to the situation, where relevant</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">
                Cultural Considerations
              </h2>
              <p className="text-gray-600 mb-6">
                Pacific cultures are diverse, living, and regionally distinct. We
                encourage:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>Respect for regional differences and identities</li>
                <li>Careful use of cultural symbols, language, and imagery</li>
                <li>Seeking guidance when unsure about representation</li>
                <li>Celebrating diversity across Pacific communities</li>
              </ul>
              <p className="text-gray-600 mb-6">
                Cultural identity is not decorative. It is meaningful, and it
                should be represented with care.
              </p>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">
                Updates to These Guidelines
              </h2>
              <p className="text-gray-600 mb-6">
                These guidelines may evolve as Pacific Discovery Network grows.
                Significant updates will be reflected here and, where relevant,
                shared with registered users.
              </p>
              <p className="text-gray-600 mb-6">
                As the platform grows, our standards will continue to develop to
                support stronger visibility, trust, and community care.
              </p>

              <h2 className="text-2xl font-bold text-[#0a1628] mb-6">
                Questions About the Guidelines?
              </h2>
              <p className="text-gray-600 mb-6">
                If you need clarification on eligibility, verification, or
                content standards, please
                <a href="/Contact" className="text-[#0d4f4f] hover:underline">
                  {" "}
                  contact our community team
                </a>.
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