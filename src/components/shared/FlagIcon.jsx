import React from "react";
import { Globe } from "lucide-react";
import { COUNTRIES } from "@/constants/unifiedConstants";

// Map country values to ISO 3166-1 alpha-2 country codes
export const IDENTITY_TO_CODE = {
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
  "Other": "GLOBE",
};

export const GLOBE_IDENTITIES = ["Other"];

export default function FlagIcon({ identity, size = 24, className = "" }) {
  if (!identity) return null;

  // Handle different data formats
  let identities = [];
  
  if (Array.isArray(identity)) {
    identities = identity;
  } else if (typeof identity === 'string') {
    // Split comma-separated strings, but keep "Other" as single item
    if (identity.includes(',')) {
      identities = identity.split(',').map(id => id.trim()).filter(Boolean);
    } else {
      identities = [identity];
    }
  }

  if (identities.length === 0) return null;
  if (identities.length === 1) return <SingleFlagIcon identity={identities[0]} size={size} className={className} />;
  
  // Multiple flags - show them side by side
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {identities.slice(0, 3).map((id, index) => (
        <SingleFlagIcon key={id} identity={id} size={Math.min(size, 16)} />
      ))}
      {identities.length > 3 && (
        <span className="text-xs text-gray-500 ml-1">+{identities.length - 3}</span>
      )}
    </div>
  );
}

function SingleFlagIcon({ identity, size = 24, className = "" }) {
  if (!identity) return null;

  if (GLOBE_IDENTITIES.includes(identity)) {
    return <Globe className={`text-[#0d4f4f] ${className}`} style={{ width: size, height: size }} />;
  }

  // Normalize identity for better matching
  const normalizedIdentity = identity.trim();
  const lowerIdentity = normalizedIdentity.toLowerCase();
  
  // Try exact match first
  let code = IDENTITY_TO_CODE[normalizedIdentity];
  
  // If no exact match, try case-insensitive matching
  if (!code) {
    code = Object.keys(IDENTITY_TO_CODE).find(key => 
      key.toLowerCase() === lowerIdentity
    ) ? IDENTITY_TO_CODE[Object.keys(IDENTITY_TO_CODE).find(key => 
      key.toLowerCase() === lowerIdentity
    )] : null;
  }
  
  // Special handling for variations
  if (!code) {
    // Handle value to label mapping
    const country = COUNTRIES.find(c => c.value === normalizedIdentity);
    if (country) {
      code = IDENTITY_TO_CODE[country.label];
    }
  }
  
  // Special handling for New Zealand variations
  if (!code && lowerIdentity.includes('new zealand') && lowerIdentity.includes('maori')) {
    code = 'NZ';
  }
  
  if (!code || code === "GLOBE") return <Globe className={`text-[#0d4f4f] ${className}`} style={{ width: size, height: size }} />;

  const flagUrl = `https://purecatamphetamine.github.io/country-flag-icons/3x2/${code}.svg`;

  return (
    <img
      src={flagUrl}
      alt={identity}
      title={identity}
      style={{ width: size * 1.33, height: size, objectFit: "cover" }}
      className={`rounded-sm shadow-sm ${className}`}
    />
  );
}