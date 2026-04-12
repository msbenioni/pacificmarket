// Test script to debug flag resolution for Samoa cultural identity

// Mock the parsing logic
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
  "Samoan",
  "Tongan",
  "Tuvaluan",
  "Ni-Vanuatu",
  // All countries
  "Samoa",
  "Cook Islands", 
  "French Polynesia",
  // ... more countries
];

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
  "Samoan": "Samoa",
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
  "American Samoa": "AS",
  "Australia": "AU",
  "Cook Islands": "CK",
  "Fiji": "FJ",
  "French Polynesia": "PF",
  "Guam": "GU",
  "Kiribati": "KI",
  "Marshall Islands": "MH",
  "Micronesia": "FM",
  "Nauru": "NR",
  "New Caledonia": "NC",
  "New Zealand": "NZ",
  "Niue": "NU",
  "Northern Mariana Islands": "MP",
  "Palau": "PW",
  "Papua New Guinea": "PG",
  "Samoa": "WS",
  "Solomon Islands": "SB",
  "Tokelau": "TK",
  "Tonga": "TO",
  "Tuvalu": "TV",
  "Vanuatu": "VU",
  "Wallis and Futuna": "WF",
};

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

function getFlagCountry(identity) {
  const label = resolveCanonicalLabel(identity);
  return DISPLAY_TO_FLAG_COUNTRY[label] || label || null;
}

function getFlagCode(identity) {
  const country = getFlagCountry(identity);
  return country ? COUNTRY_FLAG_CODES[country] || null : null;
}

function getFlagAssetUrl(code) {
  if (!code) return null;
  return `https://flagcdn.com/${code.toLowerCase()}.svg`;
}

// Test the actual data from the businesses
const testData = [
  '["Samoa"]',  // USO Beer, DigitalDNA, Ready Homes Pacific, Jack's Shipping Containers
  '["Cook Islands Maori"]', // Kuki Lunchbox
  '["French Polynesia"]', // FOXIT, L'ame Du Pareu
];

console.log("=== FLAG RESOLUTION TEST ===\n");

testData.forEach((identity, index) => {
  console.log(`Test ${index + 1}: ${identity}`);
  
  const identities = parseIdentities(identity);
  console.log("Parsed identities:", identities);
  
  identities.forEach((parsedIdentity, i) => {
    const displayLabel = resolveCanonicalLabel(parsedIdentity);
    const flagCountry = getFlagCountry(parsedIdentity);
    const flagCode = getFlagCode(parsedIdentity);
    const flagUrl = getFlagAssetUrl(flagCode);
    
    console.log(`  Identity ${i + 1}:`);
    console.log(`    Raw: "${parsedIdentity}"`);
    console.log(`    Display: "${displayLabel}"`);
    console.log(`    Flag Country: "${flagCountry}"`);
    console.log(`    Flag Code: "${flagCode}"`);
    console.log(`    Flag URL: "${flagUrl}"`);
  });
  
  console.log("");
});
