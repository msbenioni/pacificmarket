"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { exportToPng } from "@/lib/social-generator/exportSpotlight";
import { Download, Eye, RefreshCw, Sparkles } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { TEMPLATE_OPTIONS } from "./templateOptions";
import EditorialSpotlightTemplate from "./templates/EditorialSpotlightTemplate";
import PromoSpotlightTemplate from "./templates/PromoSpotlightTemplate";
import StorySpotlightTemplate from "./templates/StorySpotlightTemplate";

// Preset accent colours
const ACCENT_PRESETS = [
  { label: "Navy", value: "#0a1628" },
  { label: "Ocean", value: "#1e3a5f" },
  { label: "Forest", value: "#1a4d2e" },
  { label: "Sunset", value: "#8b2500" },
  { label: "Purple", value: "#4a1d6b" },
  { label: "Teal", value: "#0d6e6e" },
  { label: "Charcoal", value: "#2d2d2d" },
  { label: "Pacific Blue", value: "#006994" },
];

/**
 * Business Spotlight Generator
 * Select a business → configure template → live preview → download PNG
 */
export default function SpotlightGenerator({ businesses = [] }) {
  const { toast } = useToast();
  const previewRef = useRef(null);
  const previewContainerRef = useRef(null);
  const [previewScale, setPreviewScale] = useState(0.4);

  // Resize observer to scale preview to fit container
  useEffect(() => {
    const container = previewContainerRef.current;
    if (!container) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const containerWidth = entry.contentRect.width;
        setPreviewScale(Math.min(containerWidth / 1080, 1));
      }
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Business selection
  const [selectedBusinessId, setSelectedBusinessId] = useState("");

  // Template settings
  const [template, setTemplate] = useState("editorial");
  const [format, setFormat] = useState("square");
  const [accentColor, setAccentColor] = useState("#0a1628");

  // Editable fields (auto-filled from selected business, user can override)
  const [editData, setEditData] = useState({
    business_name: "",
    tagline: "",
    description: "",
    location: "",
    industry: "",
    business_website: "",
    business_email: "",
    socialHandle: "",
    logo_url: "",
    banner_url: "",
  });

  // Export state
  const [isExporting, setIsExporting] = useState(false);

  // Select a business and populate fields
  const selectBusiness = useCallback((businessId) => {
    setSelectedBusinessId(businessId);
    if (!businessId) return;

    const biz = businesses.find((b) => b.id === businessId);
    if (!biz) return;

    // Build location string
    const locationParts = [biz.city, biz.country].filter(Boolean);
    const location = locationParts.join(", ");

    // Find a social handle to display
    let socialHandle = "";
    if (biz.social_links) {
      if (biz.social_links.instagram) {
        const handle = biz.social_links.instagram.split("/").filter(Boolean).pop();
        socialHandle = `@${handle}`;
      } else if (biz.social_links.facebook) {
        const handle = biz.social_links.facebook.split("/").filter(Boolean).pop();
        socialHandle = `fb.com/${handle}`;
      }
    }

    setEditData({
      business_name: biz.business_name || "",
      tagline: biz.tagline || "",
      description: biz.description || "",
      location,
      industry: biz.industry || "",
      business_website: biz.business_website || "",
      business_email: biz.business_email || "",
      socialHandle,
      logo_url: biz.logo_url || "",
      banner_url: biz.banner_url || "",
    });
  }, [businesses]);

  // Update a single field
  const updateField = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  // Export as PNG
  const handleExport = async () => {
    if (!previewRef.current) {
      toast({ title: "No Preview", description: "Generate a preview first", variant: "destructive" });
      return;
    }

    setIsExporting(true);
    try {
      const filename = `pdn-spotlight-${(editData.business_name || "business").toLowerCase().replace(/\s+/g, "-")}-${format}`;
      await exportToPng(previewRef.current, filename);
      toast({ title: "Downloaded!", description: `${filename}.png saved` });
    } catch (err) {
      console.error("Export error:", err);
      toast({ title: "Export Failed", description: err.message, variant: "destructive" });
    } finally {
      setIsExporting(false);
    }
  };

  // Template data for rendering
  const templateData = {
    ...editData,
  };

  // Get the appropriate template component
  const getTemplateComponent = () => {
    switch (template) {
      case 'promo':
        return PromoSpotlightTemplate;
      case 'story':
        return StorySpotlightTemplate;
      case 'editorial':
      default:
        return EditorialSpotlightTemplate;
    }
  };

  const TemplateComponent = getTemplateComponent();

  // Active businesses with names for the selector
  const activeBiz = businesses
    .filter((b) => b.business_name)
    .sort((a, b) => (a.business_name || "").localeCompare(b.business_name || ""));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Sparkles className="h-6 w-6 text-amber-500" />
        <div>
          <h2 className="text-2xl font-bold">Business Spotlight Generator</h2>
          <p className="text-muted-foreground text-sm">
            Create branded social media cards for Pacific businesses
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* ═══ LEFT: Form ═══ */}
        <div className="space-y-4">
          {/* Business selector */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Select Business</CardTitle>
              <CardDescription>Choose a business to auto-fill details</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedBusinessId} onValueChange={selectBusiness}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a business..." />
                </SelectTrigger>
                <SelectContent>
                  {activeBiz.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.business_name}
                      {b.city ? ` — ${b.city}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Template settings */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Template Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Template</Label>
                <Select value={template} onValueChange={setTemplate}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TEMPLATE_OPTIONS.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        <div>
                          <div className="font-medium">{option.name}</div>
                          <div className="text-xs text-muted-foreground">{option.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  {TEMPLATE_OPTIONS.find(opt => opt.id === template)?.platforms?.join(', ')} • {TEMPLATE_OPTIONS.find(opt => opt.id === template)?.useCase}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Format</Label>
                  <Select value={format} onValueChange={setFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="square">Square (1080×1080)</SelectItem>
                      <SelectItem value="portrait">Portrait (1080×1350)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Accent colour */}
              <div>
                <Label>Accent Colour</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {ACCENT_PRESETS.map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() => setAccentColor(preset.value)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${accentColor === preset.value ? "border-primary ring-2 ring-primary/30 scale-110" : "border-transparent hover:scale-105"}`}
                      style={{ background: preset.value }}
                      title={preset.label}
                    />
                  ))}
                  <div className="flex items-center gap-2 ml-2">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border-0"
                    />
                    <span className="text-xs text-muted-foreground">{accentColor}</span>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Editable fields */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Edit Content</CardTitle>
              <CardDescription>Auto-filled from selected business. Edit as needed.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label>Business Name</Label>
                <Input value={editData.business_name} onChange={(e) => updateField("business_name", e.target.value)} />
              </div>
              <div>
                <Label>Tagline</Label>
                <Input value={editData.tagline} onChange={(e) => updateField("tagline", e.target.value)} placeholder="Short tagline or motto" />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={editData.description} onChange={(e) => updateField("description", e.target.value)} rows={3} placeholder="Brief business description" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Location</Label>
                  <Input value={editData.location} onChange={(e) => updateField("location", e.target.value)} placeholder="City, Country" />
                </div>
                <div>
                  <Label>Industry</Label>
                  <Input value={editData.industry} onChange={(e) => updateField("industry", e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Website</Label>
                  <Input value={editData.business_website} onChange={(e) => updateField("business_website", e.target.value)} placeholder="https://..." />
                </div>
                <div>
                  <Label>Social Handle</Label>
                  <Input value={editData.socialHandle} onChange={(e) => updateField("socialHandle", e.target.value)} placeholder="@handle" />
                </div>
              </div>
              <div>
                <Label>Email</Label>
                <Input value={editData.business_email} onChange={(e) => updateField("business_email", e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Logo URL</Label>
                  <Input value={editData.logo_url} onChange={(e) => updateField("logo_url", e.target.value)} placeholder="Logo image URL" />
                </div>
                <div>
                  <Label>Banner URL</Label>
                  <Input value={editData.banner_url} onChange={(e) => updateField("banner_url", e.target.value)} placeholder="Banner image URL" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ═══ RIGHT: Preview + Export ═══ */}
        <div className="space-y-4">
          {/* Export actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <Button onClick={handleExport} disabled={isExporting || !editData.business_name} className="flex-1">
                  {isExporting ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                  {isExporting ? "Generating..." : "Download PNG"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                {format === "square" ? "1080 × 1080px" : "1080 × 1350px"} • 2× resolution for sharp output
              </p>
            </CardContent>
          </Card>

          {/* Live preview */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Eye className="h-4 w-4" /> Live Preview
              </CardTitle>
              <CardDescription>
                This is what will be exported. Scroll to see full image if portrait.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!editData.business_name ? (
                <div className="text-center py-16 text-muted-foreground">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>Select a business to generate a spotlight card</p>
                </div>
              ) : (
                <div
                  ref={previewContainerRef}
                  className="border rounded-lg overflow-hidden bg-gray-100"
                  style={{
                    width: "100%",
                    height: format === "portrait" ? 1350 * previewScale : 1080 * previewScale,
                    position: "relative",
                  }}
                >
                  <div
                    ref={previewRef}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: 1080,
                      height: format === "portrait" ? 1350 : 1080,
                      transform: `scale(${previewScale})`,
                      transformOrigin: "top left",
                    }}
                  >
                    <TemplateComponent
                      data={templateData}
                      format={format}
                      accentColor={accentColor}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div >
  );
}
