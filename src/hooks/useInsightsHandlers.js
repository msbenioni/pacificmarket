import { useToast } from "@/components/ui/toast/ToastProvider";

export function useInsightsHandlers(refetchPortalData, setInsightsLoading) {
  const { toast } = useToast();

  const handleBusinessInsightsSubmit = async (insightsData) => {
    setInsightsLoading(true);

    try {
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();

      // Get authenticated user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error("User not authenticated. Please log in again.");
      }

      // Update the businesses table directly with insights data
      const { error } = await supabase
        .from("businesses")
        .update({
          ...insightsData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", insightsData.business_id)
        .eq("owner_user_id", user.id);

      if (error) throw error;

      await refetchPortalData();

      toast({
        title: "Saved",
        description: "Your business insights were saved successfully.",
        variant: "success",
      });
    } catch (error) {
      console.error("Error submitting business insights:", error);
      toast({
        title: "Save Failed",
        description: `Failed to save insights: ${error.message || "Unknown error"}`,
        variant: "error",
      });
    } finally {
      setInsightsLoading(false);
    }
  };

  return {
    handleBusinessInsightsSubmit,
  };
}
