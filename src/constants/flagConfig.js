/**
 * Flag Configuration - Single Source of Truth for Flag Display
 * 
 * Standardizes flag sizing, styling, and behavior across the entire application
 */

// Standard flag dimensions
export const FLAG_CONFIG = {
  // Standard size for all flags - consistent across the app
  DEFAULT_SIZE: 24,
  
  // Shape configuration
  SHAPE: {
    // Rectangle dimensions (width, height) - more rectangular ratio
    RECTANGLE: { width: 40, height: 24 },
    // Border radius for rectangle (slightly rounded corners)
    BORDER_RADIUS: 6, // 6px for slightly rounded corners
  },
  
  // Fallback icon sizing
  FALLBACK: {
    // Globe icon size relative to flag container
    SCALE_FACTOR: 0.6,
  },
  
  // Component-specific overrides (if needed in the future)
  COMPONENT_OVERRIDES: {
    // No overrides needed - using standard size everywhere
  }
};

// Helper function to get consistent flag dimensions
export function getFlagDimensions(size = FLAG_CONFIG.DEFAULT_SIZE) {
  return {
    width: size,
    height: size,
  };
}

// Helper function to get rectangle flag dimensions
export function getRectangleFlagDimensions() {
  return FLAG_CONFIG.SHAPE.RECTANGLE;
}

// Border radius value for rectangle flags
export const FLAG_BORDER_RADIUS = 6; // 6px for slightly rounded corners
