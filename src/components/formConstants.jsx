export const COUNTRIES = [
  "Australia", "New Zealand", "Fiji", "Samoa", "Tonga", "Papua New Guinea", "Vanuatu", "Solomon Islands",
  "Cook Islands", "Kiribati", "Nauru", "Palau", "Marshall Islands", "Micronesia", "Tuvalu", "Niue",
  "United States", "United Kingdom", "Canada", "Other"
];

export const CATEGORIES = [
  "Agriculture", "Arts & Crafts", "Beauty & Personal Care", "Coaching (Business & Personal)",
  "Construction & Trade", "Digital & IT Technology", "Education & Training", "Finance & Insurance",
  "Food & Beverage", "Health & Wellness", "Hospitality & Tourism", "Legal Services", "Manufacturing",
  "Media & Entertainment", "Professional Services", "Transport & Logistics", "Other"
];

export const IDENTITIES = [
  "Australia",
  "Australia (Aboriginal & Torres Strait Islander)",
  "New Zealand",
  "New Zealand (Māori)",
  "Fiji",
  "Samoa",
  "American Samoa",
  "Tonga",
  "Cook Islands",
  "Niue",
  "Tokelau",
  "Tuvalu",
  "Kiribati",
  "Nauru",
  "Papua New Guinea",
  "Solomon Islands",
  "Vanuatu",
  "New Caledonia",
  "French Polynesia",
  "Wallis and Futuna",
  "Palau",
  "Marshall Islands",
  "Micronesia",
  "Guam",
  "Northern Mariana Islands",
  "Hawaii",
  "Rotuma",
  "Mixed Pacific",
  "Other"
];

export const FORM_FIELDS = {
  // Business Identity Fields
  name: { label: "Business Name", type: "text", placeholder: "e.g. Tala Pacific Consulting", required: true },
  handle: { label: "Registry Handle", type: "text", placeholder: "tala-pacific-consulting", required: true, helper: "Unique URL identifier. Lowercase letters, numbers and hyphens only." },
  country: { label: "Country", type: "select", options: COUNTRIES, required: true },
  city: { label: "City", type: "text", placeholder: "e.g. Auckland" },
  category: { label: "Industry Category", type: "select", options: CATEGORIES, required: true },
  subcategory: { label: "Subcategory", type: "text", placeholder: "Optional" },

  // Media Fields
  logo_url: { label: "Logo", type: "image", helper: "Recommended: 400x400px, max 2MB. Square format for best results." },
  banner_url: { label: "Banner", type: "image", helper: "Recommended: 1200x400px, max 3MB. Landscape format." },

  // Contact Fields
  email: { label: "Account Email (Login)", type: "email", placeholder: "your.email@example.com", helper: "Used to log in to your account" },
  contact_email: { label: "Business Email (Public)", type: "email", placeholder: "hello@business.com", helper: "Shown on your public profile for customer inquiries" },
  phone: { label: "Account Phone", type: "tel", placeholder: "+64 9 000 0000", helper: "Used to log in to your account" },
  contact_phone: { label: "Business Phone (Public)", type: "tel", placeholder: "+64 9 000 0000", helper: "Shown on your public profile for customer inquiries" },
  website: { label: "Website", type: "url", placeholder: "https://yourbusiness.com" },
  instagram: { label: "Instagram", type: "text", placeholder: "@handle" },
  facebook: { label: "Facebook", type: "text", placeholder: "Page URL or name" },
  tiktok: { label: "TikTok", type: "text", placeholder: "@handle" },
  linkedin: { label: "LinkedIn", type: "text", placeholder: "Company page URL" },

  // Description Fields
  tagline: { label: "Tagline", type: "text", placeholder: "One-line description", maxLength: 160 },
  description: { label: "Full Description", type: "textarea", placeholder: "Describe your products, services, and Pacific connection..." },

  // Identity Fields
  cultural_identity: { label: "Cultural Identity", type: "select", options: IDENTITIES },
  languages_spoken: { label: "Languages Spoken", type: "array", placeholder: "e.g. Samoan, English" },
  ownership_confirmed: { label: "Ownership Confirmation", type: "checkbox", text: "I confirm this business is majority-owned and operated by a person of Pacific heritage or descent." },

  // Additional Fields
  proof_links: { label: "Supporting Links", type: "array", placeholder: "Business registry, news articles, etc." },
};

export const TIER_BENEFITS = {
  free: {
    label: "Free",
    price: "$0/month",
    color: "gray",
    features: [
      "Basic listing in registry",
      "Business information & contact",
      "Text-only profile",
      "Search visibility"
    ]
  },
  verified: {
    label: "Verified",
    price: "$9/month",
    color: "teal",
    features: [
      "Everything in Free",
      "Verified badge",
      "Logo & banner images",
      "Enhanced profile styling",
      "Priority in search results",
      "Direct messaging capability"
    ]
  },
  featured_plus: {
    label: "Featured+",
    price: "$29/month",
    color: "gold",
    features: [
      "Everything in Verified",
      "Featured placement",
      "Golden badge",
      "Premium profile design",
      "Invoice generator tool",
      "QR code generator tool",
      "Analytics & insights",
      "Custom branding"
    ]
  }
};