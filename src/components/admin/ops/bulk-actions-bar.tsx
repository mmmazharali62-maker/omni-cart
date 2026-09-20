"use client";

import { useState } from "react";
import { BULK_COMMANDS } from "@/lib/bulk-actions";

// Bulk actions bar for the products table (spec section 14).
export function BulkActionsBar({ selectedIds }: { selectedIds: string[] }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function run(command: string) {
    if (selectedIds.length === 0) return;
    if (command === "delete" && !confirm(`Delete ${selectedIds.length} product(s)? This cannot be undone.`)) return;
    if (command === "adjust-price" && !prompt("Adjust price by % (e.g. 5 or -10):")) return;

    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command, productIds: selectedIds })
      });
      const data = await res.json().catch(() => ({}));
      setMessage(res.ok ? data.message ?? "Done" : data.error ?? "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-white/50">{selectedIds.length} selected</span>
      {BULK_COMMANDS.map((c) => (
        <button
          key={c}
          onClick={() => run(c)}
          disabled={busy || selectedIds.length === 0}
          className={`glass px-3 py-1.5 rounded-lg text-xs disabled:opacity-40 hover:bg-white/10 ${c === "delete" ? "text-red-300" : ""}`}
        >
          {c.replaceAll("-", " ")}
        </button>
      ))}
      {message && <span className="text-xs text-white/60">{message}</span>}
    </div>
  );
}
