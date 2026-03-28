import BusinessProfileForm from "@/components/forms/BusinessProfileForm";

/**
 * Business edit row component
 * Renders the edit form for a business in the table
 */

export default function BusinessEditRow({ businessId, draftBusiness, onSave, onCancel, saving }) {
  return (
    <tr>
      <td colSpan={5} className="bg-gray-50 px-4 py-4">
        <BusinessProfileForm
          title="Edit Business"
          businessId={businessId}
          initialData={draftBusiness}
          onSave={onSave}
          onCancel={onCancel}
          saving={saving}
          mode="edit"
          showAdminFields={true}
        />
      </td>
    </tr>
  );
}
