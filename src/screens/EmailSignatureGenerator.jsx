"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building,
  ChevronDown,
  Copy,
  Download,
  Eye,
  FileText,
  Globe,
  Image as ImageIcon,
  Mail,
  MapPin,
  Palette,
  Phone,
  Plus,
  Save,
  Settings,
  Upload,
  User,
  Trash2,
  Briefcase,
  BadgeCheck,
  Linkedin,
  Facebook,
  Instagram,
} from "lucide-react";

import { getSupabase } from "@/lib/supabase/client";
import { createPageUrl } from "@/utils";
import HeroRegistry from "../components/shared/HeroRegistry";
import { useToast } from "@/components/ui/toast/ToastProvider";

const SIGNATURE_TEMPLATES = {
  modern: {
    id: "modern",
    name: "Modern",
    description: "Clean and professional",
    colors: {
      primary: "#0a1628",
      secondary: "#0d4f4f",
      accent: "#00c4cc",
      text: "#0f172a",
    },
  },
  pacific: {
    id: "pacific",
    name: "Pacific",
    description: "Pacific Market inspired",
    colors: {
      primary: "#0a1628",
      secondary: "#c9a84c",
      accent: "#00c4cc",
      text: "#0f172a",
    },
  },
  minimal: {
    id: "minimal",
    name: "Minimal",
    description: "Simple and understated",
    colors: {
      primary: "#333333",
      secondary: "#666666",
      accent: "#0d4f4f",
      text: "#222222",
    },
  },
};

