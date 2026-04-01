"use client";

import { useState, useMemo } from "react";
import BusinessProfileFormFixed from "@/components/forms/BusinessProfileFormFixed";
import { useFormManager } from "@/hooks/useFormPersistence";

export default function FormPersistenceDemo() {
  const [showForm, setShowForm] = useState(false);
  const { getAllPersistedForms, clearAllPersistedForms } = useFormManager();

  const persistedForms = useMemo(() => getAllPersistedForms(), [getAllPersistedForms]);

  const handleSave = async (formData) => {
    console.log("Saved:", formData);
    alert("Demo save complete");
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">
            Business Form Preview
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Test the persistent create-business experience with autosave and draft recovery.
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"
          >
            {showForm ? "Hide Form" : "Open Create Form"}
          </button>

          {persistedForms.length > 0 && (
            <button
              onClick={() => {
                if (confirm("Clear all saved drafts?")) {
                  clearAllPersistedForms();
                  window.location.reload();
                }
              }}
              className="rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-700 hover:bg-rose-50"
            >
              Clear Drafts
            </button>
          )}
        </div>

        {persistedForms.length > 0 && (
          <div className="mb-6 rounded-2xl border border-sky-200 bg-sky-50 p-4">
            <h2 className="text-sm font-semibold text-sky-900">
              Saved drafts found
            </h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {persistedForms.map((formKey) => (
                <span
                  key={formKey}
                  className="rounded-full bg-white px-3 py-1 text-xs font-medium text-sky-800 border border-sky-200"
                >
                  {formKey}
                </span>
              ))}
            </div>
          </div>
        )}

        {showForm && (
          <BusinessProfileFormFixed
            title="Create New Business"
            businessId={null}
            onSave={handleSave}
            onCancel={() => setShowForm(false)}
            mode="create"
            showAdminFields={true}
          />
        )}
      </div>
    </div>
  );
}
