"use client";

import { useState } from "react";
import { Mail, Phone, User, MessageSquare, Link } from "lucide-react";

export default function ClaimDetailsForm({ business, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    contact_email: "",      // Matches claim_requests.contact_email
    contact_phone: "",      // Matches claim_requests.contact_phone  
    role: "owner",          // Matches claim_requests.role
    message: "",            // Matches claim_requests.message
    proof_url: ""           // Optional proof link
  });

  const set = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.contact_email) {
      alert("Please provide a business email address");
      return;
    }
    onSubmit(formData);
  };

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0d4f4f] focus:ring-1 focus:ring-[#0d4f4f]/20 bg-white";
  const labelCls = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelCls}>
          <Mail className="w-3 h-3 inline mr-1" />
          Business Email *
        </label>
        <input
          type="email"
          value={formData.contact_email}
          onChange={(e) => set("contact_email", e.target.value)}
          placeholder="contact@yourbusiness.com"
          className={inputCls}
          required
        />
        <p className="text-xs text-gray-400 mt-1">
          We'll use this to contact you about your claim. We won't publish it until approved.
        </p>
      </div>

      <div>
        <label className={labelCls}>
          <Phone className="w-3 h-3 inline mr-1" />
          Business Phone
        </label>
        <input
          type="tel"
          value={formData.contact_phone}
          onChange={(e) => set("contact_phone", e.target.value)}
          placeholder="+64 21 123 4567"
          className={inputCls}
        />
      </div>

      <div>
        <label className={labelCls}>
          <User className="w-3 h-3 inline mr-1" />
          Your Role
        </label>
        <select
          value={formData.role}
          onChange={(e) => set("role", e.target.value)}
          className={inputCls}
        >
          <option value="owner">Business Owner</option>
          <option value="manager">Manager</option>
          <option value="staff">Staff Member</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className={labelCls}>
          <MessageSquare className="w-3 h-3 inline mr-1" />
          Message (optional)
        </label>
        <textarea
          value={formData.message}
          onChange={(e) => set("message", e.target.value)}
          placeholder="Any additional information about your ownership request..."
          rows={3}
          className={inputCls}
        />
      </div>

      <div>
        <label className={labelCls}>
          <Link className="w-3 h-3 inline mr-1" />
          Proof Link (optional)
        </label>
        <input
          type="url"
          value={formData.proof_url}
          onChange={(e) => set("proof_url", e.target.value)}
          placeholder="https://yourwebsite.com or https://facebook.com/yourbusiness"
          className={inputCls}
        />
        <p className="text-xs text-gray-400 mt-1">
          Website, Facebook, Instagram, or Google Business profile to help verify ownership
        </p>
      </div>

      <div className="bg-[#0d4f4f]/5 border border-[#0d4f4f]/20 rounded-xl p-4">
        <p className="text-xs text-gray-600">
          <strong>Next steps:</strong> We'll review your ownership request and notify the current listing contact if available. You'll receive confirmation once approved.
        </p>
      </div>

      <button
        type="submit"
        disabled={isLoading || !formData.contact_email}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#0d4f4f] px-6 py-3 text-sm font-bold text-white hover:bg-[#1a6b6b] disabled:opacity-50 transition"
      >
        {isLoading ? "Submitting..." : "Submit ownership request"}
      </button>
    </form>
  );
}
