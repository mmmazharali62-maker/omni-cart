"use client";

import { useScrollPosition } from "@/hooks/use-scroll-position";

// Floating back-to-top button (spec section 2).
export function BackToTop() {
  const y = useScrollPosition();
  if (y < 600) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="fixed bottom-6 left-6 z-40 glass w-11 h-11 rounded-full grid place-items-center text-lg hover:bg-white/10"
    >
      ↑
    </button>
  );
}
