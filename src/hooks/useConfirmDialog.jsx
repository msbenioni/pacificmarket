"use client";

import { useState, useCallback } from "react";

export function useConfirmDialog() {
  const [dialog, setDialog] = useState(null);

  const confirm = useCallback(
    (options) => {
      return new Promise((resolve) => {
        const {
          title = "Confirm Action",
          description,
          confirmText = "Confirm",
          cancelText = "Cancel",
          variant = "default",
        } = options;

        setDialog({
          isOpen: true,
          title,
          description,
          confirmText,
          cancelText,
          variant,
          onConfirm: () => {
            setDialog(null);
            resolve(true);
          },
          onClose: () => {
            setDialog(null);
            resolve(false);
          },
        });
      });
    },
    []
  );

  const confirmDestructive = useCallback(
    (options) => {
      return confirm({ ...options, variant: "destructive" });
    },
    [confirm]
  );

  const DialogComponent = dialog ? (
    <ConfirmDialog
      isOpen={dialog.isOpen}
      onClose={dialog.onClose}
      onConfirm={dialog.onConfirm}
      title={dialog.title}
      description={dialog.description}
      confirmText={dialog.confirmText}
      cancelText={dialog.cancelText}
      variant={dialog.variant}
    />
  ) : null;

  return { confirm, confirmDestructive, DialogComponent };
}

// Import ConfirmDialog here to avoid circular dependencies
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
