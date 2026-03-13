"use client";

import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  User,
  Globe,
  Briefcase,
  GraduationCap,
  Users,
  Heart,
} from "lucide-react";
import { COUNTRIES, LANGUAGES } from "@/constants/unifiedConstants";

const EDUCATION_LEVELS = [
  { value: "high-school", label: "High School" },
  { value: "some-college", label: "Some College" },
  { value: "associate-degree", label: "Associate Degree" },
  { value: "bachelors-degree", label: "Bachelor's Degree" },
  { value: "masters-degree", label: "Master's Degree" },
  { value: "phd", label: "PhD or Doctorate" },
  { value: "professional-degree", label: "Professional Degree (MD, JD, etc.)" },
  { value: "trade-certification", label: "Trade Certification" },
  { value: "other", label: "Other" },
];

const PROFESSIONAL_BACKGROUND_OPTIONS = [
  { value: "agriculture", label: "Agriculture" },
  { value: "arts-culture", label: "Arts & Culture" },
  { value: "education", label: "Education" },
  { value: "finance", label: "Finance & Banking" },
  { value: "government", label: "Government/Public Service" },
  { value: "healthcare", label: "Healthcare" },
  { value: "hospitality", label: "Hospitality & Tourism" },
  { value: "it-technology", label: "IT & Technology" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "media-communications", label: "Media & Communications" },
  { value: "non-profit", label: "Non-Profit" },
  { value: "retail", label: "Retail" },
  { value: "trade-construction", label: "Trade & Construction" },
  { value: "transport-logistics", label: "Transport & Logistics" },
  { value: "other", label: "Other" },
];

const SKILLS_EXPERTISE_OPTIONS = [
  { value: "business-strategy", label: "Business Strategy" },
  { value: "financial-management", label: "Financial Management" },
  { value: "marketing-sales", label: "Marketing & Sales" },
  { value: "digital-marketing", label: "Digital Marketing" },
  { value: "project-management", label: "Project Management" },
  { value: "leadership", label: "Leadership" },
  { value: "data-analysis", label: "Data Analysis" },
  { value: "web-development", label: "Web Development" },
  { value: "graphic-design", label: "Graphic Design" },
  { value: "content-creation", label: "Content Creation" },
  { value: "public-speaking", label: "Public Speaking" },
  { value: "languages", label: "Multiple Languages" },
  { value: "networking", label: "Networking" },
  { value: "negotiation", label: "Negotiation" },
  { value: "other", label: "Other" },
];

const INVESTMENT_INTEREST_OPTIONS = [
  { value: "not-interested", label: "Not Interested" },
  { value: "exploring", label: "Exploring Options" },
  { value: "angel-investor", label: "Angel Investor" },
  { value: "venture-capital", label: "Venture Capital" },
  { value: "community-funding", label: "Community Funding" },
  { value: "impact-investing", label: "Impact Investing" },
];

const SECTIONS = [
  {
    key: "basic",
    label: "Basic Information",
    icon: User,
    description: "Your name, location, and contact details",
  },
  {
    key: "cultural",
    label: "Cultural Identity",
    icon: Globe,
    description: "Your Pacific cultural background and languages",
  },
  {
    key: "professional",
    label: "Professional Background",
    icon: Briefcase,
    description: "Your work experience and professional expertise",
  },
  {
    key: "education",
    label: "Education & Skills",
    icon: GraduationCap,
    description: "Your education level and professional skills",
  },
  {
    key: "business",
    label: "Business Experience",
    icon: Users,
    description: "Your entrepreneurial journey and business goals",
  },
  {
    key: "community",
    label: "Community & Engagement",
    icon: Heart,
    description: "How you engage with the Pacific business community",
  },
];

