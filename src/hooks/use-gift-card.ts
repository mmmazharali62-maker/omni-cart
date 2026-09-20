"use client";

import { useState } from "react";
import { splitPayment } from "@/lib/money-split";

// Gift card application at checkout (spec section 16).
export function useGiftCard(totalCents: number) {
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<number | null>(null); // cents covered
  const [error, setError] = useState<string | null>(null);

  async function apply() {
    setError(null);
    try {
      const res = await fetch("/api/gift-cards/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "redeem", code, chargeCents: totalCents })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) setApplied(data.giftCardCents ?? 0);
      else setError(data.error ?? "Could not apply gift card");
    } catch {
      setError("Network error");
    }
  }

  const split = splitPayment({ totalCents, giftCardCents: applied ?? 0 });
  return { code, setCode, apply, applied, error, split };
}
