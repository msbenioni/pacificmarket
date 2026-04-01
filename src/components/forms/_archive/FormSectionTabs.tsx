"use client";

import { Building2, MapPin, FileText, Phone, Share2, HeartHandshake, ImageIcon, Shield } from "lucide-react";

const sections = [
  { id: "core", label: "Core Info", icon: Building2 },
  { id: "location", label: "Location", icon: MapPin },
  { id: "overview", label: "Overview", icon: FileText },
  { id: "contact", label: "Contact", icon: Phone },
  { id: "social", label: "Social", icon: Share2 },
  { id: "impact", label: "Impact", icon: HeartHandshake },
  { id: "media", label: "Brand & Media", icon: ImageIcon },
  { id: "admin", label: "Admin", icon: Shield },
];

export function FormSectionTabs({
  activeSection,
  onChange,
}: {
  activeSection: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-max gap-2 pb-1">
        {sections.map((section) => {
          const Icon = section.icon;
          const active = activeSection === section.id;

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onChange(section.id)}
              className={[
                "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition",
                active
                  ? "border-teal-700 bg-teal-700 text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
              ].join(" ")}
            >
              <Icon size={16} />
              {section.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
