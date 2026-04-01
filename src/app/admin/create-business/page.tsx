"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PortalShell from "@/components/portal/PortalShell";
import HeroStandard from "@/components/shared/HeroStandard";
import BusinessProfileForm from "@/components/forms/BusinessProfileForm";
import { emptyBusinessForm } from "@/components/admin/constants/adminDashboardConstants";
import { loadFormData } from "@/utils/formPersistenceStorage.js";
import { generateFormKey } from "@/utils/formPersistenceKeys.js";

export default function CreateBusinessPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Check if there's a draft to show the form immediately
  useEffect(() => {
    try {
      console.log("🔍 Create page: Checking for draft data...");
      const formKey = generateFormKey({ mode: "create" });
      console.log("🔑 Form key:", formKey);
      
      // Check localStorage directly
      const { getFormStorageKeys } = require("@/utils/formPersistenceStorage.js");
      const { formData } = getFormStorageKeys(formKey);
      const rawStored = localStorage.getItem(formData);
      console.log("📦 Raw localStorage data:", rawStored ? "EXISTS" : "EMPTY");
      
      const { data: storedData } = loadFormData(formKey);
      
      // If there's stored data, show the form automatically
      if (storedData) {
        console.log("📝 Found draft data, showing form automatically");
        console.log("📊 Draft data keys:", Object.keys(storedData));
        setShowForm(true);
      } else {
        console.log("📭 No draft data, form hidden by default");
      }
    } catch (error) {
      console.error("❌ Error checking for draft data:", error);
      setShowForm(false);
    }
  }, []);

  const handleSave = async (formData: any) => {
    try {
      setSaving(true);

      console.log("Creating business:", formData);

      // TODO: replace with your real create action
      await new Promise((resolve) => setTimeout(resolve, 1500));

      router.push("/AdminDashboard");
    } catch (error) {
      console.error("Error creating business:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    router.push("/AdminDashboard");
  };

  const handleShowForm = () => {
    // First check if there's draft data
    const formKey = generateFormKey({ mode: "create" });
    const { data: storedData } = loadFormData(formKey);
    
    if (storedData) {
      console.log("📝 Found draft data on manual check, showing form");
      setShowForm(true);
    } else {
      console.log("📭 No draft data, showing empty form");
      setShowForm(true);
    }
  };

  return (
    <PortalShell>
      <div className="bg-[#f8f9fc] min-h-screen">
        <HeroStandard
          badge="Admin Dashboard"
          title="Create New Business"
          subtitle="Pacific Discovery Network Registry"
          description="Add a new business to the network with full control over visibility and settings."
        />

        {!showForm && (
          <div className="max-w-6xl mx-auto px-4 py-8">
            <button
              onClick={handleShowForm}
              className="rounded-xl bg-teal-700 px-6 py-3 text-lg font-semibold text-white hover:bg-teal-800 transition-colors"
            >
              Create New Business
            </button>
          </div>
        )}

        {showForm && (
          <div className="max-w-6xl mx-auto px-4 py-8">
            <BusinessProfileForm
              title="Create New Business"
              businessId={null}
              initialData={emptyBusinessForm as any}
              onSave={handleSave}
              onCancel={handleCancel}
              saving={saving}
              mode="create"
              showAdminFields={true}
            />
          </div>
        )}
      </div>
    </PortalShell>
  );
}
