"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export type FraudRow = {
  id: string; orderId: string; score: number; action: string; status: string;
  flags: string[]; createdAt: string;
};

// Admin fraud review queue (spec section 17/26).
export function FraudQueue({ rows }: { rows: FraudRow[] }) {
  const [local, setLocal] = useState(rows);

  async function decide(id: string, status: "cleared" | "cancelled") {
    setLocal((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
    await fetch(`/api/admin/fraud-queue`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ flagId: id, status })
    }).catch(() => {});
  }

  return (
    <ul className="space-y-3">
      {local.map((r) => (
        <li key={r.id} className="glass p-4 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-white/50">order {r.orderId.slice(0, 8)}</span>
              <Badge variant={r.action === "hold" ? "danger" : r.action === "review" ? "neutral" : "success"}>{r.action}</Badge>
            </div>
            <p className="text-xs text-white/40 mt-1">Score {r.score} - {r.flags.join(", ")}</p>
          </div>
          {r.status === "open" ? (
            <div className="flex gap-2 shrink-0">
              <button onClick={() => decide(r.id, "cleared")} className="bg-emerald-600/80 text-white px-3 py-1.5 rounded-lg text-xs font-medium">
                Clear
              </button>
              <button onClick={() => decide(r.id, "cancelled")} className="glass px-3 py-1.5 rounded-lg text-xs text-red-300 hover:bg-red-500/10">
                Cancel order
              </button>
            </div>
          ) : (
            <Badge variant="neutral">{r.status}</Badge>
          )}
        </li>
      ))}
    </ul>
  );
}
