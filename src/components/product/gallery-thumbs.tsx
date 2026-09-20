"use client";

import { useState } from "react";

// Thumbnail strip + main image switcher for the product gallery.
export function GalleryThumbs({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  if (images.length === 0) {
    return <div className="glass aspect-square grid place-items-center text-white/40">No image</div>;
  }
  return (
    <div className="space-y-3">
      <div className="glass overflow-hidden rounded-2xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images[active]} alt={alt} className="w-full aspect-square object-cover" />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={src + i}
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === active}
              className={`shrink-0 rounded-lg overflow-hidden border ${i === active ? "border-brand-500" : "border-white/10"}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="w-16 h-16 object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
