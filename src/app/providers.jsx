"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import { AuthProvider } from "@/lib/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { ToastProvider } from "@/components/ui/toast/ToastProvider";

export default function Providers({ children }) {
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
