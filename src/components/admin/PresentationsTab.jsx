"use client";

import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";
import { investorOverviewDeck } from "@/lib/presentations/investorOverviewDeck";
import { internalFounderAlignmentDeck } from "@/lib/presentations/decks/internal-founder-alignment";
import { subscriberGrowthPlanDeck } from "@/lib/presentations/decks/subscriber-growth-plan";
import { studentOutreachPlaybookDeck } from "@/lib/presentations/decks/student-outreach-playbook";
import { studentOutreachOperationsDeck } from "@/lib/presentations/decks/student-outreach-operations";

export default function PresentationsTab() {
  const router = useRouter();

  const presentations = [
    {
      id: "investor-overview",
      title: "Investor Overview",
      description: "Complete investor presentation for Pacific Discovery Network",
      audience: "Investors",
      status: "live",
      lastUpdated: "March 2026",
      slideCount: investorOverviewDeck.slides.length,
      deck: investorOverviewDeck,
    },
    {
      id: "internal-founder-alignment",
      title: "Internal Founder Alignment",
      description:
        "Internal strategy deck for founder and co-founder alignment on mission, vision, and execution priorities",
      audience: "Internal",
      status: "live",
      lastUpdated: "March 2026",
      slideCount: internalFounderAlignmentDeck.slides.length,
      deck: internalFounderAlignmentDeck,
    },
    {
      id: "subscriber-growth-plan",
      title: "1,000 Subscriber Growth Plan",
      description:
        "Internal execution deck for reaching 1,000 paying subscribers with validated acquisition channels",
      audience: "Internal",
      status: "live",
      lastUpdated: "March 2026",
      slideCount: subscriberGrowthPlanDeck.slides.length,
      deck: subscriberGrowthPlanDeck,
    },
    {
      id: "student-outreach-playbook",
      title: "Student Outreach Playbook",
      description:
        "Internal training deck for student-supported business discovery and outreach operations",
      audience: "Internal",
      status: "live",
      lastUpdated: "March 2026",
      slideCount: studentOutreachPlaybookDeck.slides.length,
      deck: studentOutreachPlaybookDeck,
    },
    {
      id: "student-outreach-operations",
      title: "Student Outreach & Listing Operations",
      description:
        "Internal operations deck for business discovery, admin listings, and claim workflows",
      audience: "Internal",
      status: "live",
      lastUpdated: "March 2026",
      slideCount: studentOutreachOperationsDeck.slides.length,
      deck: studentOutreachOperationsDeck,
    },
  ];

  const handleViewPresentation = (deck) => {
    router.push(`/AdminDashboard/presentations?deck=${deck.id}`);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Presentation
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Description
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Audience
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Slides
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Updated
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {presentations.map((presentation) => (
            <tr key={presentation.id} className="hover:bg-gray-50">
              <td className="px-4 py-4">
                <div className="font-medium text-[#0a1628]">
                  {presentation.title}
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="max-w-md truncate text-sm text-gray-600">
                  {presentation.description}
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="text-sm text-gray-600">
                  {presentation.audience}
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="text-sm text-gray-600">
                  {presentation.slideCount}
                </div>
              </td>
              <td className="px-4 py-4">
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                  {presentation.status}
                </span>
              </td>
              <td className="px-4 py-4">
                <div className="text-sm text-gray-600">
                  {presentation.lastUpdated}
                </div>
              </td>
              <td className="px-4 py-4 text-right">
                <button
                  onClick={() => handleViewPresentation(presentation)}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <Eye className="h-3.5 w-3.5" />
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
