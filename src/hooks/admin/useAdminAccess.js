import { useAuth } from "@/lib/AuthContext";
import { useEffect, useState } from "react";

/**
 * Hook for admin authentication and access control
 * Handles checking if the current user has admin privileges
 */
export function useAdminAccess() {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('admin-role-verified') === 'true';
    }
    return false;
  });
  const [checkingAdmin, setCheckingAdmin] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('admin-role-verified') !== 'true';
    }
    return true;
  });

  /**
   * Check if the user has admin role in the profiles table
   */
  async function checkIsAdmin(user) {
    if (!user) return false;

    try {
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();

      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error || !data) {
        console.error("Error checking admin role:", error);
        return false;
      }

      return data.role === "admin";
    } catch (error) {
      console.error("Error checking admin role:", error);
      return false;
    }
  }

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (authLoading) return;

      if (!user) {
        setIsAdmin(false);
        setCheckingAdmin(false);
        return;
      }

      try {
        setCheckingAdmin(true);
        const adminStatus = await checkIsAdmin(user);
        setIsAdmin(adminStatus);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('admin-role-verified', adminStatus ? 'true' : 'false');
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setCheckingAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user, authLoading]);

  return {
    user,
    authLoading,
    isAdmin,
    checkingAdmin,
  };
}
