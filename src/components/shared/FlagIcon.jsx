import React from "react";
import { Globe } from "lucide-react";
import { COUNTRIES } from "@/constants/unifiedConstants";

// Comprehensive mapping for both Pacific and non-Pacific countries
// Supports both display names and slug formats
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
  
  // Special cases
  "Other": "GLOBE",
  "Unknown": "GLOBE",
  "other": "GLOBE",
  "unknown": "GLOBE"
};

export const GLOBE_IDENTITIES = ["Other", "Unknown", "other", "unknown"];

// Helper to normalize identity values
function normalizeIdentity(identity) {
  if (!identity) return "";
  
  const trimmed = identity.trim();
  
  // If it's already in our mapping, return as-is
  if (IDENTITY_TO_CODE[trimmed]) {
    return trimmed;
  }
  
  // Try to find case-insensitive match
  const lowerTrimmed = trimmed.toLowerCase();
  const matchedKey = Object.keys(IDENTITY_TO_CODE).find(key => 
    key.toLowerCase() === lowerTrimmed
  );
  
  if (matchedKey) {
    return matchedKey;
  }
  
  // Handle value-to-label mapping from COUNTRIES constant
  const country = COUNTRIES.find(c => c.value === trimmed);
  if (country && IDENTITY_TO_CODE[country.label]) {
    return country.label;
  }
  
  // Return original if no match found
  return trimmed;
}

// Helper to get display name for tooltip
function getDisplayName(identity) {
  if (!identity) return "";
  
  const normalized = normalizeIdentity(identity);
  
  // Convert slugs to readable names with better mapping
  if (normalized.includes('-') || normalized.includes(' ')) {
    // Special cases for common Pacific countries (handle both hyphens and spaces)
    const specialCases = {
      'new-zealand': 'New Zealand',
      'new zealand': 'New Zealand',
      'new-zealand-maori': 'New Zealand',
      'new zealand maori': 'New Zealand',
      'new-zealand-māori': 'New Zealand',
      'new zealand māori': 'New Zealand',
      'french-polynesia': 'French Polynesia',
      'french polynesia': 'French Polynesia',
      'cook-islands': 'Cook Islands',
      'cook islands': 'Cook Islands',
      'papua-new-guinea': 'Papua New Guinea',
      'papua new guinea': 'Papua New Guinea',
      'solomon-islands': 'Solomon Islands',
      'solomon islands': 'Solomon Islands',
      'northern-mariana-islands': 'Northern Mariana Islands',
      'northern mariana islands': 'Northern Mariana Islands',
      'wallis-and-futuna': 'Wallis and Futuna',
      'wallis and futuna': 'Wallis and Futuna',
      'united-states': 'United States',
      'united states': 'United States',
      'united-kingdom': 'United Kingdom',
      'united kingdom': 'United Kingdom',
      'united-arab-emirates': 'United Arab Emirates',
      'united arab emirates': 'United Arab Emirates',
      'south-africa': 'South Africa',
      'south africa': 'South Africa',
      'south-korea': 'South Korea',
      'south korea': 'South Korea',
      'saudi-arabia': 'Saudi Arabia',
      'saudi arabia': 'Saudi Arabia',
      'costa-rica': 'Costa Rica',
      'costa rica': 'Costa Rica',
      'puerto-rico': 'Puerto Rico',
      'puerto rico': 'Puerto Rico',
      'sri-lanka': 'Sri Lanka',
      'sri lanka': 'Sri Lanka',
      'trinidad-tobago': 'Trinidad and Tobago',
      'trinidad tobago': 'Trinidad and Tobago'
    };
    
    if (specialCases[normalized]) {
      return specialCases[normalized];
    }
    
    // Default conversion for hyphens
    if (normalized.includes('-')) {
      return normalized
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    
    // Default conversion for spaces (should already be readable)
    return normalized;
  }
  
  return normalized;
}

export default function FlagIcon({ identity, size = 24, className = "", showTooltip = true }) {
  if (!identity) return null;

  // Handle different data formats
  let identities = [];
  
  if (Array.isArray(identity)) {
    identities = identity.filter(Boolean);
  } else if (typeof identity === 'string') {
    // Handle JSON strings
    if (identity.startsWith('[') && identity.endsWith(']')) {
      try {
        const parsed = JSON.parse(identity);
        identities = Array.isArray(parsed) ? parsed.filter(Boolean) : [identity];
      } catch {
        // Handle comma-separated strings
        identities = identity.split(',').map(id => id.trim()).filter(Boolean);
      }
    } else if (identity.includes(',')) {
      identities = identity.split(',').map(id => id.trim()).filter(Boolean);
    } else {
      identities = [identity];
    }
  }

  if (identities.length === 0) return null;
  
  if (identities.length === 1) {
    return (
      <SingleFlagIcon 
        identity={identities[0]} 
        size={size} 
        className={className}
        showTooltip={showTooltip}
      />
    );
  }
  
  // Multiple flags - show them side by side with consistent size
  const flagSize = Math.min(size, 20);
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {identities.slice(0, 3).map((id, index) => (
        <SingleFlagIcon 
          key={`${id}-${index}`} 
          identity={id} 
          size={flagSize}
          showTooltip={showTooltip}
        />
      ))}
      {identities.length > 3 && (
        <span className="text-xs text-gray-500 ml-1">+{identities.length - 3}</span>
      )}
    </div>
  );
}

