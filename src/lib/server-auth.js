import { createClient } from '@supabase/supabase-js';

// Create two clients - one for user auth, one for service operations
export const createServiceClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
};

export const createUserClient = (token) => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
};

/**
 * Comprehensive admin authentication helper
 * Returns user, profile, and both clients
 * Eliminates repetitive auth code across all admin routes
 */
export async function requireAdmin(request) {
  try {
    // Extract and validate authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { error: 'Unauthorized', status: 401 };
    }

    const token = authHeader.split(' ')[1];
    
    // Create user client with token
    const userClient = createUserClient(token);
    
    // Verify user authentication
    const { data: { user }, error: authError } = await userClient.auth.getUser();
    
    if (authError || !user) {
      return { error: 'Invalid token', status: 401 };
    }

    // Check admin role using user client (respects RLS)
    const { data: profile, error: profileError } = await userClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return { error: 'Profile not found', status: 404 };
    }

    if (profile.role !== 'admin') {
      return { error: 'Admin access required', status: 403 };
    }

    // Create service client for elevated operations
    const serviceClient = createServiceClient();

    // Return everything needed for admin operations
    return { 
      user, 
      profile, 
      userClient, 
      serviceClient 
    };
    
  } catch (error) {
    console.error('Admin authentication error:', error);
    return { error: 'Authentication failed', status: 500 };
  }
}

// Legacy function name for backward compatibility
export const authenticateAdmin = requireAdmin;