function SignatureAccordionSection({
  title,
  subtitle,
  summary,
  icon: Icon,
  isOpen,
  onToggle,
  children,
}) {
  return (
    <div className="border-b border-gray-100 last:border-b-0 bg-gradient-to-r from-[#0a1628] to-[#0d4f4f] text-white">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-4 sm:px-5 py-4 text-left hover:bg-white/10 transition"
      >
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4 text-white" />
          </div>

          <div className="min-w-0">
            <div className="font-semibold text-white text-sm">{title}</div>
            {subtitle ? (
              <div className="text-xs text-gray-300 mt-0.5">{subtitle}</div>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {summary ? (
            <div className="hidden md:block text-xs text-gray-300 text-right max-w-[160px] truncate">
              {summary}
            </div>
          ) : null}
          <ChevronDown
            className={`w-4 h-4 text-gray-300 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {isOpen ? (
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 bg-white">
          <div className="pt-1">{children}</div>
        </div>
      ) : null}
    </div>
  );
}

const createEmptySignature = () => {
  const template = SIGNATURE_TEMPLATES.modern;

  return {
    full_name: "",
    job_title: "",
    department: "",
    pronouns: "",

    business_name: "",
    logo_url: "",

    email: "",
    phone: "",
    website: "",
    address: "",

    linkedin: "",
    facebook: "",
    instagram: "",
    tiktok: "",

    template: "modern",

    brand_primary: template.colors.primary,
    brand_secondary: template.colors.secondary,
    brand_accent: template.colors.accent,
    text_color: template.colors.text,

    include_logo: true,
    include_badge: true,
    include_socials: true,
    include_address: true,
    include_pronouns: false,

    disclaimer: "",
  };
};

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function stripHtml(html) {
  if (typeof window === "undefined") return html.replace(/<[^>]*>/g, "");
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

function normalizeUrl(url) {
  if (!url) return "";
  const trimmed = String(url).trim();
  if (!trimmed) return "";
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("tel:")
  ) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

function formatBusinessAddress(business) {
  const parts = [
    business?.address,
    business?.suburb,
    business?.city,
    business?.state_region,
    business?.postal_code,
    business?.country,
  ].filter(Boolean);

  return parts.join(", ");
}

function generateSignatureHTML(signature) {
  const template = SIGNATURE_TEMPLATES[signature.template] || SIGNATURE_TEMPLATES.modern;

  const primary = signature.brand_primary || template.colors.primary;
  const secondary = signature.brand_secondary || template.colors.secondary;
  const accent = signature.brand_accent || template.colors.accent;
  const text = signature.text_color || template.colors.text;

  const logoCell = signature.include_logo && signature.logo_url
    ? `
      <td style="vertical-align: top; padding-right: 18px; width: 92px;">
        <img
          src="${escapeHtml(signature.logo_url)}"
          alt="${escapeHtml(signature.business_name || "Business Logo")}"
          style="display:block; width:80px; max-width:80px; height:auto; max-height:80px; object-fit:contain; border-radius:10px;"
        />
      </td>
    `
    : "";

  const socials = [];
  if (signature.include_socials && signature.linkedin) {
    socials.push(`
      <a href="${escapeHtml(normalizeUrl(signature.linkedin))}" target="_blank" style="text-decoration:none; margin-right:8px; color:${accent}; font-size:12px;">LinkedIn</a>
    `);
  }
  if (signature.include_socials && signature.facebook) {
    socials.push(`
      <a href="${escapeHtml(normalizeUrl(signature.facebook))}" target="_blank" style="text-decoration:none; margin-right:8px; color:${accent}; font-size:12px;">Facebook</a>
    `);
  }
  if (signature.include_socials && signature.instagram) {
    socials.push(`
      <a href="${escapeHtml(normalizeUrl(signature.instagram))}" target="_blank" style="text-decoration:none; margin-right:8px; color:${accent}; font-size:12px;">Instagram</a>
    `);
  }
  if (signature.include_socials && signature.tiktok) {
    socials.push(`
      <a href="${escapeHtml(normalizeUrl(signature.tiktok))}" target="_blank" style="text-decoration:none; margin-right:8px; color:${accent}; font-size:12px;">TikTok</a>
    `);
  }

  const nameLine = `
    <div style="margin-bottom:6px;">
      <div style="font-size:18px; line-height:1.25; font-weight:700; color:${primary};">
        ${escapeHtml(signature.full_name || "Your Name")}
      </div>
      ${
        signature.include_pronouns && signature.pronouns
          ? `<div style="font-size:11px; color:${secondary}; margin-top:2px;">${escapeHtml(
              signature.pronouns
            )}</div>`
          : ""
      }
    </div>
  `;

  const roleLine =
    signature.job_title || signature.department
      ? `
      <div style="font-size:13px; line-height:1.4; color:${secondary}; margin-bottom:2px;">
        ${escapeHtml(signature.job_title || "")}
        ${
          signature.job_title && signature.department
            ? ` <span style="color:#94a3b8;">|</span> `
            : ""
        }
        ${escapeHtml(signature.department || "")}
      </div>
    `
      : "";

  const businessLine = signature.business_name
    ? `
      <div style="font-size:13px; line-height:1.4; color:${secondary}; font-weight:600; margin-bottom:10px;">
        ${escapeHtml(signature.business_name)}
      </div>
    `
    : "";

  const contactRows = `
    ${
      signature.email
        ? `
      <div style="margin:3px 0; font-size:13px; color:${text};">
        <span style="color:${accent}; font-weight:700;">Email:</span>
        <a href="mailto:${escapeHtml(signature.email)}" style="color:${text}; text-decoration:none;"> ${escapeHtml(signature.email)}</a>
      </div>
    `
        : ""
    }

    ${
      signature.phone
        ? `
      <div style="margin:3px 0; font-size:13px; color:${text};">
        <span style="color:${accent}; font-weight:700;">Phone:</span>
        <a href="tel:${escapeHtml(signature.phone)}" style="color:${text}; text-decoration:none;"> ${escapeHtml(signature.phone)}</a>
      </div>
    `
        : ""
    }

    ${
      signature.website
        ? `
      <div style="margin:3px 0; font-size:13px; color:${text};">
        <span style="color:${accent}; font-weight:700;">Web:</span>
        <a href="${escapeHtml(normalizeUrl(signature.website))}" target="_blank" style="color:${text}; text-decoration:none;"> ${escapeHtml(signature.website)}</a>
      </div>
    `
        : ""
    }

    ${
      signature.include_address && signature.address
        ? `
      <div style="margin:3px 0; font-size:13px; color:${text};">
        <span style="color:${accent}; font-weight:700;">Address:</span>
        <span> ${escapeHtml(signature.address)}</span>
      </div>
    `
        : ""
    }
  `;

  const badgeBlock = signature.include_badge
    ? `
      <div style="margin-top:14px; padding-top:12px; border-top:1px solid #e5e7eb;">
        <span style="display:inline-block; background:${accent}; color:#ffffff; font-size:10px; font-weight:700; letter-spacing:0.04em; padding:5px 8px; border-radius:999px;">
          PACIFIC MARKET VERIFIED
        </span>
        <div style="margin-top:6px; font-size:10px; color:#64748b;">
          Listed on <a href="https://www.pacificmarket.co.nz" target="_blank" style="color:#64748b; text-decoration:none;">Pacific Market</a>
        </div>
      </div>
    `
    : "";

  const disclaimerBlock = signature.disclaimer
    ? `
      <div style="margin-top:12px; font-size:10px; line-height:1.45; color:#64748b;">
        ${escapeHtml(signature.disclaimer)}
      </div>
    `
    : "";

  return `
    <div style="font-family: Arial, Helvetica, sans-serif; margin:0; padding:18px 0; max-width:640px;">
      <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; width:100%; max-width:640px;">
        <tr>
          ${logoCell}
          <td style="vertical-align:top;">
            ${nameLine}
            ${roleLine}
            ${businessLine}

            <div style="margin-bottom:10px;">
              ${contactRows}
            </div>

            ${
              socials.length > 0
                ? `
              <div style="margin-top:8px;">
                ${socials.join("")}
              </div>
            `
                : ""
            }

            ${badgeBlock}
            ${disclaimerBlock}
          </td>
        </tr>
      </table>
    </div>
  `;
}

function generateSignatureText(signature) {
  let text = "";

  if (signature.full_name) text += `${signature.full_name}\n`;
  if (signature.job_title || signature.department) {
    text += `${signature.job_title || ""}${
      signature.job_title && signature.department ? " | " : ""
    }${signature.department || ""}\n`;
  }
  if (signature.business_name) text += `${signature.business_name}\n`;

  text += "\n";

  if (signature.email) text += `Email: ${signature.email}\n`;
  if (signature.phone) text += `Phone: ${signature.phone}\n`;
  if (signature.website) text += `Web: ${signature.website}\n`;
  if (signature.include_address && signature.address) {
    text += `Address: ${signature.address}\n`;
  }

  if (signature.include_socials) {
    if (signature.linkedin) text += `LinkedIn: ${signature.linkedin}\n`;
    if (signature.facebook) text += `Facebook: ${signature.facebook}\n`;
    if (signature.instagram) text += `Instagram: ${signature.instagram}\n`;
    if (signature.tiktok) text += `TikTok: ${signature.tiktok}\n`;
  }

  if (signature.include_badge) {
    text += `\nPACIFIC MARKET VERIFIED\nListed on Pacific Market\n`;
  }

  if (signature.disclaimer) {
    text += `\n${signature.disclaimer}\n`;
  }

  return text.trim();
}

export default function EmailSignatureGeneratorPage() {
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState("");
  const [mode, setMode] = useState("business");
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadedBusinessIdRef = useRef(null);
  const isUserEditingRef = useRef(false);

  const [openSections, setOpenSections] = useState([
    "business",
    "details",
    "contact",
    "brand",
  ]);

  const [businessSignature, setBusinessSignature] = useState(createEmptySignature());
  const [customSignature, setCustomSignature] = useState(createEmptySignature());

  const signature = mode === "business" ? businessSignature : customSignature;

  const setActiveSignature = (updater) => {
    if (mode === "business") {
      setBusinessSignature(updater);
      return;
    }
    setCustomSignature(updater);
  };

  const setField = (key, value) => {
    isUserEditingRef.current = true;
    setActiveSignature((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSection = (section) => {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((item) => item !== section)
        : [...prev, section]
    );
  };

  const inputCls =
    "w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#0d4f4f] bg-white text-[#0a1628]";
  const checkboxCls =
    "w-4 h-4 rounded border-gray-300 text-[#0d4f4f] focus:ring-[#0d4f4f]";

  useEffect(() => {
    const loadData = async () => {
      try {
        const supabase = getSupabase();

        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        if (!authUser) {
          setLoading(false);
          return;
        }

        setUser(authUser);

        const { data: ownedBusinesses, error: ownedError } = await supabase
          .from("businesses")
          .select("*")
          .eq("owner_user_id", authUser.id);

        if (ownedError) throw ownedError;

        const { data: claims, error: claimsError } = await supabase
          .from("claim_requests")
          .select("business_id")
          .eq("user_id", authUser.id)
          .eq("status", "approved");

        if (claimsError) throw claimsError;

        const claimedIds = (claims || [])
          .map((claim) => claim.business_id)
          .filter(Boolean);

        let claimedBusinesses = [];
        if (claimedIds.length > 0) {
          const { data: claimed, error: claimedError } = await supabase
            .from("businesses")
            .select("*")
            .in("id", claimedIds);

          if (claimedError) throw claimedError;
          claimedBusinesses = claimed || [];
        }

        const merged = [...(ownedBusinesses || []), ...claimedBusinesses];
        const unique = Array.from(new Map(merged.map((b) => [b.id, b])).values());

        setBusinesses(unique);

        if (unique.length > 0) {
          setSelectedBusinessId(unique[0].id);
        }
      } catch (error) {
        console.error("Error loading signature page:", error);
        toast({
          variant: "error",
          title: "Failed to load data",
          description: error?.message || "Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [toast]);

  useEffect(() => {
    if (!selectedBusinessId || mode !== "business") return;
    if (loadedBusinessIdRef.current === selectedBusinessId) return;

    const loadBusinessSettings = async () => {
      try {
        const supabase = getSupabase();

        const { data: business, error: businessError } = await supabase
          .from("businesses")
          .select("*")
          .eq("id", selectedBusinessId)
          .single();

        if (businessError) throw businessError;

        const { data: settings, error: settingsError } = await supabase
          .from("business_signature_settings")
          .select("*")
          .eq("business_id", selectedBusinessId)
          .maybeSingle();

        if (settingsError && settingsError.code !== "PGRST116") {
          throw settingsError;
        }

        const businessWebsite =
          business?.contact_website ||
          business?.website ||
          business?.website_url ||
          "";

        const businessAddress = formatBusinessAddress(business);

        if (business && !isUserEditingRef.current) {
          setBusinessSignature((prev) => ({
            ...prev,
            business_name: business?.name || "",
            logo_url: business?.logo_url || "",
            email: prev.email || business?.contact_email || "",
            phone: prev.phone || business?.contact_phone || "",
            website: prev.website || businessWebsite,
            address: prev.address || businessAddress,
          }));
        }

        if (settings && !isUserEditingRef.current) {
          setBusinessSignature((prev) => ({
            ...prev,
            full_name: settings.default_full_name || prev.full_name,
            job_title: settings.default_job_title || prev.job_title,
            department: settings.default_department || prev.department,
            pronouns: settings.default_pronouns || prev.pronouns,

            business_name: business?.name || prev.business_name,
            logo_url: business?.logo_url || prev.logo_url,

            email: settings.default_email || prev.email,
            phone: settings.default_phone || prev.phone,
            website: settings.default_website || prev.website,
            address: settings.default_address || prev.address,

            linkedin: settings.linkedin_url || "",
            facebook: settings.facebook_url || "",
            instagram: settings.instagram_url || "",
            tiktok: settings.tiktok_url || "",

            template: settings.template || "modern",

            brand_primary:
              settings.brand_primary ||
              SIGNATURE_TEMPLATES.modern.colors.primary,
            brand_secondary:
              settings.brand_secondary ||
              SIGNATURE_TEMPLATES.modern.colors.secondary,
            brand_accent:
              settings.brand_accent || SIGNATURE_TEMPLATES.modern.colors.accent,
            text_color:
              settings.text_color || SIGNATURE_TEMPLATES.modern.colors.text,

            include_logo: settings.include_logo ?? true,
            include_badge: settings.include_badge ?? true,
            include_socials: settings.include_socials ?? true,
            include_address: settings.include_address ?? true,
            include_pronouns: settings.include_pronouns ?? false,

            disclaimer: settings.disclaimer || "",
          }));
        }

        loadedBusinessIdRef.current = selectedBusinessId;
      } catch (error) {
        console.error("Error loading business signature settings:", error);
        toast({
          variant: "error",
          title: "Failed to load business settings",
          description: error?.message || "Please try again.",
        });
      }
    };

    loadBusinessSettings();
  }, [selectedBusinessId, mode, toast]);

  useEffect(() => {
    if (!selectedBusinessId || mode !== "business") return;
    loadedBusinessIdRef.current = null;
    isUserEditingRef.current = false;
  }, [selectedBusinessId, mode]);

  const previewHtml = useMemo(() => generateSignatureHTML(signature), [signature]);

  const getBusinessSummary = () => {
    if (mode === "business") {
      const business = businesses.find((b) => b.id === selectedBusinessId);
      return business?.name || "No business selected";
    }
    return signature.business_name || "Custom signature";
  };

  const getDetailsSummary = () => {
    const parts = [];
    if (signature.full_name) parts.push(signature.full_name);
    if (signature.job_title) parts.push(signature.job_title);
    return parts.join(" · ") || "No sender details yet";
  };

  const getContactSummary = () => {
    const parts = [];
    if (signature.email) parts.push(signature.email);
    if (signature.phone) parts.push(signature.phone);
    return parts.join(" · ") || "No contact details yet";
  };

  const getBrandSummary = () => {
    const parts = [];
    if (signature.logo_url && signature.include_logo) parts.push("Logo on");
    if (signature.include_badge) parts.push("Badge on");
    parts.push(signature.template || "modern");
    return parts.join(" · ");
  };

  const applyTemplate = (templateId) => {
    const template = SIGNATURE_TEMPLATES[templateId];
    if (!template) return;

    isUserEditingRef.current = true;
    setActiveSignature((prev) => ({
      ...prev,
      template: templateId,
      brand_primary: template.colors.primary,
      brand_secondary: template.colors.secondary,
      brand_accent: template.colors.accent,
      text_color: template.colors.text,
    }));
  };

  const handleBusinessChange = (nextId) => {
    isUserEditingRef.current = false;
    loadedBusinessIdRef.current = null;

    setBusinessSignature((prev) => ({
      ...createEmptySignature(),
      full_name: prev.full_name || "",
      job_title: prev.job_title || "",
      department: prev.department || "",
      pronouns: prev.pronouns || "",
    }));

    setSelectedBusinessId(nextId);
  };

  const handleLogoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "error",
        title: "File too large",
        description: "Please upload an image under 5MB.",
      });
      event.target.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast({
        variant: "error",
        title: "Invalid file type",
        description: "Please upload a PNG, JPG, WEBP, or GIF image.",
      });
      event.target.value = "";
      return;
    }

    try {
      const supabase = getSupabase();
      const bucket = "admin-listings";
      const path = `signature-logos/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from(bucket).getPublicUrl(path);

      setField("logo_url", data.publicUrl);

      toast({
        variant: "success",
        title: "Logo uploaded",
        description: "Your logo has been added to the signature.",
      });
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast({
        variant: "error",
        title: "Upload failed",
        description: error?.message || "Please try again.",
      });
    }

    event.target.value = "";
  };

  const saveBusinessSignatureSettings = async () => {
    if (mode !== "business" || !selectedBusinessId) return;

    try {
      setSaving(true);

      const supabase = getSupabase();

      const businessUpdate = {
        contact_email: signature.email || null,
        contact_phone: signature.phone || null,
        contact_website: signature.website || null,
        logo_url: signature.logo_url || null,
      };

      const { error: businessError } = await supabase
        .from("businesses")
        .update(businessUpdate)
        .eq("id", selectedBusinessId);

      if (businessError) throw businessError;

      const settingsUpdate = {
        business_id: selectedBusinessId,

        default_full_name: signature.full_name || null,
        default_job_title: signature.job_title || null,
        default_department: signature.department || null,
        default_pronouns: signature.pronouns || null,

        default_email: signature.email || null,
        default_phone: signature.phone || null,
        default_website: signature.website || null,
        default_address: signature.address || null,

        linkedin_url: signature.linkedin || null,
        facebook_url: signature.facebook || null,
        instagram_url: signature.instagram || null,
        tiktok_url: signature.tiktok || null,

        template: signature.template || "modern",

        brand_primary: signature.brand_primary || null,
        brand_secondary: signature.brand_secondary || null,
        brand_accent: signature.brand_accent || null,
        text_color: signature.text_color || null,

        include_logo: !!signature.include_logo,
        include_badge: !!signature.include_badge,
        include_socials: !!signature.include_socials,
        include_address: !!signature.include_address,
        include_pronouns: !!signature.include_pronouns,

        disclaimer: signature.disclaimer || null,
      };

      const { error: settingsError } = await supabase
        .from("business_signature_settings")
        .upsert(settingsUpdate, { onConflict: "business_id" });

      if (settingsError) throw settingsError;

      toast({
        variant: "success",
        title: "Signature settings saved",
        description: "Your business signature preferences were saved successfully.",
      });
    } catch (error) {
      console.error("Error saving signature settings:", error);
      toast({
        variant: "error",
        title: "Failed to save settings",
        description: error?.message || "Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const copyHtmlToClipboard = async () => {
    try {
      const html = generateSignatureHTML(signature);
      const text = generateSignatureText(signature);

      if (
        typeof navigator !== "undefined" &&
        navigator.clipboard &&
        window.ClipboardItem
      ) {
        const clipboardItem = new window.ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([text], { type: "text/plain" }),
        });

        await navigator.clipboard.write([clipboardItem]);
      } else {
        await navigator.clipboard.writeText(html);
      }

      setCopied(true);
      toast({
        variant: "success",
        title: "Copied",
        description: "Signature HTML copied to your clipboard.",
      });

      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Copy failed:", error);
      toast({
        variant: "error",
        title: "Copy failed",
        description: "Please try again.",
      });
    }
  };

  const downloadHtml = () => {
    const html = generateSignatureHTML(signature);
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const fileName = `${(signature.business_name || "email-signature")
      .replace(/[^a-z0-9]+/gi, "-")
      .toLowerCase()}-${signature.template || "modern"}.html`;

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  const downloadText = () => {
    const text = generateSignatureText(signature);
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const fileName = `${(signature.business_name || "email-signature")
      .replace(/[^a-z0-9]+/gi, "-")
      .toLowerCase()}-${signature.template || "modern"}.txt`;

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-[#f8f9fc]">
        <div className="w-8 h-8 rounded-full border-2 border-[#0d4f4f] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <HeroRegistry
        badge="Business Tool"
        title="Email Signature Generator"
        subtitle="Create polished, branded email signatures for founders, teams, and client-facing communication."
        description="Build business-specific signatures using saved business details, or create a custom one-off version for staff, contractors, or campaigns."
        actions={
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href={createPageUrl("BusinessPortal")}
              className="inline-flex items-center gap-2 bg-white text-[#0a1628] px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Portal
            </Link>

            <button
              onClick={copyHtmlToClipboard}
              className="flex items-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-[#0a1628] font-bold px-5 py-3 rounded-xl transition-all text-sm"
            >
              <Copy className="w-4 h-4" />
              {copied ? "Copied" : "Copy HTML"}
            </button>

            {mode === "business" ? (
              <button
                onClick={saveBusinessSignatureSettings}
                disabled={saving}
                className="flex items-center gap-2 bg-white text-[#0a1628] border border-gray-200 hover:border-[#0a1628] font-bold px-5 py-3 rounded-xl transition-all text-sm disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : "Save Settings"}
              </button>
            ) : null}
          </div>
        }
      />

      <div className="sm:hidden max-w-7xl mx-auto px-4 pt-4">
        <Link
          href={createPageUrl("BusinessPortal")}
          className="inline-flex items-center gap-2 bg-white text-[#0a1628] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition border border-gray-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Portal
        </Link>
      </div>

      <div className="min-h-screen bg-[#f8f9fc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Mode Tabs */}
          <div className="bg-white/95 border border-gray-200 shadow-sm rounded-2xl p-2 mb-8">
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => setMode("business")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-medium transition-all border ${
                  mode === "business"
                    ? "bg-[#0a1628] text-white shadow-sm border-[#0a1628]"
                    : "text-gray-600 border-gray-200 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                <Building className="w-4 h-4" />
                Business Signature
              </button>

              <button
                onClick={() => setMode("custom")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-medium transition-all border ${
                  mode === "custom"
                    ? "bg-[#0a1628] text-white shadow-sm border-[#0a1628]"
                    : "text-gray-600 border-gray-200 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                <Plus className="w-4 h-4" />
                Custom Signature
              </button>
            </div>
          </div>

          {/* Mode Description */}
          <div className="bg-white/95 border border-gray-200 shadow-sm rounded-2xl p-4 mb-8">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#0a1628]/10 flex items-center justify-center flex-shrink-0">
                {mode === "business" ? (
                  <Building className="w-4 h-4 text-[#0a1628]" />
                ) : (
                  <Plus className="w-4 h-4 text-[#0a1628]" />
                )}
              </div>

              <div>
                <h3 className="font-semibold text-[#0a1628] text-sm mb-1">
                  {mode === "business" ? "Business Signature" : "Custom Signature"}
                </h3>

                <p className="text-gray-600 text-sm">
                  {mode === "business"
                    ? "Use your saved business details to create a signature for a selected business. Ideal for founders who manage multiple businesses."
                    : "Create a one-off signature for a team member, contractor, client project, or temporary campaign. Nothing entered here is saved."}
                </p>

                <p className="text-amber-600 text-xs mt-2">
                  {mode === "business"
                    ? "Only your saved business signature settings are remembered. You can switch between businesses at any time."
                    : "Custom signatures are for one-time use only and do not update your business profile."}
                </p>
              </div>
            </div>
          </div>

          {/* Mobile sticky actions */}
          <div className="sm:hidden sticky bottom-4 z-30 mt-4 mb-6">
            <div className="rounded-2xl border border-gray-200 bg-white/95 backdrop-blur shadow-[0_18px_40px_rgba(10,22,40,0.12)] px-4 pt-4 pb-5 flex gap-3">
              <button
                onClick={copyHtmlToClipboard}
                className="flex-1 flex items-center justify-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-[#0a1628] font-bold px-4 py-2.5 rounded-xl transition-all text-sm"
              >
                <Copy className="w-4 h-4" />
                {copied ? "Copied" : "Copy HTML"}
              </button>

              {mode === "business" ? (
                <button
                  onClick={saveBusinessSignatureSettings}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 bg-white text-[#0a1628] border border-gray-200 hover:border-[#0a1628] font-bold px-4 py-2.5 rounded-xl transition-all text-sm disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Saving..." : "Save"}
                </button>
              ) : null}
            </div>
          </div>

          {/* Layout */}
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left Editor */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                {/* Business / Sender */}
                <SignatureAccordionSection
                  title="Business / Sender"
                  subtitle="Business selection, sender identity, and basic setup"
                  summary={getBusinessSummary()}
                  icon={Building}
                  isOpen={openSections.includes("business")}
                  onToggle={() => toggleSection("business")}
                >
                  {mode === "business" ? (
                    <div className="mb-4">
                      <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-2">
                        Select Business
                      </label>
                      <select
                        value={selectedBusinessId}
                        onChange={(e) => handleBusinessChange(e.target.value)}
                        className={inputCls}
                      >
                        <option value="">Choose a business...</option>
                        {businesses.map((business) => (
                          <option key={business.id} value={business.id}>
                            {business.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : null}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">
                        Full Name
                      </label>
                      <input
                        value={signature.full_name}
                        onChange={(e) => setField("full_name", e.target.value)}
                        className={inputCls}
                        placeholder="Jane Doe"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">
                        Job Title
                      </label>
                      <input
                        value={signature.job_title}
                        onChange={(e) => setField("job_title", e.target.value)}
                        className={inputCls}
                        placeholder="Founder"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">
                        Department / Team
                      </label>
                      <input
                        value={signature.department}
                        onChange={(e) => setField("department", e.target.value)}
                        className={inputCls}
                        placeholder="Partnerships"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">
                        Pronouns
                      </label>
                      <input
                        value={signature.pronouns}
                        onChange={(e) => setField("pronouns", e.target.value)}
                        className={inputCls}
                        placeholder="she/her"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="flex items-center gap-3 mt-2">
                        <input
                          type="checkbox"
                          checked={signature.include_pronouns}
                          onChange={(e) => setField("include_pronouns", e.target.checked)}
                          className={checkboxCls}
                        />
                        <span className="text-sm text-gray-700">
                          Show pronouns in signature
                        </span>
                      </label>
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">
                        Business Name
                      </label>
                      <input
                        value={signature.business_name}
                        onChange={(e) => setField("business_name", e.target.value)}
                        className={inputCls}
                        placeholder="Pacific Market"
                      />
                    </div>
                  </div>
                </SignatureAccordionSection>

                {/* Contact & Links */}
                <SignatureAccordionSection
                  title="Contact & Links"
                  subtitle="Business email, phone, website, socials, and address"
                  summary={getContactSummary()}
                  icon={Mail}
                  isOpen={openSections.includes("contact")}
                  onToggle={() => toggleSection("contact")}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">
                        Email
                      </label>
                      <input
                        value={signature.email}
                        onChange={(e) => setField("email", e.target.value)}
                        className={inputCls}
                        placeholder="hello@business.com"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">
                        Phone
                      </label>
                      <input
                        value={signature.phone}
                        onChange={(e) => setField("phone", e.target.value)}
                        className={inputCls}
                        placeholder="+64 21 123 456"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">
                        Website
                      </label>
                      <input
                        value={signature.website}
                        onChange={(e) => setField("website", e.target.value)}
                        className={inputCls}
                        placeholder="https://business.com"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">
                        Address
                      </label>
                      <input
                        value={signature.address}
                        onChange={(e) => setField("address", e.target.value)}
                        className={inputCls}
                        placeholder="Auckland, New Zealand"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">
                        LinkedIn
                      </label>
                      <input
                        value={signature.linkedin}
                        onChange={(e) => setField("linkedin", e.target.value)}
                        className={inputCls}
                        placeholder="linkedin.com/in/..."
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">
                        Facebook
                      </label>
                      <input
                        value={signature.facebook}
                        onChange={(e) => setField("facebook", e.target.value)}
                        className={inputCls}
                        placeholder="facebook.com/..."
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">
                        Instagram
                      </label>
                      <input
                        value={signature.instagram}
                        onChange={(e) => setField("instagram", e.target.value)}
                        className={inputCls}
                        placeholder="instagram.com/..."
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">
                        TikTok
                      </label>
                      <input
                        value={signature.tiktok}
                        onChange={(e) => setField("tiktok", e.target.value)}
                        className={inputCls}
                        placeholder="tiktok.com/@..."
                      />
                    </div>
                  </div>

                  <div className="space-y-3 mt-4">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={signature.include_socials}
                        onChange={(e) => setField("include_socials", e.target.checked)}
                        className={checkboxCls}
                      />
                      <span className="text-sm text-gray-700">Show social links</span>
                    </label>

                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={signature.include_address}
                        onChange={(e) => setField("include_address", e.target.checked)}
                        className={checkboxCls}
                      />
                      <span className="text-sm text-gray-700">Show address</span>
                    </label>
                  </div>
                </SignatureAccordionSection>

                {/* Brand & Display */}
                <SignatureAccordionSection
                  title="Brand & Display"
                  subtitle="Logo, colours, verification badge, and disclaimer"
                  summary={getBrandSummary()}
                  icon={Palette}
                  isOpen={openSections.includes("brand")}
                  onToggle={() => toggleSection("brand")}
                >
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">
                        Logo
                      </label>

                      <div className="space-y-3">
                        {signature.logo_url ? (
                          <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                            <img
                              src={signature.logo_url}
                              alt="Logo"
                              className="w-12 h-12 object-contain rounded border border-gray-200 bg-white"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-700">
                                Logo uploaded
                              </p>
                              <p className="text-xs text-gray-500">
                                Replace it or remove it below
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => setField("logo_url", "")}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                              title="Remove logo"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ) : null}

                        <label className="flex-1 cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                          />
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#0d4f4f] hover:bg-[#0d4f4f]/5 transition-colors">
                            <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm font-medium text-gray-700">
                              {signature.logo_url ? "Replace logo" : "Upload logo"}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              PNG, JPG, WEBP, GIF up to 5MB
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">
                          Primary
                        </label>
                        <input
                          type="color"
                          value={signature.brand_primary}
                          onChange={(e) => setField("brand_primary", e.target.value)}
                          className="w-full h-10 rounded-lg border border-gray-200 cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">
                          Secondary
                        </label>
                        <input
                          type="color"
                          value={signature.brand_secondary}
                          onChange={(e) => setField("brand_secondary", e.target.value)}
                          className="w-full h-10 rounded-lg border border-gray-200 cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">
                          Accent
                        </label>
                        <input
                          type="color"
                          value={signature.brand_accent}
                          onChange={(e) => setField("brand_accent", e.target.value)}
                          className="w-full h-10 rounded-lg border border-gray-200 cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">
                          Text
                        </label>
                        <input
                          type="color"
                          value={signature.text_color}
                          onChange={(e) => setField("text_color", e.target.value)}
                          className="w-full h-10 rounded-lg border border-gray-200 cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={signature.include_logo}
                          onChange={(e) => setField("include_logo", e.target.checked)}
                          className={checkboxCls}
                        />
                        <span className="text-sm text-gray-700">Show logo</span>
                      </label>

                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={signature.include_badge}
                          onChange={(e) => setField("include_badge", e.target.checked)}
                          className={checkboxCls}
                        />
                        <span className="text-sm text-gray-700">
                          Show Pacific Market badge
                        </span>
                      </label>
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">
                        Disclaimer
                      </label>
                      <textarea
                        value={signature.disclaimer}
                        onChange={(e) => setField("disclaimer", e.target.value)}
                        rows={3}
                        className={`${inputCls} resize-none`}
                        placeholder="Optional legal or confidentiality message..."
                      />
                    </div>
                  </div>
                </SignatureAccordionSection>

              </div>
            </div>

            {/* Right Preview */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-8">
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Live Preview
                  </h3>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="bg-[#0a1628] text-white p-4 sm:p-5 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                        <Mail className="w-5 h-5 text-[#00c4cc]" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">Email Signature Preview</div>
                        <div className="text-xs text-gray-300">
                          Preview updates as you type
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 bg-[#f8fafc]">
                    <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 overflow-x-auto">
                      <div
                        dangerouslySetInnerHTML={{ __html: previewHtml }}
                      />
                    </div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={copyHtmlToClipboard}
                        className="flex items-center justify-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-[#0a1628] font-semibold px-4 py-3 rounded-xl transition-all text-sm"
                      >
                        <Copy className="w-4 h-4" />
                        {copied ? "Copied" : "Copy HTML"}
                      </button>

                      <button
                        type="button"
                        onClick={downloadHtml}
                        className="flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-[#0a1628] font-semibold px-4 py-3 rounded-xl transition-all text-sm"
                      >
                        <Download className="w-4 h-4" />
                        Download HTML
                      </button>

                      <button
                        type="button"
                        onClick={downloadText}
                        className="flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-[#0a1628] font-semibold px-4 py-3 rounded-xl transition-all text-sm sm:col-span-2"
                      >
                        <FileText className="w-4 h-4" />
                        Download Text Version
                      </button>

                      {mode === "business" ? (
                        <button
                          type="button"
                          onClick={saveBusinessSignatureSettings}
                          disabled={saving}
                          className="flex items-center justify-center gap-2 bg-[#0a1628] hover:bg-[#13233a] text-white font-semibold px-4 py-3 rounded-xl transition-all text-sm sm:col-span-2 disabled:opacity-50"
                        >
                          <Save className="w-4 h-4" />
                          {saving ? "Saving..." : "Save Business Signature Settings"}
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="mt-4 bg-white border border-gray-200 rounded-2xl p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Best Use
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Use <span className="font-semibold text-[#0a1628]">Business Signature</span> for your saved business identity, and <span className="font-semibold text-[#0a1628]">Custom Signature</span> for staff, contractors, or temporary campaign-specific signatures.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}