"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import PresentationViewer from "@/components/admindashboard/PresentationViewer";
import { investorOverviewDeck } from "@/lib/presentations/investorOverviewDeck";
import { internalFounderAlignmentDeck } from "@/lib/presentations/decks/internal-founder-alignment";
import { subscriberGrowthPlanDeck } from "@/lib/presentations/decks/subscriber-growth-plan";
import { studentOutreachPlaybookDeck } from "@/lib/presentations/decks/student-outreach-playbook";
import { studentOutreachOperationsDeck } from "@/lib/presentations/decks/student-outreach-operations";

export default function PresentationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const deckId = searchParams.get("deck");

  // Map deck IDs to actual deck objects
  const deckMap = {
    "investor-overview": investorOverviewDeck,
    "internal-founder-alignment": internalFounderAlignmentDeck,
    "subscriber-growth-plan": subscriberGrowthPlanDeck,
    "student-outreach-playbook": studentOutreachPlaybookDeck,
    "student-outreach-operations": studentOutreachOperationsDeck,
  };

  const deck = deckMap[deckId];

  if (!deckId || !deck) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-bold text-white">Presentation Not Found</h2>
          <p className="text-sm text-gray-400">Please select a valid presentation from the admin dashboard.</p>
          <button
            onClick={() => router.push("/AdminDashboard?tab=presentations")}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <PresentationViewer deck={deck} onBack={() => router.push("/AdminDashboard?tab=presentations")} />
    </div>
  );
}
