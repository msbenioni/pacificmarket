"use client";

import { Upload, X } from "lucide-react";
import { BUSINESS_STATUS } from "@/constants/unifiedConstants";
import { COUNTRIES, INDUSTRIES } from "@/constants/unifiedConstants";

const InlineBusinessForm = ({
  title = "Business Form",
  formData,
  setFormData,
  onSave,
  onCancel,
  saving = false,
  mode = "create", // "create" or "edit"
}) => {
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = async (event, type) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const tempUrl = URL.createObjectURL(file);

      if (type === "logo") {
        setFormData((prev) => ({
          ...prev,
          logo_url: tempUrl,
          logo_file: file,
        }));
      } else if (type === "banner") {
        setFormData((prev) => ({
          ...prev,
          banner_url: tempUrl,
          banner_file: file,
        }));
      }
    } catch (error) {
      console.error("Error handling file upload:", error);
    }
  };

  const removeImage = (type) => {
    if (type === "logo") {
      setFormData((prev) => ({
        ...prev,
        logo_url: "",
        logo_file: null,
      }));
    } else if (type === "banner") {
      setFormData((prev) => ({
        ...prev,
        banner_url: "",
        banner_file: null,
      }));
    }
  };

  const logoInputId = `${mode}-logo-upload-${formData?.id || "new"}`;
  const bannerInputId = `${mode}-banner-upload-${formData?.id || "new"}`;

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    onSave();
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-semibold text-[#0a1628]">{title}</h3>
            <p className="text-sm text-gray-500">Review and update the business details inline.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-[#0a1628] transition-all hover:bg-gray-50"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0a1628] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#122040] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving..." : mode === "create" ? "Create Business" : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Business Name *</label>
            <input
              type="text"
              value={formData?.name || ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[#0d4f4f] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Business Handle</label>
            <input
              type="text"
              value={formData?.business_handle || ""}
              onChange={(e) => handleInputChange("business_handle", e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[#0d4f4f] focus:outline-none"
              placeholder="unique-business-handle"
            />
          </div>

          
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Contact Name</label>
            <input
              type="text"
              value={formData?.contact_name || ""}
              onChange={(e) => handleInputChange("contact_name", e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[#0d4f4f] focus:outline-none"
            />
          </div>
        </div>

        {/* Descriptions */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Short Description</label>
            <textarea
              rows={3}
              value={formData?.short_description || ""}
              onChange={(e) => handleInputChange("short_description", e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[#0d4f4f] focus:outline-none"
              placeholder="Brief description (max 150 characters)"
              maxLength={150}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Full Description</label>
            <textarea
              rows={4}
              value={formData?.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[#0d4f4f] focus:outline-none"
              placeholder="Detailed business description"
            />
          </div>
        </div>

        {/* Logo and Banner Upload */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Logo</label>

            <div className="flex items-center space-x-4">
              {formData?.logo_url ? (
                <div className="relative">
                  <img
                    src={formData.logo_url}
                    alt="Logo preview"
                    className="h-16 w-16 rounded-lg border border-gray-200 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage("logo")}
                    className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                  <span className="text-xs text-gray-400">No logo</span>
                </div>
              )}

              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "logo")}
                  className="hidden"
                  id={logoInputId}
                />
                <label
                  htmlFor={logoInputId}
                  className="cursor-pointer rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                >
                  <Upload className="mr-1 inline h-4 w-4" />
                  Upload Logo
                </label>
                <p className="mt-1 text-xs text-gray-500">PNG, JPG up to 2MB</p>
              </div>
            </div>

            <input
              type="text"
              value={formData?.logo_url || ""}
              onChange={(e) => handleInputChange("logo_url", e.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[#0d4f4f] focus:outline-none"
              placeholder="Or enter logo URL directly"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Banner Image</label>

            <div className="flex items-center space-x-4">
              {formData?.banner_url ? (
                <div className="relative">
                  <img
                    src={formData.banner_url}
                    alt="Banner preview"
                    className="h-16 w-16 rounded-lg border border-gray-200 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage("banner")}
                    className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                  <span className="text-xs text-gray-400">No banner</span>
                </div>
              )}

              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "banner")}
                  className="hidden"
                  id={bannerInputId}
                />
                <label
                  htmlFor={bannerInputId}
                  className="cursor-pointer rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                >
                  <Upload className="mr-1 inline h-4 w-4" />
                  Upload Banner
                </label>
                <p className="mt-1 text-xs text-gray-500">PNG, JPG up to 5MB</p>
              </div>
            </div>

            <input
              type="text"
              value={formData?.banner_url || ""}
              onChange={(e) => handleInputChange("banner_url", e.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[#0d4f4f] focus:outline-none"
              placeholder="Or enter banner URL directly"
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Contact Email</label>
            <input
              type="email"
              value={formData?.contact_email || ""}
              onChange={(e) => handleInputChange("contact_email", e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[#0d4f4f] focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Contact Phone</label>
            <input
              type="tel"
              value={formData?.contact_phone || ""}
              onChange={(e) => handleInputChange("contact_phone", e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[#0d4f4f] focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Website</label>
            <input
              type="url"
              value={formData?.contact_website || ""}
              onChange={(e) => handleInputChange("contact_website", e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[#0d4f4f] focus:outline-none"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Business Hours</label>
            <input
              type="text"
              value={formData?.business_hours || ""}
              onChange={(e) => handleInputChange("business_hours", e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[#0d4f4f] focus:outline-none"
              placeholder="Mon-Fri 9AM-5PM"
            />
          </div>
        </div>

        {/* Location Information */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Country *</label>
            <select
              value={formData?.country || ""}
              onChange={(e) => handleInputChange("country", e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[#0d4f4f] focus:outline-none"
              required
            >
              <option value="">Select Country</option>
              {COUNTRIES.map((country) => (
                <option key={country.value} value={country.value}>
                  {country.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Industry *</label>
            <select
              value={formData?.industry || ""}
              onChange={(e) => handleInputChange("industry", e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[#0d4f4f] focus:outline-none"
              required
            >
              <option value="">Select Industry</option>
              {INDUSTRIES.map((industry) => (
                <option key={industry.value} value={industry.value}>
                  {industry.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              value={formData?.city || ""}
              onChange={(e) => handleInputChange("city", e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[#0d4f4f] focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Suburb</label>
            <input
              type="text"
              value={formData?.suburb || ""}
              onChange={(e) => handleInputChange("suburb", e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[#0d4f4f] focus:outline-none"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            value={formData?.address || ""}
            onChange={(e) => handleInputChange("address", e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[#0d4f4f] focus:outline-none"
            placeholder="Street address"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">State/Region</label>
            <input
              type="text"
              value={formData?.state_region || ""}
              onChange={(e) => handleInputChange("state_region", e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[#0d4f4f] focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Postal Code</label>
            <input
              type="text"
              value={formData?.postal_code || ""}
              onChange={(e) => handleInputChange("postal_code", e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[#0d4f4f] focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Year Started</label>
            <input
              type="number"
              value={formData?.year_started ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                handleInputChange("year_started", value === "" ? null : Number(value));
              }}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[#0d4f4f] focus:outline-none"
              min="1900"
              max={new Date().getFullYear()}
              placeholder="2020"
            />
          </div>
        </div>

        {/* Business Details */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Business Structure</label>
            <select
              value={formData?.business_structure || ""}
              onChange={(e) => handleInputChange("business_structure", e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[#0d4f4f] focus:outline-none"
            >
              <option value="">Select Structure</option>
              <option value="sole-proprietorship">Sole Proprietorship</option>
              <option value="partnership">Partnership</option>
              <option value="llc">LLC</option>
              <option value="corporation">Corporation</option>
              <option value="non-profit">Non-Profit</option>
              <option value="cooperative">Cooperative</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Subscription Tier</label>
            <select
              value={formData?.subscription_tier || "vaka"}
              onChange={(e) => handleInputChange("subscription_tier", e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[#0d4f4f] focus:outline-none"
            >
              <option value="vaka">Vaka (Free)</option>
              <option value="mana">Mana (Premium)</option>
              <option value="moana">Moana (Featured+)</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
            <select
              value={formData?.status || BUSINESS_STATUS.PENDING}
              onChange={(e) => handleInputChange("status", e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[#0d4f4f] focus:outline-none"
            >
              <option value={BUSINESS_STATUS.PENDING}>Pending</option>
              <option value={BUSINESS_STATUS.ACTIVE}>Active</option>
              <option value={BUSINESS_STATUS.REJECTED}>Rejected</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Team Size</label>
            <select
              value={formData?.team_size_band || ""}
              onChange={(e) => handleInputChange("team_size_band", e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[#0d4f4f] focus:outline-none"
            >
              <option value="">Select Team Size</option>
              <option value="1">1 person</option>
              <option value="2-5">2-5 people</option>
              <option value="6-10">6-10 people</option>
              <option value="11-20">11-20 people</option>
              <option value="21-50">21-50 people</option>
              <option value="51-100">51-100 people</option>
              <option value="100+">100+ people</option>
            </select>
          </div>
        </div>

        {/* Cultural Identity */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Cultural Identity</label>
          <textarea
            rows={3}
            value={formData?.cultural_identity || ""}
            onChange={(e) => handleInputChange("cultural_identity", e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[#0d4f4f] focus:outline-none"
            placeholder="Describe the cultural identity and values of your business"
          />
        </div>

        {/* Languages Spoken */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Languages Spoken</label>
          <input
            type="text"
            value={Array.isArray(formData?.languages_spoken) ? formData.languages_spoken.join(", ") : ""}
            onChange={(e) =>
              handleInputChange(
                "languages_spoken",
                e.target.value
                  .split(",")
                  .map((lang) => lang.trim())
                  .filter(Boolean)
              )
            }
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[#0d4f4f] focus:outline-none"
            placeholder="English, French, Samoan"
          />
        </div>

        {/* Admin Toggles */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-3">
            <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={!!formData?.verified}
                onChange={(e) => handleInputChange("verified", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              Verified
            </label>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-3">
            <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={!!formData?.claimed}
                onChange={(e) => handleInputChange("claimed", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              Claimed
            </label>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-3">
            <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={!!formData?.homepage_featured}
                onChange={(e) => handleInputChange("homepage_featured", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              Homepage Featured
            </label>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InlineBusinessForm;