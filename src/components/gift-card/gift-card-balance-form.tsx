"use client";

import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

// Check a gift card's balance (spec section 16).
export function GiftCardBalanceForm() {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ balance?: string; error?: string } | null>(null);

  async function check(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setResult(null);
    try {
      const res = await fetch("/api/gift-cards/balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      setResult(res.ok ? { balance: data.balance } : { error: data.error ?? "Could not check balance" });
    } catch {
      setResult({ error: "Network error" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={check} className="flex glass rounded-lg overflow-hidden">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="OMNI-XXXX-XXXX-XXXX"
          aria-label="Gift card code"
          className="flex-1 bg-transparent px-3 py-2 text-sm font-mono uppercase outline-none"
        />
        <button type="submit" disabled={busy || code.length < 8} className="bg-brand-600 px-4 text-sm font-medium disabled:opacity-50">
          {busy ? <Spinner size={14} /> : "Check balance"}
        </button>
      </form>
      {result?.balance && <p className="text-sm text-emerald-300 mt-2">Remaining balance: {result.balance}</p>}
      {result?.error && <p className="text-sm text-red-400 mt-2">{result.error}</p>}
    </div>
  );
}
