"use client";

import { useEffect, useState } from "react";

// Client wrapper: auto-refreshes readiness every 30s while the page is open.
export function IntegrationsClient({ children, readiness }: { children: React.ReactNode; readiness: number }) {
  const [pct, setPct] = useState(readiness);

  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const res = await fetch("/api/admin/integrations");
        if (!res.ok) return;
        const data = await res.json();
        if (typeof data.overall === "number") setPct(data.overall);
      } catch { /* offline is fine */ }
    }, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <div className="glass p-5 mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-white/50">Integration readiness</p>
          <p className="text-2xl font-semibold">{pct}%</p>
        </div>
        <div className="w-40 h-2 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full bg-brand-500 transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>
      {children}
    </div>
  );
}
