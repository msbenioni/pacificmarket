export default function ContactDetailsSection({ form, handleInputChange, inputCls, textareaCls, labelCls }) {
  return (
    <div className="space-y-4">
      <div>
        <label className={labelCls}>Your Role</label>
        <input
          type="text"
          value={form.role || ""}
          onChange={(e) => handleInputChange("role", e.target.value)}
          className={inputCls}
          placeholder="e.g., Owner, Manager, Marketing Director"
        />
        <p className="text-xs text-gray-500 mt-1">
          What is your role in this business?
        </p>
      </div>

      <div>
        <label className={labelCls}>Customer Contact Phone</label>
        <input
          type="tel"
          value={form.customer_contact_phone || ""}
          onChange={(e) => handleInputChange("customer_contact_phone", e.target.value)}
          className={inputCls}
          placeholder="+64 21 123 4567"
        />
        <p className="text-xs text-gray-500 mt-1">
          Phone number customers can use to contact your business through the "Contact Us" button.
        </p>
      </div>

      <div>
        <label className={labelCls}>Customer Contact Email</label>
        <input
          type="email"
          value={form.customer_contact_email || ""}
          onChange={(e) => handleInputChange("customer_contact_email", e.target.value)}
          className={inputCls}
          placeholder="contact@yourbusiness.com"
        />
        <p className="text-xs text-gray-500 mt-1">
          Email address customers can use to contact your business through the "Contact Us" button.
        </p>
      </div>
    </div>
  );
}
