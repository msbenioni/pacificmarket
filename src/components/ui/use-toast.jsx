// Forward to custom ToastProvider
import { useToast as useCustomToast, toast as customToast } from "@/components/ui/toast/ToastProvider";

// Simple wrapper that forwards to our custom ToastProvider
export function useToast() {
  return useCustomToast();
}

export { toast as default, customToast as toast }; 