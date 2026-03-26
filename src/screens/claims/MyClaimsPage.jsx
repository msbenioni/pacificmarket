// My Claims page - shows user's claim requests with cancel options
"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/toast/ToastProvider";
import CancelClaimButton from "../../components/claims/CancelClaimButton";
import { userClaimActions } from "../../utils/userClaimActions";

export default function MyClaimsPage() {
  const { toast } = useToast();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    loadMyClaims();
  }, []);

  const loadMyClaims = async () => {
    try {
      // Import getSupabase dynamically
      const { getSupabase } = await import("../../lib/supabase/client");
      const supabase = getSupabase();
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user.id);
      
      const { data, error } = await supabase
        .from("claim_requests")
        .select(`
          *,
          businesses:business_id (
            name,
            city,
            country,
            industry
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setClaims(data || []);
    } catch (error) {
      console.error("Failed to load claims:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSuccess = () => {
    toast({
      title: "Claim Cancelled",
      description: "Cancelled — you can submit again anytime",
      variant: "success"
    });
    loadMyClaims(); // Refresh the list
  };

  const canCancelClaim = (claim) => {
    return userClaimActions.canCancelClaim(claim, currentUserId);
  };

  if (loading) {
    return <div className="p-6">Loading your claims...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-[#0a1628] mb-6">My Ownership Requests</h1>
      
      {claims.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">You haven't submitted any ownership requests yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {claims.map((claim) => (
            <div key={claim.id} className="border border-gray-200 rounded-xl p-6 bg-white">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-[#0a1628]">
                    {claim.businesses?.business_name || claim.business_name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {claim.businesses?.city && `${claim.businesses.city}, `}
                    {claim.businesses?.country} · {claim.businesses?.industry}
                  </p>
                  
                  <div className="mt-3 flex items-center gap-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      claim.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : claim.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                    </span>
                    <span className="text-gray-500">
                      Submitted {new Date(claim.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {canCancelClaim(claim) && (
                    <CancelClaimButton 
                      claimId={claim.id} 
                      onCancelSuccess={handleCancelSuccess}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
