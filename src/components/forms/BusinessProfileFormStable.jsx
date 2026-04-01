"use client";

import { useMemo, useState, useCallback } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Building2,
  FileText,
  Globe,
  HeartHandshake,
  ImageIcon,
  MapPin,
  Phone,
  Save,
  Shield,
  Share2,
  Sparkles,
  X,
} from "lucide-react";

import { BUSINESS_FORM_DEFAULTS } from "@/components/forms/businessFormDefaults";
import { useFormPersistence } from "@/hooks/useFormPersistence";
import {
  useTabPersistenceWarning,
  useFormRestore,
} from "@/hooks/useTabPersistenceWarning";
import { BUSINESS_STATUS, INDUSTRIES, COUNTRIES, BUSINESS_STAGE, AGE_RANGES, GENDER_OPTIONS, BUSINESS_STRUCTURE, TEAM_SIZE, LANGUAGES, CULTURAL_IDENTITIES } from "@/constants/unifiedConstants";
import BrandMediaSection from "./FormSections/BrandMediaSection";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function slugifyHandle(value = "") {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function FormField({
  label,
  htmlFor,
  required = false,
  hint,
  error,
  children,
  className,
}) {
  return (
    <div className={cn("grid content-start gap-2", className)}>
      <div className="min-h-[56px]">
        <label
          htmlFor={htmlFor}
          className="block text-sm font-semibold text-slate-900"
        >
          {label}
          {required && <span className="ml-1 text-rose-600">*</span>}
        </label>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {hint || "\u00A0"}
        </p>
      </div>

      {children}

      <div className="min-h-[20px]">
        {error ? (
          <p className="text-xs font-medium text-rose-600">{error}</p>
        ) : (
          <span className="block text-xs opacity-0">placeholder</span>
        )}
      </div>
    </div>
  );
}

function TextInput({ className, error = false, ...props }) {
  return (
    <input
      {...props}
      className={cn(
        "h-12 w-full rounded-xl border bg-white px-4 text-sm text-slate-900 outline-none transition shadow-sm",
        "placeholder:text-slate-400",
        error
          ? "border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-100"
          : "border-slate-200 focus:border-teal-600 focus:ring-4 focus:ring-teal-100",
        className
      )}
    />
  );
}

function TextArea({ className, error = false, ...props }) {
  return (
    <textarea
      {...props}
      className={cn(
        "min-h-[140px] w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition shadow-sm resize-y",
        "placeholder:text-slate-400",
        error
          ? "border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-100"
          : "border-slate-200 focus:border-teal-600 focus:ring-4 focus:ring-teal-100",
        className
      )}
    />
  );
}

function SelectInput({ className, error = false, children, ...props }) {
  return (
    <select
      {...props}
      className={cn(
        "h-12 w-full rounded-xl border bg-white px-4 text-sm text-slate-900 outline-none transition shadow-sm",
        error
          ? "border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-100"
          : "border-slate-200 focus:border-teal-600 focus:ring-4 focus:ring-teal-100",
        className
      )}
    >
      {children}
    </select>
  );
}

function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
      <div>
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        {description && (
          <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
        )}
      </div>

      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-7 w-12 rounded-full transition",
          checked ? "bg-teal-700" : "bg-slate-300"
        )}
        aria-pressed={checked}
      >
        <span
          className={cn(
            "absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition",
            checked ? "left-6" : "left-1"
          )}
        />
      </button>
    </div>
  );
}

function FormCard({ title, description, children }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold tracking-tight text-slate-950">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">{children}</div>
    </section>
  );
}

const ALL_SECTIONS = [
  { id: "core", label: "Core Info", icon: Building2 },
  { id: "location", label: "Location", icon: MapPin },
  { id: "overview", label: "Overview", icon: FileText },
  { id: "contact", label: "Contact", icon: Phone },
  { id: "social", label: "Social", icon: Share2 },
  { id: "identity", label: "Identity", icon: HeartHandshake },
  { id: "media", label: "Brand & Media", icon: ImageIcon },
  { id: "referral", label: "Referral", icon: Sparkles },
  { id: "admin", label: "Admin", icon: Shield },
];

