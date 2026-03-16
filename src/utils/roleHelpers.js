/**
 * Role Helper Functions
 * Centralized role checking utilities for the owner/admin role system
 */

/**
 * Check if user is an administrator
 * @param {Object} user - User object with role property
 * @returns {boolean} - True if user is admin
 */
export function isAdmin(user) {
  return user?.role === 'admin';
}

/**
 * Check if user is a business owner
 * @param {Object} user - User object with role property
 * @returns {boolean} - True if user is owner
 */
export function isOwner(user) {
  return user?.role === 'owner';
}

/**
 * Check if user has any role (owner or admin)
 * @param {Object} user - User object with role property
 * @returns {boolean} - True if user has a role (always true in this system)
 */
export function hasRole(user) {
  return user?.role === 'owner' || user?.role === 'admin';
}

/**
 * Check if user can access business features
 * @param {Object} user - User object with role property
 * @returns {boolean} - True if user can access business features
 */
export function canAccessBusinessFeatures(user) {
  return isOwner(user); // Only owners can access business features
}

/**
 * Check if user can access admin features
 * @param {Object} user - User object with role property
 * @returns {boolean} - True if user can access admin features
 */
export function canAccessAdminFeatures(user) {
  return isAdmin(user); // Only admin can access admin features
}

/**
 * Get user role display name
 * @param {Object} user - User object with role property
 * @returns {string} - Display name for the role
 */
export function getRoleDisplayName(user) {
  switch (user?.role) {
    case 'admin':
      return 'Administrator';
    case 'owner':
      return 'Business Owner';
  }
}

/**
 * Get role-based navigation items
 * @param {Object} user - User object with role property
 * @returns {Array<{name: string, href: string}>} - Array of navigation items user can see
 */
export function getRoleBasedNavigation(user) {
  /** @type {Array<{name: string, href: string}>} */
  const baseNav = [
    { name: 'Home', href: '/' },
    { name: 'Pacific Businesses', href: '/pacific-businesses' }
  ];

  if (isOwner(user)) {
    baseNav.push({ name: 'Business Portal', href: '/businessportal' });
  }

  if (isAdmin(user)) {
    baseNav.push({ name: 'Admin Dashboard', href: '/admin' });
  }

  return baseNav;
}

/**
 * Role-based redirect logic
 * @param {Object} user - User object with role property
 * @param {{push: Function}} router - Next.js router instance with push method
 */
export function handleRoleBasedRedirect(user, router) {
  if (!user) {
    router.push('/login');
    return;
  }

  if (isAdmin(user)) {
    router.push('/admin');
  } else if (isOwner(user)) {
    // Only owners go to business portal
    router.push('/businessportal');
  } else {
    // Fallback for any other role types
    router.push('/login');
  }
}
