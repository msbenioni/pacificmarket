"use client";

import AdminAccessGate from "@/components/admin/AdminAccessGate";
import AdminDashboardContent from "@/components/admin/AdminDashboardContent";
import { useToast } from "@/components/ui/use-toast";
import { useAdminAccess } from "@/hooks/admin/useAdminAccess";
import { useAdminBusinessActions } from "@/hooks/admin/useAdminBusinessActions";
import { useAdminClaimActions } from "@/hooks/admin/useAdminClaimActions";
import { useAdminDashboardData } from "@/hooks/admin/useAdminDashboardData";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

/**
 * Admin Dashboard - Refactored Page Component
 * 
 * This is now a thin orchestrator that:
 * - Handles authentication and access control
 * - Loads and manages data
 * - Provides action handlers to the content component
 * - Renders the main dashboard content
 */

function AdminDashboardWithSearchParams() {
  const { confirm: _confirm, confirmDestructive, DialogComponent } = useConfirmDialog();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Local state for business editing
  const [editingBusinessId, setEditingBusinessId] = useState(null);
  const [draftBusiness, setDraftBusiness] = useState(null);
  
  // Get current view from query params
  const currentView = searchParams.get('view');
  const showCreateForm = currentView === 'create';
  
  // Toast helper functions for consistent API
  const showSuccess = (title, description) =>
    toast({
      title,
      description,
    });

  const showError = (title, description) =>
    toast({
      title,
      description,
      variant: "destructive",
    });

  // Authentication and access control
  const { user, authLoading, isAdmin, checkingAdmin } = useAdminAccess();

  // Data loading and management
  const { businesses, claims, dashboardLoading, loadAdminData, setClaims } = useAdminDashboardData(user);

  // Local state management functions
  const cancelEditingBusiness = () => {
    setEditingBusinessId(null);
    setDraftBusiness(null);
  };

  const resetCreateForm = () => {
    // Clear the create view parameter to hide the create form
    router.push('/AdminDashboard');
  };

  // Business actions (create, update, delete, status changes)
  const businessActions = useAdminBusinessActions({
    user,
    businesses,
    setBusinesses: () => {}, // This will be handled by the hook internally
    editingBusinessId,
    setEditingBusinessId,
    setDraftBusiness,
    cancelEditingBusiness,
    resetCreateForm,
    loadAdminData,
    showSuccess,
    showError,
    confirmDestructive,
  });

  // Enhanced business actions with local state
  const businessActionsWithState = {
    ...businessActions,
    editingBusinessId,
    setEditingBusinessId,
    draftBusiness,
    setDraftBusiness,
    cancelEditingBusiness,
  };

  // Claim actions (approve/reject)
  const claimActions = useAdminClaimActions({
    user,
    loadAdminData,
    setClaims,
    showSuccess,
    showError,
  });

  // If we have cached admin access + cached data, skip the loading gate
  // to prevent a visible blink when returning to the page.
  // Auth will verify in the background; if it fails, the deny gate catches it.
  const hasCachedAccess = isAdmin && !checkingAdmin && !dashboardLoading;

  // Show access gate if auth finished and user isn't admin
  if (!authLoading && (!user || !isAdmin)) {
    return (
      <AdminAccessGate
        authLoading={authLoading}
        checkingAdmin={checkingAdmin}
        user={user}
        isAdmin={isAdmin}
      />
    );
  }

  // Show loading state only when we have NO cached state to display
  if ((authLoading || checkingAdmin || dashboardLoading) && !hasCachedAccess) {
    return (
      <AdminAccessGate
        authLoading={authLoading}
        checkingAdmin={checkingAdmin}
        user={user}
        isAdmin={isAdmin}
      />
    );
  }

  // Render main dashboard content
  return (
    <>
      <AdminDashboardContent
        user={user}
        businesses={businesses}
        claims={claims}
        dashboardLoading={dashboardLoading}
        businessActions={businessActionsWithState}
        claimActions={claimActions}
        showCreateForm={showCreateForm}
      />
      {DialogComponent}
    </>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<div>Loading admin dashboard...</div>}>
      <AdminDashboardWithSearchParams />
    </Suspense>
  );
}