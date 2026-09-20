"use client";

import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

// Fires the provider's test-connection endpoint and shows the verdict inline.
export function TestConnectionButton({ provider }: { provider: string }) {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  async function run() {
    setBusy(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin/integrations/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider })
      });
      const data = await res.json().catch(() => ({ ok: false, message: "No response" }));
      setResult({ ok: res.ok && data.ok !== false, message: data.message ?? data.error ?? "Done" });
    } catch {
      setResult({ ok: false, message: "Request failed" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <button
        onClick={run}
        disabled={busy}
        className="glass px-3 py-1.5 rounded-lg text-sm hover:bg-white/10 disabled:opacity-50 flex items-center gap-2"
      >
        {busy && <Spinner size={14} />} {busy ? "Testing..." : "Test connection"}
      </button>
      {result && (
        <p className={`text-xs mt-2 ${result.ok ? "text-emerald-400" : "text-red-400"}`}>{result.message}</p>
      )}
    </div>
  );
}
