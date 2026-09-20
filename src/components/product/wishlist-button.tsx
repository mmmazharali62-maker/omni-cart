"use client";

import { useState } from "react";

// Wishlist toggle on the product page (spec section 3).
export function WishlistButton({ productId }: { productId: string }) {
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    if (saved) {
      await fetch("/api/wishlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId })
      });
      setSaved(false);
    } else {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId })
      });
      if (res.ok) setSaved(true);
    }
    setBusy(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className="glass px-4 py-2.5 rounded-lg text-sm hover:bg-white/10"
      aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
    >
      {saved ? "♥ Saved" : "♡ Wishlist"}
    </button>
  );
}
