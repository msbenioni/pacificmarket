import {
  Edit,
  Trash2,
  Users,
  Upload,
  Search,
  Plus,
} from "lucide-react";

export const BUSINESS_CARD_ACTIONS = [
  {
    key: "edit",
    label: "Edit",
    icon: Edit,
    handler: "handleEditBusiness",
    style: "iconPrimary",
    condition: () => true, // Always available
  },
  {
    key: "delete",
    label: "Delete",
    icon: Trash2,
    handler: "handleDeleteBusiness",
    style: "danger",
    condition: () => true, // Always available
  },
  {
    key: "addOwner",
    label: "Add Owner",
    icon: Users,
    handler: "handleAddOwner",
    style: "iconSecondary",
    condition: () => true, // Always available
  },
  {
    key: "logo",
    label: "Logo",
    icon: Upload,
    handler: "handleLogoUpload",
    style: "iconSecondary",
    isLabel: true, // This is a label element, not button
  },
];

export const EMPTY_STATE_CONFIG = {
  noBusinesses: {
    icon: "Building2",
    title: "No businesses yet",
    description: "Claim an existing business or add your own listing to begin managing your presence in Pacific Discovery Network.",
    actions: [
      {
        key: "claim",
        label: "Claim Business",
        icon: Search,
        variant: "secondary",
      },
      {
        key: "add",
        label: "Add Business",
        icon: Plus,
        variant: "primary",
      },
    ],
  },
  needsProfile: {
    icon: "Building2",
    title: "Start with your profile",
    description: "Your profile helps confirm ownership details before you manage business listings.",
    actions: [
      {
        key: "completeProfile",
        label: "Complete Profile",
        icon: Users,
        variant: "primary",
      },
      {
        key: "claim",
        label: "Claim Business",
        icon: Search,
        variant: "disabled",
      },
      {
        key: "add",
        label: "Add Business",
        icon: Plus,
        variant: "disabled",
      },
    ],
  },
  noClaims: {
    icon: "CheckCircle",
    title: "No claim requests",
    description: "When you claim a business, it will appear here for tracking.",
    actions: [],
  },
  noInsights: {
    icon: "Users",
    title: "No businesses yet",
    description: "Add or claim a business first to complete business insights.",
    actions: [],
  },
};

export const UPGRADE_CARD_CONFIG = {
  title: "Unlock more with Mana or Moana",
  description: "Increase trust, showcase your visual identity, and unlock practical business tools designed to help Pacific businesses stand out.",
  tiers: [
    {
      name: "Mana",
      features: [
        "Verified badge",
        "Logo and banner support",
        "Stronger profile presentation",
      ],
    },
    {
      name: "Moana",
      features: [
        "Everything in Verified",
        "Featured placement in registry",
        "Invoice and QR tools",
      ],
    },
  ],
};

export const BUSINESS_TOOLS_CONFIG = [
  {
    id: "invoice-generator",
    title: "Invoice Generator",
    description: "Create professional invoices with your Pacific business branding.",
    icon: "FileText",
    href: "InvoiceGenerator",
  },
  {
    id: "qr-generator",
    title: "QR Code Generator",
    description: "Generate QR codes linking to your registry profile or custom URL.",
    icon: "QrCode",
    href: "QRCodeGenerator",
  },
  {
    id: "signature-generator",
    title: "Email Signature",
    description: "Create professional email signatures with your business branding.",
    icon: "Mail",
    href: "signature-generator",
  },
];

export const MODAL_CONFIG = {
  addOwner: {
    title: "Add Business Owner",
    description: "Add another person to manage this business. They'll receive an invite to claim access.",
    fields: [
      {
        name: "name",
        label: "Full Name",
        type: "text",
        placeholder: "e.g. John Smith",
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        placeholder: "john@example.com",
      },
    ],
  },
};
