import Image from "next/image";
import Link from "next/link";
import { createPageUrl } from "@/utils";
import {
  ArrowRight,
  Mail,
  FileText,
  QrCode,
  Sparkles,
  Shield,
  Briefcase,
} from "lucide-react";
import HeroStandard from "../components/shared/HeroStandard";

// Import demo data and real tool rendering logic
import { PDN_DEMO_DATA } from "@/constants/demoData";
import { generateSignatureHTML } from "@/utils/signatureGenerator";
import { InvoicePreview, calculateInvoiceTotals } from "@/utils/invoiceGenerator";
import { QRCodePreview } from "@/utils/qrCodeGenerator";

// Demo Components using real tool logic
function ToolDemoSignature() {
  const signatureData = {
    ...PDN_DEMO_DATA,
    template: "pacific", // Use PDN template
    include_logo: true,
    include_socials: true,
    include_badge: true,
    include_address: true,
    include_pronouns: false,
  };

  return (
    <div 
      dangerouslySetInnerHTML={{ __html: generateSignatureHTML(signatureData) }}
    />
  );
}

function ToolDemoInvoice() {
  const invoiceData = {
    ...PDN_DEMO_DATA.invoice,
    brand_primary: PDN_DEMO_DATA.brand_primary,
    brand_accent: PDN_DEMO_DATA.brand_accent,
  };
  
  const calculations = calculateInvoiceTotals(invoiceData);

  return <InvoicePreview invoice={invoiceData} calculations={calculations} />;
}

function ToolDemoQR() {
  return (
    <QRCodePreview 
      url={PDN_DEMO_DATA.qr.url}
      label={PDN_DEMO_DATA.qr.label}
      size={PDN_DEMO_DATA.qr.size}
      useCases={PDN_DEMO_DATA.qr.use_cases}
    />
  );
}

