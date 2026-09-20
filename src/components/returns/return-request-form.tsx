"use client";

import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { RETURN_REASONS } from "@/lib/returns/reasons";

// Customer-facing return request form (spec section 29).
export function ReturnRequestForm({
  orderItems,
  orderId
}: {
  orderItems: Array<{ orderItemId: string; title: string; quantity: number }>;
  orderId: string;
}) {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const selected: string[] = form.getAll("items") as string[];
    if (selected.length === 0) {
      setError("Select at least one item to return");
      setBusy(false);
      return;
    }
    try {
      const res = await fetch("/api/returns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          email: form.get("email"),
          reason: form.get("reason"),
          note: form.get("note"),
          itemIds: selected
        })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) setDone(data.id ?? "requested");
      else setError(data.error ?? "Could not submit the request");
    } catch {
      setError("Network error - try again");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="glass p-5 text-sm space-y-2">
        <p className="text-emerald-300 font-medium">Return requested ✓</p>
        <p className="text-white/60">Reference: <code className="font-mono">{done}</code>. We'll email you within 24 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="glass p-5 space-y-4">
      <fieldset>
        <legend className="text-sm font-medium mb-2">Which items?</legend>
        <ul className="space-y-2">
          {orderItems.map((i) => (
            <li key={i.orderItemId} className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="items" value={i.orderItemId} id={`item-${i.orderItemId}`} />
              <label htmlFor={`item-${i.orderItemId}`}>{i.title}</label>
            </li>
          ))}
        </ul>
      </fieldset>
      <label className="block">
        <span className="text-sm text-white/70">Email</span>
        <input name="email" type="email" required className="mt-1 w-full glass bg-white/5 px-3 py-2 rounded-lg text-sm outline-none" />
      </label>
      <label className="block">
        <span className="text-sm text-white/70">Reason</span>
        <select name="reason" required className="mt-1 w-full glass bg-white/5 px-3 py-2 rounded-lg text-sm outline-none">
          {RETURN_REASONS.map((r) => (
            <option key={r.code} value={r.code}>{r.label}</option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-sm text-white/70">Details (optional)</span>
        <textarea name="note" rows={3} maxLength={1000} className="mt-1 w-full glass bg-white/5 px-3 py-2 rounded-lg text-sm outline-none" />
      </label>
      {error && <p className="text-xs text-red-400">{error}</p>}
      <button type="submit" disabled={busy}
        className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 flex items-center gap-2">
        {busy && <Spinner size={14} />} Request return
      </button>
    </form>
  );
}
