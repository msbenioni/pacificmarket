/**
 * Generate a business handle from a business name
 * Converts to lowercase, replaces spaces and special chars with hyphens, removes non-alphanumeric chars
 */
export function generateBusinessHandle(name) {
  if (!name || typeof name !== 'string') {
    return '';
  }

  return name
    .toLowerCase()
    .trim()
    // Replace spaces, underscores, and special chars with hyphens
    .replace(/[\s_]+/g, '-')
    // Remove any character that's not alphanumeric, hyphen, or apostrophe
    .replace(/[^a-z0-9-']/g, '')
    // Replace multiple hyphens with single hyphen
    .replace(/-+/g, '-')
    // Remove hyphens from start and end
    .replace(/^-+|-+$/g, '')
    // Remove apostrophes (they're not great for URLs)
    .replace(/'/g, '');
}

/**
 * Example usage:
 * "SaaSy Cookies" -> "saasy-cookies"
 * "Oceanique Solutionz" -> "oceanique-solutionz"
 * "Da Utah Taro Leaf Man" -> "da-utah-taro-leaf-man"
 */