function SingleFlagIcon({ identity, size = 24, className = "", showTooltip = true }) {
  if (!identity) return null;

  const normalizedIdentity = normalizeIdentity(identity);
  const displayName = getDisplayName(identity);
  
  // Check if this should be a globe
  if (GLOBE_IDENTITIES.includes(normalizedIdentity) || GLOBE_IDENTITIES.includes(identity)) {
    const globeElement = (
      <Globe 
        className={`text-[#0d4f4f] ${className}`} 
        style={{ width: size, height: size }} 
      />
    );
    
    if (showTooltip) {
      return (
        <div className="group relative inline-block">
          {globeElement}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-[#0a1628] text-white text-[10px] font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
            {displayName}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#0a1628] rotate-45 -mt-1"></div>
          </div>
        </div>
      );
    }
    
    return globeElement;
  }

  // Get country code
  const code = IDENTITY_TO_CODE[normalizedIdentity];
  
  if (!code || code === "GLOBE") {
    const globeElement = (
      <Globe 
        className={`text-[#0d4f4f] ${className}`} 
        style={{ width: size, height: size }} 
      />
    );
    
    if (showTooltip) {
      return (
        <div className="group relative inline-block">
          {globeElement}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-[#0a1628] text-white text-[10px] font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
            {displayName || identity}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#0a1628] rotate-45 -mt-1"></div>
          </div>
        </div>
      );
    }
    
    return globeElement;
  }

  const flagUrl = `https://purecatamphetamine.github.io/country-flag-icons/3x2/${code}.svg`;
  const flagElement = (
    <img
      src={flagUrl}
      alt={displayName}
      style={{ width: size * 1.33, height: size, objectFit: "cover" }}
      className={`rounded-sm shadow-sm ${className}`}
      onError={(e) => {
        // Fallback to globe on error
        const target = e.target;
        if (target instanceof HTMLImageElement) {
          target.style.display = 'none';
          const nextElement = target.nextElementSibling;
          if (nextElement instanceof HTMLElement) {
            nextElement.style.display = 'block';
          }
        }
      }}
    />
  );

  if (showTooltip) {
    return (
      <div className="group relative inline-block">
        {flagElement}
        <Globe 
          className={`text-[#0d4f4f] ${className}`} 
          style={{ width: size, height: size, display: 'none' }} 
        />
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-[#0a1628] text-white text-[10px] font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
          {displayName}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#0a1628] rotate-45 -mt-1"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      {flagElement}
      <Globe 
        className={`text-[#0d4f4f] ${className}`} 
        style={{ width: size, height: size, display: 'none' }} 
      />
    </>
  );
}
