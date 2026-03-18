"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import BusinessProfileForm from "../forms/BusinessProfileForm";

export default function AddBusinessCard({ 
  onAddSuccess, 
  onCancel,
  saving = false,
  onboardingStatus
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddBusiness = async (data) => {
    setIsSubmitting(true);
    try {
      await onAddSuccess(data);
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to add business:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    onCancel?.();
  };

  return (
    <div className="overflow-hidden rounded-[28px] border border-dashed border-[#0d4f4f]/30 bg-gradient-to-br from-[#f8fbfb] via-[#f0f7f7] to-[#e8f3f3] shadow-[0_14px_40px_rgba(15,23,42,0.04)]">
      <div className="h-1.5 bg-gradient-to-r from-[#0d4f4f] via-[#00c4cc] to-[#c9a84c]/70" />

      <div
        onClick={() => !isOpen && setIsOpen(true)}
        className={`relative w-full overflow-hidden text-left transition ${
          isOpen ? "bg-white" : "hover:bg-[#f8fbfb] cursor-pointer"
        }`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(13,79,79,0.06),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(201,168,76,0.08),transparent_24%)]" />
        <div className="relative bg-gradient-to-br from-transparent via-transparent to-transparent px-4 py-4 sm:px-5 sm:py-5">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl border border-[#0d4f4f]/20 bg-[#0d4f4f]/10">
                <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-[#0d4f4f]" />
              </div>

              <div className="min-w-0">
              <h3 className="truncate text-lg sm:text-xl font-semibold text-[#0a1628]">
                Add New Business
              </h3>

              <p className="mt-2 text-sm text-slate-600 sm:mt-3">
                Create a new listing and represent your people, your country, and your work.
              </p>
            </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 xl:justify-end">
              {!isOpen && (
                <div className="hidden text-right md:block">
                  <div className="text-xs text-slate-500">Click to expand</div>
                  <div className="text-xs font-medium text-slate-700">Step-based form sections</div>
                </div>
              )}

              <div 
                className={`rounded-xl border border-[#0d4f4f]/20 bg-white p-2 text-[#0d4f4f] shadow-sm cursor-pointer transition-colors hover:bg-[#f8fbfb] ${
                  isOpen ? "hover:bg-red-50 hover:border-red-200 hover:text-red-600" : ""
                }`}
                onClick={() => isOpen && handleCancel()}
              >
                <Plus
                  className={`h-4 w-4 transition-transform ${
                    isOpen ? "rotate-45" : ""
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-slate-200 bg-white">
          <div className="space-y-4">
            <BusinessProfileForm
              title="Add Your Business"
              businessId={null}
              onSave={handleAddBusiness}
              onCancel={handleCancel}
              saving={isSubmitting || saving}
              mode="create"
              showAdminFields={false}
            />
          </div>
        </div>
      )}
    </div>
  );
}
