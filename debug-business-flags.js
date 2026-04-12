// Debug script with exact business data

// Import the actual functions
function cleanToken(value) {
  return String(value ?? "")
    .trim()
    .replace(/^\{+|\}+$/g, "")
    .replace(/^"(.*)"$/, "$1")
    .trim();
}

function resolveCanonicalLabel(value) {
  const cleaned = cleanToken(value);
  if (!cleaned) return "";

  // From unifiedConstants.js - CULTURAL_IDENTITIES includes:
  const CULTURAL_IDENTITIES = [
    "Australia - Torres Strait Islander",
    "Australia - Aboriginal", 
    "Cook Islands Maori",
    "Fijian",
    "Indo-Fijian",
    "Rotuman",
    "I-Kiribati",
    "Marshallese",
    "Chuukese",
    "Pohnpeian",
    "Yapese",
    "Kosraean",
    "Nauruan",
    "New Zealand Maori",
    "Niuean",
    "Palauan",
    "Papuan",
    "Samoan",  // This should match!
    "Tongan",
    "Tuvaluan",
    "Ni-Vanuatu",
    // All countries including:
    "Samoa",
    "Cook Islands", 
    "French Polynesia",
    "New Zealand"
  ];

  // First try exact match in labels
  const exactMatch = CULTURAL_IDENTITIES.find((item) => item === cleaned);
  if (exactMatch) return exactMatch;

  // Try case-insensitive match in labels
  const caseInsensitiveMatch = CULTURAL_IDENTITIES.find(
    (item) => item.toLowerCase() === cleaned.toLowerCase()
  );
  if (caseInsensitiveMatch) return caseInsensitiveMatch;

  return cleaned;
}

function parseIdentities(identity) {
  if (!identity) return [];

  if (Array.isArray(identity)) {
    return identity.map(resolveCanonicalLabel).filter(Boolean);
  }

  const raw = String(identity).trim();
  if (!raw) return [];

  if (raw.startsWith("[") && raw.endsWith("]")) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map(resolveCanonicalLabel).filter(Boolean);
      }
    } catch {}
  }

  if (raw.startsWith("{") && raw.endsWith("}")) {
    return raw
      .slice(1, -1)
      .split(",")
      .map(resolveCanonicalLabel)
      .filter(Boolean);
  }

  if (raw.includes(",")) {
    return raw.split(",").map(resolveCanonicalLabel).filter(Boolean);
  }

  return [resolveCanonicalLabel(raw)];
}

const DISPLAY_TO_FLAG_COUNTRY = {
  "New Zealand Maori": "New Zealand",
  "Cook Islands Maori": "Cook Islands",
  "I-Kiribati": "Kiribati",
  "Marshallese": "Marshall Islands",
  "Chuukese": "Micronesia",
  "Pohnpeian": "Micronesia",
  "Yapese": "Micronesia",
  "Kosraean": "Micronesia",
  "Nauruan": "Nauru",
  "Niuean": "Niue",
  "Palauan": "Palau",
  "Papuan": "Papua New Guinea",
  "Samoan": "Samoa",  // This should map to Samoa
  "Tongan": "Tonga",
  "Tuvaluan": "Tuvalu",
  "Ni-Vanuatu": "Vanuatu",
  "Fijian": "Fiji",
  "Indo-Fijian": "Fiji",
  "Rotuman": "Fiji",
  "Australia - Torres Strait Islander": "Australia",
  "Australia - Aboriginal": "Australia",
};

const COUNTRY_FLAG_CODES = {
  "Samoa": "WS",  // This should be the result
  "Cook Islands": "CK",
  "French Polynesia": "PF",
  "New Zealand": "NZ",
};

function getFlagCountry(identity) {
  const label = resolveCanonicalLabel(identity);
  return DISPLAY_TO_FLAG_COUNTRY[label] || label || null;
}

function getFlagCode(identity) {
  const country = getFlagCountry(identity);
  return country ? COUNTRY_FLAG_CODES[country] || null : null;
}

// Test with exact data from businesses
console.log("=== DEBUGGING ACTUAL BUSINESS DATA ===\n");

// Test data from the businesses you mentioned
const testBusinesses = [
  {
    name: "USO Beer",
    cultural_identity: '["Samoa"]',
    country: "new-zealand"
  },
  {
    name: "DigitalDNA", 
    cultural_identity: '["Samoa"]',
    country: "new-zealand"
  },
  {
    name: "Ready Homes Pacific",
    cultural_identity: '["Samoa"]', 
    country: "samoa"
  },
  {
    name: "Jack's Shipping Containers",
    cultural_identity: '["Samoa"]',
    country: "new-zealand"
  }
];

testBusinesses.forEach((business, index) => {
  console.log(`=== ${business.name} ===`);
  console.log(`cultural_identity: ${business.cultural_identity}`);
  console.log(`country: ${business.country}`);
  
  const identities = parseIdentities(business.cultural_identity);
  console.log("Parsed identities:", identities);
  
  identities.forEach((identity, i) => {
    const displayLabel = resolveCanonicalLabel(identity);
    const flagCountry = getFlagCountry(identity);
    const flagCode = getFlagCode(identity);
    
    console.log(`  Identity ${i + 1}: "${identity}"`);
    console.log(`    Display Label: "${displayLabel}"`);
    console.log(`    Flag Country: "${flagCountry}"`);
    console.log(`    Flag Code: "${flagCode}"`);
    console.log(`    Expected: Samoa -> WS`);
  });
  
  console.log("");
});

// Test if there's any issue with the fallback logic
console.log("=== TESTING FALLBACK LOGIC ===\n");

const businessWithNoCulturalIdentity = {
  cultural_identity: null,
  country: "samoa"
};

console.log("Business with no cultural_identity but country='samoa':");
console.log("This would use getCountryDisplayName('samoa') fallback");

// Simulate getCountryDisplayName
function getCountryDisplayName(value) {
  const COUNTRIES = [
    { value: 'samoa', label: 'Samoa' },
    { value: 'new-zealand', label: 'New Zealand' },
    { value: 'cook-islands', label: 'Cook Islands' },
    { value: 'french-polynesia', label: 'French Polynesia' },
  ];
  
  const country = COUNTRIES.find(c => c.value === value);
  return country ? country.label : value;
}

const fallbackResult = getCountryDisplayName(businessWithNoCulturalIdentity.country);
console.log("Country fallback result:", fallbackResult);

// Test flag resolution for fallback
const fallbackFlagCountry = getFlagCountry(fallbackResult);
const fallbackFlagCode = getFlagCode(fallbackResult);
console.log("Fallback flag country:", fallbackFlagCountry);
console.log("Fallback flag code:", fallbackFlagCode);
