/**
 * Session management utilities for handling refresh token issues
 */

// Clear all Supabase-related storage data
export const clearSupabaseSession = async () => {
  try {
    // Clear localStorage
    if (typeof window !== 'undefined') {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('supabase.') || key.includes('auth'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      // Clear sessionStorage
      const sessionKeysToRemove = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && (key.startsWith('supabase.') || key.includes('auth'))) {
          sessionKeysToRemove.push(key);
        }
      }
      sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key));
    }
    
    console.log('Cleared all Supabase session data');
  } catch (error) {
    console.error('Error clearing session data:', error);
  }
};

// Check if session is valid
export const checkSessionValidity = async (supabase) => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Session check error:', error);
      return false;
    }
    
    if (!data.session) {
      console.log('No active session found');
      return false;
    }
    
    // Try to get user to verify session is still valid
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error('User verification error:', userError);
      return false;
    }
    
    return Boolean(userData.user);
  } catch (error) {
    console.error('Session validation error:', error);
    return false;
  }
};

// Handle refresh token errors
export const handleRefreshTokenError = async (supabase, error) => {
  if (error?.message?.includes('Refresh Token Not Found') || 
      error?.message?.includes('Invalid Refresh Token')) {
    console.log('Handling refresh token error - clearing session');
    
    // Clear local storage
    await clearSupabaseSession();
    
    // Sign out from Supabase
    try {
      await supabase.auth.signOut({ scope: 'local' });
    } catch (signOutError) {
      console.error('Error during sign out:', signOutError);
    }
    
    return true; // Indicate that session was cleared
  }
  
  return false;
};
