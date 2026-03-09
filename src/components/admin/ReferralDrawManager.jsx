"use client";

import { useState, useEffect } from "react";
import { Gift, Users, TrendingUp, Crown, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { selectMonthlyWinner } from "@/utils/referrals";

export default function ReferralDrawManager() {
  const [currentWinner, setCurrentWinner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [drawHistory, setDrawHistory] = useState([]);
  const [stats, setStats] = useState({
    totalParticipants: 0,
    totalReferrals: 0,
    thisMonthEntries: 0
  });

  const handleMonthlyDraw = async () => {
    setLoading(true);
    try {
      const winner = await selectMonthlyWinner();
      
      if (winner) {
        setCurrentWinner(winner);
        // In a real implementation, you'd save this to a draws_history table
        setDrawHistory(prev => [
          {
            id: Date.now(),
            date: new Date().toISOString(),
            winner: winner,
            totalEntries: winner.referral_count
          },
          ...prev.slice(0, 11) // Keep last 12 draws
        ]);
      } else {
        alert("No participants found for this month's draw");
      }
    } catch (error) {
      console.error('Error selecting winner:', error);
      alert("Error selecting winner. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load draw history and stats
    // In a real implementation, this would fetch from a draws_history table
    setDrawHistory([
      {
        id: 1,
        date: "2026-02-01T00:00:00Z",
        winner: {
          business_name: "Island Pepe",
          referral_count: 3
        },
        totalEntries: 3
      },
      {
        id: 2,
        date: "2026-01-01T00:00:00Z",
        winner: {
          business_name: "Tangata Whenua Carving",
          referral_count: 1
        },
        totalEntries: 1
      }
    ]);

    // Mock stats - in real implementation, calculate from actual data
    setStats({
      totalParticipants: 12,
      totalReferrals: 8,
      thisMonthEntries: 5
    });
  }, []);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#c9a84c]/10 rounded-xl">
          <Crown className="w-5 h-5 text-[#c9a84c]" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#0a1628]">Monthly Referral Draw</h3>
          <p className="text-sm text-gray-600">Select winner for free website build</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-[#f8fafc] border border-gray-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-[#0d4f4f]" />
            <span className="text-sm font-medium text-gray-600">Participants</span>
          </div>
          <div className="text-2xl font-bold text-[#0a1628]">{stats.totalParticipants}</div>
        </div>

        <div className="bg-[#f8fafc] border border-gray-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-[#00c4cc]" />
            <span className="text-sm font-medium text-gray-600">Total Referrals</span>
          </div>
          <div className="text-2xl font-bold text-[#0a1628]">{stats.totalReferrals}</div>
        </div>

        <div className="bg-[#c9a84c]/10 border border-[#c9a84c]/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="w-4 h-4 text-[#c9a84c]" />
            <span className="text-sm font-medium text-[#c9a84c]">This Month</span>
          </div>
          <div className="text-2xl font-bold text-[#c9a84c]">{stats.thisMonthEntries}</div>
          <div className="text-xs text-gray-600 mt-1">entries</div>
        </div>
      </div>

      {/* Current Winner */}
      {currentWinner && (
        <div className="bg-gradient-to-r from-[#c9a84c]/10 to-[#c9a84c]/5 border border-[#c9a84c]/30 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#c9a84c]/20 rounded-full">
              <Crown className="w-5 h-5 text-[#c9a84c]" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-[#0a1628]">Current Winner</h4>
              <p className="text-sm text-gray-600">Selected {new Date().toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="bg-white/60 rounded-xl p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-[#0a1628]">{currentWinner.business_name}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {currentWinner.referral_count} referral{currentWinner.referral_count !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-[#c9a84c]">Prize</p>
                <p className="text-xs text-gray-600">Free Website</p>
                <p className="text-xs text-gray-600">($50/month hosting)</p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-[#0d4f4f]">
            <CheckCircle className="w-4 h-4" />
            <span>Winner has been notified via email</span>
          </div>
        </div>
      )}

      {/* Draw Button */}
      <div className="mb-6">
        <button
          onClick={handleMonthlyDraw}
          disabled={loading || stats.thisMonthEntries === 0}
          className="w-full bg-[#0d4f4f] hover:bg-[#1a6b6b] disabled:bg-gray-300 text-white font-semibold px-6 py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Selecting Winner...
            </>
          ) : (
            <>
              <Gift className="w-5 h-5" />
              {stats.thisMonthEntries === 0 
                ? "No Entries This Month" 
                : "Select Monthly Winner"
              }
            </>
          )}
        </button>

        {stats.thisMonthEntries === 0 && (
          <p className="text-sm text-gray-500 text-center mt-2">
            No referrals have been made this month
          </p>
        )}
      </div>

      {/* Draw History */}
      {drawHistory.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-[#0a1628] mb-3">Recent Draws</h4>
          <div className="space-y-2">
            {drawHistory.map((draw) => (
              <div key={draw.id} className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                <div>
                  <p className="font-medium text-[#0a1628] text-sm">{draw.winner.business_name}</p>
                  <p className="text-xs text-gray-600">
                    {new Date(draw.date).toLocaleDateString()} • {draw.totalEntries} entries
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-[#c9a84c]">Winner</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 bg-[#f0f9f9] border border-[#00c4cc]/20 rounded-xl p-4">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-[#00c4cc] flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-600">
            <p className="font-medium text-[#0a1628] mb-1">How it works</p>
            <ul className="space-y-1 text-xs">
              <li>• Each approved referral = 1 entry in the monthly draw</li>
              <li>• Winner receives a free website build (pays $50/month hosting)</li>
              <li>• Draw is completely random among all entries</li>
              <li>Winner is notified automatically via email</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
