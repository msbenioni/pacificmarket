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
  
  // Convert SVG to data URL
  const svgBlob = new Blob([svg], { type: 'image/svg+xml' });
  return URL.createObjectURL(svgBlob);
};

// Convert SVG blob URL to File object for upload (convert to PNG for storage compatibility)
export const svgDataUrlToFile = async (dataUrl, filename, type = 'logo') => {
  try {
    // Handle blob URLs (from URL.createObjectURL)
    if (dataUrl.startsWith('blob:')) {
      // Fetch the SVG blob
      const response = await fetch(dataUrl);
      const svgBlob = await response.blob();
      
      // Convert SVG to PNG using canvas
      const pngBlob = await svgToPng(svgBlob, type);
      
      const extension = 'png';
      return new File([pngBlob], `${filename}.${extension}`, { type: 'image/png' });
    }
    
    throw new Error('Expected blob URL, received unsupported format');
  } catch (error) {
    console.error('Error converting SVG blob URL to file:', error);
    throw error;
  }
};

// Convert SVG blob to PNG blob
const svgToPng = async (svgBlob, type = 'logo') => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const svgText = e.target.result;
        
        // Create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas dimensions based on type
        if (type === 'logo') {
          canvas.width = 400;
          canvas.height = 400;
        } else if (type === 'banner') {
          canvas.width = 1200;
          canvas.height = 400;
        } else {
          canvas.width = 800;
          canvas.height = 600;
        }
        
        // Create image from SVG
        const img = new Image();
        img.onload = () => {
          // Draw white background
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Draw SVG
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Convert to PNG blob
          canvas.toBlob((pngBlob) => {
            resolve(pngBlob);
          }, 'image/png');
        };
        
        img.onerror = () => {
          reject(new Error('Failed to load SVG for PNG conversion'));
        };
        
        // Create blob URL from SVG text and load as image
        const svgBlob = new Blob([svgText], { type: 'image/svg+xml' });
        const svgUrl = URL.createObjectURL(svgBlob);
        img.src = svgUrl;
        
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read SVG blob'));
    };
    
    reader.readAsText(svgBlob);
  });
};
