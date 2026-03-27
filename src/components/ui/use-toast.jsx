// Forward to custom ToastProvider
import { useToast as useCustomToast } from "@/components/ui/toast/ToastProvider";

// Simple wrapper that forwards to our custom ToastProvider
export function useToast() {
  const { toast } = useCustomToast();
  
  // Provide method-style API for consistency
  return {
    success: (message) => toast({ title: message, variant: "success" }),
    error: (message) => toast({ title: message, variant: "error" }),
    info: (message) => toast({ title: message, variant: "default" }),
    warning: (message) => toast({ title: message, variant: "default" }),
    toast: toast // Keep original function for complex cases
  };
} 