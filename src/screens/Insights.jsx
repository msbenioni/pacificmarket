import { useState, useEffect } from "react";
import { pacificMarket } from "@/lib/pacificMarketClient";
import { Building2, Users, ShieldCheck, Globe } from "lucide-react";
import { BUSINESS_STATUS } from "@/constants/business";
import HeroRegistry from "../components/shared/HeroRegistry";
import HorizontalBar from "../components/insights/HorizontalBar";

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

const UI = {
  page: "bg-[#eef0f5]",
  wrap: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8",
  card:
    "rounded-2xl border border-gray-200/70 bg-gradient-to-b from-white to-[#fbfcff] shadow-[0_18px_50px_rgba(10,22,40,0.08)]",
  cardInner: "p-6",
  sectionKicker: "text-xs font-bold tracking-[0.22em] uppercase text-[#0a1628]/50",
  sectionTitle: "text-lg font-semibold text-[#0a1628]",
  sectionDesc: "text-sm text-[#0a1628]/60 mt-1",
  chip: "px-3 py-1 rounded-full border border-gray-200 bg-white text-sm text-[#0a1628]/80",
  chipStrong: "text-[#0a1628] font-semibold",
};

export default function Insights() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    pacificMarket.entities.Business.filter({ status: BUSINESS_STATUS.ACTIVE }).then(data => {
      setBusinesses(data);
      setLoading(false);
    });
  }, []);

  const total = businesses.length;
  const verified = businesses.filter(b => b.verified).length;
  const countries = new Set(businesses.map(b => b.country).filter(Boolean)).size;
  const identityMap = {};
  const identitySet = new Set();
  businesses.forEach(b => {
    if (!b.cultural_identity) return;
    const identities = String(b.cultural_identity)
      .split(",")
      .map(identity => identity.trim())
      .filter(Boolean);
    identities.forEach(identity => {
      identitySet.add(identity);
      identityMap[identity] = (identityMap[identity] || 0) + 1;
    });
  });
  const identities = identitySet.size;

  const byCountry = tally(businesses, "country");
  const byCategory = tally(businesses, "industry");
  const byIdentity = Object.entries(identityMap)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);

  // Parse languages_spoken (comma-separated) and tally
  const languageMap = {};
  businesses.forEach(b => {
    if (!b.languages_spoken) return;
    
    let languages = [];
    if (typeof b.languages_spoken === 'string') {
      languages = b.languages_spoken.split(',').map(lang => lang.trim()).filter(Boolean);
    } else if (Array.isArray(b.languages_spoken)) {
      languages = b.languages_spoken.map(lang => String(lang).trim()).filter(Boolean);
    }
    
    languages.forEach(lang => {
      languageMap[lang] = (languageMap[lang] || 0) + 1;
    });
  });
  const byLanguages = Object.entries(languageMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Top 10 languages

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

  const lastTwoMonths = monthlyData.slice(-2);
  const lastMonth = lastTwoMonths[0]?.count ?? 0;
  const thisMonth = lastTwoMonths[1]?.count ?? 0;
  const momDelta = thisMonth - lastMonth;
  const momPct = lastMonth > 0 ? Math.round((momDelta / lastMonth) * 100) : null;
  const topCountry = byCountry[0];
  const topIdentity = byIdentity[0];
  const maxMonth = monthlyData.reduce(
    (best, cur) => (cur.count > (best?.count ?? -1) ? cur : best),
    null
  );

  return (
    <div className={`min-h-screen ${UI.page}`}>
      <HeroRegistry
        badge="Pacific Market"
        title="Economic Map"
        subtitle=""
        description="Pacific Market is building the first structured global registry of Pacific-owned enterprise. This data helps communities understand representation, researchers track entrepreneurial growth, governments identify support gaps, and partners discover Pacific businesses."
        showStats={false}
      />

      <div className={UI.wrap}>
        <p className="text-xs text-[#0a1628]/55 -mt-4">
          <span className="font-semibold text-[#0a1628]">Scope:</span> Approved & active listings only • Updated in real time • <span className="italic">We are not just listing businesses — we are mapping Pacific economic participation.</span>
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#0d4f4f] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-[#0a1628]/60 mt-2">
              {momPct !== null
                ? `Growth this month: ${momDelta >= 0 ? "+" : ""}${momDelta} (${momPct}%)`
                : `Growth this month: ${momDelta >= 0 ? "+" : ""}${momDelta}`}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className={`${UI.card} ${UI.cardInner}`}>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[#0a1628]/55">Enterprises on the map</p>
                  <Building2 className="w-4 h-4 text-[#00c4cc]" />
                </div>
                <p className="text-3xl font-semibold mt-2 text-[#0a1628]">{total}</p>
                <p className="text-sm text-[#0a1628]/60 mt-2">
                  {momPct !== null
                    ? `Growth this month: ${momDelta >= 0 ? "+" : ""}${momDelta} (${momPct}%)`
                    : `Growth this month: ${momDelta >= 0 ? "+" : ""}${momDelta}`}
                </p>
              </div>

              <div className={`${UI.card} ${UI.cardInner}`}>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[#0a1628]/55">Countries with Pacific enterprise</p>
                  <Globe className="w-4 h-4 text-[#00c4cc]" />
                </div>
                <p className="text-3xl font-semibold mt-2 text-[#0a1628]">{countries}</p>
                <p className="text-sm text-[#0a1628]/60 mt-2">
                  {topCountry ? `Most represented: ${topCountry.label} (${topCountry.value})` : "—"}
                </p>
              </div>

              <div className={`${UI.card} ${UI.cardInner}`}>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[#0a1628]/55">Verified enterprises</p>
                  <ShieldCheck className="w-4 h-4 text-[#c9a84c]" />
                </div>
                <p className="text-3xl font-semibold mt-2 text-[#0a1628]">{verified}</p>
                <p className="text-sm text-[#0a1628]/60 mt-2">
                  {verified === 0 ? "Verification is rolling out" : "Verified & active"}
                </p>
              </div>

              <div className={`${UI.card} ${UI.cardInner}`}>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[#0a1628]/55">Distinct cultural identities</p>
                  <Users className="w-4 h-4 text-[#00c4cc]" />
                </div>
                <p className="text-3xl font-semibold mt-2 text-[#0a1628]">{identities}</p>
                <p className="text-sm text-[#0a1628]/60 mt-2">
                  {topIdentity ? `Top identity: ${topIdentity.label} (${topIdentity.value})` : "—"}
                </p>
              </div>
            </div>

            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={UI.card}>
                <div className={UI.cardInner}>
                  <p className={UI.sectionKicker}>Geographic reach</p>
                  <h3 className={UI.sectionTitle}>Pacific enterprise by country</h3>
                  <p className={UI.sectionDesc}>Where Pacific-owned businesses are active — a geographic footprint of the diaspora economy.</p>
                </div>
                <div className="px-6 pb-6">
                  <HorizontalBar title="" data={byCountry} color="#00c4cc" maxHeight="360px" />
                </div>
              </div>

              <div className={UI.card}>
                <div className={UI.cardInner}>
                  <p className={UI.sectionKicker}>Cultural representation</p>
                  <h3 className={UI.sectionTitle}>Representation by cultural identity</h3>
                  <p className={UI.sectionDesc}>Self-identified cultural representation — evidence of which Pacific communities are participating in the formal economy.</p>
                </div>
                <div className="px-6 pb-6">
                  <HorizontalBar title="" data={byIdentity} color="#c9a84c" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className={UI.card}>
                <div className={UI.cardInner}>
                  <p className={UI.sectionKicker}>Economic participation</p>
                  <h3 className={UI.sectionTitle}>Industry distribution</h3>
                  <p className={UI.sectionDesc}>Which sectors Pacific enterprise is operating in — useful for identifying growth areas, gaps, and investment opportunities.</p>
                </div>
                <div className="px-6 pb-6">
                  <HorizontalBar title="" data={byCategory} color="#00aab0" />
                </div>
              </div>
            </div>

            {byLanguages.length > 0 && (
              <div className={UI.card}>
                <div className={UI.cardInner}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className={UI.sectionKicker}>Language retention</p>
                      <h3 className={UI.sectionTitle}>Languages spoken across the registry</h3>
                      <p className={UI.sectionDesc}>Language data shows cultural retention inside Pacific enterprise — a signal of diasporic identity and a resource for culturally-aligned partnerships.</p>
                    </div>
                    <img src="/language_spoken.png" alt="Languages spoken" className="w-[60px] h-[60px]" />
                  </div>
                </div>

                <div className="px-6 pb-6 space-y-3">
                  {byLanguages.map((lang, idx) => {
                    const max = byLanguages[0]?.count ?? 1;
                    const pct = Math.round((lang.count / max) * 100);

                    return (
                      <div key={lang.name} className="rounded-xl border border-gray-200 bg-white px-4 py-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-[#0a1628]/5 text-[#0a1628] flex items-center justify-center text-sm font-semibold">
                              {idx + 1}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-[#0a1628] truncate">{lang.name}</p>
                              <div className="mt-2 h-2 rounded-full bg-[#0a1628]/10 overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{ width: `${pct}%`, background: idx % 2 === 0 ? "#00c4cc" : "#c9a84c" }}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-[#0a1628]">{lang.count}</p>
                            <p className="text-xs text-[#0a1628]/50">businesses</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        <div className={`${UI.card} p-6`}>
          <p className="text-sm text-[#0a1628]/70">
            <span className="font-semibold text-[#0a1628]">About this data:</span> These insights reflect <span className="font-semibold text-[#0a1628]">approved & active</span> listings in the Pacific Market — the first structured global dataset of Pacific-owned enterprise. Figures update in real time as new businesses are approved. For research access, bulk data exports, policy enquiries, or methodology questions, contact the registry team.
          </p>
        </div>
      </div>
    </div>
  );
}