import Link from "next/link";
import { createPageUrl } from "@/utils";
import { ArrowRight, Mail, FileText, QrCode } from "lucide-react";

export default function ToolsHomepageSnippet() {
  const tools = [
    { icon: Mail, label: "Email signatures" },
    { icon: FileText, label: "Invoices" },
    { icon: QrCode, label: "QR codes" },
  ];

  return (
    <section className="py-12 sm:py-16 bg-white border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[28px] border border-gray-200 bg-gradient-to-r from-[#07101d] to-[#0a1628] p-6 sm:p-10 overflow-hidden relative">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-16 right-0 w-72 h-72 rounded-full bg-[#c9a84c]/15 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-[#00c4cc]/10 blur-3xl" />
          </div>

          <div className="relative grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#00c4cc] mb-3">
                Business tools
              </p>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                More than a listing
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-6 max-w-2xl">
                Pacific Discovery Network tools help businesses look more polished in the
                real world — from branded invoices and professional email
                signatures to QR codes for stalls, signage, packaging, and
                promotions.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <Link
                  href={createPageUrl("Tools")}
                  className="inline-flex items-center justify-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-[#0a1628] font-bold px-6 py-3 rounded-xl transition-all text-sm min-h-[44px]"
                >
                  Explore Tools <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href={createPageUrl("Pricing")}
                  className="inline-flex items-center justify-center gap-2 border border-[#00c4cc]/40 text-[#b3e5e5] hover:bg-[#00c4cc]/8 font-medium px-6 py-3 rounded-xl transition-all text-sm min-h-[44px]"
                >
                  View Pricing
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
              {tools.map((tool) => (
                <div
                  key={tool.label}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                    <tool.icon className="w-4 h-4 text-[#c9a84c]" />
                  </div>
                  <p className="text-sm font-medium text-white">{tool.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
