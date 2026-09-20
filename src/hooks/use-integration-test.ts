"use client";

import { useState } from "react";

// One-shot test-connection runner with loading + result state.
export function useIntegrationTest() {
  const [testing, setTesting] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, { ok: boolean; message: string }>>({});

  async function test(provider: string) {
    setTesting(provider);
    try {
      const res = await fetch("/api/admin/integrations/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider })
      });
      const data = await res.json().catch(() => ({ ok: false, message: "No response" }));
      setResults((r) => ({ ...r, [provider]: { ok: res.ok && data.ok !== false, message: data.message ?? data.error ?? "Done" } }));
    } catch {
      setResults((r) => ({ ...r, [provider]: { ok: false, message: "Request failed" } }));
    } finally {
      setTesting(null);
    }
  }

  return { testing, results, test };
}
