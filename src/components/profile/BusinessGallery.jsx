import { useState } from "react";
import { X, Images } from "lucide-react";

export default function BusinessGallery({ images }) {
  const [lightbox, setLightbox] = useState(null);

  if (!images || images.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Images className="w-4 h-4 text-[#0d4f4f]" />
        <h3 className="font-semibold text-[#0a1628] text-sm">Gallery</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {images.map((img, i) => (
          <button
            key={img.id || i}
            onClick={() => setLightbox(img)}
            className="aspect-square rounded-xl overflow-hidden hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#0d4f4f]"
          >
            <img src={img.url} alt={img.caption || ""} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
          onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
          <div onClick={e => e.stopPropagation()} className="max-w-3xl w-full">
            <img src={lightbox.url} alt={lightbox.caption || ""} className="w-full max-h-[80vh] object-contain rounded-2xl" />
            {lightbox.caption && (
              <p className="text-white/70 text-sm text-center mt-3">{lightbox.caption}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}