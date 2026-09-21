"use client";

import { useState } from "react";
import { useBackInStock } from "@/hooks/use-back-in-stock";

// Out-of-stock variant: notify me (spec section 15).
export function BackInStockButton({ variantId }: { variantId: string }) {
  const [email, setEmail] = useState("");
  const { subscribe, busy, subscribed, error } = useBackInStock(variantId);

  if (subscribed) {
    return <p className="text-sm text-emerald-300">You're on the list - we'll email the moment it's back.</p>;
  }

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); subscribe(email); }}
      className="flex glass rounded-lg overflow-hidden"
    >
      <input
        type="email" required value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email me when back in stock"
        aria-label="Email for back-in-stock alert"
        className="flex-1 bg-transparent px-3 py-2 text-sm outline-none"
      />
      <button type="submit" disabled={busy || !email} className="bg-brand-600 px-4 text-sm font-medium disabled:opacity-50">
        Notify me
      </button>
      {error && <span className="sr-only">{error}</span>}
    </form>
  );
}
