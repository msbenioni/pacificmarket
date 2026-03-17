export default function ContactDetailsSection({ form, handleInputChange, inputCls, textareaCls, labelCls }) {
  return (
    <div className="space-y-4">
      <div>
        <label className={labelCls}>Business Contact Person</label>
        <input
          type="text"
          value={form.business_contact_person || ""}
          onChange={(e) => handleInputChange("business_contact_person", e.target.value)}
          className={inputCls}
          placeholder="John Smith"
        />
        <p className="text-xs text-gray-500 mt-1">
          Primary contact person for the business
        </p>
      </div>

      <div>
        <label className={labelCls}>Business Email *</label>
        <input
          type="email"
          value={form.business_email || ""}
          onChange={(e) => handleInputChange("business_email", e.target.value)}
          className={inputCls}
          placeholder="contact@yourbusiness.com"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Official business email address for customer inquiries
        </p>
      </div>

      <div>
        <label className={labelCls}>Business Phone</label>
        <input
          type="tel"
          value={form.business_phone || ""}
          onChange={(e) => handleInputChange("business_phone", e.target.value)}
          className={inputCls}
          placeholder="+64 21 123 4567"
        />
        <p className="text-xs text-gray-500 mt-1">
          Business phone number for customer inquiries
        </p>
      </div>

      <div>
        <label className={labelCls}>Business Website</label>
        <input
          type="url"
          value={form.business_website || ""}
          onChange={(e) => handleInputChange("business_website", e.target.value)}
          className={inputCls}
          placeholder="https://www.yourbusiness.com"
        />
        <p className="text-xs text-gray-500 mt-1">
          Your business website URL
        </p>
      </div>

      <div>
        <label className={labelCls}>Business Hours</label>
        <textarea
          value={form.business_hours || ""}
          onChange={(e) => handleInputChange("business_hours", e.target.value)}
          className={textareaCls}
          placeholder="Monday - Friday: 9:00 AM - 5:00 PM&#10;Saturday: 10:00 AM - 2:00 PM&#10;Sunday: Closed"
          rows={3}
        />
        <p className="text-xs text-gray-500 mt-1">
          Your business operating hours
        </p>
      </div>
    </div>
  );
}
