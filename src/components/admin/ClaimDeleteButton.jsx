// Add to ClaimAddBusinessModal for admin users
const handleDeleteClaim = async (claimId) => {
  if (!confirm("Are you sure you want to delete this claim request?")) {
    return;
  }
  
  try {
    const { getSupabase } = await import("../../lib/supabase/client");
    const supabase = getSupabase();
    
    const { error } = await supabase
      .from("claim_requests")
      .delete()
      .eq("id", claimId);
      
    if (error) throw error;
    
    alert("Claim request deleted successfully");
    // Refresh claims list or close modal
    onClose();
  } catch (error) {
    console.error("Failed to delete claim:", error);
    alert("Failed to delete claim request");
  }
};

// Add to claim details view:
{view === "claim_details" && isAdmin && (
  <button
    type="button"
    className="text-sm text-red-600 hover:text-red-800 font-semibold"
    onClick={() => handleDeleteClaim(pickedBusiness.claimId)}
  >
    Delete Claim
  </button>
)}
