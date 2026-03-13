import {
  Building2,
  Users,
  FileText,
  CheckCircle,
  TrendingUp,
} from "lucide-react";

export const PORTAL_TABS = [
  {
    id: "my-businesses",
    label: "My Businesses",
    mobileLabel: "Businesses",
    icon: Building2,
  },
  {
    id: "claims",
    label: "Claim Requests",
    mobileLabel: "Claims",
    icon: CheckCircle,
  },
  {
    id: "insights",
    label: "Profile & Insights",
    mobileLabel: "Profile",
    icon: Users,
  },
  {
    id: "tools",
    label: "Business Tools",
    mobileLabel: "Tools",
    icon: FileText,
  },
];

export const getTabStatus = (tabId, insightSnapshots, insightsStarted) => {
  if (tabId === "insights") {
    return insightSnapshots.length > 0
      ? "completed"
      : insightsStarted
      ? "started"
      : "not-started";
  }
  return undefined;
};
