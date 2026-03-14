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

      // Add user_id and snapshot_year to the data
      const currentYear = new Date().getFullYear();
      const dataToSave = {
        ...insightsData,
        user_id: user.id,
        snapshot_year: currentYear,
      };

      // Check if record exists for this business and year
      const { data: existingData, error: checkError } = await supabase
        .from("business_insights")
        .select("*")
        .eq("business_id", insightsData.business_id)
        .eq("snapshot_year", currentYear)
        .maybeSingle();

      if (checkError) throw checkError;

      let result;

      if (existingData?.id) {
        result = await supabase
          .from("business_insights")
          .update({
            ...dataToSave,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingData.id)
          .select();
      } else {
        result = await supabase
          .from("business_insights")
          .insert({
            ...dataToSave,
            submitted_date: new Date().toISOString(),
          })
          .select();
      }

      const { error } = result;
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

  const handleFounderInsightsSubmit = async (insightsData, insightSnapshots) => {
    setInsightsLoading(true);

    try {
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();

      const existing = insightSnapshots.find(
        (snapshot) =>
          snapshot.user_id === insightsData.user_id &&
          snapshot.business_id === (insightsData.business_id ?? null)
      );

      let result;

      if (existing?.id) {
        result = await supabase
          .from("founder_insights")
          .update({
            ...insightsData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id)
          .eq("user_id", insightsData.user_id)
          .select();
      } else {
        result = await supabase
          .from("founder_insights")
          .insert({
            ...insightsData,
            submitted_date: new Date().toISOString(),
          })
          .select();
      }

      const { error } = result;
      if (error) throw error;

      await refetchPortalData();

      toast({
        title: "Saved",
        description: "Your founder insights were saved successfully.",
        variant: "success",
      });
    } catch (error) {
      console.error("Error submitting insights:", error);
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
    handleFounderInsightsSubmit,
  };
}
