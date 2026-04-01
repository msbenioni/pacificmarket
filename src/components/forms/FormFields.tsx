"use client";

import { ReactNode } from "react";
import clsx from "clsx";

type FieldProps = {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
};

export function FormField({
  label,
  htmlFor,
  required,
  hint,
  error,
  children,
}: FieldProps) {
  return (
    <div className="grid content-start gap-2">
      <div className="min-h-[56px]">
        <label
          htmlFor={htmlFor}
          className="block text-sm font-semibold text-slate-900"
        >
          {label}
          {required && <span className="ml-1 text-rose-600">*</span>}
        </label>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {hint || "\u00A0"}
        </p>
      </div>

      {children}

      <div className="min-h-[20px]">
        {error ? (
          <p className="text-xs font-medium text-rose-600">{error}</p>
        ) : (
          <span className="block text-xs opacity-0">placeholder</span>
        )}
      </div>
    </div>
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function TextInput({ className, ...props }: InputProps) {
  return (
    <input
      {...props}
      className={clsx(
        "h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition",
        "placeholder:text-slate-400",
        "focus:border-teal-600 focus:ring-4 focus:ring-teal-100",
        "shadow-sm",
        className
      )}
    />
  );
}

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function TextArea({ className, ...props }: TextAreaProps) {
  return (
    <textarea
      {...props}
      className={clsx(
        "min-h-[140px] w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition",
        "placeholder:text-slate-400",
        "focus:border-teal-600 focus:ring-4 focus:ring-teal-100",
        "shadow-sm resize-y",
        className
      )}
    />
  );
}

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export function SelectInput({ className, children, ...props }: SelectProps) {
  return (
    <select
      {...props}
      className={clsx(
        "h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition",
        "focus:border-teal-600 focus:ring-4 focus:ring-teal-100",
        "shadow-sm",
        className
      )}
    >
      {children}
    </select>
  );
}
