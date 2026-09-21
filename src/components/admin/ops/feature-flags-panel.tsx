"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import type { Flag } from "@/lib/feature-flags";

// Feature flag toggles (spec section 26): instant kill switches.
export function FeatureFlagsPanel({ initialFlags }: { initialFlags: Flag[] }) {
  const [flags, setFlags] = useState(initialFlags);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  async function toggle(flag: Flag) {
    setBusyKey(flag.key);
    const next = !flag.enabled;
    setFlags((fs) => fs.map((f) => (f.key === flag.key ? { ...f, enabled: next } : f)));
    try {
      await fetch("/api/admin/feature-flags", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: flag.key, enabled: next })
      });
    } catch {
      setFlags((fs) => fs.map((f) => (f.key === flag.key ? { ...f, enabled: !next } : f))); // rollback
    } finally {
      setBusyKey(null);
    }
  }

  return (
    <ul className="space-y-3">
      {flags.map((f) => (
        <li key={f.key} className="glass p-4 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <code className="font-mono text-sm">{f.key}</code>
              <Badge variant={f.enabled ? "success" : "neutral"}>{f.enabled ? "on" : "off"}</Badge>
            </div>
            <p className="text-xs text-white/50 mt-1">
              {f.description} - rollout {f.rolloutPct}% - audience: {f.audience}
            </p>
          </div>
          <button
            onClick={() => toggle(f)}
            disabled={busyKey === f.key}
            className={`px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 ${f.enabled ? "glass text-red-300" : "bg-brand-600 text-white"}`}
          >
            {f.enabled ? "Disable" : "Enable"}
          </button>
        </li>
      ))}
    </ul>
  );
}
