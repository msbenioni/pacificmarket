import { useState } from "react";
import { X, Images } from "lucide-react";

export default function BusinessGallery({ images }) {
  const [lightbox, setLightbox] = useState(null);

  if (!images || images.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0d4f4f]/10">
          <Images className="w-4 h-4 text-[#0d4f4f]" />
        </div>
        <h3 className="font-semibold text-[#0a1628] text-sm">Gallery</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
        {images.map((img, i) => (
          <button
            key={img.id || i}
            type="button"
            onClick={() => setLightbox(img)}
            className="group aspect-square overflow-hidden rounded-xl border border-gray-100 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#0d4f4f] focus:ring-offset-2"
          >
            <img
              src={img.url}
              alt={img.caption || ""}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </button>
        ))}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm px-4 py-6 sm:px-6 sm:py-8"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white/85 hover:bg-white/20 hover:text-white transition"
            aria-label="Close gallery image"
          >
            <X className="w-5 h-5" />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="mx-auto flex h-full max-w-4xl items-center justify-center"
          >
            <div className="w-full">
              <img
                src={lightbox.url}
                alt={lightbox.caption || ""}
                className="w-full max-h-[78vh] sm:max-h-[82vh] object-contain rounded-2xl"
              />

              {lightbox.caption && (
                <p className="mt-3 text-center text-sm text-white/75 px-2">
                  {lightbox.caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}