"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Claim or Add Business Modal
 * Premium choice interface for business setup
 */
export function ClaimAddBusinessModal({ isOpen, onClose, onClaimSelected, onAddSelected }) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // Handle SSR/hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render until mounted to avoid hydration issues
  if (!isMounted) {
    return null;
  }

  // Handle router not being mounted (SSR or outside context)
  if (!router) {
    return null;
  }

  if (!isOpen) return null;

  const handleClaimExisting = () => {
    onClose();
    // Open existing claim modal or navigate to claim flow
    if (onClaimSelected) {
      onClaimSelected();
    } else {
      router.push('/businessportal?showClaimForm=true');
    }
  };

  const handleAddNew = () => {
    onClose();
    // Navigate to ApplyListing for new business
    if (onAddSelected) {
      onAddSelected();
    } else {
      router.push('/applylisting');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Choose how you want to get started
          </h3>
          <p className="text-gray-600">
            Complete your business setup in just a few steps
          </p>
        </div>

        {/* Options */}
        <div className="space-y-4">
          {/* Claim Existing */}
          <button
            onClick={handleClaimExisting}
            className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200 group"
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">
                  Claim an existing listing
                </h4>
                <p className="text-sm text-gray-600">
                  Perfect if your business is already in our directory
                </p>
                <div className="mt-2 flex items-center text-xs text-blue-600 font-medium">
                  <span>Recommended if already listed</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </div>
          </button>

          {/* Add New */}
          <button
            onClick={handleAddNew}
            className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors duration-200 group"
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">
                  Submit a new business
                </h4>
                <p className="text-sm text-gray-600">
                  For first-time listings or new businesses
                </p>
                <div className="mt-2 flex items-center text-xs text-green-600 font-medium">
                  <span>Quick setup process</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full text-gray-500 hover:text-gray-700 font-medium py-2"
          >
            I'll decide later
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Profile Incomplete Warning
 * Shows when user needs to complete profile before claiming/adding business
 */
export function ProfileIncompleteWarning() {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-amber-800 mb-1">
            Complete your profile first
          </h4>
          <p className="text-sm text-amber-700">
            Your profile is needed to claim a business and keep the registry trustworthy.
          </p>
        </div>
      </div>
    </div>
  );
}
