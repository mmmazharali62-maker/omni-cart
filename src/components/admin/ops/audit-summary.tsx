import { GlassPanel } from "@/components/ui/glass-panel";
import { actionBreakdown, failedActionRate, suspiciousActors, type AuditEntry } from "@/lib/audit-summary";

// Audit summary cards (spec section 17/26).
export function AuditSummary({ entries }: { entries: AuditEntry[] }) {
  const breakdown = actionBreakdown(entries).slice(0, 8);
  const failureRate = failedActionRate(entries);
  const suspicious = suspiciousActors(entries);

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <GlassPanel className="p-5">
        <p className="text-sm text-white/50">Top actions</p>
        <ul className="mt-3 space-y-1 text-sm">
          {breakdown.map((b) => (
            <li key={b.action} className="flex justify-between">
              <span className="text-white/70 truncate">{b.action}</span>
              <span className="font-medium">{b.count}</span>
            </li>
          ))}
          {breakdown.length === 0 && <li className="text-white/40">No entries</li>}
        </ul>
      </GlassPanel>
      <GlassPanel className="p-5">
        <p className="text-sm text-white/50">Failure rate</p>
        <p className={`text-3xl font-semibold mt-2 ${failureRate > 5 ? "text-red-400" : "text-emerald-400"}`}>
          {failureRate}%
        </p>
        <p className="text-xs text-white/40 mt-1">{entries.length} entries analyzed</p>
      </GlassPanel>
      <GlassPanel className="p-5">
        <p className="text-sm text-white/50">Suspicious actors</p>
        {suspicious.length === 0 ? (
          <p className="text-sm text-emerald-400 mt-2">None detected</p>
        ) : (
          <ul className="mt-2 text-sm space-y-1">
            {suspicious.map((a) => (
              <li key={a} className="font-mono text-xs text-amber-300">{a.slice(0, 12)}</li>
            ))}
          </ul>
        )}
      </GlassPanel>
    </div>
  );
}
