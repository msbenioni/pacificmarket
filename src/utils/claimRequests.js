// Delete a specific claim request
const deleteClaimRequest = async (claimId) => {
  const { getSupabase } = await import("../lib/supabase/client");
  const supabase = getSupabase();
  
  const { error } = await supabase
    .from("claim_requests")
    .delete()
    .eq("id", claimId);
    
  if (error) {
    console.error("Failed to delete claim request:", error);
    throw error;
  }
  
  return true;
};

// Delete user's own pending claims
const deleteMyPendingClaims = async (businessId) => {
  const { getSupabase } = await import("../lib/supabase/client");
  const supabase = getSupabase();
  
  const { error } = await supabase
    .from("claim_requests")
    .delete()
    .eq("business_id", businessId)
    .eq("user_id", supabase.auth.getUser().then(res => res.data.user?.id))
    .eq("status", "pending");
    
  if (error) {
    console.error("Failed to delete pending claims:", error);
    throw error;
  }
  
  return true;
};

// Admin: delete all claims for a business
const deleteAllBusinessClaims = async (businessId) => {
  const { getSupabase } = await import("../lib/supabase/client");
  const supabase = getSupabase();
  
  const { error } = await supabase
    .from("claim_requests")
    .delete()
    .eq("business_id", businessId);
    
  if (error) {
    console.error("Failed to delete business claims:", error);
    throw error;
  }
  
  return true;
};
