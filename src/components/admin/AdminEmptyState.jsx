/**
 * Shared empty state component for admin dashboard
 * Used when there's no data to display
 */

export default function AdminEmptyState({ icon: IconComponent, message }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-12 text-center">
      <IconComponent className="mx-auto mb-3 h-10 w-10 text-gray-300" />
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}
