import { ChevronRight } from "lucide-react";
import { createPageUrl } from "@/utils";
import { Search, CheckCircle } from "lucide-react";

export default function HeroHomepage() {
  return (
    <section className="relative overflow-hidden min-h-[720px]">
      <div className="absolute inset-0">
        <img
          src="/hero.png"
          alt="Pacific Ocean horizon"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/18 via-black/0 to-black/0" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <div className="grid lg:grid-cols-12 gap-10 items-start lg:items-center">
          {/* Left: Title panel */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 bg-white/90 border border-white/40 rounded-full px-3 py-1.5 shadow-sm backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#00c4cc]" />
              <span className="text-xs font-semibold tracking-wider uppercase text-[#0d4f4f]">
                The First Global Registry of Pacific-Owned Enterprise
              </span>
            </div>

            <div className="mt-5 bg-[#0a1628]/62 backdrop-blur-md border border-white/10 rounded-2xl p-7 shadow-xl">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-[1.02]">
                The Economic Map of{" "}
                <span className="text-[#00c4cc]">Pacific-Owned</span>{" "}
                <span className="text-[#c9a84c]">Enterprise</span>
              </h1>

              <div className="mt-4 h-[3px] w-44 rounded-full bg-gradient-to-r from-[#00c4cc] via-[#c9a84c] to-transparent" />

              <p className="mt-4 text-base sm:text-lg text-white/90">
                A structured, verified registry of Pacific-owned businesses — built for communities, researchers, policymakers, and partners who need trusted data on Pacific enterprise globally.
              </p>
            </div>
          </div>

          {/* Right: Search Card */}
          <div className="lg:col-span-7">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-7 relative overflow-hidden">
              {/* watermark motif behind card (super subtle) */}
              <div className="absolute -right-10 -top-10 w-72 h-72 rounded-full bg-[#00c4cc]/10 blur-2xl" />
              <div className="absolute -left-10 -bottom-10 w-72 h-72 rounded-full bg-[#c9a84c]/10 blur-2xl" />

              <div className="relative">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Registry Search
                  </h2>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <CheckCircle className="w-4 h-4 text-[#00c4cc]" />
                    <span>Verified. Structured. Trusted.</span>
                  </div>
                </div>

                {/* Single search field */}
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by business name, keyword, country, or industry…"
                      className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3.5
                                 focus:outline-none focus:ring-2 focus:ring-[#00c4cc]
                                 text-[#0a1628] placeholder:text-slate-400"
                      suppressHydrationWarning
                    />
                  </div>

                  {/* Icon-only button */}
                  <a
                    href={createPageUrl("Registry")}
                    className="shrink-0 inline-flex items-center justify-center
                               w-12 h-12 rounded-xl
                               bg-[#00c4cc] hover:bg-[#00aab0]
                               text-[#0a1628] transition-all"
                    aria-label="Search registry"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
