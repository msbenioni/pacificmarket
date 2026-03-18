import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Create an admin notification
 * @param {Object} data - Notification data
 * @param {string} data.type - Notification type
 * @param {string} data.title - Notification title
 * @param {string} data.message - Notification message
 * @param {string} data.entityType - Entity type (business, claim, etc.)
 * @param {string} data.entityId - Entity ID
 * @param {string} data.userId - User ID who triggered the notification
 */
export async function createAdminNotification({
  type,
  title,
  message,
  entityType,
  entityId,
  userId,
}) {
  try {
    const { error } = await supabaseAdmin
      .from("admin_notifications")
      .insert({
        type,
        title,
        message,
        entity_type: entityType,
        entity_id: entityId,
        user_id: userId,
      });

    if (error) {
      console.error("Failed to create admin notification:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error creating admin notification:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Create admin notification for business pending approval
 */
export async function notifyAdminBusinessPending(businessData, userData) {
  return createAdminNotification({
    type: "business_pending_approval",
    title: "New business awaiting approval",
    message: `${userData.email} added ${businessData.name} and it needs review.`,
    entityType: "business",
    entityId: businessData.id,
    userId: userData.id,
  });
}

/**
 * Create admin notification for claim pending approval
 */
export async function notifyAdminClaimPending(businessData, claimData) {
  return createAdminNotification({
    type: "claim_pending_approval",
    title: "New claim awaiting approval",
    message: `${claimData.name || claimData.email} submitted a claim for ${businessData.name}.`,
    entityType: "claim",
    entityId: claimData.id,
    userId: claimData.user_id || null,
  });
}

/**
 * Update user onboarding status when they add a business
 */
export async function updateOnboardingBusinessStatus(userId, hasBusiness = true) {
  try {
    const { error } = await supabaseAdmin
      .from("user_onboarding_status")
      .update({
        has_business: hasBusiness,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);

    if (error) {
      console.error("Failed to update onboarding business status:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating onboarding business status:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Update user onboarding status when they submit a claim
 */
export async function updateOnboardingClaimStatus(userId, hasClaim = true) {
  try {
    const { error } = await supabaseAdmin
      .from("user_onboarding_status")
      .update({
        has_claim: hasClaim,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);

    if (error) {
      console.error("Failed to update onboarding claim status:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating onboarding claim status:", error);
    return { success: false, error: error.message };
  }
}
