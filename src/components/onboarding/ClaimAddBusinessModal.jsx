"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ModalWrapper,
  ModalHeader,
  ModalContent,
  ModalFooter,
  MODAL_SIZES,
} from "@/components/shared/ModalWrapper";
import BusinessProfileForm from "@/components/forms/BusinessProfileForm";
import BusinessSearch from "@/components/BusinessSearch";
import ClaimDetailsForm from "@/components/forms/ClaimDetailsForm";
import { Search, ChevronLeft } from "lucide-react";
import { useToast } from "@/components/ui/toast/ToastProvider";
import { createBusinessWithBranding } from "@/utils/businessCreationWithBranding";

// Whitelist of allowed fields that match the exact database schema
const ALLOWED_BUSINESS_FIELDS = [
  "business_name",
  "business_handle",
  "tagline",
  "description",
  "business_email",
  "business_phone",
  "business_website",
  "business_hours",
  "address",
  "suburb",
  "city",
  "state_region",
  "postal_code",
  "country",
  "industry",
  "year_started",
  "business_stage",
  "business_structure",
  "team_size_band",
  "is_business_registered",
  "founder_story",
  "age_range",
  "gender",
  "collaboration_interest",
  "mentorship_offering",
  "open_to_future_contact",
  "business_acquisition_interest",
  "social_links",
  "role",
  "business_contact_person",
  "logo_url",
  "banner_url",
  "mobile_banner_url",
  "referred_by_business_id",
];

function pickAllowedBusinessFields(input) {
  const out = {};
  for (const key of ALLOWED_BUSINESS_FIELDS) {
    if (input?.[key] !== undefined) {
      out[key] = input[key];
    }
  }
  return out;
}

/**
 * Claim or Add Business Modal (single modal switching views)
 *
 * Props:
 * - isOpen: boolean
 * - onClose: () => void
 * - defaultView?: "choice" | "claim" | "add"
 * - onClaimSelected?: (business) => void
 * - onAddSelected?: (savedRow) => void
 */
