import React from "react";
import { Globe } from "lucide-react";

// Map cultural identity to ISO 3166-1 alpha-2 country codes
export const IDENTITY_TO_CODE = {
  "Australia": "AU",
  "Australia (Aboriginal & Torres Strait Islander)": "AU",
  "New Zealand": "NZ",
  "New Zealand (Māori)": "NZ",
  "Fiji": "FJ",
  "Samoa": "WS",
  "American Samoa": "AS",
  "Tonga": "TO",
  "Cook Islands": "CK",
  "Niue": "NU",
  "Tokelau": "TK",
  "Tuvalu": "TV",
  "Kiribati": "KI",
  "Nauru": "NR",
  "Papua New Guinea": "PG",
  "Solomon Islands": "SB",
  "Vanuatu": "VU",
  "New Caledonia": "NC",
  "French Polynesia": "PF",
  "Wallis and Futuna": "WF",
  "Palau": "PW",
  "Marshall Islands": "MH",
  "Micronesia": "FM",
  "Guam": "GU",
  "Northern Mariana Islands": "MP",
  "Hawaii": "US",
  "Rotuma": "FJ",
};

export const GLOBE_IDENTITIES = ["Mixed Pacific", "Other"];

export default function FlagIcon({ identity, size = 24, className = "" }) {
  if (!identity) return null;

  if (GLOBE_IDENTITIES.includes(identity)) {
    return <Globe className={`text-[#0d4f4f] ${className}`} style={{ width: size, height: size }} />;
  }

  const code = IDENTITY_TO_CODE[identity];
  if (!code) return <Globe className={`text-[#0d4f4f] ${className}`} style={{ width: size, height: size }} />;

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