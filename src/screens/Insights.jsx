import { useState, useEffect } from "react";
import { pacificMarket } from "@/lib/pacificMarketClient";
import { BarChart2, Globe, Users, ShieldCheck, TrendingUp, Building2 } from "lucide-react";
import { BUSINESS_STATUS } from "@/constants/business";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import InsightStatCard from "../components/insights/InsightStatCard";
import HorizontalBar from "../components/insights/HorizontalBar";
import DonutChart from "../components/insights/DonutChart";

function tally(arr, key) {
  const map = {};
  arr.forEach(item => {
    const val = item[key];
    if (val) map[val] = (map[val] || 0) + 1;
  });
  return Object.entries(map)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

export default function Insights() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pacificMarket.entities.Business.filter({ status: BUSINESS_STATUS.ACTIVE }).then(data => {
      setBusinesses(data);
      setLoading(false);
    });
  }, []);

  const total = businesses.length;
  const verified = businesses.filter(b => b.verified).length;
  const countries = new Set(businesses.map(b => b.country).filter(Boolean)).size;
  const identities = new Set(businesses.map(b => b.cultural_identity).filter(Boolean)).size;

  const byCountry = tally(businesses, "country");
  const byCategory = tally(businesses, "category");
  const byIdentity = tally(businesses, "cultural_identity");
  const byTier = tally(businesses, "tier");

  // Monthly registrations (by created_date)
  const monthMap = {};
  businesses.forEach(b => {
    if (!b.created_date) return;
    const d = new Date(b.created_date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthMap[key] = (monthMap[key] || 0) + 1;
  });
  const monthlyData = Object.entries(monthMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12)
    .map(([month, count]) => ({ month: month.slice(5) + "/" + month.slice(2, 4), count }));

  if (loading) {
    return (
      <div className="min-h-screen bg-[#eef0f5] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#0d4f4f] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eef0f5]">
      {/* Hero */}
      <div className="bg-[#0a1628] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#00c4cc] mb-2 block pt-4">Pacific Market Registry</span>
          <h1 className="text-3xl font-bold mb-2 pt-2">Registry Insights</h1>
          <p className="text-gray-400 text-sm max-w-xl">
            Data and analytics on Pacific-owned enterprises across the globe — supporting research, policy, and investment decisions.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <InsightStatCard label="Registered Enterprises" value={total} sub="Approved listings" icon={Building2} color="#0d4f4f" />
          <InsightStatCard label="Countries Represented" value={countries} sub="Across the Pacific & beyond" icon={Globe} color="#00c4cc" />
          <InsightStatCard label="Verified Businesses" value={verified} sub={`${total ? Math.round((verified/total)*100) : 0}% of all listings`} icon={ShieldCheck} color="#c9a84c" />
          <InsightStatCard label="Cultural Identities" value={identities} sub="Distinct Pacific identities" icon={Users} color="#0a1628" />
        </div>

        {/* Monthly registrations chart */}
        {monthlyData.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md">
            <h3 className="text-sm font-bold text-[#0a1628] uppercase tracking-wider mb-6 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#0d4f4f]" /> Monthly Registrations (last 12 months)
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#9ca3af" }} />
                <Tooltip
                  contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 12 }}
                  formatter={(v) => [v, "Registrations"]}
                />
                <Bar dataKey="count" fill="#0d4f4f" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Row: Country + Identity donut */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <HorizontalBar title="Businesses by Country" data={byCountry} color="#0d4f4f" />
          <HorizontalBar title="Businesses by Cultural Identity" data={byIdentity} color="#00c4cc" />
        </div>

        {/* Row: Category bar + tier donut */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <HorizontalBar title="Businesses by Industry" data={byCategory} color="#c9a84c" />
          <DonutChart
            title="Registry Tiers"
            data={byTier.map(d => ({ ...d, name: d.label === "featured_plus" ? "Featured+" : d.label === "verified" ? "Verified" : "Free" }))}
          />
        </div>

        {/* Data note */}
        <div className="bg-[#0a1628]/5 border border-[#0a1628]/10 rounded-2xl p-5 text-sm text-gray-500">
          <strong className="text-[#0a1628]">Data Note:</strong> All figures reflect approved, active listings in the Pacific Market Registry.
          Data is updated in real-time. For research, policy, or investment enquiries, please contact the registry governance team.
        </div>
      </div>
    </div>
  );
}