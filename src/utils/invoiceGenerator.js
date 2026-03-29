// Invoice rendering utilities extracted from InvoiceGenerator
// Used by both the generator and Tools landing page

export function calculateInvoiceTotals(invoice) {
  const subtotal = invoice.items.reduce((sum, item) => 
    sum + (item.quantity || 0) * (parseFloat(item.unit_price) || 0), 0
  );
  
  // Calculate adjustments before tax
  const beforeTaxAdjustments = invoice.adjustments
    .filter(adj => adj.apply_stage === 'before_tax')
    .reduce((sum, adj) => {
      const adjustmentValue = adj.value_type === "percent"
        ? subtotal * (parseFloat(adj.value) || 0) / 100
        : parseFloat(adj.value) || 0;
      return sum + (adj.kind === "fee" ? adjustmentValue : -adjustmentValue);
    }, 0);
    
  const taxableAmount = subtotal + beforeTaxAdjustments;
  const tax = taxableAmount * ((parseFloat(invoice.tax_rate) || 0) / 100);
  const grossTotal = taxableAmount + tax;
  
  // Calculate adjustments after tax
  const afterTaxAdjustments = invoice.adjustments
    .filter(adj => adj.apply_stage === 'after_tax')
    .reduce((sum, adj) => {
      const adjustmentValue = adj.value_type === "percent"
        ? grossTotal * (parseFloat(adj.value) || 0) / 100
        : parseFloat(adj.value) || 0;
      return sum + (adj.kind === "fee" ? adjustmentValue : -adjustmentValue);
    }, 0);
    
  const withholdingTax = grossTotal * ((parseFloat(invoice.withholding_tax_rate) || 0) / 100);
  const totalPayable = grossTotal + afterTaxAdjustments - withholdingTax;
  
  return {
    subtotal,
    beforeTaxAdjustments,
    tax,
    grossTotal,
    afterTaxAdjustments,
    withholdingTax,
    totalPayable
  };
}

