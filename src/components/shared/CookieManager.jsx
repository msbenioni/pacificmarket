"use client";

import { useState, useEffect } from "react";
import { Cookie } from "lucide-react";

export default function CookieManager() {
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: false,
    marketing: false,
    functional: false
  });
  const [hasConsent, setHasConsent] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (consent) {
      setPreferences(JSON.parse(consent));
      setHasConsent(true);
    } else {
      setHasConsent(false);
    }
  }, []);

  const updatePreferences = (newPreferences) => {
    setPreferences(newPreferences);
    localStorage.setItem('cookie-consent', JSON.stringify(newPreferences));
    applyCookieSettings(newPreferences);
    setHasConsent(true); // Hide immediately after setting preferences
  };

  const applyCookieSettings = (prefs) => {
    // Apply cookie settings to analytics and marketing tools
    console.log('Applying cookie settings:', prefs);
    
    // Example: Update Google Analytics consent
    // Note: gtag would be loaded from Google Analytics script
    if (typeof window !== 'undefined' && 'gtag' in window) {
      // @ts-ignore - gtag is loaded from external script
      window.gtag('consent', 'update', {
        'analytics_storage': prefs.analytics ? 'granted' : 'denied',
        'ad_storage': prefs.marketing ? 'granted' : 'denied',
        'functionality_storage': prefs.functional ? 'granted' : 'denied'
      });
    }
  };

  const resetConsent = () => {
    localStorage.removeItem('cookie-consent');
    // Reload page to show consent banner again
    window.location.reload();
  };

  // Don't render anything if user has already given consent
  if (hasConsent) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-[0_12px_40px_rgba(10,22,40,0.08)]">
      <div className="flex items-center gap-3 mb-6">
        <Cookie className="w-5 h-5 text-[#0d4f4f]" />
        <h3 className="font-bold text-[#0a1628]">Cookie Preferences</h3>
      </div>

      <div className="space-y-4">
        {/* Essential Cookies */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-semibold text-[#0a1628] text-sm">Essential Cookies</h4>
            <p className="text-xs text-gray-600 mt-1">Required for basic functionality</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Always Active</span>
            <div className="w-4 h-4 bg-green-500 rounded"></div>
          </div>
        </div>

        {/* Analytics Cookies */}
        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
          <div>
            <h4 className="font-semibold text-[#0a1628] text-sm">Analytics Cookies</h4>
            <p className="text-xs text-gray-600 mt-1">Help us improve our website</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.analytics}
              onChange={(e) => updatePreferences({...preferences, analytics: e.target.checked})}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0d4f4f]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0d4f4f]"></div>
          </label>
        </div>

        {/* Marketing Cookies */}
        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
          <div>
            <h4 className="font-semibold text-[#0a1628] text-sm">Marketing Cookies</h4>
            <p className="text-xs text-gray-600 mt-1">Personalized advertising</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.marketing}
              onChange={(e) => updatePreferences({...preferences, marketing: e.target.checked})}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0d4f4f]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0d4f4f]"></div>
          </label>
        </div>

        {/* Functional Cookies */}
        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
          <div>
            <h4 className="font-semibold text-[#0a1628] text-sm">Functional Cookies</h4>
            <p className="text-xs text-gray-600 mt-1">Enhanced features and personalization</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.functional}
              onChange={(e) => updatePreferences({...preferences, functional: e.target.checked})}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0d4f4f]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0d4f4f]"></div>
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => updatePreferences({
            essential: true,
            analytics: true,
            marketing: true,
            functional: true
          })}
          className="flex-1 bg-[#0d4f4f] hover:bg-[#0a3d3d] text-white font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          Accept All
        </button>
        <button
          onClick={() => updatePreferences({
            essential: true,
            analytics: false,
            marketing: false,
            functional: false
          })}
          className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          Reject All
        </button>
        <button
          onClick={() => updatePreferences(preferences)}
          className="flex-1 border border-[#0d4f4f] text-[#0d4f4f] hover:bg-[#0d4f4f]/10 font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          Save Preferences
        </button>
      </div>

      {/* Additional Options */}
      <div className="mt-4 flex justify-between items-center">
        <a
          href="/Cookies"
          className="text-sm text-[#0d4f4f] hover:underline"
        >
          Learn More About Cookies
        </a>
        <button
          onClick={resetConsent}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Reset Consent
        </button>
      </div>

      {/* Last Updated */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Last updated: {new Date().toISOString().split('T')[0]}
        </p>
      </div>
    </div>
  );
}
