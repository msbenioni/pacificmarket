"use client";

import { ToastProvider } from "@/components/ui/toast/ToastProvider";
import { Toaster } from "@/components/ui/toaster";
import { cleanupExpiredSessions } from "@/hooks/useSessionState";
import { AuthProvider } from "@/lib/AuthContext";
import { queryClientInstance } from "@/lib/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";

export default function Providers({ children }) {
  // Clean up expired session states once on app startup
  useEffect(() => {
    cleanupExpiredSessions();
  }, []);

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <ToastProvider>
          {children}
          <Toaster />
        </ToastProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}
