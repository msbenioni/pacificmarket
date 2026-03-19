"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, Play } from "lucide-react";
import PresentationViewer from "@/components/admin/PresentationViewer";
import { investorOverviewDeck } from "@/lib/presentations/investorOverviewDeck";

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
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Presentations</h1>
          <p className="mt-2 text-gray-600">Admin-only presentation decks for investor and partner conversations.</p>
        </div>
      </div>

      <div className="grid gap-6">
        {presentations.map((presentation) => (
          <Card key={presentation.id} className="transition-shadow hover:shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="mb-2 flex items-center space-x-3">
                    <CardTitle className="text-xl">{presentation.title}</CardTitle>
                    <Badge
                      variant={presentation.status === "live" ? "default" : "secondary"}
                      className="capitalize"
                    >
                      {presentation.status}
                    </Badge>
                  </div>

                  <p className="mb-4 text-gray-600">{presentation.description}</p>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                    <span>Audience: {presentation.audience}</span>
                    <span>•</span>
                    <span>{presentation.slideCount} slides</span>
                    <span>•</span>
                    <span>Updated: {presentation.lastUpdated}</span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="flex flex-wrap items-center gap-3">
                <Button onClick={() => handleViewDeck(presentation.deck)} className="flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  <span>View Presentation</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handleViewDeck(presentation.deck)}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Open & Export</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {presentations.length === 0 && (
        <div className="py-12 text-center">
          <div className="mb-4 text-gray-400">
            <Eye className="mx-auto h-12 w-12" />
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">No presentations yet</h3>
          <p className="mb-6 text-gray-600">Your investor and partner decks will appear here.</p>
        </div>
      )}
    </div>
  );
}
