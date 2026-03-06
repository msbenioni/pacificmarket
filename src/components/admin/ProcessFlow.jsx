import { useState } from "react";
import { CheckCircle, Users, Building2, Shield, Star, Globe, ArrowRight, ChevronDown, ChevronUp, Info, AlertCircle, Zap } from "lucide-react";

const STEPS = [
  {
    id: "discovery",
    phase: "Discovery",
    actor: "Business",
    color: "bg-sky-500",
    borderColor: "border-sky-200",
    bgColor: "bg-sky-50",
    textColor: "text-sky-700",
    icon: Globe,
    title: "Business Discovers Registry",
    description: "A Pacific business owner or member of the public finds the Pacific Market via search, social media, or word of mouth.",
    actions: [
      "Lands on Home page",
      "Browses the Registry page",
      "Views individual Business Profiles",
    ],
    adminNote: null,
    page: "Home / Registry",
  },
  {
    id: "submit",
    phase: "Submission",
    actor: "Business",
    color: "bg-indigo-500",
    borderColor: "border-indigo-200",
    bgColor: "bg-indigo-50",
    textColor: "text-indigo-700",
    icon: Building2,
    title: "Business Owner Submits & Creates Account",
    description: "A business owner submits their business via the Apply Listing page and creates an account with email & password at the same time. By submitting, they automatically become the verified owner — no separate claim step needed. The listing is created with status: pending.",
    actions: [
      "Fills out Apply Listing form",
      "Creates account with email & password",
      "Submits — business saved as 'pending', owner automatically linked",
      "No tier selection at this stage — free by default",
    ],
    adminNote: null,
    page: "BusinessPortal", 
  },
  {
    id: "review",
    phase: "Admin Review",
    actor: "Admin",
    color: "bg-yellow-500",
    borderColor: "border-yellow-200",
    bgColor: "bg-yellow-50",
    textColor: "text-yellow-700",
    icon: Shield,
    title: "Admin Reviews Submission",
    description: "Admin reviews the pending listing in the dashboard. They can approve, reject, or edit the business details before it goes live.",
    actions: [
      "Views pending businesses in Admin Dashboard",
      "Edits details if needed",
      "Approves or Rejects",
    ],
    adminNote: "This is where you spend most of your time. The 'Pending' tab shows all awaiting review.",
    page: "AdminDashboard → Pending tab",
  },
  {
    id: "live",
    phase: "Live",
    actor: "System",
    color: "bg-green-500",
    borderColor: "border-green-200",
    bgColor: "bg-green-50",
    textColor: "text-green-700",
    icon: CheckCircle,
    title: "Business Goes Live on Registry",
    description: "Once approved, the business appears publicly in the Registry. The owner can now log in to the Business Portal to manage their listing.",
    actions: [
      "Business visible in Registry search",
      "Public Business Profile page accessible",
      "Owner logs into Business Portal to manage listing",
    ],
    adminNote: "You can still edit or remove approved listings from the 'Approved' tab.",
    page: "Registry / BusinessProfile",
  },
  {
    id: "upgrade",
    phase: "Self-Service",
    actor: "Business",
    color: "bg-violet-500",
    borderColor: "border-violet-200",
    bgColor: "bg-violet-50",
    textColor: "text-violet-700",
    icon: Zap,
    title: "Business Owner Upgrades Tier via Business Portal",
    description: "The business owner logs into their account and can upgrade from Free to Verified or Featured+ via the Business Portal. Tier upgrades unlock additional features like gallery images and product/service listings.",
    actions: [
      "Logs into account created during submission",
      "Upgrades tier (Free → Verified or Featured+)",
      "Featured+ unlocks gallery & products/services",
      "Edits and manages their business info",
    ],
    adminNote: "Admin can also manually change a business's tier or grant the Verified badge from the Approved tab.",
    page: "BusinessPortal",
  },
  {
    id: "claim",
    phase: "Claiming (Admin-Created Listings)",
    actor: "Business",
    color: "bg-blue-500",
    borderColor: "border-blue-200",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    icon: Users,
    title: "Owner Claims an Admin-Created Listing",
    description: "This only applies when a listing was created by Admin (not by the business owner). The business owner finds their listing in the Registry, clicks 'Claim this listing', and completes a form — creating an account with email & password in the process. This sends a claim request to admin for review.",
    actions: [
      "Owner finds their listing on the Registry / Business Profile",
      "Clicks 'Claim this listing'",
      "Completes claim form & creates account (email & password)",
      "Claim request sent to admin — status: pending",
    ],
    adminNote: "Claim requests appear in the 'Claims' tab. Review and approve or deny each request. Approving links the user account to the business.",
    page: "BusinessProfile → AdminDashboard → Claims tab",
  },
  {
    id: "verify",
    phase: "Verification",
    actor: "Admin",
    color: "bg-teal-500",
    borderColor: "border-teal-200",
    bgColor: "bg-teal-50",
    textColor: "text-teal-700",
    icon: Star,
    title: "Admin Grants Verified Badge",
    description: "Admin can manually toggle the Verified badge on any approved listing at any time to signal authenticity and quality.",
    actions: [
      "Toggle Verified badge on any listing",
      "Manually adjust tier if needed (e.g. complimentary upgrade)",
      "Featured+ unlocks gallery & products for that business",
    ],
    adminNote: "Use the Verify button or Edit modal in the Approved tab.",
    page: "AdminDashboard → Approved tab",
  },
];

