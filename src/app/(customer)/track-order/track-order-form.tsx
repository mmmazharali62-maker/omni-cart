"use client";

import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { TrackingTimeline } from "@/components/tracking/tracking-timeline";

type LookupResult = {
  found: boolean;
  carrier: string;
  carrierUrl: string;
  shipment: { status: string; orderId: string; events: Array<{ status: string; location?: string | null; occurredAt: string }> } | null;
};

export function TrackOrderForm() {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<LookupResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const number = String(new FormData(e.currentTarget).get("number") ?? "").trim();
    if (!number) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`/api/tracking/${encodeURIComponent(number)}`);
      const data = await res.json();
      if (res.ok) setResult(data);
      else setError(data.error ?? "Lookup failed");
    } catch {
      setError("Network error - try again");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={onSubmit} className="flex glass rounded-lg overflow-hidden">
        <input
          name="number"
          placeholder="Tracking number, e.g. 1Z999AA10123456784"
          aria-label="Tracking number"
          className="flex-1 bg-transparent px-3 py-2 text-sm outline-none"
        />
        <button type="submit" disabled={busy} className="bg-brand-600 px-4 text-sm font-medium disabled:opacity-50 flex items-center">
          {busy ? <Spinner size={14} /> : "Track"}
        </button>
      </form>
      {error && <p className="text-sm text-red-400">{error}</p>}
      {result && (
        <div className="glass p-5">
          {result.found && result.shipment ? (
            <>
              <p className="text-sm font-medium mb-4 capitalize">{result.shipment.status.replaceAll("_", " ").toLowerCase()}</p>
              <TrackingTimeline
                events={result.shipment.events}
                carrierUrl={result.carrierUrl}
              />
            </>
          ) : (
            <p className="text-sm text-white/60">
              No shipment found for that number yet. If you just ordered, tracking can take a day to activate.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
