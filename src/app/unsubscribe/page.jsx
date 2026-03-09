"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import Layout from "@/components/layout/Layout";

export default function UnsubscribePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [unsubscribed, setUnsubscribed] = useState(false);
  const [error, setError] = useState("");
  const [emailFromUrl, setEmailFromUrl] = useState("");

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
      setEmailFromUrl(emailParam);
    }
  }, [searchParams]);

  const handleUnsubscribe = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Call public unsubscribe API
      const response = await fetch('/api/email/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.toLowerCase().trim() })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process unsubscribe request');
      }

      setUnsubscribed(true);
      
    } catch (error) {
      console.error('Unsubscribe error:', error);
      setError(error.message || 'Failed to process unsubscribe request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (unsubscribed) {
    return (
      <Layout currentPageName="unsubscribe">
        <div className="min-h-screen bg-gradient-to-br from-[#f8f9fc] to-[#e8f4f8] flex items-center justify-center px-4">
          <div className="max-w-md w-full">
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-lg">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                
                <h1 className="text-2xl font-bold text-[#0a1628] mb-4">
                  Successfully Unsubscribed
                </h1>
                
                <p className="text-gray-600 mb-6">
                  You have been removed from our mailing list. You will no longer receive marketing emails from Pacific Market.
                </p>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-2">Unsubscribed email:</p>
                    <p className="font-medium text-[#0a1628]">{email}</p>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Important Note:</p>
                        <p>You may still receive important transactional emails related to your account, business listings, or referral activities.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-4">
                      Changed your mind? You can always resubscribe in your Business Portal settings.
                    </p>
                    
                    <div className="space-y-3">
                      <button
                        onClick={() => router.push('/')}
                        className="w-full bg-[#0d4f4f] hover:bg-[#1a6b6b] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                      >
                        Return to Pacific Market
                      </button>
                      
                      <button
                        onClick={() => router.push('/BusinessLogin')}
                        className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-[#0a1628] font-semibold px-6 py-3 rounded-xl transition-colors"
                      >
                        Sign In to Portal
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentPageName="unsubscribe">
      <div className="min-h-screen bg-gradient-to-br from-[#f8f9fc] to-[#e8f4f8] flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <Mail className="w-8 h-8 text-red-600" />
              </div>
              
              <h1 className="text-2xl font-bold text-[#0a1628] mb-4">
                Unsubscribe from Emails
              </h1>
              
              <p className="text-gray-600 mb-6">
                We're sorry to see you go! Enter your email address below to unsubscribe from Pacific Market marketing emails.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleUnsubscribe} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#0a1628] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/30 focus:border-[#0d4f4f]"
                  required
                />
                {emailFromUrl && (
                  <p className="text-xs text-gray-500 mt-2">
                    Email detected from unsubscribe link
                  </p>
                )}
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-3">
                  <strong>What happens when you unsubscribe?</strong>
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• You'll no longer receive marketing emails</li>
                  <li>• You'll still get important account notifications</li>
                  <li>• You can resubscribe anytime in your portal</li>
                  <li>• Your business listings remain active</li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white font-semibold px-6 py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Unsubscribe Me"
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Having issues with emails? We'd love to help.
                </p>
                <div className="space-y-2">
                  <button
                    onClick={() => router.push('/')}
                    className="w-full bg-[#0d4f4f] hover:bg-[#1a6b6b] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                  >
                    Return to Pacific Market
                  </button>
                  
                  <button
                    onClick={() => router.push('/BusinessLogin')}
                    className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-[#0a1628] font-semibold px-6 py-3 rounded-xl transition-colors"
                  >
                    Sign In to Portal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