export default function ProfileSettingsAccordion({ onComplete }) {
  const getInitialForm = () => ({
    display_name: "",
    city: "",
    country: "",
    primary_cultural: [],
    languages: [],
    professional_background: [],
    years_operating: "",
    education_level: "",
    skills_expertise: [],
    business_goals: "",
    mentorship_availability: false,
    investment_interest: "",
  });

  const [form, setForm] = useState(() => getInitialForm());
  const [expandedSections, setExpandedSections] = useState(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errors, setErrors] = useState({ submit: undefined });

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const { getSupabase } = await import("@/lib/supabase/client");
      const supabase = getSupabase();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileData) {
        setForm({
          display_name:
            profileData.display_name ||
            user?.user_metadata?.full_name ||
            user?.user_metadata?.display_name ||
            "",
          city: profileData.city || "",
          country: profileData.country || "",
          primary_cultural: Array.isArray(profileData.primary_cultural)
            ? profileData.primary_cultural
            : [],
          languages: Array.isArray(profileData.languages) ? profileData.languages : [],
          professional_background: Array.isArray(profileData.professional_background)
            ? profileData.professional_background
            : [],
          years_operating: profileData.years_operating || "",
          education_level: profileData.education_level || "",
          skills_expertise: Array.isArray(profileData.skills_expertise)
            ? profileData.skills_expertise
            : [],
          business_goals: profileData.business_goals || "",
          mentorship_availability: profileData.mentorship_availability || false,
          investment_interest: profileData.investment_interest || "",
        });
      }
    } catch (error) {
      console.error("Error loading profile data:", error);
    }
  };

  const toggleSection = (sectionKey) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionKey)) next.delete(sectionKey);
      else next.add(sectionKey);
      return next;
    });
  };

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const toggleArrayItem = (field, item) => {
    setForm((prev) => {
      const currentArray = prev[field] || [];
      if (currentArray.includes(item)) {
        return { ...prev, [field]: currentArray.filter((i) => i !== item) };
      }
      return { ...prev, [field]: [...currentArray, item] };
    });
  };

  const saveProfile = async () => {
    const { getSupabase } = await import("@/lib/supabase/client");
    const supabase = getSupabase();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("User not authenticated");

    const transformedData = { ...form };

    const arrayFields = [
      "primary_cultural",
      "professional_background",
      "skills_expertise",
      "languages",
    ];

    arrayFields.forEach((field) => {
      if (Array.isArray(transformedData[field]) && transformedData[field].length === 0) {
        transformedData[field] = [];
      }
    });

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      ...transformedData,
      updated_at: new Date().toISOString(),
    });

    if (error) throw error;
  };

  const handleSaveSection = async () => {
    setSubmitting(true);
    setErrors({ submit: undefined });

    try {
      await saveProfile();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
      if (onComplete) await onComplete();
    } catch (error) {
      console.error("Failed to save profile section:", error);
      setErrors((prev) => ({
        ...prev,
        submit: "Failed to save profile. Please try again.",
      }));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveAll = async () => {
    setSubmitting(true);
    setErrors({ submit: undefined });

    try {
      await saveProfile();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
      if (onComplete) await onComplete();
    } catch (error) {
      console.error("Error saving profile:", error);
      setErrors((prev) => ({
        ...prev,
        submit: "Failed to save profile. Please try again.",
      }));
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls =
    "w-full min-h-[44px] border border-slate-300 rounded-xl px-4 py-3 text-sm text-[#0a1628] placeholder:text-slate-400 focus:outline-none focus:border-[#0d4f4f] focus:ring-2 focus:ring-[#0d4f4f]/10 bg-white shadow-sm";

  const selectCls =
    "w-full min-h-[44px] border border-slate-300 rounded-xl px-4 py-3 pr-10 text-sm text-[#0a1628] focus:outline-none focus:border-[#0d4f4f] focus:ring-2 focus:ring-[#0d4f4f]/10 bg-white appearance-none shadow-sm";

  const textareaCls =
    "w-full border border-slate-300 rounded-xl px-4 py-3 text-sm text-[#0a1628] placeholder:text-slate-400 focus:outline-none focus:border-[#0d4f4f] focus:ring-2 focus:ring-[#0d4f4f]/10 bg-white resize-none shadow-sm";

  const renderSectionContent = (sectionKey) => {
    if (sectionKey === "basic") {
      return (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Full Name
            </label>
            <input
              type="text"
              value={form.display_name || ""}
              onChange={(e) => handleInputChange("display_name", e.target.value)}
              className={inputCls}
              placeholder="Your full name"
            />
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h5 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-700">
              Location
            </h5>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  City
                </label>
                <input
                  type="text"
                  value={form.city || ""}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className={inputCls}
                  placeholder="Your city"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Country
                </label>
                <select
                  value={form.country || ""}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  className={selectCls}
                >
                  <option value="">Select country</option>
                  {COUNTRIES.map((country) => (
                    <option key={country.value} value={country.value}>
                      {country.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (sectionKey === "cultural") {
      return (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Cultural Identity
            </label>
            <p className="mb-3 text-sm text-slate-600">
              Select all cultural identities that apply to you
            </p>
            <div className="max-h-64 space-y-2 overflow-y-auto">
              {COUNTRIES.map((country) => (
                <label
                  key={country.value}
                  className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 transition-colors hover:bg-slate-100"
                >
                  <input
                    type="checkbox"
                    checked={form.primary_cultural?.includes(country.value) || false}
                    onChange={() => toggleArrayItem("primary_cultural", country.value)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#0d4f4f] focus:ring-[#0d4f4f]"
                  />
                  <span className="text-sm leading-5 text-slate-700">{country.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Languages Spoken
            </label>
            <p className="mb-3 text-sm text-slate-600">
              Select all languages that you speak
            </p>
            <div className="max-h-64 space-y-2 overflow-y-auto">
              {LANGUAGES.map((language) => (
                <label
                  key={language.value}
                  className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 transition-colors hover:bg-slate-100"
                >
                  <input
                    type="checkbox"
                    checked={form.languages?.includes(language.value) || false}
                    onChange={() => toggleArrayItem("languages", language.value)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#0d4f4f] focus:ring-[#0d4f4f]"
                  />
                  <span className="text-sm leading-5 text-slate-700">{language.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (sectionKey === "professional") {
      return (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Professional Background
            </label>
            <p className="mb-3 text-sm text-slate-600">
              Select industries or roles you have worked in
            </p>
            <div className="max-h-64 space-y-2 overflow-y-auto">
              {PROFESSIONAL_BACKGROUND_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 transition-colors hover:bg-slate-100"
                >
                  <input
                    type="checkbox"
                    checked={form.professional_background?.includes(option.value) || false}
                    onChange={() =>
                      toggleArrayItem("professional_background", option.value)
                    }
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#0d4f4f] focus:ring-[#0d4f4f]"
                  />
                  <span className="text-sm leading-5 text-slate-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Years Operating in Business
            </label>
            <input
              type="number"
              value={form.years_operating || ""}
              onChange={(e) => handleInputChange("years_operating", e.target.value)}
              className={inputCls}
              placeholder="Number of years"
              min="0"
            />
          </div>
        </div>
      );
    }

    if (sectionKey === "education") {
      return (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Highest Education Level
            </label>
            <select
              value={form.education_level || ""}
              onChange={(e) => handleInputChange("education_level", e.target.value)}
              className={selectCls}
            >
              <option value="">Select education level</option>
              {EDUCATION_LEVELS.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Professional Skills & Expertise
            </label>
            <p className="mb-3 text-sm text-slate-600">
              Select your key professional skills
            </p>
            <div className="max-h-64 space-y-2 overflow-y-auto">
              {SKILLS_EXPERTISE_OPTIONS.map((skill) => (
                <label
                  key={skill.value}
                  className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 transition-colors hover:bg-slate-100"
                >
                  <input
                    type="checkbox"
                    checked={form.skills_expertise?.includes(skill.value) || false}
                    onChange={() => toggleArrayItem("skills_expertise", skill.value)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#0d4f4f] focus:ring-[#0d4f4f]"
                  />
                  <span className="text-sm leading-5 text-slate-700">{skill.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (sectionKey === "business") {
      return (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Business Goals
            </label>
            <textarea
              value={form.business_goals || ""}
              onChange={(e) => handleInputChange("business_goals", e.target.value)}
              className={textareaCls}
              rows={5}
              placeholder="What are you building toward in your business?"
            />
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Investment Interest
            </label>
            <select
              value={form.investment_interest || ""}
              onChange={(e) => handleInputChange("investment_interest", e.target.value)}
              className={selectCls}
            >
              <option value="">Select an option</option>
              {INVESTMENT_INTEREST_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      );
    }

    if (sectionKey === "community") {
      return (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3">
              <input
                type="checkbox"
                checked={form.mentorship_availability || false}
                onChange={(e) =>
                  handleInputChange("mentorship_availability", e.target.checked)
                }
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#0d4f4f] focus:ring-[#0d4f4f]"
              />
              <div>
                <span className="block text-sm font-medium text-slate-700">
                  Open to mentorship or community support opportunities
                </span>
                <span className="mt-1 block text-sm text-slate-600">
                  Let us know if you are open to being part of mentoring, support, or
                  collaboration opportunities in the community.
                </span>
              </div>
            </label>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderSection = (section) => {
    const isExpanded = expandedSections.has(section.key);

    return (
      <div
        key={section.key}
        className="rounded-xl border border-slate-300 bg-white shadow-sm transition-all hover:shadow-md"
      >
        <div className="w-full px-4 py-4 sm:px-6">
          <button
            type="button"
            onClick={() => toggleSection(section.key)}
            className="flex w-full items-start justify-between gap-3 text-left transition-colors"
          >
            <div className="flex items-start gap-3">
              <section.icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#0d4f4f]" />
              <div>
                <h4 className="break-words text-sm font-semibold text-[#0a1628]">
                  {section.label}
                </h4>
                <p className="mt-1 text-sm leading-5 text-slate-600">
                  {section.description}
                </p>
              </div>
            </div>

            <div className="mt-0.5 flex-shrink-0 text-slate-400">
              {isExpanded ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </div>
          </button>
        </div>

        {isExpanded && (
          <>
            <div className="border-t border-slate-200 bg-slate-50 px-4 py-4 sm:px-6 sm:py-5">
              {renderSectionContent(section.key)}
            </div>

            <div className="flex justify-end border-t border-gray-200 bg-gray-50 px-4 py-4 sm:px-6">
              <button
                type="button"
                onClick={handleSaveSection}
                disabled={submitting}
                className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Saving..." : "Save Section"}
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="rounded-2xl bg-white">
      <div className="p-4 sm:p-8">
        {saveSuccess && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4">
            <p className="text-sm text-green-800">Profile saved successfully.</p>
          </div>
        )}

        {errors.submit && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-800">{errors.submit}</p>
          </div>
        )}

        <div className="space-y-4">{SECTIONS.map(renderSection)}</div>
      </div>

      <div className="flex justify-end border-t border-gray-200 px-4 py-5 sm:px-8">
        <button
          type="button"
          onClick={handleSaveAll}
          disabled={submitting}
          className="rounded-xl bg-[#0d4f4f] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0a3d3d] focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Save All Changes"}
        </button>
      </div>
    </div>
  );
}