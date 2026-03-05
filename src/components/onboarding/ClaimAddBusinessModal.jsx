"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ModalWrapper,
  ModalHeader,
  ModalContent,
  ModalFooter,
  MODAL_SIZES,
} from "@/components/shared/ModalWrapper";
import DetailedBusinessForm from "@/components/forms/DetailedBusinessForm";
import BusinessSearch from "@/components/BusinessSearch";
import { Search, Plus, ChevronLeft } from "lucide-react";

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

  useEffect(() => {
    if (isOpen) {
      setView(defaultView);
      setPickedBusiness(null);
      setSubmitting(false);
    }
  }, [isOpen, defaultView]);

  const header = useMemo(() => {
    if (view === "claim")
      return {
        title: "Claim Business",
        subtitle: "Search for your listing and submit a claim for review.",
      };
    if (view === "add")
      return {
        title: "Add New Business",
        subtitle: "Create a new listing for the Pacific Market registry.",
      };
    return {
      title: "Get Started",
      subtitle: "Choose how you want to add your business to the registry.",
    };
  }, [view]);

  const modalClass = useMemo(() => {
    if (view === "add") return MODAL_SIZES["3xl"];
    return MODAL_SIZES.lg; // ✅ keep choice + claim consistent
  }, [view]);

  if (!isOpen) return null;

  const btnPrimary =
    "inline-flex items-center justify-center gap-2 rounded-xl bg-[#0d4f4f] px-5 py-3 text-sm font-bold text-white hover:bg-[#1a6b6b] transition disabled:opacity-50";
  const btnSecondary =
    "inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-[#0a1628] hover:bg-gray-50 transition";
  const pill =
    "inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-600";

  const handleBusinessSubmit = async (businessData) => {
    setSubmitting(true);
    try {
      const { getSupabase } = await import("../../lib/supabase/client");
      const supabase = getSupabase();

      const { data: userRes, error: userErr } = await supabase.auth.getUser();
      if (userErr) throw userErr;
      if (!userRes?.user) throw new Error("User not authenticated");

      const { error } = await supabase.from("businesses").insert({
        ...businessData,
        owner_user_id: userRes.user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      onAddSelected?.();
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} className={modalClass}>
      <ModalHeader title={header.title} subtitle={header.subtitle} onClose={onClose} />

      <ModalContent>
        {/* Top “brand strip” to make the modal feel designed */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#00c4cc]" />
            <span className="h-2 w-2 rounded-full bg-[#c9a84c]" />
            <span className="h-2 w-2 rounded-full bg-[#0a1628]" />
            <span className="ml-2 text-xs font-semibold text-gray-500">
              Pacific Market Registry
            </span>
          </div>
          {view !== "choice" && <span className={pill}>{view === "claim" ? "Claim" : "Add"}</span>}
        </div>

        {view === "choice" && (
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setView("claim")}
              className={[
                "w-full text-left",
                "rounded-2xl border border-gray-200 bg-white",
                "p-5",
                "hover:border-[#0d4f4f]/40 hover:bg-[#0d4f4f]/[0.03]",
                "transition",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-xl bg-[#0d4f4f]/10 grid place-items-center">
                      <Search className="h-5 w-5 text-[#0d4f4f]" />
                    </div>
                    <h4 className="text-base font-bold text-[#0a1628]">
                      Claim an existing listing
                    </h4>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    If your business is already on Pacific Market, claim it to manage details and upgrades.
                  </p>
                </div>
                <span className="mt-1 text-sm font-bold text-[#0d4f4f]">Search →</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setView("add")}
              className={[
                "w-full text-left",
                "rounded-2xl border border-[#0a1628] bg-[#0a1628]",
                "p-5",
                "hover:bg-[#122040] transition",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-xl bg-white/10 grid place-items-center">
                      <Plus className="h-5 w-5 text-white" />
                    </div>
                    <h4 className="text-base font-bold text-white">Add a new business</h4>
                  </div>
                  <p className="mt-2 text-sm text-white/80">
                    Create a new listing and represent your people, your country, and your work.
                  </p>
                </div>
                <span className="mt-1 text-sm font-bold text-[#c9a84c]">Create →</span>
              </div>
            </button>

            <div className="mt-4 rounded-2xl border border-[#c9a84c]/30 bg-[#c9a84c]/10 p-4">
              <p className="text-sm font-semibold text-[#0a1628]">
                Why it matters
              </p>
              <p className="mt-1 text-sm text-gray-700">
                Every listing strengthens Pacific visibility and makes it easier for people to discover,
                support, and invest in Pacific enterprise.
              </p>
            </div>
          </div>
        )}

        {view === "claim" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-gray-100 bg-[#f8f9fc] p-5">
              <p className="text-sm text-gray-700">
                Type your business name. If you find it, select it to submit a claim request.
              </p>

              <div className="mt-4">
                <BusinessSearch
                  placeholder="Search business name…"
                  onSelect={(business) => setPickedBusiness(business)}
                  onError={() => {}}
                />
              </div>
            </div>

            {pickedBusiness && (
              <div className="rounded-2xl border border-[#0d4f4f]/20 bg-[#0d4f4f]/[0.04] p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-[#0d4f4f] uppercase tracking-wider">
                      Selected
                    </p>
                    <p className="mt-1 text-base font-bold text-[#0a1628]">
                      {pickedBusiness?.name}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      {pickedBusiness?.city ? `${pickedBusiness.city}, ` : ""}
                      {pickedBusiness?.country} · {pickedBusiness?.category}
                    </p>
                    <p className="mt-3 text-xs text-gray-500">
                      Your claim will be reviewed to keep the registry trustworthy.
                    </p>
                  </div>

                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-600 border border-gray-200">
                    Admin review
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {view === "add" && (
          <div className="rounded-2xl border border-gray-100 bg-[#fbfcff] p-5">
            <DetailedBusinessForm
              onSubmit={handleBusinessSubmit}
              isLoading={submitting}
              showTierSelection={false}
              excludeFields={["claimed", "tier"]}
              initialData={null}
              onStepChange={setFormControls}
            />
          </div>
        )}
      </ModalContent>

      <ModalFooter className="flex items-center justify-between gap-3">
        {view === "choice" ? (
          <>
            <button type="button" onClick={onClose} className={btnSecondary}>
              Close
            </button>
            <div className="text-xs text-gray-500">
              Tip: Claim if you already exist. Add if you’re new.
            </div>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => {
                if (view === "add" && formControls) {
                  formControls.prevStep();
                } else {
                  setView("choice");
                }
              }}
              className={btnSecondary}
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>

            {view === "claim" ? (
              <button
                type="button"
                className={btnPrimary}
                disabled={!pickedBusiness}
                onClick={() => {
                  if (!pickedBusiness) return;
                  onClaimSelected?.(pickedBusiness);
                  onClose();
                }}
              >
                Submit claim
              </button>
            ) : (
              <button 
                type="button" 
                className={btnPrimary}
                onClick={() => {
                  if (formControls) {
                    if (formControls.currentStep === 5) {
                      // Last step, submit the form
                      formControls.submit();
                    } else {
                      // Go to next step
                      formControls.nextStep();
                    }
                  }
                }}
              >
                {formControls?.currentStep === 5 ? "Create Listing" : "Continue"}
              </button>
            )}
          </>
        )}
      </ModalFooter>
    </ModalWrapper>
  );
}