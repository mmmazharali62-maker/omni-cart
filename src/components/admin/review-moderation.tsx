"use client";

import { useState } from "react";

export function ReviewModerationButtons({ reviewId }: { reviewId: string }) {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  async function decide(decision: "approve" | "hide" | "delete") {
    setBusy(true);
    const res = await fetch(`/api/admin/reviews/${reviewId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision })
    });
    setBusy(false);
    if (res.ok) {
      setDone(decision);
      setTimeout(() => window.location.reload(), 500);
    }
  }

  if (done) return <p className="text-xs text-white/50">{done} ✓</p>;

  return (
    <div className="flex gap-2 text-xs">
      <button disabled={busy} onClick={() => decide("approve")} className="glass px-3 py-1.5 rounded-lg hover:bg-white/10">Approve</button>
      <button disabled={busy} onClick={() => decide("hide")} className="glass px-3 py-1.5 rounded-lg hover:bg-white/10">Hide</button>
      <button disabled={busy} onClick={() => decide("delete")} className="glass px-3 py-1.5 rounded-lg hover:bg-white/10 text-red-300">Delete</button>
    </div>
  );
}
