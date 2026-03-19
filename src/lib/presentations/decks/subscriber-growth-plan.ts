import { PresentationDeck } from "@/lib/presentations/types";

export const subscriberGrowthPlanDeck: PresentationDeck = {
  slug: "subscriber-growth-plan",
  title: "1,000 Subscriber Growth Plan",
  description: "Internal execution deck for reaching 1,000 paying subscribers at Pacific Discovery Network.",
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
      subtitle: "1,000 Paying Subscriber Strategic Execution Plan",
      tagline: "How we move from early traction to repeatable paid growth",
      statusBadge: "Internal Use Only",
      contact: "Internal Strategy",
      footer: "Growth Execution Deck · March 2026",
    },

    {
      id: "goal",
      type: "stats",
      eyebrow: "North Star Goal",
      title: "Our current business goal is 1,000 paying subscribers",
      subtitle:
        "This is the most important short-to-mid-term milestone because it validates demand, recurring revenue, and product usefulness.",
      stats: [
        { label: "Target", value: "1,000 paid subscribers" },
        { label: "Mix", value: "60% Mana / 40% Moana" },
        { label: "Est. MRR", value: "$14.59K" },
      ],
      bullets: [
        "This goal validates market demand beyond goodwill and interest",
        "It gives us recurring revenue to improve the platform and support growth",
        "It creates a measurable foundation for future partnerships and funding",
      ],
      closingLine:
        "The goal is not just growth in signups. The goal is repeatable paid growth.",
    },

    {
      id: "validated-channel",
      type: "bullets",
      eyebrow: "What We Already Know",
      title: "We already have one validated acquisition channel",
      subtitle:
        "Our first 34 business listers did not come from paid ads. They came from founder-led manual outreach.",
      bullets: [
        "Businesses were found through Facebook and social discovery",
        "Relevant Pacific businesses were shared first to build trust and visibility",
        "Businesses were then contacted through email or Messenger",
        "Around 80% of businesses contacted were happy to list their business",
        "This demonstrates strong audience relevance and low-friction listing demand",
        "The channel works because it is personal, culturally relevant, and trust-based",
      ],
      closingLine:
        "This is our first real acquisition proof. It should become a structured growth system.",
    },

    {
      id: "traction",
      type: "stats",
      eyebrow: "Early Traction",
      title: "Early traction validates the manual listing engine",
      subtitle:
        "Even though these businesses are currently on the free plan, the acquisition path itself is highly valuable.",
      stats: [
        { label: "Free listers acquired", value: "34" },
        { label: "Positive response rate", value: "~80%" },
        { label: "Main channel", value: "FB + direct outreach" },
      ],
      bullets: [
        "We have evidence that Pacific businesses respond positively to direct invitation",
        "The current task is to turn listing acquisition into paid conversion and retention",
        "This should be treated as the first repeatable top-of-funnel strategy",
      ],
      closingLine:
        "This is not just traction. It is a working acquisition model that can be improved and scaled.",
    },

    {
      id: "growth-engine",
      type: "three-column",
      eyebrow: "Growth Engine",
      title: "Our early growth engine is social discovery + direct outreach + platform onboarding",
      subtitle:
        "This model works because it combines trust, relevance, and direct invitation.",
      columns: [
        {
          title: "Step 1: Discover",
          items: [
            "Find Pacific businesses on Facebook",
            "Monitor community groups and business posts",
            "Identify relevant service and product businesses",
            "Build outreach list from public business presence",
          ],
        },
        {
          title: "Step 2: Engage",
          items: [
            "Share or spotlight their business",
            "Reach out via Messenger or email",
            "Introduce Pacific Discovery Network",
            "Invite them to list on the platform",
          ],
        },
        {
          title: "Step 3: Convert",
          items: [
            "Guide them to complete their listing",
            "Support profile quality where needed",
            "Encourage activation and profile completion",
            "Later convert free users into paid tiers",
          ],
        },
      ],
      closingLine:
        "This gives us a practical and culturally aligned top-of-funnel model.",
    },

    {
      id: "student-engine",
      type: "bullets",
      eyebrow: "Scale Opportunity",
      title: "Student-supported outreach can help scale the top of funnel",
      subtitle:
        "We are proposing to use students to help identify and invite Pacific businesses onto the platform at scale.",
      bullets: [
        "Students can help discover businesses across Facebook and other public channels",
        "Students can build outreach lists and assist with first-contact workflows",
        "Students can support data entry and listing preparation",
        "Founder oversight is still required for quality, messaging, and trust",
        "This creates a low-cost or no-cost pipeline-building model",
        "This can increase volume without requiring immediate paid staff expansion",
      ],
      closingLine:
        "Students can help scale outreach volume, while founders keep quality, positioning, and relationship control.",
    },

    {
      id: "student-model-guardrails",
      type: "bullets",
      eyebrow: "Execution Guardrails",
      title: "The student model only works if it is systemised properly",
      bullets: [
        "Students need clear scripts, templates, and approval workflows",
        "Outreach quality must remain aligned with the brand and mission",
        "Students should not freelance the message or make unsupported claims",
        "Business records and outreach logs must be tracked centrally",
        "Students should be measured on qualified outreach and completed listings, not spam volume",
        "Founder review should remain part of the workflow until conversion is predictable",
      ],
      closingLine:
        "The goal is not mass outreach. The goal is quality outreach at greater scale.",
    },

    {
      id: "real-funnel",
      type: "table",
      eyebrow: "Funnel Strategy",
      title: "Our true funnel is listing first, then upgrade, then retention",
      subtitle:
        "We should not expect every business to pay immediately. First we win trust and visibility, then we convert.",
      table: {
        headers: ["Stage", "Primary Objective"],
        rows: [
          ["Awareness", "Businesses learn Pacific Discovery Network exists"],
          ["Free Listing", "Businesses join the platform"],
          ["Activation", "Businesses complete and improve their profile"],
          ["Upgrade", "Businesses move to Mana or Moana"],
          ["Retention", "Businesses stay because value remains clear"],
        ],
      },
      bullets: [
        "Free listings are not failure if they are part of a paid conversion system",
        "The platform should guide businesses from visibility to value",
        "Paid conversion needs stronger reasons, better prompts, and clearer outcomes",
      ],
      closingLine:
        "The listing engine fills the top of the funnel. The next job is improving movement through the funnel.",
    },

    {
      id: "conversion-challenge",
      type: "bullets",
      eyebrow: "Main Challenge",
      title: "The key challenge is not awareness — it is paid conversion",
      bullets: [
        "Businesses may understand the mission but still need practical reasons to pay",
        "The difference between Free, Mana, and Moana must be obvious",
        "The paid plans need stronger outcome-based messaging",
        "Upgrade timing and prompts need to be part of the user journey",
        "Businesses need to feel the benefit of a better profile, better trust, and better tools",
      ],
      closingLine:
        "If we can already get businesses onto the platform, the next growth lever is paid value clarity.",
    },

    {
      id: "why-businesses-would-pay",
      type: "three-column",
      eyebrow: "Paid Value",
      title: "Businesses will pay for practical outcomes, not just platform support",
      subtitle:
        "Our messaging and offer should always tie paid plans to visible business benefits.",
      columns: [
        {
          title: "Visibility",
          items: [
            "Better discoverability",
            "Stronger profile presence",
            "Improved search and listing quality",
            "More credibility with customers",
          ],
        },
        {
          title: "Trust",
          items: [
            "Professional public presentation",
            "Verification-related value",
            "More confidence for people viewing the business",
            "Stronger first impression",
          ],
        },
        {
          title: "Utility",
          items: [
            "Useful business tools",
            "Profile-building support",
            "Professional business resources",
            "Long-term digital presence value",
          ],
        },
      ],
      closingLine:
        "Paid plans must feel like a business decision, not a donation decision.",
    },

    {
      id: "1000-pathways",
      type: "table",
      eyebrow: "Path to 1,000",
      title: "We need to think in stages, not one giant number",
      subtitle:
        "Breaking the target down helps us build an execution rhythm.",
      table: {
        headers: ["Milestone", "Focus"],
        rows: [
          ["First 100 paid", "Prove direct conversion from existing listing pipeline"],
          ["250 paid", "Refine onboarding, messaging, and upgrade path"],
          ["500 paid", "Scale student outreach, referrals, and partnerships"],
          ["750 paid", "Strengthen retention and partner-led acquisition"],
          ["1,000 paid", "Operate a repeatable paid growth engine"],
        ],
      },
      bullets: [
        "The first 100 paid users are about learning",
        "The next 400 are about repeatability",
        "The final stretch is about operational scale and retention",
      ],
      closingLine:
        "The journey to 1,000 paid subscribers should be treated as a staged build, not a single campaign.",
    },

    {
      id: "acquisition-channels",
      type: "three-column",
      eyebrow: "Acquisition Channels",
      title: "Priority acquisition channels for the next phase",
      subtitle:
        "We should focus on channels already showing signs of fit before expanding too broadly.",
      columns: [
        {
          title: "Priority 1",
          items: [
            "Founder-led direct outreach",
            "Student-supported list building",
            "Messenger and email invitations",
            "Manual profile onboarding",
          ],
        },
        {
          title: "Priority 2",
          items: [
            "Pacific community groups",
            "Business associations",
            "Events and local business networks",
            "Partner referrals",
          ],
        },
        {
          title: "Priority 3",
          items: [
            "SEO landing pages",
            "Business spotlight content",
            "Founder-led content marketing",
            "Public discovery pages that rank",
          ],
        },
      ],
      closingLine:
        "Manual and community-led channels should stay first until conversion becomes more predictable.",
    },

    {
      id: "conversion-improvements",
      type: "bullets",
      eyebrow: "Immediate Conversion Work",
      title: "What we need to improve to convert free users into paid subscribers",
      bullets: [
        "Clarify what Mana and Moana actually help businesses achieve",
        "Improve pricing page and plan comparison language",
        "Create stronger upgrade prompts inside the business experience",
        "Add upgrade reasons tied to visibility, trust, and tools",
        "Offer founder or guided onboarding for early cohorts",
        "Create limited-time founding member or early supporter offers",
      ],
      closingLine:
        "If acquisition is already working at the top of the funnel, conversion messaging becomes a priority growth lever.",
    },

    {
      id: "retention-plan",
      type: "bullets",
      eyebrow: "Retention Plan",
      title: "Retention starts as soon as the business joins",
      bullets: [
        "Businesses should feel welcomed and guided immediately",
        "Profile completion should be encouraged through a clear activation flow",
        "Businesses should understand how to get more value from the platform",
        "The platform should regularly reinforce the benefits of staying visible",
        "We need to capture why users do not upgrade, and why paid users might churn",
      ],
      closingLine:
        "Retention is part of growth. It begins at signup, not after someone becomes paid.",
    },

    {
      id: "90-day-plan",
      type: "three-column",
      eyebrow: "90-Day Execution Plan",
      title: "What we should do over the next 90 days",
      subtitle:
        "The next phase should focus on systemising what already works and improving the paid path.",
      columns: [
        {
          title: "Days 1–30",
          items: [
            "Document outreach workflow",
            "Build scripts and templates",
            "Clarify paid plan messaging",
            "Create tracking system for outreach and listings",
          ],
        },
        {
          title: "Days 31–60",
          items: [
            "Train student outreach support",
            "Increase outreach volume",
            "Test guided onboarding and upgrade prompts",
            "Launch founding member or early upgrade offer",
          ],
        },
        {
          title: "Days 61–90",
          items: [
            "Measure conversion by source",
            "Improve activation and retention flow",
            "Strengthen partner and referral channels",
            "Refine the engine based on real results",
          ],
        },
      ],
      closingLine:
        "The next 90 days should turn founder effort into a system, not just more manual hustle.",
    },

    {
      id: "weekly-kpis",
      type: "stats",
      eyebrow: "Weekly Scoreboard",
      title: "The numbers we should track every week",
      subtitle:
        "This is how we will know whether the engine is improving.",
      stats: [
        { label: "New listings", value: "Weekly" },
        { label: "Paid upgrades", value: "Weekly" },
        { label: "Churn", value: "Monthly" },
      ],
      bullets: [
        "Businesses found",
        "Businesses contacted",
        "Positive replies",
        "Listings completed",
        "Free-to-paid upgrades",
        "Mana vs Moana mix",
        "Activation rate after signup",
        "Reasons for non-conversion",
      ],
      closingLine:
        "We should manage growth from real numbers, not from assumptions.",
    },

    {
      id: "roles",
      type: "table",
      eyebrow: "Team Structure",
      title: "Clear ownership will make this strategy more effective",
      subtitle:
        "The outreach engine needs execution ownership, quality control, and reporting.",
      table: {
        headers: ["Area", "Owner"],
        rows: [
          ["Growth strategy and positioning", "Founder / Co-founder"],
          ["Outreach workflow design", "Founder"],
          ["Student coordination and support", "Co-founder / Shared"],
          ["Messaging templates and scripts", "Founder"],
          ["Business onboarding and activation", "Shared"],
          ["Reporting and weekly review", "Shared"],
        ],
      },
      bullets: [
        "Students support volume, founders protect quality and trust",
        "Every part of the engine should have someone accountable",
      ],
      closingLine:
        "This strategy becomes scalable when ownership is clear and repeatable.",
    },

    {
      id: "next-steps",
      type: "bullets",
      eyebrow: "Immediate Next Steps",
      title: "What we should do next",
      bullets: [
        "Document the exact outreach process that produced the first 34 listings",
        "Create a simple student outreach playbook",
        "Build a central tracker for discovery, outreach, signup, and upgrade status",
        "Rewrite paid plan messaging to focus on business outcomes",
        "Create a founding member upgrade campaign for free listers",
        "Test assisted onboarding for higher-potential businesses",
        "Set weekly outreach, signup, and upgrade targets",
      ],
      closingLine:
        "The immediate opportunity is to turn founder intuition into a repeatable growth system.",
    },

    {
      id: "closing",
      type: "closing",
      title: "We already have the beginning of a growth engine",
      subtitle:
        "The first 34 listers and strong outreach response rate show that Pacific Discovery Network has early channel fit. The next step is to systemise outreach, improve paid conversion, and build a repeatable path to 1,000 paying subscribers.",
      cta: "Systemise what works",
      contact: {
        name: "Internal Growth Deck",
        title: "Pacific Discovery Network",
        email: "Internal Use Only",
        website: "pacificdiscoverynetwork.com",
      },
      finalLine:
        "Validated trust. Structured outreach. Paid growth next.",
    },
  ],
};

export type SubscriberGrowthPlanDeck = PresentationDeck;