export default function ProcessFlow() {
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? STEPS : STEPS.filter(s => s.actor.toLowerCase() === filter);

  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div>
            <h2 className="font-bold text-[#0a1628] text-base">Business & Admin Journey</h2>
            <p className="text-xs text-gray-400 mt-0.5">Click any step to expand details. Click again to collapse.</p>
          </div>
          <div className="flex gap-2">
            {["all", "business", "admin", "system"].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium capitalize transition-all ${
                  filter === f ? "bg-[#0a1628] text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-xs">
          {[
            { label: "Business Action", color: "bg-sky-500" },
            { label: "Admin Action", color: "bg-yellow-500" },
            { label: "System", color: "bg-green-500" },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
              <span className="text-gray-500">{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Flow */}
      <div className="relative">
        {filtered.map((step, i) => {
          const Icon = step.icon;
          const isOpen = expanded === step.id;
          return (
            <div key={step.id}>
              <div
                onClick={() => setExpanded(isOpen ? null : step.id)}
                className={`bg-white border rounded-2xl p-5 cursor-pointer transition-all hover:shadow-md ${
                  isOpen ? `${step.borderColor} shadow-md` : "border-gray-100"
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Step number + icon */}
                  <div className={`w-11 h-11 rounded-2xl ${step.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${step.bgColor} ${step.textColor}`}>
                        {step.phase}
                      </span>
                      <span className="text-xs text-gray-400">·</span>
                      <span className="text-xs text-gray-400">{step.actor}</span>
                    </div>
                    <h3 className="font-bold text-[#0a1628] text-sm mt-1">{step.title}</h3>
                    {!isOpen && <p className="text-xs text-gray-400 mt-0.5 truncate">{step.description}</p>}
                  </div>
                  {/* Page badge */}
                  <div className="hidden sm:block flex-shrink-0 text-right">
                    <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-lg font-mono">{step.page}</span>
                  </div>
                  {/* Expand toggle */}
                  <div className="flex-shrink-0 text-gray-400">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {/* Expanded content */}
                {isOpen && (
                  <div className={`mt-4 pt-4 border-t ${step.borderColor}`}>
                    <p className="text-sm text-gray-600 mb-4">{step.description}</p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Actions at this step</p>
                        <ul className="space-y-1.5">
                          {step.actions.map((a, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                              <span className={`w-1.5 h-1.5 rounded-full ${step.color} mt-1.5 flex-shrink-0`} />
                              {a}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {step.adminNote && (
                        <div className={`${step.bgColor} rounded-xl p-4`}>
                          <div className="flex items-center gap-1.5 mb-2">
                            <Info className={`w-3.5 h-3.5 ${step.textColor}`} />
                            <span className={`text-xs font-semibold ${step.textColor}`}>Admin Note</span>
                          </div>
                          <p className={`text-xs ${step.textColor} leading-relaxed`}>{step.adminNote}</p>
                        </div>
                      )}
                    </div>
                    <div className="mt-3 sm:hidden">
                      <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-lg font-mono">Page: {step.page}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Arrow connector */}
              {i < filtered.length - 1 && (
                <div className="flex justify-center py-1">
                  <ArrowRight className="w-4 h-4 text-gray-300 rotate-90" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Gap callout */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-900 text-sm">Potential Gaps to Consider</p>
            <ul className="mt-2 space-y-1.5">
              {[
                "No automated email notification to business owner when their listing is approved or rejected.",
                "No status tracking page — owners who submitted can't see if their application is pending/approved without logging in.",
                "Tier upgrade payment flow (Verified / Featured+) needs to be connected — currently manual via admin or Customer Portal.",
                "The claim form (for admin-created listings) may need to be built out — owners need to create an account + submit evidence in one flow.",
              ].map((gap, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-amber-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                  {gap}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}