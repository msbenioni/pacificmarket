"use client";

import { useState, useEffect } from "react";
import { X, Cookie, Settings, Info } from "lucide-react";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // Always required
    analytics: false,
    marketing: false,
    functional: false
  });

  useEffect(() => {
    // Check if user has already made consent choice
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    } else {
      setPreferences(JSON.parse(consent));
    }
  }, []);

  const acceptAll = () => {
    const allPreferences = {
      essential: true,
      analytics: true,
      marketing: true,
      functional: true
    };
    setPreferences(allPreferences);
    localStorage.setItem('cookie-consent', JSON.stringify(allPreferences));
    setShowBanner(false);
    applyCookieSettings(allPreferences);
  };

  const acceptSelected = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    setShowBanner(false);
    applyCookieSettings(preferences);
  };

  const rejectAll = () => {
    const minimalPreferences = {
      essential: true,
      analytics: false,
      marketing: false,
      functional: false
    };
    setPreferences(minimalPreferences);
    localStorage.setItem('cookie-consent', JSON.stringify(minimalPreferences));
    setShowBanner(false);
    applyCookieSettings(minimalPreferences);
  };

  const applyCookieSettings = (prefs) => {
    // This would integrate with your analytics/marketing tools
    // For now, we'll just store the preferences
    console.log('Cookie preferences applied:', prefs);
    
    // Example: Load Google Analytics if consented
    if (prefs.analytics) {
      // window.gtag('consent', 'update', {'analytics_storage': 'granted'});
    }
    
    // Example: Load marketing cookies if consented
    if (prefs.marketing) {
      // Load marketing/advertising scripts
    }
  };

  const updatePreference = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Main Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0a1628] text-white p-4 shadow-2xl z-50 border-t border-[#0d4f4f]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex items-start gap-3 flex-1">
              <Cookie className="w-5 h-5 text-[#c9a84c] mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-semibold mb-1">Cookie Consent</p>
                <p className="text-gray-300 leading-relaxed">
                  We use cookies to enhance your experience, analyze site traffic, and personalize content. 
                  By clicking "Accept All", you consent to our use of cookies. 
                  <a href="/Cookies" className="text-[#c9a84c] hover:underline ml-1">Learn more</a>.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
              <button
                onClick={() => setShowSettings(true)}
                className="px-4 py-2 text-sm border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Settings className="w-4 h-4 inline mr-1" />
                Customize
              </button>
              <button
                onClick={rejectAll}
                className="px-4 py-2 text-sm border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
              >
                Reject All
              </button>
              <button
                onClick={acceptAll}
                className="px-4 py-2 text-sm bg-[#c9a84c] text-[#0a1628] font-semibold rounded-lg hover:bg-[#b8973b] transition-colors"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cookie Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#0a1628]">Cookie Preferences</h2>
                <p className="text-sm text-gray-600 mt-1">Choose which cookies to allow</p>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Essential Cookies */}
              <div className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="essential"
                    checked={preferences.essential}
                    onChange={(e) => updatePreference('essential', e.target.checked)}
                    className="mt-1 rounded"
                    disabled
                  />
                  <div className="flex-1">
                    <label htmlFor="essential" className="font-semibold text-[#0a1628] cursor-pointer">
                      Essential Cookies
                    </label>
                    <p className="text-sm text-gray-600 mt-1">
                      Required for basic website functionality, including user authentication and security.
                    </p>
                    <div className="mt-2">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Always Required</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="analytics"
                    checked={preferences.analytics}
                    onChange={(e) => updatePreference('analytics', e.target.checked)}
                    className="mt-1 rounded"
                  />
                  <div className="flex-1">
                    <label htmlFor="analytics" className="font-semibold text-[#0a1628] cursor-pointer">
                      Analytics Cookies
                    </label>
                    <p className="text-sm text-gray-600 mt-1">
                      Help us understand how visitors interact with our website by collecting and reporting information anonymously.
                    </p>
                    <div className="mt-2">
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">Optional</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="marketing"
                    checked={preferences.marketing}
                    onChange={(e) => updatePreference('marketing', e.target.checked)}
                    className="mt-1 rounded"
                  />
                  <div className="flex-1">
                    <label htmlFor="marketing" className="font-semibold text-[#0a1628] cursor-pointer">
                      Marketing Cookies
                    </label>
                    <p className="text-sm text-gray-600 mt-1">
                      Used to deliver advertisements that are relevant to you and your interests.
                    </p>
                    <div className="mt-2">
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">Optional</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Functional Cookies */}
              <div className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="functional"
                    checked={preferences.functional}
                    onChange={(e) => updatePreference('functional', e.target.checked)}
                    className="mt-1 rounded"
                  />
                  <div className="flex-1">
                    <label htmlFor="functional" className="font-semibold text-[#0a1628] cursor-pointer">
                      Functional Cookies
                    </label>
                    <p className="text-sm text-gray-600 mt-1">
                      Enhance functionality and personalization, including remembering your preferences.
                    </p>
                    <div className="mt-2">
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">Optional</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Section */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-[#0d4f4f] mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-[#0a1628] text-sm">Your Privacy Rights</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      You can change your cookie preferences at any time. Your choices apply only to this device 
                      and browser. For more information about your rights under GDPR, please read our 
                      <a href="/Privacy" className="text-[#0d4f4f] hover:underline"> Privacy Policy</a>.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex flex-col sm:flex-row gap-3 justify-end">
              <button
                onClick={rejectAll}
                className="px-6 py-3 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Reject All
              </button>
              <button
                onClick={acceptSelected}
                className="px-6 py-3 text-sm bg-[#0d4f4f] text-white font-semibold rounded-lg hover:bg-[#0a3d3d] transition-colors"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
