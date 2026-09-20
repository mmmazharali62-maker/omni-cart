"use client";

import { useState } from "react";

// Newsletter subscribe state (spec section 15).
export function useNewsletter() {
  const [busy, setBusy] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function subscribe(email: string) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      if (res.ok) { setSubscribed(true); return true; }
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not subscribe");
      return false;
    } catch {
      setError("Network error");
      return false;
    } finally {
      setBusy(false);
    }
  }

  return { busy, subscribed, error, subscribe };
}
