"use client";

import { useState, useEffect } from "react";

export default function ClientOnlyFormWrapper({ children }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Return a placeholder with same structure to prevent layout shift
    return (
      <div className="space-y-5 max-w-6xl mx-auto">
        <div className="sticky top-0 z-20 rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur md:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0">
              <div className="h-8 bg-slate-200 rounded animate-pulse"></div>
              <div className="mt-3 h-4 bg-slate-100 rounded w-32 animate-pulse"></div>
            </div>
            <div className="flex gap-3">
              <div className="h-11 w-20 bg-slate-100 rounded-xl animate-pulse"></div>
              <div className="h-11 w-32 bg-slate-700 rounded-xl animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <div className="flex min-w-max gap-2 pb-1">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="h-10 w-24 bg-slate-100 rounded-full animate-pulse"></div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-5">
            <div className="h-6 bg-slate-200 rounded w-48 animate-pulse mb-2"></div>
            <div className="h-4 bg-slate-100 rounded w-64 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-slate-200 rounded w-24 animate-pulse"></div>
                <div className="h-12 bg-slate-100 rounded-xl animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
