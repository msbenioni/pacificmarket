// Tier Benefits Configuration for Pacific Market
// Pacific-inspired tier system with features and pricing

export const TIER_BENEFITS = {
  vaka: {
    label: "Vaka",
    price: "$0/month",
    color: "gray",
    description: "Begin the journey",
    subtitle: "Start your journey in the Pacific Market registry",
    features: [
      "Public registry listing",
      "Business name, country and industry", 
      "Public discoverability",
      "Registry record number"
    ]
  },
  mana: {
    label: "Mana",
    price: "$9/month",
    color: "teal",
    description: "Build trust and presence",
    subtitle: "Strengthen your presence with branding and trust signals",
    features: [
      "Everything in Vaka",
      "Logo and banner image",
      "Full business profile", 
      "Trust badge",
      "Priority placement in search"
    ]
  },
  moana: {
    label: "Moana", 
    price: "$29/month",
    color: "gold",
    description: "Expand your reach",
    subtitle: "Premium visibility and business tools",
    features: [
      "Everything in Mana",
      "Invoice generator",
      "QR code generator", 
      "Homepage spotlight",
      "Premium visibility across platform"
    ]
  }
};

// Helper function to get tier benefits by tier name
export const getTierBenefits = (tier) => {
  return TIER_BENEFITS[tier] || TIER_BENEFITS.vaka;
};

// Helper function to get all tier features as a flat list
export const getAllTierFeatures = () => {
  const allFeatures = new Set();
  Object.values(TIER_BENEFITS).forEach(tier => {
    tier.features.forEach(feature => allFeatures.add(feature));
  });
  return Array.from(allFeatures);
};
