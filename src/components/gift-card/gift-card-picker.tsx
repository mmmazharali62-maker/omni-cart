"use client";

import { useState } from "react";
import { formatMoney } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

// Gift card denominations + preview (spec section 15/16).
const DENOMINATIONS = [25, 50, 100, 250];

export function GiftCardPicker() {
  const [amount, setAmount] = useState(50);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [purchased, setPurchased] = useState<string | null>(null);

  async function buy() {
    setBusy(true);
    try {
      const res = await fetch("/api/gift-cards/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "purchase", amount, email })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) setPurchased(data.code ?? "purchased");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="glass p-6 max-w-md mx-auto">
      <div className="rounded-2xl p-6 bg-gradient-to-br from-brand-500 to-brand-700 text-white text-center">
        <p className="text-xs uppercase tracking-widest opacity-80">Omni Cart gift card</p>
        <p className="text-4xl font-semibold mt-2">{formatMoney(amount)}</p>
      </div>
      <div className="grid grid-cols-4 gap-2 mt-4">
        {DENOMINATIONS.map((d) => (
          <button
            key={d}
            onClick={() => setAmount(d)}
            aria-pressed={amount === d}
            className={`glass rounded-lg py-2 text-sm ${amount === d ? "bg-brand-600" : "hover:bg-white/10"}`}
          >
            {formatMoney(d)}
          </button>
        ))}
      </div>
      <label className="block mt-4">
        <span className="text-sm text-white/70">Recipient email</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="friend@email.com"
          className="mt-1 w-full glass bg-white/5 px-3 py-2 rounded-lg text-sm outline-none"
        />
      </label>
      <button
        onClick={buy}
        disabled={busy || !email}
        className="mt-4 w-full bg-brand-600 text-white py-2.5 rounded-lg text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {busy && <Spinner size={14} />} Purchase gift card
      </button>
      {purchased && (
        <p className="text-sm text-emerald-300 mt-3">
          Gift card purchased! Code: <code className="font-mono">{purchased}</code> - it's on its way to {email}.
        </p>
      )}
    </div>
  );
}
