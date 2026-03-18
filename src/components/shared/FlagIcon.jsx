import React from "react";
import { Globe } from "lucide-react";
import { COUNTRIES } from "@/constants/unifiedConstants";

// Comprehensive mapping for both Pacific and non-Pacific countries
export const IDENTITY_TO_CODE = {
  // Pacific countries (display names)
  "American Samoa": "AS",
  "Australia": "AU",
  "Australia Aboriginal": "AU",
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
  "New Zealand Māori": "NZ",
  "New Zealand Maori": "NZ",
  "Niue": "NU",
  "Northern Mariana Islands": "MP",
  "Palau": "PW",
  "Papua New Guinea": "PG",
  "Samoa": "WS",
  "Solomon Islands": "SB",
  "Tokelau": "TK",
  "Tonga": "TO",
  "Tuvalu": "TV",
  "United States": "US",
  "Vanuatu": "VU",
  "Wallis and Futuna": "WF",
  "Hawaii": "US",

  // Pacific countries (slug formats)
  "american-samoa": "AS",
  "australia": "AU",
  "australia-aboriginal": "AU",
  "cook-islands": "CK",
  "fiji": "FJ",
  "french-polynesia": "PF",
  "guam": "GU",
  "kiribati": "KI",
  "marshall-islands": "MH",
  "micronesia": "FM",
  "nauru": "NR",
  "new-caledonia": "NC",
  "new-zealand": "NZ",
  "new-zealand-maori": "NZ",
  "new-zealand-māori": "NZ",
  "niue": "NU",
  "northern-mariana-islands": "MP",
  "palau": "PW",
  "papua-new-guinea": "PG",
  "samoa": "WS",
  "solomon-islands": "SB",
  "tokelau": "TK",
  "tonga": "TO",
  "tuvalu": "TV",
  "united-states": "US",
  "vanuatu": "VU",
  "wallis-and-futuna": "WF",
  "hawaii": "US",

  // Major non-Pacific countries (display names)
  "Afghanistan": "AF",
  "Albania": "AL",
  "Algeria": "DZ",
  "Argentina": "AR",
  "Armenia": "AM",
  "Austria": "AT",
  "Bangladesh": "BD",
  "Belgium": "BE",
  "Brazil": "BR",
  "Canada": "CA",
  "Chile": "CL",
  "China": "CN",
  "Colombia": "CO",
  "Croatia": "HR",
  "Cuba": "CU",
  "Czech Republic": "CZ",
  "Denmark": "DK",
  "Egypt": "EG",
  "Estonia": "EE",
  "Finland": "FI",
  "France": "FR",
  "Germany": "DE",
  "Greece": "GR",
  "Hungary": "HU",
  "Iceland": "IS",
  "India": "IN",
  "Indonesia": "ID",
  "Iran": "IR",
  "Iraq": "IQ",
  "Ireland": "IE",
  "Israel": "IL",
  "Italy": "IT",
  "Jamaica": "JM",
  "Japan": "JP",
  "Jordan": "JO",
  "Kenya": "KE",
  "Lebanon": "LB",
  "Lithuania": "LT",
  "Luxembourg": "LU",
  "Malaysia": "MY",
  "Mexico": "MX",
  "Morocco": "MA",
  "Netherlands": "NL",
  "Norway": "NO",
  "Pakistan": "PK",
  "Peru": "PE",
  "Philippines": "PH",
  "Poland": "PL",
  "Portugal": "PT",
  "Romania": "RO",
  "Russia": "RU",
  "Saudi Arabia": "SA",
  "Singapore": "SG",
  "South Africa": "ZA",
  "South Korea": "KR",
  "Spain": "ES",
  "Sweden": "SE",
  "Switzerland": "CH",
  "Thailand": "TH",
  "Turkey": "TR",
  "Ukraine": "UA",
  "United Arab Emirates": "AE",
  "United Kingdom": "GB",
  "Vietnam": "VN",

  // Major non-Pacific countries (slug formats)
  "afghanistan": "AF",
  "albania": "AL",
  "algeria": "DZ",
  "argentina": "AR",
  "armenia": "AM",
  "austria": "AT",
  "bangladesh": "BD",
  "belgium": "BE",
  "brazil": "BR",
  "canada": "CA",
  "chile": "CL",
  "china": "CN",
  "colombia": "CO",
  "croatia": "HR",
  "cuba": "CU",
  "czech-republic": "CZ",
  "denmark": "DK",
  "egypt": "EG",
  "estonia": "EE",
  "finland": "FI",
  "france": "FR",
  "germany": "DE",
  "greece": "GR",
  "hungary": "HU",
  "iceland": "IS",
  "india": "IN",
  "indonesia": "ID",
  "iran": "IR",
  "iraq": "IQ",
  "ireland": "IE",
  "israel": "IL",
  "italy": "IT",
  "jamaica": "JM",
  "japan": "JP",
  "jordan": "JO",
  "kenya": "KE",
  "lebanon": "LB",
  "lithuania": "LT",
  "luxembourg": "LU",
  "malaysia": "MY",
  "mexico": "MX",
  "morocco": "MA",
  "netherlands": "NL",
  "norway": "NO",
  "pakistan": "PK",
  "peru": "PE",
  "philippines": "PH",
  "poland": "PL",
  "portugal": "PT",
  "romania": "RO",
  "russia": "RU",
  "saudi-arabia": "SA",
  "singapore": "SG",
  "south-africa": "ZA",
  "south-korea": "KR",
  "spain": "ES",
  "sweden": "SE",
  "switzerland": "CH",
  "thailand": "TH",
  "turkey": "TR",
  "ukraine": "UA",
  "united-arab-emirates": "AE",
  "united-kingdom": "GB",
  "vietnam": "VN",

  // common aliases
  "UK": "GB",
  "uk": "GB",
  "England": "GB",
  "england": "GB",
  "USA": "US",
  "usa": "US",
  "United States of America": "US",

  // Special cases
  "Other": "GLOBE",
  "Unknown": "GLOBE",
  "other": "GLOBE",
  "unknown": "GLOBE",
};

