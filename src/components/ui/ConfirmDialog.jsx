"use client";

import React, { useEffect, useId } from "react";
import { AlertTriangle, X } from "lucide-react";

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default", // default | destructive
  isLoading = false,
}) {
  const titleId = useId();
  const descriptionId = useId();

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, isLoading]);

  if (!isOpen) return null;

  const isDestructive = variant === "destructive";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => !isLoading && onClose()}
      />
      
      {/* Dialog */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-2xl border border-gray-200 shadow-[0_12px_40px_rgba(10,22,40,0.16)] p-6 max-w-md w-full mx-4"
      >
        {/* Close button */}
        <button
          onClick={() => !isLoading && onClose()}
          className="absolute right-4 top-4 rounded-lg p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
          disabled={isLoading}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon and content */}
        <div className="flex items-start gap-4">
          <div className="mt-0.5">
            <AlertTriangle className={`w-5 h-5 ${isDestructive ? "text-red-600" : "text-amber-600"}`} />
          </div>
          
          <div className="flex-1">
            <h3 id={titleId} className="text-lg font-semibold text-[#0a1628] mb-2">
              {title}
            </h3>
            
            {description && (
              <p id={descriptionId} className="text-sm text-gray-600 whitespace-pre-line">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => !isLoading && onClose()}
            disabled={isLoading}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/30 focus:border-[#0d4f4f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              isDestructive
                ? "bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600"
                : "bg-[#0d4f4f] text-white hover:bg-[#1a6b6b] focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/30 focus:border-[#0d4f4f]"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
