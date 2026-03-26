"use client";

import { useState, useEffect, useRef } from "react";
import { QrCode, Download, Link as LinkIcon, Building2, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { createPageUrl } from "@/utils";
import { getUserBusinesses } from "@/lib/supabase/queries/businesses";
import { getBusinessWebsite, getBusinessTier, hasPremiumFeatures } from "@/lib/business/helpers";
import HeroStandard from "../components/shared/HeroStandard";
import { SUBSCRIPTION_TIER } from "@/constants/unifiedConstants";
import QRCode from 'qrcode';

export default function QRCodeGenerator() {
  const [user, setUser] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [url, setUrl] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [label, setLabel] = useState("");
  const [size, setSize] = useState(300);
  const [generating, setGenerating] = useState(false);
  const [mode, setMode] = useState("profile"); // profile | custom
  const [qrError, setQrError] = useState(false);

  useEffect(() => {
    const loadQRData = async () => {
      try {
        // Import getSupabase for auth only
        const { getSupabase } = await import("@/lib/supabase/client");
        const supabase = getSupabase();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        setUser(user);
        
        // Get user's businesses using shared query
        const { data: businesses } = await getUserBusinesses(user.id);
        
        if (businesses && businesses.length > 0) {
          setBusinesses(businesses);
          // Find the first business with a website using helper
          const businessWithWebsite = businesses.find(b => getBusinessWebsite(b));
          if (businessWithWebsite) {
            setUrl(getBusinessWebsite(businessWithWebsite));
            setLabel(businessWithWebsite.name);
          }
        }
      } catch (error) {
        console.error("Error loading QR data:", error);
      }
    };

    loadQRData();
  }, []);

  const generateQR = async () => {
    if (!url) return;
    setGenerating(true);
    setQrError(false);
    try {
      // Use the proper QR code library
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: size,
        margin: 2,
        color: {
          dark: '#0a1628',  // Dark color (Pacific Discovery Network dark blue)
          light: '#FFFFFF',  // Light color (white)
        },
        errorCorrectionLevel: 'H' // High error correction
      });
      
      setQrUrl(qrDataUrl);
      console.log('Generated real QR code for URL:', url); // Debug log
    } catch (error) {
      console.error('Error generating QR code:', error);
      setQrError(true);
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    if (url) generateQR();
  }, [url, size]);

  const handleBusinessSelect = (b) => {
    // Use helper function for consistent website access
    const profileUrl = getBusinessWebsite(b);
    setUrl(profileUrl);
    setLabel(b.business_name);
  };

  const formatUrl = (url) => {
    if (!url) return '';
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  };

  const handleCustomUrlChange = (e) => {
    const formattedUrl = formatUrl(e.target.value);
    setUrl(formattedUrl);
  };

  const handleDownload = async () => {
    if (!qrUrl) return;
    const response = await fetch(qrUrl);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `${label || "qr-code"}-qr.png`;
    a.click();
    URL.revokeObjectURL(blobUrl);
  };

  return (
    <>
<HeroStandard
  badge="Business Tool"
  title="QR Code Generator"
  subtitle="Generate QR codes for your business profile or any custom URL."
  description="Create a downloadable QR code for signage, packaging, business cards, or promotional materials."
  actions={
    <div className="hidden sm:flex">
      <Link
        href={createPageUrl("BusinessPortal")}
        className="inline-flex items-center gap-2 bg-white text-[#0a1628] px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Portal
      </Link>
    </div>
  }
  compact
/>

      <div className="min-h-screen bg-[#f8f9fc]">

      {/* Mobile-only back button */}
      <div className="sm:hidden max-w-4xl mx-auto px-4 pt-4">
        <Link
          href={createPageUrl("BusinessPortal")}
          className="inline-flex items-center gap-2 bg-white text-[#0a1628] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition border border-gray-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Portal
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {/* Settings */}
          <div className="space-y-5">
            {/* Mode */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <h3 className="font-bold text-[#0a1628] text-sm mb-4">QR Code Type</h3>
              <div className="flex flex-col sm:flex-row gap-2">
                {[
                  { id: "profile", label: "Business Profile", icon: Building2 },
                  { id: "custom", label: "Custom URL", icon: LinkIcon },
                ].map(m => (
                  <button key={m.id} onClick={() => setMode(m.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                      mode === m.id ? "border-[#0d4f4f] bg-[#0d4f4f]/5 text-[#0d4f4f]" : "border-gray-100 text-gray-500 hover:border-gray-200"
                    }`}>
                    <m.icon className="w-4 h-4" />
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Business Select */}
            {mode === "profile" && businesses.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-2xl p-5">
                <h3 className="font-bold text-[#0a1628] text-sm mb-3">Select Business</h3>
                <p className="text-xs text-gray-500 mb-3">Choose which business website to generate a QR code for</p>
                <div className="space-y-2">
                  {businesses.map(b => {
                    const website = getBusinessWebsite(b);
                    const hasWebsite = !!website;
                    return (
                      <div key={b.id}>
                        {hasWebsite ? (
                          <button 
                            onClick={() => handleBusinessSelect(b)}
                            className={`w-full flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                              label === b.business_name 
                                ? "border-[#0d4f4f] bg-[#0d4f4f]/5 cursor-pointer hover:border-[#0d4f4f]" 
                                : "border-gray-100 hover:border-gray-200 cursor-pointer"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#0a1628] to-[#0d4f4f] flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-bold text-sm">{b.business_name?.[0]}</span>
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-sm text-[#0a1628]">{b.business_name}</p>
                                <p className="text-gray-400 text-xs">{b.country}</p>
                              </div>
                            </div>
                            <div className="mt-2 sm:mt-0 text-xs font-medium">
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-1 ${
                                  label === b.business_name
                                    ? "bg-[#0d4f4f]/10 text-[#0d4f4f]"
                                    : "bg-slate-100 text-slate-500"
                                }`}
                              >
                                {label === b.business_name ? "Selected" : "Use this website"}
                              </span>
                            </div>
                          </button>
                        ) : (
                          <div className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed">
                            <div className="w-9 h-9 rounded-lg bg-gray-300 flex items-center justify-center flex-shrink-0">
                              <span className="text-gray-500 font-bold text-sm">{b.business_name?.[0]}</span>
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-sm text-gray-400">{b.business_name}</p>
                              <p className="text-gray-400 text-xs">{b.country}</p>
                              <p className="text-amber-600 text-xs mt-1">
                                ⚠️ No website added. Update your business profile to add your website.
                              </p>
                            </div>
                            <div className="text-xs text-gray-400">
                              No website
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Custom URL */}
            {mode === "custom" && (
              <div className="bg-white border border-gray-100 rounded-2xl p-5">
                <h3 className="font-bold text-[#0a1628] text-sm mb-3">Custom URL</h3>
                <input value={url} onChange={handleCustomUrlChange}
                  placeholder="Enter a website URL (e.g., example.com or https://example.com)"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0d4f4f] bg-white" />
                <div className="mt-3">
                  <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider block mb-1">Label</label>
                  <input value={label} onChange={e => setLabel(e.target.value)}
                    placeholder="Business name or description"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0d4f4f] bg-white" />
                </div>
              </div>
            )}

            {/* Size */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <h3 className="font-bold text-[#0a1628] text-sm mb-3">Size</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[200, 300, 400, 500].map(s => (
                  <button key={s} onClick={() => setSize(s)}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                      size === s ? "border-[#0d4f4f] bg-[#0d4f4f]/5 text-[#0d4f4f]" : "border-gray-100 text-gray-500"
                    }`}>
                    {s}px
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="flex flex-col items-center">
            <div className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-8 w-full text-center">
              <h3 className="font-bold text-[#0a1628] text-sm mb-5">QR Code Preview</h3>

              {qrUrl && !qrError ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="p-3 sm:p-4 bg-white rounded-2xl shadow-inner border border-gray-100 inline-block max-w-full">
                    <img 
                      src={qrUrl} 
                      alt="QR Code" 
                      className="w-full max-w-[220px] sm:max-w-[240px] h-auto"
                      onError={(e) => {
                        console.error('Failed to load QR code image:', e);
                        setQrError(true);
                      }}
                    />
                  </div>
                  {label && <p className="text-sm font-semibold text-[#0a1628]">{label}</p>}
                  <p className="text-xs text-gray-400 break-all max-w-full px-2">{url}</p>

                  <div className="flex gap-3 w-full">
                    <button onClick={handleDownload}
                      className="flex-1 flex items-center justify-center gap-2 bg-[#0a1628] hover:bg-[#122040] text-white font-bold py-3 rounded-xl text-sm transition-all">
                      <Download className="w-4 h-4" /> Download PNG
                    </button>
                    <button onClick={generateQR}
                      className="p-3 border border-gray-200 rounded-xl hover:border-[#0d4f4f] hover:text-[#0d4f4f] transition-all">
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : qrError ? (
                <div className="flex flex-col items-center justify-center py-10 sm:py-12">
                  <QrCode className="w-16 h-16 text-red-400 mb-4" />
                  <p className="text-red-400 text-sm">Failed to generate QR code. Please try again.</p>
                  <button onClick={generateQR}
                    className="mt-4 flex items-center gap-2 bg-[#0a1628] hover:bg-[#122040] text-white font-bold px-4 py-2 rounded-xl text-sm transition-all">
                    <RefreshCw className="w-4 h-4" /> Retry
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 sm:py-12">
                  <QrCode className="w-16 h-16 text-gray-200 mb-4" />
                  <p className="text-gray-400 text-sm">
                    {url ? "Generating..." : "Select a business or enter a URL to generate a QR code"}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 bg-[#0a1628]/5 border border-[#0a1628]/10 rounded-xl p-3 sm:p-4 text-xs text-gray-500 w-full">
              <p className="font-semibold text-[#0a1628] mb-1">About QR Codes</p>
              <p>Use QR codes on business cards, signage, packaging, or promotional materials to link customers directly to your Pacific Discovery Network profile.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}