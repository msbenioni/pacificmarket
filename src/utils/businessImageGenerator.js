// Business Image Generator - Creates placeholder logos and banners based on business name

const toSvgDataUrl = (svg) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

const safeFileBase = (name) =>
  (name || "business")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "business";

export const generateBusinessLogo = (businessName) => {
  if (!businessName) return null;
  
  // Extract initials from business name (max 2 characters)
  const words = businessName.trim().split(/\s+/);
  let initials = '';
  
  if (words.length >= 2) {
    initials = words[0][0] + words[1][0];
  } else if (words.length === 1) {
    initials = words[0].substring(0, 2).toUpperCase();
  }
  
  initials = initials.toUpperCase();
  
  // Generate SVG logo with initials
  const colors = [
    ['#0d4f4f', '#ffffff'], // Dark teal with white
    ['#00c4cc', '#0a1628'], // Light teal with dark
    ['#c9a84c', '#0a1628'], // Gold with dark
    ['#1e40af', '#ffffff'], // Blue with white
    ['#dc2626', '#ffffff'], // Red with white
    ['#059669', '#ffffff'], // Green with white
  ];
  
  const colorPair = colors[Math.abs(businessName.charCodeAt(0)) % colors.length];
  const [bgColor, textColor] = colorPair;
  
  const svg = `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="${bgColor}" rx="20"/>
      <text x="100" y="100" 
            font-family="League Spartan, Arial Black, sans-serif" 
            font-size="52" 
            font-weight="700" 
            fill="${textColor}" 
            text-anchor="middle" 
            dominant-baseline="middle">
        ${initials}
      </text>
    </svg>
  `;
  
  return toSvgDataUrl(svg);
};

export const generateBusinessBanner = (businessName) => {
  if (!businessName) return null;
  
  // Generate gradient banner with business name
  const gradients = [
    ['#0d4f4f', '#00c4cc'],
    ['#c9a84c', '#f59e0b'],
    ['#1e40af', '#3b82f6'],
    ['#dc2626', '#ef4444'],
    ['#059669', '#10b981'],
  ];
  
  const gradient = gradients[Math.abs(businessName.charCodeAt(0)) % gradients.length];
  const [color1, color2] = gradient;
  
  const svg = `
    <svg width="1200" height="400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="banner-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="1200" height="400" fill="url(#banner-gradient)"/>
      
      <!-- Add subtle pattern -->
      <pattern id="pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <circle cx="20" cy="20" r="2" fill="white" opacity="0.1"/>
      </pattern>
      <rect width="1200" height="400" fill="url(#pattern)"/>
      
      <!-- Business name -->
      <text x="600" y="200" 
            font-family="League Spartan, Arial Black, sans-serif" 
            font-size="56" 
            font-weight="700" 
            fill="white" 
            text-anchor="middle" 
            dominant-baseline="middle">
        ${businessName}
      </text>
    </svg>
  `;
  
  return toSvgDataUrl(svg);
};

export const generateMobileBanner = (businessName) => {
  if (!businessName) return null;
  
  // Generate mobile-optimized banner
  const colors = [
    ['#0d4f4f', '#00c4cc'],
    ['#c9a84c', '#f59e0b'],
    ['#1e40af', '#3b82f6'],
    ['#dc2626', '#ef4444'],
    ['#059669', '#10b981'],
  ];
  
  const gradient = colors[Math.abs(businessName.charCodeAt(0)) % colors.length];
  const [color1, color2] = gradient;
  
  const svg = `
    <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mobile-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="400" height="200" fill="url(#mobile-gradient)"/>
      
      <!-- Subtle pattern -->
      <pattern id="mobile-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="10" cy="10" r="1" fill="white" opacity="0.1"/>
      </pattern>
      <rect width="400" height="200" fill="url(#mobile-pattern)"/>
      
      <!-- Business name (truncated if too long) -->
      <text x="200" y="80" 
            font-family="League Spartan, Arial Black, sans-serif" 
            font-size="28" 
            font-weight="700" 
            fill="white" 
            text-anchor="middle" 
            dominant-baseline="middle">
        ${businessName.length > 20 ? businessName.substring(0, 20) + '...' : businessName}
      </text>
    </svg>
  `;
  
  return toSvgDataUrl(svg);
};

// Convert SVG data URL to File object for upload
export const svgDataUrlToFile = async (dataUrl, filename) => {
  try {
    if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/svg+xml')) {
      throw new Error('Expected SVG data URL');
    }

    const response = await fetch(dataUrl);
    const svgBlob = await response.blob();
    const safeName = safeFileBase(filename);

    return new File([svgBlob], `${safeName}.svg`, { type: 'image/svg+xml' });
  } catch (error) {
    console.error('Error converting SVG data URL to file:', error);
    throw error;
  }
};
