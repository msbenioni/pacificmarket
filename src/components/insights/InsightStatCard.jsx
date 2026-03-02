export default function InsightStatCard({ label, value, sub, icon: Icon, color = "#0d4f4f" }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</span>
        {Icon && (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: color + "18" }}>
            <Icon className="w-4 h-4" style={{ color }} />
          </div>
        )}
      </div>
      <span className="text-4xl font-bold text-[#0a1628]">{value}</span>
      {sub && <span className="text-xs text-gray-400">{sub}</span>}
    </div>
  );
}