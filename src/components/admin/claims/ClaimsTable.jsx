import ClaimTableRow from "./ClaimTableRow";

/**
 * Desktop claims table component
 * Renders the table shell and delegates row rendering to child components
 */

export default function ClaimsTable({ claims, businesses, onApprove, onReject }) {
  return (
    <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white lg:block">
      <table className="w-full">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Business
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Contact
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Date
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {claims.map((claim) => (
            <ClaimTableRow
              key={claim.id}
              claim={claim}
              business={businesses.find((b) => b.id === claim.business_id)}
              onApprove={() => onApprove(claim)}
              onReject={() => onReject(claim)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
