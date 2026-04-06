"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useSessionState } from "@/hooks/useSessionState";
import { useAuth } from "@/lib/AuthContext";
import { exportToPng } from "@/lib/social-generator/exportSpotlight";
import { ArrowLeft, ArrowRight, Download, RefreshCw, RotateCcw, Sparkles } from 'lucide-react';
import React, { useCallback, useRef, useState } from "react";
import { WELCOME_THEMES } from "./config/branding";
import { businessToWelcomeStoryData } from "./utils/businessToWelcomeStoryData";

// Import slide & preview components
import ImageUpload from "./components/ImageUpload";
import PreviewViewport from "./components/PreviewViewport";
import BusinessCtaSlide from "./slides/BusinessCtaSlide";
import BusinessOverviewSlide from "./slides/BusinessOverviewSlide";
import BusinessStorySlide from "./slides/BusinessStorySlide";
import WelcomeCoverSlide from "./slides/WelcomeCoverSlide";

// Default empty story data shape
const EMPTY_STORY = businessToWelcomeStoryData(null);

// Slide definitions
const SLIDE_COMPONENTS = [
  { id: 'cover', name: 'Welcome Cover', component: WelcomeCoverSlide },
  { id: 'overview', name: 'Business Overview', component: BusinessOverviewSlide },
  { id: 'story', name: 'Business Story', component: BusinessStorySlide },
  { id: 'cta', name: 'Call to Action', component: BusinessCtaSlide }
];

/**
 * PDN Welcome Story Generator
 * Creates 4-slide welcome stories for newly listed businesses.
 * All UI state is persisted via useSessionState so switching tabs or
 * navigating away and returning restores the exact working context.
 */
