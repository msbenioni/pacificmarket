import { useState } from "react";
import { useToast } from "@/components/ui/toast/ToastProvider";

export default function ClaimDeleteButton({ claimId, onClose }) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteClaim = async () => {
    if (!confirm("Are you sure you want to delete this claim request?")) {
      return;
    }
    
    setIsLoading(true);
    try {
      const { getSupabase } = await import("../../lib/supabase/client");
      const supabase = getSupabase();
      
      const { error } = await supabase
        .from("claim_requests")
        .delete()
        .eq("id", claimId);
        
      if (error) throw error;
      
      toast({
        title: "Claim Deleted",
        description: "Claim request deleted successfully",
        variant: "success"
      });
      
      // Refresh claims list or close modal
      onClose();
    } catch (error) {
      console.error("Failed to delete claim:", error);
      toast({
        title: "Deletion Failed",
        description: "Failed to delete claim request",
        variant: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      className="text-sm text-red-600 hover:text-red-800 font-semibold disabled:opacity-50"
      onClick={handleDeleteClaim}
      disabled={isLoading}
    >
      {isLoading ? "Deleting..." : "Delete Claim"}
    </button>
  );
}
