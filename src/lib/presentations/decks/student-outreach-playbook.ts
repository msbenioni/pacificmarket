import { PresentationDeck } from "@/lib/presentations/types";

export const studentOutreachPlaybookDeck: PresentationDeck = {
  slug: "student-outreach-playbook",
  title: "Student Outreach Playbook",
  description: "Internal training and execution playbook for student-supported business discovery and outreach.",
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
      subtitle: "Student Outreach Playbook",
      tagline: "How to find, contact, and support Pacific businesses professionally",
      statusBadge: "Internal Training Deck",
      contact: "Internal Use Only",
      footer: "Student Outreach Playbook · March 2026",
    },

    {
      id: "purpose",
      type: "bullets",
      eyebrow: "Purpose",
      title: "Why this programme exists",
      subtitle:
        "This outreach programme helps Pacific Discovery Network identify and invite Pacific-owned businesses to be discovered on the platform.",
      bullets: [
        "Increase visibility for Pacific-owned businesses",
        "Help build a stronger Pacific business discovery platform",
        "Create a structured pipeline of business listings",
        "Support founders by scaling discovery and outreach activity",
        "Build high-quality business records that can later convert into paid subscribers",
      ],
      closingLine:
        "The goal is not mass messaging. The goal is quality discovery, respectful outreach, and meaningful business onboarding.",
    },

    {
      id: "student-role",
      type: "three-column",
      eyebrow: "Role Overview",
      title: "What students are responsible for",
      subtitle:
        "Students support the top of the funnel. Founders remain responsible for strategy, quality, and final relationship oversight.",
      columns: [
        {
          title: "Discover",
          items: [
            "Find relevant Pacific-owned businesses",
            "Review public business presence",
            "Identify decision-maker contact options",
            "Collect core public business details",
          ],
        },
        {
          title: "Organise",
          items: [
            "Add businesses into the tracker",
            "Categorise by industry and location",
            "Log source links and contact method",
            "Mark outreach status clearly",
          ],
        },
        {
          title: "Support outreach",
          items: [
            "Use approved scripts only",
            "Send approved invitations where permitted",
            "Escalate warm leads to founders when needed",
            "Keep records accurate and updated",
          ],
        },
      ],
      closingLine:
        "Students help build volume and consistency. Founders protect trust, positioning, and conversion quality.",
    },

    {
      id: "who-to-target",
      type: "three-column",
      eyebrow: "Targeting",
      title: "Who we are looking for",
      subtitle:
        "We are focused on businesses that fit Pacific Discovery Network clearly and can benefit from being visible on the platform.",
      columns: [
        {
          title: "Best-fit businesses",
          items: [
            "Pacific-owned small businesses",
            "Service providers",
            "Product businesses",
            "Community-facing businesses",
          ],
        },
        {
          title: "Priority categories",
          items: [
            "Food and beverage",
            "Beauty and wellness",
            "Trades and services",
            "Retail and handmade products",
          ],
        },
        {
          title: "Priority regions",
          items: [
            "New Zealand first",
            "Australia next",
            "French Pacific where relevant",
            "Pacific Islands over time",
          ],
        },
      ],
      closingLine:
        "The best businesses to target first are those that are active, visible enough to identify, and likely to benefit from better discoverability.",
    },

    {
      id: "where-to-find-businesses",
      type: "bullets",
      eyebrow: "Discovery Sources",
      title: "Where students should look",
      bullets: [
        "Facebook business pages",
        "Pacific community Facebook groups",
        "Instagram business profiles",
        "Local Pacific business directories",
        "Event pages and vendor listings",
        "Public market or stallholder announcements",
        "Community organisation posts featuring businesses",
      ],
      closingLine:
        "Students should only use public information and public business-facing profiles.",
    },

    {
      id: "what-good-leads-look-like",
      type: "table",
      eyebrow: "Lead Quality",
      title: "How to identify a good business lead",
      subtitle:
        "Not every business found should be contacted immediately. We want relevant and credible leads.",
      table: {
        headers: ["Signal", "What To Look For"],
        rows: [
          ["Business activity", "Recent posts, comments, products, or services"],
          ["Pacific relevance", "Clearly Pacific-owned, Pacific-led, or Pacific-serving"],
          ["Contact path", "Messenger, email, or website contact option available"],
          ["Business clarity", "Clear business name, offer, and location"],
          ["Fit", "Would benefit from discoverability and profile visibility"],
        ],
      },
      bullets: [
        "If the business looks inactive, unclear, or unreachable, log it but do not prioritise it",
        "If it is a strong fit, mark it as high priority in the tracker",
      ],
      closingLine:
        "Good outreach starts with good lead selection.",
    },

    {
      id: "data-to-capture",
      type: "bullets",
      eyebrow: "Data Capture",
      title: "What students should record for each business",
      bullets: [
        "Business name",
        "Owner name if publicly visible",
        "Industry or category",
        "Location",
        "Facebook page or social link",
        "Website link if available",
        "Email address if public",
        "Messenger/contact method",
        "Notes on why the business is a good fit",
        "Outreach status",
      ],
      closingLine:
        "Consistent data capture makes the whole outreach system more useful and scalable.",
    },

    {
      id: "outreach-principles",
      type: "bullets",
      eyebrow: "Brand Standards",
      title: "How students should approach outreach",
      bullets: [
        "Be respectful and professional",
        "Be warm, not pushy",
        "Be clear and short",
        "Use only approved templates",
        "Do not overpromise outcomes",
        "Do not pressure anyone to join",
        "Do not argue or chase people who are uninterested",
      ],
      closingLine:
        "We are building trust and relationships, not running an aggressive sales script.",
    },

    {
      id: "messaging-do-not-do",
      type: "bullets",
      eyebrow: "Guardrails",
      title: "What students must never do",
      bullets: [
        "Do not pretend to be the founder unless explicitly instructed",
        "Do not make claims about guaranteed customers, sales, or exposure",
        "Do not spam multiple messages to the same business",
        "Do not contact personal profiles if business channels exist",
        "Do not improvise pricing or platform details",
        "Do not discuss partnership, investment, or advanced business deals",
        "Do not argue if someone declines",
      ],
      closingLine:
        "Protecting brand trust matters more than sending a high number of messages.",
    },

    {
      id: "basic-outreach-flow",
      type: "three-column",
      eyebrow: "Workflow",
      title: "The standard outreach workflow",
      subtitle:
        "Students should follow the same process every time so the pipeline stays clean and measurable.",
      columns: [
        {
          title: "Step 1",
          items: [
            "Find business",
            "Check fit",
            "Capture business details",
            "Add to tracker",
          ],
        },
        {
          title: "Step 2",
          items: [
            "Choose approved contact method",
            "Use approved script",
            "Send one clear invitation",
            "Log date and status",
          ],
        },
        {
          title: "Step 3",
          items: [
            "Track reply",
            "Mark interested, no response, or not suitable",
            "Escalate warm leads",
            "Update tracker accurately",
          ],
        },
      ],
      closingLine:
        "A clean workflow makes student support actually useful.",
    },

    {
      id: "messenger-script",
      type: "bullets",
      eyebrow: "Approved Script",
      title: "Suggested Messenger script",
      subtitle:
        "Students can adapt slightly for tone, but the structure should stay the same.",
      bullets: [
        'Hi, I came across your business and wanted to reach out because we\'re helping grow Pacific Discovery Network, a platform focused on increasing visibility for Pacific-owned businesses.',
        "We'd love to invite you to list your business on the platform so more people can discover what you offer.",
        "It's a great way to build visibility and be part of a growing Pacific business network.",
        "If you're interested, I can send you the link to get started.",
      ],
      closingLine:
        "Keep it simple, respectful, and easy to respond to.",
    },

    {
      id: "email-script",
      type: "bullets",
      eyebrow: "Approved Script",
      title: "Suggested email script",
      subtitle:
        "This version works best when a public email address is available.",
      bullets: [
        "Subject: Invitation to list your business on Pacific Discovery Network",
        "Hello, I came across your business and wanted to reach out because we are inviting Pacific-owned businesses to join Pacific Discovery Network.",
        "Pacific Discovery Network is a platform designed to help Pacific businesses become more visible and easier to discover.",
        "We would love to invite you to list your business and be part of the growing platform.",
        "If you are interested, I can send through the next steps or direct link.",
      ],
      closingLine:
        "Email should stay concise and easy to scan.",
    },

    {
      id: "reply-handling",
      type: "table",
      eyebrow: "Reply Handling",
      title: "How students should handle responses",
      subtitle:
        "Not every response needs the same action. Students should know when to continue and when to escalate.",
      table: {
        headers: ["Response Type", "What To Do"],
        rows: [
          ["Interested", "Send approved next-step message and mark as warm lead"],
          ["Has questions", "Escalate to founder if outside script"],
          ["Not now", "Mark for later follow-up"],
          ["No response", "Log and wait before any approved follow-up"],
          ["Not interested", "Thank them and close the lead respectfully"],
        ],
      },
      bullets: [
        "Warm leads should be flagged clearly",
        "Questions about pricing, partnerships, features, or custom support should be escalated",
      ],
      closingLine:
        "Students support the process, but founders should handle deeper sales and relationship conversations.",
    },

    {
      id: "handover-rules",
      type: "bullets",
      eyebrow: "Escalation",
      title: "When students should hand over to founders",
      bullets: [
        "The business wants more information about plans or pricing",
        "The business asks strategic questions about the platform",
        "The business looks like a strong paid prospect",
        "The business asks about partnerships, sponsorships, or media",
        "The business is influential, well-known, or high-value",
        "The student is unsure how to respond",
      ],
      closingLine:
        "Escalate early rather than risking poor-quality communication.",
    },

    {
      id: "tracker-structure",
      type: "table",
      eyebrow: "Tracking System",
      title: "Suggested tracker columns",
      subtitle:
        "A strong tracker turns outreach into an actual operating system.",
      table: {
        headers: ["Column", "Purpose"],
        rows: [
          ["Business Name", "Identify business"],
          ["Category", "Industry filter"],
          ["Location", "Market tracking"],
          ["Source Link", "Original discovery source"],
          ["Contact Method", "Messenger, email, website"],
          ["Contact Sent", "Yes or no"],
          ["Status", "Interested, no response, not fit, listed"],
          ["Owner", "Student or founder responsible"],
          ["Notes", "Useful context"],
        ],
      },
      bullets: [
        "Use consistent status names",
        "Do not leave rows incomplete",
        "Every business touched should be traceable",
      ],
      closingLine:
        "What gets tracked can be improved.",
    },

    {
      id: "success-metrics",
      type: "stats",
      eyebrow: "Measurement",
      title: "How student outreach success should be measured",
      subtitle:
        "Students should be measured on quality contribution, not raw message volume.",
      stats: [
        { label: "Qualified businesses found", value: "Weekly" },
        { label: "Approved outreach sent", value: "Weekly" },
        { label: "Listings created", value: "Weekly" },
      ],
      bullets: [
        "Quality of leads added",
        "Accuracy of data captured",
        "Professionalism of messaging",
        "Number of warm leads generated",
        "Number of completed listings supported",
      ],
      closingLine:
        "The best student contributors help produce clean, useful pipeline movement.",
    },

    {
      id: "quality-check",
      type: "bullets",
      eyebrow: "Quality Control",
      title: "How founders should review student work",
      bullets: [
        "Review a sample of discovered leads each week",
        "Review messaging before students begin sending independently",
        "Check tracker accuracy regularly",
        "Audit lead quality, not just quantity",
        "Identify common mistakes and retrain quickly",
        "Keep improving scripts based on real business responses",
      ],
      closingLine:
        "Student outreach works best when it is coached, reviewed, and refined.",
    },

    {
      id: "30-day-student-rollout",
      type: "three-column",
      eyebrow: "Rollout Plan",
      title: "Suggested 30-day rollout for student outreach",
      subtitle:
        "This helps you launch the programme in a controlled way.",
      columns: [
        {
          title: "Week 1",
          items: [
            "Train students on mission and fit",
            "Set up tracker",
            "Share examples of good leads",
            "Review scripts together",
          ],
        },
        {
          title: "Week 2",
          items: [
            "Students discover businesses only",
            "Founders review lead quality",
            "Refine categories and tracking",
            "Approve first outreach list",
          ],
        },
        {
          title: "Weeks 3–4",
          items: [
            "Begin limited outreach",
            "Track replies and listing outcomes",
            "Hold weekly review sessions",
            "Refine process based on results",
          ],
        },
      ],
      closingLine:
        "Start controlled, then scale once the process is clean.",
    },

    {
      id: "next-steps",
      type: "bullets",
      eyebrow: "Immediate Next Steps",
      title: "What to do next",
      bullets: [
        "Create the outreach tracker",
        "Finalise approved Messenger and email templates",
        "Define lead categories and fit rules",
        "Set weekly quality and activity targets",
        "Choose who reviews student work",
        "Pilot the system with a small number of students first",
      ],
      closingLine:
        "A simple, disciplined pilot is better than a messy large rollout.",
    },

    {
      id: "closing",
      type: "closing",
      title: "Systemised outreach can become a major growth advantage",
      subtitle:
        "Pacific Discovery Network already has early proof that trust-based outreach works. This playbook helps turn that founder-led success into a structured, repeatable programme.",
      cta: "Build the system",
      contact: {
        name: "Internal Operations Deck",
        title: "Pacific Discovery Network",
        email: "Internal Use Only",
        website: "pacificdiscoverynetwork.com",
      },
      finalLine:
        "Respectful discovery. Clean systems. Better growth.",
    },
  ],
};

export type StudentOutreachPlaybookDeck = PresentationDeck;