export default function WelcomeStoryGenerator({ businesses = [] }) {
  const { toast } = useToast();
  const { user } = useAuth();
  const previewRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // ─── Persisted session state ───────────────────────────────────────
  const [session, setSession, clearSession] = useSessionState(
    'welcome-story-generator',
    {
      selectedBusinessId: '',
      format: 'square',
      theme: 'clean',
      currentSlide: 0,
      storyData: EMPTY_STORY,
      // Note: uploaded images store metadata only (url, name, etc.).
      // Blob URLs are transient and won't survive page reloads, but
      // the slot structure and any remote URLs will be preserved.
      uploadedImages: [],
    },
    user?.id,
    { exclude: [] }
  );

  // Destructure for convenience
  const {
    selectedBusinessId,
    format,
    theme,
    currentSlide,
    storyData,
    uploadedImages,
  } = session;

  // ─── Transient state (not persisted) ───────────────────────────────
  const [isExporting, setIsExporting] = useState(false);
  const [exportingSlide, setExportingSlide] = useState(null);

  // ─── Derived values ────────────────────────────────────────────────
  const slideWidth = 1080;
  const slideHeight = format === 'portrait' ? 1350 : 1080;

  const availableBusinesses = businesses
    .filter((b) => b.business_name)
    .sort((a, b) => (a.business_name || '').localeCompare(b.business_name || ''));

  // ─── Actions ───────────────────────────────────────────────────────
  const selectBusiness = useCallback((businessId) => {
    setSession((prev) => {
      if (!businessId) return { ...prev, selectedBusinessId: '' };
      const biz = businesses.find((b) => b.id === businessId);
      if (!biz) return { ...prev, selectedBusinessId: businessId };
      const newStoryData = businessToWelcomeStoryData(biz);
      return {
        ...prev,
        selectedBusinessId: businessId,
        currentSlide: 0,
        storyData: {
          ...prev.storyData,
          ...newStoryData,
          selectedImages: prev.uploadedImages.slice(0, 4),
        },
      };
    });
  }, [businesses, setSession]);

  const updateStoryData = useCallback((field, value) => {
    setSession((prev) => ({
      ...prev,
      storyData: { ...prev.storyData, [field]: value },
    }));
  }, [setSession]);

  const setFormat = useCallback((f) => setSession({ format: f }), [setSession]);
  const setTheme = useCallback((t) => setSession({ theme: t }), [setSession]);

  const handleImagesChange = useCallback((images) => {
    setSession((prev) => ({
      ...prev,
      uploadedImages: images,
      storyData: { ...prev.storyData, selectedImages: images.slice(0, 4) },
    }));
  }, [setSession]);

  const goToSlide = useCallback((index) => {
    if (index >= 0 && index < SLIDE_COMPONENTS.length) {
      setSession({ currentSlide: index });
    }
  }, [setSession]);

  const nextSlide = useCallback(() => goToSlide(currentSlide + 1), [currentSlide, goToSlide]);
  const prevSlide = useCallback(() => goToSlide(currentSlide - 1), [currentSlide, goToSlide]);

  // ─── Export ────────────────────────────────────────────────────────
  const exportSlide = useCallback(async (slideIndex) => {
    const slideRef = previewRefs[slideIndex].current;
    if (!slideRef) {
      toast({ title: "Export Error", description: "Slide preview not available", variant: "destructive" });
      return;
    }
    try {
      setIsExporting(true);
      setExportingSlide(slideIndex);
      const filename = `${storyData.businessName || 'business'}-${SLIDE_COMPONENTS[slideIndex].id}`;
      await exportToPng(slideRef, filename);
      toast({ title: "Export Successful", description: `${SLIDE_COMPONENTS[slideIndex].name} exported` });
    } catch (error) {
      console.error('Export error:', error);
      toast({ title: "Export Failed", description: "Failed to export slide.", variant: "destructive" });
    } finally {
      setIsExporting(false);
      setExportingSlide(null);
    }
  }, [storyData, toast]);

  const exportAllSlides = useCallback(async () => {
    try {
      setIsExporting(true);
      for (let i = 0; i < SLIDE_COMPONENTS.length; i++) {
        setExportingSlide(i);
        const slideRef = previewRefs[i].current;
        if (!slideRef) continue;
        const filename = `${storyData.businessName || 'business'}-${SLIDE_COMPONENTS[i].id}`;
        await exportToPng(slideRef, filename);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      toast({ title: "Export Complete", description: `All ${SLIDE_COMPONENTS.length} slides exported` });
    } catch (error) {
      console.error('Export error:', error);
      toast({ title: "Export Failed", description: "Failed to export some slides.", variant: "destructive" });
    } finally {
      setIsExporting(false);
      setExportingSlide(null);
    }
  }, [storyData, toast]);

  // ─── Render ────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">PDN Welcome Story Generator</h1>
            <p className="text-muted-foreground">Create 4-slide welcome stories for newly listed businesses</p>
          </div>
        </div>
        {storyData.businessName && (
          <Button variant="ghost" size="sm" onClick={clearSession} title="Reset all fields">
            <RotateCcw className="h-4 w-4 mr-1" /> Reset
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Panel */}
        <div className="space-y-4">
          {/* Business Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Select Business</CardTitle>
              <CardDescription>Choose a business to create a welcome story</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedBusinessId} onValueChange={selectBusiness}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a business..." />
                </SelectTrigger>
                <SelectContent>
                  {availableBusinesses.map((business) => (
                    <SelectItem key={business.id} value={business.id}>
                      {business.business_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Story Settings */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Story Settings</CardTitle>
              <CardDescription>Configure the welcome story appearance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="format">Format</Label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="square">Square (1080×1080)</SelectItem>
                    <SelectItem value="portrait">Portrait (1080×1350)</SelectItem>
                    <SelectItem value="landscape">Landscape (1920×1080)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="theme">Theme</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(WELCOME_THEMES).map(([key, themeData]) => (
                      <SelectItem key={key} value={key}>
                        {themeData.name} - {themeData.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="accentColor">Border Color</Label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="color"
                    id="accentColor"
                    value={storyData.accentColor || '#0a1628'}
                    onChange={(e) => updateStoryData('accentColor', e.target.value)}
                    className="w-10 h-10 rounded border cursor-pointer"
                    style={{ padding: 0 }}
                  />
                  <Input
                    value={storyData.accentColor || '#0a1628'}
                    onChange={(e) => updateStoryData('accentColor', e.target.value)}
                    className="flex-1 font-mono text-sm"
                    placeholder="#000000"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Used as the grid border and logo frame color on the cover slide
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Image Management */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Cover Images</CardTitle>
              <CardDescription>
                Upload 4 images for the 2×2 cover grid. Click a slot or drag images in.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUpload
                images={uploadedImages}
                maxImages={4}
                onImagesChange={handleImagesChange}
              />
            </CardContent>
          </Card>

          {/* Editable Fields */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Edit Story Content</CardTitle>
              <CardDescription>Customize the welcome story content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="business-name">Business Name</Label>
                <Input
                  id="business-name"
                  value={storyData.businessName}
                  onChange={(e) => updateStoryData('businessName', e.target.value)}
                  placeholder="Business name"
                />
              </div>

              <div>
                <Label htmlFor="short-description">Short Description</Label>
                <Textarea
                  id="short-description"
                  value={storyData.shortDescription}
                  onChange={(e) => updateStoryData('shortDescription', e.target.value)}
                  placeholder="Brief description of the business"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={storyData.industry}
                  onChange={(e) => updateStoryData('industry', e.target.value)}
                  placeholder="Business industry"
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={storyData.location}
                  onChange={(e) => updateStoryData('location', e.target.value)}
                  placeholder="City, Country"
                />
              </div>

              <div>
                <Label htmlFor="cultural-story">Cultural Identity Story</Label>
                <Textarea
                  id="cultural-story"
                  value={storyData.culturalIdentityStory}
                  onChange={(e) => updateStoryData('culturalIdentityStory', e.target.value)}
                  placeholder="Cultural identity story (optional)"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="founder-story">Founder Story</Label>
                <Textarea
                  id="founder-story"
                  value={storyData.founderStory}
                  onChange={(e) => updateStoryData('founderStory', e.target.value)}
                  placeholder="Founder story (optional)"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="cta-text">CTA Text</Label>
                <Textarea
                  id="cta-text"
                  value={storyData.ctaText}
                  onChange={(e) => updateStoryData('ctaText', e.target.value)}
                  placeholder="Call-to-action text"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Export Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Export</CardTitle>
              <CardDescription>Download the welcome story slides</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={exportAllSlides}
                disabled={isExporting || !storyData.businessName}
                className="w-full"
              >
                {isExporting ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Export All Slides
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Preview</CardTitle>
              <CardDescription>
                {SLIDE_COMPONENTS[currentSlide].name} - {currentSlide + 1} of {SLIDE_COMPONENTS.length}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {storyData.businessName ? (
                <PreviewViewport
                  slideWidth={slideWidth}
                  slideHeight={slideHeight}
                >
                  <div ref={previewRefs[currentSlide]}>
                    {React.createElement(SLIDE_COMPONENTS[currentSlide].component, {
                      data: storyData,
                      format: format,
                      theme: theme
                    })}
                  </div>
                </PreviewViewport>
              ) : (
                <div className="text-center py-16 text-muted-foreground flex-1 flex flex-col items-center justify-center">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>Select a business to generate a welcome story</p>
                </div>
              )}

              {/* Slide Navigation */}
              {storyData.businessName && (
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={prevSlide}
                      disabled={currentSlide === 0}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>

                    <div className="flex gap-1">
                      {SLIDE_COMPONENTS.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToSlide(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${index === currentSlide ? 'bg-primary' : 'bg-muted'
                            }`}
                        />
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={nextSlide}
                      disabled={currentSlide === SLIDE_COMPONENTS.length - 1}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportSlide(currentSlide)}
                    disabled={isExporting}
                  >
                    {isExporting && exportingSlide === currentSlide ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
