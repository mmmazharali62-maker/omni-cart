"use client";

import { useState } from "react";

// Back-in-stock subscription state (spec section 15).
export function useBackInStock(variantId: string) {
  const [busy, setBusy] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function subscribe(email: string) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/back-in-stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId, email })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) setSubscribed(true);
      else setError(data.error ?? "Could not subscribe");
    } catch {
      setError("Network error");
    } finally {
      setBusy(false);
    }
  }

  return { subscribe, busy, subscribed, error };
}
