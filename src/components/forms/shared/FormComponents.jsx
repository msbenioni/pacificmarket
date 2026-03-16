// Shared Form Components and Styles

import { ChevronDown, ChevronUp } from "lucide-react";

// Shared Form Styles
export const inputCls = "w-full min-h-[44px] border border-slate-300 rounded-xl px-4 py-3 text-sm text-[#0a1628] placeholder:text-slate-400 focus:outline-none focus:border-[#0d4f4f] focus:ring-2 focus:ring-[#0d4f4f]/10 bg-white shadow-sm";

export const textareaCls = "w-full border border-slate-300 rounded-xl px-4 py-3 text-sm text-[#0a1628] placeholder:text-slate-400 focus:outline-none focus:border-[#0d4f4f] focus:ring-2 focus:ring-[#0d4f4f]/10 bg-white resize-none shadow-sm";

export const selectCls = "w-full min-h-[44px] border border-slate-300 rounded-xl px-4 py-3 pr-10 text-sm text-[#0a1628] focus:outline-none focus:border-[#0d4f4f] focus:ring-2 focus:ring-[#0d4f4f]/10 bg-white appearance-none shadow-sm";

export const labelCls = "block text-xs font-semibold uppercase tracking-wider text-slate-700";

export const helperCls = "mt-1 text-xs text-slate-500";

// Option Card Component
export function OptionCard({ checked, onChange, label, type = "checkbox" }) {
  return (
    <label
      className={`flex min-h-[64px] w-full cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition ${
        checked
          ? "border-[#0d4f4f]/30 bg-[#0d4f4f]/6 shadow-sm"
          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      <input
        type={type}
        checked={checked}
        onChange={onChange}
        className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 text-[#0d4f4f] focus:ring-[#0d4f4f]"
      />
      <span className="text-sm leading-6 text-slate-700">{label}</span>
    </label>
  );
}

// Form Section Component
export function FormSection({ title, subtitle, icon: Icon, isOpen, onToggle, children, onSaveSection, saving, formData, errors }) {
  return (
    <div className="rounded-xl border border-slate-300 bg-white shadow-sm transition-all hover:shadow-md">
      <div className="w-full px-4 py-4 sm:px-6">
        <button
          type="button"
          onClick={onToggle}
          className="flex w-full items-start justify-between gap-3 text-left transition-colors"
        >
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <Icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#0d4f4f]" />
            <div className="min-w-0 flex-1">
              <h4 className="break-words text-sm font-semibold text-[#0a1628]">
                {title}
              </h4>
              <p className="mt-1 text-sm leading-5 text-slate-600">
                {subtitle}
              </p>
              {errors?.submit && (
                <p className="mt-1 text-xs text-red-600">{errors.submit}</p>
              )}
            </div>
          </div>

          <div className="mt-0.5 flex-shrink-0 text-slate-400">
            {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </div>
        </button>
      </div>

      {isOpen && (
        <>
          <div className="border-t border-slate-200 bg-slate-50 px-4 py-4 sm:px-6 sm:py-5 overflow-x-auto">
            <div className="min-w-0">
              {children}
            </div>
          </div>

          <div className="flex justify-end border-t border-slate-200 bg-gray-50 px-4 py-4 sm:px-6">
            <button
              type="button"
              onClick={() => onSaveSection(formData)}
              disabled={saving}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 flex-shrink-0"
            >
              {saving ? "Saving..." : "Save Section"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
