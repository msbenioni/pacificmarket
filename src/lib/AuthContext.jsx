import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [supabase, setSupabase] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      // Import getSupabase dynamically
      import('@/lib/supabase/client').then(({ getSupabase }) => {
        const client = getSupabase();
        setSupabase(client);
      }).catch(() => {
        setAuthError({ type: "config", message: "Missing Supabase environment variables." });
        setIsLoadingAuth(false);
      });
    } catch (error) {
      setAuthError({ type: "config", message: "Missing Supabase environment variables." });
      setIsLoadingAuth(false);
      return;
    }
  }, []);

  useEffect(() => {
    if (!supabase) return;
    let isMounted = true;
    const loadUser = async () => {
      setIsLoadingAuth(true);
      setAuthError(null);

      try {
        const { data, error } = await supabase.auth.getUser();

        if (!isMounted) return;

        if (error) {
          setAuthError({ type: 'auth_required', message: error.message });
          setUser(null);
          setIsAuthenticated(false);
        } else {
          setUser(data?.user ?? null);
          setIsAuthenticated(Boolean(data?.user));
        }
      } catch (error) {
        if (!isMounted) return;
        setAuthError({ type: 'auth_error', message: 'Failed to load user session.' });
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        if (isMounted) setIsLoadingAuth(false);
      }
    };

    loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      
      setUser(session?.user ?? null);
      setIsAuthenticated(Boolean(session?.user));

      // Call onboarding endpoint for newly confirmed users (deduped per session)
      if (event === 'SIGNED_IN' && session?.user?.email_confirmed_at) {
        const onboardingKey = `onboarding-confirmed-${session.user.id}`;
        
        // Only trigger once per browser session
        if (typeof window !== 'undefined' && !sessionStorage.getItem(onboardingKey)) {
          sessionStorage.setItem(onboardingKey, "true");
          
          try {
            // Get the session token for auth
            const { data: { session: currentSession } } = await supabase.auth.getSession();
            
            if (currentSession?.access_token) {
              await fetch('/api/onboarding/confirmed', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${currentSession.access_token}`,
                },
                body: JSON.stringify({ userId: session.user.id }),
              });
            }
          } catch (error) {
            console.error('Failed to trigger onboarding:', error);
            // Don't throw error to avoid breaking the auth flow
          }
        }
      }
    });

    return () => {
      isMounted = false;
      listener?.subscription?.unsubscribe();
    };
  }, [supabase]);

  const logout = (shouldRedirect = true) => {
    setUser(null);
    setIsAuthenticated(false);
    
    if (supabase) {
      supabase.auth.signOut();
    }
    
    if (shouldRedirect && typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  const navigateToLogin = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, // Add setUser to the context
      isAuthenticated, 
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      logout,
      navigateToLogin,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
