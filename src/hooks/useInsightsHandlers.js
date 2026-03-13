import { useToast } from "@/components/ui/toast/ToastProvider";

export function useInsightsHandlers(refetchPortalData, setInsightsLoading) {
  const { toast } = useToast();

  const handleBusinessInsightsSubmit = async (insightsData) => {
    setInsightsLoading(true);

    try {
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();

      const { data: existingData } = await supabase
        .from("business_insights")
        .select("*")
        .eq("business_id", insightsData.business_id)
        .eq("user_id", insightsData.user_id)
        .single();

      let result;

      if (existingData?.id) {
        result = await supabase
          .from("business_insights")
          .update({
            ...insightsData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingData.id)
          .select();
      } else {
        result = await supabase
          .from("business_insights")
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
