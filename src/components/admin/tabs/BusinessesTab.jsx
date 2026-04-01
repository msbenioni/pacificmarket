import { useMemo } from "react";
import { Building2 } from "lucide-react";
import AdminBusinessMobileCard from "@/components/admin/AdminBusinessMobileCard";
import AdminEmptyState from "../AdminEmptyState";
import AdminTabFilterBar from "../AdminTabFilterBar";
import BusinessTable from "../businesses/BusinessTable";
import {
  filterBusinesses,
  getBusinessesFilterOptions,
  getBusinessesEmptyMessage,
} from "@/utils/admin/adminFilters";

/**
 * Businesses tab component
 * Renders the businesses filter, empty state, mobile cards, and desktop table
 */

export default function BusinessesTab({
  businesses,
  searchQuery,
  filters,
  businessesFilter,
  setBusinessesFilter,
  editingBusinessId,
  draftBusiness,
  savingEdit,
  businessActions,
}) {
  // Memoize filtered businesses to avoid recalculating on every render
  const filteredBusinesses = useMemo(() => {
    return filterBusinesses(businesses, businessesFilter, searchQuery, filters);
  }, [businesses, businessesFilter, searchQuery, filters]);

  // Memoize filter options
  const filterOptions = useMemo(() => {
    return getBusinessesFilterOptions(businesses);
  }, [businesses]);

  // Create business by ID map for efficient lookups
  const businessById = useMemo(() => {
    return businesses.reduce((acc, business) => {
      acc[business.id] = business;
      return acc;
    }, {});
  }, [businesses]);

  
  return (
    <div className="space-y-4">
      <AdminTabFilterBar
        label="Filter"
        value={businessesFilter}
        onChange={setBusinessesFilter}
        options={filterOptions}
      />

      {filteredBusinesses.length === 0 ? (
        <AdminEmptyState
          icon={Building2}
          message={getBusinessesEmptyMessage(businessesFilter)}
        />
      ) : (
        <>
          {/* Mobile view */}
          <div className="space-y-3 lg:hidden">
            {filteredBusinesses.map((business) => (
              <AdminBusinessMobileCard
                key={business.id}
                business={business}
                isEditing={editingBusinessId === business.id}
                draftBusiness={
                  editingBusinessId === business.id ? draftBusiness : null
                }
                onApprove={() => businessActions.updateStatus(business, "active")}
                onReject={() => businessActions.updateStatus(business, "rejected")}
                onEdit={() => {
                  if (editingBusinessId === business.id) {
                    businessActions.cancelEditingBusiness();
                  } else {
                    businessActions.startEditingBusiness(business);
                  }
                }}
                onDelete={() => businessActions.deleteBusiness(business.id)}
                onSave={businessActions.saveBusiness}
                onCancel={businessActions.cancelEditingBusiness}
                savingEdit={savingEdit}
              />
            ))}
          </div>

          {/* Desktop view */}
          <BusinessTable
            businesses={filteredBusinesses}
            editingBusinessId={editingBusinessId}
            draftBusiness={draftBusiness}
            onEdit={(business) => {
              if (editingBusinessId === business.id) {
                businessActions.cancelEditingBusiness();
              } else {
                businessActions.startEditingBusiness(business);
              }
            }}
            onDelete={(businessId) => businessActions.deleteBusiness(businessId)}
            onSave={businessActions.saveBusiness}
            onCancel={businessActions.cancelEditingBusiness}
            savingEdit={savingEdit}
            onApprove={(business) => businessActions.updateStatus(business, "active")}
            onReject={(business) => businessActions.updateStatus(business, "rejected")}
          />
        </>
      )}
    </div>
  );
}
