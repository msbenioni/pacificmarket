import Image from "next/image";
import Link from "next/link";
import { createPageUrl } from "@/utils";
import {
  ArrowRight,
  CheckCircle,
  Mail,
  FileText,
  QrCode,
  Sparkles,
  Shield,
  Briefcase,
} from "lucide-react";

export default function Tools() {
  const tools = [
    {
      title: "Email Signature Generator",
      description:
        "Create polished branded signatures for founders, staff, collaborators, and client-facing communication.",
      benefit:
        "Turn everyday emails into a more professional and consistent brand touchpoint.",
      icon: Mail,
      image: "/Email_Sig_Gen.png",
      alt: "Pacific Market Email Signature Generator preview",
    },
    {
      title: "Invoice Generator",
      description:
        "Create branded invoices with business details, colours, logos, payment information, and flexible notes.",
      benefit:
        "Send invoices that look clearer, stronger, and more aligned with your business identity.",
      icon: FileText,
      image: "/Invoice_Gen.png",
      alt: "Pacific Market Invoice Generator preview",
    },
    {
      title: "QR Code Generator",
      description:
        "Generate downloadable QR codes for your profile, website, campaign, packaging, stall signage, or promotional material.",
      benefit:
        "Help people reach your business faster with a simple scan.",
      icon: QrCode,
      image: "/QR_Code.png",
      alt: "Pacific Market QR Code Generator preview",
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

  return (
    <div className="bg-[#f8f9fc]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#07101d]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-20 w-[28rem] h-[28rem] rounded-full bg-[#c9a84c]/15 blur-3xl" />
          <div className="absolute top-1/2 -left-24 w-[24rem] h-[24rem] rounded-full bg-[#00c4cc]/10 blur-3xl" />
        </div>

        <div className="relative px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto py-14 sm:py-20 lg:py-24">
            <div className="max-w-4xl">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-[#00c9cc]">
              Pacific Market Tools
            </span>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-[1.05] text-white max-w-5xl">
                Business Tools That Help You
                <span className="block text-[#c9a84c] mt-1">
                  Show Up Professionally
                </span>
              </h1>

              <div className="w-28 h-1 rounded-full bg-gradient-to-r from-[#c9a84c] via-[#00c4cc] to-transparent mt-6 mb-6" />

              <p className="text-sm sm:text-lg text-slate-300 leading-6 sm:leading-relaxed max-w-3xl">
                Pacific Market gives businesses more than visibility. Our built-in
                tools help you create polished invoices, branded email signatures,
                and QR codes that make it easier for customers to find, trust, and
                remember your business.
              </p>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 sm:px-5 sm:py-4 max-w-2xl">
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  <span className="text-[#c9a84c] font-semibold">
                    Included with Moana:
                  </span>{" "}
                  practical tools designed to help your business look polished,
                  organised, and ready.
                </p>
              </div>

              <div className="mt-6 sm:mt-8 flex flex-wrap gap-3">
                {["Professional", "Practical", "Built for visibility"].map((chip) => (
                  <span
                    key={chip}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/10 bg-white/5 text-xs sm:text-sm text-slate-200"
                  >
                    {chip}
                  </span>
                ))}
              </div>

              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href={createPageUrl("Pricing")}
                  className="inline-flex items-center justify-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-[#0a1628] font-bold px-6 py-3 sm:px-8 sm:py-4 rounded-xl transition-all text-sm shadow-[0_12px_30px_rgba(201,168,76,0.25)] w-full sm:w-auto min-h-[44px]"
                >
                  View Pricing <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href={createPageUrl("BusinessLogin") + "?mode=signup"}
                  className="inline-flex items-center justify-center gap-2 border border-[#00c4cc]/40 text-[#b3e5e5] hover:bg-[#00c4cc]/8 font-medium px-6 py-3 sm:px-8 sm:py-4 rounded-xl transition-all text-sm w-full sm:w-auto min-h-[44px]"
                >
                  List My Business
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools showcase */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#0d4f4f] mb-3 block">
            Public demo preview
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0a1628] mb-4">
            Built to make everyday business tasks look better
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
                  <div className="relative aspect-[16/10] w-full">
                    <Image
                      src={tool.image}
                      alt={tool.alt}
                      fill
                      className="object-cover object-top"
                    />
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
                turn your Pacific Market presence into something practical,
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
