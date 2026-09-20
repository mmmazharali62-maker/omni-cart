"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Add to Cart / Buy Now on the product page. Posts to /api/cart (guest cookie
// flow); Buy Now sends the user straight to checkout.
export function AddToCartButtons({
  variantId,
  disabled,
}: {
  variantId: string | null;
  disabled: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const router = useRouter();

  async function addToCart(goToCheckout = false) {
    if (!variantId) {
      setMsg("Select a variant first");
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId, quantity: 1 })
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.error ?? "Could not add to cart");
        return;
      }
      if (goToCheckout) router.push("/checkout");
      else {
        setMsg("Added to cart ✓");
        router.refresh();
        setTimeout(() => setMsg(null), 2000);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="flex gap-3">
        <button
          disabled={disabled || busy}
          onClick={() => addToCart(false)}
          className="px-5 py-2.5 rounded-lg bg-brand-600 text-white text-sm disabled:opacity-40 hover:bg-brand-500 transition-colors"
        >
          {busy ? "Adding..." : "Add to Cart"}
        </button>
        <button
          disabled={disabled || busy}
          onClick={() => addToCart(true)}
          className="glass px-5 py-2.5 rounded-lg text-sm disabled:opacity-40 hover:bg-white/10"
        >
          Buy Now
        </button>
      </div>
      {msg && <p className="text-xs text-white/60 mt-2">{msg}</p>}
    </div>
  );
}
