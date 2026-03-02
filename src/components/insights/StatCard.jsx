export default function StatCard({ label, value, sub, color = "#0d4f4f" }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md flex flex-col gap-1">
      <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</span>
      <span className="text-3xl font-bold" style={{ color }}>{value}</span>
      {sub && <span className="text-xs text-gray-400">{sub}</span>}
    </div>
  );
}