"use client";

import { useEffect, useState } from "react";

// Poll the integrations status board (masked values only, never secrets).
export function useIntegrationStatus(refreshMs = 30000) {
  const [statuses, setStatuses] = useState<Array<{ provider: string; label: string; ready: boolean; missing: string[] }>>([]);
  const [overall, setOverall] = useState(0);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch("/api/admin/integrations");
        if (!res.ok || !mounted) return;
        const data = await res.json();
        setStatuses(data.providers ?? []);
        setOverall(data.overall ?? 0);
      } catch { /* ignore */ }
    }
    load();
    const id = setInterval(load, refreshMs);
    return () => { mounted = false; clearInterval(id); };
  }, [refreshMs]);

  return { statuses, overall };
}
