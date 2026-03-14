export default function CoreInfoSection({ form, handleInputChange, inputCls, textareaCls, labelCls, selectCls }) {
  return (
    <div className="space-y-4">
      <div>
        <label className={labelCls}>Business Name *</label>
        <input
          type="text"
          value={form.name || ""}
          onChange={(e) => handleInputChange("name", e.target.value)}
          className={inputCls}
          placeholder="Enter your business name"
          required
        />
      </div>

      <div>
        <label className={labelCls}>Business Handle</label>
        <input
          type="text"
          value={form.business_handle || ""}
          onChange={(e) => handleInputChange("business_handle", e.target.value)}
          className={inputCls}
          placeholder="unique-business-handle"
        />
      </div>

      <div>
        <label className={labelCls}>Tagline</label>
        <input
          type="text"
          value={form.tagline || ""}
          onChange={(e) => handleInputChange("tagline", e.target.value)}
          className={inputCls}
          placeholder="A short, memorable description of your business"
        />
      </div>

      <div>
        <label className={labelCls}>Business Description *</label>
        <textarea
          value={form.description || ""}
          onChange={(e) => handleInputChange("description", e.target.value)}
          className={textareaCls}
          placeholder="Describe what your business does, your products/services, and what makes you unique..."
          rows={4}
          required
        />
      </div>
    </div>
  );
}
