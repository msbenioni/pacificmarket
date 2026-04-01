import { Fragment } from "react";
import BusinessTableRow from "./BusinessTableRow";
import BusinessEditRow from "./BusinessEditRow";

/**
 * Desktop business table component
 * Renders the table shell and delegates row rendering to child components
 */

export default function BusinessTable({
  businesses,
  editingBusinessId,
  draftBusiness,
  onEdit,
  onDelete,
  onSave,
  onCancel,
  savingEdit,
  onApprove,
  onReject,
  onViewProfile,
}) {
  return (
    <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white lg:block">
      <table className="w-full">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Business
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Details
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Tier
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Status
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {businesses.map((business) => (
            <Fragment key={business.id}>
              <BusinessTableRow
                business={business}
                isEditing={editingBusinessId === business.id}
                onEdit={() => onEdit(business)}
                onDelete={() => onDelete(business.id)}
                onApprove={() => onApprove(business)}
                onReject={() => onReject(business)}
                onViewProfile={onViewProfile}
              />
              {editingBusinessId === business.id && (
                <BusinessEditRow
                  businessId={business.id}
                  draftBusiness={draftBusiness}
                  onSave={onSave}
                  onCancel={onCancel}
                  saving={savingEdit}
                />
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
