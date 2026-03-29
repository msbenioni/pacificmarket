"use client";

// QR Code preview utilities extracted from QRCodeGenerator
// Used by both the generator and Tools landing page

import { useState, useEffect } from 'react';

export function QRCodePreview({ url, label, size = 256, useCases = [] }) {
  const [qrUrl, setQrUrl] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [qrError, setQrError] = useState(false);

  const generateQR = async () => {
    if (!url) return;
    setGenerating(true);
    setQrError(false);

    try {
      const response = await fetch(
        `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}&format=png&margin=10`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate QR code');
      }

      const blob = await response.blob();
      const qrDataUrl = URL.createObjectURL(blob);
      setQrUrl(qrDataUrl);
    } catch (error) {
      console.error('QR generation error:', error);
      setQrError(true);
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    if (url) generateQR();
  }, [url, size]);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="flex flex-col items-center">
        <div className="w-32 h-32 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
          {qrUrl && !qrError ? (
            <img
              src={qrUrl}
              alt="QR Code"
              className="w-full h-full object-contain"
            />
          ) : generating ? (
            <div className="w-8 h-8 border-2 border-[#0d4f4f] border-t-transparent rounded-full animate-spin"></div>
          ) : qrError ? (
            <div className="text-red-400 text-xs text-center">Failed to load</div>
          ) : (
            <div className="w-16 h-16 bg-gray-300 rounded"></div>
          )}
        </div>
        
        <div className="text-center mb-4">
          <h4 className="font-bold text-[#0a1628] mb-1">{label}</h4>
          <p className="text-sm text-gray-600">{url}</p>
        </div>
        
        {useCases.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center">
            {useCases.map((useCase, index) => (
              <div key={index} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-xs">
                {useCase === "Storefront" && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>}
                {useCase === "Payments" && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>}
                {useCase === "Events" && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>}
                <span>{useCase}</span>
              </div>
            ))}
          </div>
        )}
        
        <p className="text-xs text-gray-500 mt-4 text-center max-w-xs">
          Scan to visit business profile, view services, and get in touch
        </p>
      </div>
    </div>
  );
}
