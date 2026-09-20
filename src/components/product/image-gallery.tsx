"use client";

import { useState } from "react";

// Product image gallery (spec section 3): main image + thumbnails.
export function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const safe = images.filter(Boolean);

  if (safe.length === 0) {
    return <div className="aspect-square rounded-2xl bg-white/10 flex items-center justify-center text-white/30 text-sm">No image</div>;
  }

  return (
    <div>
      <div className="aspect-square rounded-2xl bg-white/10 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={safe[active]} alt={alt} className="w-full h-full object-cover" />
      </div>
      {safe.length > 1 && (
        <div className="flex gap-2 mt-3">
          {safe.slice(0, 5).map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${i === active ? "border-brand-400" : "border-transparent opacity-60 hover:opacity-100"}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`${alt} ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
