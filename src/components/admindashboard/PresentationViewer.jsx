"use client";

import { useEffect, useState } from "react";
import { investorOverviewDeck } from "@/lib/presentations/investorOverviewDeck";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize2,
  Minimize2,
  ArrowLeft,
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function PresentationViewer({
  deck = investorOverviewDeck,
  onBack,
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const slides = deck.slides;

  const nextSlide = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") nextSlide();
      if (event.key === "ArrowLeft") prevSlide();
      if (event.key === "Escape" && document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [slides.length]);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error("Fullscreen toggle failed:", error);
    }
  };

  const exportToPDF = async () => {
    setIsExporting(true);

    try {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }
      await new Promise((resolve) => setTimeout(resolve, 150));

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      for (let i = 0; i < slides.length; i++) {
        const slideElement = document.getElementById(`slide-${i}`);
        if (!slideElement) continue;

        const originalDisplay = slideElement.style.display;
        slideElement.style.display = "block";

        const canvas = await html2canvas(slideElement, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
        });

        slideElement.style.display = originalDisplay;

        const imgData = canvas.toDataURL("image/png");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = (pdfHeight - imgHeight * ratio) / 2;

        if (i > 0) {
          pdf.addPage();
        }

        pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      }

      pdf.save("pacific-discovery-network-investor-overview.pdf");
    } catch (error) {
      console.error("Error exporting PDF:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const renderSlide = (slide, index) => {
    const slideId = `slide-${index}`;
    const isVisible = index === currentSlide || isExporting;

    switch (slide.type) {
      case "cover":
        return (
          <div
            id={slideId}
            className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-950 via-slate-900 to-blue-700 p-12 text-center text-white ${
              isVisible ? "block" : "hidden"
            }`}
          >
            <div className="mx-auto max-w-4xl">
              <h1 className="mb-4 text-5xl font-bold">{slide.title}</h1>
              <h2 className="mb-4 text-2xl text-blue-100">{slide.subtitle}</h2>
              {slide.tagline && <p className="mb-8 text-xl text-blue-200">{slide.tagline}</p>}

              {slide.statusBadge && (
                <div className="mb-8 inline-block rounded-full bg-emerald-500 px-4 py-2 text-white">
                  {slide.statusBadge}
                </div>
              )}

              <div className="text-lg text-blue-100">
                {slide.contact && <p>{slide.contact}</p>}
                {slide.footer && <p className="mt-4 text-sm">{slide.footer}</p>}
              </div>
            </div>
          </div>
        );

      case "stats":
        return (
          <div
            id={slideId}
            className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-950 via-slate-900 to-blue-700 p-12 text-center text-white ${
              isVisible ? "block" : "hidden"
            }`}
          >
            <div className="mx-auto max-w-6xl">
              {slide.eyebrow && <p className="mb-2 font-semibold text-blue-300">{slide.eyebrow}</p>}
              <h2 className="mb-4 text-4xl font-bold">{slide.title}</h2>
              {slide.subtitle && <p className="mb-12 text-xl text-blue-100">{slide.subtitle}</p>}

              {slide.stats && (
                <div className="mb-8 grid grid-cols-3 gap-8">
                  {slide.stats.map((stat, idx) => (
                    <div key={idx} className="rounded-lg bg-white/10 p-6 backdrop-blur-sm text-center">
                      <div className="mb-2 text-5xl font-bold text-blue-300">{stat.value}</div>
                      <div className="text-blue-200">{stat.label}</div>
                    </div>
                  ))}
                </div>
              )}

              {slide.bullets && (
                <ul className="mb-8 space-y-3 text-lg">
                  {slide.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="mr-3 text-blue-300">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}

              {slide.closingLine && (
                <p className="mt-8 rounded-lg bg-white/10 p-4 text-center text-xl font-medium text-blue-100 backdrop-blur-sm">
                  {slide.closingLine}
                </p>
              )}
            </div>
          </div>
        );

      case "bullets":
        return (
          <div
            id={slideId}
            className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-950 via-slate-900 to-blue-700 p-12 text-center text-white ${
              isVisible ? "block" : "hidden"
            }`}
          >
            <div className="mx-auto max-w-6xl">
              {slide.eyebrow && <p className="mb-2 font-semibold text-blue-300">{slide.eyebrow}</p>}
              <h2 className="mb-4 text-4xl font-bold">{slide.title}</h2>

              {slide.subtitle && <p className="mb-12 text-xl text-blue-100">{slide.subtitle}</p>}

              {slide.sections ? (
                <div className="mb-8 grid grid-cols-3 gap-8">
                  {slide.sections.map((section, idx) => (
                    <div key={idx} className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
                      <h3 className="mb-4 text-xl font-semibold text-blue-300">{section.title}</h3>
                      <ul className="space-y-2">
                        {section.items.map((item, itemIdx) => (
                          <li key={itemIdx} className="flex items-start text-sm">
                            <span className="mr-2 text-blue-300">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="mb-8 space-y-4 text-lg">
                  {slide.bullets?.map((bullet, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="mr-3 text-xl text-blue-300">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}

              {slide.techStack && (
                <div className="mt-8 rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                  <p className="font-mono text-sm text-blue-200">{slide.techStack}</p>
                </div>
              )}

              {slide.closingLine && (
                <p className="mt-8 rounded-lg bg-white/10 p-4 text-center text-xl font-medium text-blue-100 backdrop-blur-sm">
                  {slide.closingLine}
                </p>
              )}
            </div>
          </div>
        );

      case "three-column":
        return (
          <div
            id={slideId}
            className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-950 via-slate-900 to-blue-700 p-12 text-center text-white ${
              isVisible ? "block" : "hidden"
            }`}
          >
            <div className="mx-auto max-w-6xl">
              {slide.eyebrow && <p className="mb-2 font-semibold text-blue-300">{slide.eyebrow}</p>}
              <h2 className="mb-4 text-4xl font-bold">{slide.title}</h2>
              {slide.subtitle && <p className="mb-12 text-xl text-blue-100">{slide.subtitle}</p>}

              <div className="mb-8 grid grid-cols-3 gap-8">
                {slide.columns.map((column, idx) => (
                  <div key={idx} className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
                    <h3 className="mb-4 text-xl font-semibold text-blue-300">{column.title}</h3>
                    <ul className="space-y-2">
                      {column.items.map((item, itemIdx) => (
                        <li key={itemIdx} className="flex items-start text-sm">
                          <span className="mr-2 text-blue-300">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {slide.closingLine && (
                <p className="mt-8 rounded-lg bg-white/10 p-4 text-center text-xl font-medium text-blue-100 backdrop-blur-sm">
                  {slide.closingLine}
                </p>
              )}
            </div>
          </div>
        );

      case "table":
        return (
          <div
            id={slideId}
            className={`absolute inset-0 flex flex-col items-center ${slide.id === 'tracker-columns' ? 'justify-start' : 'justify-center'} bg-gradient-to-br from-blue-950 via-slate-900 to-blue-700 p-12 ${slide.id === 'tracker-columns' ? 'pt-96' : 'pt-64'} text-center text-white overflow-y-auto ${
              isVisible ? "block" : "hidden"
            }`}
            style={slide.id === 'tracker-columns' ? { paddingTop: '4rem' } : {}}
          >
            <div className="mx-auto max-w-6xl">
              {slide.eyebrow && <p className="mb-2 font-semibold text-blue-300">{slide.eyebrow}</p>}
              <h2 className="mb-4 text-4xl font-bold">{slide.title}</h2>
              {slide.subtitle && <p className="mb-12 text-xl text-blue-100">{slide.subtitle}</p>}

              <div className="mb-8">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-blue-600 text-white">
                      {slide.table.headers.map((header, idx) => (
                        <th key={idx} className="p-4 text-center font-semibold">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {slide.table.rows.map((row, rowIdx) => (
                      <tr key={rowIdx} className={rowIdx % 2 === 0 ? "bg-white/10" : "bg-white/5"}>
                        {row.map((cell, cellIdx) => (
                          <td key={cellIdx} className="border-t border-white/20 p-4 text-center">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {slide.bullets && (
                <ul className="mb-8 space-y-3 text-lg">
                  {slide.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="mr-3 text-blue-300">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}

              {slide.closingLine && (
                <p className="mt-8 rounded-lg bg-white/10 p-4 text-center text-xl font-medium text-blue-100 backdrop-blur-sm">
                  {slide.closingLine}
                </p>
              )}
            </div>
          </div>
        );

      case "tiers":
        return (
          <div
            id={slideId}
            className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-950 via-slate-900 to-blue-700 p-12 text-center text-white ${
              isVisible ? "block" : "hidden"
            }`}
          >
            <div className="mx-auto max-w-6xl">
              {slide.eyebrow && <p className="mb-2 font-semibold text-blue-300">{slide.eyebrow}</p>}
              <h2 className="mb-4 text-4xl font-bold">{slide.title}</h2>
              {slide.subtitle && <p className="mb-12 text-xl text-blue-100">{slide.subtitle}</p>}

              <div className="mb-8 grid grid-cols-3 gap-8">
                {slide.tiers.map((tier, idx) => (
                  <div
                    key={idx}
                    className={`rounded-lg border-2 p-6 backdrop-blur-sm ${
                      idx === 1 ? "border-blue-400 bg-blue-600/20" : "border-white/20 bg-white/10"
                    }`}
                  >
                    <h3 className="mb-2 text-2xl font-bold">{tier.name}</h3>
                    <div className="mb-4 text-3xl font-bold text-blue-300">{tier.price}</div>
                    <ul className="space-y-2">
                      {tier.features.map((feature, featureIdx) => (
                        <li key={featureIdx} className="flex items-start text-sm">
                          <span className="mr-2 text-blue-300">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {slide.futureRevenue && (
                <div className="mb-8">
                  <h4 className="mb-3 text-lg font-semibold text-blue-300">Future Revenue Layers</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {slide.futureRevenue.map((item, idx) => (
                      <div key={idx} className="flex items-center text-sm">
                        <span className="mr-2 text-blue-300">•</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {slide.closingLine && (
                <p className="mt-8 rounded-lg bg-white/10 p-4 text-center text-xl font-medium text-blue-100 backdrop-blur-sm">
                  {slide.closingLine}
                </p>
              )}
            </div>
          </div>
        );

      case "financial-table":
        return (
          <div
            id={slideId}
            className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-950 via-slate-900 to-blue-700 p-12 text-center text-white overflow-y-auto ${
              isVisible ? "block" : "hidden"
            }`}
          >
            <div className="mx-auto max-w-6xl">
              {slide.eyebrow && <p className="mb-2 font-semibold text-blue-300">{slide.eyebrow}</p>}
              <h2 className="mb-4 text-4xl font-bold">{slide.title}</h2>
              {slide.subtitle && <p className="mb-12 text-xl text-blue-100">{slide.subtitle}</p>}

              <div className="mb-8 grid grid-cols-3 gap-8">
                <div className="col-span-2">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-blue-600 text-white">
                        {slide.table.headers.map((header, idx) => (
                          <th key={idx} className="p-4 text-left font-semibold">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {slide.table.rows.map((row, rowIdx) => (
                        <tr key={rowIdx} className={rowIdx % 2 === 0 ? "bg-white/10" : "bg-white/5"}>
                          {row.map((cell, cellIdx) => (
                            <td key={cellIdx} className="border-t border-white/20 p-4 font-semibold text-left">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="space-y-4">
                  {slide.sideStats.map((stat, idx) => (
                    <div key={idx} className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                      <div className="text-sm text-blue-200">{stat.label}</div>
                      <div className="text-xl font-bold text-blue-300">{stat.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {slide.closingLine && (
                <p className="mt-8 rounded-lg bg-white/10 p-4 text-center text-xl font-medium text-blue-100 backdrop-blur-sm">
                  {slide.closingLine}
                </p>
              )}
            </div>
          </div>
        );

      case "allocation":
        return (
          <div
            id={slideId}
            className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-950 via-slate-900 to-blue-700 p-12 pt-64 text-center text-white overflow-y-auto ${
              isVisible ? "block" : "hidden"
            }`}
          >
            <div className="mx-auto max-w-6xl">
              {slide.eyebrow && <p className="mb-2 font-semibold text-blue-300">{slide.eyebrow}</p>}
              <h2 className="mb-4 text-4xl font-bold">{slide.title}</h2>
              <div className="mb-12 text-3xl font-bold text-blue-300">{slide.ask}</div>

              <div className="mb-8 grid grid-cols-2 gap-8">
                <div className="space-y-6">
                  {slide.allocations.map((allocation, idx) => (
                    <div key={idx} className="border-l-4 border-blue-400 pl-4">
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="text-lg font-semibold">{allocation.category}</h4>
                        <div className="text-right">
                          <div className="text-xl font-bold text-blue-300">{allocation.percentage}%</div>
                          <div className="text-sm text-blue-200">{allocation.amount}</div>
                        </div>
                      </div>

                      <div className="mb-3 h-3 w-full rounded-full bg-white/20">
                        <div
                          className="h-3 rounded-full bg-blue-400"
                          style={{ width: `${allocation.percentage}%` }}
                        />
                      </div>

                      <ul className="space-y-1 text-sm text-blue-200">
                        {allocation.items.map((item, itemIdx) => (
                          <li key={itemIdx} className="flex items-start">
                            <span className="mr-2 text-blue-300">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
                  <h4 className="mb-4 text-lg font-semibold text-blue-300">Investment Summary</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Total Raise:</span>
                      <span className="font-bold">$250,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pre-money Valuation:</span>
                      <span className="font-bold">$2.0M</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Post-money Valuation:</span>
                      <span className="font-bold">$2.25M</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Equity Offered:</span>
                      <span className="font-bold">11.1%</span>
                    </div>
                  </div>
                </div>
              </div>

              {slide.closingLine && (
                <p className="mt-8 rounded-lg bg-white/10 p-4 text-center text-xl font-medium text-blue-100 backdrop-blur-sm">
                  {slide.closingLine}
                </p>
              )}
            </div>
          </div>
        );

      case "ask":
        return (
          <div
            id={slideId}
            className={`absolute inset-0 flex flex-col justify-center bg-gradient-to-br from-blue-950 via-slate-900 to-blue-700 p-12 text-white ${
              isVisible ? "block" : "hidden"
            }`}
          >
            <div className="mx-auto max-w-6xl">
              {slide.eyebrow && <p className="mb-2 font-semibold text-blue-200">{slide.eyebrow}</p>}
              <h2 className="mb-8 text-4xl font-bold">{slide.title}</h2>

              <div className="grid grid-cols-2 gap-12">
                <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
                  <h4 className="mb-4 text-xl font-semibold">Investment Terms</h4>
                  <ul className="space-y-3 text-lg">
                    {slide.mainPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="mr-3 text-blue-300">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
                  <h4 className="mb-4 text-xl font-semibold">Why Invest</h4>
                  <ul className="space-y-3 text-lg">
                    {slide.investorRationale.map((reason, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="mr-3 text-blue-300">•</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {slide.closingLine && (
                <p className="mt-8 rounded-lg bg-white/10 p-4 text-center text-xl font-medium text-blue-100 backdrop-blur-sm">
                  {slide.closingLine}
                </p>
              )}
            </div>
          </div>
        );

      case "closing":
        return (
          <div
            id={slideId}
            className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-950 via-slate-900 to-blue-700 p-12 text-center text-white ${
              isVisible ? "block" : "hidden"
            }`}
          >
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-4 text-4xl font-bold">{slide.title}</h2>
              {slide.subtitle && <p className="mb-12 text-xl text-blue-100">{slide.subtitle}</p>}

              {slide.cta && <div className="mb-12 text-6xl font-bold text-blue-200">{slide.cta}</div>}

              <div className="rounded-lg bg-white/10 p-8 backdrop-blur-sm">
                <div className="mb-2 text-2xl font-semibold">{slide.contact.name}</div>
                <div className="mb-4 text-lg text-blue-200">{slide.contact.title}</div>
                <div className="space-y-2">
                  <p>
                    <a href={`mailto:${slide.contact.email}`} className="text-blue-300 hover:text-white">
                      {slide.contact.email}
                    </a>
                  </p>
                  <p>
                    <a
                      href={slide.contact.website}
                      className="text-blue-300 hover:text-white"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {slide.contact.website}
                    </a>
                  </p>
                </div>
              </div>

              {slide.finalLine && <div className="mt-12 text-2xl font-bold text-blue-200">{slide.finalLine}</div>}
            </div>
          </div>
        );
    }
  }

  return (
    <div className="flex h-screen flex-col bg-gray-100">
      <div className="flex items-center justify-between border-b border-gray-200 bg-white p-4">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="secondary" onClick={onBack}>
              ← Back
            </Button>
          )}
          <div>
            <h1 className="text-xl font-bold text-gray-900">{deck.title}</h1>
            <span className="text-sm text-gray-500">{deck.description}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={exportToPDF}
            disabled={isExporting}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            <span>{isExporting ? "Exporting..." : "Export PDF"}</span>
          </Button>

          <Button variant="outline" size="sm" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <div className="absolute inset-x-0 top-0 bottom-0 bg-black">{slides.map((slide, index) => (
          <div key={index}>
            {renderSlide(slide, index)}
          </div>
        ))}</div>

        <div className="pointer-events-none absolute inset-0">
          <div className="pointer-events-auto absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-6">
            <div className="mx-auto flex max-w-6xl items-center justify-between">
              <Button
                variant="secondary"
                size="sm"
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className="border-white/30 bg-white/20 text-white hover:bg-white/30"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex items-center space-x-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-2 w-2 rounded-full transition-colors ${
                      index === currentSlide ? "bg-white" : "bg-white/50"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={nextSlide}
                disabled={currentSlide === slides.length - 1}
                className="border-white/30 bg-white/20 text-white hover:bg-white/30"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="absolute right-4 top-4 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
            {currentSlide + 1} / {slides.length}
          </div>
        </div>
      </div>
    </div>
  );
}