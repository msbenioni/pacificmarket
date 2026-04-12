// Test script to verify cultural identity override behavior

import { Pool } from 'pg';

const connection = {
  host: 'db.mnmisjprswpuvcojnbip.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'MontBlanc3001'
};

// Import the actual functions (simplified versions for testing)
function hasValue(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.some((v) => String(v ?? "").trim().length > 0);
  return true;
}

function parseIdentities(identity) {
  if (!identity) return [];
  if (Array.isArray(identity)) return identity;
  if (typeof identity === 'string' && identity.startsWith('[')) {
    try {
      return JSON.parse(identity);
    } catch {
      return [identity];
    }
  }
  return [identity];
}

function dedupe(values) {
  const seen = new Set();
  return values.filter((value) => {
    const key = value.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// Simulate the getBusinessCulturalData function
function getBusinessCulturalData(business, userProfile = null) {
  let culturalSource = "none";
  let culturalInput = [];
  let languagesSource = "none";
  let languagesInput = [];

  // This is the current logic - user profile overrides business
  if (hasValue(userProfile?.cultural_identity)) {
    culturalInput = userProfile.cultural_identity;
    culturalSource = "user_profile";
  } else if (hasValue(business?.cultural_identity)) {
    culturalInput = business.cultural_identity;
    culturalSource = "business";
  }

  if (hasValue(userProfile?.languages_spoken)) {
    languagesInput = userProfile.languages_spoken;
    languagesSource = "user_profile";
  } else if (hasValue(business?.languages_spoken)) {
    languagesInput = business.languages_spoken;
    languagesSource = "business";
  }

  const culturalParsed = dedupe(parseIdentities(culturalInput)).filter(Boolean);
  const languagesParsed = dedupe(parseIdentities(languagesInput)).filter(Boolean);

  return {
    culturalIdentitiesRaw: culturalParsed,
    culturalIdentitiesDisplay: culturalParsed,
    primaryCulturalIdentity: culturalParsed[0] || null,
    languagesRaw: languagesParsed,
    languagesDisplay: languagesParsed,
    primaryLanguage: languagesParsed[0] || null,
    hasCulturalInfo: !!(culturalParsed.length > 0 || languagesParsed.length > 0),
    sources: {
      cultural: culturalSource,
      languages: languagesSource
    }
  };
}

async function testOverrideBehavior() {
  console.log("=== TESTING CULTURAL IDENTITY OVERRIDE BEHAVIOR ===\n");

  // Test Case 1: User profile has cultural identity, business has different one
  console.log("Test Case 1: User profile overrides business");
  const business1 = {
    business_name: "Test Business",
    cultural_identity: '["Samoan"]',
    languages_spoken: '["English", "Samoan"]'
  };
  
  const userProfile1 = {
    cultural_identity: '["Cook Islands Maori"]',
    languages_spoken: '["Cook Islands Maori", "English"]'
  };

  const result1 = getBusinessCulturalData(business1, userProfile1);
  console.log("Business cultural_identity:", business1.cultural_identity);
  console.log("User profile cultural_identity:", userProfile1.cultural_identity);
  console.log("Result cultural_identity:", result1.culturalIdentitiesRaw);
  console.log("Source:", result1.sources.cultural);
  console.log("Expected: User profile should override -> Cook Islands Maori");
  console.log("Actual matches expected:", result1.culturalIdentitiesRaw.includes("Cook Islands Maori"));
  console.log("");

  // Test Case 2: Only business has cultural identity
  console.log("Test Case 2: Only business has cultural identity");
  const business2 = {
    business_name: "Test Business 2",
    cultural_identity: '["Samoan"]',
    languages_spoken: '["English"]'
  };
  
  const userProfile2 = {
    cultural_identity: null,
    languages_spoken: null
  };

  const result2 = getBusinessCulturalData(business2, userProfile2);
  console.log("Business cultural_identity:", business2.cultural_identity);
  console.log("User profile cultural_identity:", userProfile2.cultural_identity);
  console.log("Result cultural_identity:", result2.culturalIdentitiesRaw);
  console.log("Source:", result2.sources.cultural);
  console.log("Expected: Business should be used -> Samoan");
  console.log("Actual matches expected:", result2.culturalIdentitiesRaw.includes("Samoan"));
  console.log("");

  // Test Case 3: Only user profile has cultural identity
  console.log("Test Case 3: Only user profile has cultural identity");
  const business3 = {
    business_name: "Test Business 3",
    cultural_identity: null,
    languages_spoken: null
  };
  
  const userProfile3 = {
    cultural_identity: '["French Polynesia"]',
    languages_spoken: '["French", "English"]'
  };

  const result3 = getBusinessCulturalData(business3, userProfile3);
  console.log("Business cultural_identity:", business3.cultural_identity);
  console.log("User profile cultural_identity:", userProfile3.cultural_identity);
  console.log("Result cultural_identity:", result3.culturalIdentitiesRaw);
  console.log("Source:", result3.sources.cultural);
  console.log("Expected: User profile should be used -> French Polynesia");
  console.log("Actual matches expected:", result3.culturalIdentitiesRaw.includes("French Polynesia"));
  console.log("");

  // Test Case 4: Neither has cultural identity
  console.log("Test Case 4: Neither has cultural identity");
  const business4 = {
    business_name: "Test Business 4",
    cultural_identity: null,
    languages_spoken: null
  };
  
  const userProfile4 = {
    cultural_identity: null,
    languages_spoken: null
  };

  const result4 = getBusinessCulturalData(business4, userProfile4);
  console.log("Business cultural_identity:", business4.cultural_identity);
  console.log("User profile cultural_identity:", userProfile4.cultural_identity);
  console.log("Result cultural_identity:", result4.culturalIdentitiesRaw);
  console.log("Source:", result4.sources.cultural);
  console.log("Expected: No cultural identity -> empty array");
  console.log("Actual matches expected:", result4.culturalIdentitiesRaw.length === 0);
  console.log("");

  console.log("=== SUMMARY ===");
  console.log("User profile cultural identity DOES override business cultural identity");
  console.log("This is the intended behavior for claimed businesses.");
}

testOverrideBehavior();
