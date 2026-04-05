import { BUSINESS_STATUS } from "@/constants/unifiedConstants";
import { Building2, Mail, Presentation, Search, Shield } from "lucide-react";

export const TABS = [
  {
    id: "businesses",
    label: "Businesses",
    icon: Building2,
    color: "text-blue-600",
    filterType: "businesses",
  },
  {
    id: "claims",
    label: "Claims",
    icon: Shield,
    color: "text-blue-600",
    filterType: "claims",
  },
  {
    id: "client-discovery",
    label: "Client Discovery",
    icon: Search,
    color: "text-blue-600",
    filterType: "client-discovery",
  },
  {
    id: "presentations",
    label: "Presentations",
    icon: Presentation,
    color: "text-blue-600",
  },
  {
    id: "email",
    label: "Email Marketing",
    icon: Mail,
    color: "text-blue-600",
  },
];

export const buttonCls =
  "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all";
export const primaryButtonCls = `${buttonCls} bg-[#0a1628] text-white hover:bg-[#122040]`;
export const secondaryButtonCls = `${buttonCls} border border-gray-200 bg-white text-[#0a1628] hover:bg-gray-50`;
export const mobileButtonCls = `${buttonCls} border border-gray-200 bg-white text-[#0a1628] hover:bg-gray-50`;
export const filterButtonCls = `${buttonCls} border border-gray-200 bg-white text-[#0a1628] hover:bg-gray-50`;

/** @type {Record<string, any>} */
export const emptyBusinessForm = {
  business_name: "",
  business_handle: "",
  description: "",
  industry: "",
  tagline: "",
  role: "",
  business_contact_person: "",
  business_email: "",
  business_phone: "",
  business_website: "",
  business_hours: "",
  country: "",
  city: "",
  address: "",
  suburb: "",
  state_region: "",
  postal_code: "",
  year_started: null,
  business_stage: "",
  business_structure: "",
  is_business_registered: false,
  status: BUSINESS_STATUS.PENDING,
  team_size_band: "",
  founder_story: "",
  age_range: "",
  gender: "",
  collaboration_interest: false,
  mentorship_offering: false,
  open_to_future_contact: false,
  business_acquisition_interest: false,
  social_links: {
    facebook: "",
    instagram: "",
    twitter: "",
    linkedin: "",
    youtube: "",
    tiktok: "",
  },
  is_verified: false,
  is_claimed: false,
  subscription_tier: "vaka",
  visibility_tier: "none",
  visibility_mode: "auto",
  logo_url: "",
  banner_url: "",
  mobile_banner_url: "",
  logo_file: null,
  banner_file: null,
  mobile_banner_file: null,
  logo_remove: false,
  banner_remove: false,
  mobile_banner_remove: false,
};