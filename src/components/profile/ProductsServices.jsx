import { MessageCircle, ShoppingBag } from "lucide-react";

export default function ProductsServices({ products, onContact }) {
  if (!products || products.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#E1062D]/10">
          <ShoppingBag className="w-4 h-4 text-[#E1062D]" />
        </div>
        <h3 className="font-semibold text-[#0a1628] text-sm">Products & Services</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {products.map((p, i) => (
          <div
            key={p.id || i}
            className="overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all hover:border-gray-200 hover:shadow-sm"
          >
            {p.image_url && (
              <div className="h-40 sm:h-36 overflow-hidden bg-slate-50">
                <img
                  src={p.image_url}
                  alt={p.name || ""}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="font-semibold text-[#0a1628] text-sm leading-5 break-words">
                  {p.name}
                </h4>

                {p.price_display && (
                  <span className="inline-flex flex-shrink-0 items-center rounded-full bg-[#0d4f4f]/10 px-2.5 py-1 text-xs font-bold text-[#0d4f4f] whitespace-nowrap">
                    {p.price_display}
                  </span>
                )}
              </div>

              {p.description && (
                <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-3">
                  {p.description}
                </p>
              )}

              <button
                onClick={onContact}
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-[#0d4f4f] px-4 py-2.5 text-sm font-semibold text-[#0d4f4f] transition-all hover:bg-[#0d4f4f] hover:text-white"
              >
                <MessageCircle className="w-4 h-4" />
                Contact us for more info
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}