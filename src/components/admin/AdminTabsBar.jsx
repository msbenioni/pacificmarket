import { Download } from "lucide-react";

export default function AdminTabsBar({
  tabs,
  activeTab,
  setActiveTab,
  pendingClaimsCount,
  onExport,
  onResetEditing,
  secondaryButtonCls,
}) {
  return (
    <div className="border-b border-gray-200 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="overflow-x-auto">
          <div className="flex min-w-max gap-1 rounded-xl bg-gray-50 p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (onResetEditing) onResetEditing();
                }}
                className={`inline-flex min-h-[44px] items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-white text-[#0a1628] shadow-sm"
                    : "text-gray-600 hover:text-[#0a1628]"
                }`}
              >
                <tab.icon
                  className={`h-4 w-4 ${
                    activeTab === tab.id ? "text-[#0d4f4f]" : ""
                  }`}
                />
                {tab.label}

                {tab.id === "claims" && pendingClaimsCount > 0 && (
                  <span className="rounded-full bg-blue-500 px-1.5 py-0.5 text-[11px] text-white">
                    {pendingClaimsCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <button onClick={onExport} className={secondaryButtonCls}>
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>
    </div>
  );
}