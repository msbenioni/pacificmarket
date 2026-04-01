"use client";

import { ReactNode } from "react";

type FormSectionCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function FormSectionCard({
  title,
  description,
  children,
}: FormSectionCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {children}
      </div>
    </section>
  );
}
