"use client";

import { useState } from "react";
import { Mail, Phone, CheckCircle } from "lucide-react";
import { ModalWrapper, ModalHeader, ModalContent, MODAL_SIZES } from "@/components/shared/ModalWrapper";

export default function ContactModal({ business, onClose }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    
    try {
      const response = await fetch('/api/emails/business-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          business: business,
          userEmail: email,
          userName: email.split('@')[0] // Extract name from email for simplicity
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to send contact request');
      }

      setSubmitted(true);
    } catch (err) {
      console.error('Business contact error:', err);
      setError(err.message || "Failed to send contact request. Please try again.");
    }
  };

  return (
    <ModalWrapper 
      isOpen={true} 
      onClose={onClose}
      className={MODAL_SIZES.md}
    >
      <ModalHeader 
        title={`Contact ${business.business_name}`}
        onClose={onClose}
      />
      
      <ModalContent>
        {!submitted ? (
          <>
            <p className="text-sm text-gray-500 mb-5">
              Enter your email address to reveal this business's contact details.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</div>
              )}

              <button
                type="submit"
                className="w-full bg-[#0d4f4f] text-white py-2 px-4 rounded-lg hover:bg-[#0a1628] transition-colors"
              >
                Reveal Contact Details
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Contact Details Revealed!</h4>
            <p className="text-sm text-gray-600 mb-4">
              Thank you for your interest. Here's how to contact {business.business_name}:
            </p>

            <div className="space-y-3 text-left bg-gray-50 rounded-lg p-4">
              {business.business_email && (
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{business.business_email}</span>
                </div>
              )}
              {business.business_phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{business.business_phone}</span>
                </div>
              )}
              {!business.business_email && !business.business_phone && (
                <p className="text-sm text-gray-400 text-center py-4">No contact details listed yet.</p>
              )}
            </div>
          </div>
        )}
      </ModalContent>
    </ModalWrapper>
  );
}