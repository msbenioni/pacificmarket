// User-friendly claim management utilities
export const userClaimActions = {
  // Cancel my pending claim
  cancelMyClaim: async (claimId) => {
    const { getSupabase } = await import("../lib/supabase/client");
    const supabase = getSupabase();
    
    const { error } = await supabase
      .from("claim_requests")
      .delete()
      .eq("id", claimId)
      .eq("status", "pending"); // RLS enforces user ownership
      
    if (error) throw error;
    return true;
  },

  // Get my claims
  getMyClaims: async () => {
    const { getSupabase } = await import("../lib/supabase/client");
    const supabase = getSupabase();
    
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from("claim_requests")
      .select(`
        *,
        businesses:business_id (name, city, country, category)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
      
    if (error) throw error;
    return data;
  },

  // Check if I can cancel this claim
  canCancelClaim: (claim, currentUserId) => {
    return claim.status === "pending" && claim.user_id === currentUserId;
  }
};