export default function BusinessProfileFormStable({
  title = "Create New Business",
  businessId = null,
  initialData = {},
  onSave,
  onCancel,
  saving = false,
  mode = "create",
  showAdminFields = true,
}) {
  const sections = useMemo(() => {
    return showAdminFields
      ? ALL_SECTIONS
      : ALL_SECTIONS.filter((section) => section.id !== "admin");
  }, [showAdminFields]);

  const [activeSection, setActiveSection] = useState("core");
  const [errors, setErrors] = useState({});

  const mergedInitialData = useMemo(() => {
    return {
      ...BUSINESS_FORM_DEFAULTS,
      ...initialData,
      social_links: {
        ...BUSINESS_FORM_DEFAULTS.social_links,
        ...(initialData?.social_links || {}),
      },
    };
  }, [initialData]);

  const formKey = businessId
    ? `admin_dashboard_business_edit_${businessId}`
    : "admin_dashboard_business_create_draft";

  const {
    formData,
    updateField,
    updateFormData,
    clearPersistedData,
    hasUnsavedChanges,
  } = useFormPersistence(formKey, mergedInitialData);

  useTabPersistenceWarning(hasUnsavedChanges, `${mode} business form`);
  const { isRestored } = useFormRestore(formKey, mergedInitialData);

  const currentIndex = sections.findIndex((section) => section.id === activeSection);
  const isFirstSection = currentIndex <= 0;
  const isLastSection = currentIndex === sections.length - 1;

  const setSocialLink = (platform, value) => {
    updateField("social_links", {
      ...(formData.social_links || {}),
      [platform]: value,
    });
  };

  const handleBusinessNameBlur = () => {
    if (!formData.business_handle?.trim() && formData.business_name?.trim()) {
      updateField("business_handle", slugifyHandle(formData.business_name));
    }
  };

  // Handle file uploads
  const handleFileUpload = useCallback((event, field) => {
    const file = event.target.files?.[0];
    if (file && file instanceof File) {
      // Store the file object for upload
      updateField(`${field}_file`, file);
      // Create a preview URL for immediate display
      updateField(field, URL.createObjectURL(file));
    }
  }, [updateField]);

  // Handle image removal
  const removeImage = useCallback((field) => {
    updateField(field, '');
    updateField(`${field}_file`, null);
    updateField(`${field}_remove`, true);
  }, [updateField]);

  const validateSection = (sectionId) => {
    const nextErrors = {};

    if (sectionId === "core") {
      if (!formData.business_name?.trim()) {
        nextErrors.business_name = "Business name is required.";
      }
      if (!formData.description?.trim()) {
        nextErrors.description = "Description is required.";
      }
      if (!formData.industry?.trim()) {
        nextErrors.industry = "Industry is required.";
      }
      if (!formData.visibility_tier?.trim()) {
        nextErrors.visibility_tier = "Visibility tier is required.";
      }
    }

    if (sectionId === "location") {
      if (!formData.country?.trim()) {
        nextErrors.country = "Country is required.";
      }
      if (!formData.city?.trim()) {
        nextErrors.city = "City is required.";
      }
    }

    if (sectionId === "contact") {
      if (!formData.business_email?.trim()) {
        nextErrors.business_email = "Business email is required.";
      }
    }

    setErrors((prev) => ({
      ...prev,
      ...nextErrors,
    }));

    return Object.keys(nextErrors).length === 0;
  };

  const validateAll = () => {
    const nextErrors = {};

    if (!formData.business_name?.trim()) {
      nextErrors.business_name = "Business name is required.";
    }
    if (!formData.description?.trim()) {
      nextErrors.description = "Description is required.";
    }
    if (!formData.industry?.trim()) {
      nextErrors.industry = "Industry is required.";
    }
    if (!formData.country?.trim()) {
      nextErrors.country = "Country is required.";
    }
    if (!formData.city?.trim()) {
      nextErrors.city = "City is required.";
    }
    if (!formData.business_email?.trim()) {
      nextErrors.business_email = "Business email is required.";
    }
    if (!formData.visibility_tier?.trim()) {
      nextErrors.visibility_tier = "Visibility tier is required.";
    }

    setErrors(nextErrors);

    if (nextErrors.business_name || nextErrors.description || nextErrors.industry) {
      setActiveSection("core");
    } else if (nextErrors.country || nextErrors.city) {
      setActiveSection("location");
    } else if (nextErrors.business_email) {
      setActiveSection("contact");
    } else if (nextErrors.visibility_tier) {
      setActiveSection(showAdminFields ? "admin" : "core");
    }

    return Object.keys(nextErrors).length === 0;
  };

  const goBack = () => {
    if (!isFirstSection) {
      setActiveSection(sections[currentIndex - 1].id);
    }
  };

  const goNext = () => {
    if (!validateSection(activeSection)) return;
    if (!isLastSection) {
      setActiveSection(sections[currentIndex + 1].id);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateAll()) return;

    await onSave?.(formData);
    clearPersistedData();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="sticky top-0 z-20 rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur md:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-950">
                {title}
              </h1>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                {mode}
              </span>
            </div>

            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
              {isRestored && (
                <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
                  <Globe size={14} />
                  Draft restored from local storage
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="flex min-w-max gap-2 pb-1">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;

            return (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition",
                  isActive
                    ? "border-teal-700 bg-teal-700 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                )}
              >
                <Icon size={16} />
                {section.label}
              </button>
            );
          })}
        </div>
      </div>

      {activeSection === "core" && (
        <FormCard
          title="Core business information"
          description="Start with the key details people need to understand the business quickly."
        >
          <FormField
            label="Business name"
            htmlFor="business_name"
            required
            error={errors.business_name}
          >
            <TextInput
              id="business_name"
              value={formData.business_name || ""}
              onChange={(e) => updateField("business_name", e.target.value)}
              onBlur={handleBusinessNameBlur}
              placeholder="Pacific Creative Studio"
              error={!!errors.business_name}
            />
          </FormField>

          <FormField
            label="Business handle"
            htmlFor="business_handle"
            hint="Used for the public profile URL."
          >
            <TextInput
              id="business_handle"
              value={formData.business_handle || ""}
              onChange={(e) =>
                updateField("business_handle", slugifyHandle(e.target.value))
              }
              placeholder="pacific-creative-studio"
            />
          </FormField>

          <FormField
            label="Tagline"
            htmlFor="tagline"
            className="md:col-span-2"
            hint="A short sentence that explains what the business does."
          >
            <TextInput
              id="tagline"
              value={formData.tagline || ""}
              onChange={(e) => updateField("tagline", e.target.value)}
              placeholder="Helping Pacific businesses grow with practical digital systems."
            />
          </FormField>

          <FormField
            label="Business description"
            htmlFor="description"
            className="md:col-span-2"
            required
            hint="What you do, who you serve, and why your business matters."
            error={errors.description}
          >
            <TextArea
              id="description"
              value={formData.description || ""}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Describe your business, your services or products, your audience, and what makes you different..."
              error={!!errors.description}
            />
          </FormField>

          <FormField label="Role" htmlFor="role">
            <TextInput
              id="role"
              value={formData.role || ""}
              onChange={(e) => updateField("role", e.target.value)}
              placeholder="Founder, Owner, Director..."
            />
          </FormField>

          <FormField
            label="Industry"
            htmlFor="industry"
            required
            error={errors.industry}
          >
            <SelectInput
              id="industry"
              value={formData.industry || ""}
              onChange={(e) => updateField("industry", e.target.value)}
              error={!!errors.industry}
            >
              <option value="">Select industry</option>
              {INDUSTRIES.map((industry) => (
                <option key={industry.value} value={industry.value}>
                  {industry.label}
                </option>
              ))}
            </SelectInput>
          </FormField>

          <FormField label="Business stage" htmlFor="business_stage">
            <SelectInput
              id="business_stage"
              value={formData.business_stage || ""}
              onChange={(e) => updateField("business_stage", e.target.value)}
            >
              <option value="">Select stage</option>
              {BUSINESS_STAGE.map((stage) => (
                <option key={stage.value} value={stage.value}>
                  {stage.label}
                </option>
              ))}
            </SelectInput>
          </FormField>

          <FormField label="Business structure" htmlFor="business_structure">
            <SelectInput
              id="business_structure"
              value={formData.business_structure || ""}
              onChange={(e) => updateField("business_structure", e.target.value)}
            >
              <option value="">Select structure</option>
              {BUSINESS_STRUCTURE.map((structure) => (
                <option key={structure.value} value={structure.value}>
                  {structure.label}
                </option>
              ))}
            </SelectInput>
          </FormField>

          <FormField label="Year started" htmlFor="year_started">
            <TextInput
              id="year_started"
              type="number"
              value={formData.year_started || ""}
              onChange={(e) => updateField("year_started", e.target.value)}
              placeholder="2024"
            />
          </FormField>

          <FormField label="Subscription tier" htmlFor="subscription_tier">
            <SelectInput
              id="subscription_tier"
              value={formData.subscription_tier || "vaka"}
              onChange={(e) => updateField("subscription_tier", e.target.value)}
            >
              <option value="vaka">Vaka</option>
              <option value="mana">Mana</option>
              <option value="moana">Moana</option>
            </SelectInput>
          </FormField>
        </FormCard>
      )}

      {activeSection === "location" && (
        <FormCard
          title="Location & operations"
          description="Add where the business is based and where people can find it."
        >
          <FormField label="Address" htmlFor="address">
            <TextInput
              id="address"
              value={formData.address || ""}
              onChange={(e) => updateField("address", e.target.value)}
              placeholder="123 Example Street"
            />
          </FormField>

          <FormField label="Suburb" htmlFor="suburb">
            <TextInput
              id="suburb"
              value={formData.suburb || ""}
              onChange={(e) => updateField("suburb", e.target.value)}
              placeholder="Mangere"
            />
          </FormField>

          <FormField label="City" htmlFor="city" required error={errors.city}>
            <TextInput
              id="city"
              value={formData.city || ""}
              onChange={(e) => updateField("city", e.target.value)}
              placeholder="Auckland"
              error={!!errors.city}
            />
          </FormField>

          <FormField label="State / Region" htmlFor="state_region">
            <TextInput
              id="state_region"
              value={formData.state_region || ""}
              onChange={(e) => updateField("state_region", e.target.value)}
              placeholder="Auckland"
            />
          </FormField>

          <FormField label="Postal code" htmlFor="postal_code">
            <TextInput
              id="postal_code"
              value={formData.postal_code || ""}
              onChange={(e) => updateField("postal_code", e.target.value)}
              placeholder="2025"
            />
          </FormField>

          <FormField label="Country" htmlFor="country" required error={errors.country}>
            <SelectInput
              id="country"
              value={formData.country || ""}
              onChange={(e) => updateField("country", e.target.value)}
              error={!!errors.country}
            >
              <option value="">Select country</option>
              {COUNTRIES.map((country) => (
                <option key={country.value} value={country.value}>
                  {country.label}
                </option>
              ))}
            </SelectInput>
          </FormField>

          <FormField label="Business hours" htmlFor="business_hours" className="md:col-span-2">
            <TextArea
              id="business_hours"
              value={formData.business_hours || ""}
              onChange={(e) => updateField("business_hours", e.target.value)}
              placeholder="Mon–Fri 9am–5pm, Sat 10am–2pm..."
              className="min-h-[100px]"
            />
          </FormField>
        </FormCard>
      )}

      {activeSection === "overview" && (
        <FormCard
          title="Overview & story"
          description="Add more detail about the business, its founder, and growth context."
        >
          <FormField
            label="Founder story"
            htmlFor="founder_story"
            className="md:col-span-2"
          >
            <TextArea
              id="founder_story"
              value={formData.founder_story || ""}
              onChange={(e) => updateField("founder_story", e.target.value)}
              placeholder="Share the story behind the business..."
            />
          </FormField>

          <FormField label="Team size band" htmlFor="team_size_band">
            <SelectInput
              id="team_size_band"
              value={formData.team_size_band || ""}
              onChange={(e) => updateField("team_size_band", e.target.value)}
            >
              <option value="">Select team size</option>
              {TEAM_SIZE.map((size) => (
                <option key={size.value} value={size.value}>
                  {size.label}
                </option>
              ))}
            </SelectInput>
          </FormField>

                  </FormCard>
      )}

      {activeSection === "contact" && (
        <FormCard
          title="Contact details"
          description="Add the main ways customers and collaborators can reach the business."
        >
          <FormField label="Contact person" htmlFor="business_contact_person">
            <TextInput
              id="business_contact_person"
              value={formData.business_contact_person || ""}
              onChange={(e) =>
                updateField("business_contact_person", e.target.value)
              }
              placeholder="Jane Doe"
            />
          </FormField>

          <FormField
            label="Business email"
            htmlFor="business_email"
            required
            error={errors.business_email}
          >
            <TextInput
              id="business_email"
              type="email"
              value={formData.business_email || ""}
              onChange={(e) => updateField("business_email", e.target.value)}
              placeholder="hello@business.com"
              error={!!errors.business_email}
            />
          </FormField>

          <FormField label="Business phone" htmlFor="business_phone">
            <TextInput
              id="business_phone"
              value={formData.business_phone || ""}
              onChange={(e) => updateField("business_phone", e.target.value)}
              placeholder="+64 ..."
            />
          </FormField>

          <FormField label="Business website" htmlFor="business_website">
            <TextInput
              id="business_website"
              value={formData.business_website || ""}
              onChange={(e) => updateField("business_website", e.target.value)}
              placeholder="https://yourbusiness.com"
            />
          </FormField>
        </FormCard>
      )}

      {activeSection === "social" && (
        <FormCard
          title="Social links"
          description="Only add links you want displayed publicly."
        >
          <FormField label="Facebook" htmlFor="social_facebook">
            <TextInput
              id="social_facebook"
              value={formData.social_links?.facebook || ""}
              onChange={(e) => setSocialLink("facebook", e.target.value)}
              placeholder="https://facebook.com/..."
            />
          </FormField>

          <FormField label="Instagram" htmlFor="social_instagram">
            <TextInput
              id="social_instagram"
              value={formData.social_links?.instagram || ""}
              onChange={(e) => setSocialLink("instagram", e.target.value)}
              placeholder="https://instagram.com/..."
            />
          </FormField>

          <FormField label="LinkedIn" htmlFor="social_linkedin">
            <TextInput
              id="social_linkedin"
              value={formData.social_links?.linkedin || ""}
              onChange={(e) => setSocialLink("linkedin", e.target.value)}
              placeholder="https://linkedin.com/..."
            />
          </FormField>

          <FormField label="TikTok" htmlFor="social_tiktok">
            <TextInput
              id="social_tiktok"
              value={formData.social_links?.tiktok || ""}
              onChange={(e) => setSocialLink("tiktok", e.target.value)}
              placeholder="https://tiktok.com/@..."
            />
          </FormField>

          <FormField label="YouTube" htmlFor="social_youtube">
            <TextInput
              id="social_youtube"
              value={formData.social_links?.youtube || ""}
              onChange={(e) => setSocialLink("youtube", e.target.value)}
              placeholder="https://youtube.com/..."
            />
          </FormField>

                  </FormCard>
      )}

      {activeSection === "identity" && (
        <FormCard
          title="Identity, language & opportunities"
          description="Add profile context that helps make the listing richer and more useful."
        >
          <FormField label="Cultural identity" htmlFor="cultural_identity">
            <div className="space-y-2">
              <div className="text-xs text-slate-500">Select all that apply</div>
              <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-lg p-2 space-y-1">
                {CULTURAL_IDENTITIES.map((identity) => (
                  <label key={identity} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-slate-50 p-1 rounded">
                    <input
                      type="checkbox"
                      checked={formData.cultural_identity?.includes(identity) || false}
                      onChange={(e) => {
                        const current = formData.cultural_identity ? formData.cultural_identity.split(', ').filter(Boolean) : [];
                        if (e.target.checked) {
                          updateField("cultural_identity", [...current, identity].join(', '));
                        } else {
                          updateField("cultural_identity", current.filter(id => id !== identity).join(', '));
                        }
                      }}
                      className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span>{identity}</span>
                  </label>
                ))}
              </div>
            </div>
          </FormField>

          <FormField label="Languages spoken" htmlFor="languages_spoken">
            <div className="space-y-2">
              <div className="text-xs text-slate-500">Select all that apply</div>
              <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-lg p-2 space-y-1">
                {LANGUAGES.map((language) => (
                  <label key={language.value} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-slate-50 p-1 rounded">
                    <input
                      type="checkbox"
                      checked={formData.languages_spoken?.includes(language.value) || false}
                      onChange={(e) => {
                        const current = formData.languages_spoken ? formData.languages_spoken.split(', ').filter(Boolean) : [];
                        if (e.target.checked) {
                          updateField("languages_spoken", [...current, language.value].join(', '));
                        } else {
                          updateField("languages_spoken", current.filter(lang => lang !== language.value).join(', '));
                        }
                      }}
                      className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span>{language.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </FormField>

          <FormField label="Age range" htmlFor="age_range">
            <SelectInput
              id="age_range"
              value={formData.age_range || ""}
              onChange={(e) => updateField("age_range", e.target.value)}
            >
              <option value="">Select age range</option>
              {AGE_RANGES.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </SelectInput>
          </FormField>

          <FormField label="Gender" htmlFor="gender">
            <SelectInput
              id="gender"
              value={formData.gender || ""}
              onChange={(e) => updateField("gender", e.target.value)}
            >
              <option value="">Select gender</option>
              {GENDER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </SelectInput>
          </FormField>

          <div className="md:col-span-2 grid gap-4">
            <Toggle
              checked={!!formData.collaboration_interest}
              onChange={(value) => updateField("collaboration_interest", value)}
              label="Open to collaborations"
              description="Shows interest in collaborating with other businesses or creators."
            />

            <Toggle
              checked={!!formData.mentorship_offering}
              onChange={(value) => updateField("mentorship_offering", value)}
              label="Offers mentorship"
              description="Indicates willingness to mentor others."
            />

            <Toggle
              checked={!!formData.open_to_future_contact}
              onChange={(value) => updateField("open_to_future_contact", value)}
              label="Open to future contact"
              description="Allows future outreach for opportunities and partnerships."
            />

            <Toggle
              checked={!!formData.business_acquisition_interest}
              onChange={(value) =>
                updateField("business_acquisition_interest", value)
              }
              label="Open to acquisition interest"
              description="Indicates the business may be open to acquisition-related conversations."
            />

            <Toggle
              checked={!!formData.is_business_registered}
              onChange={(value) => updateField("is_business_registered", value)}
              label="Business is registered"
              description="Use this when the business is formally registered."
            />
          </div>
        </FormCard>
      )}

      {activeSection === "media" && (
        <FormCard
          title="Brand & media"
          description="Upload your business logo and banners to showcase your brand."
        >
          <BrandMediaSection
            form={formData}
            handleFileUpload={handleFileUpload}
            removeImage={removeImage}
            logoInputId="logo-upload"
            bannerInputId="banner-upload"
            mobileBannerInputId="mobile-banner-upload"
            labelCls="block text-sm font-semibold text-slate-900"
            subscriptionTier={formData.subscription_tier || 'vaka'}
          />
        </FormCard>
      )}

      {activeSection === "referral" && (
        <FormCard
          title="Referral"
          description="Referral details and relationship fields."
        >
          <FormField label="Referral code" htmlFor="referral_code">
            <TextInput
              id="referral_code"
              value={formData.referral_code || ""}
              onChange={(e) => updateField("referral_code", e.target.value)}
              placeholder="ABC123"
            />
          </FormField>

          <FormField label="Referred by business ID" htmlFor="referred_by_business_id">
            <TextInput
              id="referred_by_business_id"
              value={formData.referred_by_business_id || ""}
              onChange={(e) =>
                updateField("referred_by_business_id", e.target.value || null)
              }
              placeholder="UUID"
            />
          </FormField>
        </FormCard>
      )}

      {activeSection === "admin" && showAdminFields && (
        <FormCard
          title="Admin controls"
          description="Visibility, status, verification, and system-facing settings."
        >
          <FormField label="Status" htmlFor="status">
            <SelectInput
              id="status"
              value={formData.status || BUSINESS_STATUS.PENDING}
              onChange={(e) => updateField("status", e.target.value)}
            >
              <option value={BUSINESS_STATUS.PENDING}>Pending</option>
              <option value={BUSINESS_STATUS.ACTIVE}>Active</option>
              <option value={BUSINESS_STATUS.REJECTED}>Rejected</option>
            </SelectInput>
          </FormField>

          <FormField
            label="Visibility tier"
            htmlFor="visibility_tier"
            required
            error={errors.visibility_tier}
          >
            <SelectInput
              id="visibility_tier"
              value={formData.visibility_tier || "none"}
              onChange={(e) => updateField("visibility_tier", e.target.value)}
              error={!!errors.visibility_tier}
            >
              <option value="none">None</option>
              <option value="homepage">Homepage</option>
              <option value="spotlight">Spotlight</option>
            </SelectInput>
          </FormField>

          <FormField label="Visibility mode" htmlFor="visibility_mode">
            <TextInput
              id="visibility_mode"
              value={formData.visibility_mode || ""}
              onChange={(e) => updateField("visibility_mode", e.target.value)}
              placeholder="Optional"
            />
          </FormField>

          <FormField label="Created via" htmlFor="created_via">
            <TextInput
              id="created_via"
              value={formData.created_via || ""}
              onChange={(e) => updateField("created_via", e.target.value)}
              placeholder="admin-dashboard"
            />
          </FormField>

          <FormField label="Tier expires at" htmlFor="tier_expires_at">
            <TextInput
              id="tier_expires_at"
              type="datetime-local"
              value={formData.tier_expires_at || ""}
              onChange={(e) => updateField("tier_expires_at", e.target.value || null)}
            />
          </FormField>

          <div className="md:col-span-2 grid gap-4">
            <Toggle
              checked={!!formData.is_verified}
              onChange={(value) => updateField("is_verified", value)}
              label="Verified listing"
              description="Marks the business as verified."
            />

            <Toggle
              checked={!!formData.is_active}
              onChange={(value) => updateField("is_active", value)}
              label="Active listing"
              description="Controls whether the business is active in the system."
            />

            <Toggle
              checked={!!formData.referral_reward_applied}
              onChange={(value) => updateField("referral_reward_applied", value)}
              label="Referral reward applied"
              description="Use when the referral reward has already been processed."
            />
          </div>
        </FormCard>
      )}

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-slate-500">
          Step {currentIndex + 1} of {sections.length}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={goBack}
            disabled={isFirstSection}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          {!isLastSection ? (
            <button
              type="button"
              onClick={goNext}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Next
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 text-sm font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save Business"}
            </button>
          )}
        </div>
      </div>

      <div className="sticky bottom-0 z-20 rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            {hasUnsavedChanges() && (
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                <AlertTriangle size={14} />
                Draft saved locally
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save Business"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}