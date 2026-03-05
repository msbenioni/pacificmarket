"use client";

import React from "react";
import { ModalWrapper, ModalHeader, ModalContent, ModalFooter } from "@/components/shared/ModalWrapper";
import { AlertTriangle } from "lucide-react";

export default function ConfirmModal({
  isOpen,
  onClose,
  title = "Confirm",
  description = "",
  confirmText = "Confirm",
  cancelText = "Keep",
  danger = false,
  loading = false,
  onConfirm,
}) {
  const btnDanger =
    "inline-flex w-full items-center justify-center rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white hover:bg-red-700 transition disabled:opacity-50";
  const btnSecondary =
    "inline-flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-[#0a1628] hover:bg-gray-50 transition disabled:opacity-50";

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} className="max-w-lg">
      <ModalHeader title={title} subtitle="" onClose={onClose} />
      <ModalContent>
        <div className="rounded-2xl border border-red-100 bg-red-50/40 p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0a1628]">
                {description}
              </p>
              <p className="mt-1 text-sm text-gray-600">
                You can submit another claim any time.
              </p>
            </div>
          </div>
        </div>
      </ModalContent>

      <ModalFooter className="grid grid-cols-2 gap-3">
        <button type="button" className={btnSecondary} onClick={onClose} disabled={loading}>
          {cancelText}
        </button>
        <button
          type="button"
          className={danger ? btnDanger : btnSecondary}
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? "Cancelling..." : confirmText}
        </button>
      </ModalFooter>
    </ModalWrapper>
  );
}
