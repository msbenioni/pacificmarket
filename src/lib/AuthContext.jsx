import React, { createContext, useState, useContext, useEffect } from 'react';
import { getSupabase } from '@/lib/supabase/client';

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
      const client = getSupabase();
      setSupabase(client);
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
      setIsLoadingAuth(false);
    };

    loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      setUser(session?.user ?? null);
      setIsAuthenticated(Boolean(session?.user));
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
  };

  const navigateToLogin = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
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
