import Link from "next/link";
import { createPageUrl } from "@/utils";
import { Shield, Globe, CheckCircle, BookOpen, Users, ArrowRight, FileText, Search, Award } from "lucide-react";
import WaveStrip from "../components/home/WaveStrip";
import HeroRegistry from "../components/shared/HeroRegistry";

export default function About() {
  const steps = [
    { icon: FileText, title: "Application Submitted", desc: "Business owner completes a structured application with cultural identity, ownership details, and proof documents.", step: "01" },
    { icon: Search, title: "Admin Review", desc: "Registry administrators review the application against our data quality standards and cultural integrity guidelines.", step: "02" },
    { icon: Shield, title: "Verification Process", desc: "For Verified tier, additional identity and business legitimacy checks are conducted by the governance team.", step: "03" },
    { icon: Award, title: "Record Activated", desc: "Approved businesses are published to the registry with their appropriate tier, verification status, and registry metadata.", step: "04" },
  ];

  return (
    <div className="bg-[#f8f9fc]">
      {/* Hero */}
      <HeroRegistry
        badge="About"
        title="A Registry Built on Data Integrity & Cultural Pride"
        subtitle=""
        description="Pacific Market Registry exists to create a structured, authoritative record of Pacific-owned businesses — preserving cultural identity through rigorous data governance."
      />

      {/* Mission */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#0d4f4f] mb-3 block">Our Mission</span>
              <h2 className="text-3xl font-bold text-[#0a1628] mb-6">Why Data Integrity Matters for Pacific Business</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Pacific-owned businesses have long been undercounted, misclassified, and invisible in global data systems. This registry changes that.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                By applying structured data standards — the same standards used by government registries and financial institutions — we create a foundation for Pacific businesses to be discovered, funded, and recognised on the world stage.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Cultural identity is not an afterthought. It is core data. Every record in this registry captures the Pacific heritage, languages, and community ties that make these businesses part of something larger than commerce.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Shield, title: "Governance Framework", desc: "Data standards aligned with international business registry practices.", color: "text-[#00c4cc]" },
                { icon: Globe, title: "Global Visibility", desc: "Pacific businesses discoverable by investors and partners worldwide.", color: "text-[#c9a84c]" },
                { icon: Users, title: "Community Owned", desc: "Built by Pacific people, for Pacific people and their allies.", color: "text-[#00c4cc]" },
                { icon: BookOpen, title: "Living Record", desc: "Continuously updated, verified, and maintained by our governance team.", color: "text-[#c9a84c]" },
              ].map((item, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-md hover:shadow-xl transition-all group">
                  <div className="w-11 h-11 rounded-xl bg-[#0a1628] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <h3 className="font-bold text-[#0a1628] text-sm mb-1">{item.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Wave Strip */}
      <WaveStrip />

      {/* Verification Process */}
      <section className="py-16 bg-white border-y border-gray-100 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#0d4f4f] mb-3 block">Process</span>
            <h2 className="text-3xl font-bold text-[#0a1628] mb-4">How Verification Works</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm">A rigorous, human-reviewed process ensures every record in the registry meets our data quality and cultural integrity standards.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#0a1628] flex items-center justify-center flex-shrink-0">
                      <step.icon className="w-5 h-5 text-[#00c4cc]" />
                    </div>
                    <span className="text-3xl font-black text-gray-200">{step.step}</span>
                  </div>
                  <h3 className="font-bold text-[#0a1628] text-sm mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#0a1628] mb-4">Ready to Register Your Business?</h2>
          <p className="text-gray-500 mb-8">Join the growing registry of Pacific-owned businesses and ensure your business is part of the permanent record.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={createPageUrl("ApplyListing")} className="inline-flex items-center gap-2 bg-[#0a1628] text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-[#122040]">
              Submit a Business <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href={createPageUrl("Registry")} className="inline-flex items-center justify-center gap-2 border border-[#0a1628] text-[#0a1628] font-semibold px-8 py-4 rounded-xl hover:bg-[#0a1628]/5 transition-all text-sm">
              Explore the Registry
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}