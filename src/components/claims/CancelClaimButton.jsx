"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useToast } from "@/components/ui/toast/ToastProvider";

export default function CancelClaimButton({ claimId, onCancelSuccess }) {
  const [open, setOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const { toast } = useToast();

  const chipClass = useMemo(() => {
    // premium "danger chip" (light UI friendly, not harsh)
    return [
      "inline-flex items-center gap-2",
      "rounded-full px-3 py-1.5",
      "border border-red-200/80 bg-red-50/70",
      "text-xs font-semibold text-red-700",
      "shadow-[0_6px_18px_rgba(185,28,28,0.08)]",
      "hover:bg-red-100/80 hover:border-red-300/70",
      "hover:shadow-[0_10px_26px_rgba(185,28,28,0.12)]",
      "active:scale-[0.98] transition",
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:active:scale-100",
      "focus:outline-none focus:ring-2 focus:ring-red-200 focus:ring-offset-2 focus:ring-offset-white",
    ].join(" ");
  }, []);

  const handleConfirmCancel = async () => {
    setCancelling(true);
    try {
      const { getSupabase } = await import("../../lib/supabase/client");
      const supabase = getSupabase();

      const { error } = await supabase
        .from("claim_requests")
        .delete()
        .eq("id", claimId)
        .eq("status", "pending");

      if (error) throw error;

      toast({
        variant: "success",
        title: "Claim request cancelled",
        description: "We've removed your request from the review queue.",
      });

      setOpen(false);
      onCancelSuccess?.();
    } catch (err) {
      console.error("Failed to cancel claim:", err);
      toast({
        variant: "error",
        title: "Couldn't cancel request",
        description: "Please try again in a moment.",
      });
    } finally {
      setCancelling(false);
    }
  };

  return (
    <>
      <button
        type="button"
        disabled={cancelling}
        onClick={() => setOpen(true)}
        className={chipClass}
        title="Cancel this claim request"
        aria-label="Cancel claim request"
      >
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-600/10">
          <X className="h-3.5 w-3.5" />
        </span>
        <span>Cancel</span>
      </button>

      <ConfirmModal
        isOpen={open}
        onClose={() => (!cancelling ? setOpen(false) : null)}
        title="Cancel this claim request?"
        description="If you cancel, your request will be removed from review. You can submit a new claim anytime."
        confirmText="Yes, cancel"
        cancelText="Keep request"
        danger
        loading={cancelling}
        onConfirm={handleConfirmCancel}
      />
    </>
  );
}
