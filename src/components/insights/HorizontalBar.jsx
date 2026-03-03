export default function HorizontalBar({ title, data, color = "#0d4f4f", limit = null, maxHeight = "320px" }) {
  if (!data || data.length === 0) return null;
  const items = typeof limit === "number" ? data.slice(0, limit) : data;
  const max = Math.max(...items.map(d => d.value));

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md h-full">
      <h3 className="text-sm font-bold text-[#0a1628] uppercase tracking-wider mb-5">{title}</h3>
      <div className="space-y-3 overflow-y-auto pr-2" style={{ maxHeight }}>
        {items.map(({ label, value }) => (
          <div key={label} className="flex items-center gap-3">
            <span className="text-xs text-gray-600 w-40 flex-shrink-0 truncate">{label}</span>
            <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-2.5 rounded-full transition-all duration-700"
                style={{ width: `${Math.max((value / max) * 100, 4)}%`, backgroundColor: color }}
              />
            </div>
            <span className="text-xs font-bold text-[#0a1628] w-8 text-right">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}