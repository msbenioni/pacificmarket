import {
  Building2,
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
    id: "tools",
    label: "Business Tools",
    mobileLabel: "Tools",
    icon: FileText,
  },
];

export const getTabStatus = (tabId, insightSnapshots, insightsStarted) => {
  // No insights tab status needed anymore
  return undefined;
};
