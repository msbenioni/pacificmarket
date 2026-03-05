"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircle, AlertTriangle, X } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((opts) => {
    const id = crypto.randomUUID?.() ?? String(Date.now());
    const t = {
      id,
      title: opts?.title ?? "Notice",
      description: opts?.description ?? "",
      variant: opts?.variant ?? "default", // default | success | error
      duration: opts?.duration ?? 3500,
    };

    setToasts((prev) => [t, ...prev].slice(0, 3)); // keep it tidy

    window.setTimeout(() => remove(id), t.duration);
    return id;
  }, [remove]);

  const value = useMemo(() => ({ toast, remove, toasts }), [toast, remove, toasts]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Toast stack */}
      <div className="fixed right-4 top-4 z-[9999] space-y-2">
        {toasts.map((t) => {
          const isError = t.variant === "error";
          const isSuccess = t.variant === "success";

          return (
            <div
              key={t.id}
              className={[
                "w-[340px] max-w-[90vw]",
                "rounded-2xl border bg-white shadow-[0_12px_40px_rgba(10,22,40,0.16)]",
                "px-4 py-3",
                "flex items-start gap-3",
                isError ? "border-red-200" : isSuccess ? "border-emerald-200" : "border-gray-200",
              ].join(" ")}
            >
              <div className="mt-0.5">
                {isError ? (
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                ) : isSuccess ? (
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-[#0d4f4f]" />
                )}
              </div>

              <div className="flex-1">
                <p className="text-sm font-bold text-[#0a1628]">{t.title}</p>
                {t.description ? (
                  <p className="mt-0.5 text-sm text-gray-600">{t.description}</p>
                ) : null}
              </div>

              <button
                type="button"
                onClick={() => remove(t.id)}
                className="rounded-lg p-1 text-gray-400 hover:text-[#0a1628] hover:bg-gray-50 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider />");
  return ctx;
}
