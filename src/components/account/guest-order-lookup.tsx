"use client";

import { useState } from "react";

export function GuestOrderLookup() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setResult(null);
    const res = await fetch("/api/orders/lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, email })
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) setResult(data.error ?? "Order not found");
    else setResult(`Order ${data.order.id.slice(0, 8)}: ${data.order.status.replace(/_/g, " ")} · placed ${new Date(data.order.createdAt).toDateString()}`);
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <input value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="Order ID" required className="glass bg-white/5 px-4 py-2.5 text-sm outline-none" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email used at checkout" required className="glass bg-white/5 px-4 py-2.5 text-sm outline-none" />
      </div>
      <button disabled={busy} className="glass px-4 py-2.5 rounded-lg text-sm hover:bg-white/10">
        {busy ? "Looking up..." : "Find Order"}
      </button>
      {result && <p className="text-xs text-white/70">{result}</p>}
    </form>
  );
}
