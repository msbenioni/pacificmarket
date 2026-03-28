import { PresentationDeck } from "@/lib/presentations/types";

export const internalFounderAlignmentDeck: PresentationDeck = {
  slug: "internal-founder-alignment",
  title: "Internal Founder Alignment",
  description: "Internal strategy deck for founder and co-founder alignment at Pacific Discovery Network.",
  audience: "Internal",
  status: "live",
  theme: "pdn-investor",
  createdAt: "2026-03-19",
  updatedAt: "2026-03-19",
  slides: [
    {
      id: "cover",
      type: "cover",
      title: "Pacific Discovery Network",
      subtitle: "Founder Alignment & Strategic Growth Plan",
      tagline: "Aligning vision, execution, and the path to 1,000 paying subscribers",
      statusBadge: "Internal Strategy Deck",
      contact: "Internal Use Only",
      footer: "Founder Alignment Deck · March 2026",
    },

    {
      id: "why-we-exist",
      type: "bullets",
      eyebrow: "Why We Exist",
      title: "Pacific Discovery Network exists to make Pacific businesses visible, trusted, and discoverable",
      subtitle:
        "We are building infrastructure, not just a directory. Our role is to help Pacific-owned businesses be found, understood, and supported across local and global markets.",
      bullets: [
        "Increase discoverability for Pacific-owned businesses",
        "Create trusted, structured business visibility across regions",
        "Make it easier for customers, partners, importers, and communities to find Pacific businesses",
        "Build a long-term Pacific business intelligence layer that does not currently exist",
        "Support Pacific producers, service businesses, and founders with practical digital infrastructure",
      ],
      closingLine:
        "We are not only listing businesses. We are building the discovery and data infrastructure Pacific business has been missing.",
    },

    {
      id: "vision",
      type: "bullets",
      eyebrow: "Vision",
      title: "Our long-term vision",
      subtitle:
        "Pacific Discovery Network becomes the trusted platform where Pacific businesses are discovered globally and where Pacific business ecosystem intelligence becomes structured and actionable.",
      bullets: [
        "The default discovery platform for Pacific-owned businesses",
        "A trusted ecosystem data hub for Pacific business visibility and insight",
        "A bridge between Pacific businesses and global buyers, partners, and opportunities",
        "A platform that strengthens Pacific economic participation, trade, and recognition",
        "A business infrastructure layer that can serve communities, institutions, and partners over time",
      ],
      closingLine:
        "The long-term opportunity is bigger than subscriptions. Subscriptions fund the infrastructure.",
    },

    {
      id: "mission",
      type: "three-column",
      eyebrow: "Mission",
      title: "Our mission in practical terms",
      subtitle:
        "Our mission needs to be clear enough to guide decisions, product scope, and growth priorities.",
      columns: [
        {
          title: "For businesses",
          items: [
            "Help Pacific businesses get discovered",
            "Improve digital credibility and trust",
            "Provide practical visibility tools",
            "Make online presence easier and more affordable",
          ],
        },
        {
          title: "For the ecosystem",
          items: [
            "Capture structured Pacific business data",
            "Highlight underrepresented business activity",
            "Support collaboration and opportunity flow",
            "Create clearer ecosystem intelligence over time",
          ],
        },
        {
          title: "For markets",
          items: [
            "Connect buyers to Pacific products and services",
            "Improve visibility for export-ready businesses",
            "Surface trade opportunities",
            "Showcase Pacific capability globally",
          ],
        },
      ],
      closingLine:
        "Our mission must always serve both sides: business visibility today and ecosystem intelligence over time.",
    },

    {
      id: "our-core-goal",
      type: "stats",
      eyebrow: "Primary Goal",
      title: "The current company goal is 1,000 paying subscribers",
      subtitle:
        "This is the clearest short-to-mid-term milestone because it validates market demand, recurring revenue, and product usefulness.",
      stats: [
        { label: "Primary Target", value: "1,000 paid subscribers" },
        { label: "Target Paid Mix", value: "60% Mana / 40% Moana" },
        { label: "Approx. MRR at 1,000", value: "$14.59K" },
      ],
      bullets: [
        "1,000 paying subscribers proves this is a real market, not just a meaningful idea",
        "It creates recurring revenue that can fund growth, support, and product improvements",
        "It gives us real user behavior data to improve retention and expansion",
        "It helps position the business for partnerships, grants, and investment conversations",
      ],
      closingLine:
        "Before we chase everything else, we must prove repeatable paid adoption.",
    },

    {
      id: "what-success-looks-like",
      type: "table",
      eyebrow: "Success Definition",
      title: "How we define success over the next phase",
      subtitle:
        "We need shared measures so we do not confuse activity with progress.",
      table: {
        headers: ["Area", "What Success Looks Like"],
        rows: [
          ["Paid Growth", "1,000 paying subscribers"],
          ["Revenue", "Consistent recurring monthly revenue growth"],
          ["Acquisition", "Repeatable channels that convert"],
          ["Retention", "Businesses stay because value is clear"],
          ["Trust", "Strong profile quality and credible business presence"],
          ["Market Position", "Recognized as the Pacific business discovery platform"],
        ],
      },
      bullets: [
        "Growth without retention is weak growth",
        "Traffic without subscriptions is incomplete progress",
        "Profiles without quality or trust reduce platform value",
        "Every growth effort should support both revenue and platform credibility",
      ],
      closingLine:
        "Success is not just more users. Success is paid growth, retained value, and clear market positioning.",
    },

    {
      id: "problem-we-are-solving",
      type: "bullets",
      eyebrow: "Problem Focus",
      title: "The real problem we are solving",
      bullets: [
        "Pacific businesses are hard to find in one trusted place",
        "Many rely on fragmented social media or word-of-mouth",
        "There is no strong Pacific-first discovery platform at scale",
        "Pacific business data is inconsistent, incomplete, or missing entirely",
        "Importers, collaborators, and supporters cannot easily discover relevant Pacific businesses",
        "Businesses need visibility and credibility, not just another profile page online",
      ],
      closingLine:
        "Our product must solve discoverability, trust, and structured visibility better than generic platforms do.",
    },

    {
      id: "who-we-serve-first",
      type: "three-column",
      eyebrow: "Target Market",
      title: "Who we serve first and why",
      subtitle:
        "We need to focus on the best initial customer groups instead of trying to serve everyone at once.",
      columns: [
        {
          title: "Primary",
          items: [
            "Pacific-owned small businesses in New Zealand",
            "Founders needing better visibility",
            "Businesses with limited digital presence",
            "Businesses wanting credibility and discoverability",
          ],
        },
        {
          title: "Secondary",
          items: [
            "Pacific-owned businesses in Australia",
            "French Pacific businesses and producers",
            "Emerging service businesses",
            "Export-ready product businesses",
          ],
        },
        {
          title: "Ecosystem users",
          items: [
            "Buyers and importers",
            "Partners and collaborators",
            "Community organisations",
            "Researchers, investors, and institutions over time",
          ],
        },
      ],
      closingLine:
        "The first growth engine should focus on businesses who immediately benefit from more visibility and trust.",
    },

    {
      id: "value-proposition",
      type: "three-column",
      eyebrow: "Value Proposition",
      title: "Why a business should pay us",
      subtitle:
        "If we cannot explain the paid value clearly, we will struggle to convert beyond goodwill and community support.",
      columns: [
        {
          title: "Visibility",
          items: [
            "Be easier to find online",
            "Be found in a Pacific-first platform",
            "Appear more credible to customers and partners",
            "Improve discoverability beyond social media",
          ],
        },
        {
          title: "Trust",
          items: [
            "Professional public presence",
            "Verification-related trust signals",
            "Stronger business presentation",
            "Better first impression for customers",
          ],
        },
        {
          title: "Tools",
          items: [
            "Useful business support features",
            "Practical profile and document tools",
            "Affordable recurring access",
            "Clear pathway from Vaka to paid value",
          ],
        },
      ],
      closingLine:
        "People will not pay for a mission alone. They will pay for visibility, trust, and useful business outcomes.",
    },

    {
      id: "positioning",
      type: "bullets",
      eyebrow: "Positioning",
      title: "How we should position Pacific Discovery Network",
      subtitle:
        "Our positioning should be simple, differentiated, and repeatable across website copy, outreach, and partnerships.",
      bullets: [
        "Not just a directory — Pacific business discovery infrastructure",
        "Not just profiles — trusted visibility and ecosystem intelligence",
        "Not just local — built for regional and global discoverability",
        "Not just culture-led branding — practical commercial visibility",
        "Not just data collection — data that becomes useful for the ecosystem",
      ],
      closingLine:
        "The strongest positioning is where mission, business utility, and long-term infrastructure all connect.",
    },

    {
      id: "what-we-must-not-do",
      type: "bullets",
      eyebrow: "Strategic Discipline",
      title: "What we should not do right now",
      bullets: [
        "Do not overload the platform with too many features before paid conversion is proven",
        "Do not chase too many regions equally at the same time",
        "Do not rely only on awareness or goodwill without a strong paid value proposition",
        "Do not dilute the message with too many audiences at once",
        "Do not spend heavily on paid ads before landing page and offer conversion are strong",
        "Do not build institutional products before business adoption is validated",
      ],
      closingLine:
        "Focus is a growth advantage. The next stage is validation and repeatability, not platform sprawl.",
    },

    {
      id: "growth-strategy",
      type: "three-column",
      eyebrow: "Growth Strategy",
      title: "How we reach 1,000 paying subscribers",
      subtitle:
        "The fastest path is likely a trust-first model: direct outreach, partnerships, founder-led sales, and clear conversion offers.",
      columns: [
        {
          title: "Channel 1: Founder-led direct acquisition",
          items: [
            "Direct outreach to Pacific businesses",
            "Profile audits and improvement offers",
            "Manual onboarding support",
            "Founding member conversion campaigns",
          ],
        },
        {
          title: "Channel 2: Partnerships & communities",
          items: [
            "Pacific business groups",
            "Events and associations",
            "Community organisations",
            "Referral and ambassador pathways",
          ],
        },
        {
          title: "Channel 3: Content & platform discovery",
          items: [
            "SEO landing pages",
            "Business spotlight content",
            "Founder story and mission-led content",
            "Searchable public platform pages that convert",
          ],
        },
      ],
      closingLine:
        "The first 1,000 subscribers are more likely to be won through trust and relevance than through scale advertising.",
    },

    {
      id: "1000-subscriber-math",
      type: "table",
      eyebrow: "Growth Math",
      title: "A realistic way to think about 1,000 paying subscribers",
      subtitle:
        "Breaking the target into smaller numbers makes execution more concrete.",
      table: {
        headers: ["Pathway", "Illustrative Target"],
        rows: [
          ["12 months", "~84 paid subscribers per month"],
          ["10 months", "100 paid subscribers per month"],
          ["5 partner channels", "20 paid subscribers each per month"],
          ["10% close rate", "1,000 strong sales conversations for 100 conversions"],
        ],
      },
      bullets: [
        "We need a repeatable acquisition engine, not isolated wins",
        "Manual founder-led sales is acceptable early if it teaches us what converts",
        "Conversion improves when messaging, proof, and onboarding are tighter",
        "Retention matters because replacing churn slows everything down",
      ],
      closingLine:
        "The number becomes achievable when it is turned into weekly pipeline activity.",
    },

    {
      id: "offer-strategy",
      type: "tiers",
      eyebrow: "Offer Strategy",
      title: "Our offer needs to make upgrading feel obvious",
      subtitle:
        "The paid plan structure should make the business case easy to understand, especially for small businesses.",
      tiers: [
        {
          name: "Free",
          price: "$0",
          features: [
            "Basic platform presence",
            "Introductory visibility",
            "Low-friction entry point",
          ],
        },
        {
          name: "Mana",
          price: "$4.99/month",
          features: [
            "Clear step-up from free",
            "Better public presentation",
            "Useful business tools",
            "Entry-level paid conversion offer",
          ],
        },
        {
          name: "Moana",
          price: "$29/month",
          features: [
            "Stronger visibility and premium value",
            "Higher-trust public presence",
            "Advanced tools and functionality",
            "Best fit for serious businesses",
          ],
        },
      ],
      futureRevenue: [
        "Founding member campaigns",
        "Annual payment options",
        "Limited-time onboarding offers",
        "Partner bundle offers",
        "Premium placements later",
      ],
      closingLine:
        "To reach 1,000 paid subscribers, the offer must feel practical, affordable, and valuable immediately.",
    },

    {
      id: "retention-strategy",
      type: "bullets",
      eyebrow: "Retention",
      title: "Keeping subscribers matters as much as getting them",
      bullets: [
        "Businesses need to feel visible, supported, and represented well",
        "The onboarding process must help them reach value quickly",
        "The profile quality and presentation must feel worth paying for",
        "Regular touchpoints, updates, and practical wins improve retention",
        "We need to show businesses why staying on the platform continues to matter",
      ],
      closingLine:
        "Retention is where subscriptions become a business instead of a short-term campaign.",
    },

    {
      id: "operating-priorities",
      type: "three-column",
      eyebrow: "Operating Priorities",
      title: "What we should prioritise over the next 90 days",
      subtitle:
        "The next phase should focus on growth-enabling work, not broad expansion.",
      columns: [
        {
          title: "Priority 1: Conversion",
          items: [
            "Tighten homepage and landing page messaging",
            "Clarify Vaka vs Mana vs Moana value",
            "Improve upgrade prompts and CTAs",
            "Create a founding member offer",
          ],
        },
        {
          title: "Priority 2: Acquisition",
          items: [
            "Build outreach lists",
            "Run direct founder-led onboarding",
            "Form early community partnerships",
            "Create referral pathways",
          ],
        },
        {
          title: "Priority 3: Retention",
          items: [
            "Improve onboarding flow",
            "Improve profile quality standards",
            "Create value reinforcement touchpoints",
            "Track churn reasons and upgrade blockers",
          ],
        },
      ],
      closingLine:
        "The next 90 days should be built around conversion, acquisition, and retention only.",
    },

    {
      id: "founder-alignment",
      type: "table",
      eyebrow: "Founder Alignment",
      title: "We need clear ownership to move faster",
      subtitle:
        "Shared vision is important, but execution gets stronger when responsibilities are explicit.",
      table: {
        headers: ["Area", "Primary Owner"],
        rows: [
          ["Vision, positioning, and core strategy", "Founder / Shared alignment"],
          ["Product direction and platform priorities", "Founder"],
          ["Partnerships and ecosystem relationships", "Co-founder / Shared"],
          ["Business outreach and onboarding", "Shared"],
          ["Content and visibility", "Shared"],
          ["Metrics, reporting, and weekly review", "Shared"],
        ],
      },
      bullets: [
        "Ownership reduces duplication and confusion",
        "Shared areas still need one person driving progress",
        "Weekly review should focus on blockers, wins, and next actions",
      ],
      closingLine:
        "Alignment becomes real when responsibilities are visible and accountable.",
    },

    {
      id: "weekly-metrics",
      type: "stats",
      eyebrow: "Measurement",
      title: "The weekly numbers we should watch",
      subtitle:
        "A growth plan only works if we track the right metrics consistently.",
      stats: [
        { label: "New Paid Subs", value: "Weekly target" },
        { label: "Upgrade Rate", value: "Vaka → Paid" },
        { label: "Churn", value: "Monthly watch" },
      ],
      bullets: [
        "Number of outreach conversations started",
        "Number of onboarding calls or manual assisted signups",
        "Landing page conversion rate",
        "Mana vs Moana subscriber mix",
        "Activation rate after signup",
        "Reasons people do not convert or do not stay",
      ],
      closingLine:
        "We should review the same growth metrics every week until the engine becomes predictable.",
    },

    {
      id: "12-month-strategic-plan",
      type: "table",
      eyebrow: "Strategic Plan",
      title: "Suggested phased path to 1,000 paying subscribers",
      subtitle:
        "This keeps the team focused on a sequence instead of trying to do all growth motions at once.",
      table: {
        headers: ["Phase", "Primary Focus"],
        rows: [
          ["Phase 1", "Refine offer, positioning, and conversion foundations"],
          ["Phase 2", "Run founder-led acquisition and manual onboarding"],
          ["Phase 3", "Expand partnerships, referrals, and content-led discovery"],
          ["Phase 4", "Systemise acquisition, retention, and reporting"],
        ],
      },
      bullets: [
        "Phase 1 should remove conversion friction",
        "Phase 2 should teach us exactly what closes paid subscribers",
        "Phase 3 should multiply what already works",
        "Phase 4 should make growth more scalable and less founder-dependent",
      ],
      closingLine:
        "The sequence matters. We validate first, then scale what proves itself.",
    },

    {
      id: "next-30-days",
      type: "bullets",
      eyebrow: "Immediate Action Plan",
      title: "What we should do in the next 30 days",
      bullets: [
        "Agree on the exact mission, vision, positioning, and target customer language",
        "Tighten homepage and conversion messaging for paid plans",
        "Define and launch a founding member or early adopter offer",
        "Build a qualified outreach list of Pacific businesses in New Zealand first",
        "Start direct outreach and assisted onboarding conversations weekly",
        "Create a simple reporting dashboard for acquisition, conversion, and churn",
        "Identify 3–5 partner organisations or communities for collaboration",
      ],
      closingLine:
        "The next 30 days should produce clarity, outreach momentum, and the first repeatable conversion lessons.",
    },

    {
      id: "decision-points",
      type: "bullets",
      eyebrow: "Critical Decisions",
      title: "The decisions we should make together now",
      bullets: [
        "Which customer segment do we prioritise first?",
        "What is the clearest paid value proposition for Mana and Moana?",
        "What is our main acquisition method for the next 90 days?",
        "What support level will we offer for onboarding?",
        "What counts as enough traction to expand into new channels or markets?",
        "Which responsibilities belong clearly to each founder?",
      ],
      closingLine:
        "The clearer these decisions are, the faster execution becomes.",
    },

    {
      id: "closing",
      type: "closing",
      title: "Aligned vision creates faster execution",
      subtitle:
        "Pacific Discovery Network has a meaningful mission, a real market opportunity, and a working platform. The next step is disciplined founder alignment and focused execution toward 1,000 paying subscribers.",
      cta: "Build with focus",
      contact: {
        name: "Internal Founder Deck",
        title: "Pacific Discovery Network",
        email: "Internal Use Only",
        website: "pacificdiscoverynetwork.com",
      },
      finalLine:
        "Clarity first. Execution second. Growth follows.",
    },
  ],
};

export type InternalFounderAlignmentDeck = PresentationDeck;
