import { useState, useEffect, useRef } from "react";
import { pacificMarket } from "@/lib/pacificMarketClient";
import { Plus, Trash2, Download, ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";
import { createPageUrl } from "@/utils";

export default function InvoiceGenerator() {
  const [user, setUser] = useState(null);
  const [business, setBusiness] = useState(null);
  const printRef = useRef(null);

  const [invoice, setInvoice] = useState({
    invoice_number: `INV-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().split("T")[0],
    due_date: "",
    client_name: "",
    client_email: "",
    client_address: "",
    notes: "",
    tax_rate: 10,
    items: [{ description: "", quantity: 1, unit_price: 0 }],
  });

  useEffect(() => {
    pacificMarket.auth.me().then(u => {
      setUser(u);
      return pacificMarket.entities.Business.filter({ owner_user_id: u.id, tier: "featured_plus" });
    }).then(b => { if (b.length > 0) setBusiness(b[0]); }).catch(() => {});
  }, []);

  const setField = (key, val) => setInvoice(i => ({ ...i, [key]: val }));
  const setItem = (idx, key, val) => setInvoice(i => ({ ...i, items: i.items.map((item, j) => j === idx ? { ...item, [key]: val } : item) }));
  const addItem = () => setInvoice(i => ({ ...i, items: [...i.items, { description: "", quantity: 1, unit_price: 0 }] }));
  const removeItem = (idx) => setInvoice(i => ({ ...i, items: i.items.filter((_, j) => j !== idx) }));

  const subtotal = invoice.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  const tax = subtotal * (invoice.tax_rate / 100);
  const total = subtotal + tax;

  const handlePrint = () => window.print();

  const inputCls = "w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#0d4f4f] bg-white";

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      <div className="bg-[#0a1628] text-white py-8 px-4 sm:px-6 lg:px-8 no-print">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <Link href={createPageUrl("BusinessPortal")} className="flex items-center gap-1 text-gray-400 hover:text-white text-sm mb-2 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Portal
            </Link>
            <h1 className="text-2xl font-bold">Invoice Generator</h1>
          </div>
          <button onClick={handlePrint}
            className="flex items-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-[#0a1628] font-bold px-5 py-2.5 rounded-xl transition-all text-sm">
            <Download className="w-4 h-4" /> Download / Print
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-5 no-print">
            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <h3 className="font-bold text-[#0a1628] text-sm mb-4">Invoice Details</h3>
              <div className="space-y-3">
                <div><label className="text-xs text-gray-400 font-semibold uppercase tracking-wider block mb-1">Invoice #</label><input value={invoice.invoice_number} onChange={e => setField("invoice_number", e.target.value)} className={inputCls} /></div>
                <div><label className="text-xs text-gray-400 font-semibold uppercase tracking-wider block mb-1">Date</label><input type="date" value={invoice.date} onChange={e => setField("date", e.target.value)} className={inputCls} /></div>
                <div><label className="text-xs text-gray-400 font-semibold uppercase tracking-wider block mb-1">Due Date</label><input type="date" value={invoice.due_date} onChange={e => setField("due_date", e.target.value)} className={inputCls} /></div>
                <div><label className="text-xs text-gray-400 font-semibold uppercase tracking-wider block mb-1">Tax Rate (%)</label><input type="number" value={invoice.tax_rate} onChange={e => setField("tax_rate", parseFloat(e.target.value) || 0)} className={inputCls} /></div>
              </div>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <h3 className="font-bold text-[#0a1628] text-sm mb-4">Client Information</h3>
              <div className="space-y-3">
                <div><label className="text-xs text-gray-400 font-semibold uppercase tracking-wider block mb-1">Client Name</label><input value={invoice.client_name} onChange={e => setField("client_name", e.target.value)} className={inputCls} /></div>
                <div><label className="text-xs text-gray-400 font-semibold uppercase tracking-wider block mb-1">Email</label><input value={invoice.client_email} onChange={e => setField("client_email", e.target.value)} className={inputCls} /></div>
                <div><label className="text-xs text-gray-400 font-semibold uppercase tracking-wider block mb-1">Address</label><textarea value={invoice.client_address} onChange={e => setField("client_address", e.target.value)} rows={2} className={`${inputCls} resize-none`} /></div>
              </div>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <h3 className="font-bold text-[#0a1628] text-sm mb-3">Notes</h3>
              <textarea value={invoice.notes} onChange={e => setField("notes", e.target.value)} rows={3} placeholder="Payment terms, bank details, etc." className={`${inputCls} resize-none`} />
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-3" ref={printRef}>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden invoice-preview">
              {/* Header */}
              <div className="bg-[#0a1628] text-white p-8">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-7 h-7 rounded-lg bg-[#0d4f4f] flex items-center justify-center">
                        <FileText className="w-4 h-4 text-[#00c4cc]" />
                      </div>
                      <span className="font-bold text-sm">{business?.name || user?.full_name || "Your Business"}</span>
                    </div>
                    <p className="text-gray-400 text-xs">{business?.email || user?.email}</p>
                    {business?.website && <p className="text-gray-400 text-xs">{business.website}</p>}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-[#c9a84c] mb-1">INVOICE</div>
                    <div className="text-gray-300 text-sm">{invoice.invoice_number}</div>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Bill To</p>
                    <p className="font-semibold text-[#0a1628]">{invoice.client_name || "Client Name"}</p>
                    <p className="text-gray-500 text-sm">{invoice.client_email}</p>
                    <p className="text-gray-500 text-sm whitespace-pre-line">{invoice.client_address}</p>
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
                      <tr key={i} className="border-b border-gray-50 group">
                        <td className="py-3">
                          <input value={item.description} onChange={e => setItem(i, "description", e.target.value)}
                            placeholder="Item description" className="w-full text-sm focus:outline-none text-gray-700 bg-transparent no-print-border" />
                        </td>
                        <td className="py-3 text-center">
                          <input type="number" value={item.quantity} onChange={e => setItem(i, "quantity", parseFloat(e.target.value)||0)}
                            className="w-16 text-center text-sm focus:outline-none bg-transparent no-print-border" />
                        </td>
                        <td className="py-3 text-right">
                          <input type="number" value={item.unit_price} onChange={e => setItem(i, "unit_price", parseFloat(e.target.value)||0)}
                            className="w-24 text-right text-sm focus:outline-none bg-transparent no-print-border" />
                        </td>
                        <td className="py-3 text-right font-semibold text-[#0a1628]">
                          ${(item.quantity * item.unit_price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <button onClick={addItem} className="flex items-center gap-1 text-xs text-[#0d4f4f] hover:text-[#1a6b6b] mb-6 no-print">
                  <Plus className="w-3.5 h-3.5" /> Add line item
                </button>

                {/* Totals */}
                <div className="border-t border-gray-100 pt-4 ml-auto max-w-xs space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tax ({invoice.tax_rate}%)</span>
                    <span className="font-semibold">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-[#0a1628] pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span className="text-[#0d4f4f]">${total.toFixed(2)}</span>
                  </div>
                </div>

                {invoice.notes && (
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Notes</p>
                    <p className="text-gray-500 text-sm whitespace-pre-line">{invoice.notes}</p>
                  </div>
                )}

                <div className="mt-8 pt-4 border-t border-gray-50 text-center">
                  <p className="text-xs text-gray-300">Pacific Market · pacific-market.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@media print { .no-print { display: none !important; } body { background: white; } .invoice-preview { box-shadow: none; border: none; } }`}</style>
    </div>
  );
}