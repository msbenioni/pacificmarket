import satori from "satori";

// Main brand colors - Pacific Discovery Network theme
const BRAND_COLORS = {
  bg1: "#0D4F4F",      // Main Pacific teal
  bg2: "#14B8A6",      // Lighter teal gradient
  text: "#FFFFFF",     // White text
  accent: "#F59E0B",   // Amber accent
  soft: "rgba(255,255,255,0.10)",
};

function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

function truncate(value, max) {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

// Load Inter Bold font - you'll need to place this font file
export async function loadFont() {
  try {
    // Try to fetch from public/fonts directory first
    const fontPath = "/fonts/Inter-Bold.ttf";
    const response = await fetch(fontPath);
    
    if (!response.ok) {
      throw new Error("Font file not found");
    }
    
    const arrayBuffer = await response.arrayBuffer();
    return arrayBuffer;
  } catch (error) {
    console.warn("Inter-Bold font not found, using fallback");
    // Return a basic font buffer as fallback
    // In production, ensure the font file exists
    return new ArrayBuffer(0);
  }
}

export async function generateStarterBranding({
  businessName,
  industry, // Industry not used anymore - consistent branding
}) {
  const initials = getInitials(businessName) || "BN";
  
  let fontData;
  try {
    fontData = await loadFont();
  } catch (error) {
    console.warn("Could not load font, using system fonts");
    fontData = null;
  }

  // @ts-ignore - Font weight type issue in JavaScript
  const fonts = fontData ? [
    {
      name: "Inter",
      data: fontData,
      weight: 700,
      style: "normal",
    },
  ] : [];

  // Simple logo with initials on brand background
  const logoSvg = await satori(
    (
      <div style={{
        width: "200px",
        height: "200px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "32px",
        background: `linear-gradient(135deg, ${BRAND_COLORS.bg1}, ${BRAND_COLORS.bg2})`,
        color: BRAND_COLORS.text,
        fontFamily: fontData ? "Inter" : "system-ui",
        fontSize: "72px",
        fontWeight: 700,
        position: "relative",
        overflow: "hidden",
      }}>
        {initials}
      </div>
    ),
    // @ts-ignore - Font weight type issue in JavaScript
  { width: 200, height: 200, fonts }
  );

  // Desktop banner with centered business name
  const desktopBannerSvg = await satori(
    (
      <div style={{
        width: "1200px",
        height: "300px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 72px",
        borderRadius: "28px",
        background: `linear-gradient(135deg, ${BRAND_COLORS.bg1}, ${BRAND_COLORS.bg2})`,
        color: BRAND_COLORS.text,
        fontFamily: fontData ? "Inter" : "system-ui",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          fontSize: "54px",
          fontWeight: 700,
          letterSpacing: "-1px",
          textAlign: "center",
        }}>
          {truncate(businessName, 34)}
        </div>
      </div>
    ),
    // @ts-ignore - Font weight type issue in JavaScript
  { width: 1200, height: 300, fonts }
  );

  // Mobile banner with centered business name
  const mobileBannerSvg = await satori(
    (
      <div style={{
        width: "400px",
        height: "160px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 28px",
        borderRadius: "20px",
        background: `linear-gradient(135deg, ${BRAND_COLORS.bg1}, ${BRAND_COLORS.bg2})`,
        color: BRAND_COLORS.text,
        fontFamily: fontData ? "Inter" : "system-ui",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          fontSize: "32px",
          fontWeight: 700,
          letterSpacing: "-0.4px",
          textAlign: "center",
        }}>
          {truncate(businessName, 20)}
        </div>
      </div>
    ),
    // @ts-ignore - Font weight type issue in JavaScript
  { width: 400, height: 160, fonts }
  );

  return {
    logoSvg,
    desktopBannerSvg,
    mobileBannerSvg,
    style: "brand", // Consistent brand style
  };
}
