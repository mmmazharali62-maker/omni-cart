import Link from "next/link";
import { GO_LIVE_STEPS, SETUP_ORDER } from "@/lib/integrations/defaults";
import type { ProviderStatus } from "@/lib/integrations/types";

// Ordered setup checklist + go-live path, driven by live readiness.
export function SetupChecklist({ statuses }: { statuses: ProviderStatus[] }) {
  const byProvider = new Map(statuses.map((s) => [s.provider, s]));

  return (
    <div className="glass p-5">
      <h2 className="font-semibold mb-4">Setup checklist</h2>
      <ol className="space-y-2">
        {SETUP_ORDER.map((item, i) => {
          const status = byProvider.get(item.provider);
          const done = status?.ready ?? false;
          return (
            <li key={item.provider} className="flex items-start gap-3 text-sm">
              <span className={done ? "text-emerald-400" : "text-white/30"}>{done ? "✓" : i + 1}.</span>
              <div>
                <Link href={`/admin/integrations/${item.provider}`} className={done ? "text-white/50 line-through" : "hover:text-brand-400"}>
                  {status?.label ?? item.provider}
                </Link>
                <p className="text-xs text-white/40">{item.why}</p>
              </div>
            </li>
          );
        })}
      </ol>
      <div className="mt-5 pt-4 border-t border-white/10">
        <p className="text-xs text-white/50 uppercase tracking-wide mb-2">Go-live path</p>
        <ol className="text-xs text-white/60 space-y-1 list-decimal list-inside">
          {GO_LIVE_STEPS.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}