export const GLOBE_IDENTITIES = ["Other", "Unknown", "other", "unknown"];

function parseIdentities(identity) {
  if (!identity) return [];

  if (Array.isArray(identity)) {
    return identity
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  if (typeof identity === "string") {
    const trimmed = identity.trim();

    if (!trimmed) return [];

    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed
            .map((item) => String(item).trim())
            .filter(Boolean);
        }
      } catch {
        // continue below
      }
    }

    if (trimmed.includes(",")) {
      return trimmed
        .split(",")
        .map((item) => item.replace(/"/g, "").trim())
        .filter(Boolean);
    }

    return [trimmed];
  }

  return [];
}

function dedupeIdentities(identities) {
  const seen = new Set();
  return identities.filter((item) => {
    const key = item.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// Helper to normalize identity values
function normalizeIdentity(identity) {
  if (!identity) return "";

  const trimmed = String(identity).trim();

  if (IDENTITY_TO_CODE[trimmed]) {
    return trimmed;
  }

  const lowerTrimmed = trimmed.toLowerCase();

  const matchedKey = Object.keys(IDENTITY_TO_CODE).find(
    (key) => key.toLowerCase() === lowerTrimmed
  );

  if (matchedKey) {
    return matchedKey;
  }

  const country = COUNTRIES.find(
    (c) =>
      c.value === trimmed ||
      c.value?.toLowerCase() === lowerTrimmed ||
      c.label?.toLowerCase() === lowerTrimmed
  );

  if (country) {
    if (IDENTITY_TO_CODE[country.label]) return country.label;
    if (IDENTITY_TO_CODE[country.value]) return country.value;
  }

  return trimmed;
}

// Helper to get display name for tooltip
function getDisplayName(identity) {
  if (!identity) return "";

  const normalized = normalizeIdentity(identity);

  const specialCases = {
    "new-zealand": "New Zealand",
    "new zealand": "New Zealand",
    "new-zealand-maori": "New Zealand",
    "new zealand maori": "New Zealand",
    "new-zealand-māori": "New Zealand",
    "new zealand māori": "New Zealand",
    "french-polynesia": "French Polynesia",
    "french polynesia": "French Polynesia",
    "cook-islands": "Cook Islands",
    "cook islands": "Cook Islands",
    "papua-new-guinea": "Papua New Guinea",
    "papua new guinea": "Papua New Guinea",
    "solomon-islands": "Solomon Islands",
    "solomon islands": "Solomon Islands",
    "northern-mariana-islands": "Northern Mariana Islands",
    "northern mariana islands": "Northern Mariana Islands",
    "wallis-and-futuna": "Wallis and Futuna",
    "wallis and futuna": "Wallis and Futuna",
    "united-states": "United States",
    "united states": "United States",
    "united-kingdom": "United Kingdom",
    "united kingdom": "United Kingdom",
    "united-arab-emirates": "United Arab Emirates",
    "united arab emirates": "United Arab Emirates",
    "south-africa": "South Africa",
    "south africa": "South Africa",
    "south-korea": "South Korea",
    "south korea": "South Korea",
    "saudi-arabia": "Saudi Arabia",
    "saudi arabia": "Saudi Arabia",
  };

  if (specialCases[normalized]) {
    return specialCases[normalized];
  }

  if (normalized.includes("-")) {
    return normalized
      .split("-")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  return normalized;
}

function Tooltip({ label, children }) {
  return (
    <div className="group relative inline-flex items-center">
      {children}
      <div className="pointer-events-none absolute bottom-full left-1/2 z-[9999] mb-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#0a1628] px-2 py-1 text-[10px] font-medium text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
        {label}
        <div className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 bg-[#0a1628]" />
      </div>
    </div>
  );
}

function FlagVisual({ code, displayName, size = 24, className = "" }) {
  const width = Math.round(size * 1.35);
  const flagUrl = `https://purecatamphetamine.github.io/country-flag-icons/3x2/${code}.svg`;

  return (
    <>
      <img
        src={flagUrl}
        alt={displayName}
        style={{ width, height: size, objectFit: "cover" }}
        className={`rounded-md shadow-sm ring-1 ring-black/5 ${className}`}
        onError={(e) => {
          const target = e.currentTarget;
          target.style.display = "none";
          const fallback = target.nextElementSibling;
          if (fallback instanceof HTMLElement) {
            fallback.style.display = "flex";
          }
        }}
      />
      <div
        className={`hidden items-center justify-center rounded-md bg-slate-100 text-[#0d4f4f] shadow-sm ring-1 ring-black/5 ${className}`}
        style={{ width, height: size }}
      >
        <Globe style={{ width: size * 0.7, height: size * 0.7 }} />
      </div>
    </>
  );
}

function SingleFlagIcon({
  identity,
  size = 24,
  className = "",
  showTooltip = true,
}) {
  if (!identity) return null;

  const normalizedIdentity = normalizeIdentity(identity);
  const displayName = getDisplayName(identity);

  const isGlobe =
    GLOBE_IDENTITIES.includes(normalizedIdentity) ||
    GLOBE_IDENTITIES.includes(identity);

  if (isGlobe) {
    const globeEl = (
      <div
        className={`inline-flex items-center justify-center rounded-md bg-slate-100 text-[#0d4f4f] shadow-sm ring-1 ring-black/5 ${className}`}
        style={{ width: size, height: size }}
      >
        <Globe style={{ width: size * 0.7, height: size * 0.7 }} />
      </div>
    );

    return showTooltip ? (
      <Tooltip label={displayName}>{globeEl}</Tooltip>
    ) : (
      globeEl
    );
  }

  const code = IDENTITY_TO_CODE[normalizedIdentity];

  if (!code || code === "GLOBE") {
    const fallbackEl = (
      <div
        className={`inline-flex items-center justify-center rounded-md bg-slate-100 text-[#0d4f4f] shadow-sm ring-1 ring-black/5 ${className}`}
        style={{ width: size, height: size }}
      >
        <Globe style={{ width: size * 0.7, height: size * 0.7 }} />
      </div>
    );

    return showTooltip ? (
      <Tooltip label={displayName || identity}>{fallbackEl}</Tooltip>
    ) : (
      fallbackEl
    );
  }

  const flagEl = (
    <FlagVisual
      code={code}
      displayName={displayName}
      size={size}
      className={className}
    />
  );

  return showTooltip ? <Tooltip label={displayName}>{flagEl}</Tooltip> : flagEl;
}

export default function FlagIcon({
  identity,
  size = 24,
  className = "",
  showTooltip = true,
  maxFlags = 3,
}) {
  const identities = dedupeIdentities(parseIdentities(identity));

  if (!identities.length) return null;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {identities.slice(0, maxFlags).map((item, index) => (
        <SingleFlagIcon
          key={`${item}-${index}`}
          identity={item}
          size={size}
          showTooltip={showTooltip}
        />
      ))}

      {identities.length > maxFlags && (
        <span className="text-xs text-gray-500">+{identities.length - maxFlags}</span>
      )}
    </div>
  );
}