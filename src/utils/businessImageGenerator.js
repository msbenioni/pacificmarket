// Business Image Generator - Creates placeholder logos and banners based on business name

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
            font-family="Arial, sans-serif" 
            font-size="48" 
            font-weight="bold" 
            fill="${textColor}" 
            text-anchor="middle" 
            dominant-baseline="middle">
        ${initials}
      </text>
    </svg>
  `;
  
  // Convert SVG to data URL
  const svgBlob = new Blob([svg], { type: 'image/svg+xml' });
  return URL.createObjectURL(svgBlob);
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
            font-family="Arial, sans-serif" 
            font-size="48" 
            font-weight="300" 
            fill="white" 
            text-anchor="middle" 
            dominant-baseline="middle">
        ${businessName}
      </text>
      
      <!-- Subtitle -->
      <text x="600" y="250" 
            font-family="Arial, sans-serif" 
            font-size="24" 
            fill="white" 
            opacity="0.8"
            text-anchor="middle" 
            dominant-baseline="middle">
        Pacific Discovery Network
      </text>
    </svg>
  `;
  
  // Convert SVG to data URL
  const svgBlob = new Blob([svg], { type: 'image/svg+xml' });
  return URL.createObjectURL(svgBlob);
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
            font-family="Arial, sans-serif" 
            font-size="24" 
            font-weight="bold" 
            fill="white" 
            text-anchor="middle" 
            dominant-baseline="middle">
        ${businessName.length > 20 ? businessName.substring(0, 20) + '...' : businessName}
      </text>
      
      <!-- Tagline -->
      <text x="200" y="120" 
            font-family="Arial, sans-serif" 
            font-size="14" 
            fill="white" 
            opacity="0.8"
            text-anchor="middle" 
            dominant-baseline="middle">
        Discover • Connect • Grow
      </text>
    </svg>
  `;
  
  // Convert SVG to data URL
  const svgBlob = new Blob([svg], { type: 'image/svg+xml' });
  return URL.createObjectURL(svgBlob);
};

// Convert SVG data URL to File object for upload
export const svgDataUrlToFile = (dataUrl, filename, type = 'logo') => {
  return new Promise((resolve) => {
    // Extract base64 data from data URL
    const base64Data = dataUrl.replace(/^data:image\/svg\+xml;base64,/, '');
    
    // Convert base64 to blob
    const byteCharacters = atob(base64Data);
    const byteNumbers = Array.from({ length: byteCharacters.length }, (_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/svg+xml' });
    
    // Create file
    const extension = type === 'logo' ? 'svg' : 'svg';
    const file = new File([blob], `${filename}.${extension}`, { type: 'image/svg+xml' });
    resolve(file);
  });
};
