"use client";

import { useState } from "react";
import { Mail, Phone, User, MessageSquare } from "lucide-react";
import { useToast } from "@/components/ui/toast/ToastProvider";

export default function ClaimDetailsForm({ business, onSubmit, isLoading }) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    business_email: "",
    business_phone: "",
    role: "owner",
    message: "",
  });

  const set = (key, value) => setFormData((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.business_email) {
      toast({
        title: "Email Required",
        description: "Please provide a business email address",
        variant: "error",
      });
      return;
    }

    onSubmit(formData);
  };

  const inputCls =
    "w-full min-h-[44px] border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#0a1628] placeholder:text-gray-400 focus:outline-none focus:border-[#0d4f4f] focus:ring-2 focus:ring-[#0d4f4f]/10 bg-white";

  const labelWrapCls = "mb-1.5 flex items-center gap-2";
  const labelTextCls = "text-xs font-semibold text-gray-500 uppercase tracking-wider";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
      {/* Email */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4">
        <div className={labelWrapCls}>
          <Mail className="w-3.5 h-3.5 text-[#0d4f4f]" />
          <label className={labelTextCls}>Business Email *</label>
        </div>

        <input
          type="email"
          value={formData.business_email}
          onChange={(e) => set("business_email", e.target.value)}
          placeholder="contact@yourbusiness.com"
          className={inputCls}
          required
        />

        <p className="mt-2 text-xs leading-5 text-gray-400">
          We’ll use this to contact you about your claim. It won’t be published unless your claim is approved.
        </p>
      </div>

      {/* Phone + Role */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-4">
          <div className={labelWrapCls}>
            <Phone className="w-3.5 h-3.5 text-[#0d4f4f]" />
            <label className={labelTextCls}>Business Phone</label>
          </div>

          <input
            type="tel"
            value={formData.business_phone}
            onChange={(e) => set("business_phone", e.target.value)}
            placeholder="+64 21 123 4567"
            className={inputCls}
          />
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-4">
          <div className={labelWrapCls}>
            <User className="w-3.5 h-3.5 text-[#0d4f4f]" />
            <label className={labelTextCls}>Your Role</label>
          </div>

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
      </div>

      {/* Message */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4">
        <div className={labelWrapCls}>
          <MessageSquare className="w-3.5 h-3.5 text-[#0d4f4f]" />
          <label className={labelTextCls}>Message (optional)</label>
        </div>

        <textarea
          value={formData.message}
          onChange={(e) => set("message", e.target.value)}
          placeholder="Any additional information about your ownership request..."
          rows={4}
          className={`${inputCls} min-h-[120px] resize-y`}
        />
      </div>

      {/* Info block */}
      <div className="rounded-2xl border border-[#0d4f4f]/20 bg-[#0d4f4f]/5 p-4">
        <p className="text-sm font-semibold text-[#0a1628]">Next steps</p>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          We’ll review your ownership request and notify the current listing contact if available.
          You’ll receive confirmation once your request has been reviewed.
        </p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading || !formData.business_email}
        className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#0d4f4f] px-6 py-3 text-sm font-bold text-white hover:bg-[#1a6b6b] disabled:opacity-50 transition"
      >
        {isLoading ? "Submitting..." : "Submit ownership request"}
      </button>
    </form>
  );
}