export default function Tools() {
  const tools = [
    {
      title: "Email Signature Generator",
      description:
        "Create polished branded signatures for founders, staff, collaborators, and client-facing communication.",
      benefit:
        "Turn everyday emails into a more professional and consistent brand touchpoint.",
      icon: Mail,
      demoType: "signature",
      demoData: PDN_DEMO_DATA,
    },
    {
      title: "Invoice Generator",
      description:
        "Create branded invoices with business details, colours, logos, payment information, and flexible notes.",
      benefit:
        "Send invoices that look clearer, stronger, and more aligned with your business identity.",
      icon: FileText,
      demoType: "invoice",
      demoData: PDN_DEMO_DATA.invoice,
    },
    {
      title: "QR Code Generator",
      description:
        "Generate downloadable QR codes for your profile, website, campaign, packaging, stall signage, or promotional material.",
      benefit: "Help people reach your business faster with a simple scan.",
      icon: QrCode,
      demoType: "qr",
      demoData: PDN_DEMO_DATA.qr,
    },
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Look more credible",
      description:
        "Professional presentation helps customers, partners, and communities feel more confidence in your business.",
    },
    {
      icon: Briefcase,
      title: "Save time on business admin",
      description:
        "Built-in tools reduce friction and make it easier to create polished materials without starting from scratch.",
    },
    {
      icon: Sparkles,
      title: "Stay visually consistent",
      description:
        "From emails to invoices to QR codes, your business can show up with greater clarity and cohesion.",
    },
  ];

  const renderDemo = (tool) => {
    switch (tool.demoType) {
      case "signature":
        return <ToolDemoSignature />;
      case "invoice":
        return <ToolDemoInvoice />;
      case "qr":
        return <ToolDemoQR />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#f8f9fc]">
      <HeroStandard
        badge="Pacific Discovery Network Tools"
        title="Business tools designed to help you show up professionally."
        subtitle=""
        description="Pacific Discovery Network includes practical tools that help businesses look more polished, consistent, and ready across communication, billing, and visibility."
        actions={
          <>
            <Link
              href={createPageUrl("Pricing")}
              className="inline-flex items-center justify-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-[#0a1628] font-bold px-6 py-3 rounded-xl transition-all text-sm min-h-[44px]"
            >
              View Pricing <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href={createPageUrl("BusinessLogin") + "?mode=signup"}
              className="inline-flex items-center justify-center gap-2 border border-white/20 bg-white/10 hover:bg-white/15 text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm min-h-[44px]"
            >
              Join the Network
            </Link>
          </>
        }
      />

      {/* Tools showcase */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#0d4f4f] mb-3 block">
            Real tool outputs
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0a1628] mb-4">
            See exactly what you can create with these tools
          </h2>
          <p className="text-sm sm:text-base text-gray-500 max-w-3xl mx-auto leading-6">
            These tools are designed to help businesses present themselves more
            clearly and professionally across communication, billing, and
            discoverability.
          </p>
        </div>

        <div className="space-y-8 sm:space-y-10">
          {tools.map((tool, index) => (
            <div
              key={tool.title}
              className="grid lg:grid-cols-[0.95fr_1.05fr] gap-6 lg:gap-10 items-center bg-white border border-gray-200 rounded-[28px] p-5 sm:p-7 shadow-[0_16px_50px_rgba(10,22,40,0.06)]"
            >
              <div className={`${index % 2 === 1 ? "lg:order-2" : ""}`}>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-[#0a1628] to-[#07101d] flex items-center justify-center mb-4">
                  <tool.icon className="w-5 h-5 text-[#c9a84c]" />
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-[#0a1628] mb-3">
                  {tool.title}
                </h3>

                <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
                  {tool.description}
                </p>

                <div className="rounded-2xl border border-[#0d4f4f]/10 bg-[#0d4f4f]/5 p-4">
                  <p className="text-sm text-[#0a1628] leading-relaxed">
                    <span className="font-semibold">Why it matters:</span>{" "}
                    {tool.benefit}
                  </p>
                </div>
              </div>

              <div className={`${index % 2 === 1 ? "lg:order-1" : ""}`}>
                <div className="relative rounded-[24px] overflow-hidden border border-gray-200 bg-white shadow-[0_20px_50px_rgba(10,22,40,0.08)]">
                  <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-xs text-gray-500 ml-2">Live preview</span>
                    </div>
                  </div>
                  <div className="p-4 bg-white">
                    {renderDemo(tool)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Benefit section */}
      <section className="py-12 sm:py-20 bg-white border-y border-gray-200/70">
        <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#0d4f4f] mb-3 block">
              Why these tools matter
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0a1628] mb-4">
              Small details shape how a business is perceived
            </h2>
            <p className="text-sm sm:text-base text-gray-500 max-w-3xl mx-auto leading-6">
              Good presentation is not just aesthetic. It can influence trust,
              clarity, confidence, and whether a customer feels your business is
              organised and ready.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {benefits.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-gray-200 bg-[#fbfcff] p-5 sm:p-6 shadow-[0_12px_40px_rgba(10,22,40,0.06)]"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-b from-[#0a1628] to-[#07101d] flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-[#00c4cc]" />
                </div>
                <h3 className="text-sm font-bold text-[#0a1628] mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Moana section */}
      <section className="py-12 sm:py-20 bg-[#f8f9fc]">
        <div className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="rounded-[28px] border border-[#c9a84c]/20 bg-gradient-to-r from-[#fffaf0] via-white to-[#f6fffe] p-6 sm:p-10 shadow-[0_16px_50px_rgba(10,22,40,0.06)]">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#0d4f4f] mb-3">
                Included in Moana
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0a1628] mb-4">
                More than visibility. Tools you can actually use.
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-3xl mx-auto">
                The Moana plan is built for businesses that want stronger
                presentation as well as stronger visibility. These tools help
                turn your Pacific Discovery Network presence into something practical,
                professional, and useful across real business moments.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={createPageUrl("Pricing")}
                  className="inline-flex items-center justify-center gap-2 bg-[#0a1628] hover:bg-[#122040] text-white font-bold px-6 py-3 sm:px-8 sm:py-4 rounded-xl transition-all text-sm w-full sm:w-auto min-h-[44px]"
                >
                  View Pricing <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href={createPageUrl("BusinessLogin") + "?mode=signup"}
                  className="inline-flex items-center justify-center gap-2 border border-[#0d4f4f]/20 text-[#0d4f4f] hover:bg-[#0d4f4f]/5 font-semibold px-6 py-3 sm:px-8 sm:py-4 rounded-xl transition-all text-sm w-full sm:w-auto min-h-[44px]"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
