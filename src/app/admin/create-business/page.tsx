"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PortalShell from "@/components/portal/PortalShell";
import HeroStandard from "@/components/shared/HeroStandard";
import BusinessProfileForm from "@/components/forms/BusinessProfileForm";
import { emptyBusinessForm } from "@/components/admin/constants/adminDashboardConstants";

export default function CreateBusinessPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

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
    router.push("/AdminDashboard");
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
      </div>
    </PortalShell>
  );
}
