"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, Play } from "lucide-react";
import PresentationViewer from "@/components/admin/PresentationViewer";
import { investorOverviewDeck } from "@/lib/presentations/investorOverviewDeck";
import { internalFounderAlignmentDeck } from "@/lib/presentations/decks/internal-founder-alignment";
import { subscriberGrowthPlanDeck } from "@/lib/presentations/decks/subscriber-growth-plan";
import { studentOutreachPlaybookDeck } from "@/lib/presentations/decks/student-outreach-playbook";
import { studentOutreachOperationsDeck } from "@/lib/presentations/decks/student-outreach-operations";

export default function PresentationsPage() {
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [isViewing, setIsViewing] = useState(false);

  const presentations = [
    {
      id: "investor-overview",
      title: "Investor Overview",
      description: "Complete investor presentation for Pacific Discovery Network",
      audience: "Investors",
      status: "live",
      slug: "investor-overview",
      lastUpdated: "March 2026",
      slideCount: investorOverviewDeck.slides.length,
      deck: investorOverviewDeck,
    },
    {
      id: "internal-founder-alignment",
      title: "Internal Founder Alignment",
      description: "Internal strategy deck for founder and co-founder alignment on mission, vision, and execution priorities",
      audience: "Internal",
      status: "live",
      slug: "internal-founder-alignment",
      lastUpdated: "March 2026",
      slideCount: internalFounderAlignmentDeck.slides.length,
      deck: internalFounderAlignmentDeck,
    },
    {
      id: "subscriber-growth-plan",
      title: "1,000 Subscriber Growth Plan",
      description: "Internal execution deck for reaching 1,000 paying subscribers with validated acquisition channels",
      audience: "Internal",
      status: "live",
      slug: "subscriber-growth-plan",
      lastUpdated: "March 2026",
      slideCount: subscriberGrowthPlanDeck.slides.length,
      deck: subscriberGrowthPlanDeck,
    },
    {
      id: "student-outreach-playbook",
      title: "Student Outreach Playbook",
      description: "Internal training deck for student-supported business discovery and outreach operations",
      audience: "Internal",
      status: "live",
      slug: "student-outreach-playbook",
      lastUpdated: "March 2026",
      slideCount: studentOutreachPlaybookDeck.slides.length,
      deck: studentOutreachPlaybookDeck,
    },
    {
      id: "student-outreach-operations",
      title: "Student Outreach & Listing Operations",
      description: "Internal operations deck for business discovery, admin listings, and claim workflows",
      audience: "Internal",
      status: "live",
      slug: "student-outreach-operations",
      lastUpdated: "March 2026",
      slideCount: studentOutreachOperationsDeck.slides.length,
      deck: studentOutreachOperationsDeck,
    },
  ];

  const handleViewDeck = (deck) => {
    setSelectedDeck(deck);
    setIsViewing(true);
  };

  const handleBackToList = () => {
    setIsViewing(false);
    setSelectedDeck(null);
  };

  if (isViewing && selectedDeck) {
    return (
      <div className="h-screen">
        <PresentationViewer deck={selectedDeck} onBack={handleBackToList} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="mx-auto max-w-7xl p-6">
        {/* Premium Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4" />
              </svg>
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-white">Presentation Library</h1>
              <p className="text-blue-200 text-lg mt-1">Professional presentation decks for investors, internal strategy, and operations</p>
            </div>
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 mx-auto rounded-full"></div>
        </div>

      {/* Premium Cards Grid */}
        <div className="grid gap-8">
          {presentations.map((presentation) => (
            <div key={presentation.id} className="group">
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-1">{presentation.title}</h2>
                        <div className="flex items-center gap-3">
                          <Badge className="bg-emerald-500 text-white border-emerald-400 hover:bg-emerald-600">
                            {presentation.status}
                          </Badge>
                          <span className="text-blue-200 text-sm">Premium Deck</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-blue-100 text-lg mb-6 leading-relaxed">{presentation.description}</p>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="bg-white/5 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-blue-300">{presentation.slideCount}</div>
                        <div className="text-blue-200 text-sm">Slides</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-emerald-300">{presentation.audience}</div>
                        <div className="text-blue-200 text-sm">Audience</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-purple-300">{presentation.lastUpdated}</div>
                        <div className="text-blue-200 text-sm">Updated</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <Button 
                        onClick={() => handleViewDeck(presentation.deck)} 
                        className="bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white border-0 px-6 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                      >
                        <Play className="h-5 w-5" />
                        <span>View Presentation</span>
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => handleViewDeck(presentation.deck)}
                        className="border-white/30 bg-white/10 hover:bg-white/20 text-white px-6 py-3 text-lg font-semibold transition-all duration-300 flex items-center gap-2"
                      >
                        <Download className="h-5 w-5" />
                        <span>Export PDF</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Premium Footer */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-2xl p-8 border border-white/20">
            <div className="flex items-center justify-center gap-3 mb-4">
              <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h3 className="text-2xl font-bold text-white">Professional Grade Presentations</h3>
            </div>
            <p className="text-blue-200 text-lg max-w-2xl mx-auto">
              Crafted with precision for strategic investor communications and partnership opportunities
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
