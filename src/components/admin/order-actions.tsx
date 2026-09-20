"use client";

import { useState } from "react";

// Inline retry/cancel/reflow controls for one admin order row.
export function AdminOrderActions({ orderId, status }: { orderId: string; status: string }) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function run(action: string) {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action })
      });
      const data = await res.json();
      setMsg(data.ok ? `${action} ok` : data.error);
      if (data.ok) setTimeout(() => window.location.reload(), 700);
    } finally {
      setBusy(false);
    }
  }

  const canRetry = ["FAILED", "CANCELLED"].includes(status);
  const canCancel = ["PENDING", "PAID", "PROCESSING"].includes(status);
  const canRefund = ["PAID", "PROCESSING", "FULFILLED", "SHIPPED", "IN_TRANSIT", "DELIVERED"].includes(status);

  return (
    <div className="flex gap-2 text-xs">
      {canRetry && <button disabled={busy} className="glass px-2 py-1 rounded-lg hover:bg-white/10" onClick={() => run("retry")}>Retry</button>}
      {canCancel && <button disabled={busy} className="glass px-2 py-1 rounded-lg hover:bg-white/10" onClick={() => run("cancel")}>Cancel</button>}
      {canRefund && <button disabled={busy} className="glass px-2 py-1 rounded-lg hover:bg-white/10" onClick={() => run("refund")}>Refund</button>}
      {msg && <span className="text-white/50 self-center">{msg}</span>}
    </div>
  );
}
