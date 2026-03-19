import { PresentationDeck } from "@/lib/presentations/types";

export const studentOutreachOperationsDeck: PresentationDeck = {
  slug: "student-outreach-operations",
  title: "Student Outreach & Listing Operations",
  description:
    "Internal operations deck for business discovery, student outreach, admin-added listings, and claim workflows.",
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
      subtitle: "Student Outreach, Tracker, SOP & Claim Listing Workflow",
      tagline: "How we systematically grow public listings and convert business owners into claimed accounts",
      statusBadge: "Internal Operations Deck",
      contact: "Internal Use Only",
      footer: "Operations Deck · March 2026",
    },

    {
      id: "model-overview",
      type: "three-column",
      eyebrow: "Growth Model",
      title: "Our listing growth model should not rely only on self-signup",
      subtitle:
        "We can grow the directory faster by adding public business listings ourselves, then inviting owners to claim or remove them.",
      columns: [
        {
          title: "Stage 1: Discover",
          items: [
            "Find public Pacific-owned businesses",
            "Collect only public business information",
            "Review fit and quality",
            "Add to admin review queue",
          ],
        },
        {
          title: "Stage 2: Publish",
          items: [
            "Create public unclaimed listing",
            "Mark listing as community discovered",
            "Display claim listing option",
            "Display removal request option",
          ],
        },
        {
          title: "Stage 3: Convert",
          items: [
            "Students reach out to owners",
            "Invite business to claim listing",
            "Offer profile improvements after claim",
            "Later convert claimed users into paid plans",
          ],
        },
      ],
      closingLine:
        "This approach grows directory coverage first, then turns visibility into owner activation and paid conversion.",
    },

    {
      id: "why-this-model-works",
      type: "bullets",
      eyebrow: "Why This Works",
      title: "This model gives us faster growth and a clearer operating system",
      bullets: [
        "The public directory becomes useful faster because listings do not depend only on owner self-registration",
        "Students have a clear job: invite owners to claim or remove their listing",
        "Founders keep quality control while the directory scales",
        "Businesses can benefit from visibility before becoming fully active users",
        "Claiming a listing creates a natural activation and conversion event",
      ],
      closingLine:
        "The goal is to build public inventory first, then convert ownership and paid adoption over time.",
    },

    {
      id: "important-guardrails",
      type: "bullets",
      eyebrow: "Guardrails",
      title: "Rules that protect trust and platform integrity",
      bullets: [
        "Only use information already publicly available from business-facing sources",
        "Do not use private contact details or personal data from non-public sources",
        "Unclaimed listings must be clearly labeled as not yet owner-verified",
        "Every unclaimed listing must have a visible claim option",
        "Every unclaimed listing must have a visible removal request option",
        "Do not imply endorsement, verification, or paid relationship unless true",
      ],
      closingLine:
        "Trust is protected when the sourcing model is transparent and business owners have control.",
    },

    {
      id: "listing-status-model",
      type: "table",
      eyebrow: "Listing Statuses",
      title: "Suggested listing status system",
      subtitle:
        "A clear status system helps the team know what stage each business is in.",
      table: {
        headers: ["Status", "Meaning"],
        rows: [
          ["Discovered", "Business found but not yet reviewed"],
          ["Approved for Listing", "Public information reviewed and suitable"],
          ["Unclaimed Live", "Listing published, owner has not claimed yet"],
          ["Claim Outreach Sent", "Owner has been contacted"],
          ["Claimed", "Owner has claimed control of listing"],
          ["Removal Requested", "Owner has asked to remove listing"],
          ["Removed", "Listing has been taken down"],
        ],
      },
      closingLine:
        "These statuses should exist both in the admin workflow and in the outreach tracker.",
    },

    {
      id: "discovery-script-concept",
      type: "bullets",
      eyebrow: "Discovery Automation",
      title: "How a public web discovery script can support the process",
      subtitle:
        "The script should help identify public business candidates. It should support human review, not auto-publish everything.",
      bullets: [
        "Search public websites, public directories, and public social business pages for Pacific-owned business candidates",
        "Collect public business details such as name, category, location, website, and public contact method",
        "Add results to an internal review queue, not directly to live listings without approval",
        "Flag confidence level so humans can review Pacific relevance and business quality",
        "Avoid scraping private or gated information",
        "Use admin review before any listing goes live",
      ],
      closingLine:
        "Automation should speed up discovery, while humans remain responsible for quality and publication decisions.",
    },

    {
      id: "discovery-script-fields",
      type: "table",
      eyebrow: "Discovery Queue",
      title: "Suggested fields your script should populate",
      subtitle:
        "This is the minimum useful structure for human review before publishing.",
      table: {
        headers: ["Field", "Purpose"],
        rows: [
          ["Business Name", "Primary listing identity"],
          ["Source URL", "Proof of public source"],
          ["Business Website", "Public business reference"],
          ["Primary Social Link", "Public business-facing profile"],
          ["Category", "Initial classification"],
          ["Location", "Region / country"],
          ["Public Email or Contact URL", "Outreach pathway"],
          ["Pacific Relevance Notes", "Why it appears to fit"],
          ["Confidence Score", "Human review priority"],
          ["Review Status", "Pending / approved / rejected"],
        ],
      },
      closingLine:
        "The script should produce structured candidates, not final truth.",
    },

    {
      id: "admin-review-workflow",
      type: "three-column",
      eyebrow: "Admin Workflow",
      title: "Suggested review flow before publishing a public listing",
      subtitle:
        "Nothing should go live from the script without a human check.",
      columns: [
        {
          title: "Step 1: Review",
          items: [
            "Check source quality",
            "Confirm business appears active",
            "Confirm public-facing business presence",
            "Confirm likely fit",
          ],
        },
        {
          title: "Step 2: Prepare",
          items: [
            "Clean business name",
            "Assign category and location",
            "Add source link internally",
            "Mark listing as unclaimed",
          ],
        },
        {
          title: "Step 3: Publish",
          items: [
            "Publish public listing",
            "Show claim listing CTA",
            "Show removal request CTA",
            "Push to student outreach queue",
          ],
        },
      ],
      closingLine:
        "This keeps the platform clean while still moving faster than pure self-registration.",
    },

    {
      id: "claim-listing-flow",
      type: "three-column",
      eyebrow: "Claim Flow",
      title: "What the claim listing workflow should look like",
      subtitle:
        "Claiming should feel simple, safe, and valuable for business owners.",
      columns: [
        {
          title: "Public Listing",
          items: [
            "Business profile is visible publicly",
            "Listing marked as unclaimed",
            "Claim this listing button is visible",
            "Remove this listing option is visible",
          ],
        },
        {
          title: "Claim Request",
          items: [
            "Owner submits claim request",
            "Owner verifies connection to business",
            "Admin reviews request",
            "Ownership is granted",
          ],
        },
        {
          title: "Post-Claim",
          items: [
            "Owner completes profile",
            "Owner improves listing details",
            "Owner sees upgrade options",
            "Owner enters activation journey",
          ],
        },
      ],
      closingLine:
        "Claiming is not just admin control. It is the handoff from public visibility to business ownership and monetisation.",
    },

    {
      id: "remove-listing-flow",
      type: "bullets",
      eyebrow: "Removal Flow",
      title: "Businesses should also be able to request removal easily",
      bullets: [
        "Every unclaimed listing should include a removal request option",
        "Removal requests should go into an admin review queue",
        "The business should not need to fight to be removed",
        "Removed businesses should be marked internally so they are not repeatedly re-added by mistake",
        "The outreach team should see removal status immediately",
      ],
      closingLine:
        "A visible and respectful removal process helps protect trust in the platform.",
    },

    {
      id: "tracker-overview",
      type: "bullets",
      eyebrow: "Tracker Structure",
      title: "The tracker should combine discovery, listing, outreach, and claim status",
      subtitle:
        "Do not separate these into disconnected systems unless necessary. One master tracker gives better visibility.",
      bullets: [
        "The same business should be traceable from discovery through to claim and upgrade",
        "Students should work from an outreach-focused view of the master tracker",
        "Admins should work from a review and listing management view",
        "Founders should be able to see pipeline movement at a glance",
      ],
      closingLine:
        "A strong tracker turns outreach and listing operations into a measurable growth system.",
    },

    {
      id: "tracker-columns",
      type: "table",
      eyebrow: "Tracker Template",
      title: "Suggested master tracker columns",
      subtitle:
        "This is the structure I recommend for your tracker in Airtable, Notion, or Google Sheets.",
      table: {
        headers: ["Column", "Purpose"],
        rows: [
          ["Business Name", "Core identifier"],
          ["Business Owner / Contact Name", "If publicly visible"],
          ["Category", "Business type"],
          ["Location", "City / country / region"],
          ["Source Type", "Facebook, website, Instagram, directory, event page"],
          ["Source URL", "Original public source"],
          ["Website", "Business website"],
          ["Public Email", "Outreach option"],
          ["Messenger / Social Contact", "Outreach option"],
          ["Pacific Relevance", "Why it fits"],
          ["Discovery Method", "Manual or script-found"],
          ["Review Status", "Pending / approved / rejected"],
          ["Listing Status", "Not listed / unclaimed live / claimed / removed"],
          ["Outreach Status", "Not contacted / contacted / replied / warm / closed"],
          ["Claim Status", "Not invited / invited / requested / approved"],
          ["Removal Status", "None / requested / removed"],
          ["Assigned To", "Student or founder"],
          ["Last Contact Date", "Follow-up visibility"],
          ["Notes", "Context and next action"],
          ["Paid Plan Status", "Free / Mana / Moana"],
        ],
      },
      closingLine:
        "This structure lets you manage the full journey in one place.",
    },

    {
      id: "student-view",
      type: "table",
      eyebrow: "Student Tracker View",
      title: "What students should see in their working view",
      subtitle:
        "Students do not need full admin complexity. They need a clear operational view.",
      table: {
        headers: ["Field", "Why It Matters"],
        rows: [
          ["Business Name", "Know who they are contacting"],
          ["Category", "Context for messaging"],
          ["Location", "Regional targeting"],
          ["Contact Method", "Know whether to email or message"],
          ["Listing Status", "Know if already live and unclaimed"],
          ["Outreach Status", "Avoid duplicate contact"],
          ["Suggested Action", "Next step to take"],
          ["Assigned To", "Ownership"],
          ["Notes", "Useful context"],
        ],
      },
      closingLine:
        "Students should have a simplified view focused on action, not system complexity.",
    },

    {
      id: "sop-overview",
      type: "three-column",
      eyebrow: "SOP Overview",
      title: "The standard operating procedure should follow one simple path",
      subtitle:
        "Students should be trained on a repeatable workflow, not left to improvise.",
      columns: [
        {
          title: "Discover",
          items: [
            "Find public business",
            "Check it fits criteria",
            "Capture required fields",
            "Add to tracker",
          ],
        },
        {
          title: "Support listing",
          items: [
            "If approved, listing goes live as unclaimed",
            "Confirm claim/remove links exist",
            "Move record into outreach queue",
            "Prepare approved contact method",
          ],
        },
        {
          title: "Outreach",
          items: [
            "Send approved message",
            "Invite claim or removal",
            "Update tracker status",
            "Escalate warm leads or issues",
          ],
        },
      ],
      closingLine:
        "The SOP should make it easy for new students to contribute consistently.",
    },

    {
      id: "student-sop-step-1",
      type: "bullets",
      eyebrow: "SOP Step 1",
      title: "Find and qualify the business",
      bullets: [
        "Use only public sources",
        "Check that the business appears active",
        "Check that the business is a likely Pacific fit",
        "Capture the source link and public business details",
        "Do not add incomplete or low-confidence leads without notes",
      ],
      closingLine:
        "Quality lead selection matters more than high volume.",
    },

    {
      id: "student-sop-step-2",
      type: "bullets",
      eyebrow: "SOP Step 2",
      title: "Check listing status before outreach",
      bullets: [
        "Confirm whether the business is already listed",
        "If not yet listed, pass to admin review or listing queue",
        "If unclaimed live, confirm the claim and removal options are active",
        "Do not contact a business twice from different student accounts",
      ],
      closingLine:
        "Students must always work from the tracker, not from memory.",
    },

    {
      id: "student-sop-step-3",
      type: "bullets",
      eyebrow: "SOP Step 3",
      title: "Send approved outreach message",
      subtitle:
        "The outreach message should invite the owner to claim or remove their listing respectfully.",
      bullets: [
        "Use only approved templates",
        "Keep the message short and professional",
        "Explain that the listing is live or ready based on public information",
        "Invite the owner to claim the listing if they would like control",
        "Let them know they can request removal if they do not want to be listed",
      ],
      closingLine:
        "This is an invitation to take ownership, not a pressure tactic.",
    },

    {
      id: "claim-invite-script",
      type: "bullets",
      eyebrow: "Approved Script",
      title: "Suggested claim listing message",
      bullets: [
        "Hi, we came across your business through your public business presence and have included it on Pacific Discovery Network so more people can discover Pacific-owned businesses.",
        "Your listing is currently marked as unclaimed, and we'd love to invite you to claim it so you can manage the details yourself.",
        "If you'd like to claim it, we can send you the link and next steps.",
        "If you would prefer not to be listed, please let us know and we can arrange removal.",
      ],
      closingLine:
        "This message is clear, respectful, and gives the owner control.",
    },

    {
      id: "reply-handling",
      type: "table",
      eyebrow: "Reply Handling",
      title: "How students should respond to different outcomes",
      table: {
        headers: ["Reply Type", "Student Action"],
        rows: [
          ["Wants to claim", "Send approved next-step link and mark as warm lead"],
          ["Has questions", "Escalate to founder or admin"],
          ["Wants removal", "Mark removal requested and escalate immediately"],
          ["No response", "Log status and follow approved follow-up rules"],
          ["Not interested", "Thank them and close respectfully"],
        ],
      },
      closingLine:
        "Questions about pricing, partnerships, verification, or technical issues should be escalated.",
    },

    {
      id: "sop-do-not-do",
      type: "bullets",
      eyebrow: "Do Not Do",
      title: "Students must not do the following",
      bullets: [
        "Do not publish listings directly unless approved by role and process",
        "Do not invent missing business details",
        "Do not imply the business endorsed the listing if it has not claimed it",
        "Do not make promises about leads, sales, ranking, or exposure",
        "Do not ignore removal requests",
        "Do not use personal or private contact data",
      ],
      closingLine:
        "Operational speed should never come at the cost of trust or accuracy.",
    },

    {
      id: "founder-review",
      type: "bullets",
      eyebrow: "Founder Oversight",
      title: "What founders or admins should review weekly",
      bullets: [
        "Businesses discovered this week",
        "Listings approved and published",
        "Unclaimed listings waiting for outreach",
        "Claim requests received",
        "Removal requests received",
        "Student outreach quality",
        "Warm leads ready for activation or upgrade conversations",
      ],
      closingLine:
        "Founder oversight keeps the system clean and protects the brand.",
    },

    {
      id: "weekly-kpis",
      type: "stats",
      eyebrow: "KPIs",
      title: "The weekly numbers that matter",
      subtitle:
        "These are the metrics that tell you whether the discovery and claim system is working.",
      stats: [
        { label: "New listings added", value: "Weekly" },
        { label: "Claim invites sent", value: "Weekly" },
        { label: "Listings claimed", value: "Weekly" },
      ],
      bullets: [
        "Businesses discovered",
        "Businesses approved for listing",
        "Unclaimed listings published",
        "Claim outreach messages sent",
        "Claim requests received",
        "Removal requests received",
        "Claim conversion rate",
        "Claimed-to-paid conversion rate over time",
      ],
      closingLine:
        "The real win is not just more listings. It is more claimed, activated, and eventually paid listings.",
    },

    {
      id: "next-steps",
      type: "bullets",
      eyebrow: "Immediate Build Plan",
      title: "What to build next operationally",
      bullets: [
        "Create listing statuses and claim/remove statuses in the admin system",
        "Add clear public badges for unclaimed listings",
        "Add claim this listing and remove this listing workflows",
        "Build the master tracker structure",
        "Create the student view of the tracker",
        "Finalise claim invitation templates",
        "Build the internal review queue for script-found businesses",
      ],
      closingLine:
        "The system becomes powerful when discovery, listing, outreach, and claiming all connect cleanly.",
    },

    {
      id: "closing",
      type: "closing",
      title: "This model can become a major platform growth engine",
      subtitle:
        "By combining public discovery, admin-created listings, student outreach, and owner claim workflows, Pacific Discovery Network can grow directory coverage faster while still protecting trust and owner control.",
      cta: "Systemise the pipeline",
      contact: {
        name: "Internal Operations",
        title: "Pacific Discovery Network",
        email: "Internal Use Only",
        website: "pacificdiscoverynetwork.com",
      },
      finalLine:
        "Discover publicly. Publish responsibly. Claim collaboratively. Convert over time.",
    },
  ],
};

export type StudentOutreachOperationsDeck = PresentationDeck;
