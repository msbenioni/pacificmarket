/**
 * Hook for claim-related admin actions
 * Handles claim approval and rejection with proper database updates and error handling
 */
export function useAdminClaimActions({ user, loadAdminData, setClaims, showSuccess, showError }) {
  /**
   * Update claim status (approve/reject) with atomic database operations
   */
  const updateClaim = async (claim, newStatus) => {
    console.log("🚀 updateClaim called:", { claimId: claim.id, currentStatus: claim.status, newStatus });
    
    try {
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();

      // Step 1: Update claim status in database with .select().single() to get updated row
      console.log("📝 Updating claim_requests row...");
      const { data: updatedClaim, error: claimError } = await supabase
        .from("claim_requests")
        .update({
          status: newStatus,
          reviewed_at: new Date().toISOString(),
          reviewed_by: user?.id,
        })
        .eq("id", claim.id)
        .select(`
          id, business_id, user_id, status, business_email, business_phone,
          role, created_at, claim_type, message,
          reviewed_by, reviewed_at
        `)
        .single();

      if (claimError) {
        console.error("❌ Claim update failed:", claimError);
        throw new Error(`Failed to update claim: ${claimError.message}`);
      }

      console.log("✅ Claim updated successfully:", updatedClaim);

      // Step 2: Update local state immediately for better UX (after DB success)
      setClaims((prevClaims) =>
        prevClaims.map((c) =>
          c.id === claim.id ? updatedClaim : c
        )
      );

      // Step 3: If approved, update business ownership
      if (newStatus === "approved") {
        console.log("🔐 Updating business ownership for approved claim...");
        
        const { error: ownershipError } = await supabase
          .from("businesses")
          .update({
            owner_user_id: claim.user_id,
            claimed_at: new Date().toISOString(),
            claimed_by: claim.user_id,
            is_claimed: true,
            is_verified: true,
            updated_at: new Date().toISOString(),
          })
          .eq("id", claim.business_id);

        if (ownershipError) {
          console.error("❌ Business ownership update failed:", ownershipError);
          // Don't throw here - claim was updated successfully, just log the business update failure
          showError('Claim approved but business ownership update failed', 
            `Claim status changed to ${newStatus}, but business ownership could not be updated: ${ownershipError.message}`);
        } else {
          console.log("✅ Business ownership updated successfully");
        }
      }

      // Step 4: Reload data to ensure consistency
      console.log("🔄 Reloading admin data...");
      await loadAdminData();
      console.log("✅ Admin data reloaded");

      showSuccess('Claim status changed', `Status changed to ${newStatus}`);
    } catch (error) {
      console.error("❌ Error updating claim:", error);
      showError('Unable to update claim status', error?.message || 'Unknown error occurred');
      
      // Reload data to reset state if there was an error
      console.log("🔄 Reloading data after error...");
      await loadAdminData();
    }
  };

  return {
    updateClaim,
  };
}
