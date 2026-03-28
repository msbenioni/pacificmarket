/**
 * Shared filter bar component for admin dashboard tabs
 * Renders a dropdown filter with label and options
 */

export default function AdminTabFilterBar({ label, value, onChange, options }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">{label}:</label>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