export function InvoicePreview({ invoice, calculations }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden invoice-preview">
      {/* Header */}
      <div className="bg-[#0a1628] text-white p-4 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
          <div className="flex gap-4">
            {/* Logo */}
            {invoice.sender_logo_url ? (
              <img
                src={invoice.sender_logo_url}
                alt="Business Logo"
                className="w-16 h-16 rounded-lg object-cover border-2 border-white/20"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-[#0d4f4f] flex items-center justify-center border-2 border-white/20">
                <svg className="w-8 h-8 text-[#00c4cc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            )}

            {/* Business Info */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-sm">{invoice.sender_name || "Your Business"}</span>
              </div>
              <p className="text-gray-400 text-xs">{invoice.sender_email}</p>
              {invoice.sender_phone && <p className="text-gray-400 text-xs">{invoice.sender_phone}</p>}
              {invoice.sender_address && <p className="text-gray-400 text-xs whitespace-pre-line">{invoice.sender_address}</p>}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-[#c9a84c] mb-1">INVOICE</div>
            <div className="text-gray-300 text-sm">{invoice.invoice_number}</div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mb-6 sm:mb-8">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Bill To</p>
            <p className="font-semibold text-[#0a1628]">{invoice.client_name || "Client Name"}</p>
            <p className="text-gray-500 text-sm">{invoice.client_email}</p>
            {invoice.client_phone && <p className="text-gray-500 text-sm">{invoice.client_phone}</p>}
            {invoice.client_address && <p className="text-gray-500 text-sm whitespace-pre-line">{invoice.client_address}</p>}
          </div>
          <div className="text-right">
            <div className="mb-2">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Date</p>
              <p className="font-semibold text-[#0a1628] text-sm">{invoice.date}</p>
            </div>
            {invoice.due_date && (
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Due Date</p>
                <p className="font-semibold text-[#0a1628] text-sm">{invoice.due_date}</p>
              </div>
            )}
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full mb-6 text-sm">
          <thead>
            <tr className="border-b-2 border-gray-100">
              <th className="text-left py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Description</th>
              <th className="text-center py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider w-16">Qty</th>
              <th className="text-right py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider w-24">Price</th>
              <th className="text-right py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider w-24">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, i) => (
              <tr key={i} className="border-b border-gray-50">
                <td className="py-3 text-sm text-gray-700">{item.description || "Item description"}</td>
                <td className="py-3 text-center text-sm text-gray-700">{item.quantity}</td>
                <td className="py-3 text-right text-sm text-gray-700">${item.unit_price || "0.00"}</td>
                <td className="py-3 text-right font-semibold text-[#0a1628]">${((item.quantity || 0) * (parseFloat(item.unit_price) || 0)).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Adjustments Section */}
        {invoice.adjustments.length > 0 && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Adjustments</h4>
            <div className="space-y-1">
              {invoice.adjustments.map((adj, i) => {
                const adjustmentInputValue = parseFloat(adj.value) || 0;
                const adjustmentValue = adj.value_type === "percent"
                  ? (adj.apply_stage === "before_tax" ? calculations.subtotal : calculations.grossTotal) * (adjustmentInputValue / 100)
                  : adjustmentInputValue;
                const displayValue = adj.kind === "fee" ? adjustmentValue : -adjustmentValue;

                return (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {adj.label} ({adj.value_type === "percent" ? `${adj.value || ""}%` : `$${adj.value || ""}`})
                    </span>
                    <span className={`font-medium ${adj.kind === "fee" ? "text-red-600" : "text-green-600"}`}>
                      {adj.kind === "fee" ? "+" : "-"}${Math.abs(displayValue).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Enhanced Totals Panel */}
        <div className="border-t border-gray-200 pt-4 w-full sm:ml-auto sm:max-w-xs space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-semibold">${calculations.subtotal.toFixed(2)}</span>
          </div>

          {calculations.beforeTaxAdjustments !== 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Adjustments (before tax)</span>
              <span className="font-semibold text-red-600">${calculations.beforeTaxAdjustments.toFixed(2)}</span>
            </div>
          )}

          {invoice.tax_rate > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tax ({invoice.tax_rate}%)</span>
              <span className="font-semibold">${calculations.tax.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span className="text-gray-700 font-medium">Gross Total</span>
            <span className="font-semibold">${calculations.grossTotal.toFixed(2)}</span>
          </div>

          {calculations.afterTaxAdjustments !== 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Adjustments (after tax)</span>
              <span className="font-semibold text-red-600">${calculations.afterTaxAdjustments.toFixed(2)}</span>
            </div>
          )}

          {invoice.withholding_tax_rate > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Withholding Tax ({invoice.withholding_tax_rate}%)</span>
              <span className="font-semibold text-green-600">-${calculations.withholdingTax.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between text-lg font-bold text-[#0a1628] pt-3 border-t-2 border-gray-200">
            <span>Total Payable</span>
            <span className="text-[#c9a84c]">${calculations.totalPayable.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Details Card */}
        {(invoice.payment_account_name || invoice.payment_account_number) && (
          <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Payment Details</h4>
            <div className="space-y-2 text-sm">
              {invoice.payment_account_name && (
                <div>
                  <span className="text-gray-500">Account Name: </span>
                  <span className="font-medium">{invoice.payment_account_name}</span>
                </div>
              )}
              {invoice.payment_account_number && (
                <div>
                  <span className="text-gray-500">Account Number: </span>
                  <span className="font-medium">{invoice.payment_account_number}</span>
                </div>
              )}
              {invoice.payment_reference_label && (
                <div>
                  <span className="text-gray-500">Payment Reference: </span>
                  <span className="font-medium">{invoice.payment_reference_label}</span>
                </div>
              )}
              {invoice.payment_terms && (
                <div>
                  <span className="text-gray-500">Payment Terms: </span>
                  <span className="font-medium">{invoice.payment_terms}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {invoice.notes && (
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Notes</p>
            <p className="text-gray-500 text-sm whitespace-pre-line">{invoice.notes}</p>
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-gray-50 text-center">
          <p className="text-xs text-gray-300">Thank You For Your Business</p>
        </div>
      </div>
    </div>
  );
}