export function ClaimAddBusinessModal({
  isOpen,
  onClose,
  defaultView = "choice",
  onClaimSelected,
  onAddSelected,
}) {
  const { toast } = useToast();

  const [view, setView] = useState(defaultView);
  const [submitting, setSubmitting] = useState(false);
  const [pickedBusiness, setPickedBusiness] = useState(null);
  const [claimSearchTerm, setClaimSearchTerm] = useState("");

  useEffect(() => {
    if (isOpen) {
      setView(defaultView);
      setPickedBusiness(null);
      setSubmitting(false);
      setClaimSearchTerm("");
    }
  }, [isOpen, defaultView]);

  const header = useMemo(() => {
    if (view === "claim") {
      return {
        title: "Claim Business",
        subtitle: "Find your listing, then submit a claim for verification.",
      };
    }

    if (view === "claim_details") {
      return {
        title: "Ownership Details",
        subtitle: "Provide contact information for verification.",
      };
    }

    if (view === "add") {
      return {
        title: "Add New Business",
        subtitle: "Create a new listing for Pacific Discovery Network.",
      };
    }

    return {
      title: "Get Started",
      subtitle: "Choose how you want to add your business to the registry.",
    };
  }, [view]);

  const modalClass = useMemo(() => {
    if (view === "add") return MODAL_SIZES["3xl"];
    return MODAL_SIZES.lg;
  }, [view]);

  if (!isOpen) return null;

  const btnSecondary =
    "inline-flex min-h-[44px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-[#0a1628] hover:bg-gray-50 transition";

  const pill =
    "inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-600";

  const handleClaimDetailsSubmit = async (details) => {
    setSubmitting(true);

    try {
      const { getSupabase } = await import("../../lib/supabase/client");
      const supabase = getSupabase();

      const { data: userRes, error: userErr } = await supabase.auth.getUser();
      if (userErr) throw userErr;
      if (!userRes?.user) throw new Error("User not authenticated");

      if (!pickedBusiness?.id) throw new Error("No business selected");

      const { data: existingClaim, error: existingClaimError } = await supabase
        .from("claim_requests")
        .select("id,status")
        .eq("business_id", pickedBusiness.id)
        .eq("user_id", userRes.user.id)
        .in("status", ["pending", "under_review"])
        .maybeSingle();

      if (existingClaimError) throw existingClaimError;

      if (existingClaim) {
        toast({
          title: "Claim Already Exists",
          description:
            "You already have a pending claim for this business. We'll notify you once it's reviewed.",
          variant: "default",
        });
        return;
      }

      const claimData = {
        business_id: pickedBusiness.id,
        user_id: userRes.user.id,
        status: "pending",
        business_email: details.business_email,
        business_phone: details.business_phone || null,
        role: details.role || "owner",
        message: details.message || null,
        claim_type: "request",
      };

      const { data: inserted, error: insertErr } = await supabase
        .from("claim_requests")
        .insert(claimData)
        .select()
        .single();

      if (insertErr) throw insertErr;

      // Send admin notification for new claim (non-blocking)
      fetch("/api/admin-notifications/business-claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          claimData: inserted,
          businessData: pickedBusiness,
          userData: userRes.user,
        }),
      }).catch((error) => {
        console.error("Failed to send admin notification:", error);
      });

      toast({
        title: "Claim Submitted",
        description:
          "Claim request submitted successfully! We'll review it and notify you once it's processed.",
        variant: "success",
      });

      onClaimSelected?.(inserted);
      onClose();
    } catch (error) {
      console.error("Failed to submit claim:", error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit claim request. Please try again.",
        variant: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleBusinessSelect = (business) => {
    setPickedBusiness(business);
    setView("claim_details");
  };

  const handleBusinessSubmit = async (payload) => {
    setSubmitting(true);

    try {
      const { getSupabase } = await import("../../lib/supabase/client");
      const supabase = getSupabase();

      const { data: userRes, error: userErr } = await supabase.auth.getUser();
      if (userErr) throw userErr;
      if (!userRes?.user) throw new Error("User not authenticated");

      const {
        businessesData = {},
        files = {},
        removals = {},
      } = payload || {};

      const clean = pickAllowedBusinessFields(businessesData);

      console.log("Submitting business data:", {
        cleaned: clean,
        files,
        removals,
        userId: userRes.user.id,
      });

      const createPayload = {
        ...clean,
        owner_user_id: userRes.user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_date: new Date().toISOString().split("T")[0],
        status: "pending",
        visibility_tier: "none",
        visibility_mode: "auto",
        is_verified: false,
        is_claimed: false,
        subscription_tier: "vaka",
        source: "claim",
      };

      console.log("💾 ClaimAddBusinessModal calling createBusinessWithBranding with:", {
        businessesData: createPayload,
        files,
        removals,
        referralField: {
          presentInClean: !!clean.referred_by_business_id,
          presentInPayload: !!createPayload.referred_by_business_id,
          value: clean.referred_by_business_id
        }
      });

      const savedRow = await createBusinessWithBranding({
        supabase,
        businessesData: createPayload,
        files,
        removals,
        allowCustomBranding: true,
        createRow: async (payloadToCreate) => {
          const { data, error } = await supabase
            .from("businesses")
            .insert(payloadToCreate)
            .select()
            .single();
          
          if (error) {
            throw error;
          }
          
          return data;
        },
        updateRow: async (businessId, brandingPayload) => {
          const { data: updatedRow, error } = await supabase
            .from("businesses")
            .update({
              ...brandingPayload,
              updated_at: new Date().toISOString(),
            })
            .eq("id", businessId)
            .select()
            .single();
          
          if (error) {
            throw error;
          }
          
          return updatedRow;
        },
      });

      console.log("💾 ClaimAddBusinessModal DB returned row:", {
        id: savedRow.id,
        brandingFields: {
          logo_url: savedRow.logo_url,
          banner_url: savedRow.banner_url,
          mobile_banner_url: savedRow.mobile_banner_url,
        },
      });

      // Business created successfully - send notifications and create claim
      console.log('Business created:', savedRow);

      // Send admin notification for new business (non-blocking)
      fetch("/api/admin-notifications/business-created", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessData: savedRow,
          userData: userRes.user,
        }),
      }).catch(error => {
        console.error("Failed to send admin notification:", error);
      });

      // Send business-added notification (non-blocking)
      try {
        await fetch("/api/notifications/business-added", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            businessId: savedRow.id,
            userId: userRes.user.id,
          }),
        });
      } catch (notifError) {
        console.error("Failed to send business added notification:", notifError);
      }

      // Create approved direct claim request (non-blocking)
      try {
        const { error: claimError } = await supabase.from("claim_requests").insert({
          business_id: savedRow.id,
          user_id: userRes.user.id,
          status: "approved",
          business_email: clean.business_email || userRes.user.email,
          business_phone: clean.business_phone || null,
          role: "owner",
          created_at: new Date().toISOString(),
          reviewed_at: new Date().toISOString(),
          reviewed_by: userRes.user.id,
          claim_type: "direct",
        });

        if (claimError) {
          console.error(
            "Failed to create claim request for new business:",
            claimError
          );
        } else {
          console.log(
            "Created approved claim request for new business:",
            savedRow.id
          );
        }
      } catch (claimError) {
        console.error(
          "Error creating claim request for new business:",
          claimError
        );
      }

      toast({
        title: "Business Added",
        description:
          "Your business was created successfully and is now pending review.",
        variant: "success",
      });

      onAddSelected?.(savedRow);
      onClose();

      // Critical: return the actual saved row so BusinessProfileForm can reconcile correctly
      return savedRow;
    } catch (error) {
      console.error("Business submission error:", error);
      toast({
        title: "Business Creation Failed",
        description: `Failed to create business: ${
          error instanceof Error ? error.message : "Unknown error occurred. Please try again."
        }`,
        variant: "error",
      });
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} className={modalClass}>
      <ModalHeader
        title={header.title}
        subtitle={header.subtitle}
        onClose={onClose}
      />

      <ModalContent>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#00c4cc]" />
            <span className="h-2 w-2 rounded-full bg-[#c9a84c]" />
            <span className="h-2 w-2 rounded-full bg-[#0a1628]" />
            <span className="ml-2 text-xs font-semibold text-gray-500">
              Pacific Discovery Network
            </span>
          </div>

          {view !== "choice" && (
            <span className={pill}>
              {view === "claim"
                ? "Claim"
                : view === "claim_details"
                ? "Details"
                : "Add"}
            </span>
          )}
        </div>

        {view === "choice" && (
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setView("claim")}
              className="w-full rounded-2xl border border-gray-200 bg-white p-4 text-left transition hover:border-[#0d4f4f]/40 hover:bg-[#0d4f4f]/[0.03] sm:p-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl bg-[#0d4f4f]/10">
                      <Search className="h-5 w-5 text-[#0d4f4f]" />
                    </div>
                    <h4 className="text-base font-bold text-[#0a1628]">
                      Claim an existing listing
                    </h4>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    If your business is already on Pacific Discovery Network,
                    claim it to manage details and upgrades.
                  </p>
                </div>

                <span className="text-sm font-bold text-[#0d4f4f] sm:mt-1">
                  Search →
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setView("add")}
              className="w-full rounded-2xl border border-[#0a1628] bg-[#0a1628] p-4 text-left transition hover:bg-[#122040] sm:p-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h4 className="text-base font-bold text-white">
                    Add a new business
                  </h4>

                  <p className="mt-3 text-sm leading-6 text-white/80">
                    Create a new listing and represent your people, your
                    country, and your work.
                  </p>
                </div>

                <span className="text-sm font-bold text-[#c9a84c] sm:mt-1">
                  Create →
                </span>
              </div>
            </button>

            <div className="mt-4 rounded-2xl border border-[#c9a84c]/30 bg-[#c9a84c]/10 p-4">
              <p className="text-sm font-semibold text-[#0a1628]">
                Why it matters
              </p>
              <p className="mt-1 text-sm leading-6 text-gray-700">
                Every listing strengthens Pacific visibility and makes it easier
                for people to discover, support, and invest in Pacific
                enterprise.
              </p>
            </div>
          </div>
        )}

        {view === "claim" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-gray-100 bg-[#f8f9fc] p-4 sm:p-5">
              <p className="text-sm leading-6 text-gray-700">
                Start typing your business name. Select the right match to
                request ownership.
              </p>

              <div className="mt-4">
                <BusinessSearch
                  placeholder="Search business name…"
                  onSelect={handleBusinessSelect}
                  onError={() => {}}
                  showSelectedPreview={false}
                  initialSearchTerm={claimSearchTerm}
                  onSearchChange={setClaimSearchTerm}
                />
              </div>
            </div>
          </div>
        )}

        {view === "claim_details" && pickedBusiness && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-[#0d4f4f]/20 bg-[#0d4f4f]/[0.04] p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#0d4f4f]">
                    Selected Business
                  </p>

                  <p className="mt-1 break-words text-base font-bold text-[#0a1628]">
                    {pickedBusiness?.business_name}
                  </p>

                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    {pickedBusiness?.city ? `${pickedBusiness.city}, ` : ""}
                    {pickedBusiness?.country} · {pickedBusiness?.industry}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={submitting}
                  className="text-sm font-semibold text-[#0d4f4f] hover:underline disabled:opacity-50 sm:mt-1"
                  onClick={() => {
                    setView("claim");
                    setPickedBusiness(null);
                  }}
                >
                  Change
                </button>
              </div>
            </div>

            <ClaimDetailsForm
              business={pickedBusiness}
              onSubmit={handleClaimDetailsSubmit}
              isLoading={submitting}
            />
          </div>
        )}

        {view === "add" && (
          <div className="rounded-2xl border border-gray-100 bg-[#fbfcff] p-4 sm:p-5">
            <BusinessProfileForm
              title="Add Your Business"
              businessId={null}
              onSave={handleBusinessSubmit}
              onCancel={onClose}
              saving={submitting}
              mode="create"
              showAdminFields={false}
            />
          </div>
        )}
      </ModalContent>

      {view !== "add" && (
        <ModalFooter className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          {view === "choice" ? (
            <>
              <button type="button" onClick={onClose} className={btnSecondary}>
                Close
              </button>

              <div className="text-center text-xs text-gray-500 sm:text-right">
                Tip: Claim if you already exist. Add if you're new.
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  if (view === "claim_details") {
                    setView("claim");
                  } else {
                    setView("choice");
                  }
                }}
                className={btnSecondary}
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>

              <div className="hidden sm:block" />
            </>
          )}
        </ModalFooter>
      )}
    </ModalWrapper>
  );
}