import { useState } from "react";
import { BUSINESS_STATUS } from "@/constants/unifiedConstants";
import { createBusinessWithBranding } from "@/utils/businessCreationWithBranding";

/**
 * Hook for business-related admin actions
 * Handles create, update, delete, and status change operations
 */
export function useAdminBusinessActions({
  user,
  businesses,
  setBusinesses,
  editingBusinessId,
  setEditingBusinessId,
  setDraftBusiness,
  cancelEditingBusiness,
  resetCreateForm,
  loadAdminData,
  showSuccess,
  showError,
  confirmDestructive,
}) {
  const [savingCreate, setSavingCreate] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);

  /**
   * Start editing a business
   */
  const startEditingBusiness = (business) => {
    const { emptyBusinessForm } = require("@/components/admin/constants/adminDashboardConstants");
    setEditingBusinessId(business.id);
    setDraftBusiness({
      ...emptyBusinessForm,
      ...business,
    });
  };

  /**
   * Update business status (approve/reject)
   */
  const updateStatus = async (business, newStatus) => {
    try {
      console.log("🔄 Updating business status:", { businessId: business.id, currentStatus: business.status, newStatus });
      
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();

      const updateData = {
        status: newStatus,
        updated_at: new Date().toISOString(),
      };

      if (
        business.status === BUSINESS_STATUS.PENDING &&
        newStatus === BUSINESS_STATUS.ACTIVE
      ) {
        updateData.is_claimed = true;
        updateData.is_verified = true;
        updateData.claimed_at = new Date().toISOString();
        updateData.claimed_by = user?.id;
        console.log("📝 Approving pending business - adding claim data:", { claimed_by: user?.id });
      }

      console.log("🚀 Sending update to database:", updateData);

      const { data, error } = await supabase
        .from("businesses")
        .update(updateData)
        .eq("id", business.id)
        .select()
        .single();

      if (error) {
        console.error("❌ Database update error:", error);
        throw error;
      }
      
      if (!data) {
        console.error("❌ No data returned from update");
        throw new Error("Status update completed but no updated row was returned.");
      }

      console.log("✅ Update successful:", data);

      setBusinesses((prev) =>
        prev.map((b) => (b.id === business.id ? { ...b, ...data } : b))
      );

      await loadAdminData();
      showSuccess('Business status changed', `Status changed to ${newStatus}`);
    } catch (error) {
      console.error("❌ Error updating status:", error);
      showError('Unable to update business status', error?.message || 'Please try again.');
    }
  };

  /**
   * Delete a business
   */
  const deleteBusiness = async (businessId) => {
    const confirmed = await confirmDestructive({
      title: "Delete Business",
      description: "Are you sure you want to delete this business? This action cannot be undone.",
      confirmText: "Delete Business",
      cancelText: "Cancel"
    });
    
    if (!confirmed) return;

    try {
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();

      const { error } = await supabase.from("businesses").delete().eq("id", businessId);

      if (error) throw error;

      setBusinesses((prev) => prev.filter((b) => b.id !== businessId));

      if (editingBusinessId === businessId) {
        cancelEditingBusiness();
      }

      showSuccess('Business deleted', 'The business has been permanently deleted.');
    } catch (error) {
      console.error("Error deleting business:", error);
      showError('Unable to delete business', 'Please try again.');
    }
  };

  /**
   * Save business updates
   */
  const saveBusiness = async (payload) => {
    setSavingEdit(true);

    try {
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error("Authentication required for admin operations");
      }

      const {
        businessId,
        businessesData = {},
        files = {},
        removals = {},
      } = payload;

      if (!businessId) {
        throw new Error("Missing business id for update.");
      }

      // Use FormData to support file uploads (File objects can't be JSON-serialized)
      const formData = new FormData();
      formData.append('businessesData', JSON.stringify(businessesData));
      formData.append('removals', JSON.stringify(removals));

      // Append actual file objects if present
      if (files.logo_file instanceof File) {
        formData.append('logo_file', files.logo_file);
      }
      if (files.banner_file instanceof File) {
        formData.append('banner_file', files.banner_file);
      }
      if (files.mobile_banner_file instanceof File) {
        formData.append('mobile_banner_file', files.mobile_banner_file);
      }

      const response = await fetch(`/api/admin/businesses/${businessId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.details
            ? `${errorData.error}: ${errorData.details}` 
            : (errorData.error || 'Failed to update business')
        );
      }

      const { business: data } = await response.json();

      setBusinesses((prev) =>
        prev.map((b) => (b.id === businessId ? { ...b, ...data } : b))
      );

      if (editingBusinessId === businessId) {
        setDraftBusiness((prev) => (prev ? { ...prev, ...data } : prev));
      }

      cancelEditingBusiness();
      showSuccess('Business updated', 'The business has been successfully updated.');

      return data;
    } catch (error) {
      showError('Unable to update business', error?.message || 'Please try again.');
      throw error;
    } finally {
      setSavingEdit(false);
    }
  };

  /**
   * Create a new verified business
   */
  const createVerifiedBusiness = async (payload) => {
    setSavingCreate(true);

    try {
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();

      const {
        businessesData = {},
        files = {},
        removals = {},
      } = payload;

      let businessData = {
        ...businessesData,
        status: BUSINESS_STATUS.ACTIVE,
        is_verified: true,
        is_claimed: true,
        created_date: new Date().toISOString().split("T")[0],
        updated_at: new Date().toISOString(),
      };

      const data = await createBusinessWithBranding({
        supabase,
        businessesData: businessData,
        files,
        removals,
        allowCustomBranding: true,
        createRow: async (payloadToCreate) => {
          const { data: createdRow, error } = await supabase
            .from("businesses")
            .insert(payloadToCreate)
            .select(`
              id,
              business_name,
              business_handle,
              description,
              industry,
              country,
              city,
              status,
              visibility_tier,
              is_verified,
              is_claimed,
              business_email,
              business_website,
              logo_url,
              banner_url,
              mobile_banner_url,
              owner_user_id,
              created_date,
              updated_at,
              subscription_tier
            `)
            .single();

          if (error) {
            throw error;
          }

          return createdRow;
        },
        updateRow: async (businessId, brandingPayload) => {
          const { data: updatedRow, error } = await supabase
            .from("businesses")
            .update({
              ...brandingPayload,
              updated_at: new Date().toISOString(),
            })
            .eq("id", businessId)
            .select(`
              id,
              business_name,
              business_handle,
              description,
              industry,
              country,
              city,
              status,
              visibility_tier,
              is_verified,
              is_claimed,
              business_email,
              business_website,
              logo_url,
              banner_url,
              mobile_banner_url,
              owner_user_id,
              created_date,
              updated_at,
              subscription_tier
            `)
            .single();

          if (error) {
            throw error;
          }

          return updatedRow;
        },
      });

      if (!data) {
        throw new Error("Insert completed but no business row was returned.");
      }

      setBusinesses((prev) => [data, ...prev]);
      resetCreateForm();
      showSuccess('Business created', 'The listing was created and automatically verified.');

      return data;
    } catch (error) {
      console.error("Error creating business:", error);
      showError('Unable to create business', error?.message || 'Please try again.');
      throw error;
    } finally {
      setSavingCreate(false);
    }
  };

  return {
    savingCreate,
    savingEdit,
    startEditingBusiness,
    updateStatus,
    deleteBusiness,
    saveBusiness,
    createVerifiedBusiness,
  };
}
