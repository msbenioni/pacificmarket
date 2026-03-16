"use client";

import React from "react";

export function ModalWrapper({
  isOpen,
  onClose,
  children,
  className = "",
  backdropClassName = "",
  showBackdrop = true,
}) {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {showBackdrop && (
        <div
          className={[
            "absolute inset-0",
            "bg-[#0a1628]/55",
            "backdrop-blur-[6px]",
            "transition-opacity",
            backdropClassName,
          ].join(" ")}
          onClick={handleBackdropClick}
        />
      )}

      <div
        className={[
          "relative w-full",
          "bg-white",
          "rounded-3xl",
          "shadow-2xl",
          "border border-gray-100",
          "overflow-hidden",
          "max-h-[90vh]",
          className,
        ].join(" ")}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>
  );
}

/**
 * ModalHeader - Shared modal header
 */
export function ModalHeader({
  title,
  subtitle = null,
  onClose,
  showCloseButton = true,
  className = "",
}) {
  return (
    <div
      className={[
        "sticky top-0 z-10",
        "bg-white/95 backdrop-blur",
        "border-b border-gray-100",
        "px-6 sm:px-8",
        "py-5",
        "flex items-start justify-between gap-4",
        className,
      ].join(" ")}
    >
      <div className="min-w-0">
        <h3 className="font-bold text-[#0a1628] text-xl sm:text-2xl tracking-tight truncate">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1 leading-snug">{subtitle}</p>
        )}
      </div>

      {showCloseButton && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className={[
            "shrink-0",
            "h-10 w-10",
            "rounded-xl",
            "border border-gray-200",
            "bg-white",
            "text-gray-500",
            "hover:text-[#0a1628]",
            "hover:border-gray-300",
            "hover:bg-gray-50",
            "transition",
            "grid place-items-center",
          ].join(" ")}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

/**
 * ModalContent - Scrollable modal body
 * Keeps content scrollable while header and footer stay visible.
 */
export function ModalContent({ children, className = "" }) {
  return (
    <div
      className={[
        "px-6 sm:px-8",
        "py-6",
        "pb-28",
        "overflow-y-auto",
        "max-h-[calc(90vh-140px)]",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

/**
 * ModalFooter - Shared modal footer
 */
export function ModalFooter({ children, className = "" }) {
  return (
    <div
      className={[
        "sticky bottom-0 z-10",
        "bg-white/95 backdrop-blur",
        "border-t border-gray-100",
        "px-6 sm:px-8",
        "py-5",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export const MODAL_SIZES = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  full: "max-w-full mx-4",
};