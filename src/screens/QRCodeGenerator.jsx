import { useState, useEffect, useRef } from "react";
import { pacificMarket } from "@/lib/pacificMarketClient";
import { QrCode, Download, Link as LinkIcon, Building2, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { createPageUrl } from "@/utils";

export default function QRCodeGenerator() {
  const [user, setUser] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [url, setUrl] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [label, setLabel] = useState("");
  const [size, setSize] = useState(300);
  const [generating, setGenerating] = useState(false);
  const [mode, setMode] = useState("profile"); // profile | custom

  useEffect(() => {
    pacificMarket.auth.me().then(u => {
      setUser(u);
      return pacificMarket.entities.Business.filter({ owner_user_id: u.id });
    }).then(b => {
      setBusinesses(b);
      if (b.length > 0) {
        const business_handle = b[0].business_handle || b[0].id;
        const profileUrl = `${window.location.origin}/business-profile?handle=${business_handle}`;
        setUrl(profileUrl);
        setLabel(b[0].name);
      }
    }).catch(() => {});
  }, []);

  const generateQR = async () => {
    if (!url) return;
    setGenerating(true);
    // Use Google Charts API for QR generation (no external dependency needed)
    const encodedUrl = encodeURIComponent(url);
    const qr = `https://chart.googleapis.com/chart?cht=qr&chs=${size}x${size}&chl=${encodedUrl}&chco=0a1628&chf=bg,s,FFFFFF`;
    setQrUrl(qr);
    setGenerating(false);
  };

  useEffect(() => {
    if (url) generateQR();
  }, [url, size]);

  const handleBusinessSelect = (b) => {
    const business_handle = b.business_handle || b.id;
    const profileUrl = `${window.location.origin}/business-profile?handle=${business_handle}`;
    setUrl(profileUrl);
    setLabel(b.name);
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
    <div className="min-h-screen bg-[#f8f9fc]">
      <div className="bg-[#0a1628] text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link href={createPageUrl("BusinessPortal")} className="flex items-center gap-1 text-gray-400 hover:text-white text-sm mb-2 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Portal
          </Link>
          <h1 className="text-2xl font-bold">QR Code Generator</h1>
          <p className="text-gray-400 text-sm mt-1">Generate QR codes for your business registry profile or any custom URL.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Settings */}
          <div className="space-y-5">
            {/* Mode */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <h3 className="font-bold text-[#0a1628] text-sm mb-4">QR Code Type</h3>
              <div className="flex gap-2">
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
                <div className="space-y-2">
                  {businesses.map(b => (
                    <button key={b.id} onClick={() => handleBusinessSelect(b)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                        label === b.name ? "border-[#0d4f4f] bg-[#0d4f4f]/5" : "border-gray-100 hover:border-gray-200"
                      }`}>
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#0a1628] to-[#0d4f4f] flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">{b.name?.[0]}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-[#0a1628] text-sm">{b.name}</p>
                        <p className="text-gray-400 text-xs">{b.country}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Custom URL */}
            {mode === "custom" && (
              <div className="bg-white border border-gray-100 rounded-2xl p-5">
                <h3 className="font-bold text-[#0a1628] text-sm mb-3">Custom URL</h3>
                <input value={url} onChange={e => setUrl(e.target.value)}
                  placeholder="https://your-website.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0d4f4f] bg-white" />
                <div className="mt-3">
                  <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider block mb-1">Label</label>
                  <input value={label} onChange={e => setLabel(e.target.value)}
                    placeholder="Label for filename"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0d4f4f] bg-white" />
                </div>
              </div>
            )}

            {/* Size */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <h3 className="font-bold text-[#0a1628] text-sm mb-3">Size</h3>
              <div className="flex gap-2">
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
            <div className="bg-white border border-gray-100 rounded-2xl p-8 w-full text-center">
              <h3 className="font-bold text-[#0a1628] text-sm mb-5">QR Code Preview</h3>

              {qrUrl ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-white rounded-2xl shadow-inner border border-gray-100 inline-block">
                    <img src={qrUrl} alt="QR Code" className="max-w-[240px] max-h-[240px]" />
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
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <QrCode className="w-16 h-16 text-gray-200 mb-4" />
                  <p className="text-gray-400 text-sm">
                    {url ? "Generating..." : "Select a business or enter a URL to generate a QR code"}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 bg-[#0a1628]/5 border border-[#0a1628]/10 rounded-xl p-4 text-xs text-gray-500 w-full">
              <p className="font-semibold text-[#0a1628] mb-1">About QR Codes</p>
              <p>Use QR codes on business cards, signage, packaging, or promotional materials to link customers directly to your Pacific Market Registry profile.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}