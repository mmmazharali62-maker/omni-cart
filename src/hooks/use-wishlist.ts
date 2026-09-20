"use client";

import { useEffect, useState } from "react";

// Wishlist state + optimistic add/remove (spec section 6).
export function useWishlist() {
  const [ids, setIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    try {
      const res = await fetch("/api/wishlist");
      const data = await res.json().catch(() => ({}));
      setIds((data.items ?? []).map((i: { productId?: string; id?: string }) => i.productId ?? i.id));
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }

  useEffect(() => { refresh(); }, []);

  async function toggle(productId: string) {
    const has = ids.includes(productId);
    setIds((prev) => (has ? prev.filter((id) => id !== productId) : [...prev, productId])); // optimistic
    try {
      await fetch("/api/wishlist", {
        method: has ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId })
      });
    } catch {
      setIds((prev) => (has ? [...prev, productId] : prev.filter((id) => id !== productId))); // rollback
    }
  }

  return { ids, loading, has: (id: string) => ids.includes(id), toggle };
}
