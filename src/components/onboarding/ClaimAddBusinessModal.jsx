"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ModalWrapper,
  ModalHeader,
  ModalContent,
  ModalFooter,
  MODAL_SIZES,
} from "@/components/shared/ModalWrapper";
import DetailedBusinessForm from "@/components/forms/DetailedBusinessForm";
import BusinessSearch from "@/components/BusinessSearch";
import ClaimDetailsForm from "@/components/forms/ClaimDetailsForm";
import { Search, Plus, ChevronLeft } from "lucide-react";

// Whitelist of allowed fields that match the exact database schema
const ALLOWED_BUSINESS_FIELDS = [
  "name",
  "description",
  "short_description",
  "logo_url",
  "banner_url",
  "contact_website",
  "contact_email",
  "contact_phone",
  "contact_name",
  "address",
  "suburb",
  "city",
  "state_region",
  "postal_code",
  "country",
  "industry",
  "languages_spoken",
  "social_links",
  "business_hours",
  "cultural_identity",
  "business_handle",
  "proof_links",
  "claimed",
];

function pickAllowedBusinessFields(input) {
  const out = {};
  for (const key of ALLOWED_BUSINESS_FIELDS) {
    if (input?.[key] !== undefined) {
      out[key] = input[key];
    }
  }

  // Map form field names to database column names
  if (input?.tagline) {
    out.short_description = input.tagline;
  }
  if (input?.website) {
    out.contact_website = input.website;
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
 * - onAddSelected?: () => void
 */
export function ClaimAddBusinessModal({
  isOpen,
  onClose,
  defaultView = "choice",
  onClaimSelected,
  onAddSelected,
}) {
  const [view, setView] = useState(defaultView);
  const [submitting, setSubmitting] = useState(false);
  const [pickedBusiness, setPickedBusiness] = useState(null);
  const [formControls, setFormControls] = useState(null);
  const [claimDetails, setClaimDetails] = useState(null);
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
        subtitle: "Create a new listing for Pacific Market.",
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

  const btnPrimary =
    "inline-flex min-h-[44px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#0d4f4f] px-5 py-3 text-sm font-bold text-white hover:bg-[#1a6b6b] transition disabled:opacity-50";

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

      const { data: existingClaim } = await supabase
        .from("claim_requests")
        .select("id,status")
        .eq("business_id", pickedBusiness.id)
        .eq("user_id", userRes.user.id)
        .in("status", ["pending", "under_review"])
        .maybeSingle();

      if (existingClaim) {
        alert("You already have a pending claim for this business. We'll notify you once it's reviewed.");
        return;
      }

      const proof = details.proof_url?.trim();
      const proof_url = proof && !proof.startsWith("http") ? `https://${proof}` : proof;

      const claimData = {
        business_id: pickedBusiness.id,
        user_id: userRes.user.id,
        status: "pending",
        contact_email: details.contact_email,
        contact_phone: details.contact_phone || null,
        role: details.role || "owner",
        message: details.message || null,
        proof_url: proof_url || null,
        business_name: pickedBusiness.name,
        user_email: userRes.user.email,
        listing_contact_email: pickedBusiness?.contact_email || null,
        listing_contact_phone: pickedBusiness?.contact_phone || null,
      };

      const { data: inserted, error: insertErr } = await supabase
        .from("claim_requests")
        .insert(claimData)
        .select()
        .single();

      if (insertErr) throw insertErr;

      // Send notification for claim submission
      try {
        await fetch('/api/notifications/claim-submitted', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            businessId: pickedBusiness.id,
            claimantId: userRes.user.id,
            claimType: details.role || 'owner'
          })
        });
      } catch (notifError) {
        console.error('Failed to send claim notification:', notifError);
        // Don't fail the claim if notification fails
      }

      onClaimSelected?.(inserted);
      onClose();
    } catch (error) {
      console.error("Failed to submit claim:", error);
      alert("Failed to submit claim request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBusinessSelect = (business) => {
    setPickedBusiness(business);
    setView("claim_details");
  };

  const handleBusinessSubmit = async (businessData) => {
    setSubmitting(true);
    try {
      const { getSupabase } = await import("../../lib/supabase/client");
      const supabase = getSupabase();

      const { data: userRes, error: userErr } = await supabase.auth.getUser();
      if (userErr) throw userErr;
      if (!userRes?.user) throw new Error("User not authenticated");

      const clean = pickAllowedBusinessFields(businessData);

      console.log("Submitting business data:", {
        original: businessData,
        cleaned: clean,
        userId: userRes.user.id,
      });

      const { error, data } = await supabase
        .from("businesses")
        .insert({
          ...clean,
          owner_user_id: userRes.user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: "pending",
          visibility_tier: "none",
        })
        .select();

      if (error) {
        console.error("Database insert error:", error);
        throw error;
      }

      console.log("Business created successfully:", data);

      // Handle referral if present
      if (data && data[0]) {
        try {
          const { createReferralIfPresent } = await import("../../utils/referrals");
          const referralCode = userRes.user?.user_metadata?.referral_code;
          
          if (referralCode) {
            await createReferralIfPresent(referralCode, data[0].id);
            console.log('Referral processed for business:', data[0].id);
          }
        } catch (referralError) {
          console.error('Error processing referral:', referralError);
          // Don't fail the business creation if referral processing fails
        }
      }

      // Send notification for business addition
      if (data && data[0]) {
        try {
          await fetch('/api/notifications/business-added', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              businessId: data[0].id,
              userId: userRes.user.id
            })
          });
        } catch (notifError) {
          console.error('Failed to send business added notification:', notifError);
          // Don't fail the business creation if notification fails
        }
      }

      onAddSelected?.();
      onClose();
    } catch (error) {
      console.error("Business submission error:", error);
      alert(`Failed to create business: ${error.message || "Unknown error occurred. Please try again."}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} className={modalClass}>
      <ModalHeader title={header.title} subtitle={header.subtitle} onClose={onClose} />

      <ModalContent>
        {/* Brand strip */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#00c4cc]" />
            <span className="h-2 w-2 rounded-full bg-[#c9a84c]" />
            <span className="h-2 w-2 rounded-full bg-[#0a1628]" />
            <span className="ml-2 text-xs font-semibold text-gray-500">
              Pacific Market
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
              className="w-full rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 text-left transition hover:border-[#0d4f4f]/40 hover:bg-[#0d4f4f]/[0.03]"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#0d4f4f]/10 flex-shrink-0">
                      <Search className="h-5 w-5 text-[#0d4f4f]" />
                    </div>
                    <h4 className="text-base font-bold text-[#0a1628]">
                      Claim an existing listing
                    </h4>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    If your business is already on Pacific Market, claim it to manage details and upgrades.
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
              className="w-full rounded-2xl border border-[#0a1628] bg-[#0a1628] p-4 sm:p-5 text-left transition hover:bg-[#122040]"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 flex-shrink-0">
                      <Plus className="h-5 w-5 text-white" />
                    </div>
                    <h4 className="text-base font-bold text-white">
                      Add a new business
                    </h4>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-white/80">
                    Create a new listing and represent your people, your country, and your work.
                  </p>
                </div>

                <span className="text-sm font-bold text-[#c9a84c] sm:mt-1">
                  Create →
                </span>
              </div>
            </button>

            <div className="mt-4 rounded-2xl border border-[#c9a84c]/30 bg-[#c9a84c]/10 p-4">
              <p className="text-sm font-semibold text-[#0a1628]">Why it matters</p>
              <p className="mt-1 text-sm leading-6 text-gray-700">
                Every listing strengthens Pacific visibility and makes it easier for people to discover,
                support, and invest in Pacific enterprise.
              </p>
            </div>
          </div>
        )}

        {view === "claim" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-gray-100 bg-[#f8f9fc] p-4 sm:p-5">
              <p className="text-sm leading-6 text-gray-700">
                Start typing your business name. Select the right match to request ownership.
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

                  <p className="mt-1 text-base font-bold text-[#0a1628] break-words">
                    {pickedBusiness?.name}
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
            <DetailedBusinessForm
              onSubmit={handleBusinessSubmit}
              isLoading={submitting}
              excludeFields={["claimed", "tier"]}
              initialData={null}
              onStepChange={(controls) => setFormControls(controls)}
            />
          </div>
        )}
      </ModalContent>

      {view !== "add" && (
        <ModalFooter className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
          {view === "choice" ? (
            <>
              <button type="button" onClick={onClose} className={btnSecondary}>
                Close
              </button>

              <div className="text-xs text-gray-500 text-center sm:text-right">
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