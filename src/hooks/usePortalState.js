"use client";

import { useState } from "react";

export function usePortalState() {
  const [activeTab, setActiveTab] = useState("my-businesses");
  const [showAddOwnerModal, setShowAddOwnerModal] = useState(null);
  const [addingOwner, setAddingOwner] = useState(false);
  const [newOwnerForm, setNewOwnerForm] = useState({ name: "", email: "" });
  const [showClaimAddModal, setShowClaimAddModal] = useState(false);
  const [claimAddDefaultView, setClaimAddDefaultView] = useState("claim");
  const [insightsSubmitting, setInsightsSubmitting] = useState(false);
  const [insightsStarted, setInsightsStarted] = useState(false);
  const [showAddBusiness, setShowAddBusiness] = useState(false);

  const resetModalStates = () => {
    setShowAddOwnerModal(null);
    setAddingOwner(false);
    setNewOwnerForm({ name: "", email: "" });
    setShowClaimAddModal(false);
    setClaimAddDefaultView("claim");
  };

  const setClaimAddModal = (view = "claim") => {
    setClaimAddDefaultView(view);
    setShowClaimAddModal(true);
  };

  const closeClaimAddModal = () => {
    setShowClaimAddModal(false);
    setClaimAddDefaultView("claim");
  };

  const setAddOwnerModal = (businessId) => {
    setShowAddOwnerModal(businessId);
  };

  const closeAddOwnerModal = () => {
    setShowAddOwnerModal(null);
    setNewOwnerForm({ name: "", email: "" });
  };

  const setInsightsLoading = (loading) => {
    setInsightsSubmitting(loading);
  };

  const setInsightsProgress = (started) => {
    setInsightsStarted(started);
  };

  return {
    // Tab state
    activeTab,
    setActiveTab,
    
    // Modal states
    showAddOwnerModal,
    showClaimAddModal,
    claimAddDefaultView,
    showAddBusiness,
    
    // Form states
    newOwnerForm,
    addingOwner,
    
    // Insights states
    insightsSubmitting,
    insightsStarted,
    
    // Actions
    resetModalStates,
    setClaimAddModal,
    closeClaimAddModal,
    setAddOwnerModal,
    closeAddOwnerModal,
    setNewOwnerForm,
    setAddingOwner,
    setInsightsLoading,
    setInsightsProgress,
    setShowAddBusiness,
  };
}
