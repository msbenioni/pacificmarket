import React from "react";
import { Globe } from "lucide-react";
import { COUNTRIES, CULTURAL_IDENTITIES, getCountryFromCulturalIdentity } from "@/constants/unifiedConstants";

const ALL_VALID_LABELS = [
  ...CULTURAL_IDENTITIES,
  ...COUNTRIES.map((c) => c.label),
];

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
  "Hawaii": "US",

  "Afghanistan": "AF",
  "Albania": "AL",
  "Algeria": "DZ",
  "Andorra": "AD",
  "Angola": "AO",
  "Argentina": "AR",
  "Armenia": "AM",
  "Austria": "AT",
  "Azerbaijan": "AZ",
  "Bahamas": "BS",
  "Bangladesh": "BD",
  "Barbados": "BB",
  "Belarus": "BY",
  "Belgium": "BE",
  "Belize": "BZ",
  "Benin": "BJ",
  "Bhutan": "BT",
  "Bolivia": "BO",
  "Bosnia and Herzegovina": "BA",
  "Botswana": "BW",
  "Brazil": "BR",
  "Bulgaria": "BG",
  "Burkina Faso": "BF",
  "Burundi": "BI",
  "Cambodia": "KH",
  "Cameroon": "CM",
  "Canada": "CA",
  "Central African Republic": "CF",
  "Chad": "TD",
  "Chile": "CL",
  "China": "CN",
  "Colombia": "CO",
  "Comoros": "KM",
  "Congo": "CG",
  "Costa Rica": "CR",
  "Croatia": "HR",
  "Cuba": "CU",
  "Cyprus": "CY",
  "Czech Republic": "CZ",
  "Denmark": "DK",
  "Djibouti": "DJ",
  "Dominican Republic": "DO",
  "Ecuador": "EC",
  "Egypt": "EG",
  "El Salvador": "SV",
  "Estonia": "EE",
  "Ethiopia": "ET",
  "Finland": "FI",
  "France": "FR",
  "Gabon": "GA",
  "Gambia": "GM",
  "Georgia": "GE",
  "Germany": "DE",
  "Ghana": "GH",
  "Greece": "GR",
  "Grenada": "GD",
  "Guatemala": "GT",
  "Guinea": "GN",
  "Guinea-Bissau": "GW",
  "Guyana": "GY",
  "Haiti": "HT",
  "Honduras": "HN",
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
  "Kazakhstan": "KZ",
  "Kenya": "KE",
  "Kosovo": "XK",
  "Kuwait": "KW",
  "Kyrgyzstan": "KG",
  "Laos": "LA",
  "Latvia": "LV",
  "Lebanon": "LB",
  "Lesotho": "LS",
  "Liberia": "LR",
  "Libya": "LY",
  "Liechtenstein": "LI",
  "Lithuania": "LT",
  "Luxembourg": "LU",
  "Madagascar": "MG",
  "Malawi": "MW",
  "Malaysia": "MY",
  "Maldives": "MV",
  "Mali": "ML",
  "Malta": "MT",
  "Mauritania": "MR",
  "Mauritius": "MU",
  "Mexico": "MX",
  "Moldova": "MD",
  "Monaco": "MC",
  "Mongolia": "MN",
  "Montenegro": "ME",
  "Morocco": "MA",
  "Mozambique": "MZ",
  "Myanmar": "MM",
  "Namibia": "NA",
  "Nepal": "NP",
  "Netherlands": "NL",
  "Nigeria": "NG",
  "North Macedonia": "MK",
  "Norway": "NO",
  "Oman": "OM",
  "Pakistan": "PK",
  "Panama": "PA",
  "Paraguay": "PY",
  "Peru": "PE",
  "Philippines": "PH",
  "Poland": "PL",
  "Portugal": "PT",
  "Qatar": "QA",
  "Romania": "RO",
  "Russia": "RU",
  "Rwanda": "RW",
  "Saudi Arabia": "SA",
  "Senegal": "SN",
  "Serbia": "RS",
  "Sierra Leone": "SL",
  "Singapore": "SG",
  "Slovakia": "SK",
  "Slovenia": "SI",
  "South Africa": "ZA",
  "South Korea": "KR",
  "Spain": "ES",
  "Sri Lanka": "LK",
  "Sudan": "SD",
  "Sweden": "SE",
  "Switzerland": "CH",
  "Syria": "SY",
  "Taiwan": "TW",
  "Tajikistan": "TJ",
  "Tanzania": "TZ",
  "Thailand": "TH",
  "Tunisia": "TN",
  "Turkey": "TR",
  "Turkmenistan": "TM",
  "Uganda": "UG",
  "Ukraine": "UA",
  "United Arab Emirates": "AE",
  "United Kingdom": "GB",
  "United States": "US",
  "Uruguay": "UY",
  "Uzbekistan": "UZ",
  "Venezuela": "VE",
  "Vietnam": "VN",
  "Yemen": "YE",
  "Zambia": "ZM",
  "Zimbabwe": "ZW",
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

  const exactMatch = ALL_VALID_LABELS.find((item) => item === cleaned);
  if (exactMatch) return exactMatch;

  const caseInsensitiveMatch = ALL_VALID_LABELS.find(
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

function dedupe(values) {
  const seen = new Set();
  return values.filter((value) => {
    const key = value.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getDisplayLabel(identity) {
  return resolveCanonicalLabel(identity);
}

function getFlagCountry(identity) {
  const label = resolveCanonicalLabel(identity);

  return (
    getCountryFromCulturalIdentity(label) ||
    COUNTRIES.find((c) => c.label === label)?.label ||
    null
  );
}

function getFlagCode(identity) {
  const country = getFlagCountry(identity);
  if (!country) return null;
  return COUNTRY_FLAG_CODES[country] || null;
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
  const displayName = getDisplayLabel(identity);
  if (!displayName) return null;

  const code = getFlagCode(identity);

  const content = code ? (
    <FlagVisual
      code={code}
      displayName={displayName}
      size={size}
      className={className}
    />
  ) : (
    <div
      className={`inline-flex items-center justify-center rounded-md bg-slate-100 text-[#0d4f4f] shadow-sm ring-1 ring-black/5 ${className}`}
      style={{ width: size, height: size }}
    >
      <Globe style={{ width: size * 0.7, height: size * 0.7 }} />
    </div>
  );

  return showTooltip ? <Tooltip label={displayName}>{content}</Tooltip> : content;
}

export default function FlagIcon({
  identity,
  size = 24,
  className = "",
  showTooltip = true,
  maxFlags = 3,
}) {
  const identities = dedupe(parseIdentities(identity));

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
        <span className="text-xs text-gray-500">
          +{identities.length - maxFlags}
        </span>
      )}
    </div>
  );
}
