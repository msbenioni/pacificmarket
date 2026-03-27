/**
 * Date utilities to fix hydration issues
 * Uses UTC timezone to ensure server/client consistency
 */

export function formatDateConsistent(dateString) {
  if (!dateString) return "—";
  
  try {
    const date = new Date(dateString);
    // Use UTC to ensure server/client consistency
    return date.toLocaleDateString('en-US', { timeZone: 'UTC' });
  } catch (error) {
    return "—";
  }
}

export function formatDateTimeConsistent(dateString) {
  if (!dateString) return "—";
  
  try {
    const date = new Date(dateString);
    // Use UTC to ensure server/client consistency
    return date.toLocaleString('en-US', { timeZone: 'UTC' });
  } catch (error) {
    return "—";
  }
}
