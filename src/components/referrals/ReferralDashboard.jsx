"use client";

import { useState, useEffect } from "react";
import { Copy, Gift, Users, TrendingUp, ExternalLink } from "lucide-react";
import { getReferralStats, getReferralLink } from "@/utils/referrals";

export default function ReferralDashboard({ businessId, businessHandle }) {
  const [stats, setStats] = useState({
    total_referrals: 0,
    pending_referrals: 0,
    approved_referrals: 0,
    draw_entries: 0
  });
  const [referralLink, setReferralLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReferralData = async () => {
      if (!businessId) return;

      try {
        setLoading(true);
        
        // Load referral stats
        const statsData = await getReferralStats(businessId);
        setStats(statsData);

        // Generate referral link
        const link = getReferralLink(businessHandle);
        setReferralLink(link);
      } catch (error) {
        console.error('Error loading referral data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReferralData();
  }, [businessId, businessHandle]);

  const handleCopyLink = async () => {
    if (!referralLink) return;
    
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying link:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#c9a84c]/10 rounded-xl">
          <Gift className="w-5 h-5 text-[#c9a84c]" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#0a1628]">Refer & Win</h3>
          <p className="text-sm text-gray-600">Refer businesses and enter the monthly website draw</p>
        </div>
      </div>

      {/* Referral Link */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-[#0a1628] mb-2">
          Your referral link
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={referralLink}
            readOnly
            className="flex-1 px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-sm text-gray-600"
            placeholder="Generating referral link..."
          />
          <button
            onClick={handleCopyLink}
            className="px-4 py-2 bg-[#0d4f4f] hover:bg-[#1a6b6b] text-white font-medium rounded-xl transition-colors flex items-center gap-2"
          >
            {copied ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Share this link with other Pacific businesses to join Pacific Market
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#f8fafc] border border-gray-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-[#0d4f4f]" />
            <span className="text-sm font-medium text-gray-600">Referrals made</span>
          </div>
          <div className="text-2xl font-bold text-[#0a1628]">{stats.total_referrals}</div>
          <div className="text-xs text-gray-500 mt-1">
            {stats.pending_referrals > 0 && `${stats.pending_referrals} pending`}
          </div>
        </div>

        <div className="bg-[#c9a84c]/10 border border-[#c9a84c]/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-[#c9a84c]" />
            <span className="text-sm font-medium text-[#c9a84c]">Draw entries</span>
          </div>
          <div className="text-2xl font-bold text-[#c9a84c]">{stats.draw_entries}</div>
          <div className="text-xs text-gray-600 mt-1">
            {stats.draw_entries === 1 ? '1 entry' : `${stats.draw_entries} entries`}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-[#f0f9f9] border border-[#00c4cc]/20 rounded-xl p-4">
        <h4 className="text-sm font-semibold text-[#0a1628] mb-3">How it works</h4>
        <ol className="space-y-2 text-sm text-gray-600">
          <li className="flex gap-2">
            <span className="font-semibold text-[#0d4f4f]">1.</span>
            <span>Share your referral link with other Pacific businesses</span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-[#0d4f4f]">2.</span>
            <span>They sign up using your link</span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-[#0d4f4f]">3.</span>
            <span>Each successful referral = 1 entry in the monthly draw</span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-[#0d4f4f]">4.</span>
            <span>Winner gets a free website (only pays $50/month hosting)</span>
          </li>
        </ol>
      </div>

      {/* CTA */}
      {stats.draw_entries === 0 && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-3">
            Start referring businesses to enter the monthly draw!
          </p>
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-2 px-6 py-2 bg-[#c9a84c] hover:bg-[#b8943d] text-white font-medium rounded-xl transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Share Your Link
          </button>
        </div>
      )}

      {stats.draw_entries > 0 && (
        <div className="mt-6 p-4 bg-[#c9a84c]/10 border border-[#c9a84c]/20 rounded-xl">
          <p className="text-sm font-medium text-[#0a1628] text-center">
            🎉 You have {stats.draw_entries} {stats.draw_entries === 1 ? 'entry' : 'entries'} in this month's draw!
          </p>
          <p className="text-xs text-gray-600 text-center mt-1">
            Keep referring to increase your chances
          </p>
        </div>
      )}
    </div>
  );
}
