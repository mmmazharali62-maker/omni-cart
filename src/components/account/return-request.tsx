"use client";

import { useState } from "react";

export function ReturnRequestButton({ orderId, delivered }: { orderId: string; delivered: boolean }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("damaged");
  const [note, setNote] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await fetch("/api/orders/return-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, reason, note: note || undefined })
    });
    const data = await res.json();
    setBusy(false);
    setResult(res.ok ? "Request submitted - support will contact you within 24h." : data.error ?? "Failed");
  }

  return (
    <GlassPanel className="mt-6">
      {!open ? (
        <button onClick={() => setOpen(true)} className="text-sm text-white/70 hover:text-white">
          {delivered ? "Request a return or refund" : "Return / refund (available after delivery)"}
        </button>
      ) : (
        <form onSubmit={submit} className="space-y-3">
          <p className="font-medium text-sm">Return request</p>
          <select value={reason} onChange={(e) => setReason(e.target.value)} className="w-full glass bg-white/5 px-4 py-2.5 rounded-lg text-sm outline-none">
            <option value="damaged">Arrived damaged</option>
            <option value="wrong_item">Wrong item</option>
            <option value="not_as_described">Not as described</option>
            <option value="no_longer_needed">No longer needed</option>
            <option value="other">Other</option>
          </select>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Tell us more (optional)" rows={3} className="w-full glass bg-white/5 px-4 py-2.5 rounded-lg text-sm outline-none" />
          <div className="flex gap-2">
            <button disabled={busy} className="glass px-4 py-2 rounded-lg text-sm hover:bg-white/10">{busy ? "Submitting..." : "Submit"}</button>
            <button type="button" onClick={() => setOpen(false)} className="text-xs text-white/50 self-center">Cancel</button>
          </div>
        </form>
      )}
      {result && <p className="text-xs text-white/60 mt-3">{result}</p>}
    </GlassPanel>
  );
}
