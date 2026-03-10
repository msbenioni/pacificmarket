import { useEffect, useState } from "react";
import { getPublicBusinesses } from "@/lib/supabase/queries/businesses";
import { BUSINESS_STATUS } from "@/constants/unifiedConstants";
import { Building2, Globe, CheckCircle, LayoutGrid } from "lucide-react";

export default function StatsBar() {
  const [stats, setStats] = useState({ total: 0, countries: 0, industries: 0, verified: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Get public businesses using shared query
        const { data: businesses } = await getPublicBusinesses({ limit: 1000 });
        
        const businessList = businesses || [];
        const countries = new Set(businessList.map(b => b.country)).size;
        const industries = new Set(businessList.map(b => b.industry)).size;
        const verified = businessList.filter(b => b.verified).length;
        setStats({ total: businessList.length, countries, industries, verified });
        setLoading(false);
      } catch (error) {
        console.error("Error loading stats:", error);
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const items = [
    { icon: Building2, label: "Listed Businesses", value: stats.total, color: "text-[#00c4cc]" },
    { icon: Globe, label: "Countries Represented", value: stats.countries, color: "text-[#c9a84c]" },
    { icon: LayoutGrid, label: "Industry Categories", value: stats.industries, color: "text-[#00c4cc]" },
    { icon: CheckCircle, label: "Verified Records", value: stats.verified, color: "text-[#c9a84c]" },
  ];

  return (
    <div className="bg-[#0a1628] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <item.icon className={`w-5 h-5 flex-shrink-0 ${item.color}`} />
              <div>
                <div className={`text-2xl font-bold ${item.color}`}>
                  {loading ? <span className="inline-block w-8 h-6 bg-white/10 rounded animate-pulse" /> : item.value.toLocaleString()}
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-wide">{item.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}