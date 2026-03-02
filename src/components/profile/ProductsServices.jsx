import { MessageCircle, ShoppingBag } from "lucide-react";

export default function ProductsServices({ products, onContact }) {
  if (!products || products.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingBag className="w-4 h-4 text-[#E1062D]" />
        <h3 className="font-semibold text-[#0a1628] text-sm">Products & Services</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {products.map((p, i) => (
          <div key={p.id || i} className="border border-gray-100 rounded-xl overflow-hidden hover:border-gray-200 transition-colors">
            {p.image_url && (
              <div className="h-36 overflow-hidden">
                <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h4 className="font-semibold text-[#0a1628] text-sm">{p.name}</h4>
                {p.price_display && (
                  <span className="text-xs font-bold text-[#0d4f4f] bg-[#0d4f4f]/10 px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
                    {p.price_display}
                  </span>
                )}
              </div>
              {p.description && (
                <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-3">{p.description}</p>
              )}
              <button
                onClick={onContact}
                className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-[#0d4f4f] border border-[#0d4f4f] hover:bg-[#0d4f4f] hover:text-white py-2 rounded-lg transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Contact us for more info
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}