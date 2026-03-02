export default function BarChart({ title, data, color = "#0d4f4f" }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map(d => d.value));

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md">
      <h3 className="text-sm font-bold text-[#0a1628] uppercase tracking-wider mb-5">{title}</h3>
      <div className="space-y-3">
        {data.slice(0, 10).map(({ label, value }) => (
          <div key={label} className="flex items-center gap-3">
            <span className="text-xs text-gray-500 w-36 flex-shrink-0 truncate">{label}</span>
            <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{ width: `${(value / max) * 100}%`, backgroundColor: color }}
              />
            </div>
            <span className="text-xs font-semibold text-[#0a1628] w-8 text-right">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}